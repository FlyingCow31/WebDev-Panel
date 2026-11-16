import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { del, put } from "@vercel/blob"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const MAX_SIZE = 4 * 1024 * 1024
const ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp"]

const uploadSchema = z.object({
     file: z
          .instanceof(File, { message: "Aucun fichier." })
          .refine((f) => f.size > 0, "Le fichier est vide.")
          .refine((f) => f.size <= MAX_SIZE, "Le fichier dépasse 4 Mo.")
          .refine((f) => ALLOWED_TYPES.includes(f.type), "Format non autorisé (PDF, PNG, JPEG ou WebP)."),
     proj_id: z.coerce.number().int().positive("Projet invalide."),
     type: z.enum(["devis", "onboarding", "facture", "autre"], { message: "Type de document invalide." }),
     visible: z.string().nullable().transform((v) => v === "on" || v === "true"),
})

export async function POST(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

     const form = await request.formData().catch(() => null)
     if (!form) return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 })

     const result = uploadSchema.safeParse({
          file: form.get("file"),
          proj_id: form.get("proj_id"),
          type: form.get("type"),
          visible: form.get("visible"),
     })

     if (!result.success) {
          const messages = result.error.issues.map((issue) => issue.message).join(" ")
          return NextResponse.json({ error: messages }, { status: 400 })
     }

     const { file, proj_id, type, visible } = result.data

     const project = await sql`SELECT 1 FROM projet WHERE proj_id = ${proj_id}`
     if (project.length === 0) return NextResponse.json({ error: "Projet introuvable." }, { status: 404 })

     const name = file.name.replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 200)

     const blob = await put(`projets/${proj_id}/${name}`, file, {
          access: "private",
          addRandomSuffix: true,
          contentType: file.type,
     })

     try {
          const doc = await sql`
               INSERT INTO document (proj_id, document_nom, document_type, document_link, document_visible_client)
               VALUES (${proj_id}, ${name}, ${type}, ${blob.pathname}, ${visible})
               RETURNING document_id`

          return NextResponse.json({ success: true, document_id: doc[0].document_id })
     } catch {
          await del(blob.pathname).catch(() => {})
          console.error("Document insert failed.")
          return NextResponse.json({ error: "Impossible d'enregistrer le document." }, { status: 500 })
     }
}
