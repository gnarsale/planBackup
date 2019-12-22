import {
    PlanDirectivePhaseComponent
} from 'src/app/component/plan/plan-directive-details/plan-directive-phase/plan-directive-phase.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppService } from 'src/app/shared/helpers/app-service';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { HttpClientModule } from '@angular/common/http';
import { TotalPhaseComponent } from 'src/app/component/plan/plan-directive-details/total-phase/total-phase.component';
import { TreatmentInstruction } from 'src/app/shared/models/treatment-instruction.model';

describe('PlanDirectivePhaseComponent', () => {
    let component: PlanDirectivePhaseComponent;
    let fixture: ComponentFixture<PlanDirectivePhaseComponent>;
    let dataServiceService: DataServiceService;
    let appService: AppService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [PlanDirectivePhaseComponent, TotalPhaseComponent],
            providers: [AppService, DataServiceService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PlanDirectivePhaseComponent);
        dataServiceService = TestBed.get(DataServiceService);
        appService = TestBed.get(AppService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create PlanDirectivePhaseComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch this.styleConfigured value from json file', async(() => {
        const pMock = {
            subscribe: () => component.styleConfigured = 'varian'
        };
        spyOn(dataServiceService, 'getConfiguredStyle').and.returnValue(pMock);
        component.getConfiguredStyle();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.styleConfigured).toEqual('varian');
        });
    }));

    it('should fetch all the phases using getAllPhases() function', async(() => {
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
        // spyOn(appService, 'currentTreatmentInstruction').and.returnValue(Observable.of(treatmentInstruction));
        appService.changeTreatment(treatmentInstruction);
        // component.getAllPhases();

        fixture.whenStable().then(() => {
            expect(component.phases).toBeTruthy();
            expect(component.phases.length).toBe(2);

        });
    }));

});
