import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidatePath, revalidateTag } from "next/cache"
import { del, put } from "@vercel/blob"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const MAX_FILE_SIZE = 4 * 1024 * 1024
const ALLOWED_FILE_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp"]

const projectSchema = z.object({
     proj_id: z.coerce.number().int().positive(),
     etape: z.string().min(1).max(255).nonempty(),
     statut: z.enum(["termine", "en_cours", "attente_client", "planifie"]),
     deadline: z.string().nonempty().nullable(),
     titre: z.string().nonempty(),
     message: z.string().nullable(),
     visible: z.boolean(),
     file: z
          .instanceof(File)
          .refine((file) => file.size > 0, "Le fichier est vide.")
          .refine((file) => file.size <= MAX_FILE_SIZE, "Le fichier dépasse 4 Mo.")
          .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), "Format non autorisé (PDF, PNG, JPEG ou WebP).")
          .optional(),
})

export async function POST(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
     const formData = await request.formData().catch(() => null)
     if (!formData) return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 })

     const fileValue = formData.get("file")
     const result = projectSchema.safeParse({
          proj_id: formData.get("proj_id"),
          etape: formData.get("etape"),
          statut: formData.get("statut"),
          deadline: formData.get("deadline") || null,
          titre: formData.get("titre"),
          message: formData.get("message"),
          visible: formData.get("visible") === "on",
          file: fileValue instanceof File && fileValue.name ? fileValue : undefined,
     })

     if (!result.success) {
          const messages = result.error.issues.map((issue) => issue.message).join(" ")
          return NextResponse.json({ error: messages }, { status: 400 })
     }

     // format the date string to Date again
     const deadline = result.data.deadline ? new Date(result.data.deadline) : null
     if (deadline && Number.isNaN(deadline.getTime())) {
          return NextResponse.json({ error: "Invalid deadline" }, { status: 400 })
     }

     const { proj_id, etape, statut, titre, message, visible, file } = result.data
     const projet = await sql`SELECT proj_id FROM projet WHERE proj_id = ${proj_id}`
     if (!projet[0]) return NextResponse.json({ error: "No project found" }, { status: 400 })

     let blobPath: string | undefined
     let documentId: number | null = null
     try {
          if (file) {
               const name = file.name.replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 200) || "document"
               const blob = await put(`projets/${proj_id}/${name}`, file, {
                    access: "private",
                    addRandomSuffix: true,
                    contentType: file.type,
               })
               blobPath = blob.pathname

               const documents = await sql`
                    INSERT INTO document (proj_id, document_nom, document_type, document_link, document_visible_client)
                    VALUES (${proj_id}, ${name}, 'autre', ${blob.pathname}, ${visible})
                    RETURNING document_id`
               if (!documents[0]) throw new Error("Document insert returned no row")
               documentId = documents[0].document_id
          }

          const insert = await sql`
               INSERT INTO avancee (
                    proj_id, document_id, avancee_etape, avancee_statut, avancee_titre,
                    avancee_message, avancee_date, avancee_visible_client
               )
               VALUES (${proj_id}, ${documentId}, ${etape}, ${statut}, ${titre}, ${message || null}, ${deadline}, ${visible})
               RETURNING avancee_id`
          if (!insert[0]) throw new Error("Avancee insert returned no row")

          const av_id = insert[0].avancee_id
          revalidateTag(`avancee-n${proj_id}`, { expire: 0 })
          revalidateTag(`project-n${proj_id}`, { expire: 0 })
          revalidateTag("projets", { expire: 0 })
          revalidatePath(`/projets/${proj_id}`)
          return NextResponse.json({ success: true, av_id })
     } catch {
          if (documentId !== null) {
               try {
                    await sql`DELETE FROM document WHERE document_id = ${documentId}`
               } catch {
                    console.error("Failed to remove unattached document.")
               }
          }
          if (blobPath) {
               try {
                    await del(blobPath)
               } catch {
                    console.error("Failed to remove uploaded document blob.")
               }
          }
          console.error("Failed to create project update.")
          return NextResponse.json({ error: "Impossible de publier l'avancée." }, { status: 500 })
     }
}
