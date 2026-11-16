"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowUp } from "lucide-react"

export default function ContinueButton({ proj_id, proj_nom }: { proj_id: number; proj_nom: string }) {
     const router = useRouter()
     const [isContinuing, setIsContinuing] = useState(false)
     const [error, setError] = useState(false)

     async function handleContinue() {
          setIsContinuing(true)
          setError(false)
          try {
               const response = await fetch("/api/projects/modify/continue", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ data: { proj_id } }),
               })
               if (!response.ok) {
                    setError(true)
                    return
               }
               router.refresh()
          } catch {
               console.error("Erreur lors de la reprise du projet.")
               setError(true)
          } finally {
               setIsContinuing(false)
          }
     }

     return (
          <button
               type="button"
               disabled={isContinuing}
               aria-label={`Remettre ${proj_nom} dans les projets en cours`}
               title={error ? "Erreur lors de la reprise du projet" : "Remettre dans les projets en cours"}
               className="btn btn-icon btn-sm"
               style={{
                    minHeight: "1.75rem",
                    width: "1.75rem",
                    height: "1.75rem",
                    padding: 0,
                    borderWidth: "2px",
                    background: "var(--color-surface)",
                    color: "var(--color-ink)",
                    boxShadow: "none",
               }}
               onClick={handleContinue}
          >
               <ArrowUp aria-hidden="true" size={14} strokeWidth={2.5} />
          </button>
     )
}
