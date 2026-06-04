"use server";

import { cookies } from "next/headers";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminRole, type AdminUser } from "@/lib/generated/prisma/client";
import { hashPassword, verifyPassword } from "@/lib/server/password";
import { logAuditEvent } from "@/app/actions/audit";

const ADMIN_EMAIL = process.env.FLUXION_ADMIN_EMAIL ?? "admin@fluxion.cd";
const ADMIN_PASSWORD = process.env.FLUXION_ADMIN_PASSWORD ?? "fluxion2026";

const COOKIE_MAX_AGE = 60 * 60 * 24;

type LoginUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  role?: string | null;
};

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  role: string;
  salt: string;
  passwordHash: string;
  createdAt: string;
  avatarUrl?: string;
}

function roleFromForm(role: string): AdminRole {
  if (role === "super_admin" || role === "SUPER_ADMIN") return AdminRole.SUPER_ADMIN;
  if (role === "editor" || role === "EDITOR") return AdminRole.EDITOR;
  return AdminRole.ADMIN;
}

function roleToUi(role: AdminRole | string) {
  if (role === AdminRole.SUPER_ADMIN || role === "SUPER_ADMIN") return "super_admin";
  if (role === AdminRole.EDITOR || role === "EDITOR") return "editor";
  return "admin";
}

function mapDbUser(user: AdminUser): UserAccount {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    firstName: user.firstName ?? "",
    middleName: user.middleName ?? "",
    lastName: user.lastName ?? "",
    role: roleToUi(user.role),
    salt: user.salt ?? "",
    passwordHash: user.passwordHash ?? "",
    createdAt: user.createdAt.toISOString(),
    avatarUrl: user.avatarUrl ?? "",
  };
}

async function setLegacyUserCookies(user: LoginUser) {
  const cookieStore = await cookies();
  const cookieOptions = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  };

  cookieStore.set("fluxion_session", "active", {
    ...cookieOptions,
    httpOnly: true,
  });
  cookieStore.set("fluxion_user_email", user.email, {
    ...cookieOptions,
    httpOnly: false,
  });
  cookieStore.set("fluxion_user_name", user.name, {
    ...cookieOptions,
    httpOnly: false,
  });

  const optionalCookies = [
    ["fluxion_user_avatar", user.avatarUrl],
    ["fluxion_user_firstname", user.firstName],
    ["fluxion_user_middlename", user.middleName],
    ["fluxion_user_lastname", user.lastName],
  ] as const;

  for (const [key, value] of optionalCookies) {
    if (value) {
      cookieStore.set(key, value, { ...cookieOptions, httpOnly: false });
    } else {
      cookieStore.delete(key);
    }
  }
}

async function getSessionEmail() {
  const authSession = await auth();
  if (authSession?.user?.email) return authSession.user.email;

  const cookieStore = await cookies();
  return cookieStore.get("fluxion_user_email")?.value ?? null;
}

export async function getUsersList(): Promise<UserAccount[]> {
  try {
    const users = await prisma.adminUser.findMany({
      where: { deletedAt: null },
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    });

    return users.map(mapDbUser);
  } catch (error) {
    console.error("Failed to read admin users from Prisma:", error);
    return [];
  }
}

export async function createUserAction(formData: FormData) {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) {
      return { success: false, error: "Non autorisé." };
    }

    const email = typeof formData.get("email") === "string" ? (formData.get("email") as string).trim().toLowerCase() : "";
    const name = typeof formData.get("name") === "string" ? (formData.get("name") as string).trim() : "";
    const password = typeof formData.get("password") === "string" ? (formData.get("password") as string) : "";
    const role = typeof formData.get("role") === "string" ? (formData.get("role") as string).trim() : "admin";

    if (!email || !name || !password) {
      return { success: false, error: "Tous les champs sont obligatoires." };
    }

    const exists = await prisma.adminUser.findUnique({ where: { email } });
    if (exists && !exists.deletedAt) {
      return { success: false, error: "Un utilisateur avec cet email existe déjà." };
    }

    const passwordHash = await hashPassword(password);
    const savedUser = exists
      ? await prisma.adminUser.update({
          where: { id: exists.id },
          data: {
            name,
            role: roleFromForm(role),
            salt: "bcrypt",
            passwordHash,
            deletedAt: null,
          },
        })
      : await prisma.adminUser.create({
          data: {
            email,
            name,
            role: roleFromForm(role),
            salt: "bcrypt",
            passwordHash,
          },
        });

    await logAuditEvent("USER_CREATE", `Création du compte administrateur: ${email}`, `Nom: ${name}, Rôle: ${role}`);

    return { success: true, user: mapDbUser(savedUser) };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { success: false, error: "Erreur lors de la création du compte." };
  }
}

