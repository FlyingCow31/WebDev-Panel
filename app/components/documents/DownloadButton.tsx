"use client"

import { Download } from "lucide-react"
import { useState } from "react"

export default function DownloadButton({ documentId, fileName }: { documentId: number; fileName: string }) {
     const [loading, setLoading] = useState(false)
     const [error, setError] = useState("")

     async function download() {
          setLoading(true)
          setError("")
          try {
               const response = await fetch(`/api/documents/${documentId}`)
               if (!response.ok) {
                    setError(response.status === 404 ? "Document introuvable." : "Accès refusé.")
                    return
               }
               const file = await response.blob()
               const url = URL.createObjectURL(file)
               const link = document.createElement("a")
               link.href = url
               link.download = fileName
               link.click()
               URL.revokeObjectURL(url)
          } catch {
               setError("Erreur réseau.")
          } finally {
               setLoading(false)
          }
     }

     return (
          <div className="flex flex-none flex-col items-end gap-1">
               <button
                    type="button"
                    onClick={download}
                    disabled={loading}
                    aria-label={`Télécharger ${fileName}`}
                    className="btn btn-icon btn-primary btn-sm shadow-none disabled:opacity-50"
               >
                    {loading ? "…" : <Download size={20} strokeWidth={2.4} />}
               </button>
               {error && (
                    <span role="alert" className="text-caption font-bold text-colerr-dark">
                         {error}
                    </span>
               )}
          </div>
     )
}
