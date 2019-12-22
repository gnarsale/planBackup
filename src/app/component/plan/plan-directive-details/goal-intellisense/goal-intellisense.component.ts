import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { IntellisenseService } from 'src/app/shared/services/intellisense.service';
import { Intellisense } from 'src/app/shared/services/intellisense.service';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { IntellisenseElement } from 'src/app/shared/models/intellisense-element';
declare let $: any;

@Component({
  selector: 'app-goal-intellisense',
  templateUrl: './goal-intellisense.component.html',
  styleUrls: ['./goal-intellisense.component.scss']
})
export class GoalIntellisenseComponent implements OnInit, AfterViewInit {
  // variable to show / hide intellisense dropdown
  showDoseName: Boolean = false;
  showOperator: Boolean = false;
  showLeftExpValue: Boolean = false;
  showRightExpValue: Boolean = false;
  clinicalGoalCompleted = false;
  // indicates that clinical goal entered contains error
  containsError = false;
  styleConfigured: string;
  // datamodel for intellisense value
  states: IntellisenseElement[] = [];
  operator: IntellisenseElement[] = [];
  leftExpModel: IntellisenseElement[] = [];
  rightExpModel: IntellisenseElement[] = [];
  doseConstraints: string[] = [];
  mode: object;
  // Intellisense level's constants
  first = 'first';
  second = 'second';
  third = 'third';
  fourth = 'fourth';
  // input variable to get the existing goal value from parent component
  @Input() goal: string;
  @Input() goalSequence: number;

  // input the Edited Goal
  @Input() clinicalGoal: any;
  // Event Emitter to emit event on every changes in Clinical Goal
  @Output() GoalEmitter = new EventEmitter<string>();
  // Event Emitter to emit event on error in clinical goal
  @Output() GoalErrorEmitter = new EventEmitter<boolean>();
  // Contains goal intellisense component refrence
  @ViewChild('target') TargetGoal: ElementRef;

  @Output() LastRowEmitter = new EventEmitter<number>();

  objGoal: { 'doseName': string, 'lftValue': string, 'lftUnit': string, 'operator': string, 'rgtValue': string, 'rgtUnit': string } =
    { 'doseName': '', 'lftValue': '', 'lftUnit': '', 'operator': '', 'rgtValue': '', 'rgtUnit': '' };

  constructor(private toastManager: ToastsManager, private vRef: ViewContainerRef, private dataServiceService: DataServiceService,
    private intellisenseService: IntellisenseService) {
    // this.toastManager.setRootViewContainerRef(vRef);
    this.getConfiguredStyle();
  }

  fetchIntellisenseElements(): void {
    if (this.intellisenseService.intellisenseObj.states === undefined || this.intellisenseService.intellisenseObj.states.length === 0) {
      this.intellisenseService.getIntellisenseElements().subscribe(
        data => {
          // read data from response and assign to data models
          this.states = data['states'];
          this.operator = data['operator'];
          this.leftExpModel = data['leftExpModel'];
          this.rightExpModel = data['rightExpModel'];
          this.doseConstraints = data['doseConstraints'];
          this.mode = data['mode'];
          // set the intellisense element data in service object
          // this data is set to service to prevent http call for each instance of intellisense
          this.intellisenseService.intellisenseObj = data as Intellisense;
          this.getGoalObjectValues();
        },
        err => {
          // display error message in primeng message component
          this.toastManager.error(err, 'Error!');
        }
      );
    } else {
      // read data from response and assign to data models
      // this.states = this.intellisenseService.intellisenseObj['states'];
      // this.operator = this.intellisenseService.intellisenseObj['operator'];
      // this.leftExpModel = this.intellisenseService.intellisenseObj['leftExpModel'];
      // this.rightExpModel = this.intellisenseService.intellisenseObj['rightExpModel'];
      this.doseConstraints = this.intellisenseService.intellisenseObj['doseConstraints'];
      this.mode = this.intellisenseService.intellisenseObj['mode'];
      this.getGoalObjectValues();
    }
  }

