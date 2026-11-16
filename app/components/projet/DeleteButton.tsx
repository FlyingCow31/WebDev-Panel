"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteButton({ proj_id, compact = false }: { proj_id: number; compact?: boolean }) {
     const router = useRouter()
     const [confirm, setConfirm] = useState("X")
     const [isDeleting, setIsDeleting] = useState(false)
     const isCompact = compact || (confirm !== "confirmer" && confirm !== "Erreur" && !isDeleting)

     async function handleDeletion(proj_id: number) {
          setIsDeleting(true)
          try {
               const response = await fetch("/api/projects/delete", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ data: { proj_id: proj_id } }),
               })
               if (!response.ok) {
                    setConfirm("Erreur")
                    return
               }
               router.push("/projets")
          } catch (error) {
               console.error("Erreur avec la suppression du projet.", error)
               setConfirm("Erreur")
          } finally {
               setIsDeleting(false)
          }
     }

     const onButtonClick = compact
          ? () => handleDeletion(proj_id)
          : confirm === "confirmer"
            ? () => handleDeletion(proj_id)
            : () => setConfirm("confirmer")

     return (
          <button
               type="button"
               disabled={isDeleting}
               aria-label={confirm === "confirmer" ? "Confirmer la suppression du projet" : "Supprimer le projet"}
               className={
                    compact
                         ? "btn btn-icon min-h-0 h-7 w-7 border-2 border-ink bg-surface p-0 text-[0.75rem] font-black text-ink shadow-none"
                         : `btn btn-sm btn-danger ${isCompact ? "btn-icon" : ""}`
               }
               style={
                    compact
                         ? {
                              minHeight: "1.75rem",
                              width: "1.75rem",
                              height: "1.75rem",
                              padding: 0,
                              boxShadow: "none",
                              borderWidth: "2px",
                              borderColor: "#111111",
                              background: "#f3ecff",
                              color: "#111111",
                              fontSize: "0.75rem",
                              fontWeight: 900,
                           }
                         : undefined
               }
               onClick={onButtonClick}
          >
               {isDeleting ? "Suppression..." : compact ? "X" : confirm === "confirmer" ? "Confirmer ?" : confirm}
          </button>
     )
}

export function DeleteAvancee({ avancee_id }: { avancee_id: number }) {
     const router = useRouter()
     const [confirm, setConfirm] = useState("X")
     const [isDeleting, setIsDeleting] = useState(false)
     const isCompact = confirm !== "confirmer" && confirm !== "Erreur" && !isDeleting

     async function handleDeletion(avancee_id: number) {
          setIsDeleting(true)
          try {
               const response = await fetch("/api/projects/avancee/delete", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ data: { avancee_id: avancee_id } }),
               })
               if (!response.ok) {
                    setConfirm("Erreur")
                    return
               }
               router.refresh()
          } catch (error) {
               console.error("Erreur avec la suppression de l'avancee.", error)
               setConfirm("Erreur")
          } finally {
               setIsDeleting(false)
          }
     }

     return (
          <button
               type="button"
               disabled={isDeleting}
               aria-label={confirm === "confirmer" ? "Confirmer la suppression de l'étape" : "Supprimer l'étape"}
               className={`btn btn-sm btn-danger ${isCompact ? "btn-icon" : ""}`}
               onClick={confirm === "confirmer" ? () => handleDeletion(avancee_id) : () => setConfirm("confirmer")}
          >
               {isDeleting ? "Suppression..." : confirm === "confirmer" ? "Confirmer ?" : confirm}
          </button>
     )
}
export function DeleteTodo({ todo_id, onDeleted }: { todo_id: number; onDeleted?: (todoId: number) => void }) {
     const [confirm, setConfirm] = useState("X")
     const [isDeleting, setIsDeleting] = useState(false)
     const isCompact = confirm !== "confirmer" && confirm !== "Erreur" && !isDeleting

     async function handleDeletion(todo_id: number) {
          setIsDeleting(true)
          try {
               const response = await fetch("/api/todo/delete", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ data: { todo_id: todo_id } }),
               })
               if (!response.ok) {
                    setConfirm("Erreur")
                    return
               }
               onDeleted?.(todo_id)
          } catch (error) {
               console.error("Erreur avec la suppression de la todo.", error)
               setConfirm("Erreur")
          } finally {
               setIsDeleting(false)
          }
     }

     return (
          <button
               type="button"
               disabled={isDeleting}
               aria-label={confirm === "confirmer" ? "Confirmer la suppression de la tâche" : "Supprimer la tâche"}
               className={`btn btn-sm btn-danger ${isCompact ? "btn-icon" : ""}`}
               onClick={confirm === "confirmer" ? () => handleDeletion(todo_id) : () => setConfirm("confirmer")}
          >
               {isDeleting ? "Suppression..." : confirm === "confirmer" ? "Confirmer ?" : confirm}
          </button>
     )
}
