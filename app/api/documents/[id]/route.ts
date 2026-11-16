import { AdminCheck, AuthUser } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { del, get } from "@vercel/blob"
import { NextRequest, NextResponse } from "next/server"

type Params = { params: Promise<{ id: string }> }

async function getDocumentId(params: Params["params"]) {
     const { id } = await params
     const documentId = Number(id)
     return Number.isInteger(documentId) && documentId > 0 ? documentId : null
}

export async function GET(_request: NextRequest, { params }: Params) {
     const user = await AuthUser()
     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

     const documentId = await getDocumentId(params)
     if (!documentId) return NextResponse.json({ error: "Not found" }, { status: 404 })

     const docs =
          user.role === "admin"
               ? await sql`SELECT document_nom, document_link FROM document WHERE document_id = ${documentId}`
               : await sql`
                    SELECT d.document_nom, d.document_link
                    FROM document d
                    JOIN projet p ON p.proj_id = d.proj_id
                    WHERE d.document_id = ${documentId}
                      AND p.client_id = ${user.client_id}
                      AND d.document_visible_client = true`

     const doc = docs[0]
     if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 })

     const result = await get(doc.document_link, { access: "private" })
     if (result?.statusCode !== 200) return NextResponse.json({ error: "Not found" }, { status: 404 })

     return new NextResponse(result.stream, {
          headers: {
               "Content-Type": result.blob.contentType,
               "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(doc.document_nom)}`,
               "X-Content-Type-Options": "nosniff",
               "Cache-Control": "private, no-store",
          },
     })
}

export async function DELETE(request: NextRequest, { params }: Params) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

     const documentId = await getDocumentId(params)
     if (!documentId) return NextResponse.json({ error: "Not found" }, { status: 404 })

     const deleted = await sql`DELETE FROM document WHERE document_id = ${documentId} RETURNING document_link`
     if (deleted.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })

     try {
          await del(deleted[0].document_link)
     } catch {
          console.error("Blob deletion failed.")
     }

     return NextResponse.json({ success: true })
}
