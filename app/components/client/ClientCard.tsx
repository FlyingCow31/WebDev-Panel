"use client"

import { Check, Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import DeleteButton from "./DeleteButton"

export type ClientCardData = {
     client_id: number
     client_nom: string
     client_pren: string
     client_bus: string
     client_siret: string
     client_tel: string
     client_contact_mail: string
     client_add: string
     client_notes: string
     createdAt: string
}

type FormKey = Exclude<keyof ClientCardData, "client_id" | "createdAt">

const inputs: {
     key: FormKey
     label: string
     type?: string
     wide?: boolean
     multiline?: boolean
     inputMode?: "numeric" | "tel"
     maxLength?: number
}[] = [
     { key: "client_pren", label: "Prénom", maxLength: 110 },
     { key: "client_nom", label: "Nom", maxLength: 110 },
     { key: "client_siret", label: "SIRET", inputMode: "numeric", maxLength: 14 },
     { key: "client_tel", label: "Téléphone", type: "tel", inputMode: "tel", maxLength: 20 },
     { key: "client_contact_mail", label: "E-mail", type: "email", wide: true, maxLength: 255 },
     { key: "client_add", label: "Adresse", wide: true, maxLength: 255 },
     { key: "client_notes", label: "Notes", wide: true, multiline: true },
]

export default function ClientCard({ client }: { client: ClientCardData }) {
     const router = useRouter()
     const [editing, setEditing] = useState(false)
     const [saving, setSaving] = useState(false)
     const [error, setError] = useState("")
     const [form, setForm] = useState(client)

     const fields = [
          { label: "Contact", value: `${client.client_pren} ${client.client_nom}`, strong: true },
          { label: "SIRET", value: client.client_siret || "Aucun SIRET." },
          { label: "E-mail", value: client.client_contact_mail, href: `mailto:${client.client_contact_mail}` },
          { label: "Téléphone", value: client.client_tel, href: `tel:${client.client_tel}` },
          { label: "Adresse", value: client.client_add, wide: true },
          { label: "Notes", value: client.client_notes || "Rien!", wide: true },
     ]

     function startEditing() {
          setForm(client)
          setError("")
          setEditing(true)
     }

     function update(key: FormKey, value: string) {
          setForm({ ...form, [key]: value })
     }

     async function save() {
          setSaving(true)
          setError("")
          try {
               const { createdAt, ...data } = form
               void createdAt
               const response = await fetch("/api/auth/client/modify", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
               })
               if (!response.ok) {
                    const body = await response.json().catch(() => null)
                    setError(body?.error ?? "Impossible d'enregistrer les modifications.")
                    return
               }
               setEditing(false)
               router.refresh()
          } catch {
               setError("Impossible d'enregistrer les modifications.")
          } finally {
               setSaving(false)
          }
     }

     return (
          <section aria-labelledby="h-fiche" className="card flex min-w-0 flex-col gap-5">
               <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                         <div
                              aria-hidden="true"
                              className="flex size-15 flex-none items-center justify-center border-3 border-ink bg-main font-display text-2xl text-white"
                         >
                              {client.client_nom.slice(0, 1) + client.client_pren.slice(0, 1)}
                         </div>
                         <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                              {editing ? (
                                   <input
                                        id="h-fiche"
                                        type="text"
                                        aria-label="Entreprise"
                                        maxLength={110}
                                        value={form.client_bus}
                                        onChange={(e) => update("client_bus", e.target.value)}
                                        placeholder="Entreprise"
                                        className="field font-display text-xl"
                                   />
                              ) : (
                                   <h2 id="h-fiche" className="section-title break-words [overflow-wrap:anywhere]">
                                        {client.client_bus || `${client.client_pren} ${client.client_nom}`}
                                   </h2>
                              )}
                              <span className="muted text-body-sm [overflow-wrap:anywhere]">
                                   Client n°{client.client_id} · depuis le {client.createdAt}
                              </span>
                         </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                         {editing && <DeleteButton client_id={client.client_id} />}
                         {editing && (
                              <button type="button" onClick={() => setEditing(false)} disabled={saving} className="btn btn-sm shadow-none">
                                   Annuler
                              </button>
                         )}
                         <button
                              type="button"
                              onClick={editing ? save : startEditing}
                              disabled={saving}
                              className={`btn btn-sm gap-2 shadow-none disabled:opacity-50 ${editing ? "bg-colsol" : ""}`}
                         >
                              {editing ? <Check size={16} strokeWidth={3} /> : <Pencil size={16} strokeWidth={2.5} />}
                              {saving ? "Enregistrement…" : editing ? "Enregistrer" : "Modifier"}
                         </button>
                    </div>
               </div>

               {editing ? (
                    <div className="grid gap-x-7 gap-y-4 sm:grid-cols-2">
                         {inputs.map((f) => (
                              <div key={f.key} className={`flex flex-col gap-1.5 ${f.wide ? "sm:col-span-2" : ""}`}>
                                   <label htmlFor={`edit-${f.key}`} className="eyebrow muted">
                                        {f.label}
                                   </label>
                                   {f.multiline ? (
                                        <textarea
                                             id={`edit-${f.key}`}
                                             rows={3}
                                             value={form[f.key]}
                                             onChange={(e) => update(f.key, e.target.value)}
                                             className="field"
                                        />
                                   ) : (
                                        <input
                                             id={`edit-${f.key}`}
                                             type={f.type ?? "text"}
                                             inputMode={f.inputMode}
                                             maxLength={f.maxLength}
                                             value={form[f.key]}
                                             onChange={(e) => update(f.key, e.target.value)}
                                             className="field"
                                        />
                                   )}
                              </div>
                         ))}
                    </div>
               ) : (
                    <dl className="m-0 grid min-w-0 gap-x-7 gap-y-4 sm:grid-cols-2">
                         {fields.map((f) => (
                              <div
                                   key={f.label}
                                   className={`flex min-w-0 flex-col gap-1 ${f.wide ? "sm:col-span-2" : ""}`}
                              >
                                   <dt className="eyebrow muted">{f.label}</dt>
                                   <dd
                                        className={`m-0 leading-relaxed [overflow-wrap:anywhere] ${f.strong ? "font-bold" : ""}`}
                                   >
                                        {f.href && f.value ? (
                                             <a href={f.href} className="link break-all font-normal">
                                                  {f.value}
                                             </a>
                                        ) : (
                                             f.value || "-"
                                        )}
                                   </dd>
                              </div>
                         ))}
                    </dl>
               )}

               {error && (
                    <span role="alert" className="text-caption font-bold text-colerr-dark">
                         {error}
                    </span>
               )}
          </section>
     )
}
