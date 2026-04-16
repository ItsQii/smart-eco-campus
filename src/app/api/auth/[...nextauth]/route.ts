// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // DI SINI ADALAH LOGIKA LOGIN EMAIL & PASSWORD
        // Contoh: Panggil API backend kamu atau cek ke database Prisma/Mongoose
        
        // --- Contoh statis (Hapus ini jika pakai database sungguhan) ---
        if (credentials?.email === "admin@ecocampus.io" && credentials?.password === "admin123") {
          return { id: "1", name: "Admin", email: "admin@ecocampus.io" };
        }
        // ---------------------------------------------------------------
        
        // Jika gagal login:
        return null; 
      }
    })
  ],
  pages: {
    signIn: '/login', // Arahkan ke halaman page.tsx login kamu
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };