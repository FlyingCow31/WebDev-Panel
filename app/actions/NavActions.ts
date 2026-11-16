import { getProjects, getSites, getTodos } from "../lib/data"

export async function getNumbers(): Promise<{ projectNb: number; todosNb: number; alertsNb: number }> {
     const projects = await getProjects()
     const todos = await getTodos()
     const sites = await getSites()

     const projectNb = projects.filter((p) => !p.proj_done_at).length
     const todosNb = todos.filter((t) => !t.todo_done).length

     const alertsNb = sites.filter((s) => s.in_alert).length

     return { projectNb, todosNb, alertsNb }
}
