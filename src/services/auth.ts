// services/auth.ts
import { signIn } from "next-auth/react";

export const authServices = {
  // Fungsi untuk login pakai email & password
  login: async (payload: any) => {
    try {
      const res = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false, // Penting agar tidak auto-reload halaman saat error
      });
      return res;
    } catch (error) {
      return { error: "Terjadi kesalahan sistem" };
    }
  },

  // Fungsi untuk login pakai Google/Github
  socialLogin: (provider: string, callbackUrl: string) => {
    signIn(provider, { callbackUrl });
  },
};