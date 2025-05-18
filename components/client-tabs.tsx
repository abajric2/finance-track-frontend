"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Tabs } from "@/components/ui/tabs"

interface ClientTabsProps extends React.ComponentProps<typeof Tabs> {
  paramName?: string
  defaultValue?: string
}

export function ClientTabs({ children, paramName = "tab", defaultValue, ...props }: ClientTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get(paramName) || defaultValue || props.defaultValue

  const handleTabChange = React.useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(paramName, value)
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams, paramName],
  )

  return (
    <Tabs {...props} value={currentTab as string} onValueChange={handleTabChange}>
      {children}
    </Tabs>
  )
}

