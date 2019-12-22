import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GoalIntellisenseComponent } from './goal-intellisense.component';
import { IntellisenseService } from 'src/app/shared/services/intellisense.service';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { FormsModule } from '@angular/forms';
import { ToastsManager, ToastOptions } from 'ng6-toastr';
import { HttpClientModule } from '@angular/common/http';
import { ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';

describe('GoalIntellisenseComponent', () => {
  let component: GoalIntellisenseComponent;
  let fixture: ComponentFixture<GoalIntellisenseComponent>;
  let intellisenseService: IntellisenseService;
  let dataService: DataServiceService;
  let toastManager: ToastsManager;
  let vRef: ViewContainerRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule],
      declarations: [GoalIntellisenseComponent],
      providers: [ToastsManager, ToastOptions, IntellisenseService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalIntellisenseComponent);
    component = fixture.componentInstance;
    dataService = TestBed.get(DataServiceService);
    intellisenseService = TestBed.get(IntellisenseService);
    toastManager = TestBed.get(ToastsManager);
    toastManager.setRootViewContainerRef(vRef);
    fixture.detectChanges();
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

  it('should fetch intellisense element from json file : Success case', async(() => {

    const intellisenseEle = {
      states: [{ key: 'DMin', id: 1 }, { key: 'DMax', id: 2 }, { key: 'DMean', id: 3 }, { key: 'D', id: 4 },
      { key: 'V', id: 5 }], 'operator': [{ key: '<=', id: 1 }, { key: '>=', id: 2 }, { key: '<', id: 3 }, { key: '>', id: 4 }],
      leftExpModel: [{ key: 'Gy', id: 2 }, { key: '%', id: 3 }, { key: 'cc', id: 4 }], rightExpModel: [{ key: 'Gy', id: 2 },
      { key: '%', id: 3 }, { key: 'cc', id: 4 }], doseConstraints: ['DMin', 'DMax', 'DMean'], mode: { 'v': 'v', 'd': 'd' }
    };

    spyOn(intellisenseService, 'getIntellisenseElements').and.returnValue(Observable.of(intellisenseEle));
    spyOn(component, 'getGoalObjectValues').and.returnValue(true);

    component.fetchIntellisenseElements();

    fixture.whenStable().then(() => {
      expect(component.states.length).toBe(5);
      expect(component.operator.length).toBe(4);
      expect(component.leftExpModel.length).toBe(3);
      expect(component.rightExpModel.length).toBe(3);
      expect(component.doseConstraints.length).toBe(3);
      expect(component.mode).toBeDefined();
    });
  }));

  it('should not fetch data from json file if it is already fetched', () => {
    intellisenseService.intellisenseObj = {
      states: [{ key: 'DMin', id: 1 }, { key: 'DMax', id: 2 }, { key: 'DMean', id: 3 }, { key: 'D', id: 4 }],
      operator: [{ key: '<=', id: 1 }, { key: '>=', id: 2 }, { key: '<', id: 3 }, { key: '>', id: 4 }],
      leftExpModel: [{ key: 'Gy', id: 2 }, { key: '%', id: 3 }, { key: 'cc', id: 4 }],
      rightExpModel: [{ key: 'Gy', id: 2 }, { key: '%', id: 3 }, { key: 'cc', id: 4 }],
      doseConstraints: ['DMin', 'DMax', 'DMean'],
      mode: { 'v': 'v', 'd': 'd' }
    };

    spyOn(component, 'getGoalObjectValues').and.returnValue(true);

    component.fetchIntellisenseElements();

    expect(component.doseConstraints.length).toBe(3);
    expect(component.mode).toBeDefined();
  });

  it('should map goal value from template to goal object', () => {
    intellisenseService.intellisenseObj = {
      states: [{ key: 'DMin', id: 1 }, { key: 'DMax', id: 2 }, { key: 'DMean', id: 3 }, { key: 'D', id: 4 }],
      'operator': [{ key: '<=', id: 1 }, { key: '>=', id: 2 }, { key: '<', id: 3 }, { key: '>', id: 4 }],
      leftExpModel: [{ key: 'Gy', id: 2 }, { key: '%', id: 3 }, { key: 'cc', id: 4 }], rightExpModel: [{ key: 'Gy', id: 2 },
      { key: '%', id: 3 }, { key: 'cc', id: 4 }], doseConstraints: ['DMin', 'DMax', 'DMean'], mode: { 'v': 'v', 'd': 'd' }
    };

    spyOn(component, 'getGoalObjectValues').and.returnValue(true);

    component.fetchIntellisenseElements();

    expect(component.doseConstraints.length).toBe(3);
    expect(component.mode).toBeDefined();
  });

  it('should append the selected value on existing goal', () => {
    component.doseConstraints = ['DMin', 'DMax', 'DMean'];
    component.mode = { 'v': 'v', 'd': 'd' };

    spyOn(component, 'hideShowIntellisense').and.returnValue(true);
    spyOn(component, 'validateClinicalGoal').and.returnValue(true);
    spyOn(component, 'validateBeforeEmmitingData').and.returnValue(true);

    component.selectValue('DMin', 'first');
    expect(component.objGoal.lftUnit).toBe('');
    expect(component.objGoal.lftValue).toBe('');
    expect(component.objGoal.doseName).toBe('DMin');

    component.selectValue('>=', 'third');
    expect(component.objGoal.operator).toBe('>=');

    component.selectValue('cc', 'fourth');
    expect(component.objGoal.rgtUnit).toBe('cc');
    expect(component.clinicalGoalCompleted).toBeTruthy();

    component.selectValue('D', 'first');
    component.selectValue('Gy', 'second');
    expect(component.objGoal.lftUnit).toBe('Gy');
  });

  it('should hide / show intellisense options available', () => {
    component.hideShowIntellisense(false, false, true, false);

    expect(component.showDoseName).toBeFalsy();
    expect(component.showOperator).toBeFalsy();
    expect(component.showLeftExpValue).toBeTruthy();
    expect(component.showRightExpValue).toBeFalsy();
  });

  it('should close intellisense options available', () => {
    component.closeIntellisense();

    expect(component.showDoseName).toBeFalsy();
    expect(component.showOperator).toBeFalsy();
    expect(component.showLeftExpValue).toBeFalsy();
    expect(component.showRightExpValue).toBeFalsy();
  });

  it('should allow only numeric value inside goal expression value', () => {
    let result = component.numberOnly({ key: '4' });
    expect(result).toBeTruthy();
    result = component.numberOnly({ key: 'a' });
    expect(result).toBeFalsy();
  });

  it('should open goal intellisense drop down ', () => {

    component.objGoal.doseName = 'DMean';
    component.objGoal.lftValue = '';
    component.objGoal.lftUnit = '';
    component.objGoal.operator = '<=';
    component.objGoal.rgtValue = '19';
    component.objGoal.rgtUnit = 'Gy';

    component.openDropDown({ currentTarget: { selectionStart: 0 } });
    expect(component.showDoseName).toBeTruthy();
    component.openDropDown({ currentTarget: { selectionStart: 0 } });
    expect(component.showDoseName).toBeFalsy();
    component.openDropDown({ currentTarget: { selectionStart: 3 } });
    expect(component.showDoseName).toBeTruthy();
    expect(component.showOperator).toBeFalsy();
    expect(component.showLeftExpValue).toBeFalsy();
    expect(component.showRightExpValue).toBeFalsy();
    component.openDropDown({ currentTarget: { selectionStart: 6 } });
    expect(component.showDoseName).toBeFalsy();
    expect(component.showOperator).toBeTruthy();
    expect(component.showLeftExpValue).toBeFalsy();
    expect(component.showRightExpValue).toBeFalsy();
    component.openDropDown({ currentTarget: { selectionStart: 8 } });
    expect(component.showDoseName).toBeFalsy();
    expect(component.showOperator).toBeFalsy();
    expect(component.showLeftExpValue).toBeFalsy();
    expect(component.showRightExpValue).toBeTruthy();
  });

  it('should open goal intellisense drop down ', () => {
    component.mode = { 'v': 'v', 'd': 'd' };
    component.validateClinicalGoal('v', '', 'D');
    expect(component.containsError).toBeFalsy();
    component.validateClinicalGoal('d', '10', '%');
    expect(component.containsError).toBeFalsy();
    component.validateClinicalGoal('d', '10', '>=');
    expect(component.containsError).toBeFalsy();
    component.validateClinicalGoal('d', '500', 'Gy');
    expect(component.containsError).toBeTruthy();
    component.validateClinicalGoal('d', '1001', '%');
    expect(component.containsError).toBeTruthy();
    component.validateClinicalGoal('d', '1001', 'cc');
    expect(component.containsError).toBeTruthy();
  });

  it('should open goal intellisense drop down ', () => {
    component.objGoal.doseName = 'D';
    component.objGoal.lftValue = '10';
    component.objGoal.lftUnit = '%';
    component.objGoal.operator = '<=';
    component.objGoal.rgtValue = '19';
    component.objGoal.rgtUnit = 'cc';

    component.onNumberEnter('lft', '12');
    expect(component.objGoal.lftValue).toBe('12');
    expect(component.goal).toBe('D12%<=19cc');
  });
});
