import { getProjects, getTodos } from "../lib/data"

export async function getNumbers(): Promise<{ projectNb: number; todosNb: number }> {
     const projects = await getProjects()
     const todos = await getTodos()

     const projectNb = projects.filter((p) => !p.proj_done_at).length
     const todosNb = todos.filter((t) => !t.todo_done).length

     return { projectNb, todosNb }
}
