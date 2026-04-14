# Smart Eco-Campus

**Smart Eco-Campus Efficiency System** is a modern, IoT-integrated platform designed to optimize energy consumption and enhance sustainability across campus facilities. Built with cutting-edge technologies, it provides real-time monitoring and control of classroom environments.

---

## Key Features

- **Real-time Device Control**: Manage classroom lights, AC/Fans, and power sockets remotely.
- **Energy Monitoring**: Track power usage (Watts) across different zones to identify efficiency opportunities.
- **IoT Integration**: Seamless interaction with smart hardware for live status updates.
- **Secure Access**: Role-based authentication system built with NextAuth.
- **Modern Dashboard**: A high-performance, responsive UI optimized for both desktop and mobile monitoring.
- **Sustainability Focus**: Visual indicators and data insights to promote an eco-friendly campus culture.

---

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Build Tool**: [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack)
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## Getting Started

### Prerequisites

- Node.js 20+ 
- pnpm installed (`npm install -g pnpm`)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ItsQii/smart-eco-campus.git
   cd smart-eco-campus
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add necessary variables (see `.env.example` if available).

4. **Run the development server**:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components (Shadcn UI based).
- `src/services`: API and Authentication logic.
- `src/types`: TypeScript interfaces and types.
- `public`: Static assets and icons.

---

## License

This project is licensed under the MIT License.


