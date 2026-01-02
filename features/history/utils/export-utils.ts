import type { Message } from "../types/message"

export const exportToCSV = (messages: Message[], filename = "mensajes") => {
  const headers = ["ID", "Destinatario", "Mensaje", "Canal", "Estado", "Fecha"]
  const rows = messages.map((msg) => [msg.id, msg.recipient, msg.message, msg.channel, msg.status, msg.date])

  const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToJSON = (messages: Message[], filename = "mensajes") => {
  const jsonContent = JSON.stringify(messages, null, 2)
  const blob = new Blob([jsonContent], { type: "application/json" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.json`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToExcel = (messages: Message[], filename = "mensajes") => {
  // Create a simple Excel-compatible format (TSV)
  const headers = ["ID", "Destinatario", "Mensaje", "Canal", "Estado", "Fecha"]
  const rows = messages.map((msg) => [msg.id, msg.recipient, msg.message, msg.channel, msg.status, msg.date])

  const tsvContent = [headers.join("\t"), ...rows.map((row) => row.join("\t"))].join("\n")

  const blob = new Blob([tsvContent], { type: "application/vnd.ms-excel" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.xls`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
