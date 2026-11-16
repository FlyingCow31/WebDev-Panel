import { AuthUser } from "./auth/auth"
import { sql } from "./db"
import { Avancee, Client, Document, Projet } from "./types"

export async function GetClient() {
     const user = await AuthUser()
     if (!user) return null

     const [clientRows, projetRows] = await Promise.all([
          sql`SELECT * FROM client WHERE client_id = ${user.client_id}`,
          sql`SELECT * FROM projet WHERE client_id = ${user.client_id} ORDER BY proj_created_at DESC`,
     ])
     const client = clientRows[0] as Client
     const projet = projetRows[0] as Projet | undefined
     return { client: client ?? null, projet: projet ?? null }
}
export async function GetAvanceesClient(proj_id: number) {
     const user = await AuthUser()
     if (!user) return null

     const avancees = (await sql`
          SELECT a.avancee_id,
               a.avancee_etape,
               a.avancee_statut,
               a.avancee_titre,
               a.avancee_message,
               a.avancee_date,
               a.avancee_visible_client,
               a.document_id,
               d.document_nom
          FROM avancee a
          LEFT JOIN document d ON d.document_id = a.document_id
          WHERE a.proj_id = ${proj_id}`) as Avancee[]

     return avancees
}
export async function GetDocumentsClient(proj_id: number) {
     const user = await AuthUser()
     if (!user) return null
     // This checks if the user is authenticated
     // No need to check if the user really have the document because they won't be able to download it due to restrictions in the download document.
     // Plus the check has already been done up there
     const documents = (await sql`SELECT document_id,
     proj_id,
     document_nom,
     document_type,
     document_visible_client,
     document_created_at 
     FROM document d 
     JOIN projet p ON p.proj_id = d.proj_id
     WHERE d.proj_id = ${proj_id} 
          AND p.client_id = ${user.client_id}
          AND document_visible_client = true`) as Document[]

     return documents
}
