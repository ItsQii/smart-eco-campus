"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // <-- IMPORT PENTING INI DITAMBAHKAN
import { Shield, Lock, Mail, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // <-- State untuk menyimpan pesan error
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Kosongkan error setiap kali mencoba login baru

    // Memanggil sistem NextAuth yang sesungguhnya
    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false, // Jangan pindah halaman otomatis, biar kita bisa tangkap errornya
    });

    setIsLoading(false);

    if (res?.error) {
      // Jika login ditolak oleh route.ts
      setError("Email atau password tidak valid.");
    } else if (res?.ok) {
      // Jika login berhasil
      router.push("/dashboard");
      router.refresh(); // Memaksa Next.js menyadari bahwa kamu sudah login
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden">
      {/* Subtle grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.4) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(16, 185, 129, 0.4) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />

      {/* Central glow behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4 shadow-lg shadow-emerald-500/10">
            <Shield className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Smart Eco-Campus Efficiency System
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-2xl shadow-emerald-500/5">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg font-semibold text-zinc-100">
              Secure Access
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              
              {/* Notifikasi Error Muncul di Sini */}
              {error && (
                <div className="mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-center">
                  <p className="text-sm text-red-500 font-medium">{error}</p>
                </div>
              )}

              <FieldGroup>
                <Field>
                  <FieldLabel className="text-zinc-400 text-sm">
                    Email Address
                  </FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                      type="email"
                      placeholder="admin@ecocampus.io"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                      required
                    />
                  </div>
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel className="text-zinc-400 text-sm">
                      Password
                    </FieldLabel>
                    <Link 
                      href="#" 
                      className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                      required
                    />
                  </div>
                </Field>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold h-11 mt-2 transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </FieldGroup>
            </form>

            {/* Security badge */}
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-600">
                <Zap className="w-3.5 h-3.5 text-emerald-500/60" />
                <span>256-bit SSL Encrypted Connection</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer link */}
        <p className="text-center text-sm text-zinc-600 mt-6">
          Return to{" "}
          <Link 
            href="/" 
            className="text-emerald-500 hover:text-emerald-400 transition-colors font-medium"
          >
            Homepage
          </Link>
        </p>
      </div>
    </div>
  );
}