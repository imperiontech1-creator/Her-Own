import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { QuizContent } from "@/components/quiz-content";

export const metadata = {
  title: "Find Your Match | Her Own",
  description: "Quick quiz to find the right product for you.",
};

export default function QuizPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-24">
        <QuizContent />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
