export function DashboardSkeleton() {
     return (
          <div className="flex flex-col gap-6 lg:gap-7" role="status" aria-busy="true">
               <span className="sr-only">Chargement du tableau de bord</span>
               <div className="flex flex-wrap items-end justify-between gap-4" aria-hidden="true">
                    <div className="flex flex-col gap-2">
                         <div className="h-3 w-32 animate-pulse bg-ink/10" />
                         <div className="h-10 w-56 animate-pulse bg-ink/10" />
                    </div>
                    <div className="h-12 w-36 animate-pulse border-3 border-ink/10 bg-ink/5" />
               </div>

               <section aria-hidden="true" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }, (_, index) => (
                         <div key={index} className="card-sm flex flex-col gap-2">
                              <div className="h-4 w-28 animate-pulse bg-ink/10" />
                              <div className="h-10 w-16 animate-pulse bg-ink/10" />
                              <div className="h-4 w-36 max-w-full animate-pulse bg-ink/10" />
                         </div>
                    ))}
               </section>

               <div className="grid items-start gap-6 lg:gap-7 xl:grid-main-aside" aria-hidden="true">
                    <section className="card flex flex-col gap-4">
                         <div className="flex items-center justify-between gap-3">
                              <div className="h-7 w-32 animate-pulse bg-ink/10" />
                              <div className="h-4 w-28 animate-pulse bg-ink/10" />
                         </div>
                         <ul className="m-0 flex list-none flex-col gap-3 p-0">
                              {Array.from({ length: 3 }, (_, index) => (
                                   <li key={index} className="item flex flex-wrap items-center gap-x-4 gap-y-3">
                                        <div className="h-7 w-20 animate-pulse bg-ink/10" />
                                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                                             <div className="h-5 w-40 max-w-full animate-pulse bg-ink/10" />
                                             <div className="h-4 w-52 max-w-full animate-pulse bg-ink/10" />
                                        </div>
                                        <div className="h-10 w-28 animate-pulse bg-ink/10" />
                                   </li>
                              ))}
                         </ul>
                    </section>

                    <div className="grid gap-6 md:grid-cols-2 lg:gap-7 xl:grid-cols-1">
                         <section className="card flex flex-col gap-3.5">
                              <div className="h-6 w-36 animate-pulse bg-ink/10" />
                              {Array.from({ length: 3 }, (_, index) => (
                                   <div key={index} className="flex items-center gap-3.5">
                                        <div className="h-10 w-14 animate-pulse bg-ink/10" />
                                        <div className="h-4 w-40 max-w-full animate-pulse bg-ink/10" />
                                   </div>
                              ))}
                         </section>
                         <section className="card flex flex-col gap-3">
                              <div className="h-6 w-40 animate-pulse bg-ink/10" />
                              {Array.from({ length: 3 }, (_, index) => (
                                   <div key={index} className="flex min-h-10 items-center gap-3">
                                        <div className="size-5 animate-pulse bg-ink/10" />
                                        <div className="h-4 w-44 max-w-full animate-pulse bg-ink/10" />
                                   </div>
                              ))}
                         </section>
                    </div>
               </div>
          </div>
     )
}

export function ClientPageSkeleton() {
     return (
          <div
               className="mx-auto flex max-w-300 flex-col gap-6 px-4 py-6 sm:px-6 lg:gap-7 lg:py-8"
               role="status"
               aria-busy="true"
          >
               <span className="sr-only">Chargement de votre espace client</span>
               <header className="flex items-center justify-between gap-4" aria-hidden="true">
                    <div className="flex min-w-0 flex-col gap-2">
                         <div className="h-3 w-44 animate-pulse bg-ink/10" />
                         <div className="h-10 w-64 max-w-full animate-pulse bg-ink/10" />
                    </div>
                    <div className="h-12 w-12 shrink-0 animate-pulse border-3 border-ink/10 bg-ink/5 sm:w-36" />
                    <div className="hidden h-12 w-12 shrink-0 animate-pulse border-3 border-ink/10 bg-ink/5 sm:block sm:w-36" />
               </header>

               <section className="card flex flex-col gap-5" aria-hidden="true">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                         <div className="flex flex-col gap-2">
                              <div className="h-4 w-44 animate-pulse bg-ink/10" />
                              <div className="h-8 w-64 max-w-full animate-pulse bg-ink/10" />
                         </div>
                         <div className="flex flex-col gap-2 sm:items-end">
                              <div className="h-4 w-32 animate-pulse bg-ink/10" />
                              <div className="h-7 w-28 animate-pulse bg-ink/10" />
                         </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                         {Array.from({ length: 4 }, (_, index) => (
                              <div key={index} className="h-3 animate-pulse bg-ink/10" />
                         ))}
                    </div>
               </section>

               <div className="grid items-start gap-6 lg:grid-main-aside lg:gap-7" aria-hidden="true">
                    <section className="card flex flex-col gap-6">
                         <div className="h-8 w-32 animate-pulse bg-ink/10" />
                         <ol className="m-0 flex list-none flex-col gap-6 p-0">
                              {Array.from({ length: 4 }, (_, index) => (
                                   <li key={index} className="flex gap-4 sm:gap-5">
                                        <div className="size-9 shrink-0 animate-pulse border-3 border-ink/10 bg-ink/5" />
                                        <div className="flex flex-1 flex-col gap-2">
                                             <div className="h-6 w-48 max-w-full animate-pulse bg-ink/10" />
                                             <div className="h-4 w-full animate-pulse bg-ink/10" />
                                             <div className="h-4 w-3/4 animate-pulse bg-ink/10" />
                                        </div>
                                   </li>
                              ))}
                         </ol>
                    </section>

                    <div className="flex flex-col gap-6 lg:gap-7">
                         <section className="card flex flex-col gap-4">
                              <div className="h-8 w-44 animate-pulse bg-ink/10" />
                              {Array.from({ length: 2 }, (_, index) => (
                                   <div key={index} className="item flex items-center gap-3.5">
                                        <div className="h-6 w-20 shrink-0 animate-pulse bg-ink/10" />
                                        <div className="flex flex-1 flex-col gap-2">
                                             <div className="h-4 w-40 max-w-full animate-pulse bg-ink/10" />
                                             <div className="h-3 w-28 animate-pulse bg-ink/10" />
                                        </div>
                                        <div className="size-10 shrink-0 animate-pulse bg-ink/10" />
                                   </div>
                              ))}
                              <div className="h-4 w-full animate-pulse bg-ink/10" />
                         </section>

                         <section className="flex flex-col gap-3.5 border-3 border-ink bg-ink p-5 md:p-6">
                              <div className="h-7 w-40 animate-pulse bg-white/20" />
                              <div className="h-4 w-full animate-pulse bg-white/20" />
                              <div className="h-5 w-56 max-w-full animate-pulse bg-white/20" />
                              <div className="h-5 w-36 animate-pulse bg-white/20" />
                         </section>
                    </div>
               </div>
          </div>
     )
}
