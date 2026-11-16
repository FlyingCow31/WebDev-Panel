function SkeletonBlock({ className }: { className: string }) {
     return <div className={`animate-pulse bg-ink/10 ${className}`} />
}

function SkeletonRows({ count, className = "item" }: { count: number; className?: string }) {
     return Array.from({ length: count }, (_, index) => (
          <div key={index} className={`${className} flex items-center gap-3`}>
               <SkeletonBlock className="h-5 w-24 shrink-0" />
               <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <SkeletonBlock className="h-4 w-40 max-w-full" />
                    <SkeletonBlock className="h-3 w-28 max-w-full" />
               </div>
          </div>
     ))
}

function LoadingPage({ label, children }: { label: string; children: React.ReactNode }) {
     return (
          <div className="flex flex-col gap-6 lg:gap-7" role="status" aria-busy="true">
               <span className="sr-only">{label}</span>
               {children}
          </div>
     )
}

export function DashboardSkeleton() {
     return (
          <LoadingPage label="Chargement du tableau de bord">
               <div className="flex flex-wrap items-end justify-between gap-4" aria-hidden="true">
                    <div className="flex flex-col gap-2">
                         <SkeletonBlock className="h-3 w-32" />
                         <SkeletonBlock className="h-10 w-56" />
                    </div>
                    <SkeletonBlock className="h-12 w-36 border-3 border-ink/10 bg-ink/5" />
               </div>

               <section aria-hidden="true" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }, (_, index) => (
                         <div key={index} className="card-sm flex flex-col gap-2">
                              <SkeletonBlock className="h-4 w-28" />
                              <SkeletonBlock className="h-10 w-16" />
                              <SkeletonBlock className="h-4 w-36 max-w-full" />
                         </div>
                    ))}
               </section>

               <div className="grid items-start gap-6 lg:gap-7 xl:grid-main-aside" aria-hidden="true">
                    <section className="card flex flex-col gap-4">
                         <div className="flex items-center justify-between gap-3">
                              <SkeletonBlock className="h-7 w-32" />
                              <SkeletonBlock className="h-4 w-28" />
                         </div>
                         <ul className="m-0 flex list-none flex-col gap-3 p-0">
                              {Array.from({ length: 3 }, (_, index) => (
                                   <li key={index} className="item flex flex-wrap items-center gap-x-4 gap-y-3">
                                        <SkeletonBlock className="h-7 w-20" />
                                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                                             <SkeletonBlock className="h-5 w-40 max-w-full" />
                                             <SkeletonBlock className="h-4 w-52 max-w-full" />
                                        </div>
                                        <SkeletonBlock className="h-10 w-28" />
                                   </li>
                              ))}
                         </ul>
                    </section>

                    <div className="grid gap-6 md:grid-cols-2 lg:gap-7 xl:grid-cols-1">
                         <section className="card flex flex-col gap-3.5">
                              <SkeletonBlock className="h-6 w-36" />
                              {Array.from({ length: 3 }, (_, index) => (
                                   <div key={index} className="flex items-center gap-3.5">
                                        <SkeletonBlock className="h-10 w-14" />
                                        <SkeletonBlock className="h-4 w-40 max-w-full" />
                                   </div>
                              ))}
                         </section>
                         <section className="card flex flex-col gap-3">
                              <SkeletonBlock className="h-6 w-40" />
                              {Array.from({ length: 3 }, (_, index) => (
                                   <div key={index} className="flex min-h-10 items-center gap-3">
                                        <SkeletonBlock className="size-5" />
                                        <SkeletonBlock className="h-4 w-44 max-w-full" />
                                   </div>
                              ))}
                         </section>
                    </div>
               </div>
          </LoadingPage>
     )
}

