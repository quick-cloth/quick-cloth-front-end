import { Routes } from "@angular/router";

export const errorRoutes: Routes = [
    {
        path: "e500", title: "Error",
        loadComponent: () => import("@components/shared/errors/e500/e500.component").then(m => m.E500Component)
    },
    {
        path: "e403", title: "No permitido",
        loadComponent: () => import("@components/shared/errors/e403/e403.component").then(m => m.E403Component)
    },
]