import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { AnatomicalRegionComponent } from 'src/app/component/region/anatomical-region/anatomical-region.component';
import { PlanDirectiveComponent } from 'src/app/component/plan/plan-directive/plan-directive.component';
import { SiteService } from 'src/app/shared/services/site.service';
import { PlanDirectiveTemplateService } from 'src/app/shared/services/plan-directive-template.service';
import { AnatomicalRegionService } from 'src/app/shared/services/anatomical-region.service';
import { HeaderComponent } from 'src/app/component/header/header.component';
import { PlanDirectiveDetailsComponent } from 'src/app/component/plan/plan-directive-details/plan-directive-details.component';
import { PlanOrderComponent } from 'src/app/component/tab/plan-order/plan-order.component';
import { PlanOrderService } from 'src/app/shared/services/plan-order.service';
import { routing } from 'src/app/app.routes';
import { TotalPhaseComponent } from 'src/app/component/plan/plan-directive-details/total-phase/total-phase.component';
import {
  PlanDirectivePhaseComponent
} from 'src/app/component/plan/plan-directive-details/plan-directive-phase/plan-directive-phase.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabViewModule } from 'primeng/tabview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'src/../node_modules/primeng/components/inputtext/inputtext';
import { ButtonModule } from 'src/../node_modules/primeng/components/button/button';
import { CodeHighlighterModule } from 'src/../node_modules/primeng/components/codehighlighter/codehighlighter';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { PlanOrderHistoryComponent } from 'src/app/component/tab/plan-order-history/plan-order-history.component';
import { PlanOrderHistoryService } from 'src/app/shared/services/plan-order-history.service';
import { AppService } from 'src/app/shared/helpers/app-service';

import { AccordionModule } from 'primeng/accordion';
import { StructureComponent } from 'src/app/component/plan/plan-directive-details/structure/structure.component';
import { ConfirmationService } from 'primeng/api';
import { EditPhaseComponent } from 'src/app/component/plan/plan-directive-details/plan-directive-phase/edit-phase/edit-phase.component';
import { SubheaderComponent } from 'src/app/component/header/subheader/subheader.component';
import { GoalIntellisenseComponent } from 'src/app/component/plan/plan-directive-details/goal-intellisense/goal-intellisense.component';

import { MessageModule } from 'primeng/message';
import { ListboxModule } from 'primeng/listbox';

import {
  PlanDirectiveReadOnlyComponent
} from 'src/app/component/plan/plan-directive-details/plan-directive-read-only/plan-directive-read-only.component';
import { FilterPlanOrderPipe } from './shared/pipe/filter-plan-order.pipe';
import { ClickOutsideDirective } from './shared/directives/click-outside.directive';
import { DateformatPipe } from 'src/app/shared/pipe/dateformat.pipe';
import { CommonModule } from '@angular/common';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { TitleCasePipe } from 'src/app/shared/pipe/title-case.pipe';
import { AnatomicalFilterPipe } from 'src/app/shared/pipe/anatomical-filter.pipe';
import { TargetFilterPipe } from 'src/app/shared/pipe/target-filter.pipe';
import { PlanningDirectiveFilterPipe } from 'src/app/shared//pipe/plan-directive-filter.pipe';
import { MatDialogModule } from '@angular/material';
import { ToastModule, ToastsManager } from 'ng6-toastr/ng2-toastr';
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard';
import { PlanDirectiveWithoutTemplateComponent } from './component/plan/plan-directive-without-template/plan-directive-without-template.component';

@NgModule({
  declarations: [
    AppComponent,
    AnatomicalRegionComponent,
    PlanDirectiveComponent,
    HeaderComponent,
    PlanDirectiveDetailsComponent,
    PlanOrderComponent,
    TotalPhaseComponent,
    PlanDirectivePhaseComponent,
    PlanOrderHistoryComponent,
    StructureComponent,
    EditPhaseComponent,
    SubheaderComponent,
    GoalIntellisenseComponent,
    PlanDirectiveReadOnlyComponent,
    AnatomicalFilterPipe,
    PlanningDirectiveFilterPipe,
    TitleCasePipe,
    FilterPlanOrderPipe,
    TargetFilterPipe,
    ClickOutsideDirective,
    DateformatPipe,
    PlanDirectiveWithoutTemplateComponent],
  imports: [routing,
    BrowserModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    TabViewModule,
    ConfirmDialogModule,
    InputTextModule,
    ButtonModule, MatDialogModule,
    TabViewModule, ProgressSpinnerModule,
    CodeHighlighterModule,
    TableModule,
    DropdownModule,
    DialogModule,
    HttpClientModule,
    AccordionModule,
    ReactiveFormsModule,
    ToastModule,
    MessageModule,
    ListboxModule,
    CommonModule, NgHttpLoaderModule.forRoot(), ToastModule.forRoot()
  ],
  providers: [
    SiteService,
    DataServiceService,
    PlanDirectiveTemplateService,
    AnatomicalRegionService,
    PlanOrderService,
    PlanOrderHistoryService,
    AppService,
    ConfirmationService,
    ToastsManager,
    CanDeactivateGuard
  ],
  bootstrap: [AppComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
