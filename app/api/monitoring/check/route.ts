import { AdminCheck } from "@/app/lib/auth/auth"
import { checkSite, checkSites } from "@/app/lib/monitoring"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

export const maxDuration = 300

const checkSchema = z.object({
     site_id: z.number().int().positive().optional(),
})

export async function POST(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

     const body = await request.json().catch(() => ({}))
     const result = checkSchema.safeParse(body)
     if (!result.success) return NextResponse.json({ error: "Requête invalide." }, { status: 400 })

     const { site_id } = result.data

     if (site_id) {
          const report = await checkSite(site_id)
          if (!report) return NextResponse.json({ error: "Site introuvable." }, { status: 404 })
          revalidateTag("sites", { expire: 0 })
          return NextResponse.json({ success: true, results: [report] })
     }

     const results = await checkSites()
     revalidateTag("sites", { expire: 0 })
     return NextResponse.json({ success: true, results })
}
