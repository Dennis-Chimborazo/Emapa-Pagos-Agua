"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Droplet, CreditCard, CheckCircle2, ArrowLeft, Search, AlertCircle } from "lucide-react"

type PaymentStep = "search" | "details" | "confirm" | "success"

interface BillDetails {
  accountNumber: string
  clientName: string
  address: string
  period: string
  dueDate: string
  amount: number
  consumption: string
  status: "pending" | "overdue"
}

type DebitAccountType = "savings" | "checking"
interface DebitAccount {
  id: string
  type: DebitAccountType
  last4: string
  balance: number
  label: string
}

const NAMES = [
  "Juan Carlos Pérez Morales",
  "María Fernanda Torres Vélez",
  "José Luis Andrade Carrera",
  "Ana Gabriela Mora Hidalgo",
  "Diego Sebastián Cedeño López",
  "Luisa Valentina Cevallos Paredes",
  "Carlos Eduardo Zambrano Ruiz",
  "Sofía Belén Villacís Cabrera",
  "Edison Ramiro Sánchez Jiménez",
  "Michelle Andrea Tunja Ibarra",
]
const STREETS = [
  "Av. 6 de Diciembre",
  "Av. Amazonas",
  "Av. del Bombero",
  "Av. 9 de Octubre",
  "Av. de las Américas",
  "Av. de la Prensa",
  "Av. Pedro Vicente Maldonado",
  "Calle Sucre",
  "Calle Bolívar",
  "Calle Manta",
]
const CITIES = ["Quito", "Guayaquil", "Cuenca", "Ambato", "Manta", "Loja", "Santo Domingo"]
const PARISH = ["Centro", "La Mariscal", "La Floresta", "Urdesa", "La Garzota", "El Batán", "Miraflores"]

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function choice<T>(arr: T[]) {
  return arr[randInt(0, arr.length - 1)]
}
function randAccountNumber() {
  const root = Array.from({ length: 10 }, () => randInt(0, 9)).join("")
  return root
}
function randName() {
  return choice(NAMES)
}
function randAddress() {
  const street = choice(STREETS)
  const numA = randInt(1, 200)
  const numB = randInt(1, 300)
  const cross = choice(STREETS.filter((s) => s !== street))
  const city = choice(CITIES)
  const zone = choice(PARISH)
  return `${street} N${numA}-${numB} y ${cross}, ${zone}, ${city}`
}
function randPeriod() {
  const now = new Date()
  const monthsBack = randInt(0, 3)
  const d = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1)
  const fmt = d.toLocaleDateString("es-EC", { month: "long", year: "numeric" })
  // Capitalizar primera letra
  return fmt.charAt(0).toUpperCase() + fmt.slice(1)
}
function randDueDate() {
  const now = new Date()
  const days = randInt(10, 25)
  const d = new Date(now)
  d.setDate(now.getDate() + days)
  return d.toLocaleDateString("es-EC")
}
function randAmount() {
  return Math.round((randInt(5, 60) + Math.random()) * 100) / 100
}
function randConsumption() {
  return `${randInt(8, 35)} m³`
}
function randStatus(): "pending" | "overdue" {
  return Math.random() < 0.22 ? "overdue" : "pending"
}
function randLast4() {
  return String(randInt(0, 9999)).padStart(4, "0")
}
function currency(v: number) {
  return `$${v.toFixed(2)}`
}

