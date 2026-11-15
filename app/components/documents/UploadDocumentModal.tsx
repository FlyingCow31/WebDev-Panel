"use client"

import { Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

export type UploadProject = { proj_id: number; label: string }

const types = [
     { value: "devis", label: "Devis" },
     { value: "onboarding", label: "Onboarding" },
     { value: "facture", label: "Facture" },
     { value: "autre", label: "Autre" },
]

const MAX_SIZE = 4 * 1024 * 1024

export default function UploadDocumentModal({ projects }: { projects: UploadProject[] }) {
     const router = useRouter()
     const dialogRef = useRef<HTMLDialogElement>(null)
     const formRef = useRef<HTMLFormElement>(null)
     const [fileName, setFileName] = useState("")
     const [sending, setSending] = useState(false)
     const [error, setError] = useState("")

     function open() {
          formRef.current?.reset()
          setFileName("")
          setError("")
          dialogRef.current?.showModal()
     }

     function close() {
          dialogRef.current?.close()
     }

     function pickFile(file: File | undefined) {
          setError("")
          if (!file) return setFileName("")
          if (file.size > MAX_SIZE) {
               setError("Le fichier dépasse 4 Mo.")
               return setFileName("")
          }
          setFileName(file.name)
     }

     async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
          e.preventDefault()
          setSending(true)
          setError("")
          try {
               const response = await fetch("/api/documents/upload", {
                    method: "POST",
                    body: new FormData(e.currentTarget),
               })
               if (!response.ok) {
                    const data = await response.json().catch(() => null)
                    setError(data?.error ?? "Impossible d'envoyer le document.")
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

     if (projects.length === 0) {
          return <p className="muted m-0 text-caption">Créez un projet pour déposer des documents.</p>
     }

     return (
          <>
               <button type="button" onClick={open} className="btn btn-sm btn-dashed">
                    + Déposer un document
               </button>

               <dialog
                    ref={dialogRef}
                    aria-labelledby="h-upload"
                    className="m-auto max-h-dvh w-full max-w-xl overflow-y-auto border-3 border-ink bg-surface p-0 text-ink shadow-brutal-xl backdrop:bg-ink/55"
               >
                    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5 p-5 sm:p-7">
                         <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-col gap-1">
                                   <h2 id="h-upload" className="section-title">
                                        Déposer un document
                                   </h2>
                                   <span className="muted text-body-sm">PDF, PNG, JPEG ou WebP · 4 Mo maximum</span>
                              </div>
                              <button type="button" aria-label="Fermer" onClick={close} className="btn btn-icon btn-sm flex-none shadow-none">
                                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                                        <path d="M6 6l12 12M18 6L6 18" />
                                   </svg>
                              </button>
                         </div>

                         <label className="item flex cursor-pointer flex-col items-center gap-2 border-dashed px-4 py-7 text-center has-focus-visible:outline-3 has-focus-visible:outline-main">
                              <Upload size={28} strokeWidth={2.4} aria-hidden="true" />
                              <strong>{fileName || "Choisir un fichier"}</strong>
                              <span className="muted text-caption">{fileName ? "Cliquez pour en choisir un autre" : "Cliquez pour parcourir"}</span>
                              <input
                                   type="file"
                                   name="file"
                                   required
                                   accept="application/pdf,image/png,image/jpeg,image/webp"
                                   onChange={(e) => pickFile(e.target.files?.[0])}
                                   className="sr-only"
                              />
                         </label>

                         {projects.length > 1 ? (
                              <div className="flex flex-col gap-2">
                                   <label htmlFor="up-proj" className="label">
                                        Projet
                                   </label>
                                   <select id="up-proj" name="proj_id" required className="field">
                                        {projects.map((p) => (
                                             <option key={p.proj_id} value={p.proj_id}>
                                                  {p.label}
                                             </option>
                                        ))}
                                   </select>
                              </div>
                         ) : (
                              <input type="hidden" name="proj_id" value={projects[0].proj_id} />
                         )}

                         <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
                              <legend className="label mb-2 p-0">Type</legend>
                              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                                   {types.map((t, i) => (
                                        <label
                                             key={t.value}
                                             className="btn btn-sm cursor-pointer shadow-none has-checked:bg-ink has-checked:text-white has-focus-visible:outline-3 has-focus-visible:outline-main"
                                        >
                                             <input type="radio" name="type" value={t.value} defaultChecked={i === 0} className="sr-only" />
                                             {t.label}
                                        </label>
                                   ))}
                              </div>
                         </fieldset>

                         <label className="item flex cursor-pointer items-center justify-between gap-3">
                              <span className="flex flex-col gap-0.5">
                                   <strong>Visible par le client</strong>
                                   <span className="muted text-sm">Le client pourra le télécharger depuis son espace.</span>
                              </span>
                              <input type="checkbox" role="switch" name="visible" defaultChecked className="switch-input sr-only" />
                              <span aria-hidden="true" className="switch" />
                         </label>

                         {error && (
                              <span role="alert" className="text-caption font-bold text-colerr-dark">
                                   {error}
                              </span>
                         )}

                         <div className="flex flex-wrap justify-end gap-3">
                              <button type="button" onClick={close} className="btn">
                                   Annuler
                              </button>
                              <button type="submit" disabled={sending || !fileName} className="btn btn-primary shadow-accent disabled:opacity-50">
                                   {sending ? "Envoi…" : "Déposer"}
                              </button>
                         </div>
                    </form>
               </dialog>
          </>
     )
}
