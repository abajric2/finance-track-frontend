import Link from "next/link"
import { ArrowLeft, DollarSign, PiggyBank } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AddAccountPage() {
  return (
    <div className="container py-6">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/accounts">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Account</h1>
            <p className="text-muted-foreground">Add a new financial account to track</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Enter the details of your financial account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="account-type">Account Type</Label>
                <RadioGroup defaultValue="manual" className="grid grid-cols-3 gap-4 pt-2">
                  <div>
                    <RadioGroupItem value="manual" id="manual" className="peer sr-only" />
                    <Label
                      htmlFor="manual"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <PiggyBank className="mb-3 h-6 w-6" />
                      Manual
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="checking" id="checking" className="peer sr-only" />
                    <Label
                      htmlFor="checking"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <DollarSign className="mb-3 h-6 w-6" />
                      Checking
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="credit" id="credit" className="peer sr-only" />
                    <Label
                      htmlFor="credit"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <PiggyBank className="mb-3 h-6 w-6" />
                      Credit Card
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-name">Account Name</Label>
                <Input id="account-name" placeholder="e.g. Primary Checking" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="financial-institution">Financial Institution</Label>
                <Select>
                  <SelectTrigger id="financial-institution">
                    <SelectValue placeholder="Select a bank or institution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank-of-america">Bank of America</SelectItem>
                    <SelectItem value="chase">Chase</SelectItem>
                    <SelectItem value="wells-fargo">Wells Fargo</SelectItem>
                    <SelectItem value="citibank">Citibank</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input id="account-number" placeholder="Account number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routing-number">Routing Number</Label>
                  <Input id="routing-number" placeholder="Routing number" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-balance">Current Balance</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                  <Input id="current-balance" placeholder="0.00" className="pl-7" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/accounts">Cancel</Link>
            </Button>
            <Button>Add Account</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

