"use server";

import { cookies } from "next/headers";

const ADMIN_EMAIL = process.env.FLUXION_ADMIN_EMAIL ?? "admin@fluxion.cd";
const ADMIN_PASSWORD = process.env.FLUXION_ADMIN_PASSWORD ?? "fluxion2026";

export async function login(formData: FormData) {
  const emailRaw = formData.get("email");
  const passwordRaw = formData.get("password");
  const email = typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";
  const password = typeof passwordRaw === "string" ? passwordRaw : "";

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("fluxion_session", "active", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return { success: true };
  }

  return { success: false, error: "Identifiant ou mot de passe incorrect." };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("fluxion_session");
  return { success: true };
}

export async function verifySession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("fluxion_session");
  return session?.value === "active";
}