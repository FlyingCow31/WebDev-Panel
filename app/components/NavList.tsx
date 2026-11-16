import { Suspense } from "react"
import { getNumbers } from "../actions/NavActions"
import NavLinks, { WaitingNavLinks } from "./NavLinks"

export default async function NavList() {
     const { projectNb, todosNb, alertsNb } = await getNumbers()
     return (
          <Suspense fallback={<WaitingNavLinks />}>
               <NavLinks projectNb={projectNb} todosNb={todosNb} alertsNb={alertsNb} />
          </Suspense>
     )
}
