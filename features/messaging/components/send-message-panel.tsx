"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ManualSendForm } from "./manual-send-form"
import { ScheduledSendForm } from "./scheduled-send-form"

export function SendMessagePanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">Nueva Campaña de Mensajería</CardTitle>
        <CardDescription className="text-pretty">
          Elige cómo deseas enviar tus mensajes: instantáneo o programado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Envío Instantáneo</TabsTrigger>
            <TabsTrigger value="scheduled">Envío Programado</TabsTrigger>
          </TabsList>
          <TabsContent value="manual" className="mt-6">
            <ManualSendForm />
          </TabsContent>
          <TabsContent value="scheduled" className="mt-6">
            <ScheduledSendForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
