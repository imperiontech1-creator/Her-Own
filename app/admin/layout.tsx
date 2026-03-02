import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron-admin",
  display: "swap",
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={orbitron.className}>{children}</div>;
}