export async function deleteUserAction(id: string) {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) {
      return { success: false, error: "Non autorisé." };
    }

    const currentEmail = await getSessionEmail();
    const targetUser = await prisma.adminUser.findUnique({ where: { id } });
    if (!targetUser || targetUser.deletedAt) {
      return { success: false, error: "Utilisateur introuvable." };
    }

    if (currentEmail?.toLowerCase() === targetUser.email.toLowerCase()) {
      return { success: false, error: "Vous ne pouvez pas supprimer votre propre compte." };
    }

    const activeAdmins = await prisma.adminUser.count({ where: { deletedAt: null } });
    if (activeAdmins <= 1) {
      return { success: false, error: "Impossible de supprimer le dernier administrateur actif." };
    }

    await prisma.adminUser.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await logAuditEvent("USER_DELETE", `Suppression du compte administrateur: ${targetUser.email} (${targetUser.name})`, `ID: ${id}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Erreur lors de la suppression." };
  }
}

export async function login(formData: FormData) {
  const emailRaw = formData.get("email");
  const passwordRaw = formData.get("password");
  const email = typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";
  const password = typeof passwordRaw === "string" ? passwordRaw : "";

  let matchedUser: LoginUser | null = null;

  try {
    const dbUser = await prisma.adminUser.findUnique({ where: { email } });

    if (dbUser?.passwordHash && !dbUser.deletedAt) {
      const isValidPassword = await verifyPassword(password, {
        hash: dbUser.passwordHash,
        salt: dbUser.salt,
      });

      if (isValidPassword) {
        matchedUser = dbUser;
      }
    }

    if (!matchedUser && email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      matchedUser = {
        id: "env-super-admin",
        email: ADMIN_EMAIL,
        name: "Fluxion Admin",
        role: "super_admin",
      };
    }
  } catch (e) {
    console.error("Error fetching admin user during login:", e);
  }

  if (matchedUser) {
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        console.warn("Auth.js sign-in skipped:", error.type);
      } else {
        console.warn("Auth.js sign-in skipped:", error);
      }
    }

    await setLegacyUserCookies(matchedUser);
    await logAuditEvent("LOGIN", "Connexion réussie de l'administrateur", undefined, matchedUser.email);

    return { success: true };
  }

  await logAuditEvent("LOGIN", `Tentative de connexion échouée avec l'email: ${email}`, "Mot de passe incorrect ou email inconnu", email || "unknown");

  return { success: false, error: "Identifiant ou mot de passe incorrect." };
}

export async function logout() {
  const cookieStore = await cookies();
  const email = cookieStore.get("fluxion_user_email")?.value;

  try {
    await signOut({ redirect: false });
  } catch (error) {
    console.warn("Auth.js sign-out skipped:", error);
  }

  cookieStore.delete("fluxion_session");
  cookieStore.delete("fluxion_user_email");
  cookieStore.delete("fluxion_user_name");
  cookieStore.delete("fluxion_user_avatar");
  cookieStore.delete("fluxion_user_firstname");
  cookieStore.delete("fluxion_user_middlename");
  cookieStore.delete("fluxion_user_lastname");

  await logAuditEvent("LOGOUT", "Déconnexion de l'administrateur", undefined, email);

  return { success: true };
}

export async function verifySession() {
  const authSession = await auth();
  if (authSession?.user?.email) return true;

  const cookieStore = await cookies();
  const legacySession = cookieStore.get("fluxion_session");
  return legacySession?.value === "active";
}

export async function getCurrentUser() {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) return null;

    const email = await getSessionEmail();
    if (!email) return null;

    const user = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });

    if (!user && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return {
        id: "env-super-admin",
        email: ADMIN_EMAIL,
        name: "Fluxion Admin",
        firstName: "",
        middleName: "",
        lastName: "",
        role: "super_admin",
        avatarUrl: "",
      };
    }

    if (user && !user.deletedAt) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
        role: roleToUi(user.role),
        avatarUrl: user.avatarUrl || "",
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

export async function updateProfile({
  name,
  firstName,
  middleName,
  lastName,
  newEmail,
  avatarUrl,
  currentPassword,
  newPassword,
}: {
  name: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  newEmail?: string;
  avatarUrl?: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) {
      return { success: false, error: "Non autorisé." };
    }

    const email = await getSessionEmail();
    if (!email) {
      return { success: false, error: "Utilisateur non trouvé." };
    }

    let user = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });

    if (!user && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      const passwordHash = await hashPassword(ADMIN_PASSWORD);
      user = await prisma.adminUser.create({
        data: {
          email: ADMIN_EMAIL.toLowerCase(),
          name: "Fluxion Admin",
          role: AdminRole.SUPER_ADMIN,
          salt: "bcrypt",
          passwordHash,
        },
      });
    }

    if (!user || user.deletedAt) {
      return { success: false, error: "Utilisateur introuvable." };
    }

    const updateData: Partial<AdminUser> = {
      name: name.trim(),
      firstName: firstName?.trim() ?? "",
      middleName: middleName?.trim() ?? "",
      lastName: lastName?.trim() ?? "",
      avatarUrl: avatarUrl ?? user.avatarUrl,
    };

    if (newPassword) {
      if (!currentPassword) {
        return { success: false, error: "Le mot de passe actuel est requis." };
      }

      const currentHashValid = await verifyPassword(currentPassword, {
        hash: user.passwordHash,
        salt: user.salt,
      });

      if (!currentHashValid) {
        return { success: false, error: "Le mot de passe actuel est incorrect." };
      }

      updateData.salt = "bcrypt";
      updateData.passwordHash = await hashPassword(newPassword);
    }

    const emailChanged = newEmail && newEmail.trim().toLowerCase() !== email.toLowerCase();
    if (emailChanged) {
      const cleanEmail = newEmail.trim().toLowerCase();
      const conflict = await prisma.adminUser.findUnique({ where: { email: cleanEmail } });
      if (conflict && conflict.id !== user.id && !conflict.deletedAt) {
        return { success: false, error: "Cet email est déjà utilisé par un autre compte." };
      }
      updateData.email = cleanEmail;
    }

    const savedUser = await prisma.adminUser.update({
      where: { id: user.id },
      data: updateData,
    });

    await setLegacyUserCookies(savedUser);

    await logAuditEvent(
      "CMS_UPDATE",
      `Mise à jour du profil de: ${email}`,
      `Nom: ${savedUser.name}${emailChanged ? `, Nouvel email: ${savedUser.email}` : ""}`
    );

    return { success: true, newEmail: emailChanged ? savedUser.email : undefined };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Erreur lors de la mise à jour." };
  }
}
