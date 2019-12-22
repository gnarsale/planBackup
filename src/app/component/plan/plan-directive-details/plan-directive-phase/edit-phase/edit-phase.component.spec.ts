import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { EditPhaseComponent } from './edit-phase.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastsManager, ToastOptions } from 'ng6-toastr';
import { AppService } from 'src/app/shared/helpers/app-service';
import { EditService } from './edit.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { TreatmentInstruction } from 'src/app/shared/models/treatment-instruction.model';
import { Observable, Subject } from 'rxjs';
import { PhaseCaption } from '../../../../../shared/models/phase-caption';

describe('EditPhaseComponent', () => {
  let component: EditPhaseComponent;
  let fixture: ComponentFixture<EditPhaseComponent>;
  let editService: EditService;
  let confirmationService: ConfirmationService;
  let appService: AppService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule, ReactiveFormsModule, DialogModule, TableModule],
      declarations: [EditPhaseComponent],
      providers: [AppService, EditService, ToastsManager, ToastOptions, ConfirmationService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPhaseComponent);
    component = fixture.componentInstance;
    editService = TestBed.get(EditService);
    confirmationService = TestBed.get(ConfirmationService);
    appService = TestBed.get(AppService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Get Phase and Calculate Phase', async(() => {
    const mok: TreatmentInstruction =
    {
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
                      ClinicalGoal: { DVHObjective: 'D5%[Gy]', Evaluator: '<=52', DoseLeft: 'D5%', DoseRight: '[Gy]' },
                      AcceptableVariation:
                        { DVHObjective: 'D5%[Gy]', Evaluator: '<=53', DoseLeft: 'D5%', DoseRight: '[Gy]' },
                      Priority: '1'
                    },
                    { StructureId: 'Target1', Phase: '1', ClinicalGoal: { DVHObjective: 'Max[%]', Evaluator: '<=105', DoseLeft: 'Max', DoseRight: '[%]' }, AcceptableVariation: { DVHObjective: 'Max[%]', Evaluator: '<=115', DoseLeft: 'Max', DoseRight: '[%]' }, Priority: '2' }]
                }
              }, { StructureId: 'Target2', FractionDoseGy: '2', FractionCount: '15', TotalDose: '30', Objectives: { Objective: [{ StructureId: 'Target1', Phase: '1', ClinicalGoal: { DVHObjective: 'V43%[cc]', Evaluator: '<=50', DoseLeft: 'V43%', DoseRight: '[cc]' }, AcceptableVariation: { DVHObjective: 'V43%[cc]', Evaluator: '<=45', DoseLeft: 'V43%', DoseRight: '[cc]' }, Priority: '1' }, { StructureId: 'Target1', Phase: '1', ClinicalGoal: { DVHObjective: 'Mean[cc]', Evaluator: '<=7', DoseLeft: 'Mean', DoseRight: '[cc]' }, AcceptableVariation: { DVHObjective: 'Mean[cc]', Evaluator: '<=10', DoseLeft: 'Mean', DoseRight: '[cc]' }, Priority: '2' }] } }]
            }
          },

          { Id: '2', PhaseId: '2', PrescriptionTargets: { PrescriptionTarget: [{ StructureId: 'Target1', FractionDoseGy: '8', FractionCount: '5', TotalDose: '40', Objectives: { Objective: [{ StructureId: 'Target1', Phase: '2', ClinicalGoal: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: 'D3cc', DoseRight: '[Gy]' }, AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: 'D3cc', DoseRight: '[Gy]' }, Priority: '1' }, { StructureId: 'Target1', Phase: '2', ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: 'Mean', DoseRight: '[Gy]' }, AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: 'Mean', DoseRight: '[Gy]' }, Priority: '2' }] } }, { StructureId: 'Target2', FractionDoseGy: '4', FractionCount: '5', TotalDose: '20', Objectives: { Objective: [{ StructureId: 'Target1', Phase: '2', ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: 'V43Gy', DoseRight: '[cc]' }, AcceptableVariation: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=52', DoseLeft: 'V43Gy', DoseRight: '[cc]' }, Priority: '1' }, { StructureId: 'Target1', Phase: '2', ClinicalGoal: { DVHObjective: 'V48Gy[%]', Evaluator: '<=30', DoseLeft: 'V48Gy', DoseRight: '[%]' }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: 'V48Gy', DoseRight: '[%]' }, Priority: '2' }] } }] } }]
      },
      Notes: {
        Note: [{ TimeStamp: '30 Jul 2018, 1:31 PM', UpdatedBy: 'RO', Comment: 'Comment Added by Remote Oncologist' },
        { TimeStamp: '30 Jul 2018, 1:31 PM', UpdatedBy: 'RO', Comment: 'Comment Added by Remote Oncologist' }]
      }
    };

    // const mo=mockTreatmentInstruction as TreatmentInstruction;
    spyOn(appService, 'currentTreatmentInstruction').and.returnValue(Observable.of(mok));
    spyOn(component, 'validateEditPhases').and.returnValue(true);
    appService.changeTreatment(mok);
    // component.getTreatmentInstruction();
    // appService(mok);

    fixture.whenStable().then(() => {
      console.log(component.treatmentInstruction);
      // expect(component.totalDose>1).toBeTruthy();
      // expect(component.treatmentInstruction> 1).toBeTruthy();
    });
  }));

  it('if there are no target structure', async(() => {
    const mok: TreatmentInstruction =
    {
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
        ]
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
                      ClinicalGoal: { DVHObjective: 'D5%[Gy]', Evaluator: '<=52', DoseLeft: 'D5%', DoseRight: '[Gy]' },
                      AcceptableVariation:
                        { DVHObjective: 'D5%[Gy]', Evaluator: '<=53', DoseLeft: 'D5%', DoseRight: '[Gy]' },
                      Priority: '1'
                    },
                    { StructureId: 'Target1', Phase: '1', ClinicalGoal: { DVHObjective: 'Max[%]', Evaluator: '<=105', DoseLeft: 'Max', DoseRight: '[%]' }, AcceptableVariation: { DVHObjective: 'Max[%]', Evaluator: '<=115', DoseLeft: 'Max', DoseRight: '[%]' }, Priority: '2' }]
                }
              }, { StructureId: 'Target2', FractionDoseGy: '2', FractionCount: '15', TotalDose: '30', Objectives: { Objective: [{ StructureId: 'Target1', Phase: '1', ClinicalGoal: { DVHObjective: 'V43%[cc]', Evaluator: '<=50', DoseLeft: 'V43%', DoseRight: '[cc]' }, AcceptableVariation: { DVHObjective: 'V43%[cc]', Evaluator: '<=45', DoseLeft: 'V43%', DoseRight: '[cc]' }, Priority: '1' }, { StructureId: 'Target1', Phase: '1', ClinicalGoal: { DVHObjective: 'Mean[cc]', Evaluator: '<=7', DoseLeft: 'Mean', DoseRight: '[cc]' }, AcceptableVariation: { DVHObjective: 'Mean[cc]', Evaluator: '<=10', DoseLeft: 'Mean', DoseRight: '[cc]' }, Priority: '2' }] } }]
            }
          },

          { Id: '2', PhaseId: '2', PrescriptionTargets: { PrescriptionTarget: [{ StructureId: 'Target1', FractionDoseGy: '8', FractionCount: '5', TotalDose: '40', Objectives: { Objective: [{ StructureId: 'Target1', Phase: '2', ClinicalGoal: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: 'D3cc', DoseRight: '[Gy]' }, AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: 'D3cc', DoseRight: '[Gy]' }, Priority: '1' }, { StructureId: 'Target1', Phase: '2', ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: 'Mean', DoseRight: '[Gy]' }, AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: 'Mean', DoseRight: '[Gy]' }, Priority: '2' }] } }, { StructureId: 'Target2', FractionDoseGy: '4', FractionCount: '5', TotalDose: '20', Objectives: { Objective: [{ StructureId: 'Target1', Phase: '2', ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: 'V43Gy', DoseRight: '[cc]' }, AcceptableVariation: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=52', DoseLeft: 'V43Gy', DoseRight: '[cc]' }, Priority: '1' }, { StructureId: 'Target1', Phase: '2', ClinicalGoal: { DVHObjective: 'V48Gy[%]', Evaluator: '<=30', DoseLeft: 'V48Gy', DoseRight: '[%]' }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: 'V48Gy', DoseRight: '[%]' }, Priority: '2' }] } }] } }]
      },
      Notes: {
        Note: [{ TimeStamp: '30 Jul 2018, 1:31 PM', UpdatedBy: 'RO', Comment: 'Comment Added by Remote Oncologist' },
        { TimeStamp: '30 Jul 2018, 1:31 PM', UpdatedBy: 'RO', Comment: 'Comment Added by Remote Oncologist' }]
      }
    };

    // const mo=mockTreatmentInstruction as TreatmentInstruction;
    spyOn(appService, 'currentTreatmentInstruction').and.returnValue(Observable.of(mok));
    spyOn(component, 'validateEditPhases').and.returnValue(true);
    appService.changeTreatment(mok);
    // component.getTreatmentInstruction();
    // appService(mok);

    fixture.whenStable().then(() => {
      console.log(component.treatmentInstruction);
      // expect(component.totalDose>1).toBeTruthy();
      // expect(component.treatmentInstruction> 1).toBeTruthy();
    });
  }));


  it('cancel phase editing if user accept it', () => {
    const phases: PhaseCaption[] = [
      {
        PhaseIndex: '1', FractionCount: 15,
        PrescriptionTargets: [
          {
            FractionDoseGy: '4', Dose: '60', StructureCode: 'PTV',
            Objectives: [
              {
                StructureId: null, Phase: null, ClinicalGoal:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' },
                AcceptableVariation:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=53', DoseLeft: '', DoseRight: '' }, Priority: '1'
              },
              {
                StructureId: null, Phase: null,
                ClinicalGoal: { DVHObjective: 'Max[%]', Evaluator: '<=105', DoseLeft: '', DoseRight: '' },
                AcceptableVariation: { DVHObjective: 'Max[%]', Evaluator: '<=115', DoseLeft: '', DoseRight: '' }, Priority: '2'
              }],
            StructureId: 'Target1'
          }, {
            FractionDoseGy: '2', Dose: '30', StructureCode: 'CTV',
            Objectives: [{
              StructureId: null, Phase: null, ClinicalGoal: {
                DVHObjective: 'V43%[cc]',
                Evaluator: '<=50', DoseLeft: '', DoseRight: ''
              }, AcceptableVariation: { DVHObjective: 'V43%[cc]', Evaluator: '<=45', DoseLeft: '', DoseRight: '' },
              Priority: '1'
            }, {
              StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[cc]', Evaluator: '<=7', DoseLeft: '', DoseRight: '' },
              AcceptableVariation: { DVHObjective: 'Mean[cc]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
            }], StructureId: 'Target2'
          }],
        targetCount: 2, PrescribedSessionsCount: '15'
      }, {
        PhaseIndex: '2', FractionCount: 5,
        PrescriptionTargets: [{
          FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
          Objectives: [{
            StructureId: null, Phase: null, ClinicalGoal:
              { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
          },
          {
            StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
          }], StructureId: 'Target1'
        },
        {
          FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
            StructureId: null, Phase: null,
            ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
              DVHObjective: 'V43Gy[cc]',
              Evaluator: '<=52', DoseLeft: '', DoseRight: ''
            }, Priority: '1'
          }, {
            StructureId: null, Phase: null, ClinicalGoal: {
              DVHObjective: 'V48Gy[%]',
              Evaluator: '<=30', DoseLeft: '', DoseRight: ''
            }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
            Priority: '2'
          }], StructureId: 'Target2'
        }], targetCount: 2, PrescribedSessionsCount: '5'
      }];
    component.phases = phases;
    component.phasesundo = JSON.stringify(phases);

    spyOn(confirmationService, 'confirm').and.callFake((params: any) => {
      params.accept();
    });
    spyOn(component, 'calculateTotalPhase').and.returnValue(true);
    component.cancelPhaseEditing();
    expect(component.showDialog).toBe(false);

  });
  it('cancel phase editing if user accept it', () => {
    const phases: PhaseCaption[] = [];
    component.phases = phases;
    component.phasesundo = JSON.stringify(phases);

    spyOn(confirmationService, 'confirm').and.callFake((params: any) => {
      params.accept();
    });
    spyOn(component, 'calculateTotalPhase').and.returnValue(true);
    component.cancelPhaseEditing();
    expect(component.showDialog).toBe(false);

  });
  it('Get number array to display the fraction phase session', () => {
    const phases: PhaseCaption[] = [
      {
        PhaseIndex: '1', FractionCount: 15,
        PrescriptionTargets: [
          {
            FractionDoseGy: '4', Dose: '60', StructureCode: 'PTV',
            Objectives: [
              {
                StructureId: null, Phase: null, ClinicalGoal:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' },
                AcceptableVariation:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=53', DoseLeft: '', DoseRight: '' }, Priority: '1'
              },
              {
                StructureId: null, Phase: null,
                ClinicalGoal: { DVHObjective: 'Max[%]', Evaluator: '<=105', DoseLeft: '', DoseRight: '' },
                AcceptableVariation: { DVHObjective: 'Max[%]', Evaluator: '<=115', DoseLeft: '', DoseRight: '' }, Priority: '2'
              }],
            StructureId: 'Target1'
          }, {
            FractionDoseGy: '2', Dose: '30', StructureCode: 'CTV',
            Objectives: [{
              StructureId: null, Phase: null, ClinicalGoal: {
                DVHObjective: 'V43%[cc]',
                Evaluator: '<=50', DoseLeft: '', DoseRight: ''
              }, AcceptableVariation: { DVHObjective: 'V43%[cc]', Evaluator: '<=45', DoseLeft: '', DoseRight: '' },
              Priority: '1'
            }, {
              StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[cc]', Evaluator: '<=7', DoseLeft: '', DoseRight: '' },
              AcceptableVariation: { DVHObjective: 'Mean[cc]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
            }], StructureId: 'Target2'
          }],
        targetCount: 2, PrescribedSessionsCount: '15'
      }, {
        PhaseIndex: '2', FractionCount: 5,
        PrescriptionTargets: [{
          FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
          Objectives: [{
            StructureId: null, Phase: null, ClinicalGoal:
              { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
          },
          {
            StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
          }], StructureId: 'Target1'
        },
        {
          FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
            StructureId: null, Phase: null,
            ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
              DVHObjective: 'V43Gy[cc]',
              Evaluator: '<=52', DoseLeft: '', DoseRight: ''
            }, Priority: '1'
          }, {
            StructureId: null, Phase: null, ClinicalGoal: {
              DVHObjective: 'V48Gy[%]',
              Evaluator: '<=30', DoseLeft: '', DoseRight: ''
            }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
            Priority: '2'
          }], StructureId: 'Target2'
        }], targetCount: 2, PrescribedSessionsCount: '5'
      }];
    component.phases = phases;
    const array = component.getNumberArray(1, 15);
    expect(array.length).toBe(15);

  });
  it('Add new phase', () => {
    const phases: PhaseCaption[] = [
      {
        PhaseIndex: '1', FractionCount: 15,
        PrescriptionTargets: [
          {
            FractionDoseGy: '4', Dose: '60', StructureCode: 'PTV',
            Objectives: [
              {
                StructureId: null, Phase: null, ClinicalGoal:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' },
                AcceptableVariation:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=53', DoseLeft: '', DoseRight: '' }, Priority: '1'
              },
              {
                StructureId: null, Phase: null,
                ClinicalGoal: { DVHObjective: 'Max[%]', Evaluator: '<=105', DoseLeft: '', DoseRight: '' },
                AcceptableVariation: { DVHObjective: 'Max[%]', Evaluator: '<=115', DoseLeft: '', DoseRight: '' }, Priority: '2'
              }],
            StructureId: 'Target1'
          }, {
            FractionDoseGy: '2', Dose: '30', StructureCode: 'CTV',
            Objectives: [{
              StructureId: null, Phase: null, ClinicalGoal: {
                DVHObjective: 'V43%[cc]',
                Evaluator: '<=50', DoseLeft: '', DoseRight: ''
              }, AcceptableVariation: { DVHObjective: 'V43%[cc]', Evaluator: '<=45', DoseLeft: '', DoseRight: '' },
              Priority: '1'
            }, {
              StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[cc]', Evaluator: '<=7', DoseLeft: '', DoseRight: '' },
              AcceptableVariation: { DVHObjective: 'Mean[cc]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
            }], StructureId: 'Target2'
          }],
        targetCount: 2, PrescribedSessionsCount: '15'
      }, {
        PhaseIndex: '2', FractionCount: 5,
        PrescriptionTargets: [{
          FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
          Objectives: [{
            StructureId: null, Phase: null, ClinicalGoal:
              { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
          },
          {
            StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
          }], StructureId: 'Target1'
        },
        {
          FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
            StructureId: null, Phase: null,
            ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
              DVHObjective: 'V43Gy[cc]',
              Evaluator: '<=52', DoseLeft: '', DoseRight: ''
            }, Priority: '1'
          }, {
            StructureId: null, Phase: null, ClinicalGoal: {
              DVHObjective: 'V48Gy[%]',
              Evaluator: '<=30', DoseLeft: '', DoseRight: ''
            }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
            Priority: '2'
          }], StructureId: 'Target2'
        }], targetCount: 2, PrescribedSessionsCount: '5'
      }];
    component.phases = phases;
    component.targetlength = 2;
    const totalphase = {
      targets: [
        { targetName: 'PTV', targetValue: '100', targetId: 'Target1' },
        { targetName: 'CTV', targetValue: '50', targetId: 'Target2' }], totaldose: '150', fractioncount: '20'
    };
    component.totalphase = totalphase;
    spyOn(component, 'validateEditPhases').and.returnValue(true);
    spyOn(component, 'calculateTotalPhase').and.returnValue(true);
    component.addNewPhase();
    expect(component.phases.length).toBe(3);

  });

  it('Save the edited phases', () => {
    spyOn(appService, 'savePhases').and.returnValue(true);
    component.savingPhaseEdit();
    expect(component.showDialog).toBe(false);
  });

  it('delete the phase', () => {
    const phases: PhaseCaption[] = [
      {
        PhaseIndex: '1', FractionCount: 15,
        PrescriptionTargets: [
          {
            FractionDoseGy: '4', Dose: '60', StructureCode: 'PTV',
            Objectives: [
              {
                StructureId: null, Phase: null, ClinicalGoal:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' },
                AcceptableVariation:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=53', DoseLeft: '', DoseRight: '' }, Priority: '1'
              },
              {
                StructureId: null, Phase: null,
                ClinicalGoal: { DVHObjective: 'Max[%]', Evaluator: '<=105', DoseLeft: '', DoseRight: '' },
                AcceptableVariation: { DVHObjective: 'Max[%]', Evaluator: '<=115', DoseLeft: '', DoseRight: '' }, Priority: '2'
              }],
            StructureId: 'Target1'
          }, {
            FractionDoseGy: '2', Dose: '30', StructureCode: 'CTV',
            Objectives: [{
              StructureId: null, Phase: null, ClinicalGoal: {
                DVHObjective: 'V43%[cc]',
                Evaluator: '<=50', DoseLeft: '', DoseRight: ''
              }, AcceptableVariation: { DVHObjective: 'V43%[cc]', Evaluator: '<=45', DoseLeft: '', DoseRight: '' },
              Priority: '1'
            }, {
              StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[cc]', Evaluator: '<=7', DoseLeft: '', DoseRight: '' },
              AcceptableVariation: { DVHObjective: 'Mean[cc]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
            }], StructureId: 'Target2'
          }],
        targetCount: 2, PrescribedSessionsCount: '15'
      }, {
        PhaseIndex: '2', FractionCount: 5,
        PrescriptionTargets: [{
          FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
          Objectives: [{
            StructureId: null, Phase: null, ClinicalGoal:
              { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
          },
          {
            StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
          }], StructureId: 'Target1'
        },
        {
          FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
            StructureId: null, Phase: null,
            ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
              DVHObjective: 'V43Gy[cc]',
              Evaluator: '<=52', DoseLeft: '', DoseRight: ''
            }, Priority: '1'
          }, {
            StructureId: null, Phase: null, ClinicalGoal: {
              DVHObjective: 'V48Gy[%]',
              Evaluator: '<=30', DoseLeft: '', DoseRight: ''
            }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
            Priority: '2'
          }], StructureId: 'Target2'
        }], targetCount: 2, PrescribedSessionsCount: '5'
      }, {
        PhaseIndex: '3', FractionCount: 5,
        PrescriptionTargets: [{
          FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
          Objectives: [{
            StructureId: null, Phase: null, ClinicalGoal:
              { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
          },
          {
            StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
          }], StructureId: 'Target1'
        },
        {
          FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
            StructureId: null, Phase: null,
            ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
              DVHObjective: 'V43Gy[cc]',
              Evaluator: '<=52', DoseLeft: '', DoseRight: ''
            }, Priority: '1'
          }, {
            StructureId: null, Phase: null, ClinicalGoal: {
              DVHObjective: 'V48Gy[%]',
              Evaluator: '<=30', DoseLeft: '', DoseRight: ''
            }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
            Priority: '2'
          }], StructureId: 'Target2'
        }], targetCount: 2, PrescribedSessionsCount: '5'
      }];
    const phasec: PhaseCaption = {
      PhaseIndex: '3', FractionCount: 5,
      PrescriptionTargets: [{
        FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
        Objectives: [{
          StructureId: null, Phase: null, ClinicalGoal:
            { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
          AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
        },
        {
          StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
          AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
        }], StructureId: 'Target1'
      },
      {
        FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
          StructureId: null, Phase: null,
          ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
            DVHObjective: 'V43Gy[cc]',
            Evaluator: '<=52', DoseLeft: '', DoseRight: ''
          }, Priority: '1'
        }, {
          StructureId: null, Phase: null, ClinicalGoal: {
            DVHObjective: 'V48Gy[%]',
            Evaluator: '<=30', DoseLeft: '', DoseRight: ''
          }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
          Priority: '2'
        }], StructureId: 'Target2'
      }], targetCount: 2, PrescribedSessionsCount: '5'
    };
    component.phases = phases;
    component.targetlength = 2;
    const dosevalidate = [
      {
        isFractionInValid: false, phaseIndex: '1', prescriptionTargets:
          [{ structureCode: 'PTV', isError: false }, { structureCode: 'CTV', 'isError': false }]
      },
      {
        isFractionInValid: false, phaseIndex: '2', prescriptionTargets: [
          { structureCode: 'PTV', 'isError': false }, { structureCode: 'CTV', isError: false }]
      }, {
        isFractionInValid: false, phaseIndex: '3', prescriptionTargets: [
          { structureCode: 'PTV', 'isError': false }, { structureCode: 'CTV', isError: false }]
      }];
    component.doseValidate = dosevalidate;
    spyOn(component, 'validateEditPhases').and.returnValue(true);
    spyOn(component, 'calculateTotalPhase').and.returnValue(true);
    spyOn(confirmationService, 'confirm').and.callFake((params: any) => {
      params.accept();
    });
    component.onPhaseDelete(phasec);
    expect(component.phases.length).toBe(2);

  });

  it('fraction change for phase without error', () => {
    const phases: PhaseCaption[] = [
      {
        PhaseIndex: '1', FractionCount: 15,
        PrescriptionTargets: [
          {
            FractionDoseGy: '4', Dose: '60', StructureCode: 'PTV',
            Objectives: [
              {
                StructureId: null, Phase: null, ClinicalGoal:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' },
                AcceptableVariation:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=53', DoseLeft: '', DoseRight: '' }, Priority: '1'
              },
              {
                StructureId: null, Phase: null,
                ClinicalGoal: { DVHObjective: 'Max[%]', Evaluator: '<=105', DoseLeft: '', DoseRight: '' },
                AcceptableVariation: { DVHObjective: 'Max[%]', Evaluator: '<=115', DoseLeft: '', DoseRight: '' }, Priority: '2'
              }],
            StructureId: 'Target1'
          }, {
            FractionDoseGy: '2', Dose: '30', StructureCode: 'CTV',
            Objectives: [{
              StructureId: null, Phase: null, ClinicalGoal: {
                DVHObjective: 'V43%[cc]',
                Evaluator: '<=50', DoseLeft: '', DoseRight: ''
              }, AcceptableVariation: { DVHObjective: 'V43%[cc]', Evaluator: '<=45', DoseLeft: '', DoseRight: '' },
              Priority: '1'
            }, {
              StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[cc]', Evaluator: '<=7', DoseLeft: '', DoseRight: '' },
              AcceptableVariation: { DVHObjective: 'Mean[cc]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
            }], StructureId: 'Target2'
          }],
        targetCount: 2, PrescribedSessionsCount: '15'
      }, {
        PhaseIndex: '2', FractionCount: 5,
        PrescriptionTargets: [{
          FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
          Objectives: [{
            StructureId: null, Phase: null, ClinicalGoal:
              { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
          },
          {
            StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
          }], StructureId: 'Target1'
        },
        {
          FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
            StructureId: null, Phase: null,
            ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
              DVHObjective: 'V43Gy[cc]',
              Evaluator: '<=52', DoseLeft: '', DoseRight: ''
            }, Priority: '1'
          }, {
            StructureId: null, Phase: null, ClinicalGoal: {
              DVHObjective: 'V48Gy[%]',
              Evaluator: '<=30', DoseLeft: '', DoseRight: ''
            }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
            Priority: '2'
          }], StructureId: 'Target2'
        }], targetCount: 2, PrescribedSessionsCount: '5'
      }, {
        PhaseIndex: '3', FractionCount: 5,
        PrescriptionTargets: [{
          FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
          Objectives: [{
            StructureId: null, Phase: null, ClinicalGoal:
              { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
          },
          {
            StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
          }], StructureId: 'Target1'
        },
        {
          FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
            StructureId: null, Phase: null,
            ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
              DVHObjective: 'V43Gy[cc]',
              Evaluator: '<=52', DoseLeft: '', DoseRight: ''
            }, Priority: '1'
          }, {
            StructureId: null, Phase: null, ClinicalGoal: {
              DVHObjective: 'V48Gy[%]',
              Evaluator: '<=30', DoseLeft: '', DoseRight: ''
            }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
            Priority: '2'
          }], StructureId: 'Target2'
        }], targetCount: 2, PrescribedSessionsCount: '5'
      }];
    const phasec: PhaseCaption = {
      PhaseIndex: '3', FractionCount: 5,
      PrescriptionTargets: [{
        FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
        Objectives: [{
          StructureId: null, Phase: null, ClinicalGoal:
            { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
          AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
        },
        {
          StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
          AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
        }], StructureId: 'Target1'
      },
      {
        FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
          StructureId: null, Phase: null,
          ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
            DVHObjective: 'V43Gy[cc]',
            Evaluator: '<=52', DoseLeft: '', DoseRight: ''
          }, Priority: '1'
        }, {
          StructureId: null, Phase: null, ClinicalGoal: {
            DVHObjective: 'V48Gy[%]',
            Evaluator: '<=30', DoseLeft: '', DoseRight: ''
          }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
          Priority: '2'
        }], StructureId: 'Target2'
      }], targetCount: 2, PrescribedSessionsCount: '5'
    };
    component.phases = phases;
    component.targetlength = 2;
    component.fractionSubject = new Subject<any>();
    spyOn(component.fractionSubject, 'next').and.returnValue(true);
    const dosevalidate = [
      {
        isFractionInValid: false, phaseIndex: '1', prescriptionTargets:
          [{ structureCode: 'PTV', isError: false }, { structureCode: 'CTV', 'isError': false }]
      },
      {
        isFractionInValid: false, phaseIndex: '2', prescriptionTargets: [
          { structureCode: 'PTV', 'isError': false }, { structureCode: 'CTV', isError: false }]
      }, {
        isFractionInValid: false, phaseIndex: '3', prescriptionTargets: [
          { structureCode: 'PTV', 'isError': false }, { structureCode: 'CTV', isError: false }]
      }];
    component.doseValidate = dosevalidate;
    spyOn(component, 'validateEditPhases').and.returnValue(true);
    component.phaseFractionCountChange(phasec, 20);
    expect(component.fractionSubject.next).toHaveBeenCalled();

  });


  it('fraction change for phase with error', () => {
    const phases: PhaseCaption[] = [
      {
        PhaseIndex: '1', FractionCount: 15,
        PrescriptionTargets: [
          {
            FractionDoseGy: '4', Dose: '60', StructureCode: 'PTV',
            Objectives: [
              {
                StructureId: null, Phase: null, ClinicalGoal:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' },
                AcceptableVariation:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=53', DoseLeft: '', DoseRight: '' }, Priority: '1'
              },
              {
                StructureId: null, Phase: null,
                ClinicalGoal: { DVHObjective: 'Max[%]', Evaluator: '<=105', DoseLeft: '', DoseRight: '' },
                AcceptableVariation: { DVHObjective: 'Max[%]', Evaluator: '<=115', DoseLeft: '', DoseRight: '' }, Priority: '2'
              }],
            StructureId: 'Target1'
          }, {
            FractionDoseGy: '2', Dose: '30', StructureCode: 'CTV',
            Objectives: [{
              StructureId: null, Phase: null, ClinicalGoal: {
                DVHObjective: 'V43%[cc]',
                Evaluator: '<=50', DoseLeft: '', DoseRight: ''
              }, AcceptableVariation: { DVHObjective: 'V43%[cc]', Evaluator: '<=45', DoseLeft: '', DoseRight: '' },
              Priority: '1'
            }, {
              StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[cc]', Evaluator: '<=7', DoseLeft: '', DoseRight: '' },
              AcceptableVariation: { DVHObjective: 'Mean[cc]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
            }], StructureId: 'Target2'
          }],
        targetCount: 2, PrescribedSessionsCount: '15'
      }, {
        PhaseIndex: '2', FractionCount: 5,
        PrescriptionTargets: [{
          FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
          Objectives: [{
            StructureId: null, Phase: null, ClinicalGoal:
              { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
          },
          {
            StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
          }], StructureId: 'Target1'
        },
        {
          FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
            StructureId: null, Phase: null,
            ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
              DVHObjective: 'V43Gy[cc]',
              Evaluator: '<=52', DoseLeft: '', DoseRight: ''
            }, Priority: '1'
          }, {
            StructureId: null, Phase: null, ClinicalGoal: {
              DVHObjective: 'V48Gy[%]',
              Evaluator: '<=30', DoseLeft: '', DoseRight: ''
            }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
            Priority: '2'
          }], StructureId: 'Target2'
        }], targetCount: 2, PrescribedSessionsCount: '5'
      }, {
        PhaseIndex: '3', FractionCount: 5,
        PrescriptionTargets: [{
          FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
          Objectives: [{
            StructureId: null, Phase: null, ClinicalGoal:
              { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
          },
          {
            StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
          }], StructureId: 'Target1'
        },
        {
          FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
            StructureId: null, Phase: null,
            ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
              DVHObjective: 'V43Gy[cc]',
              Evaluator: '<=52', DoseLeft: '', DoseRight: ''
            }, Priority: '1'
          }, {
            StructureId: null, Phase: null, ClinicalGoal: {
              DVHObjective: 'V48Gy[%]',
              Evaluator: '<=30', DoseLeft: '', DoseRight: ''
            }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
            Priority: '2'
          }], StructureId: 'Target2'
        }], targetCount: 2, PrescribedSessionsCount: '5'
      }];
    const phasec: PhaseCaption = {
      PhaseIndex: '3', FractionCount: 5,
      PrescriptionTargets: [{
        FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
        Objectives: [{
          StructureId: null, Phase: null, ClinicalGoal:
            { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
          AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
        },
        {
          StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
          AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
        }], StructureId: 'Target1'
      },
      {
        FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
          StructureId: null, Phase: null,
          ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
            DVHObjective: 'V43Gy[cc]',
            Evaluator: '<=52', DoseLeft: '', DoseRight: ''
          }, Priority: '1'
        }, {
          StructureId: null, Phase: null, ClinicalGoal: {
            DVHObjective: 'V48Gy[%]',
            Evaluator: '<=30', DoseLeft: '', DoseRight: ''
          }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
          Priority: '2'
        }], StructureId: 'Target2'
      }], targetCount: 2, PrescribedSessionsCount: '5'
    };
    component.phases = phases;
    component.targetlength = 2;
    component.fractionSubject = new Subject<any>();
    spyOn(component.fractionSubject, 'next').and.returnValue(true);
    const dosevalidate = [
      {
        isFractionInValid: false, phaseIndex: '1', prescriptionTargets:
          [{ structureCode: 'PTV', isError: false }, { structureCode: 'CTV', 'isError': false }]
      },
      {
        isFractionInValid: false, phaseIndex: '2', prescriptionTargets: [
          { structureCode: 'PTV', 'isError': false }, { structureCode: 'CTV', isError: false }]
      }, {
        isFractionInValid: true, phaseIndex: '3', prescriptionTargets: [
          { structureCode: 'PTV', 'isError': true }, { structureCode: 'CTV', isError: true }]
      }];
    component.doseValidate = dosevalidate;
    spyOn(component, 'validateEditPhases').and.returnValue(true);
    component.phaseFractionCountChange(phasec, 20);
    expect(component.fractionSubject.next).toHaveBeenCalled();

  });

  it('dose change for phase without error', () => {
    const phases: PhaseCaption[] = [
      {
        PhaseIndex: '1', FractionCount: 15,
        PrescriptionTargets: [
          {
            FractionDoseGy: '4', Dose: '60', StructureCode: 'PTV',
            Objectives: [
              {
                StructureId: null, Phase: null, ClinicalGoal:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' },
                AcceptableVariation:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=53', DoseLeft: '', DoseRight: '' }, Priority: '1'
              },
              {
                StructureId: null, Phase: null,
                ClinicalGoal: { DVHObjective: 'Max[%]', Evaluator: '<=105', DoseLeft: '', DoseRight: '' },
                AcceptableVariation: { DVHObjective: 'Max[%]', Evaluator: '<=115', DoseLeft: '', DoseRight: '' }, Priority: '2'
              }],
            StructureId: 'Target1'
          }, {
            FractionDoseGy: '2', Dose: '30', StructureCode: 'CTV',
            Objectives: [{
              StructureId: null, Phase: null, ClinicalGoal: {
                DVHObjective: 'V43%[cc]',
                Evaluator: '<=50', DoseLeft: '', DoseRight: ''
              }, AcceptableVariation: { DVHObjective: 'V43%[cc]', Evaluator: '<=45', DoseLeft: '', DoseRight: '' },
              Priority: '1'
            }, {
              StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[cc]', Evaluator: '<=7', DoseLeft: '', DoseRight: '' },
              AcceptableVariation: { DVHObjective: 'Mean[cc]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
            }], StructureId: 'Target2'
          }],
        targetCount: 2, PrescribedSessionsCount: '15'
      }, {
        PhaseIndex: '2', FractionCount: 5,
        PrescriptionTargets: [{
          FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
          Objectives: [{
            StructureId: null, Phase: null, ClinicalGoal:
              { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
          },
          {
            StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
          }], StructureId: 'Target1'
        },
        {
          FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
            StructureId: null, Phase: null,
            ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
              DVHObjective: 'V43Gy[cc]',
              Evaluator: '<=52', DoseLeft: '', DoseRight: ''
            }, Priority: '1'
          }, {
            StructureId: null, Phase: null, ClinicalGoal: {
              DVHObjective: 'V48Gy[%]',
              Evaluator: '<=30', DoseLeft: '', DoseRight: ''
            }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
            Priority: '2'
          }], StructureId: 'Target2'
        }], targetCount: 2, PrescribedSessionsCount: '5'
      }, {
        PhaseIndex: '3', FractionCount: 5,
        PrescriptionTargets: [{
          FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
          Objectives: [{
            StructureId: null, Phase: null, ClinicalGoal:
              { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
          },
          {
            StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
          }], StructureId: 'Target1'
        },
        {
          FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
            StructureId: null, Phase: null,
            ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
              DVHObjective: 'V43Gy[cc]',
              Evaluator: '<=52', DoseLeft: '', DoseRight: ''
            }, Priority: '1'
          }, {
            StructureId: null, Phase: null, ClinicalGoal: {
              DVHObjective: 'V48Gy[%]',
              Evaluator: '<=30', DoseLeft: '', DoseRight: ''
            }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
            Priority: '2'
          }], StructureId: 'Target2'
        }], targetCount: 2, PrescribedSessionsCount: '5'
      }];
    const phasec: PhaseCaption = {
      PhaseIndex: '3', FractionCount: 5,
      PrescriptionTargets: [{
        FractionDoseGy: '10', Dose: '50', StructureCode: 'PTV',
        Objectives: [{
          StructureId: null, Phase: null, ClinicalGoal:
            { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
          AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
        },
        {
          StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
          AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
        }], StructureId: 'Target1'
      },
      {
        FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
          StructureId: null, Phase: null,
          ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
            DVHObjective: 'V43Gy[cc]',
            Evaluator: '<=52', DoseLeft: '', DoseRight: ''
          }, Priority: '1'
        }, {
          StructureId: null, Phase: null, ClinicalGoal: {
            DVHObjective: 'V48Gy[%]',
            Evaluator: '<=30', DoseLeft: '', DoseRight: ''
          }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
          Priority: '2'
        }], StructureId: 'Target2'
      }], targetCount: 2, PrescribedSessionsCount: '5'
    };
    component.phases = phases;

    const dosevalidate = [
      {
        isFractionInValid: false, phaseIndex: '1', prescriptionTargets:
          [{ structureCode: 'PTV', isError: false }, { structureCode: 'CTV', 'isError': false }]
      },
      {
        isFractionInValid: false, phaseIndex: '2', prescriptionTargets: [
          { structureCode: 'PTV', 'isError': false }, { structureCode: 'CTV', isError: false }]
      }, {
        isFractionInValid: false, phaseIndex: '3', prescriptionTargets: [
          { structureCode: 'PTV', 'isError': false }, { structureCode: 'CTV', isError: false }]
      }];
    component.doseValidate = dosevalidate;
    spyOn(component, 'validateEditPhases').and.returnValue(true);
    spyOn(component, 'calculateTotalPhase').and.returnValue(true);
    component.phaseFractionDoseChange(phasec, 2, 'Target1');
    expect(component.phases[2].PrescriptionTargets[0].FractionDoseGy).toBe('10');
  });


  it('dose change for phase with error', () => {
    const phases: PhaseCaption[] = [
      {
        PhaseIndex: '1', FractionCount: 15,
        PrescriptionTargets: [
          {
            FractionDoseGy: '4', Dose: '60', StructureCode: 'PTV',
            Objectives: [
              {
                StructureId: null, Phase: null, ClinicalGoal:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' },
                AcceptableVariation:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=53', DoseLeft: '', DoseRight: '' }, Priority: '1'
              },
              {
                StructureId: null, Phase: null,
                ClinicalGoal: { DVHObjective: 'Max[%]', Evaluator: '<=105', DoseLeft: '', DoseRight: '' },
                AcceptableVariation: { DVHObjective: 'Max[%]', Evaluator: '<=115', DoseLeft: '', DoseRight: '' }, Priority: '2'
              }],
            StructureId: 'Target1'
          }, {
            FractionDoseGy: '2', Dose: '30', StructureCode: 'CTV',
            Objectives: [{
              StructureId: null, Phase: null, ClinicalGoal: {
                DVHObjective: 'V43%[cc]',
                Evaluator: '<=50', DoseLeft: '', DoseRight: ''
              }, AcceptableVariation: { DVHObjective: 'V43%[cc]', Evaluator: '<=45', DoseLeft: '', DoseRight: '' },
              Priority: '1'
            }, {
              StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[cc]', Evaluator: '<=7', DoseLeft: '', DoseRight: '' },
              AcceptableVariation: { DVHObjective: 'Mean[cc]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
            }], StructureId: 'Target2'
          }],
        targetCount: 2, PrescribedSessionsCount: '15'
      }, {
        PhaseIndex: '2', FractionCount: 5,
        PrescriptionTargets: [{
          FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
          Objectives: [{
            StructureId: null, Phase: null, ClinicalGoal:
              { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
          },
          {
            StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
          }], StructureId: 'Target1'
        },
        {
          FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
            StructureId: null, Phase: null,
            ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
              DVHObjective: 'V43Gy[cc]',
              Evaluator: '<=52', DoseLeft: '', DoseRight: ''
            }, Priority: '1'
          }, {
            StructureId: null, Phase: null, ClinicalGoal: {
              DVHObjective: 'V48Gy[%]',
              Evaluator: '<=30', DoseLeft: '', DoseRight: ''
            }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
            Priority: '2'
          }], StructureId: 'Target2'
        }], targetCount: 2, PrescribedSessionsCount: '5'
      }, {
        PhaseIndex: '3', FractionCount: 5,
        PrescriptionTargets: [{
          FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
          Objectives: [{
            StructureId: null, Phase: null, ClinicalGoal:
              { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
          },
          {
            StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
          }], StructureId: 'Target1'
        },
        {
          FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
            StructureId: null, Phase: null,
            ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
              DVHObjective: 'V43Gy[cc]',
              Evaluator: '<=52', DoseLeft: '', DoseRight: ''
            }, Priority: '1'
          }, {
            StructureId: null, Phase: null, ClinicalGoal: {
              DVHObjective: 'V48Gy[%]',
              Evaluator: '<=30', DoseLeft: '', DoseRight: ''
            }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
            Priority: '2'
          }], StructureId: 'Target2'
        }], targetCount: 2, PrescribedSessionsCount: '5'
      }];
    const phasec: PhaseCaption = {
      PhaseIndex: '3', FractionCount: 5,
      PrescriptionTargets: [{
        FractionDoseGy: '40', Dose: '200', StructureCode: 'PTV',
        Objectives: [{
          StructureId: null, Phase: null, ClinicalGoal:
            { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
          AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
        },
        {
          StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
          AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
        }], StructureId: 'Target1'
      },
      {
        FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
          StructureId: null, Phase: null,
          ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
            DVHObjective: 'V43Gy[cc]',
            Evaluator: '<=52', DoseLeft: '', DoseRight: ''
          }, Priority: '1'
        }, {
          StructureId: null, Phase: null, ClinicalGoal: {
            DVHObjective: 'V48Gy[%]',
            Evaluator: '<=30', DoseLeft: '', DoseRight: ''
          }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
          Priority: '2'
        }], StructureId: 'Target2'
      }], targetCount: 2, PrescribedSessionsCount: '5'
    };
    component.phases = phases;

    const dosevalidate = [
      {
        isFractionInValid: false, phaseIndex: '1', prescriptionTargets:
          [{ structureCode: 'PTV', isError: false }, { structureCode: 'CTV', 'isError': false }]
      },
      {
        isFractionInValid: false, phaseIndex: '2', prescriptionTargets: [
          { structureCode: 'PTV', 'isError': false }, { structureCode: 'CTV', isError: false }]
      }, {
        isFractionInValid: false, phaseIndex: '3', prescriptionTargets: [
          { structureCode: 'PTV', 'isError': true }, { structureCode: 'CTV', isError: false }]
      }];
    component.doseValidate = dosevalidate;
    spyOn(component, 'validateEditPhases').and.returnValue(true);
    spyOn(component, 'calculateTotalPhase').and.returnValue(true);
    component.phaseFractionDoseChange(phasec, 2, 'Target1');
    expect(component.doseError).toBe(true);
  });


  it('validate Edit Phases', () => {
    const phases: PhaseCaption[] = [
      {
        PhaseIndex: '1', FractionCount: 51,
        PrescriptionTargets: [
          {
            FractionDoseGy: '0', Dose: '0', StructureCode: 'PTV',
            Objectives: [
              {
                StructureId: null, Phase: null, ClinicalGoal:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' },
                AcceptableVariation:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=53', DoseLeft: '', DoseRight: '' }, Priority: '1'
              },
              {
                StructureId: null, Phase: null,
                ClinicalGoal: { DVHObjective: 'Max[%]', Evaluator: '<=105', DoseLeft: '', DoseRight: '' },
                AcceptableVariation: { DVHObjective: 'Max[%]', Evaluator: '<=115', DoseLeft: '', DoseRight: '' }, Priority: '2'
              }],
            StructureId: 'Target1'
          }, {
            FractionDoseGy: '2', Dose: '30', StructureCode: 'CTV',
            Objectives: [{
              StructureId: null, Phase: null, ClinicalGoal: {
                DVHObjective: 'V43%[cc]',
                Evaluator: '<=50', DoseLeft: '', DoseRight: ''
              }, AcceptableVariation: { DVHObjective: 'V43%[cc]', Evaluator: '<=45', DoseLeft: '', DoseRight: '' },
              Priority: '1'
            }, {
              StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[cc]', Evaluator: '<=7', DoseLeft: '', DoseRight: '' },
              AcceptableVariation: { DVHObjective: 'Mean[cc]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
            }], StructureId: 'Target2'
          }],
        targetCount: 2, PrescribedSessionsCount: '15'
      }, {
        PhaseIndex: '2', FractionCount: 5,
        PrescriptionTargets: [{
          FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
          Objectives: [{
            StructureId: null, Phase: null, ClinicalGoal:
              { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
          },
          {
            StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
          }], StructureId: 'Target1'
        },
        {
          FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
            StructureId: null, Phase: null,
            ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
              DVHObjective: 'V43Gy[cc]',
              Evaluator: '<=52', DoseLeft: '', DoseRight: ''
            }, Priority: '1'
          }, {
            StructureId: null, Phase: null, ClinicalGoal: {
              DVHObjective: 'V48Gy[%]',
              Evaluator: '<=30', DoseLeft: '', DoseRight: ''
            }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
            Priority: '2'
          }], StructureId: 'Target2'
        }], targetCount: 2, PrescribedSessionsCount: '5'
      }, {
        PhaseIndex: '3', FractionCount: 5,
        PrescriptionTargets: [{
          FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
          Objectives: [{
            StructureId: null, Phase: null, ClinicalGoal:
              { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
          },
          {
            StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
          }], StructureId: 'Target1'
        },
        {
          FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
            StructureId: null, Phase: null,
            ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
              DVHObjective: 'V43Gy[cc]',
              Evaluator: '<=52', DoseLeft: '', DoseRight: ''
            }, Priority: '1'
          }, {
            StructureId: null, Phase: null, ClinicalGoal: {
              DVHObjective: 'V48Gy[%]',
              Evaluator: '<=30', DoseLeft: '', DoseRight: ''
            }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
            Priority: '2'
          }], StructureId: 'Target2'
        }], targetCount: 2, PrescribedSessionsCount: '5'
      }];
    component.phases = phases;
    component.validateEditPhases();
    expect(component.disableEditSave).toBe(true);
  });

  it('calculate total phase', () => {
    const phases: PhaseCaption[] = [
      {
        PhaseIndex: '1', FractionCount: 15,
        PrescriptionTargets: [
          {
            FractionDoseGy: '4', Dose: '60', StructureCode: 'PTV',
            Objectives: [
              {
                StructureId: null, Phase: null, ClinicalGoal:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' },
                AcceptableVariation:
                  { DVHObjective: 'D5%[Gy]', Evaluator: '<=53', DoseLeft: '', DoseRight: '' }, Priority: '1'
              },
              {
                StructureId: null, Phase: null,
                ClinicalGoal: { DVHObjective: 'Max[%]', Evaluator: '<=105', DoseLeft: '', DoseRight: '' },
                AcceptableVariation: { DVHObjective: 'Max[%]', Evaluator: '<=115', DoseLeft: '', DoseRight: '' }, Priority: '2'
              }],
            StructureId: 'Target1'
          }, {
            FractionDoseGy: '2', Dose: '30', StructureCode: 'CTV',
            Objectives: [{
              StructureId: null, Phase: null, ClinicalGoal: {
                DVHObjective: 'V43%[cc]',
                Evaluator: '<=50', DoseLeft: '', DoseRight: ''
              }, AcceptableVariation: { DVHObjective: 'V43%[cc]', Evaluator: '<=45', DoseLeft: '', DoseRight: '' },
              Priority: '1'
            }, {
              StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[cc]', Evaluator: '<=7', DoseLeft: '', DoseRight: '' },
              AcceptableVariation: { DVHObjective: 'Mean[cc]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
            }], StructureId: 'Target2'
          }],
        targetCount: 2, PrescribedSessionsCount: '15'
      }, {
        PhaseIndex: '2', FractionCount: 5,
        PrescriptionTargets: [{
          FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
          Objectives: [{
            StructureId: null, Phase: null, ClinicalGoal:
              { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
          },
          {
            StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
          }], StructureId: 'Target1'
        },
        {
          FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
            StructureId: null, Phase: null,
            ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
              DVHObjective: 'V43Gy[cc]',
              Evaluator: '<=52', DoseLeft: '', DoseRight: ''
            }, Priority: '1'
          }, {
            StructureId: null, Phase: null, ClinicalGoal: {
              DVHObjective: 'V48Gy[%]',
              Evaluator: '<=30', DoseLeft: '', DoseRight: ''
            }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
            Priority: '2'
          }], StructureId: 'Target2'
        }], targetCount: 2, PrescribedSessionsCount: '5'
      }, {
        PhaseIndex: '3', FractionCount: 5,
        PrescriptionTargets: [{
          FractionDoseGy: '8', Dose: '40', StructureCode: 'PTV',
          Objectives: [{
            StructureId: null, Phase: null, ClinicalGoal:
              { DVHObjective: 'D3cc[Gy]', Evaluator: '<=54', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'D3cc[Gy]', Evaluator: '<=52', DoseLeft: '', DoseRight: '' }, Priority: '1'
          },
          {
            StructureId: null, Phase: null, ClinicalGoal: { DVHObjective: 'Mean[Gy]', Evaluator: '<=19', DoseLeft: '', DoseRight: '' },
            AcceptableVariation: { DVHObjective: 'Mean[Gy]', Evaluator: '<=10', DoseLeft: '', DoseRight: '' }, Priority: '2'
          }], StructureId: 'Target1'
        },
        {
          FractionDoseGy: '4', Dose: '20', StructureCode: 'CTV', Objectives: [{
            StructureId: null, Phase: null,
            ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: '', DoseRight: '' }, AcceptableVariation: {
              DVHObjective: 'V43Gy[cc]',
              Evaluator: '<=52', DoseLeft: '', DoseRight: ''
            }, Priority: '1'
          }, {
            StructureId: null, Phase: null, ClinicalGoal: {
              DVHObjective: 'V48Gy[%]',
              Evaluator: '<=30', DoseLeft: '', DoseRight: ''
            }, AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: '', DoseRight: '' },
            Priority: '2'
          }], StructureId: 'Target2'
        }], targetCount: 2, PrescribedSessionsCount: '5'
      }];
    component.phases = phases;
    const totalphase = {
      targets: [
        { targetName: 'PTV', targetValue: '100', targetId: 'Target1' },
        { targetName: 'CTV', targetValue: '50', targetId: 'Target2' }], totaldose: '150', fractioncount: '20'
    };
    component.totalphase = totalphase;
    component.calculateTotalPhase();
    expect(component.totalphase.totaldose).toBe('210');

  });


});


