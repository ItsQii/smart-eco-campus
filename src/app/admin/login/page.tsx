"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, Zap, AlertCircle } from "lucide-react";

// Pastikan path komponen UI ini sesuai dengan foldermu
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";

// Mengambil fungsi login dari services yang sudah kita buat
import { authServices } from "@/services/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Memisahkan loading state agar spinner tidak nyala bersamaan
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  // Handler untuk Form Email & Password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoadingEmail(true);

    const payload = { email, password };

    try {
      // Memanggil fungsi login dari file services/auth.ts
      const res = await authServices.login(payload);

      if (res && !res.error) {
        setIsLoadingEmail(false);
        // Jika sukses, arahkan ke dashboard/halaman utama
        router.push(callbackUrl);
        router.refresh(); // Refresh untuk memastikan session ter-update
      } else {
        setIsLoadingEmail(false);
        setError("Email atau password salah.");
      }
    } catch (err) {
      setIsLoadingEmail(false);
      setError("Terjadi kesalahan sistem, coba lagi.");
    }
  };

  // Handler untuk Tombol Google
  const handleGoogleLogin = () => {
    setIsLoadingGoogle(true);
    setError("");
    // Memanggil fungsi socialLogin dari file services/auth.ts
    authServices.socialLogin("google", callbackUrl);
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
            {/* Notifikasi Error Muncul di Sini Jika Gagal */}
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Input Manual */}
            <form onSubmit={handleSubmit}>
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
                  disabled={isLoadingEmail || isLoadingGoogle}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold h-11 mt-2 transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                >
                  {isLoadingEmail ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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

            {/* Pemisah (Divider) */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
              </div>
            </div>

            {/* Tombol Google Terintegrasi NextAuth */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoadingEmail || isLoadingGoogle}
              variant="outline"
              className="w-full bg-zinc-950 border-zinc-800 text-zinc-100 hover:bg-zinc-800 hover:text-white transition-colors h-11"
            >
              {isLoadingGoogle ? (
                <span className="flex items-center gap-2">
                   <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Redirecting to Google...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg height="18" width="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </span>
              )}
            </Button>

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