import { CheckRedirect } from "@/app/lib/auth/auth"
import { getClients, getProjects, getTodos } from "@/app/lib/data"
import CreateTodoButton from "@/app/components/todo/TodoCreate"
import TodoBoard from "@/app/components/todo/TodoBoard"
import { connection } from "next/server"
import { Suspense } from "react"
import { TodoPageSkeleton } from "@/app/components/LoadingSkeletons"

export default function TodoPage() {
     return (
          <Suspense fallback={<TodoPageSkeleton />}>
               <TodoPageContent />
          </Suspense>
     )
}

export async function TodoPageContent() {
     await CheckRedirect()
     const todos = await getTodos()
     const clients = await getClients()
     const projects = await getProjects()

     await connection()

     return (
          <>
               <h1 className="page-title">Todo.</h1>

               <div className="card-sm p-4">
                    <CreateTodoButton projects={projects} clients={clients} />
               </div>

               <TodoBoard todos={todos} clients={clients} projects={projects} />
          </>
     )
}
