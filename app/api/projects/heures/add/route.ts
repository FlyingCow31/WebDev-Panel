import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const addTimeSchema = z.object({
     proj_id: z.number().int().positive(),
     tps_type: z.enum(["rem", "nonrem"]),
     tps_minutes: z
          .number()
          .int()
          .positive("La durée doit être supérieure à 0.")
          .max(24 * 60, "Impossible d'ajouter plus de 24 h d'un coup."),
})

export async function PATCH(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

     const body = await request.json().catch(() => null)
     const result = addTimeSchema.safeParse(body)

     if (!result.success) {
          const messages = result.error.issues.map((issue) => issue.message).join(" ")
          return NextResponse.json({ error: messages }, { status: 400 })
     }

     const { proj_id, tps_type, tps_minutes } = result.data

     const updated =
          tps_type === "rem"
               ? await sql`UPDATE projet SET proj_tps_rem = proj_tps_rem + ${tps_minutes} WHERE proj_id = ${proj_id} RETURNING proj_tps_rem, proj_tps_non_rem`
               : await sql`UPDATE projet SET proj_tps_non_rem = proj_tps_non_rem + ${tps_minutes} WHERE proj_id = ${proj_id} RETURNING proj_tps_rem, proj_tps_non_rem`

     if (updated.length === 0) return NextResponse.json({ error: "Projet introuvable." }, { status: 404 })

     revalidateTag(`project-n${proj_id}`, { expire: 0 })
     revalidateTag("projets", { expire: 0 })

     return NextResponse.json({ success: true, ...updated[0] })
}
