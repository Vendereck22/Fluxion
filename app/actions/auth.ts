"use server";

import { cookies } from "next/headers";
import crypto from "crypto";
import path from "path";
import {
  readJsonPreferFallback,
  tmpDataPath,
  writeJsonWithFallback,
} from "@/lib/server/json-store";
import { logAuditEvent } from "@/app/actions/audit";

const ADMIN_EMAIL = process.env.FLUXION_ADMIN_EMAIL ?? "admin@fluxion.cd";
const ADMIN_PASSWORD = process.env.FLUXION_ADMIN_PASSWORD ?? "fluxion2026";

const USERS_PATH = path.join(process.cwd(), "constants", "users.json");
const USERS_FALLBACK_PATH = tmpDataPath("users.json");

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  middleName?: string; // post-nom
  lastName?: string;
  role: string;
  salt: string;
  passwordHash: string;
  createdAt: string;
  avatarUrl?: string;
}

export async function getUsersList(): Promise<UserAccount[]> {
  try {
    const list = await readJsonPreferFallback<UserAccount[]>(
      USERS_PATH,
      USERS_FALLBACK_PATH,
      []
    );
    return list;
  } catch (error) {
    console.error("Failed to read users.json:", error);
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

    const users = await getUsersList();
    const exists = users.some((u) => u.email.toLowerCase() === email);
    if (exists || email === ADMIN_EMAIL.toLowerCase()) {
      return { success: false, error: "Un utilisateur avec cet email existe déjà." };
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

    const newUser: UserAccount = {
      id: Date.now().toString(),
      email,
      name,
      role,
      salt,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeJsonWithFallback(USERS_PATH, USERS_FALLBACK_PATH, users);

    await logAuditEvent("USER_CREATE", `Création du compte administrateur: ${email}`, `Nom: ${name}, Rôle: ${role}`);

    return { success: true };
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

    const users = await getUsersList();
    const targetUser = users.find((u) => u.id === id);
    const userDesc = targetUser ? `${targetUser.email} (${targetUser.name})` : `ID: ${id}`;

    const updated = users.filter((u) => u.id !== id);
    await writeJsonWithFallback(USERS_PATH, USERS_FALLBACK_PATH, updated);

    await logAuditEvent("USER_DELETE", `Suppression du compte administrateur: ${userDesc}`, `ID: ${id}`);

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

  let matchedUser = null;

  try {
    const users = await getUsersList();
    const user = users.find((u) => u.email.toLowerCase() === email);
    if (user) {
      if (user.salt && user.passwordHash) {
        const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, "sha512").toString("hex");
        if (hash === user.passwordHash) {
          matchedUser = {
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
            firstName: user.firstName || "",
            middleName: user.middleName || "",
            lastName: user.lastName || "",
          };
        }
      } else if (email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
        matchedUser = {
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          firstName: user.firstName || "",
          middleName: user.middleName || "",
          lastName: user.lastName || "",
        };
      }
    } else if (email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      matchedUser = {
        email: ADMIN_EMAIL,
        name: "Super Administrateur",
        firstName: "",
        middleName: "",
        lastName: "",
      };
    }
  } catch (e) {
    console.error("Error fetching user list during login:", e);
  }

  if (matchedUser) {
    const cookieStore = await cookies();
    cookieStore.set("fluxion_session", "active", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    cookieStore.set("fluxion_user_email", matchedUser.email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    cookieStore.set("fluxion_user_name", matchedUser.name, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    if (matchedUser.avatarUrl) {
      cookieStore.set("fluxion_user_avatar", matchedUser.avatarUrl, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
    }

    if (matchedUser.firstName) {
      cookieStore.set("fluxion_user_firstname", matchedUser.firstName, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
    }
    if (matchedUser.middleName) {
      cookieStore.set("fluxion_user_middlename", matchedUser.middleName, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
    }
    if (matchedUser.lastName) {
      cookieStore.set("fluxion_user_lastname", matchedUser.lastName, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
    }

    await logAuditEvent("LOGIN", "Connexion réussie de l'administrateur", undefined, matchedUser.email);

    return { success: true };
  }

  await logAuditEvent("LOGIN", `Tentative de connexion échouée avec l'email: ${email}`, "Mot de passe incorrect ou email inconnu", email || "unknown");

  return { success: false, error: "Identifiant ou mot de passe incorrect." };
}

export async function logout() {
  const cookieStore = await cookies();
  const email = cookieStore.get("fluxion_user_email")?.value;

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
  const cookieStore = await cookies();
  const session = cookieStore.get("fluxion_session");
  return session?.value === "active";
}

export async function getCurrentUser() {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) return null;

    const cookieStore = await cookies();
    const email = cookieStore.get("fluxion_user_email")?.value;
    if (!email) return null;

    const users = await getUsersList();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return {
        id: "super-admin",
        email: ADMIN_EMAIL,
        name: "Super Administrateur",
        firstName: "",
        middleName: "",
        lastName: "",
        role: "super_admin",
        avatarUrl: "",
      };
    }

    if (user) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
        role: user.role,
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

    const cookieStore = await cookies();
    const email = cookieStore.get("fluxion_user_email")?.value;
    if (!email) {
      return { success: false, error: "Utilisateur non trouvé." };
    }

    const users = await getUsersList();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      user = {
        id: "super-admin",
        email: ADMIN_EMAIL,
        name: "Super Administrateur",
        role: "super_admin",
        salt: "",
        passwordHash: "",
        createdAt: new Date().toISOString(),
      };
      users.push(user);
    }

    if (!user) {
      return { success: false, error: "Utilisateur introuvable." };
    }

    if (newPassword) {
      if (!currentPassword) {
        return { success: false, error: "Le mot de passe actuel est requis." };
      }

      let currentHashValid = false;
      if (user.salt === "" && user.passwordHash === "") {
        currentHashValid = currentPassword === ADMIN_PASSWORD;
      } else {
        const currentHash = crypto.pbkdf2Sync(currentPassword, user.salt, 1000, 64, "sha512").toString("hex");
        currentHashValid = currentHash === user.passwordHash;
      }

      if (!currentHashValid) {
        return { success: false, error: "Le mot de passe actuel est incorrect." };
      }

      const salt = crypto.randomBytes(16).toString("hex");
      const passwordHash = crypto.pbkdf2Sync(newPassword, salt, 1000, 64, "sha512").toString("hex");
      user.salt = salt;
      user.passwordHash = passwordHash;
    }

    user.name = name.trim();
    if (firstName !== undefined) user.firstName = firstName.trim();
    if (middleName !== undefined) user.middleName = middleName.trim();
    if (lastName !== undefined) user.lastName = lastName.trim();
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    // Update email if provided and changed
    const emailChanged = newEmail && newEmail.trim().toLowerCase() !== email.toLowerCase();
    if (emailChanged) {
      const conflict = users.some(
        (u) => u.id !== user!.id && u.email.toLowerCase() === newEmail!.trim().toLowerCase()
      );
      if (conflict) {
        return { success: false, error: "Cet email est déjà utilisé par un autre compte." };
      }
      user.email = newEmail!.trim().toLowerCase();
    }

    await writeJsonWithFallback(USERS_PATH, USERS_FALLBACK_PATH, users);

    const cookieEmail = emailChanged ? user.email : email;
    cookieStore.set("fluxion_user_email", cookieEmail, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    cookieStore.set("fluxion_user_name", user.name, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    if (user.avatarUrl) {
      cookieStore.set("fluxion_user_avatar", user.avatarUrl, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
    }

    if (user.firstName) {
      cookieStore.set("fluxion_user_firstname", user.firstName, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
    } else {
      cookieStore.delete("fluxion_user_firstname");
    }
    if (user.middleName) {
      cookieStore.set("fluxion_user_middlename", user.middleName, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
    } else {
      cookieStore.delete("fluxion_user_middlename");
    }
    if (user.lastName) {
      cookieStore.set("fluxion_user_lastname", user.lastName, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
    } else {
      cookieStore.delete("fluxion_user_lastname");
    }

    await logAuditEvent(
      "CMS_UPDATE",
      `Mise à jour du profil de: ${email}`,
      `Nom: ${user.name}${
        emailChanged ? `, Nouvel email: ${user.email}` : ""
      }`
    );

    return { success: true, newEmail: emailChanged ? user.email : undefined };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Erreur lors de la mise à jour." };
  }
}