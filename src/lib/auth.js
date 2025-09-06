import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { user as User } from "@/models/user";
import { discordRegistrationNotification } from "@/utils/discordNotifications";
import { welcomeEmail } from "@/utils/emailNotifications";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await mongoose.connect(process.env.MONGO_URI);
          const user = await User.findOne({ email: credentials.email.toLowerCase() });
          
          if (!user || !user.password) {
            return null;
          }
          
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            return null;
          }

          // Update last login
          await User.findByIdAndUpdate(user._id, {
            lastLoginAt: new Date(),
            isNewUser: false
          });
          
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image || null,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await mongoose.connect(process.env.MONGO_URI);
        
        if (account.provider === "google") {
          const existingUser = await User.findOne({ 
            email: user.email.toLowerCase() 
          });
          
          if (!existingUser) {
            // Create new Google user
            const dbUser = await User.create({
              name: user.name,
              email: user.email.toLowerCase(),
              image: user.image,
              provider: 'google',
              googleId: account.providerAccountId,
              subscriptionStatus: 'basic',
              lastLoginAt: new Date(),
              isNewUser: true
            });

            await discordRegistrationNotification({
              email: user.email,
              name: user.name,
              provider: 'google',
              timestamp: new Date(),
              isNewUser: true,
              subscriptionStatus: dbUser.subscriptionStatus
            });

            await welcomeEmail({
              email: user.email,
              name: user.name,
              provider: 'google'
            });

          } else {
            // Update existing user
            await User.findByIdAndUpdate(
              existingUser._id,
              { 
                name: user.name,
                image: user.image,
                googleId: account.providerAccountId,
                lastLoginAt: new Date(),
                isNewUser: false
              }
            );
          }
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      
      // Fetch fresh user data from database on each token refresh
      if (token.email) {
        try {
          await mongoose.connect(process.env.MONGO_URI);
          const dbUser = await User.findOne({ 
            email: token.email.toLowerCase() 
          }).select('name image subscriptionStatus');
          
          if (dbUser) {
            token.image = dbUser.image;
            token.name = dbUser.name;
            token.subscriptionStatus = dbUser.subscriptionStatus;
          }
        } catch (error) {
          console.error("Error fetching user data in JWT callback:", error);
        }
      }
      
      return token;
    },

    async session({ session, token }) {
      // Pass token data to session
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user.subscriptionStatus = token.subscriptionStatus;
      }
      return session;
    },
  },

  // events: {
  //   async signIn({ user, account, profile, isNewUser }) {
  //     // Additional event handling if needed
  //     // console.log(`User ${user.email} signed in with ${account.provider}`);
  //   }
  // }
};


export default async function auth(req, res) {
  return await NextAuth(req, res, authOptions);
}