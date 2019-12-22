import {
    PlanDirectiveDetailsComponent
} from 'src/app/component/plan/plan-directive-details/plan-directive-details.component';
import {
    PlanDirectivePhaseComponent
} from 'src/app/component/plan/plan-directive-details/plan-directive-phase/plan-directive-phase.component';
import { StructureComponent } from 'src/app/component/plan/plan-directive-details/structure/structure.component';
import { GoalIntellisenseComponent } from 'src/app/component/plan/plan-directive-details/goal-intellisense/goal-intellisense.component';
import { EditPhaseComponent } from 'src/app/component/plan/plan-directive-details/plan-directive-phase/edit-phase/edit-phase.component';
import { TitleCasePipe } from 'src/app/shared/pipe/title-case.pipe';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppService } from 'src/app/shared/helpers/app-service';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { TotalPhaseComponent } from 'src/app/component/plan/plan-directive-details/total-phase/total-phase.component';
import { ToastsManager, ToastOptions } from 'ng6-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { TargetFilterPipe } from 'src/app/shared/pipe/target-filter.pipe';
import { PlanOrderComponent } from 'src/app/component/tab/plan-order/plan-order.component';
import { SubheaderComponent } from 'src/app/component/header/subheader/subheader.component';
import { HeaderComponent } from 'src/app/component/header/header.component';
import { FilterPlanOrderPipe } from 'src/app/shared/pipe/filter-plan-order.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { PlanDirectiveTemplateDetailsService } from 'src/app/shared/services/plan-directive-template-details.service';
import { PlanDirectiveTemplateService } from 'src/app/shared/services/plan-directive-template.service';
import { TreatmentInstruction } from 'src/app/shared/models/treatment-instruction.model';
import { PlanOrderService } from 'src/app/shared/services/plan-order.service';
import { OrderPriority } from '../../../shared/models/order-priority.model';
import { StructureModel } from 'src/app/shared/models/structure-model.model';
import { ClinicalGoals } from '../../../shared/models/clinical-goal.model';
import { ElementRef, asNativeElements } from '@angular/core';
import {
    PlanDirectiveWithoutTemplateComponent
} from 'src/app/component/plan/plan-directive-without-template/plan-directive-without-template.component';
import { Promise } from 'q';
import { PlanDirectiveTemplate } from '../../../shared/models/plan-directive-template.model';

