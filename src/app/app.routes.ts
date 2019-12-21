import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanOrderComponent } from 'src/app/component/tab/plan-order/plan-order.component';
import { PlanDirectiveComponent } from 'src/app/component/plan/plan-directive/plan-directive.component';
import { PlanDirectiveDetailsComponent } from 'src/app/component/plan/plan-directive-details/plan-directive-details.component';
import { PlanOrderHistoryComponent } from 'src/app/component/tab/plan-order-history/plan-order-history.component';
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard';

import {
  PlanDirectiveReadOnlyComponent
} from 'src/app/component/plan/plan-directive-details/plan-directive-read-only/plan-directive-read-only.component';
export const appRoutes: Routes = [
  { path: 'Orders', component: PlanOrderComponent },
  { path: 'planning-directive-create/:structureSetId/:patientId/:orderId', component: PlanDirectiveComponent },
  {
    path: 'planning-directive-details/:orderId/:templateId/:siteId', component: PlanDirectiveDetailsComponent,
    canDeactivate: [CanDeactivateGuard]
  },
  { path: '', redirectTo: '/Orders', pathMatch: 'full' },
  { path: 'plan-order-history', component: PlanOrderHistoryComponent },
  { path: 'planning-directive-create/:orderId/:templateId', component: PlanDirectiveComponent },
  { path: 'planning-directive-read-only/:orderId', component: PlanDirectiveReadOnlyComponent },
  { path: '**', redirectTo: '/Orders', pathMatch: 'full' },
];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
