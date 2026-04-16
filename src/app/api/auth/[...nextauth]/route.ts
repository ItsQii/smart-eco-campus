// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        
        // --- Contoh statis (Hapus ini jika pakai database sungguhan) ---
        if (credentials?.email === "admin1@gmail.com" && credentials?.password === "admin123") {
          return { id: "1", name: "Admin", email: "admin1@gmail.com" };
        }
        // ---------------------------------------------------------------
        
        // Jika gagal login:
        return null; 
      }
    })
  ],
  pages: {
    signIn: '/admin/login', // Arahkan ke halaman page.tsx login kamu
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };