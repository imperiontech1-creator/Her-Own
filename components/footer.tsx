import Link from "next/link";

export function Footer() {
  return (
    <footer className="safe-bottom border-t border-rose-gold/20 bg-white/60 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-center font-heading text-sm text-text/70">
          Intimate wellness, reimagined. You must be 21+ to purchase.
        </p>
        <div className="mt-4 flex justify-center gap-6">
          <Link href="/policy" className="text-sm text-rose-gold hover:underline">
            Policy & Returns
          </Link>
          <Link href="/admin" className="text-sm text-text/60 hover:underline">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
