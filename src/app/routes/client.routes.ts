import { Routes } from "@angular/router";
import { authGuard } from "@guards/auth.guard";
import { clientGuard } from "@guards/client.guard";

export const userRoutes: Routes = [
    {
        path: "client",
        canActivate: [authGuard, clientGuard],
        loadComponent: () => import("@components/user/summary/user-summary/user-summary.component").then(m => m.UserSummaryComponent),
        title: 'Información de usuario',
        children: [
            {
                path:'',
                redirectTo: 'transactions',
                pathMatch: "full"
            },
            {
                path: 'transactions',
                loadComponent: () => import("@components/user/summary/user-transaction-history/user-transaction-history.component").then(m => m.UserTransactionHistoryComponent),
            },
            {
                path: 'campaigns',
                loadComponent: () => import("@components/user/campaigns/campaigns.component").then(m => m.CampaignsComponent),
                title: 'Campañas para ti'
            }
        ]
    }
]