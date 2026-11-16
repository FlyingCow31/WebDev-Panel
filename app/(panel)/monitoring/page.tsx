import { CheckRedirect } from "@/app/lib/auth/auth"
import { getProjects, getSites } from "@/app/lib/data"
import type { Site, SiteScores } from "@/app/lib/types"
import AddSiteModal from "@/app/components/monitoring/AddSiteModal"
import CheckButton from "@/app/components/monitoring/CheckButton"
import DeleteSite from "@/app/components/monitoring/DeleteSite"
import { Suspense } from "react"
import { MonitoringPageSkeleton } from "@/app/components/LoadingSkeletons"

const scoreColumns: { key: keyof SiteScores; label: string }[] = [
     { key: "performance", label: "Perf." },
     { key: "accessibility", label: "Access." },
     { key: "bestPractices", label: "Bonnes prat." },
     { key: "seo", label: "SEO" },
]

const legend = [
     { label: "90-100", className: "bg-colsol" },
     { label: "50-89", className: "bg-soft" },
     { label: "0-49", className: "bg-colerr" },
]

const parisDateTime = new Intl.DateTimeFormat("fr-FR", {
     day: "2-digit",
     month: "2-digit",
     hour: "2-digit",
     minute: "2-digit",
     timeZone: "Europe/Paris",
})

const parisDate = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Paris" })

function sslStatus(site: Site): { label: string; className: string } {
     if (!site.site_checked_at) return { label: "En attente", className: "pill-planned" }
     if (site.site_lighthouse?.errors?.ssl) return { label: "Injoignable", className: "pill-late" }
     if (site.site_lighthouse?.sslValid === false) return { label: "Invalide", className: "pill-late" }
     if (site.ssl_days_left === null) return { label: "Inconnu", className: "pill-planned" }
     if (site.ssl_days_left < 0) return { label: "Expiré", className: "pill-late" }
     if (site.ssl_days_left < 14) return { label: `${site.ssl_days_left} j`, className: "pill-late" }
     if (site.ssl_days_left < 30) return { label: `${site.ssl_days_left} j`, className: "pill-client" }
     return { label: `${site.ssl_days_left} j`, className: "pill-done" }
}

function alertReason(site: Site) {
     const errors = site.site_lighthouse?.errors
     if (errors?.ssl) return `Certificat : ${errors.ssl}`
     if (site.site_lighthouse?.sslValid === false) return "Certificat invalide (non reconnu ou ne correspond pas au domaine)."
     if (site.ssl_days_left !== null && site.ssl_days_left < 0) return "Le certificat a expiré."
     if (site.ssl_days_left !== null && site.ssl_days_left < 14) return `Le certificat expire dans ${site.ssl_days_left} jour(s).`
     if (errors?.lighthouse) return `Lighthouse : ${errors.lighthouse}`
     return "Vérification à refaire."
}

export default function MonitoringPage() {
     return (
          <Suspense fallback={<MonitoringPageSkeleton />}>
               <MonitoringPageContent />
          </Suspense>
     )
}

