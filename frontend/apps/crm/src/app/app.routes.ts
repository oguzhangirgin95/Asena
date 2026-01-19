import { Route } from '@angular/router';

export const appRoutes: Route[] = [
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full',
	},
	{
		path: 'home',
		loadComponent: () =>
			import('./home/crm-home.component').then((m) => m.CrmHomeComponent),
	},
	{
		path: 'customers',
		loadChildren: () =>
			import('./features/customers/customers.routes').then(
				(m) => m.customersRoutes,
			),
	},
	{
		path: 'opportunities',
		loadChildren: () =>
			import('./features/opportunities/opportunities.routes').then(
				(m) => m.opportunitiesRoutes,
			),
	},
	{
		path: 'activities',
		loadChildren: () =>
			import('./features/activities/activities.routes').then(
				(m) => m.activitiesRoutes,
			),
	},
	{
		path: '**',
		redirectTo: 'home',
	},
];
