import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth.guard';
import { bankGuard } from '@guards/bank.guard';
const loadMain = () =>
  import('@components/shared/main/main.component').then((m) => m.MainComponent);

export const bankRoutes: Routes = [
  {
    path: 'bank',
    canActivate: [authGuard, bankGuard],
    children: [
      { path: '', redirectTo: 'wardrobes', pathMatch: 'full' },
      {
        path: 'wardrobes',
        loadComponent: loadMain,
        canActivate: [authGuard, bankGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                '@components/bank/wardrobes/list-wardrobe/list-wardrobe.component'
              ).then((m) => m.ListWardrobeComponent),
            title: 'Lista de roperos',
          },
          {
            path: 'create',
            loadComponent: () =>
              import(
                '@components/bank/wardrobes/create-wardrobe/create-wardrobe.component'
              ).then((m) => m.CreateWardrobeComponent),
            title: 'Crear ropero',
          },
          {
            path: ':uuid',
            loadComponent: () =>
              import(
                '@components/bank/wardrobes/wardrobe-id/wardrobe-id.component'
              ).then((m) => m.WardrobeIdComponent),
            title: 'Detalles del ropero',
          },
          {
            path: ':uuid/sales/:suuid',
            loadComponent: () =>
              import(
                '@components/bank/wardrobes/wardrobe-id/wardrobe-sales/wardrobe-sale-detailed/wardrobe-sale-detailed.component'
              ).then((m) => m.WardrobeSaleDetailedComponent),
            title: 'Detalle de venta',
          },
        ],
      },

      {
        path: 'foundations',
        loadComponent: loadMain,
        canActivate: [authGuard, bankGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                '@components/bank/foundations/list-foundation/list-foundation.component'
              ).then((m) => m.ListFoundationComponent),
            title: 'Lista de fundaciones',
          },
          {
            path: 'create',
            loadComponent: () =>
              import(
                '@components/bank/foundations/create-foundation/create-foundation.component'
              ).then((m) => m.CreateFoundationComponent),
            title: 'Crear una fundación',
          },
        ],
      },

      {
        path: 'campaigns',
        loadComponent: loadMain,
        canActivate: [authGuard, bankGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                '@components/bank/campaigns/list-campaign/list-campaign.component'
              ).then((m) => m.ListCampaignComponent),
            title: 'Lista de campañas',
          },
          {
            path: 'create',
            loadComponent: () =>
              import(
                '@components/bank/campaigns/create-campaign/create-campaign.component'
              ).then((m) => m.CreateCampaignComponent),
            title: 'Crear una campaña',
          },
        ],
      },

      {
        path: 'donations',
        loadComponent: loadMain,
        canActivate: [authGuard, bankGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                '@components/bank/donations/list-donation/list-donation.component'
              ).then((m) => m.ListDonationComponent),
            title: 'Lista de donaciones',
          },
          {
            path: 'create',
            loadComponent: () =>
              import(
                '@components/bank/donations/create-donation/create-donation.component'
              ).then((m) => m.CreateDonationComponent),
            title: 'Crear una donación',
          },
        ],
      },

      {
        path: 'orders',
        loadComponent: loadMain,
        canActivate: [authGuard, bankGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                '@components/bank/orders/list-order/list-order.component'
              ).then((m) => m.ListOrderComponent),
            title: 'Lista de pedidos',
          },
          {
            path: ':uuid',
            loadComponent: () =>
              import(
                '@components/bank/orders/order-id/order-id.component'
              ).then((m) => m.OrderIdComponent),
            title: 'Detalles del pedido',
          },
          {
            path: ':uuid/reply',
            loadComponent: () =>
              import(
                '@components/bank/orders/reply-order/reply-order.component'
              ).then((m) => m.ReplyOrderComponent),
            title: 'Responder al pedido',
          },
        ],
      },
    ],
  },
];