export function ClientPageSkeleton() {
     return (
          <LoadingPage label="Chargement de votre espace client">
               <div className="mx-auto flex w-full max-w-300 flex-col gap-6 px-4 py-6 sm:px-6 lg:gap-7 lg:py-8">
               <header className="flex items-center justify-between gap-4" aria-hidden="true">
                    <div className="flex min-w-0 flex-col gap-2">
                         <SkeletonBlock className="h-3 w-44" />
                         <SkeletonBlock className="h-10 w-64 max-w-full" />
                    </div>
                    <SkeletonBlock className="h-12 w-12 shrink-0 border-3 border-ink/10 bg-ink/5 sm:w-36" />
                    <SkeletonBlock className="hidden h-12 w-12 shrink-0 border-3 border-ink/10 bg-ink/5 sm:block sm:w-36" />
               </header>

               <section className="card flex flex-col gap-5" aria-hidden="true">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                         <div className="flex flex-col gap-2">
                              <SkeletonBlock className="h-4 w-44" />
                              <SkeletonBlock className="h-8 w-64 max-w-full" />
                         </div>
                         <div className="flex flex-col gap-2 sm:items-end">
                              <SkeletonBlock className="h-4 w-32" />
                              <SkeletonBlock className="h-7 w-28" />
                         </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                         {Array.from({ length: 4 }, (_, index) => (
                              <SkeletonBlock key={index} className="h-3" />
                         ))}
                    </div>
               </section>

               <div className="grid items-start gap-6 lg:grid-main-aside lg:gap-7" aria-hidden="true">
                    <section className="card flex flex-col gap-6">
                         <SkeletonBlock className="h-8 w-32" />
                         <ol className="m-0 flex list-none flex-col gap-6 p-0">
                              {Array.from({ length: 4 }, (_, index) => (
                                   <li key={index} className="flex gap-4 sm:gap-5">
                                        <SkeletonBlock className="size-9 shrink-0 border-3 border-ink/10 bg-ink/5" />
                                        <div className="flex flex-1 flex-col gap-2">
                                             <SkeletonBlock className="h-6 w-48 max-w-full" />
                                             <SkeletonBlock className="h-4 w-full" />
                                             <SkeletonBlock className="h-4 w-3/4" />
                                        </div>
                                   </li>
                              ))}
                         </ol>
                    </section>

                    <div className="flex flex-col gap-6 lg:gap-7">
                         <section className="card flex flex-col gap-4">
                              <SkeletonBlock className="h-8 w-44" />
                              {Array.from({ length: 2 }, (_, index) => (
                                   <div key={index} className="item flex items-center gap-3.5">
                                        <SkeletonBlock className="h-6 w-20 shrink-0" />
                                        <div className="flex flex-1 flex-col gap-2">
                                             <SkeletonBlock className="h-4 w-40 max-w-full" />
                                             <SkeletonBlock className="h-3 w-28" />
                                        </div>
                                        <SkeletonBlock className="size-10 shrink-0" />
                                   </div>
                              ))}
                              <SkeletonBlock className="h-4 w-full" />
                         </section>

                         <section className="flex flex-col gap-3.5 border-3 border-ink bg-ink p-5 md:p-6">
                              <SkeletonBlock className="h-7 w-40 bg-white/20" />
                              <SkeletonBlock className="h-4 w-full bg-white/20" />
                              <SkeletonBlock className="h-5 w-56 max-w-full bg-white/20" />
                              <SkeletonBlock className="h-5 w-36 bg-white/20" />
                         </section>
                    </div>
               </div>
               </div>
          </LoadingPage>
     )
}

export function FinancesPageSkeleton() {
     return (
          <LoadingPage label="Chargement des finances">
               <header className="flex flex-wrap items-end justify-between gap-4" aria-hidden="true">
                    <SkeletonBlock className="h-10 w-48" />
                    <SkeletonBlock className="h-12 w-52 border-3 border-ink/10 bg-ink/5" />
               </header>
               <section className="card flex flex-col gap-4" aria-hidden="true">
                    <div className="flex justify-between gap-4">
                         <div className="flex flex-col gap-2">
                              <SkeletonBlock className="h-4 w-56" />
                              <SkeletonBlock className="h-10 w-36" />
                         </div>
                         <SkeletonBlock className="h-4 w-48 max-w-1/2" />
                    </div>
                    <SkeletonBlock className="h-6 w-full border-3 border-ink/10 bg-ink/5" />
                    <div className="flex justify-between">
                         <SkeletonBlock className="h-4 w-12" />
                         <SkeletonBlock className="h-4 w-20" />
                         <SkeletonBlock className="h-4 w-28" />
                    </div>
               </section>
               <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
                    {Array.from({ length: 3 }, (_, index) => (
                         <div key={index} className="card-sm flex flex-col gap-2">
                              <SkeletonBlock className="h-4 w-32" />
                              <SkeletonBlock className="h-10 w-28" />
                         </div>
                    ))}
               </section>
               <div className="grid items-start gap-6 lg:gap-7 xl:grid-main-aside" aria-hidden="true">
                    <section className="card flex flex-col gap-4">
                         <SkeletonBlock className="h-8 w-48" />
                         <SkeletonBlock className="h-50 w-full" />
                    </section>
                    <section className="card flex flex-col gap-3">
                         <SkeletonBlock className="h-8 w-44" />
                         {SkeletonRows({ count: 3 })}
                    </section>
               </div>
               <section className="card flex flex-col gap-3" aria-hidden="true">
                    <SkeletonBlock className="h-8 w-48" />
                    {SkeletonRows({ count: 4, className: "flex min-h-12 items-center border-b border-ink/10" })}
               </section>
          </LoadingPage>
     )
}

