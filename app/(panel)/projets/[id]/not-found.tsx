import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Projet introuvable" }

export default function ProjetNotFound() {
     return (
          <section aria-labelledby="h-404" className="card flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
               <div
                    aria-hidden="true"
                    className="flex size-32 flex-none items-center justify-center border-3 border-ink bg-colerr font-display text-title shadow-brutal sm:size-40"
               >
                    404
               </div>

               <div className="flex flex-col gap-3">
                    <span className="eyebrow muted">Erreur 404</span>
                    <h1 id="h-404" className="page-title">
                         Projet introuvable.
                    </h1>
                    <p className="muted m-0 max-w-prose">
                         Ce projet n&apos;existe pas ou a été supprimé. Vérifiez le lien, ou retrouvez-le dans la liste des projets.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3">
                         <Link href="/projets" className="btn btn-primary shadow-accent">
                              Voir les projets
                         </Link>
                         <Link href="/" className="btn">
                              Retour à l&apos;accueil
                         </Link>
                    </div>
               </div>
          </section>
     )
}
