"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useMessageData } from "../hooks/use-message-data"

interface MessageTableProps {
  filters: {
    status: string
    channel: string
    dateRange: string
    search: string
  }
}

export function MessageTable({ filters }: MessageTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const { messages, isLoading, error, total } = useMessageData(filters)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      sent: { label: "Enviado", variant: "default" as const },
      delivered: { label: "Entregado", variant: "default" as const },
      pending: { label: "Pendiente", variant: "secondary" as const },
      queued: { label: "En Cola", variant: "secondary" as const },
      scheduled: { label: "Programado", variant: "outline" as const },
      failed: { label: "Fallido", variant: "destructive" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "secondary" as const,
    }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getChannelBadge = (channel: string) => {
    return (
      <Badge variant="secondary" className="capitalize">
        {channel}
      </Badge>
    )
  }

  const totalPages = Math.ceil(messages.length / itemsPerPage)
  const paginatedMessages = messages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Cargando mensajes...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-destructive font-medium">Error al cargar mensajes</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">
          Mensajes {total > 0 && `(${total} total)`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-pretty">No se encontraron mensajes con los filtros aplicados</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Destinatario</TableHead>
                    <TableHead>Mensaje</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha/Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{message.recipient}</div>
                          {message.recipient_name && (
                            <div className="text-xs text-muted-foreground">{message.recipient_name}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={message.message}>
                          {message.message}
                        </div>
                        {message.error_message && (
                          <div className="text-xs text-destructive mt-1">
                            {message.error_message}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{getChannelBadge(message.channel)}</TableCell>
                      <TableCell>{getStatusBadge(message.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="text-sm">
                          {message.date}
                          {message.scheduledDate && message.status === "scheduled" && (
                            <div className="text-xs text-muted-foreground">
                              Programado: {message.scheduledDate}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, messages.length)} de {messages.length} mensajes
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="size-4" />
                  Anterior
                </Button>
                <span className="text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
