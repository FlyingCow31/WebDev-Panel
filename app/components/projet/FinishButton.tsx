"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function FinishButton({ proj_id }: { proj_id: number }) {
     const router = useRouter()
     const [isFinishing, setIsFinishing] = useState(false)
     const [error, setError] = useState(false)

     async function handleFinish() {
          setIsFinishing(true)
          setError(false)
          try {
               const response = await fetch("/api/projects/modify/finish", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ data: { proj_id, date: new Date() } }),
               })
               if (!response.ok) {
                    setError(true)
                    return
               }
               router.push("/projets")
          } catch (requestError) {
               console.error("Erreur lors de la fin du projet.", requestError)
               setError(true)
          } finally {
               setIsFinishing(false)
          }
     }

     return (
          <button className="btn btn-primary" type="button" disabled={isFinishing} onClick={handleFinish}>
               {isFinishing ? "Enregistrement..." : error ? "Erreur" : "Terminer"}
          </button>
     )
}
