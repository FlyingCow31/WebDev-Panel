import type { Metadata } from "next"
import { GetAvanceesClient, GetClient, GetDocumentsClient } from "../lib/client"
import { redirect } from "next/navigation"
import { DocumentSection, Progression, StepTable } from "../components/client/project"
import { Suspense } from "react"
import LogoutButton from "../components/root/LogoutButton"
import { ClientPageSkeleton } from "../components/LoadingSkeletons"

export const metadata: Metadata = { title: "Mon espace" }

export default function ClientPage() {
     return (
          <Suspense fallback={<ClientPageSkeleton />}>
               <ClientContent />
          </Suspense>
     )
}

async function ClientContent() {
     const data = await GetClient()
     if (!data) redirect("/login")

     const { client, projet } = data
     if (!client) redirect("/login")

     if (!projet) return <p className="p-6">Aucun projet en cours.</p>
     const avancees = await GetAvanceesClient(projet.proj_id)
     if (avancees === null) redirect("/login")

     const documents = await GetDocumentsClient(projet.proj_id)

     return (
          <div className="mx-auto flex max-w-300 flex-col gap-6 px-4 py-6 sm:px-6 lg:gap-7 lg:py-8">
               <header className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 basis-full flex-1 sm:basis-auto">
                         <div className="flex min-w-0 flex-col gap-1">
                              <span className="eyebrow">Gaël Tournier · Espace client</span>
                              <h1 className="page-title wrap-break-word">
                                   Bonjour {client?.client_pren} {client?.client_nom}
                              </h1>
                         </div>
                    </div>
                    <div className="ml-auto flex min-w-0 items-center gap-2">
                         <LogoutButton iconOnMobile />
                         <a href="mailto:contact@gaeltournier.dev" className="btn btn-icon shrink-0 sm:w-auto sm:px-5">
                              <svg
                                   width="20"
                                   height="20"
                                   viewBox="0 0 24 24"
                                   fill="none"
                                   stroke="currentColor"
                                   strokeWidth="2.2"
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                   aria-hidden="true"
                              >
                                   <rect x="3" y="5" width="18" height="14" />
                                   <path d="M3 7l9 6 9-6" />
                              </svg>
                              <span className="sr-only sm:not-sr-only">Me contacter</span>
                         </a>
                    </div>
               </header>

               <section aria-label="Statut du projet" className="card flex flex-col gap-5">
                    <Progression projet={projet as Parameters<typeof Progression>[0]["projet"]} avancee={avancees} />
               </section>

               <div className="grid min-w-0 items-start gap-6 lg:grid-main-aside lg:gap-7">
                    <section aria-labelledby="t-avancee" className="card flex min-w-0 flex-col gap-6">
                         <h2 id="t-avancee" className="section-title">
                              Avancée
                         </h2>
                         <StepTable avancee={avancees} projet={projet} />
                    </section>

                    <div className="flex min-w-0 flex-col gap-6 lg:gap-7">
                         <section aria-labelledby="t-docs" className="card flex flex-col gap-4">
                              <h2 id="t-docs" className="section-title">
                                   Vos documents
                              </h2>
                              <DocumentSection documents={documents ?? []} />
                              <p className="muted m-0 text-sm">Les nouveaux documents apparaitront ici!</p>
                         </section>

                         <section
                              aria-labelledby="t-contact"
                              className="flex flex-col gap-3.5 border-3 border-ink bg-ink p-5 text-white shadow-inverse-lg md:p-6"
                         >
                              <h2 id="t-contact" className="card-title">
                                   Une question ?
                              </h2>
                              <p className="m-0">Je réponds le plus rapidement possible!</p>
                              <a
                                   href="mailto:contact@gaeltournier.dev"
                                   className="break-all text-lg font-bold text-bg underline hover:text-white"
                              >
                                   contact@gaeltournier.dev
                              </a>
                              <a
                                   href="tel:+33600000000"
                                   className="break-all text-lg font-bold text-bg underline hover:text-white"
                              >
                                   06 58 53 82 54
                              </a>
                         </section>
                    </div>
               </div>
          </div>
     )
}
