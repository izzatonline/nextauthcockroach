import { prisma } from "@/app/lib/prisma";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "hello@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user) {
                    return null;
                }

                const isPasswordValid = await compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    randomKey: "random key user",
                };
                // compare user paosswrod from input
                // with the passwrod stored in database
                // Add logic here to look up the user from the credentials supplied
                // const user = {
                //     id: "1",
                //     name: "J Smith",
                //     email: "jsmith@example.com",
                // };

                // if (user) {
                //     // Any object returned will be saved in `user` property of the JWT
                //     return user;
                // } else {
                //     // If you return null then an error will be displayed advising the user to check their details.
                //     return null;

                //     // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                // }
            },
        }),
    ],
    callbacks: {
        session: ({ session, token }) => {
            console.log("Session Callback: ", { session, token });
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    randomKey: token.randomKey,
                },
            };
        },
        jwt: ({ token, user }) => {
            console.log("JWT CALLBACK: ", { token, user });
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    randomKey: "random key user",
                };
            }
            return token;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// export default NextAuth(authOptions);
