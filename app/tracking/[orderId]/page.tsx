import { Suspense } from "react";
import { TrackingContent } from "@/components/tracking-content";

type Props = { params: Promise<{ orderId: string }> };

export default async function TrackingPage({ params }: Props) {
  const { orderId } = await params;
  return (
    <Suspense fallback={<div className="mx-auto max-w-lg px-4 py-16 text-center text-text/70">Loading...</div>}>
      <TrackingContent orderId={orderId} />
    </Suspense>
  );
}
