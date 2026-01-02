"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageFilters } from "./message-filters"
import { MessageTable } from "./message-table"
import { ExportButtons } from "./export-buttons"

export function MessageHistory() {
  const [filters, setFilters] = useState({
    status: "all",
    channel: "all",
    dateRange: "all",
    search: "",
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-balance">Filtros de Búsqueda</CardTitle>
              <CardDescription className="text-pretty">
                Filtra los mensajes por estado, canal o rango de fechas
              </CardDescription>
            </div>
            <ExportButtons />
          </div>
        </CardHeader>
        <CardContent>
          <MessageFilters filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      <MessageTable filters={filters} />
    </div>
  )
}