  /**
   * Detects the tab press and closes the intellisense dropdown
   */
  checkTabPress(): void {
    $(document).keydown((e) => {
      if (e.keyCode === 9) {
        // escape key maps to keycode `27`
        // tab key maps to keycode `9`
        this.hideShowIntellisense(false, false, false, false);
      }
    });
  }

  ngOnInit() {
    this.checkTabPress();
  }

  ngAfterViewInit() {
    this.fetchIntellisenseElements();
  }

  /**
   * map goal value from template to goal object
   */
  getGoalObjectValues() {
    let lftExp = '';
    let rgtExp = '';

    for (const li of this.states) {
      if (this.goal !== undefined && this.goal.includes(li.key)) {
        this.objGoal.doseName = li.key;
        break;
      }
    }

    for (const li of this.operator) {
      if (this.goal !== undefined && this.goal.includes(li.key)) {
        this.objGoal.operator = li.key;
        break;
      }
    }

    if (this.goal !== undefined) {
      lftExp = this.goal.split(this.objGoal.operator)[0];
      rgtExp = this.goal.split(this.objGoal.operator)[1];
    }

    if (lftExp !== undefined) {
      for (const li of this.leftExpModel) {
        if (lftExp.includes(li.key)) {
          this.objGoal.lftUnit = li.key;
          break;
        }
      }
      // check if left side expression contains numeric value
      if (lftExp.match(/\d+/g)) {
        this.objGoal.lftValue = lftExp.match(/\d+/)[0];
      }
    }
    // check if left side expression contains numeric value
    if (rgtExp !== undefined) {
      if (rgtExp.match(/\d+/g)) {
        this.objGoal.rgtValue = rgtExp.match(/\d+/)[0];
      }
      // extract the unit of right side from rightexpression
      for (const li of this.rightExpModel) {
        if (rgtExp.includes(li.key)) {
          this.objGoal.rgtUnit = li.key;
          break;
        }
      }
    }
  }

  /**
   *  function gets called when we click on intelligence value and
   * after that it appends the value in existing goal
   * @param value contains value selected in intellisense
   * @param level contains which level of intellisense is open
   */
  selectValue(value, level) {
    const mode: string = (this.objGoal.doseName === 'D') ? this.mode['d'] : this.mode['v'];

    // check if first level intellisense is clicked
    if (level === this.first) {
      if (this.doseConstraints.includes(value)) {
        this.hideShowIntellisense(false, true, false, false);
        this.objGoal.lftUnit = '';
        this.objGoal.lftValue = '';
      } else {
        this.hideShowIntellisense(false, false, true, false);
      }

      this.objGoal.doseName = value;
    } else if (level === this.second) {
      // check if second level intellisense is clicked
      this.hideShowIntellisense(false, true, false, false);
      this.objGoal.lftUnit = value;
    } else if (level === this.third) {
      // check if third level intellisense is clicked
      this.hideShowIntellisense(false, false, false, true);

      this.objGoal.operator = value;
    } else if (level === this.fourth) {
      // check if fourth level intellisense is clicked
      this.hideShowIntellisense(false, false, false, false);
      this.objGoal.rgtUnit = value;
      this.clinicalGoalCompleted = true;
    }

    this.validateClinicalGoal(mode, this.objGoal.lftValue, value);
    this.validateClinicalGoal(mode, this.objGoal.rgtValue, value);

    // append value in goal
    this.goal = this.objGoal.doseName + this.objGoal.lftValue + this.objGoal.lftUnit + this.objGoal.operator +
      this.objGoal.rgtValue + this.objGoal.rgtUnit;
    // update the goal in parent component object
    this.validateBeforeEmmitingData(false);

    // Scroll the component in view by sliding along y axis
    this.TargetGoal.nativeElement.scrollIntoView(true);
    setTimeout(() => { this.LastRowEmitter.emit(this.goalSequence); }, 50);
  }