export function TodoPageSkeleton() {
     return (
          <LoadingPage label="Chargement des tâches">
               <SkeletonBlock className="h-10 w-32" />
               <section className="card-sm">
                    <SkeletonBlock className="h-12 w-48 border-3 border-ink/10 bg-ink/5" />
               </section>
               {["Aujourd'hui", "Cette semaine", "Plus tard", "Terminées"].map((section) => (
                    <section key={section} className="card flex flex-col gap-3">
                         <SkeletonBlock className="h-8 w-48" />
                         {SkeletonRows({ count: 2 })}
                    </section>
               ))}
          </LoadingPage>
     )
}

export function ClientsPageSkeleton() {
     return (
          <div className="grid items-start gap-6 lg:gap-7 xl:grid-aside-main" role="status" aria-busy="true">
               <span className="sr-only">Chargement des clients</span>
               <section className="card flex flex-col gap-3 p-4" aria-hidden="true">
                    <SkeletonBlock className="h-12 w-full" />
                    {SkeletonRows({ count: 5 })}
               </section>
               <div className="flex flex-col gap-6" aria-hidden="true">
                    <section className="card flex flex-col gap-4">
                         <SkeletonBlock className="h-8 w-48" />
                         <SkeletonBlock className="h-6 w-64 max-w-full" />
                         <SkeletonBlock className="h-4 w-full" />
                         <SkeletonBlock className="h-4 w-3/4" />
                    </section>
                    <div className="grid gap-6 md:grid-cols-2">
                         <section className="card-sm flex flex-col gap-3">
                              <SkeletonBlock className="h-8 w-32" />
                              {SkeletonRows({ count: 2 })}
                         </section>
                         <section className="card-sm flex flex-col gap-3">
                              <SkeletonBlock className="h-8 w-44" />
                              {SkeletonRows({ count: 2 })}
                         </section>
                    </div>
               </div>
          </div>
     )
}

export function MonitoringPageSkeleton() {
     return (
          <LoadingPage label="Chargement du monitoring">
               <header className="flex flex-wrap items-end justify-between gap-4" aria-hidden="true">
                    <div className="flex flex-col gap-2">
                         <SkeletonBlock className="h-10 w-48" />
                         <SkeletonBlock className="h-5 w-80 max-w-full" />
                    </div>
                    <SkeletonBlock className="h-12 w-40 border-3 border-ink/10 bg-ink/5" />
               </header>
               <section className="card-sm flex items-center gap-4" aria-hidden="true">
                    <SkeletonBlock className="h-5 w-72 max-w-full" />
                    <SkeletonBlock className="h-5 w-36" />
               </section>
               <section className="card overflow-hidden p-0" aria-hidden="true">
                    <div className="space-y-4 p-5">
                         <SkeletonBlock className="h-8 w-full" />
                         {Array.from({ length: 4 }, (_, index) => (
                              <SkeletonBlock key={index} className="h-12 w-full" />
                         ))}
                    </div>
               </section>
          </LoadingPage>
     )
}

export function ProjectsPageSkeleton() {
     return (
          <LoadingPage label="Chargement des projets">
               <header className="flex flex-wrap items-end justify-between gap-4" aria-hidden="true">
                    <SkeletonBlock className="h-10 w-40" />
                    <SkeletonBlock className="h-12 w-44 border-3 border-ink/10 bg-ink/5" />
               </header>
               <div className="flex flex-wrap gap-2.5" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, index) => (
                         <SkeletonBlock key={index} className="h-10 w-28 border-3 border-ink/10 bg-ink/5" />
                    ))}
               </div>
               <section className="card overflow-hidden p-0" aria-hidden="true">
                    <div className="space-y-4 p-5">
                         <SkeletonBlock className="h-8 w-full" />
                         {Array.from({ length: 5 }, (_, index) => (
                              <SkeletonBlock key={index} className="h-12 w-full" />
                         ))}
                    </div>
               </section>
               <SkeletonBlock className="h-14 w-full border-3 border-ink/10 bg-ink/5" />
          </LoadingPage>
     )
}

