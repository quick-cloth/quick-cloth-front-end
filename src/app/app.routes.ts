import { Routes } from '@angular/router';
import { loginGuard } from '@guards/login.guard';
import { bankRoutes } from '@routes/bank.routes';
import { errorRoutes } from '@routes/error.routes';
import { userRoutes } from '@routes/client.routes';
import { wardrobeRoutes } from '@routes/wardrobe.routes';

export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" },
    {
        path: "login", title: "Inicio de sesión",
        loadComponent: () => import("@components/login/login.component").then(m => m.LoginComponent),
        canActivate: [loginGuard]
    },
    ...errorRoutes,
    ...bankRoutes,
    ...wardrobeRoutes,
    ...userRoutes,
    { path: "**", loadComponent: () => import("@components/shared/errors/e404/e404.component").then(m => m.E404Component), title: "No encontrado" }
]
