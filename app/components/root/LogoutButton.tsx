"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LogoutButton() {
     const router = useRouter()
     const [pending, setPending] = useState(false)

     async function handleLogout() {
          setPending(true)
          try {
               const response = await fetch("/api/auth/logout", { method: "POST" })
               if (!response.ok) throw new Error("Logout failed")

               router.replace("/login")
               router.refresh()
          } finally {
               setPending(false)
          }
     }

     return (
          <button type="button" onClick={handleLogout} disabled={pending} className="nav-link muted font-medium">
               {pending ? "Déconnexion..." : "Se déconnecter"}
          </button>
     )
}
