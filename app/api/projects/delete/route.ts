import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { del } from "@vercel/blob"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

     const data = await request.json()
     const { proj_id } = data.data
     if (!proj_id) return NextResponse.json({ error: "No data to delete" }, { status: 400 })
     const documents = await sql`SELECT document_link FROM documents WHERE proj_id = ${proj_id}`

     const result = await sql`DELETE FROM projet WHERE proj_id = ${proj_id} RETURNING proj_id`
     if (result.length === 0) {
          return NextResponse.json({ error: "Project not found or was not deleted." }, { status: 404 })
     }

     await del(documents.map((doc) => doc.document_link))

     revalidateTag("projets", { expire: 0 })

     return NextResponse.json({ success: true })
}