describe('PlanDirectiveDetailsComponent', () => {
    let component: PlanDirectiveDetailsComponent;
    let fixture: ComponentFixture<PlanDirectiveDetailsComponent>;
    let dataServiceService: DataServiceService;
    let appService: AppService;
    let planDirectiveTemplateDetailsService: PlanDirectiveTemplateDetailsService;
    let planDirectiveTemplateService: PlanDirectiveTemplateService;
    let planOrderService: PlanOrderService;
    let confirmationService: ConfirmationService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, FormsModule, ReactiveFormsModule, TableModule, DialogModule, RouterTestingModule.withRoutes([
                { path: 'Orders', component: PlanOrderComponent }])
            ],
            declarations: [PlanDirectiveDetailsComponent, PlanDirectiveWithoutTemplateComponent, PlanDirectivePhaseComponent,
                TotalPhaseComponent, HeaderComponent, TargetFilterPipe, SubheaderComponent, PlanOrderComponent, FilterPlanOrderPipe,
                StructureComponent, GoalIntellisenseComponent, EditPhaseComponent, TitleCasePipe],
            providers: [AppService, PlanDirectiveTemplateDetailsService, PlanDirectiveTemplateService,
                ConfirmationService, PlanOrderService,
                DataServiceService, ConfirmationService, ToastsManager, ToastOptions, {
                    provide: ActivatedRoute,
                    useValue: {
                        params: Observable.of({ orderId: 'Order_1', templateId: 4, siteId: 2 })
                    }
                }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PlanDirectiveDetailsComponent);
        dataServiceService = TestBed.get(DataServiceService);
        appService = TestBed.get(AppService);
        planDirectiveTemplateDetailsService = TestBed.get(PlanDirectiveTemplateDetailsService);
        planDirectiveTemplateService = TestBed.get(PlanDirectiveTemplateService);
        planOrderService = TestBed.get(PlanOrderService);
        confirmationService = TestBed.get(ConfirmationService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create PlanDirectiveDetailsComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch the route parameters', async(() => {
        spyOn(planDirectiveTemplateDetailsService, 'getStructureSetIdByorderId').and.returnValue(Observable.of('CT_1'));
        component.routeParameters();
        fixture.whenStable().then(() => {
            expect(component.structuresetId).toEqual('CT_1');
        });
    }));

    it('should fetch patient details ', async(() => {

        spyOn(planDirectiveTemplateDetailsService, 'getPatientByOrderId').and.returnValue(Observable.of({
            ID: '12345',
            AnonymizedID: 'xYudnmTymx sSusjc',
            Name: 'Zahid Khan'
        }));
        component.getPatient();
        fixture.whenStable().then(() => {
            expect(component.patient.Name).toEqual('Zahid Khan');
            expect(component.patientFirstNameCharacter).toEqual('K');
            expect(component.patientLastNameCharacter).toEqual('Z');
        });
    }));

    it('should fetch template and site name ', async(() => {

        spyOn(component, 'getFavouriteTemplate').and.returnValue(true);
        spyOn(planDirectiveTemplateService, 'getTemplatesBySiteId').and.returnValue(Observable.of([{
            PlanDirectiveTemplateID: 1,
            PlanDirectiveTemplateName: 'PlanDirectiveTemplateName',
            PlanDirectiveSiteID: 3,
            IsFavourite: true
        }]));
        spyOn(planDirectiveTemplateDetailsService, 'getSiteNameById').and.returnValue(Observable.of(
            ['Site_Name', 'Template_Name']
        ));
        component.getTemplateAndSiteName();
        fixture.whenStable().then(() => {
            expect(component.allTemplates[0].PlanDirectiveTemplateName).toBe('PlanDirectiveTemplateName');

        });
    }));

    it('should fetch this.styleConfigured value from json file', async(() => {
        const pMock = {
            subscribe: () => component.styleConfigured = 'varian'
        };
        spyOn(dataServiceService, 'getConfiguredStyle').and.returnValue(pMock);
        component.getConfiguredStyle();
        fixture.whenStable().then(() => {

            expect(component.styleConfigured).toEqual('varian');
        });
    }));

    it('should fetch this.styleConfigured value from json file if not correct by default is varian', async(() => {
        const pMock = {
            subscribe: () => component.styleConfigured = '1'
        };
        spyOn(dataServiceService, 'getConfiguredStyle').and.returnValue(pMock);
        component.getConfiguredStyle();
        fixture.whenStable().then(() => {

            expect(component.styleConfigured).toEqual('varian');
        });
    }));
    it('should create validators for submitting plan order', () => {
        component.createSubmitOrderForm();
        expect(component.placeOrderForm).toBeTruthy();
    });

    it('should template data from database when template Id greater than 0', async(() => {

        spyOn(component, 'GetStructureCollection').and.returnValue(true);
        spyOn(component, 'updateTemplateInUI').and.returnValue(true);
        spyOn(appService, 'changeTreatment').and.returnValue(true);

        let treatmentInstruction = new TreatmentInstruction();
        treatmentInstruction = {
            Identifier: '6a10990d-6696-480d-b9f2-3024add297c1',
            DisplayName: 'Test Template',
            AnatomicalRegion: 'Pelvis',
            AnatomicalSite: 'Prostate',
            OARs: {
                Structure: [
                    { Id: 'OAR1', Code: '15900', Schema: 'FMA', SchemaVersion: '3.2', Meaning: 'Controlateral Breast', Color: null, Name: 'Controlateral Breast' },
                    { Id: 'OAR2', Code: '14544', Schema: 'FMA', SchemaVersion: '3.2', Meaning: 'Ipsilateral lung', Color: null, Name: 'Ipsilateral lung' },
                    { Id: 'OAR3', Code: '14544', Schema: 'FMA', SchemaVersion: '3.2', Meaning: 'Controlateral lung', Color: null, Name: 'Controlateral lung' },
                    { Id: 'OAR4', Code: '14544', Schema: 'FMA', SchemaVersion: '3.2', Meaning: 'Heart', Color: null, Name: 'Heart' }]
            },
            Targets: {
                Structure: [
                    { Id: 'Target1', Code: 'PTV', Schema: '99VMS_STRUCTCODE', SchemaVersion: '1', Meaning: 'Planning Target Volume', Color: null, Name: 'PTV High' },
                    { Id: 'Target2', Code: 'CTV', Schema: '99VMS_STRUCTCODE', SchemaVersion: '1', Meaning: 'Clinical Target Volume', Color: null, Name: 'CTV Low' }]
            },
            OARObjectives: {
                Objective: [
                    { StructureId: 'OAR1', Phase: '1', ClinicalGoal: { DVHObjective: 'Max[Gy]', Evaluator: '<=2', DoseLeft: 'Max', DoseRight: '[Gy]' }, AcceptableVariation: { DVHObjective: 'Max[Gy]', Evaluator: '<=4', DoseLeft: 'Max', DoseRight: '[Gy]' }, Priority: '1' },
                    { StructureId: 'OAR1', Phase: '2', ClinicalGoal: { DVHObjective: 'D5%[Gy]', Evaluator: '<=1.44', DoseLeft: 'D5%', DoseRight: '[Gy]' }, AcceptableVariation: { DVHObjective: 'D5%[Gy]', Evaluator: '<=1.42', DoseLeft: 'D5%', DoseRight: '[Gy]' }, Priority: '2' },
                    { StructureId: 'OAR2', Phase: '1', ClinicalGoal: { DVHObjective: 'V16cc[%]', Evaluator: '<=15', DoseLeft: 'V16cc', DoseRight: '[%]' }, AcceptableVariation: { DVHObjective: 'V16cc[%]', Evaluator: '<=11', DoseLeft: 'V16cc', DoseRight: '[%]' }, Priority: '3' },
                    { StructureId: 'OAR2', Phase: '2', ClinicalGoal: { DVHObjective: 'V16cc[%]', Evaluator: '<=15', DoseLeft: 'V16cc', DoseRight: '[%]' }, AcceptableVariation: { DVHObjective: 'V16cc[%]', Evaluator: '<=11', DoseLeft: 'V16cc', DoseRight: '[%]' }, Priority: '3' },
                    { StructureId: 'OAR3', Phase: '2', ClinicalGoal: { DVHObjective: 'Max[cc]', Evaluator: '<=2', DoseLeft: 'Max', DoseRight: '[cc]' }, AcceptableVariation: { DVHObjective: 'Max[cc]', Evaluator: '<=5', DoseLeft: 'Max', DoseRight: '[cc]' }, Priority: '4' },
                    { StructureId: 'OAR4', Phase: '2', ClinicalGoal: { DVHObjective: 'Mean[%]', Evaluator: '<=2', DoseLeft: 'Mean', DoseRight: '[%]' }, AcceptableVariation: { DVHObjective: 'Mean[%]', Evaluator: '<=3', DoseLeft: 'Mean', DoseRight: '[%]' }, Priority: '5' }]
            },
            PrescribedSessions: {
                Session: [
                    { Id: '1', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '2', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '3', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '4', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '5', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '6', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '7', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '8', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '9', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '10', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '11', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '12', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '13', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '14', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '15', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '16', ReferencedPhase: '2', Imaging: 'None' },
                    { Id: '17', ReferencedPhase: '2', Imaging: 'None' },
                    { Id: '18', ReferencedPhase: '2', Imaging: 'None' },
                    { Id: '19', ReferencedPhase: '2', Imaging: 'None' },
                    { Id: '20', ReferencedPhase: '2', Imaging: 'None' }]
            },
            Phases: {
                Phase: [
                    {
                        Id: '1', PhaseId: '1', PrescriptionTargets: {
                            PrescriptionTarget: [{
                                StructureId: 'Target1', FractionDoseGy: '4', FractionCount: '15', TotalDose: '60',
                                Objectives: {
                                    Objective: [
                                        {
                                            StructureId: 'Target1', Phase: '1',
                                            ClinicalGoal: {
                                                DVHObjective: 'D5%[Gy]', Evaluator: '<=52', DoseLeft: 'D5%', DoseRight: '[Gy]'
                                            },
                                            AcceptableVariation:
                                                { DVHObjective: 'D5%[Gy]', Evaluator: '<=53', DoseLeft: 'D5%', DoseRight: '[Gy]' },
                                            Priority: '1'
                                        },
                                        {
                                            StructureId: 'Target1', Phase: '1', ClinicalGoal:

                                                { DVHObjective: 'Max[%]', Evaluator: '<=105', DoseLeft: 'Max', DoseRight: '[%]' },
                                            AcceptableVariation: {
                                                DVHObjective: 'Max[%]', Evaluator: '<=115', DoseLeft: 'Max',
                                                DoseRight: '[%]'
                                            }, Priority: '2'
                                        }]
                                }
                            }, {
                                StructureId: 'Target2', FractionDoseGy: '2', FractionCount: '15', TotalDose: '30', Objectives:
                                {
                                    Objective: [{
                                        StructureId: 'Target1', Phase: '1', ClinicalGoal: {
                                            DVHObjective: 'V43%[cc]',
                                            Evaluator: '<=50', DoseLeft: 'V43%', DoseRight: '[cc]'
                                        }, AcceptableVariation: {
                                            DVHObjective: 'V43%[cc]',
                                            Evaluator: '<=45', DoseLeft: 'V43%', DoseRight: '[cc]'
                                        }, Priority: '1'
                                    }, {
                                        StructureId: 'Target1', Phase: '1',
                                        ClinicalGoal: { DVHObjective: 'Mean[cc]', Evaluator: '<=7', DoseLeft: 'Mean', DoseRight: '[cc]' },
                                        AcceptableVariation: { DVHObjective: 'Mean[cc]', Evaluator: '<=10', DoseLeft: 'Mean', DoseRight: '[cc]' },
                                        Priority: '2'
                                    }]
                                }
                            }]
                        }

                    },

                    {
                        Id: '2', PhaseId: '2', PrescriptionTargets: {
                            PrescriptionTarget: [{
                                StructureId: 'Target1', FractionDoseGy: '8',
                                FractionCount: '5', TotalDose: '40', Objectives: {
                                    Objective: [{
                                        StructureId: 'Target1', Phase: '2', ClinicalGoal:
                                            { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: 'D3cc', DoseRight: '[Gy]' },
                                        AcceptableVariation: {
                                            DVHObjective: 'D3cc[Gy]', Evaluator: '<=52',
                                            DoseLeft: 'D3cc', DoseRight: '[Gy]'
                                        }, Priority: '1'
                                    },
                                    {
                                        StructureId: 'Target1', Phase: '2', ClinicalGoal: {
                                            DVHObjective: 'Mean[Gy]', Evaluator: '<=19',
                                            DoseLeft: 'Mean', DoseRight: '[Gy]'
                                        }, AcceptableVariation: {
                                            DVHObjective: 'Mean[Gy]',
                                            Evaluator: '<=10', DoseLeft: 'Mean', DoseRight: '[Gy]'
                                        }, Priority: '2'
                                    }]
                                }
                            },
                            {
                                StructureId: 'Target2', FractionDoseGy: '4', FractionCount: '5', TotalDose: '20',
                                Objectives: {
                                    Objective: [{
                                        StructureId: 'Target1', Phase: '2', ClinicalGoal: {
                                            DVHObjective: 'V43Gy[cc]',
                                            Evaluator: '<=50', DoseLeft: 'V43Gy', DoseRight: '[cc]'
                                        }, AcceptableVariation: {
                                            DVHObjective: 'V43Gy[cc]',
                                            Evaluator: '<=52', DoseLeft: 'V43Gy', DoseRight: '[cc]'
                                        }, Priority: '1'
                                    },
                                    {
                                        StructureId: 'Target1', Phase: '2', ClinicalGoal: {
                                            DVHObjective: 'V48Gy[%]',
                                            Evaluator: '<=30', DoseLeft: 'V48Gy', DoseRight: '[%]'
                                        },
                                        AcceptableVariation: {
                                            DVHObjective: 'V48Gy[%]',
                                            Evaluator: '<=28', DoseLeft: 'V48Gy', DoseRight: '[%]'
                                        },
                                        Priority: '2'
                                    }]
                                }
                            }]
                        }
                    }]
            },

            Notes: {
                Note: [{ TimeStamp: '30 Jul 2018, 1:31 PM', UpdatedBy: 'RO', Comment: 'Comment Added by Remote Oncologist' },
                { TimeStamp: '30 Jul 2018, 1:31 PM', UpdatedBy: 'RO', Comment: 'Comment Added by Remote Oncologist' }]
            }
        };
        spyOn(planDirectiveTemplateDetailsService, 'getTemplateByTemplateId').
            and.returnValue(Observable.of(JSON.stringify(treatmentInstruction)));
        component.getTemplate();
        fixture.whenStable().then(() => {

            expect(component.obj).toBeTruthy();

        });
    }));

    it('should template data from database when template Id = 0', async(() => {

        spyOn(component, 'GetStructureCollection').and.returnValue(true);
        spyOn(component, 'updateTemplateInUI').and.returnValue(true);
        spyOn(appService, 'changeTreatment').and.returnValue(true);

        let treatmentInstruction = new TreatmentInstruction();
        treatmentInstruction = {
            Identifier: '6a10990d-6696-480d-b9f2-3024add297c1',
            DisplayName: 'Test Template',
            AnatomicalRegion: 'Pelvis',
            AnatomicalSite: 'Prostate',
            OARs: {
                Structure: [
                    { Id: 'OAR1', Code: '15900', Schema: 'FMA', SchemaVersion: '3.2', Meaning: 'Controlateral Breast', Color: null, Name: 'Controlateral Breast' },
                    { Id: 'OAR2', Code: '14544', Schema: 'FMA', SchemaVersion: '3.2', Meaning: 'Ipsilateral lung', Color: null, Name: 'Ipsilateral lung' },
                    { Id: 'OAR3', Code: '14544', Schema: 'FMA', SchemaVersion: '3.2', Meaning: 'Controlateral lung', Color: null, Name: 'Controlateral lung' },
                    { Id: 'OAR4', Code: '14544', Schema: 'FMA', SchemaVersion: '3.2', Meaning: 'Heart', Color: null, Name: 'Heart' }]
            },
            Targets: {
                Structure: [
                    { Id: 'Target1', Code: 'PTV', Schema: '99VMS_STRUCTCODE', SchemaVersion: '1', Meaning: 'Planning Target Volume', Color: null, Name: 'PTV High' },
                    { Id: 'Target2', Code: 'CTV', Schema: '99VMS_STRUCTCODE', SchemaVersion: '1', Meaning: 'Clinical Target Volume', Color: null, Name: 'CTV Low' }]
            },
            OARObjectives: {
                Objective: [
                    { StructureId: 'OAR1', Phase: '1', ClinicalGoal: { DVHObjective: 'Max[Gy]', Evaluator: '<=2', DoseLeft: 'Max', DoseRight: '[Gy]' }, AcceptableVariation: { DVHObjective: 'Max[Gy]', Evaluator: '<=4', DoseLeft: 'Max', DoseRight: '[Gy]' }, Priority: '1' },
                    { StructureId: 'OAR1', Phase: '2', ClinicalGoal: { DVHObjective: 'D5%[Gy]', Evaluator: '<=1.44', DoseLeft: 'D5%', DoseRight: '[Gy]' }, AcceptableVariation: { DVHObjective: 'D5%[Gy]', Evaluator: '<=1.42', DoseLeft: 'D5%', DoseRight: '[Gy]' }, Priority: '2' },
                    { StructureId: 'OAR2', Phase: '1', ClinicalGoal: { DVHObjective: 'V16cc[%]', Evaluator: '<=15', DoseLeft: 'V16cc', DoseRight: '[%]' }, AcceptableVariation: { DVHObjective: 'V16cc[%]', Evaluator: '<=11', DoseLeft: 'V16cc', DoseRight: '[%]' }, Priority: '3' },
                    { StructureId: 'OAR2', Phase: '2', ClinicalGoal: { DVHObjective: 'V16cc[%]', Evaluator: '<=15', DoseLeft: 'V16cc', DoseRight: '[%]' }, AcceptableVariation: { DVHObjective: 'V16cc[%]', Evaluator: '<=11', DoseLeft: 'V16cc', DoseRight: '[%]' }, Priority: '3' },
                    { StructureId: 'OAR3', Phase: '2', ClinicalGoal: { DVHObjective: 'Max[cc]', Evaluator: '<=2', DoseLeft: 'Max', DoseRight: '[cc]' }, AcceptableVariation: { DVHObjective: 'Max[cc]', Evaluator: '<=5', DoseLeft: 'Max', DoseRight: '[cc]' }, Priority: '4' },
                    { StructureId: 'OAR4', Phase: '2', ClinicalGoal: { DVHObjective: 'Mean[%]', Evaluator: '<=2', DoseLeft: 'Mean', DoseRight: '[%]' }, AcceptableVariation: { DVHObjective: 'Mean[%]', Evaluator: '<=3', DoseLeft: 'Mean', DoseRight: '[%]' }, Priority: '5' }]
            },
            PrescribedSessions: {
                Session: [
                    { Id: '1', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '2', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '3', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '4', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '5', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '6', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '7', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '8', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '9', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '10', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '11', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '12', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '13', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '14', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '15', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '16', ReferencedPhase: '2', Imaging: 'None' },
                    { Id: '17', ReferencedPhase: '2', Imaging: 'None' },
                    { Id: '18', ReferencedPhase: '2', Imaging: 'None' },
                    { Id: '19', ReferencedPhase: '2', Imaging: 'None' },
                    { Id: '20', ReferencedPhase: '2', Imaging: 'None' }]
            },
            Phases: {
                Phase: [
                    {
                        Id: '1', PhaseId: '1', PrescriptionTargets: {
                            PrescriptionTarget: [{
                                StructureId: 'Target1', FractionDoseGy: '4', FractionCount: '15', TotalDose: '60',
                                Objectives: {
                                    Objective: [
                                        {
                                            StructureId: 'Target1', Phase: '1',
                                            ClinicalGoal: {
                                                DVHObjective: 'D5%[Gy]', Evaluator: '<=52', DoseLeft: 'D5%', DoseRight: '[Gy]'
                                            },
                                            AcceptableVariation:
                                                { DVHObjective: 'D5%[Gy]', Evaluator: '<=53', DoseLeft: 'D5%', DoseRight: '[Gy]' },
                                            Priority: '1'
                                        },
                                        {
                                            StructureId: 'Target1', Phase: '1', ClinicalGoal:

                                                { DVHObjective: 'Max[%]', Evaluator: '<=105', DoseLeft: 'Max', DoseRight: '[%]' },
                                            AcceptableVariation: {
                                                DVHObjective: 'Max[%]', Evaluator: '<=115', DoseLeft: 'Max',
                                                DoseRight: '[%]'
                                            }, Priority: '2'
                                        }]
                                }
                            }, {
                                StructureId: 'Target2', FractionDoseGy: '2', FractionCount: '15', TotalDose: '30', Objectives:
                                {
                                    Objective: [{
                                        StructureId: 'Target1', Phase: '1', ClinicalGoal: {
                                            DVHObjective: 'V43%[cc]',
                                            Evaluator: '<=50', DoseLeft: 'V43%', DoseRight: '[cc]'
                                        }, AcceptableVariation: {
                                            DVHObjective: 'V43%[cc]',
                                            Evaluator: '<=45', DoseLeft: 'V43%', DoseRight: '[cc]'
                                        }, Priority: '1'
                                    }, {
                                        StructureId: 'Target1', Phase: '1',
                                        ClinicalGoal: { DVHObjective: 'Mean[cc]', Evaluator: '<=7', DoseLeft: 'Mean', DoseRight: '[cc]' },
                                        AcceptableVariation: { DVHObjective: 'Mean[cc]', Evaluator: '<=10', DoseLeft: 'Mean', DoseRight: '[cc]' },
                                        Priority: '2'
                                    }]
                                }
                            }]
                        }

                    },

                    {
                        Id: '2', PhaseId: '2', PrescriptionTargets: {
                            PrescriptionTarget: [{
                                StructureId: 'Target1', FractionDoseGy: '8',
                                FractionCount: '5', TotalDose: '40', Objectives: {
                                    Objective: [{
                                        StructureId: 'Target1', Phase: '2', ClinicalGoal:
                                            { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: 'D3cc', DoseRight: '[Gy]' },
                                        AcceptableVariation: {
                                            DVHObjective: 'D3cc[Gy]', Evaluator: '<=52',
                                            DoseLeft: 'D3cc', DoseRight: '[Gy]'
                                        }, Priority: '1'
                                    },
                                    {
                                        StructureId: 'Target1', Phase: '2', ClinicalGoal: {
                                            DVHObjective: 'Mean[Gy]', Evaluator: '<=19',
                                            DoseLeft: 'Mean', DoseRight: '[Gy]'
                                        }, AcceptableVariation: {
                                            DVHObjective: 'Mean[Gy]',
                                            Evaluator: '<=10', DoseLeft: 'Mean', DoseRight: '[Gy]'
                                        }, Priority: '2'
                                    }]
                                }
                            },
                            {
                                StructureId: 'Target2', FractionDoseGy: '4', FractionCount: '5', TotalDose: '20',
                                Objectives: {
                                    Objective: [{
                                        StructureId: 'Target1', Phase: '2', ClinicalGoal: {
                                            DVHObjective: 'V43Gy[cc]',
                                            Evaluator: '<=50', DoseLeft: 'V43Gy', DoseRight: '[cc]'
                                        }, AcceptableVariation: {
                                            DVHObjective: 'V43Gy[cc]',
                                            Evaluator: '<=52', DoseLeft: 'V43Gy', DoseRight: '[cc]'
                                        }, Priority: '1'
                                    },
                                    {
                                        StructureId: 'Target1', Phase: '2', ClinicalGoal: {
                                            DVHObjective: 'V48Gy[%]',
                                            Evaluator: '<=30', DoseLeft: 'V48Gy', DoseRight: '[%]'
                                        },
                                        AcceptableVariation: {
                                            DVHObjective: 'V48Gy[%]',
                                            Evaluator: '<=28', DoseLeft: 'V48Gy', DoseRight: '[%]'
                                        },
                                        Priority: '2'
                                    }]
                                }
                            }]
                        }
                    }]
            },

            Notes: {
                Note: [{ TimeStamp: '30 Jul 2018, 1:31 PM', UpdatedBy: 'RO', Comment: 'Comment Added by Remote Oncologist' },
                { TimeStamp: '30 Jul 2018, 1:31 PM', UpdatedBy: 'RO', Comment: 'Comment Added by Remote Oncologist' }]
            }
        };
        spyOn(planDirectiveTemplateDetailsService, 'getTemplateByTemplateId').
            and.returnValue(Observable.of(JSON.stringify(treatmentInstruction)));
        component.templateId = 0;
        component.getTemplate();
        fixture.whenStable().then(() => {

            expect(component.obj).toBeTruthy();

        });
    }));

    it('should fetch list of machineId from json', async(() => {

        spyOn(planOrderService, 'getAllMachineID').and.returnValue(Observable.of(
            {
                'MachineID': ['Varian23Ex', 'TrueBeam STX', 'Scanner Test', 'ProBeam']
            }));
        component.getAllMachineID();
        fixture.whenStable().then(() => {

            expect(component.machineID.length).toBe(4);

        });
    }));
    it('should fetch list of priority', async(() => {

        let orderpriority: OrderPriority[] = [];
        orderpriority = [{
            id: 1,
            priority: 'High'
        }, {
            id: 2,
            priority: 'Medium'
        }, {
            id: 3,
            priority: 'Low'
        }];
        spyOn(planOrderService, 'getPriority').and.returnValue(Observable.of(orderpriority));
        component.getPriority();
        fixture.whenStable().then(() => {

            expect(component.priorityOptions.length).toBe(3);

        });
    }));

    it('save as button shuould be disabled', () => {
        component.controlStatusCheck(true);
        expect(component.disableSaveOptions).toBe(false);
    });

    it('should update the submitted order details if value passed is not empty', () => {
        component.priorityOptions = [{
            id: 1,
            priority: 'High'
        }, {
            id: 2,
            priority: 'Medium'
        }, {
            id: 3,
            priority: 'Low'
        }];

        component.updateSubmitOrderDetails(2);

        expect(component.objSubmitOrder.PriorityName).toBe('Medium');

    });

    it('should set the priority name as null if value passed is empty', () => {
        component.priorityOptions = [{
            id: 1,
            priority: 'High'
        }, {
            id: 2,
            priority: 'Medium'
        }, {
            id: 3,
            priority: 'Low'
        }];
        component.updateSubmitOrderDetails('');
        expect(component.objSubmitOrder.PlanPriority).toBeNull();
    });

    it('should update the template in UI', async(() => {

        spyOn(component, 'cleanPreviousObjects').and.returnValue(true);
        let treatmentInstruction = new TreatmentInstruction();
        treatmentInstruction = {
            Identifier: '6a10990d-6696-480d-b9f2-3024add297c1',
            DisplayName: 'Test Template',
            AnatomicalRegion: 'Pelvis',
            AnatomicalSite: 'Prostate',
            OARs: {
                Structure: [
                    { Id: 'OAR1', Code: '15900', Schema: 'FMA', SchemaVersion: '3.2', Meaning: 'Controlateral Breast', Color: null, Name: 'Controlateral Breast' },
                    { Id: 'OAR2', Code: '14544', Schema: 'FMA', SchemaVersion: '3.2', Meaning: 'Ipsilateral lung', Color: null, Name: 'Ipsilateral lung' },
                    { Id: 'OAR3', Code: '14544', Schema: 'FMA', SchemaVersion: '3.2', Meaning: 'Controlateral lung', Color: null, Name: 'Controlateral lung' },
                    { Id: 'OAR4', Code: '14544', Schema: 'FMA', SchemaVersion: '3.2', Meaning: 'Heart', Color: null, Name: 'Heart' }]
            },
            Targets: {
                Structure: [
                    { Id: 'Target1', Code: 'PTV', Schema: '99VMS_STRUCTCODE', SchemaVersion: '1', Meaning: 'Planning Target Volume', Color: null, Name: 'PTV High' },
                    { Id: 'Target2', Code: 'CTV', Schema: '99VMS_STRUCTCODE', SchemaVersion: '1', Meaning: 'Clinical Target Volume', Color: null, Name: 'CTV Low' }]
            },
            OARObjectives: {
                Objective: [
                    { StructureId: 'OAR1', Phase: '1', ClinicalGoal: { DVHObjective: 'Max[Gy]', Evaluator: '<=2', DoseLeft: 'Max', DoseRight: '[Gy]' }, AcceptableVariation: { DVHObjective: 'Max[Gy]', Evaluator: '<=4', DoseLeft: 'Max', DoseRight: '[Gy]' }, Priority: '1' },
                    { StructureId: 'OAR1', Phase: '2', ClinicalGoal: { DVHObjective: 'D5%[Gy]', Evaluator: '<=1.44', DoseLeft: 'D5%', DoseRight: '[Gy]' }, AcceptableVariation: { DVHObjective: 'D5%[Gy]', Evaluator: '<=1.42', DoseLeft: 'D5%', DoseRight: '[Gy]' }, Priority: '2' },
                    { StructureId: 'OAR2', Phase: '1', ClinicalGoal: { DVHObjective: 'V16cc[%]', Evaluator: '<=15', DoseLeft: 'V16cc', DoseRight: '[%]' }, AcceptableVariation: { DVHObjective: 'V16cc[%]', Evaluator: '<=11', DoseLeft: 'V16cc', DoseRight: '[%]' }, Priority: '3' },
                    { StructureId: 'OAR2', Phase: '2', ClinicalGoal: { DVHObjective: 'V16cc[%]', Evaluator: '<=15', DoseLeft: 'V16cc', DoseRight: '[%]' }, AcceptableVariation: { DVHObjective: 'V16cc[%]', Evaluator: '<=11', DoseLeft: 'V16cc', DoseRight: '[%]' }, Priority: '3' },
                    { StructureId: 'OAR3', Phase: '2', ClinicalGoal: { DVHObjective: 'Max[cc]', Evaluator: '<=2', DoseLeft: 'Max', DoseRight: '[cc]' }, AcceptableVariation: { DVHObjective: 'Max[cc]', Evaluator: '<=5', DoseLeft: 'Max', DoseRight: '[cc]' }, Priority: '4' },
                    { StructureId: 'OAR4', Phase: '2', ClinicalGoal: { DVHObjective: 'Mean[%]', Evaluator: '<=2', DoseLeft: 'Mean', DoseRight: '[%]' }, AcceptableVariation: { DVHObjective: 'Mean[%]', Evaluator: '<=3', DoseLeft: 'Mean', DoseRight: '[%]' }, Priority: '5' }]
            },
            PrescribedSessions: {
                Session: [
                    { Id: '1', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '2', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '3', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '4', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '5', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '6', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '7', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '8', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '9', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '10', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '11', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '12', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '13', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '14', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '15', ReferencedPhase: '1', Imaging: 'None' },
                    { Id: '16', ReferencedPhase: '2', Imaging: 'None' },
                    { Id: '17', ReferencedPhase: '2', Imaging: 'None' },
                    { Id: '18', ReferencedPhase: '2', Imaging: 'None' },
                    { Id: '19', ReferencedPhase: '2', Imaging: 'None' },
                    { Id: '20', ReferencedPhase: '2', Imaging: 'None' }]
            },
            Phases: {
                Phase: [
                    {
                        Id: '1', PhaseId: '1', PrescriptionTargets: {
                            PrescriptionTarget: [{
                                StructureId: 'Target1', FractionDoseGy: '4', FractionCount: '15', TotalDose: '60',
                                Objectives: {
                                    Objective: [
                                        {
                                            StructureId: 'Target1', Phase: '1',
                                            ClinicalGoal: {
                                                DVHObjective: 'D5%[Gy]', Evaluator: '<=52', DoseLeft: 'D5%', DoseRight: '[Gy]'
                                            },
                                            AcceptableVariation:
                                                { DVHObjective: 'D5%[Gy]', Evaluator: '<=53', DoseLeft: 'D5%', DoseRight: '[Gy]' },
                                            Priority: '1'
                                        },
                                        {
                                            StructureId: 'Target1', Phase: '1', ClinicalGoal:

                                                { DVHObjective: 'Max[%]', Evaluator: '<=105', DoseLeft: 'Max', DoseRight: '[%]' },
                                            AcceptableVariation: {
                                                DVHObjective: 'Max[%]', Evaluator: '<=115', DoseLeft: 'Max',
                                                DoseRight: '[%]'
                                            }, Priority: '2'
                                        }]
                                }
                            }, {
                                StructureId: 'Target2', FractionDoseGy: '2', FractionCount: '15', TotalDose: '30', Objectives:
                                {
                                    Objective: [{
                                        StructureId: 'Target1', Phase: '1', ClinicalGoal: {
                                            DVHObjective: 'V43%[cc]',
                                            Evaluator: '<=50', DoseLeft: 'V43%', DoseRight: '[cc]'
                                        }, AcceptableVariation: {
                                            DVHObjective: 'V43%[cc]',
                                            Evaluator: '<=45', DoseLeft: 'V43%', DoseRight: '[cc]'
                                        }, Priority: '1'
                                    }, {
                                        StructureId: 'Target1', Phase: '1',
                                        ClinicalGoal: { DVHObjective: 'Mean[cc]', Evaluator: '<=7', DoseLeft: 'Mean', DoseRight: '[cc]' },
                                        AcceptableVariation: { DVHObjective: 'Mean[cc]', Evaluator: '<=10', DoseLeft: 'Mean', DoseRight: '[cc]' },
                                        Priority: '2'
                                    }]
                                }
                            }]
                        }

                    },

                    {
                        Id: '2', PhaseId: '2', PrescriptionTargets: {
                            PrescriptionTarget: [{
                                StructureId: 'Target1', FractionDoseGy: '8',
                                FractionCount: '5', TotalDose: '40', Objectives: {
                                    Objective: [{
                                        StructureId: 'Target1', Phase: '2', ClinicalGoal:
                                            { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: 'D3cc', DoseRight: '[Gy]' },
                                        AcceptableVariation: {
                                            DVHObjective: 'D3cc[Gy]', Evaluator: '<=52',
                                            DoseLeft: 'D3cc', DoseRight: '[Gy]'
                                        }, Priority: '1'
                                    },
                                    {
                                        StructureId: 'Target1', Phase: '2', ClinicalGoal: {
                                            DVHObjective: 'Mean[Gy]', Evaluator: '<=19',
                                            DoseLeft: 'Mean', DoseRight: '[Gy]'
                                        }, AcceptableVariation: {
                                            DVHObjective: 'Mean[Gy]',
                                            Evaluator: '<=10', DoseLeft: 'Mean', DoseRight: '[Gy]'
                                        }, Priority: '2'
                                    }]
                                }
                            },
                            {
                                StructureId: 'Target2', FractionDoseGy: '4', FractionCount: '5', TotalDose: '20',
                                Objectives: {
                                    Objective: [{
                                        StructureId: 'Target1', Phase: '2', ClinicalGoal: {
                                            DVHObjective: 'V43Gy[cc]',
                                            Evaluator: '<=50', DoseLeft: 'V43Gy', DoseRight: '[cc]'
                                        }, AcceptableVariation: {
                                            DVHObjective: 'V43Gy[cc]',
                                            Evaluator: '<=52', DoseLeft: 'V43Gy', DoseRight: '[cc]'
                                        }, Priority: '1'
                                    },
                                    {
                                        StructureId: 'Target1', Phase: '2', ClinicalGoal: {
                                            DVHObjective: 'V48Gy[%]',
                                            Evaluator: '<=30', DoseLeft: 'V48Gy', DoseRight: '[%]'
                                        },
                                        AcceptableVariation: {
                                            DVHObjective: 'V48Gy[%]',
                                            Evaluator: '<=28', DoseLeft: 'V48Gy', DoseRight: '[%]'
                                        },
                                        Priority: '2'
                                    }]
                                }
                            }]
                        }
                    }]
            },

            Notes: {
                Note: [{ TimeStamp: '30 Jul 2018, 1:31 PM', UpdatedBy: 'RO', Comment: 'Comment Added by Remote Oncologist' },
                { TimeStamp: '30 Jul 2018, 1:31 PM', UpdatedBy: 'RO', Comment: 'Comment Added by Remote Oncologist' }]
            }
        };
        appService.changeTreatment(treatmentInstruction);
        component.updateTemplateInUI();
        fixture.whenStable().then(() => {
            expect(component.phaseAll.length).toBeGreaterThan(0);
        });
    }));

    it('should set the structure ', () => {
        const structure: StructureModel = {
            Meaning: 'Meaning', Code: 'PTV', Name: 'Planning Target Volume'
        };
        spyOn(component, 'goalsValid').and.returnValue(true);
        component.SetStructure(structure);
        expect(component.Structure).toBe(structure);

    });

    it('should clean the object specified', () => {
        component.cleanPreviousObjects();
        expect(component.oarStructureInfo.length).toBe(0);
        expect(component.structuresInfo.length).toBe(0);
    });

    it('should open the edit phase popup', () => {
        spyOn(component, 'controlStatusCheck').and.returnValue(true);
        component.openEditPopup();
        fixture.whenStable().then(() => {
            expect(component.showEditDialog).toBe(true);
        });
    });

    it('should add the target', () => {
        spyOn(component, 'controlStatusCheck').and.returnValue(true);
        component.Add('Target');
        expect(component.isTarget).toBe(true);
    });

    it('should add the organ', () => {
        spyOn(component, 'controlStatusCheck').and.returnValue(true);
        component.Add('OAR');
        expect(component.isTarget).toBe(false);
    });

    it('should add goal', () => {
        spyOn(component, 'controlStatusCheck').and.returnValue(true);
        component.addGoal();
        expect(component.clinicalGoals.length).toBeGreaterThan(0);
    });

    it('should delete goal', () => {
        const clinicalGoal: ClinicalGoals = {
            Goal: 'Goal1',
            Variation: 'variation1',
            Priority: 'high',
            Phase: '1',
            isGoalValid: false,
            isVariationValid: true
        };
        const clinicalGoals: ClinicalGoals[] = [
            {
                Goal: 'Goal1',
                Variation: 'variation1',
                Priority: 'high',
                Phase: '1',
                isGoalValid: false,
                isVariationValid: true
            },
            {
                Goal: 'Goal2',
                Variation: 'variation2',
                Priority: 'low',
                Phase: '2',
                isGoalValid: true,
                isVariationValid: true
            },
            {
                Goal: 'Goal3',
                Variation: 'variation3',
                Priority: 'medium',
                Phase: '3',
                isGoalValid: true,
                isVariationValid: true
            }
        ];
        component.clinicalGoals = clinicalGoals;
        spyOn(component, 'goalsValid').and.returnValue(true);
        spyOn(confirmationService, 'confirm').and.callFake((params: any) => {
            params.accept();
        });
        component.deleteGoal(clinicalGoal);
        expect(component.clinicalGoals.length).toBe(2);
    });

    it('should add the notes ', async(() => {
        spyOn(appService, 'AddEditNotes').and.returnValue(true);
        component.editNotes = [];
        component.AddEditNotes({ commentNotes: 'Notes comments' }, 0, 'Add');
        fixture.whenStable().then(() => {
            expect(component.editNotes.length).toBe(1);
        });
    }));

    it('should edit the notes ', async(() => {
        spyOn(appService, 'AddEditNotes').and.returnValue(true);
        component.editNotes = [true];
        component.AddEditNotes({ commentNotes: 'Notes comments' }, 0, 'Edit');
        fixture.whenStable().then(() => {
            expect(component.editNotes.length).toBe(0);
        });
    }));

    it('should add/edit the empty notes ', async(() => {
        spyOn(appService, 'AddEditNotes').and.returnValue(true);
        component.editNotes = [];
        component.AddEditNotes({ commentNotes: '' }, 0, 'Add');
        expect(component.editNotes.length).toBe(0);
    }));

    it('should display the notes to the user', () => {
        spyOn(component, 'controlStatusCheck').and.returnValue(true);
        component.editNotes = [true, false, false, false, false];
        component.displayEditNotes(2);

        expect(component.editNotes[2]).toBe(true);

    });

    it('should open the notes popup for adding notes and close all the edited notes popup', () => {
        spyOn(component, 'controlStatusCheck').and.returnValue(true);
        component.NotesDiv = new ElementRef(asNativeElements);
        component.editNotes = [true, false, false, false, false];
        component.openNotesPopup();
        expect(component.displayAddNotes).toBe(true);
        expect(component.editNotes[0]).toBe(false);
    });

    it('should close the notes popup', () => {

        spyOn(confirmationService, 'confirm').and.callFake((params: any) => {
            params.accept();
        });

        component.close();
        expect(component.displayDialog).toBe(false);
        expect(component.disableAddType).toBe(false);
    });

    it('should update the goal priority', () => {
        const clinicalGoal: ClinicalGoals = {
            Goal: 'Goal1',
            Variation: 'variation1',
            Priority: 'high',
            Phase: '1',
            isGoalValid: false,
            isVariationValid: true
        };
        const clinicalGoals: ClinicalGoals[] = [
            {
                Goal: 'Goal1',
                Variation: 'variation1',
                Priority: 'high',
                Phase: '1',
                isGoalValid: false,
                isVariationValid: true
            },
            {
                Goal: 'Goal2',
                Variation: 'variation2',
                Priority: 'low',
                Phase: '2',
                isGoalValid: true,
                isVariationValid: true
            },
            {
                Goal: 'Goal3',
                Variation: 'variation3',
                Priority: 'medium',
                Phase: '3',
                isGoalValid: true,
                isVariationValid: true
            }
        ];
        component.clinicalGoals = clinicalGoals;
        component.onPriorityChange('low', clinicalGoal);
        expect(component.clinicalGoals[0].Priority).toBe('low');
    });

    it('should save the updated golas for target struture', async(() => {
        const clinicalGoals: ClinicalGoals[] = [
            {
                Goal: 'Goal1',
                Variation: 'variation1',
                Priority: 'high',
                Phase: '1',
                isGoalValid: false,
                isVariationValid: true
            },
            {
                Goal: 'Goal2',
                Variation: 'variation2',
                Priority: 'low',
                Phase: '2',
                isGoalValid: true,
                isVariationValid: true
            },
            {
                Goal: 'Goal3',
                Variation: 'variation3',
                Priority: 'medium',
                Phase: '3',
                isGoalValid: true,
                isVariationValid: true
            }
        ];

        spyOn(appService, 'AddEditTarget').and.returnValue(true);
        component.clinicalGoals = clinicalGoals;

        component.save(clinicalGoals, true);
        fixture.whenStable().then(() => {
            expect(component.displayDialog).toBe(false);


        });
    }));

    it('should save the updated golas for organ struture', async(() => {
        const clinicalGoals: ClinicalGoals[] = [
            {
                Goal: 'Goal1',
                Variation: 'variation1',
                Priority: 'high',
                Phase: '1',
                isGoalValid: false,
                isVariationValid: true
            },
            {
                Goal: 'Goal2',
                Variation: 'variation2',
                Priority: 'low',
                Phase: '2',
                isGoalValid: false,
                isVariationValid: true
            },
            {
                Goal: 'Goal3',
                Variation: 'variation3',
                Priority: 'medium',
                Phase: '3',
                isGoalValid: false,
                isVariationValid: true
            }
        ];

        spyOn(appService, 'AddEditOAR').and.returnValue(true);
        component.clinicalGoals = clinicalGoals;

        component.save(clinicalGoals, false);
        fixture.whenStable().then(() => {
            expect(component.displayDialog).toBe(false);
        });
    }));

    it('should update the goal phase', () => {
        const clinicalGoal: ClinicalGoals = {
            Goal: 'Goal1',
            Variation: 'variation1',
            Priority: 'high',
            Phase: '1',
            isGoalValid: false,
            isVariationValid: true
        };
        const clinicalGoals: ClinicalGoals[] = [
            {
                Goal: 'Goal1',
                Variation: 'variation1',
                Priority: 'high',
                Phase: '1',
                isGoalValid: false,
                isVariationValid: true
            },
            {
                Goal: 'Goal2',
                Variation: 'variation2',
                Priority: 'low',
                Phase: '2',
                isGoalValid: false,
                isVariationValid: true
            },
            {
                Goal: 'Goal3',
                Variation: 'variation3',
                Priority: 'medium',
                Phase: '3',
                isGoalValid: false,
                isVariationValid: true
            }
        ];
        component.clinicalGoals = clinicalGoals;
        component.onPhaseChange('4', clinicalGoal);
        expect(component.clinicalGoals[0].Phase).toBe('4');
    });

    it('should update the goal', () => {
        const rowData: ClinicalGoals = {
            Goal: 'Goal1',
            Variation: 'variation1',
            Priority: 'high',
            Phase: '1',
            isGoalValid: false,
            isVariationValid: true
        };
        spyOn(component, 'goalsValid').and.returnValue(true);
        component.updateGoal(rowData, 'Goal2');
        expect(component.goalsValid).toHaveBeenCalled();
    });

    it('should if goal or variation is not valid then disable the save button', () => {
        const rowData: ClinicalGoals = {
            Goal: '',
            Variation: '',
            Priority: 'high',
            Phase: '1',
            isGoalValid: false,
            isVariationValid: true
        };
        component.variations = '';
        spyOn(component, 'goalsValid').and.returnValue(true);
        component.updateGoal(rowData, '');
        expect(component.disableAddType).toBe(true);
    });

    it('should update the variation', () => {
        const rowData: ClinicalGoals = {
            Goal: 'Goal1',
            Variation: 'variation1',
            Priority: 'high',
            Phase: '1',
            isGoalValid: false,
            isVariationValid: true
        };
        spyOn(component, 'goalsValid').and.returnValue(true);
        component.updateVariation(rowData, 'variation2');
        expect(component.goalsValid).toHaveBeenCalled();
    });
    it('should update the variation and disable the save button', () => {
        const rowData: ClinicalGoals = {
            Goal: 'Goal1',
            Variation: 'variation1',
            Priority: 'high',
            Phase: '1',
            isGoalValid: false,
            isVariationValid: true
        };
        spyOn(component, 'goalsValid').and.returnValue(true);
        component.updateVariation(rowData, '');
        expect(component.disableAddType).toBe(true);
    });

    it('should if variation is not valid then disable the save button', () => {
        const rowData: ClinicalGoals = {
            Goal: 'Goal1',
            Variation: '',
            Priority: 'high',
            Phase: '1',
            isGoalValid: true,
            isVariationValid: true
        };
        component.variations = '';
        spyOn(component, 'goalsValid').and.returnValue(true);
        component.updateGoal(rowData, '');
        expect(component.disableAddType).toBe(true);
    });

    it('should open save as dialog', () => {
        component.showTemplateSaveAsDialog();
        expect(component.display).toBe(true);
    });

    it('should cancel the save template ', () => {
        component.cancelSaveTemplateName();
        expect(component.display).toBe(false);
    });

    it('should call the onSaveTemplateName function ', () => {
        spyOn(component, 'saveAsTemplate').and.returnValue(true);
        component.onSaveTemplateName();
        expect(component.saveAsTemplate).toHaveBeenCalled();
    });

    it('should redirect to plan directive page if user accepts', async(() => {

        const router = TestBed.get(Router);
        spyOn(confirmationService, 'confirm').and.callFake((params: any) => {
            params.accept();
        });
        spyOn(router, 'navigate').and.returnValue(true);
        appService.objPlanDirectiveDetails.structureSetId = 'RA Sept09 copy';
        appService.objPlanDirectiveDetails.patientId = 'Eclipse-03';
        component.GoToPlanDirective();

        fixture.whenStable().then(() => {
            expect(appService.objPlanDirectiveDetails.isBackButtonPressed).toBe(true);
            expect(router.navigate).toHaveBeenCalledWith(['/planning-directive-create',
                appService.objPlanDirectiveDetails.structureSetId,
                appService.objPlanDirectiveDetails.patientId]);
        });
    }));

    it('should redirect to order page if user accepts', async(() => {
        const router = TestBed.get(Router);
        spyOn(confirmationService, 'confirm').and.callFake((params: any) => {
            params.accept();
        });
        spyOn(router, 'navigate').and.returnValue(true);
        component.GoToOrders();
        fixture.whenStable().then(() => {
            expect(router.navigate).toHaveBeenCalledWith(['/Orders']);
        });
    }));

    it('should validate the clinical goals', () => {
        component.validateClinicalGoal(true);
        expect(component.disableAddType).toBe(true);
        component.validateClinicalGoal(false);
        expect(component.disableAddType).toBe(false);
    });

    it('should validate the variations', () => {
        spyOn(component, 'goalsValid').and.returnValue(true);
        component.variationValidation('variation');
        expect(component.variations).toBe('variation');
        expect(component.disableAddType).toBe(false);
        component.variationValidation('');
        expect(component.variations).toBe('');
        expect(component.disableAddType).toBe(true);
    });

    it('should validate the goals properly', () => {
        const clinicalGoals: ClinicalGoals[] = [
            {
                Goal: 'Goal1',
                Variation: 'variation1',
                Priority: 'high',
                Phase: '1',
                isGoalValid: true,
                isVariationValid: true
            },
            {
                Goal: 'Goal2',
                Variation: 'variation2',
                Priority: 'low',
                Phase: '2',
                isGoalValid: true,
                isVariationValid: true
            },
            {
                Goal: 'Goal3',
                Variation: 'variation3',
                Priority: 'medium',
                Phase: '3',
                isGoalValid: true,
                isVariationValid: true
            }
        ];

        component.clinicalGoals = clinicalGoals;
        component.Structure.Code = 'something';
        component.goalsValid();
        expect(component.disableAddType).toBe(false);
    });

    it('validation of goals should fail', () => {
        const clinicalGoals: ClinicalGoals[] = [
            {
                Goal: '',
                Variation: '',
                Priority: 'high',
                Phase: '1',
                isGoalValid: true,
                isVariationValid: true
            },
            {
                Goal: 'Goal2',
                Variation: '',
                Priority: 'low',
                Phase: '2',
                isGoalValid: true,
                isVariationValid: true
            },
            {
                Goal: 'Goal3',
                Variation: 'variation3',
                Priority: 'medium',
                Phase: '3',
                isGoalValid: false,
                isVariationValid: true
            }
        ];

        component.clinicalGoals = clinicalGoals;
        component.Structure.Code = 'something';
        component.goalsValid();
        expect(component.disableAddType).toBe(true);
    });

    it('validation of goals should fail', () => {
        const clinicalGoals: ClinicalGoals[] = [
            {
                Goal: '',
                Variation: '',
                Priority: 'high',
                Phase: '1',
                isGoalValid: true,
                isVariationValid: true
            },
            {
                Goal: 'Goal2',
                Variation: '',
                Priority: 'low',
                Phase: '2',
                isGoalValid: true,
                isVariationValid: true
            },
            {
                Goal: 'Goal3',
                Variation: 'variation3',
                Priority: 'medium',
                Phase: '3',
                isGoalValid: true,
                isVariationValid: true
            }
        ];

        component.clinicalGoals = clinicalGoals;
        component.Structure.Code = undefined;
        component.goalsValid();
        expect(component.disableAddType).toBe(true);
    });

    it('should change the template if user accepts', async(() => {

        const router = TestBed.get(Router);
        spyOn(component, 'getTemplateById').and.returnValue({
            PlanDirectiveTemplateID: 4,
            PlanDirectiveTemplateName: 'New Template',
            PlanDirectiveSiteID: 2,
            IsFavourite: true
        });

        spyOn(component, 'getTemplate').and.returnValue(true);
        spyOn(confirmationService, 'confirm').and.callFake((params: any) => {
            params.accept();
        });
        spyOn(router, 'navigate').and.returnValue(true);
        component.orderId = 'Order_1';
        component.templateChanged(4, 3);
        fixture.whenStable().then(() => {
            expect(router.navigate).toHaveBeenCalledWith(['/planning-directive-details',
                component.orderId, component.newTemplate.PlanDirectiveTemplateID, component.newTemplate.PlanDirectiveSiteID
            ]);
        });
    }));
    it('should not change the template if user reject', async(() => {

        const router = TestBed.get(Router);
        spyOn(component, 'getTemplateById').and.returnValue({
            PlanDirectiveTemplateID: 4,
            PlanDirectiveTemplateName: 'New Template',
            PlanDirectiveSiteID: 2,
            IsFavourite: true,
            PlanDirectiveRegionId: 2
        });
        const alltemplates: PlanDirectiveTemplate[] = [{
            PlanDirectiveTemplateID: 4,
            PlanDirectiveTemplateName: 'New Template',
            PlanDirectiveSiteID: 2,
            IsFavourite: true,
            PlanDirectiveRegionId: 1
        },
        {
            PlanDirectiveTemplateID: 3,
            PlanDirectiveTemplateName: 'New Template',
            PlanDirectiveSiteID: 2,
            IsFavourite: true,
            PlanDirectiveRegionId: 1
        },
        {
            PlanDirectiveTemplateID: 2,
            PlanDirectiveTemplateName: 'New Template',
            PlanDirectiveSiteID: 2,
            IsFavourite: true,
            PlanDirectiveRegionId: 1
        }];
        component.allTemplates = alltemplates;
        spyOn(component, 'getTemplate').and.returnValue(true);
        spyOn(confirmationService, 'confirm').and.callFake((params: any) => {
            params.reject();
        });
        spyOn(router, 'navigate').and.returnValue(true);
        component.orderId = 'Order_1';
        component.templateChanged(3, 4);
        fixture.whenStable().then(() => {
            expect(component.allTemplates.length).toBe(3);
            expect(router.navigate).toHaveBeenCalledWith(['/planning-directive-details',
                component.orderId, component.newTemplate.PlanDirectiveTemplateID, component.newTemplate.PlanDirectiveSiteID
            ]);
        });
    }));

    it('should return template by template Id', () => {

        const alltemplates: PlanDirectiveTemplate[] = [{
            PlanDirectiveTemplateID: 4,
            PlanDirectiveTemplateName: 'New Template',
            PlanDirectiveSiteID: 2,
            IsFavourite: true,
            PlanDirectiveRegionId: 1
        },
        {
            PlanDirectiveTemplateID: 3,
            PlanDirectiveTemplateName: 'New Template',
            PlanDirectiveSiteID: 2,
            IsFavourite: true,
            PlanDirectiveRegionId: 1
        },
        {
            PlanDirectiveTemplateID: 2,
            PlanDirectiveTemplateName: 'New Template',
            PlanDirectiveSiteID: 2,
            IsFavourite: true,
            PlanDirectiveRegionId: 1
        }];
        component.allTemplates = alltemplates;
        const template = component.getTemplateById(4);
        expect(template.PlanDirectiveTemplateID).toBe(4);

    });

    it('should arrange the template as per favourites on top', () => {

        const alltemplates: PlanDirectiveTemplate[] = [{
            PlanDirectiveTemplateID: 4,
            PlanDirectiveTemplateName: 'New Template1',
            PlanDirectiveSiteID: 2,
            IsFavourite: false,
            PlanDirectiveRegionId: 1
        },
        {
            PlanDirectiveTemplateID: 3,
            PlanDirectiveTemplateName: 'New Template2',
            PlanDirectiveSiteID: 2,
            IsFavourite: true,
            PlanDirectiveRegionId: 1
        },
        {
            PlanDirectiveTemplateID: 2,
            PlanDirectiveTemplateName: 'New Template3',
            PlanDirectiveSiteID: 2,
            IsFavourite: false,
            PlanDirectiveRegionId: 1
        }];
        const favroutietemplate: PlanDirectiveTemplate[] = [{
            PlanDirectiveTemplateID: 3,
            PlanDirectiveTemplateName: 'New Template2',
            PlanDirectiveSiteID: 2,
            IsFavourite: true,
            PlanDirectiveRegionId: 1
        }];
        component.allTemplates = alltemplates;
        component.favouriteTemplates = favroutietemplate;
        component.templateId = 3;
        component.arrangeTemplates(favroutietemplate);
        expect(component.allTemplates.length).toBe(3);

    });

});
