import { Route } from '@angular/router';

export const activitiesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./activities-start.component').then(
        (m) => m.ActivitiesStartComponent,
      ),
  },
];
