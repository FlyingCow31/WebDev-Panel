import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { checkSite, normalizeDomain } from "@/app/lib/monitoring"
import { revalidateTag } from "next/cache"
import { after, NextRequest, NextResponse } from "next/server"
import z from "zod"

export const maxDuration = 300

const addSiteSchema = z.object({
     proj_id: z.coerce.number().int().positive("Projet invalide."),
     domain: z.string().trim().min(1, "Le domaine est obligatoire.").max(255, "Le domaine est trop long."),
})

export async function POST(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

     const body = await request.json().catch(() => null)
     const result = addSiteSchema.safeParse(body)
     if (!result.success) {
          const messages = result.error.issues.map((issue) => issue.message).join(" ")
          return NextResponse.json({ error: messages }, { status: 400 })
     }

     const domain = normalizeDomain(result.data.domain)
     if (!domain) return NextResponse.json({ error: "Domaine invalide (ex. : boulangerie-lafont.fr)." }, { status: 400 })

     const project = await sql`SELECT 1 FROM projet WHERE proj_id = ${result.data.proj_id}`
     if (project.length === 0) return NextResponse.json({ error: "Projet introuvable." }, { status: 404 })

     try {
          const inserted = await sql`
               INSERT INTO site (proj_id, site_domain)
               VALUES (${result.data.proj_id}, ${domain})
               RETURNING site_id`
          const site_id = inserted[0].site_id as number

          revalidateTag("sites", { expire: 0 })

          after(async () => {
               await checkSite(site_id).catch(() => console.error("Initial site check failed."))
               revalidateTag("sites", { expire: 0 })
          })

          return NextResponse.json({ success: true, site_id, domain })
     } catch (error) {
          if ((error as { code?: string }).code === "23505") {
               return NextResponse.json({ error: "Ce domaine est déjà surveillé." }, { status: 409 })
          }
          console.error("Site insert failed.")
          return NextResponse.json({ error: "Impossible d'ajouter le site." }, { status: 500 })
     }
}
