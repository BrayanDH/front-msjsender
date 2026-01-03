"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Database, FileUp, Upload, User } from "lucide-react"

type SourceType = "manual" | "database" | "csv" | "json"

interface RecipientSourceSelectorProps {
  onSourceChange?: (source: SourceType) => void
  disabled?: boolean
}

export function RecipientSourceSelector({
  onSourceChange,
  disabled,
}: RecipientSourceSelectorProps) {
  const [source, setSource] = useState<SourceType>("manual")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [sendToAll, setSendToAll] = useState(false)
  const [manualData, setManualData] = useState({
    name: "",
    phone: "",
    email: "",
  })

  // Derive recipientType from source
  const recipientType = source === "manual" ? "single" : "multiple"

  const handleSourceChange = (value: SourceType) => {
    setSource(value)
    setSelectedFile(null)
    onSourceChange?.(value)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label>Fuente de Destinatarios</Label>
        <RadioGroup value={source} onValueChange={handleSourceChange} disabled={disabled} className="grid gap-3">
          <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="manual" id="manual" className="mt-0.5" />
            <div className="flex-1 space-y-1">
              <label htmlFor="manual" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <User className="size-4" />
                Entrada Manual (Individual)
              </label>
              <p className="text-xs text-muted-foreground">Envío a una sola persona ingresando sus datos</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="database" id="database" className="mt-0.5" />
            <div className="flex-1 space-y-1">
              <label htmlFor="database" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <Database className="size-4" />
                Base de Datos (Batch)
              </label>
              <p className="text-xs text-muted-foreground">Selecciona contactos de tu base de datos existente</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="csv" id="csv" className="mt-0.5" />
            <div className="flex-1 space-y-1">
              <label htmlFor="csv" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <FileUp className="size-4" />
                Archivo CSV (Batch)
              </label>
              <p className="text-xs text-muted-foreground">Sube un archivo CSV con múltiples contactos</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="json" id="json" className="mt-0.5" />
            <div className="flex-1 space-y-1">
              <label htmlFor="json" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <Upload className="size-4" />
                Archivo JSON (Batch)
              </label>
              <p className="text-xs text-muted-foreground">Sube un archivo JSON con los datos de contactos</p>
            </div>
          </div>
        </RadioGroup>
      </div>

      {source === "manual" && (
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <Label htmlFor="manual-name">Nombre</Label>
            <Input
              id="manual-name"
              type="text"
              placeholder="Nombre del destinatario"
              value={manualData.name}
              onChange={(e) => setManualData({ ...manualData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manual-phone">Número de Teléfono</Label>
            <Input
              id="manual-phone"
              type="tel"
              placeholder="+52 123 456 7890"
              value={manualData.phone}
              onChange={(e) => setManualData({ ...manualData, phone: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manual-email">Correo Electrónico</Label>
            <Input
              id="manual-email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={manualData.email}
              onChange={(e) => setManualData({ ...manualData, email: e.target.value })}
            />
          </div>
        </div>
      )}

      {source === "database" && (
        <div className="space-y-3 pt-2">
          {recipientType === "multiple" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendToAll"
                checked={sendToAll}
                onCheckedChange={(checked) => setSendToAll(checked === true)}
              />
              <label htmlFor="sendToAll" className="text-sm font-medium leading-none">
                Enviar a todos los contactos
              </label>
            </div>
          )}

          {(!sendToAll || recipientType === "single") && (
            <div className="space-y-2">
              <Label htmlFor="db-recipient">
                {recipientType === "single" ? "Seleccionar Contacto" : "Seleccionar Contactos"}
              </Label>
              <Input
                id="db-recipient"
                type="text"
                placeholder={recipientType === "single" ? "Buscar contacto..." : "Buscar contactos..."}
              />
              <p className="text-xs text-muted-foreground">
                {recipientType === "single"
                  ? "Busca y selecciona un contacto de tu base de datos"
                  : "Busca y selecciona contactos de tu base de datos"}
              </p>
            </div>
          )}
        </div>
      )}

      {source === "csv" && (
        <div className="space-y-2 pt-2">
          <Label htmlFor="csv-upload">Cargar Archivo CSV</Label>
          <div className="flex gap-2">
            <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} className="cursor-pointer" />
          </div>
          {selectedFile && (
            <p className="text-xs text-muted-foreground">
              Archivo seleccionado: <span className="font-medium">{selectedFile.name}</span>
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Formato esperado: nombre, número, correo (una fila por contacto)
          </p>
        </div>
      )}

      {source === "json" && (
        <div className="space-y-2 pt-2">
          <Label htmlFor="json-upload">Cargar Archivo JSON</Label>
          <div className="flex gap-2">
            <Input id="json-upload" type="file" accept=".json" onChange={handleFileChange} className="cursor-pointer" />
          </div>
          {selectedFile && (
            <p className="text-xs text-muted-foreground">
              Archivo seleccionado: <span className="font-medium">{selectedFile.name}</span>
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Formato esperado: {`[{"nombre": "...", "numero": "...", "correo": "..."}]`}
          </p>
        </div>
      )}
    </div>
  )
}
