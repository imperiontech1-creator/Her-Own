import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <p className="text-6xl font-bold text-rose-gold/80">404</p>
      <p className="mt-2 text-text/80">This page could not be found.</p>
      <Link href="/" className="mt-8">
        <Button>Back to Her Own</Button>
      </Link>
    </div>
  );
}