  /**
   * Hide/Show Intellisense sections
   * @param showDoseName hide/show level 1 of intellisense
   * @param showOperator hide/show level 2 of intellisense
   * @param showLeftExpValue hide/show level 3 of intellisense
   * @param showRightExpValue hide/show level 4 of intellisense
   */
  hideShowIntellisense(showDoseName, showOperator, showLeftExpValue, showRightExpValue) {
    // set display values of different section of intellisense
    this.showDoseName = showDoseName;
    this.showOperator = showOperator;
    this.showLeftExpValue = showLeftExpValue;
    this.showRightExpValue = showRightExpValue;
  }

  /**
   * It validates the clinical goal expression values as per constraints provided by Varian Team
   * @param mode indicates whether validation is for dose or volume
   * @param expValue indicates the expression value
   * @param unit indicates the unit of left / right expression
   */
  validateClinicalGoal(mode, expValue, unit) {
    if (unit === '%' && (expValue < 0 || expValue > (mode === this.mode['v'] ? 100 : 200))) {
      this.containsError = true;
    } else if (unit === 'Gy' && (expValue < 0 || expValue > (mode === this.mode['d'] ? 400 : 100))) {
      this.containsError = true;
    } else if (unit === 'cc' && (expValue < 0 || expValue > (mode === this.mode['v'] ? 10000 : 1000))) {
      this.containsError = true;
    } else { this.containsError = false; }

    // emit the error event when clinical goal validation fails
    this.validateBeforeEmmitingData(true);

  }

  /**
   *  appends the numeric value added in intelisense textbox to goal
   * @param expSide indicates number is entered for left/right side expression of clinical goal
   * @param evt contains numeric value enter for expression
   */
  onNumberEnter(expSide, evt) {
    // check the expression side for which value is entered
    if (expSide === 'lft') {
      // assign the exprssion value to Goal object
      this.objGoal.lftValue = evt;
    } else {
      // assign the exprssion value to Goal object
      this.objGoal.rgtValue = evt;
    }

    // append value in goal
    this.goal = this.objGoal.doseName + this.objGoal.lftValue + this.objGoal.lftUnit + this.objGoal.operator +
      this.objGoal.rgtValue + this.objGoal.rgtUnit;

    // update the goal in parent component object
    this.validateBeforeEmmitingData(false);
  }

  /**
   * opens intellisense dropdown
   * @param e click event from which we get current cursor position in textbox
   */
  openDropDown(e) {
    // get current cursor position
    const cursorPosition = e.currentTarget.selectionStart;

    // check if cursor position is inbetween goal text
    if (cursorPosition > 0) {
      // check if cursor position is inbetween dose name
      if (cursorPosition < this.objGoal.doseName.length) {
        this.hideShowIntellisense(true, false, false, false);
      } else if (cursorPosition >= this.objGoal.doseName.length &&
        cursorPosition < (this.objGoal.doseName + this.objGoal.lftValue + this.objGoal.lftUnit).length) {
        // check if cursor position is inbetween left side expression
        this.hideShowIntellisense(false, false, true, false);
      } else if (cursorPosition >= (this.objGoal.doseName + this.objGoal.lftValue +
        this.objGoal.lftUnit).length && cursorPosition < (this.objGoal.doseName +
          this.objGoal.lftValue + this.objGoal.lftUnit + this.objGoal.operator).length) {
        // check if cursor position is inbetween comparison operator
        this.hideShowIntellisense(false, true, false, false);
      } else if (cursorPosition >= (this.objGoal.doseName + this.objGoal.lftValue +
        this.objGoal.lftUnit + this.objGoal.operator).length && cursorPosition <
        (this.objGoal.doseName + this.objGoal.lftValue + this.objGoal.lftUnit +
          this.objGoal.operator + this.objGoal.rgtValue + this.objGoal.rgtUnit).length) {
        // check if cursor position is inbetween ridht side expression
        this.hideShowIntellisense(false, false, false, true);
      } else if (cursorPosition >= (this.objGoal.doseName + this.objGoal.lftValue +
        this.objGoal.lftUnit + this.objGoal.operator + this.objGoal.rgtValue + this.objGoal.rgtUnit).length) {
        // check if cursor position is at the end of after that the hide all the intellisense
        this.hideShowIntellisense(false, false, false, false);
      }
    } else if (this.showDoseName || this.showOperator || this.showLeftExpValue || this.showRightExpValue) {
      // hide / show the dropdown based on which dropdown is open
      this.hideShowIntellisense(false, false, false, false);
    } else {
      this.showDoseName = true;
    }
    // Scroll the component in view by sliding along y axis
    this.TargetGoal.nativeElement.scrollIntoView(true);
    setTimeout(() => { this.LastRowEmitter.emit(this.goalSequence); }, 50);
  }

