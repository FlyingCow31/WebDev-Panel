import { Suspense } from "react"
import Link from "next/link"
import { getClients, getProjects } from "@/app/lib/data"
import { CheckRedirect } from "@/app/lib/auth/auth"
import NewClientModal from "@/app/components/client/NewClientModal"

import ClientCard from "@/app/components/client/ClientCard"
import { sql } from "@/app/lib/db"
import DownloadButton from "@/app/components/documents/DownloadButton"
import DeleteDocument from "@/app/components/documents/DeleteDocument"
import UploadDocumentModal from "@/app/components/documents/UploadDocumentModal"
import { ClientsPageSkeleton } from "@/app/components/LoadingSkeletons"

type ClientDocument = {
     document_id: number
     document_nom: string
     document_type: string
     document_visible_client: boolean
     document_created_at: Date
     proj_nom: string
}

export default function ClientsPage({ searchParams }: { searchParams: Promise<{ id?: string; q?: string }> }) {
     return (
          <>
               <header className="flex flex-wrap items-end justify-between gap-4">
                    <h1 className="page-title">Clients.</h1>
                    <NewClientModal />
               </header>

               <Suspense fallback={<ClientsPageSkeleton />}>
                    <SelectedClient searchParams={searchParams} />
               </Suspense>
          </>
     )
}

async function SelectedClient({ searchParams }: { searchParams: Promise<{ id?: string; q?: string }> }) {
     const { id, q = "" } = await searchParams
     return <ClientsView clientId={id} query={q} />
}

async function ClientsView({ clientId, query }: { clientId?: string; query: string }) {
     await CheckRedirect()
     const clients = await getClients()
     const projects = await getProjects()

     const filteredClients = clients.filter((c) => c.client_bus.toLowerCase().includes(query.toLowerCase()))
     const current = clients.find((c) => c.client_id === Number(clientId)) ?? filteredClients[0] ?? clients[0]

     const activeProjects = projects.filter((p) => p.client_id === current.client_id)

     const documents = (await sql`
          SELECT d.document_id, d.document_nom, d.document_type, d.document_visible_client, d.document_created_at, p.proj_nom
          FROM document d
          JOIN projet p ON p.proj_id = d.proj_id
          WHERE p.client_id = ${current.client_id}
          ORDER BY d.document_created_at DESC`) as ClientDocument[]

     return (
          <div className="grid w-full min-w-0 items-start gap-6 lg:gap-7 xl:grid-aside-main">
               <section aria-label="Liste des clients" className="card flex min-w-0 flex-col gap-3 p-4 md:p-4">
                    <label htmlFor="q" className="sr-only">
                         Rechercher un client
                    </label>
                    <form method="get">
                         <input
                              id="q"
                              name="q"
                              type="search"
                              placeholder="Rechercher…"
                              defaultValue={query}
                              className="field"
                         />
                    </form>
                    <ul className="m-0 flex max-w-full list-none gap-2 overflow-x-auto p-0 pb-1 xl:flex-col xl:overflow-visible xl:pb-0">
                         {filteredClients.map((c) => {
                              const active = c.client_id === current.client_id

                              return (
                                   <li key={c.client_id} className="shrink-0">
                                        <Link
                                             href={`/clients?id=${c.client_id}`}
                                             aria-current={active ? "true" : undefined}
                                             className="item flex flex-col gap-0.5 text-ink no-underline current:bg-ink current:text-white"
                                        >
                                             <strong>{c.client_bus}</strong>
                                             <span className={`text-sm ${active ? "text-soft" : "muted"}`}>
                                                  {projects.find((p) => p.client_id === c.client_id)?.proj_nom}
                                             </span>
                                        </Link>
                                   </li>
                              )
                         })}
                    </ul>
               </section>

               <div className="flex min-w-0 flex-col gap-6">
                    <ClientCard
                         key={current.client_id}
                         client={{
                              client_id: current.client_id,
                              client_nom: current.client_nom,
                              client_pren: current.client_pren,
                              client_bus: current.client_bus ?? "",
                              client_siret: current.client_siret ? String(current.client_siret) : "",
                              client_tel: current.client_tel ? String(current.client_tel) : "",
                              client_contact_mail: current.client_contact_mail ?? "",
                              client_add: current.client_add ?? "",
                              client_notes: current.client_notes ?? "",
                              createdAt: current.client_created_at.toLocaleDateString("fr-FR"),
                         }}
                    />

                    <div className="grid min-w-0 gap-6 md:grid-cols-2">
                         <section aria-labelledby="h-cproj" className="card-sm flex min-w-0 flex-col gap-3">
                              <h3 id="h-cproj" className="card-title">
                                   Projets
                              </h3>
                              {activeProjects.map((p, i) => {
                                   return (
                                        <Link
                                             key={i}
                                             href={`/projets/${p.proj_id}`}
                                             className="item flex min-w-0 items-center justify-between gap-2.5 text-ink no-underline"
                                        >
                                             <strong className="min-w-0 break-words [overflow-wrap:anywhere]">{p.proj_nom}</strong>
                                             <span className="pill pill-client">Accèder au projet</span>
                                        </Link>
                                   )
                              })}
                         </section>
                         <section aria-labelledby="h-cdocs" className="card-sm flex min-w-0 flex-col gap-3">
                              <h3 id="h-cdocs" className="card-title">
                                   Documents partagés
                              </h3>
                              {documents.length === 0 && <p className="muted m-0 text-body-sm">Aucun document.</p>}
                              {documents.map((d) => (
                                   <div key={d.document_id} className="flex items-center gap-3 text-body-sm">
                                        <div className="flex min-w-0 flex-1 flex-col">
                                             <span className="truncate font-bold">{d.document_nom}</span>
                                             <span className="muted text-caption">
                                                  {d.proj_nom} · {d.document_created_at.toLocaleDateString("fr-FR")}
                                                  {!d.document_visible_client && " · masqué"}
                                             </span>
                                        </div>
                                        <DownloadButton documentId={d.document_id} fileName={d.document_nom} />
                                        <DeleteDocument documentId={d.document_id} />
                                   </div>
                              ))}
                              <UploadDocumentModal
                                   projects={activeProjects.map((p) => ({ proj_id: p.proj_id, label: p.proj_nom }))}
                              />
                         </section>
                    </div>
               </div>
          </div>
     )
}
