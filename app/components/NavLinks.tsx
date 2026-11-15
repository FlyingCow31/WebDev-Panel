"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavLinks({ projectNb, todosNb }: { projectNb: number; todosNb: number }) {
     const pathname = usePathname()
     const links = [
          { href: "/", label: "Accueil" },
          { href: "/projets", label: "Projets", count: projectNb },
          { href: "/clients", label: "Clients" },
          { href: "/todo", label: "Todo", count: todosNb },
          { href: "/finances", label: "Finances" },
          { href: "/administration", label: "Administration" },
          // TODO: Add this when the error handling has been implemented.
          { href: "/monitoring", label: "Monitoring", count: 1, alert: true },
     ]

     return (
          <nav
               aria-label="Navigation principale"
               className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
          >
               {links.map((link) => {
                    const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
                    return (
                         <Link
                              key={link.href}
                              href={link.href}
                              aria-current={active ? "page" : undefined}
                              className="nav-link shrink-0"
                         >
                              {link.label}
                              {link.count !== undefined && (
                                   <span className={link.alert ? "count count-alert" : "count"}>{link.count}</span>
                              )}
                         </Link>
                    )
               })}
          </nav>
     )
}

export function WaitingNavLinks() {
     const links = [
          { href: "/", label: "Accueil" },
          { href: "/projets", label: "Projets" },
          { href: "/clients", label: "Clients" },
          { href: "/todo", label: "Todo" },
          { href: "/finances", label: "Finances" },
          { href: "/administration", label: "Administration" },
          { href: "/monitoring", label: "Monitoring" },
     ]
     return (
          <nav
               aria-label="Navigation principale"
               className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
          >
               {links.map((link) => {
                    return (
                         <Link key={link.href} href={link.href} className="nav-link shrink-0">
                              {link.label}
                         </Link>
                    )
               })}
          </nav>
     )
}
