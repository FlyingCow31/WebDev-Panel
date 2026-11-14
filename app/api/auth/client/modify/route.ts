import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const optional = (max: number) => z.string().trim().max(max).transform((v) => v || null)

const modifySchema = z.object({
     client_id: z.number().int().positive(),
     client_nom: z.string().trim().min(1, "Le nom est obligatoire.").max(110),
     client_pren: z.string().trim().min(1, "Le prénom est obligatoire.").max(110),
     client_bus: optional(110),
     client_siret: z
          .string()
          .trim()
          .regex(/^([0-9]{14})?$/, "Le SIRET doit contenir 14 chiffres.")
          .transform((v) => v || null),
     client_tel: optional(20),
     client_contact_mail: z.union([z.literal(""), z.email("E-mail invalide.")]).transform((v) => v || null),
     client_add: optional(255),
     client_notes: z.string().trim().transform((v) => v || null),
})

export async function PATCH(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

     const body = await request.json().catch(() => null)
     const result = modifySchema.safeParse(body)

     if (!result.success) {
          const messages = result.error.issues.map((issue) => issue.message).join(" ")
          return NextResponse.json({ error: messages }, { status: 400 })
     }

     const c = result.data

     const updated = await sql`
          UPDATE client
          SET client_nom = ${c.client_nom},
              client_pren = ${c.client_pren},
              client_bus = ${c.client_bus},
              client_siret = ${c.client_siret},
              client_tel = ${c.client_tel},
              client_contact_mail = ${c.client_contact_mail},
              client_add = ${c.client_add},
              client_notes = ${c.client_notes}
          WHERE client_id = ${c.client_id}
          RETURNING client_id`

     if (updated.length === 0) return NextResponse.json({ error: "Client introuvable." }, { status: 404 })

     revalidateTag("clients", { expire: 0 })
     revalidateTag(`client-n${c.client_id}`, { expire: 0 })

     return NextResponse.json({ success: true })
}
