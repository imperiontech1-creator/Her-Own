import { Suspense } from "react";
import { RetailerOrderContent } from "@/components/retailer-order-content";

type Props = { params: Promise<{ sessionId: string }> };

export default async function RetailerOrderPage({ params }: Props) {
  const { sessionId } = await params;
  return (
    <Suspense fallback={<div className="mx-auto max-w-lg px-4 py-16 text-center text-text/70">Loading...</div>}>
      <RetailerOrderContent sessionId={sessionId} />
    </Suspense>
  );
}