export function PaymentModule() {
  const [step, setStep] = useState<PaymentStep>("search")
  const [accountNumber, setAccountNumber] = useState("")
  const [billDetails, setBillDetails] = useState<BillDetails | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [debitAccounts, setDebitAccounts] = useState<DebitAccount[]>([])
  const [suggested, setSuggested] = useState<
    { accountNumber: string; clientName: string; address: string; amount: number; status: "pending" | "overdue" }[]
  >([])

  // refresca sugerencias cada render del paso search (más “vivo”)
  const regenerateSuggestions = useMemo(() => {
    return () =>
      Array.from({ length: 3 }).map(() => ({
        accountNumber: randAccountNumber(),
        clientName: randName(),
        address: randAddress(),
        amount: randAmount(),
        status: randStatus(),
      }))
  }, [])

  const handleSearch = () => {
    // Ignora el número ingresado y genera datos aleatorios y consistentes
    const acc = randAccountNumber()
    const details: BillDetails = {
      accountNumber: acc,
      clientName: randName(),
      address: randAddress(),
      period: randPeriod(),
      dueDate: randDueDate(),
      amount: randAmount(),
      consumption: randConsumption(),
      status: randStatus(),
    }

    const accounts: DebitAccount[] = [
      {
        id: "savings",
        type: "savings",
        last4: randLast4(),
        balance: Math.round((randInt(500, 2500) + Math.random()) * 100) / 100,
        label: "Cuenta de Ahorros",
      },
      {
        id: "checking",
        type: "checking",
        last4: randLast4(),
        balance: Math.round((randInt(1000, 6000) + Math.random()) * 100) / 100,
        label: "Cuenta Corriente",
      },
    ]

    setBillDetails(details)
    setDebitAccounts(accounts)
    setSelectedAccount("")
    setStep("details")
  }

  const handleConfirmPayment = () => {
    setStep("confirm")
  }

  const handleProcessPayment = () => {
    setTimeout(() => {
      setStep("success")
    }, 1200)
  }

  const handleNewPayment = () => {
    setAccountNumber("")
    setBillDetails(null)
    setSelectedAccount("")
    setDebitAccounts([])
    setSuggested([])
    setStep("search")
  }
  function StatusPill({ status }: { status: "pending" | "overdue" }) {
    const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border";
    const cls =
      status === "overdue"
        ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800"
        : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800";
    return <span className={`${base} ${cls}`}>{status === "overdue" ? "Vencida" : "Pendiente"}</span>;
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#003D6A] text-white p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-[#FFDD00] p-2 rounded-lg">
            <Droplet className="h-6 w-6 text-[#003D6A]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-balance">Pago de Servicios Básicos</h1>
            <p className="text-blue-100">EMAPA - Empresa Municipal de Agua Potable</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      {step !== "search" && (
        <Button
          variant="ghost"
          onClick={handleNewPayment}
          className="text-[#003D6A] hover:text-[#005A9C] hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Button>
      )}

      {/* Step 1: Search Account */}
      {step === "search" && (
        <Card>
          <CardHeader>
            <CardTitle>Consultar Factura</CardTitle>
            <CardDescription>Buscaremos un cliente y su factura de forma aleatoria para simular el flujo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account">Número de Cuenta / Contrato (opcional en demo)</Label>
              <Input
                id="account"
                placeholder="Puedes dejarlo vacío en esta demo"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">
                En esta simulación el número ingresado no afecta el resultado; se generan datos realistas al azar.
              </p>
            </div>

            <Button
              onClick={() => {
                setSuggested(regenerateSuggestions())
                handleSearch()
              }}
              className="w-full bg-[#FFDD00] hover:bg-[#E6C700] text-[#003D6A] font-semibold"
              size="lg"
            >
              <Search className="h-5 w-5 mr-2" />
              Consultar Factura (Demo)
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Bill Details */}
      {step === "details" && billDetails && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Detalles de la Factura</CardTitle>
                <CardDescription>Revise la información antes de continuar</CardDescription>
              </div>
              <StatusPill status={billDetails.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Client Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-[#003D6A]">Información del Cliente</h3>
              <div className="grid gap-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cuenta N°:</span>
                  <span className="font-medium">{billDetails.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Titular:</span>
                  <span className="font-medium">{billDetails.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dirección:</span>
                  <span className="font-medium text-right max-w-xs">{billDetails.address}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Bill Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-[#003D6A]">Detalles del Consumo</h3>
              <div className="grid gap-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Período:</span>
                  <span className="font-medium">{billDetails.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consumo:</span>
                  <span className="font-medium">{billDetails.consumption}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha de vencimiento:</span>
                  <span className="font-medium">{billDetails.dueDate}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Amount */}
            <div className="bg-[#003D6A] text-white p-6 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg">Total a Pagar:</span>
                <span className="text-3xl font-bold">{currency(billDetails.amount)}</span>
              </div>
            </div>

            <Button
              onClick={handleConfirmPayment}
              className="w-full bg-[#FFDD00] hover:bg-[#E6C700] text-[#003D6A] font-semibold"
              size="lg"
            >
              Continuar con el Pago
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Confirm Payment */}
      {step === "confirm" && billDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Confirmar Pago</CardTitle>
            <CardDescription>Seleccione la cuenta desde la cual desea realizar el pago</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Account Selection */}
            <div className="space-y-3">
              <Label>Cuenta de Débito</Label>
              <div className="space-y-2">
                {debitAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setSelectedAccount(acc.id)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${selectedAccount === acc.id ? "border-[#FFDD00] bg-yellow-50" : "border-border hover:border-[#003D6A]"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-[#003D6A]" />
                        <div>
                          <p className="font-medium">{acc.label}</p>
                          <p className="text-sm text-muted-foreground">**** **** **** {acc.last4}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{currency(acc.balance)}</p>
                        <p className="text-xs text-muted-foreground">Disponible</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Payment Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold text-[#003D6A]">Resumen del Pago</h3>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servicio:</span>
                  <span className="font-medium">EMAPA - Agua Potable</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cuenta:</span>
                  <span className="font-medium">{billDetails.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Período:</span>
                  <span className="font-medium">{billDetails.period}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-[#003D6A]">{currency(billDetails.amount)}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleProcessPayment}
              disabled={!selectedAccount}
              className="w-full bg-[#FFDD00] hover:bg-[#E6C700] text-[#003D6A] font-semibold"
              size="lg"
            >
              Confirmar y Pagar
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Al confirmar, acepta que se debitará el monto de la cuenta seleccionada
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Success */}
      {step === "success" && billDetails && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#003D6A] mb-2">¡Pago Exitoso!</h2>
                <p className="text-muted-foreground">Su pago ha sido procesado correctamente</p>
              </div>

              <div className="bg-muted p-6 rounded-lg space-y-3 text-left max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comprobante:</span>
                  <span className="font-medium">BP-{Date.now().toString().slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="font-medium">{new Date().toLocaleDateString("es-EC")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hora:</span>
                  <span className="font-medium">{new Date().toLocaleTimeString("es-EC")}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servicio:</span>
                  <span className="font-medium">EMAPA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cuenta:</span>
                  <span className="font-medium">{billDetails.accountNumber}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Monto Pagado:</span>
                  <span className="font-bold text-[#003D6A]">{currency(billDetails.amount)}</span>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" className="border-[#003D6A] text-[#003D6A] bg-transparent">
                  Descargar Comprobante
                </Button>
                <Button
                  onClick={handleNewPayment}
                  className="bg-[#FFDD00] hover:bg-[#E6C700] text-[#003D6A] font-semibold"
                >
                  Finalizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
