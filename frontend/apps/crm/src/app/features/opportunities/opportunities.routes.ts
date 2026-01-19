import { Route } from '@angular/router';

export const opportunitiesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./opportunities-start.component').then(
        (m) => m.OpportunitiesStartComponent,
      ),
  },
];
