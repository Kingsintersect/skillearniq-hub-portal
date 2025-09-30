import NextAuth, { User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { signInFormData, signInSchema } from "./schema/auth-schema"
import { authApi } from "./lib/services/auth"
import { UserInterface } from "./types/global"

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    await signInSchema.parseAsync(credentials)
                    const response = await authApi.login(credentials as signInFormData)

                    if (!response.status) {
                        console.error('Signin Failed Response', response)
                        throw new Error(response.message || "Login failed");
                    }

                    const { token, user, expires_in } = response.data;

                    if (token) {
                        return {
                            ...user,
                            id: String(user.id),
                            access_token: token,
                            expires_in: expires_in ?? 86400,
                        } as unknown as User;
                    }

                    return null;
                } catch (error) {
                    console.error('Auth error:', error)
                    return null
                }
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user as UserInterface
                token.access_token = user.access_token
                token.expires_in = user.expires_in
            }
            return token
        },
        async session({ session, token }) {
            if (token?.user) {
                session.user = {
                    ...(token.user as UserInterface),
                    access_token: token.access_token as string,
                    expires_in: token.expires_in as number,
                    emailVerified: null,
                };
            }
            return session;
        }
    },

    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    }
})