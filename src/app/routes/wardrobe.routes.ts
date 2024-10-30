import { Routes } from "@angular/router";
import { authGuard } from "@guards/auth.guard";
import { wardrobeGuard } from "@guards/wardrobe.guard";

const loadMain = () => import("@components/shared/main/main.component").then(m => m.MainComponent)

export const wardrobeRoutes: Routes = [{
    path: "wardrobe", canActivate: [authGuard, wardrobeGuard],
    children: [
        { path: "", redirectTo: "inventory", pathMatch: "full" },

        {
            path: "inventory",
            loadComponent: loadMain,
            canActivate: [authGuard, wardrobeGuard],
            children: [
                {
                    path: "",
                    loadComponent: () => import("@components/wardrobe/inventory/wu-list-inventory/wu-list-inventory.component").then(m => m.WuListInventoryComponent),
                    title: "Inventario",
                },
                {
                    path: "threshold",
                    loadComponent: () => import("@components/wardrobe/inventory/wu-threshold/wu-threshold.component").then(m => m.WuThresholdComponent),
                    title: "Umbral de stock"
                }
            ]
        },

        {
            path: "orders",
            loadComponent: loadMain,
            children: [
                {
                    path: "",
                    loadComponent: () => import("@components/wardrobe/orders/list-wu-order/list-wu-order.component").then(m => m.ListWuOrderComponent),
                    title: "Pedidos del ropero"
                },
                {
                    path: "create",
                    loadComponent: () => import("@components/wardrobe/orders/wu-create-order/wu-create-order.component").then(m => m.WuCreateOrderComponent ),
                    title: "Crear pedido"
                },
                {
                    path: ":uuid",
                    loadComponent: () => import("@components/wardrobe/orders/wu-order-id/wu-order-id.component").then(m => m.WuOrderIdComponent),
                    title: "Ver pedido"
                },
                {
                    path: ":uuid/confirm",
                    loadComponent: () => import("@components/wardrobe/orders/wu-confirm-order/wu-confirm-order.component").then(m => m.WuConfirmOrderComponent),
                    title: "Confirmar pedido"
                }
            ]
        },
        {
            path: "sales",
            loadComponent: loadMain,
            children: [
                {
                    path: "",
                    loadComponent: () => import("@components/wardrobe/sales/wu-sales/wu-sales.component").then(m => m.WuSalesComponent),
                    title: "Ventas del ropero"
                },
                {
                    path: "best_seller",
                    loadComponent: () => import("@components/wardrobe/sales/wu-best-seller/wu-best-seller.component").then(m => m.WuBestSellerComponent),
                    title: "Más vendidos"
                },
                {
                    path: "calculate-sale",
                    loadComponent: () => import("@components/wardrobe/sales/calculate-sale/calculate-sale.component").then(m => m.CalculateSaleComponent),
                    title: "Calcular venta"
                }
            ]
        }
    ]
}] 