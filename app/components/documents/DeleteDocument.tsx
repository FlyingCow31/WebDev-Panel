"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteDocument({ documentId }: { documentId: number }) {
     const router = useRouter()
     const [label, setLabel] = useState("X")
     const [deleting, setDeleting] = useState(false)

     async function handleDelete() {
          setDeleting(true)
          try {
               const response = await fetch(`/api/documents/${documentId}`, { method: "DELETE" })
               if (!response.ok) {
                    setLabel("Erreur")
                    return
               }
               router.refresh()
          } catch {
               setLabel("Erreur")
          } finally {
               setDeleting(false)
          }
     }

     return (
          <button
               type="button"
               disabled={deleting}
               onClick={label === "Confirmer" ? handleDelete : () => setLabel("Confirmer")}
               aria-label="Supprimer le document"
               className="flex-none cursor-pointer text-caption font-bold text-colerr-dark disabled:opacity-50"
          >
               {deleting ? "…" : label}
          </button>
     )
}