export function ProjectFilterSkeleton() {
     return (
          <div className="flex flex-col gap-6 lg:gap-7" role="status" aria-busy="true" aria-label="Chargement des filtres">
               <div className="flex flex-wrap gap-2.5" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, index) => (
                         <SkeletonBlock key={index} className="h-10 w-28 border-3 border-ink/10 bg-ink/5" />
                    ))}
               </div>
               <section className="card overflow-hidden p-0" aria-hidden="true">
                    <div className="space-y-4 p-5">
                         <SkeletonBlock className="h-8 w-full" />
                         {Array.from({ length: 5 }, (_, index) => (
                              <SkeletonBlock key={index} className="h-12 w-full" />
                         ))}
                    </div>
               </section>
          </div>
     )
}

export function NewProjectFormSkeleton() {
     return (
          <div className="grid items-start gap-6 lg:gap-7 xl:grid-main-aside" role="status" aria-busy="true">
               <span className="sr-only">Chargement du formulaire de nouveau projet</span>
               <div className="flex flex-col gap-6" aria-hidden="true">
                    {Array.from({ length: 3 }, (_, index) => (
                         <section key={index} className="card flex flex-col gap-4">
                              <SkeletonBlock className="h-8 w-40" />
                              {SkeletonRows({ count: 3, className: "flex flex-col gap-2" })}
                         </section>
                    ))}
               </div>
               <section className="card flex flex-col gap-4" aria-hidden="true">
                    <SkeletonBlock className="h-8 w-40" />
                    {SkeletonRows({ count: 4, className: "flex flex-col gap-2" })}
                    <SkeletonBlock className="h-12 w-40 border-3 border-ink/10 bg-ink/5" />
               </section>
          </div>
     )
}

export function ProjectPageSkeleton() {
     return (
          <LoadingPage label="Chargement du projet">
               <header className="flex flex-col gap-3.5" aria-hidden="true">
                    <SkeletonBlock className="h-4 w-20" />
                    <div className="flex flex-wrap items-end justify-between gap-4">
                         <div className="flex flex-col gap-3">
                              <SkeletonBlock className="h-10 w-64 max-w-full" />
                              <SkeletonBlock className="h-5 w-56 max-w-full" />
                         </div>
                         <div className="flex flex-wrap gap-3">
                              <SkeletonBlock className="h-12 w-32 border-3 border-ink/10 bg-ink/5" />
                              <SkeletonBlock className="h-12 w-36 border-3 border-ink/10 bg-ink/5" />
                         </div>
                    </div>
               </header>
               <section className="card" aria-hidden="true">
                    <SkeletonBlock className="h-16 w-full" />
               </section>
               <div className="grid items-start gap-6 lg:gap-7 xl:grid-main-aside" aria-hidden="true">
                    <section className="card flex flex-col gap-4">
                         <SkeletonBlock className="h-8 w-56" />
                         {SkeletonRows({ count: 4 })}
                    </section>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
                         {Array.from({ length: 3 }, (_, index) => (
                              <section key={index} className="card flex flex-col gap-3">
                                   <SkeletonBlock className="h-7 w-40" />
                                   {SkeletonRows({ count: 2, className: "flex flex-col gap-2" })}
                              </section>
                         ))}
                    </div>
               </div>
          </LoadingPage>
     )
}

export function AvanceeFormSkeleton() {
     return (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/55 p-4 sm:p-8">
               <div className="card flex w-full max-w-150 flex-col gap-5 shadow-brutal-xl" role="status" aria-busy="true">
                    <span className="sr-only">Chargement du formulaire d&apos;avancée</span>
                    <div className="flex justify-between">
                         <SkeletonBlock className="h-8 w-48" />
                         <SkeletonBlock className="size-10" />
                    </div>
                    {SkeletonRows({ count: 5, className: "flex flex-col gap-2" })}
                    <div className="flex justify-end gap-3">
                         <SkeletonBlock className="h-12 w-24 border-3 border-ink/10 bg-ink/5" />
                         <SkeletonBlock className="h-12 w-40 border-3 border-ink/10 bg-ink/5" />
                    </div>
               </div>
          </div>
     )
}

export function AdministrationPageSkeleton() {
     return (
          <LoadingPage label="Chargement de l'administration">
               <SkeletonBlock className="h-10 w-56" />
               <div className="grid items-start gap-6 lg:gap-7 xl:grid-main-aside" aria-hidden="true">
                    <section className="card flex flex-col gap-4">
                         <SkeletonBlock className="h-8 w-48" />
                         {SkeletonRows({ count: 6 })}
                    </section>
                    <section className="card flex flex-col gap-3.5">
                         <SkeletonBlock className="h-8 w-36" />
                         {SkeletonRows({ count: 3 })}
                    </section>
               </div>
               <section className="card flex flex-col gap-3" aria-hidden="true">
                    <SkeletonBlock className="h-8 w-56" />
                    {SkeletonRows({ count: 4 })}
               </section>
          </LoadingPage>
     )
}
