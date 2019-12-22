import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StructureComponent } from './structure.component';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { AppService } from 'src/app/shared/helpers/app-service';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { ToastsManager, ToastOptions } from 'ng6-toastr';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GoalIntellisenseComponent } from 'src/app/component/plan/plan-directive-details/goal-intellisense/goal-intellisense.component';

describe('StructureComponent', () => {
  let component: StructureComponent;
  let fixture: ComponentFixture<StructureComponent>;
  let dataService: DataServiceService;
  let confirmationService: ConfirmationService;
  let appService: AppService;
  let structure;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DialogModule, FormsModule, TableModule, HttpClientModule],
      declarations: [StructureComponent, GoalIntellisenseComponent],
      providers: [ConfirmationService, AppService, ToastsManager, ToastOptions, DataServiceService]
    })
      .compileComponents();

    structure = {
      Phases: [
        {
          phaseId: '1',
          Objectives: [
            {
              StructureId: null,
              Phase: null,
              ClinicalGoal: {
                DVHObjective: 'D5%[Gy]',
                Evaluator: '<=52',
                DoseLeft: 'D5%',
                DoseRight: '<=52Gy'
              },
              AcceptableVariation: {
                DVHObjective: 'D5%[Gy]',
                Evaluator: '<=53',
                DoseLeft: 'D5%',
                DoseRight: '<=53Gy'
              },
              Priority: '1'
            },
            {
              StructureId: null,
              Phase: null,
              ClinicalGoal: {
                DVHObjective: 'Max[%]',
                Evaluator: '<=105',
                DoseLeft: 'DMax',
                DoseRight: '<=105%'
              },
              AcceptableVariation: {
                DVHObjective: 'Max[%]',
                Evaluator: '<=115',
                DoseLeft: 'DMax',
                DoseRight: '<=115%'
              },
              Priority: '2'
            }
          ]
        },
        {
          phaseId: '2',
          Objectives: [
            {
              StructureId: null,
              Phase: null,
              ClinicalGoal: {
                DVHObjective: 'D3cc[Gy]',
                Evaluator: '<=54',
                DoseLeft: 'D3cc',
                DoseRight: '<=54Gy'
              },
              AcceptableVariation: {
                DVHObjective: 'D3cc[Gy]',
                Evaluator: '<=52',
                DoseLeft: 'D3cc',
                DoseRight: '<=52Gy'
              },
              Priority: '1'
            },
            {
              StructureId: null,
              Phase: null,
              ClinicalGoal: {
                DVHObjective: 'Mean[Gy]',
                Evaluator: '<=19',
                DoseLeft: 'DMean',
                DoseRight: '<=19Gy'
              },
              AcceptableVariation: {
                DVHObjective: 'Mean[Gy]',
                Evaluator: '<=10',
                DoseLeft: 'DMean',
                DoseRight: '<=10Gy'
              },
              Priority: '2'
            }
          ]
        }
      ],
      Code: 'CTV',
      Meaning: 'Planning Target Volume',
      Name: 'CTV Low',
      StructureId: 'Target2',
      type: 'TargetStructure'
    };
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureComponent);
    component = fixture.debugElement.componentInstance;
    dataService = TestBed.get(DataServiceService);
    confirmationService = TestBed.get(ConfirmationService);
    appService = TestBed.get(AppService);
    component.structure = structure;

    component.structure = {
      Phases: [
        {
          phaseId: '1',
          Objectives: [
            {
              StructureId: null, Phase: null,
              ClinicalGoal: { DVHObjective: 'V43%[cc]', Evaluator: '<=50', DoseLeft: 'V43%', DoseRight: '<=50cc' },
              AcceptableVariation: { DVHObjective: 'V43%[cc]', Evaluator: '<=45', DoseLeft: 'V43%', DoseRight: '<=45cc' },
              Priority: '1'
            },
            {
              StructureId: null, Phase: null,
              ClinicalGoal: { DVHObjective: 'Mean[cc]', Evaluator: '<=7', DoseLeft: 'DMean', DoseRight: '<=7cc' },
              AcceptableVariation: { DVHObjective: 'Mean[cc]', Evaluator: '<=10', DoseLeft: 'DMean', DoseRight: '<=10cc' },
              Priority: '2'
            }
          ]
        },
        {
          phaseId: '2',
          Objectives: [
            {
              StructureId: null, Phase: null,
              ClinicalGoal: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=50', DoseLeft: 'V43Gy', DoseRight: '<=50cc' },
              AcceptableVariation: { DVHObjective: 'V43Gy[cc]', Evaluator: '<=52', DoseLeft: 'V43Gy', DoseRight: '<=52cc' },
              Priority: '1'
            },
            {
              StructureId: null, Phase: null,
              ClinicalGoal: { DVHObjective: 'V48Gy[%]', Evaluator: '<=30', DoseLeft: 'V48Gy', DoseRight: '<=30%' },
              AcceptableVariation: { DVHObjective: 'V48Gy[%]', Evaluator: '<=28', DoseLeft: 'V48Gy', DoseRight: '<=28%' },
              Priority: '2'
            }
          ]
        }
      ],
      Code: 'CTV', Schema: '', SchemaVersion: '', Color: '', Meaning: 'Clinical Target Volume', Name: 'CTV Low',
      StructureId: 'Target2', type: 'TargetStructure'
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch this.styleConfigured value from json file', async(() => {
    spyOn(dataService, 'getConfiguredStyle').and.returnValue(Observable.of({ configureStyle: 'varian' }));
    component.getConfiguredStyle();
    fixture.whenStable().then(() => {
      expect(component.styleConfigured).toEqual('varian');
    });
  }));

  it('should set varian as default value for this.styleConfigured', async(() => {
    spyOn(dataService, 'getConfiguredStyle').and.returnValue(Observable.of({ configureStyle: 'abc' }));
    component.getConfiguredStyle();
    fixture.whenStable().then(() => {
      expect(component.styleConfigured).toEqual('varian');
    });
  }));

  it('should check expand / collapse of cards', () => {

    component.down = false;
    component.checkCollapse();
    expect(component.down).toBeTruthy();
    expect(component.up).toBeFalsy();
    component.checkCollapse();
    expect(component.down).toBeFalsy();
    expect(component.up).toBeTruthy();
  });

  it('should  Initialize the priority and calculate strucutre goal length and show the cards', async(() => {
    const goalPriority = {
      'Goal-Priority': [
        { Name: '1-Must', Value: '1' },
        { Name: '2-Very Important', Value: '2' },
        { Name: '3-Important', Value: '3' },
        { Name: '4-Less Important', Value: '4' },
        { Name: 'R-Report Value Only', Value: 'R' }
      ]
    };

    spyOn(dataService, 'getGoalPriority').and.returnValue(Observable.of(goalPriority));
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.goalPriority.length).toBe(5);
      expect(component.down).toBeFalsy();
      expect(component.up).toBeTruthy();
      expect(component.expand).toBeTruthy();
      expect(component.name).toBe(structure.Name);
    });
  }));

  it('should check expand / collapse of cards', () => {

    component.close('OAR');
    expect(component.displayDialog).toBeFalsy();
    expect(component.disableEditType).toBeFalsy();
    component.close('Target');
    expect(component.targetDisplayDialog).toBeFalsy();
    expect(component.disableEditType).toBeFalsy();
  });

  it('should enable / disable Edit Type', () => {
    component.ValidateClinicalGoal(false);
    expect(component.disableEditType).toBeFalsy();
  });

  it('should update clinical goals on phase value change', () => {
    component.targetClinicalGoals = [
      { Phase: '1', Goal: 'V43%<=50cc', Priority: '1', Variation: 'V43%<=45cc', isGoalValid: true, isVariationValid: true },
      { Phase: '1', Goal: 'DMean<=7cc', Priority: '2', Variation: 'DMean<=10cc', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'V43Gy<=50cc', Priority: '1', Variation: 'V43Gy<=52cc', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'V48Gy<=30%', Priority: '2', Variation: 'V48Gy<=28%', isGoalValid: true, isVariationValid: true },
      { Goal: 'DMax>=10%', Priority: '1', Variation: 'DMax>10cc', Phase: '1', isGoalValid: true, isVariationValid: true },
      { Goal: 'DMax>=10cc', Priority: '1', Variation: 'DMean>=cc', Phase: '2', isGoalValid: true, isVariationValid: true }
    ];

    component.oarClinicalGoals = [
      { Phase: '1', Goal: 'DMax<=2Gy', Priority: '1', Variation: 'DMax<=4Gy', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'D5%<=1.44Gy', Priority: '2', Variation: 'D5%<=1.42Gy', isGoalValid: true, isVariationValid: true }
    ];

    let goal = { Goal: 'DMax>=10cc', Priority: '1', Variation: 'DMean>=cc', Phase: '2', isGoalValid: true, isVariationValid: true };
    component.onPhaseChange('1', goal, 'Target');
    expect(component.targetClinicalGoals[5].Phase).toBe('1');

    goal = { Phase: '2', Goal: 'D5%<=1.44Gy', Priority: '2', Variation: 'D5%<=1.42Gy', isGoalValid: true, isVariationValid: true };
    component.onPhaseChange('1', goal, 'OAR');
    expect(component.oarClinicalGoals[1].Phase).toBe('1');
  });

  it('should update clinical goals on priority value change', () => {
    component.targetClinicalGoals = [
      { Phase: '1', Goal: 'D5%<=52Gy', Priority: '1', Variation: 'D5%<=53Gy', isGoalValid: true, isVariationValid: true },
      { Phase: '1', Goal: 'DMax<=105%', Priority: '2', Variation: 'DMax<=115%', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'D3cc<=54Gy', Priority: '1', Variation: 'D3cc<=52Gy', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'DMean<=19Gy', Priority: '2', Variation: 'DMean<=10Gy', isGoalValid: true, isVariationValid: true }
    ];

    component.oarClinicalGoals = [
      { Phase: '1', Goal: 'DMax<=2Gy', Priority: '1', Variation: 'DMax<=4Gy', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'D5%<=1.44Gy', Priority: '2', Variation: 'D5%<=1.42Gy', isGoalValid: true, isVariationValid: true }
    ];

    let goal = { Goal: 'DMean<=19Gy', Priority: '2', Variation: 'DMean<=10Gy', Phase: '2', isGoalValid: true, isVariationValid: true };
    component.onPriorityChange('1', goal, 'Target');
    expect(component.targetClinicalGoals[3].Priority).toBe('1');

    goal = { Phase: '2', Goal: 'D5%<=1.44Gy', Priority: '2', Variation: 'D5%<=1.42Gy', isGoalValid: true, isVariationValid: true };
    component.onPriorityChange('1', goal, 'OAR');
    expect(component.oarClinicalGoals[1].Priority).toBe('1');
  });

  it('should update clinical goal in row data on value change', () => {
    component.targetClinicalGoals = [
      { Phase: '1', Goal: 'D5%<=52Gy', Priority: '1', Variation: 'D5%<=53Gy', isGoalValid: true, isVariationValid: true },
      { Phase: '1', Goal: 'DMax<=105%', Priority: '2', Variation: 'DMax<=115%', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'D3cc<=54Gy', Priority: '1', Variation: 'D3cc<=52Gy', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'DMean<=19Gy', Priority: '2', Variation: 'DMean<=10Gy', isGoalValid: true, isVariationValid: true }
    ];

    spyOn(component, 'goalsValid').and.returnValue(true);

    const goal = { Goal: 'DMean<=19Gy', Priority: '2', Variation: 'DMean<=10Gy', Phase: '2' };
    component.updateGoal(goal, 'DMax<=19Gy', 'Target');
    expect(goal.Goal).toBe('DMax<=19Gy');
  });

  it('should update variation in row data on value change', () => {
    component.targetClinicalGoals = [
      { Phase: '1', Goal: 'D5%<=52Gy', Priority: '1', Variation: 'D5%<=53Gy', isGoalValid: true, isVariationValid: true },
      { Phase: '1', Goal: 'DMax<=105%', Priority: '2', Variation: 'DMax<=115%', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'D3cc<=54Gy', Priority: '1', Variation: 'D3cc<=52Gy', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'DMean<=19Gy', Priority: '2', Variation: 'DMean<=10Gy', isGoalValid: true, isVariationValid: true }
    ];

    spyOn(component, 'goalsValid').and.returnValue(true);

    let goal = { Goal: 'DMean<=19Gy', Priority: '2', Variation: 'DMean<=10Gy', Phase: '2' };
    component.updateVariation(goal, 'DMax<=10Gy', 'Target');
    expect(goal.Variation).toBe('DMax<=10Gy');
    goal = { Goal: 'DMean<=19Gy', Priority: '2', Variation: 'DMean<=10Gy', Phase: '2' };
    component.updateVariation(goal, '', 'Target');
    expect(component.disableEditType).toBeTruthy();
  });

  it('should save clinical goal', () => {
    const goal = [
      { Phase: '1', Goal: 'D5%<=52Gy', Priority: '1', Variation: 'D5%<=53Gy', isGoalValid: true, isVariationValid: true },
      { Phase: '1', Goal: 'DMax<=105%', Priority: '2', Variation: 'DMax<=115%', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'D3cc<=54Gy', Priority: '1', Variation: 'D3cc<=52Gy', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'DMean<=19Gy', Priority: '2', Variation: 'DMean<=10Gy', isGoalValid: true, isVariationValid: true }
    ];

    spyOn(appService, 'AddEditOAR').and.returnValue(true);
    spyOn(appService, 'AddEditTarget').and.returnValue(true);

    component.save(goal, 'Target1', 'Target');
    expect(appService.AddEditTarget).toHaveBeenCalled();
    component.save(goal, 'Target1', 'OAR');
    expect(appService.AddEditOAR).toHaveBeenCalled();
    expect(component.down).toBeFalsy();
    expect(component.up).toBeTruthy();
  });

  it('should delete clinical goal', () => {
    component.targetClinicalGoals = [
      { Phase: '1', Goal: 'D5%<=52Gy', Priority: '1', Variation: 'D5%<=53Gy', isGoalValid: true, isVariationValid: true },
      { Phase: '1', Goal: 'DMax<=105%', Priority: '2', Variation: 'DMax<=115%', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'D3cc<=54Gy', Priority: '1', Variation: 'D3cc<=52Gy', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'DMean<=19Gy', Priority: '2', Variation: 'DMean<=10Gy', isGoalValid: true, isVariationValid: true }
    ];

    component.oarClinicalGoals = [
      { Phase: '1', Goal: 'D5%<=52Gy', Priority: '1', Variation: 'D5%<=53Gy', isGoalValid: true, isVariationValid: true },
      { Phase: '1', Goal: 'DMax<=105%', Priority: '2', Variation: 'DMax<=115%', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'D3cc<=54Gy', Priority: '1', Variation: 'D3cc<=52Gy', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'DMean<=19Gy', Priority: '2', Variation: 'DMean<=10Gy', isGoalValid: true, isVariationValid: true }
    ];

    const goal = {
      Goal: 'DMean<=19Gy', Priority: '2', Variation: 'DMean<=10Gy', Phase: '2', isGoalValid: true,
      isVariationValid: true
    };

    spyOn(appService, 'AddEditOAR').and.returnValue(true);
    spyOn(component, 'goalsValid').and.returnValue(true);

    spyOn(confirmationService, 'confirm').and.callFake((params: any) => {
      params.accept();
    });

    component.deleteGoal(goal, 'Target');
    expect(component.targetClinicalGoals.length).toBe(3);

    component.deleteGoal(goal, 'OAR');
    expect(component.oarClinicalGoals.length).toBe(3);
  });

  it('should delete Target / OAR', () => {
    spyOn(appService, 'deleteTargetStructureById').and.returnValue(true);
    spyOn(appService, 'deleteOARById').and.returnValue(true);

    spyOn(confirmationService, 'confirm').and.callFake((params: any) => {
      params.accept();
    });

    component.Delete();
    expect(appService.deleteTargetStructureById).toHaveBeenCalled();

    component.structure.type = 'OAR';
    component.Delete();
    expect(appService.deleteOARById).toHaveBeenCalled();
  });

  it('should Edit Target / OAR', () => {
    spyOn(component, 'createGoals').and.returnValue(true);

    component.Edit();
    expect(component.createGoals).toHaveBeenCalled();
    expect(component.targetDisplayDialog).toBeTruthy();
    expect(component.targetClinicalGoals.length).toBe(0);


    component.structure.type = 'OAR';
    component.Edit();
    expect(component.createGoals).toHaveBeenCalled();
    expect(component.displayDialog).toBeTruthy();
    expect(component.oarClinicalGoals.length).toBe(0);
  });

  it('should Create Clinical goals', () => {
    component.targetClinicalGoals = [];

    component.createGoals(component.targetClinicalGoals);
    expect(component.targetClinicalGoals.length).toBe(4);
  });

  it('should Create Clinical goals', () => {
    component.targetClinicalGoals = [
      { Phase: '1', Goal: 'V43%<=50cc', Priority: '1', Variation: 'V43%<=45cc', isGoalValid: true, isVariationValid: true },
      { Phase: '1', Goal: 'DMean<=7cc', Priority: '2', Variation: 'DMean<=10cc', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'V43Gy<=50cc', Priority: '1', Variation: 'V43Gy<=52cc', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'V48Gy<=30%', Priority: '2', Variation: 'V48Gy<=28%', isGoalValid: true, isVariationValid: true }
    ];

    component.oarClinicalGoals = [
      { Phase: '1', Goal: 'DMax<=2Gy', Priority: '1', Variation: 'DMax<=4Gy', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'D5%<=1.44Gy', Priority: '2', Variation: 'D5%<=1.42Gy', isGoalValid: true, isVariationValid: true }
    ];

    component.addGoal('Target');
    expect(component.targetClinicalGoals.length).toBe(5);

    component.addGoal('OAR');
    expect(component.oarClinicalGoals.length).toBe(3);
  });

  it('should validate target / oar Clinical goals', () => {
    component.targetClinicalGoals = [
      { Phase: '1', Goal: '', Priority: '1', Variation: 'V43%<=45cc', isGoalValid: true, isVariationValid: true },
      { Phase: '1', Goal: 'DMean<=7cc', Priority: '2', Variation: 'DMean<=10cc', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'V43Gy<=50cc', Priority: '1', Variation: 'V43Gy<=52cc', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'V48Gy<=30%', Priority: '2', Variation: 'V48Gy<=28%', isGoalValid: true, isVariationValid: true }
    ];

    component.oarClinicalGoals = [
      { Phase: '1', Goal: '', Priority: '1', Variation: 'DMax<=4Gy', isGoalValid: true, isVariationValid: true },
      { Phase: '2', Goal: 'D5%<=1.44Gy', Priority: '2', Variation: 'D5%<=1.42Gy', isGoalValid: true, isVariationValid: true }
    ];

    component.goalsValid('Target');
    expect(component.disableEditType).toBeTruthy();
    component.disableEditType = false;
    component.targetClinicalGoals[0].Goal = 'V43%<=50cc';
    component.structure.Name = undefined;
    component.goalsValid('Target');
    expect(component.disableEditType).toBeTruthy();
    component.structure.Name = 'CTV Low';
    component.goalsValid('Target');
    expect(component.disableEditType).toBeFalsy();

    component.goalsValid('OAR');
    expect(component.disableEditType).toBeTruthy();
    component.disableEditType = false;
    component.oarClinicalGoals[0].Goal = 'DMax<=2Gy';
    component.structure.Name = undefined;
    component.goalsValid('OAR');
    expect(component.disableEditType).toBeTruthy();
    component.structure.Name = 'CTV Low';
    component.goalsValid('OAR');
    expect(component.disableEditType).toBeFalsy();
  });
});
