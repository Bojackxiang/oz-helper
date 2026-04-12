"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  CreditCard,
  Building2,
  Clock,
  CheckCircle,
  TrendingUp
} from "lucide-react"

const walletData = {
  balance: 245.50,
  pendingEarnings: 85.00,
  totalEarned: 1250.00,
  bankAccount: {
    bank: "Commonwealth Bank",
    bsb: "062-***",
    account: "****7890",
  },
}

const transactions = [
  {
    id: 1,
    type: "earning",
    title: "Lawn Mowing - Mary T.",
    amount: 40.50,
    status: "completed",
    date: "Today, 2:30 PM",
    taskId: 1,
  },
  {
    id: 2,
    type: "withdrawal",
    title: "Bank Transfer",
    amount: 150.00,
    status: "completed",
    date: "Yesterday",
    bankAccount: "CBA ****7890",
  },
  {
    id: 3,
    type: "earning",
    title: "Furniture Assembly - Chris P.",
    amount: 54.00,
    status: "completed",
    date: "2 days ago",
    taskId: 4,
  },
  {
    id: 4,
    type: "earning",
    title: "Dog Walking - Emma S.",
    amount: 22.50,
    status: "completed",
    date: "3 days ago",
    taskId: 3,
  },
  {
    id: 5,
    type: "earning",
    title: "Moving Help - David L.",
    amount: 72.00,
    status: "pending",
    date: "4 days ago",
    taskId: 2,
  },
]

const stats = [
  { label: "This Week", value: "$117.00", change: "+23%" },
  { label: "This Month", value: "$485.00", change: "+12%" },
  { label: "Avg. per Task", value: "$42.50", change: "+5%" },
]

export default function WalletPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
        <p className="text-muted-foreground">Manage your earnings and payments</p>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Available Balance</p>
                <p className="text-4xl font-bold text-foreground">
                  ${walletData.balance.toFixed(2)}
                </p>
                <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  ${walletData.pendingEarnings.toFixed(2)} pending
                </p>
              </div>
              <div className="flex gap-3">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold text-foreground">
                  ${walletData.totalEarned.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                </div>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    tx.type === "earning" ? "bg-primary/10" : "bg-muted"
                  }`}>
                    {tx.type === "earning" ? (
                      <ArrowDownLeft className="h-5 w-5 text-primary" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{tx.title}</p>
                    <p className="text-sm text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.type === "earning" ? "text-primary" : "text-foreground"}`}>
                    {tx.type === "earning" ? "+" : "-"}${tx.amount.toFixed(2)}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${tx.status === "completed" ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {tx.status === "completed" ? (
                      <><CheckCircle className="mr-1 h-3 w-3" /> Completed</>
                    ) : (
                      <><Clock className="mr-1 h-3 w-3" /> Pending</>
                    )}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
              <CardDescription>Where your earnings are sent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{walletData.bankAccount.bank}</p>
                    <p className="text-sm text-muted-foreground">
                      BSB: {walletData.bankAccount.bsb} | Acc: {walletData.bankAccount.account}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Update Bank Account
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Withdrawal Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                Minimum withdrawal: $20 AUD
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                Processing time: 1-2 business days
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                No withdrawal fees
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
