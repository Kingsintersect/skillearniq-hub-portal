import NextAuth, { User } from "next-auth"
import { toRole } from "./lib/rbac"
import Credentials from "next-auth/providers/credentials"
import { signInFormData, signInSchema } from "./schema/auth-schema"
import { authApi } from "./lib/services/auth"
import { UserInterface } from "./types/global"

export const { auth, handlers, signIn, signOut } = NextAuth({
    trustHost: true,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    console.log(
                        'Authorize credentials:', credentials
                    )
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
                            // role: user.role.toUpperCase(),
                            role: toRole(user.role),
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
        }),

        // 2. Secondary Authentication Provider
        // Uses dummy data when NEXT_PUBLIC_USE_DUMMY_AUTH_DATA=true, live API otherwise.
        Credentials({
            id: "secondary-auth",
            name: "Secondary Authentication",
            credentials: {
                email: { label: "Email or Phone", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    console.log("[Secondary-Auth] Attempting login:", credentials?.email);

                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Email/phone and password are required");
                    }

                    const isDummy = process.env.NEXT_PUBLIC_USE_DUMMY_AUTH_DATA === "true";

                    let user: { id: number; first_name: string; last_name: string; email: string; role: string };
                    let access_token: string;
                    let expiresInSeconds = 86400;

                    if (isDummy) {
                        const { dummyLogin } = await import("./modules/auth/dummy-data");
                        const response = dummyLogin({
                            email_or_phone_number: credentials.email as string,
                            password: credentials.password as string,
                        });
                        if (!response.success) throw new Error("Authentication failed");
                        user = response.user;
                        access_token = response.access_token;
                    } else {
                        const apiDomain = process.env.NEXT_PUBLIC_EXTERNAL_API_DOMAIN;
                        if (!apiDomain) throw new Error("NEXT_PUBLIC_EXTERNAL_API_DOMAIN is not configured");

                        console.log("[Secondary-Auth] Sending login request to:", `${apiDomain}/api/v1/auth/login`);

                        const res = await fetch(`${apiDomain}/api/v1/auth/login`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json", Accept: "application/json" },
                            body: JSON.stringify({
                                email_or_phone_number: credentials.email,
                                password: credentials.password,
                            }),
                        });

                        if (!res.ok) {
                            const err = await res.json().catch(() => ({}));
                            throw new Error(err.message || `Login failed (${res.status})`);
                        }

                        const data = await res.json();
                        console.log("data", data);

                        // FIX: Pull directly from 'data' instead of 'data.data'
                        user = data?.user;
                        access_token = data?.access_token ?? data?.token;

                        // Fallback gracefully if expires_in_minutes is missing in this API format
                        const expiresInMinutes = data?.expires_in_minutes ?? 1440;
                        expiresInSeconds = expiresInMinutes * 60;

                        if (!access_token || !user) {
                            throw new Error(data.message || "Unexpected response from login API");
                        }
                    }

                    console.log("[Secondary-Auth] Login successful for user:", user.email);
                    return {
                        id: String(user.id),
                        email: user.email,
                        name: `${user.first_name} ${user.last_name}`,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        // role: user.role.toUpperCase(),
                        role: toRole(user.role),
                        access_token,
                        expires_in: expiresInSeconds ?? 86400,
                    } as unknown as User;

                } catch (error: any) {
                    console.error("[Secondary-Auth] Error:", error.message);
                    throw new Error(error.message || "Authentication failed");
                }
            }
        }),

        // 3. Post-Registration Session Provider
        // Called immediately after registration completes. The API already returned
        // an access_token + user, so we just establish a NextAuth session from that
        // data without making another API call.
        Credentials({
            id: "direct-login-auth",
            name: "Direct Login",
            credentials: {
                access_token: { label: "Access Token", type: "text" },
                user_id: { label: "User ID", type: "text" },
                user_email: { label: "Email", type: "text" },
                user_first_name: { label: "First Name", type: "text" },
                user_last_name: { label: "Last Name", type: "text" },
                user_role: { label: "Role", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.access_token || !credentials?.user_id) {
                    throw new Error("Invalid registration session data");
                }

                return {
                    id: credentials.user_id as string,
                    email: credentials.user_email as string,
                    name: `${credentials.user_first_name} ${credentials.user_last_name}`,
                    first_name: credentials.user_first_name as string,
                    last_name: credentials.user_last_name as string,
                    // role: (credentials.user_role as string).toUpperCase(),
                    role: toRole(credentials.user_role as string),
                    access_token: credentials.access_token as string,
                    expires_in: 86400,
                } as unknown as User;
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