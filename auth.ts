import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/server/password";

const ADMIN_EMAIL = process.env.FLUXION_ADMIN_EMAIL ?? "admin@fluxion.cd";
const ADMIN_PASSWORD = process.env.FLUXION_ADMIN_PASSWORD ?? "fluxion2026";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret:
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "fluxion-local-dev-auth-secret-change-me-before-production",
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || !password) return null;

        try {
          const dbUser = await prisma.adminUser.findUnique({
            where: { email },
          });

          if (dbUser?.passwordHash && !dbUser.deletedAt) {
            const isValid = await verifyPassword(password, {
              hash: dbUser.passwordHash,
              salt: dbUser.salt,
            });

            if (isValid) {
              await prisma.adminUser.update({
                where: { id: dbUser.id },
                data: { lastLoginAt: new Date() },
              });

              return {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name,
                image: dbUser.avatarUrl ?? undefined,
                role: dbUser.role,
              };
            }
          }
        } catch (error) {
          console.warn("Prisma auth lookup skipped:", error);
        }

        if (email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
          return {
            id: "env-super-admin",
            email: ADMIN_EMAIL,
            name: "Fluxion Admin",
            role: "SUPER_ADMIN",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "ADMIN";
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = String(token.role ?? "ADMIN");
      }

      return session;
    },
  },
});
