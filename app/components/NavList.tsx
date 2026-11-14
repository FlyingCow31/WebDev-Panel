import { getNumbers } from "../actions/NavActions"
import NavLinks from "./NavLinks"

export default async function NavList() {
     const { projectNb, todosNb } = await getNumbers()
     return <NavLinks projectNb={projectNb} todosNb={todosNb} />
}
