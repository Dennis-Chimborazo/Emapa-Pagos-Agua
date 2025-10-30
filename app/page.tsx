import { PaymentModule } from "@/components/payment-module"

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <PaymentModule />
      </div>
    </main>
  )
}