  /**
   * It closes the clinical goal intellisense
   */
  closeIntellisense() {
    this.hideShowIntellisense(false, false, false, false);
  }

  /**
   * It will aloow only numeric value to the textbox
   * @param event key press event in expression value text box
   */
  numberOnly(event): boolean {
    // Regular expression to allow only numeric value in textbox
    const regexp = new RegExp('^[0-9]+$');

    return regexp.test(event.key);
  }

  getConfiguredStyle(): void {
    this.dataServiceService.getConfiguredStyle().subscribe(
      data => {
        this.styleConfigured = data.configureStyle;
        if (this.styleConfigured !== 'oncology360' && this.styleConfigured !== 'varian') {
          this.styleConfigured = 'varian';
        }
      }
    );
  }

  validateBeforeEmmitingData(isErrortype: boolean) {
    if (this.objGoal.doseName === 'DMax' || this.objGoal.doseName === 'DMean' || this.objGoal.doseName === 'DMin') {
      if (this.objGoal.operator && this.objGoal.operator !== '' && this.objGoal.rgtValue &&
        this.objGoal.rgtValue !== '' && this.objGoal.rgtUnit && this.objGoal.rgtUnit !== '') {
        if (isErrortype) {
          this.GoalErrorEmitter.emit(this.containsError);
        } else {
          console.log(JSON.stringify(this.clinicalGoal));
          this.containsError = false;
          this.GoalEmitter.emit(this.goal);
        }
      } else {
        if (this.clinicalGoal.clinicalG === 'Variation') {
          this.clinicalGoal.rowData['isVariationValid'] = false;
        } else {
          this.clinicalGoal.rowData['isGoalValid'] = false;
        }
        this.containsError = true;
        this.GoalErrorEmitter.emit(true);
      }
    }
    if (this.objGoal.doseName === 'D' || this.objGoal.doseName === 'V') {
      if (this.objGoal.operator && this.objGoal.operator !== '' && this.objGoal.rgtValue &&
        this.objGoal.rgtValue !== '' && this.objGoal.rgtUnit && this.objGoal.rgtUnit !== ''
        && this.objGoal.lftValue && this.objGoal.lftValue !== '' && this.objGoal.lftUnit && this.objGoal.lftUnit !== '') {
        if (isErrortype) {
          this.GoalErrorEmitter.emit(this.containsError);
        } else {
          console.log(JSON.stringify(this.clinicalGoal));
          this.containsError = false;
          this.GoalEmitter.emit(this.goal);
        }

      } else {
        if (this.clinicalGoal.clinicalG === 'Variation') {
          this.clinicalGoal.rowData['isVariationValid'] = false;
        } else {
          this.clinicalGoal.rowData['isGoalValid'] = false;
        }
        this.containsError = true;
        this.GoalErrorEmitter.emit(true);
      }
    }
  }
}
