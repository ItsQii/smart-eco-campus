// middleware.ts (atau src/middleware.ts)
export { default } from "next-auth/middleware";

// Tentukan rute mana saja yang ingin diproteksi
export const config = {
  // Melindungi /dashboard dan semua sub-rutenya (misal: /dashboard/settings)
  matcher: ["/dashboard/:path*", "/dashboard"],
};