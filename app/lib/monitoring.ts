import tls from "node:tls"
import { sql } from "./db"
import type { SiteReport, SiteScores } from "./types"

const SSL_TIMEOUT = 10_000
const PAGESPEED_TIMEOUT = 90_000
const DOMAIN_PATTERN = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/

export function normalizeDomain(input: string): string | null {
     const domain = input
          .trim()
          .toLowerCase()
          .replace(/^[a-z]+:\/\//, "")
          .split(/[/?#]/)[0]
          .split(":")[0]
          .replace(/\.$/, "")

     return DOMAIN_PATTERN.test(domain) ? domain : null
}

export function checkSsl(domain: string): Promise<{ expiresAt: Date; valid: boolean }> {
     return new Promise((resolve, reject) => {
          const socket = tls.connect({
               host: domain,
               port: 443,
               servername: domain,
               rejectUnauthorized: false,
               timeout: SSL_TIMEOUT,
          })

          socket.once("secureConnect", () => {
               const certificate = socket.getPeerCertificate()
               const valid = socket.authorized
               socket.end()

               if (!certificate || !certificate.valid_to) {
                    reject(new Error("Aucun certificat présenté."))
                    return
               }
               resolve({ expiresAt: new Date(certificate.valid_to), valid })
          })

          socket.once("timeout", () => {
               socket.destroy()
               reject(new Error("Le serveur ne répond pas sur le port 443."))
          })

          socket.once("error", (error) => {
               socket.destroy()
               reject(error)
          })
     })
}

type PageSpeedCategory = { score: number | null }
type PageSpeedResponse = {
     lighthouseResult?: { categories?: Record<string, PageSpeedCategory | undefined> }
     error?: { message?: string }
}

export async function runLighthouse(domain: string): Promise<SiteScores> {
     const key = process.env.GOOGLE_API_KEY
     if (!key) throw new Error("GOOGLE_API_KEY manquante.")

     const url = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed")
     url.searchParams.set("url", `https://${domain}`)
     url.searchParams.set("strategy", "mobile")
     for (const category of ["performance", "accessibility", "best-practices", "seo"]) {
          url.searchParams.append("category", category)
     }
     url.searchParams.set("key", key)

     const response = await fetch(url, { signal: AbortSignal.timeout(PAGESPEED_TIMEOUT), cache: "no-store" })
     const data = (await response.json().catch(() => null)) as PageSpeedResponse | null

     if (!response.ok || !data?.lighthouseResult?.categories) {
          throw new Error(data?.error?.message ?? `PageSpeed a répondu ${response.status}.`)
     }

     const categories = data.lighthouseResult.categories
     const score = (name: string) => {
          const value = categories[name]?.score
          return typeof value === "number" ? Math.round(value * 100) : null
     }

     return {
          performance: score("performance"),
          accessibility: score("accessibility"),
          bestPractices: score("best-practices"),
          seo: score("seo"),
     }
}

function errorMessage(reason: unknown) {
     return reason instanceof Error ? reason.message : "Erreur inconnue."
}

export async function checkSite(site_id: number) {
     const rows = await sql`SELECT site_domain, site_lighthouse FROM site WHERE site_id = ${site_id}`
     const site = rows[0] as { site_domain: string; site_lighthouse: SiteReport | null } | undefined
     if (!site) return null

     const [ssl, lighthouse] = await Promise.allSettled([checkSsl(site.site_domain), runLighthouse(site.site_domain)])

     const previous = site.site_lighthouse ?? {}
     const errors: SiteReport["errors"] = {}
     if (ssl.status === "rejected") errors.ssl = errorMessage(ssl.reason)
     if (lighthouse.status === "rejected") errors.lighthouse = errorMessage(lighthouse.reason)

     const report: SiteReport = {
          strategy: "mobile",
          scores: lighthouse.status === "fulfilled" ? lighthouse.value : previous.scores,
          sslValid: ssl.status === "fulfilled" ? ssl.value.valid : previous.sslValid,
          ...(errors.ssl || errors.lighthouse ? { errors } : {}),
     }

     const expiresAt = ssl.status === "fulfilled" ? ssl.value.expiresAt.toISOString().slice(0, 10) : null

     await sql`
          UPDATE site
          SET site_ssl_expires_at = COALESCE(${expiresAt}::date, site_ssl_expires_at),
              site_lighthouse = ${JSON.stringify(report)}::jsonb,
              site_checked_at = now()
          WHERE site_id = ${site_id}`

     return { site_id, domain: site.site_domain, ok: !report.errors, errors: report.errors }
}

export async function checkSites(options: { staleOnly?: boolean } = {}) {
     const rows = options.staleOnly
          ? await sql`
               SELECT site_id FROM site
               WHERE site_checked_at IS NULL OR site_checked_at < now() - interval '20 hours'
               ORDER BY site_checked_at ASC NULLS FIRST`
          : await sql`SELECT site_id FROM site ORDER BY site_checked_at ASC NULLS FIRST`

     const results = await Promise.allSettled(rows.map((row) => checkSite(row.site_id as number)))
     return results.map((r) => (r.status === "fulfilled" ? r.value : { ok: false, errors: { ssl: errorMessage(r.reason) } }))
}
