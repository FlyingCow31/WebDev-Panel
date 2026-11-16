"use client"

import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

export type SiteProject = { proj_id: number; label: string }

export default function AddSiteModal({ projects }: { projects: SiteProject[] }) {
     const router = useRouter()
     const dialogRef = useRef<HTMLDialogElement>(null)
     const formRef = useRef<HTMLFormElement>(null)
     const [sending, setSending] = useState(false)
     const [error, setError] = useState("")

     function open() {
          formRef.current?.reset()
          setError("")
          dialogRef.current?.showModal()
     }

     function close() {
          dialogRef.current?.close()
     }

     async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
          e.preventDefault()
          setSending(true)
          setError("")
          try {
               const data = Object.fromEntries(new FormData(e.currentTarget))
               const response = await fetch("/api/monitoring/sites", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
               })
               if (!response.ok) {
                    const body = await response.json().catch(() => null)
                    setError(body?.error ?? "Impossible d'ajouter le site.")
                    return
               }
               close()
               router.refresh()
          } catch {
               setError("Erreur réseau.")
          } finally {
               setSending(false)
          }
     }

     return (
          <>
               <button type="button" onClick={open} disabled={projects.length === 0} className="btn disabled:opacity-50">
                    + Ajouter un site
               </button>

               <dialog
                    ref={dialogRef}
                    aria-labelledby="h-site"
                    className="m-auto max-h-dvh w-full max-w-xl overflow-y-auto border-3 border-ink bg-surface p-0 text-ink shadow-brutal-xl backdrop:bg-ink/55"
               >
                    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5 p-5 sm:p-7">
                         <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-col gap-1">
                                   <h2 id="h-site" className="section-title">
                                        Ajouter un site
                                   </h2>
                                   <span className="muted text-body-sm">Le certificat SSL et les scores Lighthouse seront vérifiés chaque jour.</span>
                              </div>
                              <button type="button" aria-label="Fermer" onClick={close} className="btn btn-icon btn-sm flex-none shadow-none">
                                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                                        <path d="M6 6l12 12M18 6L6 18" />
                                   </svg>
                              </button>
                         </div>

                         <div className="flex flex-col gap-2">
                              <label htmlFor="site-domain" className="label">
                                   Domaine *
                              </label>
                              <input
                                   id="site-domain"
                                   name="domain"
                                   type="text"
                                   required
                                   maxLength={255}
                                   inputMode="url"
                                   autoComplete="off"
                                   placeholder="boulangerie-lafont.fr"
                                   className="field"
                              />
                              <span className="muted text-caption">Collez l&apos;adresse complète si besoin : « https:// » et le chemin sont retirés.</span>
                         </div>

                         <div className="flex flex-col gap-2">
                              <label htmlFor="site-proj" className="label">
                                   Projet *
                              </label>
                              <select id="site-proj" name="proj_id" required className="field">
                                   {projects.map((p) => (
                                        <option key={p.proj_id} value={p.proj_id}>
                                             {p.label}
                                        </option>
                                   ))}
                              </select>
                         </div>

                         {error && (
                              <span role="alert" className="text-caption font-bold text-colerr-dark">
                                   {error}
                              </span>
                         )}

                         <div className="flex flex-wrap justify-end gap-3">
                              <button type="button" onClick={close} className="btn">
                                   Annuler
                              </button>
                              <button type="submit" disabled={sending} className="btn btn-primary shadow-accent disabled:opacity-50">
                                   {sending ? "Ajout…" : "Ajouter le site"}
                              </button>
                         </div>
                    </form>
               </dialog>
          </>
     )
}