async function MonitoringPageContent() {
     await CheckRedirect()
     const [sites, projects] = await Promise.all([getSites(), getProjects()])

     const alerts = sites.filter((s) => s.in_alert)
     const lastCheck = sites
          .map((s) => s.site_checked_at)
          .filter((d): d is Date => d !== null)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]

     const projectOptions = projects
          .map((p) => ({ proj_id: p.proj_id, label: p.proj_nom }))

     return (
          <>
               <header className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                         <h1 className="page-title">Monitoring.</h1>
                         <span className="font-medium">
                              {sites.length === 0 ? (
                                   "Aucun site surveillé"
                              ) : (
                                   <>
                                        {sites.length - alerts.length} site{sites.length > 1 ? "s" : ""} sur {sites.length} OK
                                        {alerts.length > 0 && (
                                             <>
                                                  {" "}
                                                  · <strong>{alerts.length} alerte{alerts.length > 1 ? "s" : ""}</strong>
                                             </>
                                        )}
                                        {lastCheck && <> · dernière vérification le {parisDateTime.format(new Date(lastCheck))}</>}
                                   </>
                              )}
                         </span>
                    </div>
                    <div className="flex flex-wrap items-start gap-3">
                         <AddSiteModal projects={projectOptions} />
                         {sites.length > 0 && <CheckButton />}
                    </div>
               </header>

               {alerts.map((site) => (
                    <section key={site.site_id} role="alert" className="card-sm flex flex-wrap items-center gap-x-5 gap-y-3 bg-colerr">
                         <strong>{site.site_domain}</strong>
                         <span className="text-body-sm">{alertReason(site)}</span>
                         <div className="sm:ml-auto">
                              <CheckButton siteId={site.site_id} domain={site.site_domain} />
                         </div>
                    </section>
               ))}

               {sites.length === 0 ? (
                    <section className="card flex flex-col gap-2">
                         <h2 className="card-title">Aucun site pour l&apos;instant</h2>
                         <p className="muted m-0">Ajoutez le domaine d&apos;un site livré pour surveiller son certificat SSL et ses scores Lighthouse.</p>
                    </section>
               ) : (
                    <section aria-label="Sites surveillés" className="card overflow-x-auto p-0 md:p-0">
                         <table className="table min-w-225">
                              <thead>
                                   <tr>
                                        <th scope="col">Site</th>
                                        <th scope="col">SSL</th>
                                        {scoreColumns.map((c) => (
                                             <th key={c.key} scope="col">
                                                  {c.label}
                                             </th>
                                        ))}
                                        <th scope="col">Vérifié le</th>
                                        <th scope="col">
                                             <span className="sr-only">Actions</span>
                                        </th>
                                   </tr>
                              </thead>
                              <tbody>
                                   {sites.map((site) => {
                                        const ssl = sslStatus(site)
                                        const scores = site.site_lighthouse?.scores
                                        return (
                                             <tr key={site.site_id}>
                                                  <td>
                                                       <div className="flex flex-col">
                                                            <a href={`https://${site.site_domain}`} target="_blank" rel="noopener noreferrer" className="link font-bold">
                                                                 {site.site_domain}
                                                            </a>
                                                            <span className="muted text-caption">
                                                                 {site.client_label} · {site.proj_nom}
                                                            </span>
                                                       </div>
                                                  </td>
                                                  <td>
                                                       <div className="flex flex-col items-start gap-1">
                                                            <span className={`pill ${ssl.className}`}>{ssl.label}</span>
                                                            {site.site_ssl_expires_at && (
                                                                 <span className="muted text-caption">
                                                                      Exp. {parisDate.format(new Date(site.site_ssl_expires_at))}
                                                                 </span>
                                                            )}
                                                       </div>
                                                  </td>
                                                  {scoreColumns.map((c) => {
                                                       const score = scores?.[c.key]
                                                       return (
                                                            <td key={c.key}>
                                                                 {typeof score === "number" ? (
                                                                      <span className={`score ${score >= 90 ? "bg-colsol" : score >= 50 ? "bg-soft" : "bg-colerr"}`}>
                                                                           {score}
                                                                      </span>
                                                                 ) : (
                                                                      <span className="muted">-</span>
                                                                 )}
                                                            </td>
                                                       )
                                                  })}
                                                  <td className="muted">
                                                       {site.site_checked_at ? parisDateTime.format(new Date(site.site_checked_at)) : "Jamais"}
                                                       {site.site_lighthouse?.errors?.lighthouse && (
                                                            <span className="block text-caption font-bold text-colerr-dark" title={site.site_lighthouse.errors.lighthouse}>
                                                                 Lighthouse en échec
                                                            </span>
                                                       )}
                                                  </td>
                                                  <td>
                                                       <div className="flex items-center justify-end gap-3">
                                                            <CheckButton siteId={site.site_id} domain={site.site_domain} />
                                                            <DeleteSite siteId={site.site_id} />
                                                       </div>
                                                  </td>
                                             </tr>
                                        )
                                   })}
                              </tbody>
                         </table>
                    </section>
               )}

               <p className="m-0 flex flex-wrap items-center gap-4 text-sm">
                    {legend.map((l) => (
                         <span key={l.label} className="inline-flex items-center gap-1.5">
                              <span className={`size-3.5 border-2 border-ink ${l.className}`} />
                              {l.label}
                         </span>
                    ))}
                    <span className="muted">Scores Lighthouse mobile · SSL : jours restants avant expiration</span>
               </p>
          </>
     )
}
