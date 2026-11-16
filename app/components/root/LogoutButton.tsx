"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LogoutButton({ iconOnMobile = false }: { iconOnMobile?: boolean }) {
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
          <button
               type="button"
               onClick={handleLogout}
               disabled={pending}
               aria-label="Se déconnecter"
               title={iconOnMobile ? "Se déconnecter" : undefined}
               className={
                    iconOnMobile
                         ? "btn btn-icon shrink-0 sm:btn-sm sm:w-auto sm:px-4"
                         : "nav-link muted font-medium"
               }
          >
               {iconOnMobile && <LogOut size={20} aria-hidden="true" className="shrink-0" />}
               <span className={iconOnMobile ? "sr-only sm:not-sr-only" : undefined}>
                    {pending ? "Déconnexion..." : "Se déconnecter"}
               </span>
          </button>
     )
}
