"use client"

import { RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CheckButton({ siteId, domain }: { siteId?: number; domain?: string }) {
     const router = useRouter()
     const [running, setRunning] = useState(false)
     const [error, setError] = useState("")

     async function run() {
          setRunning(true)
          setError("")
          try {
               const response = await fetch("/api/monitoring/check", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(siteId ? { site_id: siteId } : {}),
               })
               if (!response.ok) {
                    const body = await response.json().catch(() => null)
                    setError(body?.error ?? "Échec de la vérification.")
                    return
               }
               router.refresh()
          } catch {
               setError("Erreur réseau.")
          } finally {
               setRunning(false)
          }
     }

     if (!siteId) {
          return (
               <div className="flex flex-col items-end gap-1">
                    <button type="button" onClick={run} disabled={running} className="btn btn-primary gap-2 disabled:opacity-60">
                         <RefreshCw size={18} strokeWidth={2.5} className={running ? "animate-spin" : ""} aria-hidden="true" />
                         {running ? "Vérification… (jusqu'à 1 min)" : "Relancer les tests"}
                    </button>
                    {error && <span role="alert" className="text-caption font-bold text-colerr-dark">{error}</span>}
               </div>
          )
     }

     return (
          <button
               type="button"
               onClick={run}
               disabled={running}
               title={error || undefined}
               aria-label={`Vérifier ${domain ?? "le site"}`}
               className={`btn btn-icon btn-sm shadow-none disabled:opacity-60 ${error ? "bg-colerr" : ""}`}
          >
               <RefreshCw size={16} strokeWidth={2.5} className={running ? "animate-spin" : ""} aria-hidden="true" />
          </button>
     )
}
