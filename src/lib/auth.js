import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/libs/mongoClient";
import bcrypt from "bcryptjs";

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
          const client = await clientPromise;
          const db = client.db();
          const user = await db.collection(process.env.MONGO_COLLECTION_1).findOne({ email: credentials.email });
          
          if (!user) {
            return null;
          }
          
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            return null;
          }
          
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
        const client = await clientPromise;
        const db = client.db();
        
        // Handle both Google and Credentials sign-in
        const existingUser = await db.collection(process.env.MONGO_COLLECTION_1).findOne({ 
          email: user.email 
        });
        
        if (account.provider === "google") {
          // Create or update Google user
          const userData = {
            name: user.name,
            email: user.email,
            image: user.image,
            subscriptionStatus: existingUser?.subscriptionStatus || 'basic',
            provider: 'google',
            updatedAt: new Date()
          };
          
          if (!existingUser) {
            userData.createdAt = new Date();
          }
          
          await db.collection(process.env.MONGO_COLLECTION_1).updateOne(
            { email: user.email },
            { $set: userData },
            { upsert: true }
          );
        }
        
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false; // Still allow sign in even if DB update fails
      }
    },
    async jwt({ token, user, account }) {
      // Include user data in JWT token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      
      // Fetch fresh user data from database on each token refresh
      if (token.email) {
        try {
          const client = await clientPromise;
          const db = client.db();
          const dbUser = await db.collection(process.env.MONGO_COLLECTION_1).findOne({ 
            email: token.email 
          });
          
          if (dbUser) {
            token.image = dbUser.image; // This ensures avatar updates are reflected
            token.name = dbUser.name;
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
      }
      return session;
    },
  },
};

export default async function auth(req, res) {
  return await NextAuth(req, res, authOptions);
}