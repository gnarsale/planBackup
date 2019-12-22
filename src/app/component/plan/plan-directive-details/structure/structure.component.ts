import { Component, OnInit, EventEmitter, ViewChild, ElementRef, Output, Input } from '@angular/core';
import { AppService } from 'src/app/shared/helpers/app-service';
import { ConfirmationService } from 'primeng/api';
import { StructureInfo } from 'src/app/component/plan/plan-directive-details/structure/models/structure-info';
import { ClinicalGoals } from 'src/app/shared/models/clinical-goal.model';
import { GoalPriority } from 'src/app/component/plan/plan-directive-details/structure/models/goal-priority.model';
import { TargetPhase } from 'src/app/component/plan/plan-directive-details/structure/models/phase.model';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { ToastsManager } from 'ng6-toastr';
@Component({
  selector: 'app-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.scss']
})
export class StructureComponent implements OnInit {
  down = true;
  up = false;
  displayDialog: boolean;
  oarClinicalGoals: ClinicalGoals[] = [];
  structure: StructureInfo;
  targetClinicalGoals: ClinicalGoals[] = [];
  targetDisplayDialog: boolean;
  goalPriority: GoalPriority[];
  phaseAll: TargetPhase;
  name: string;
  expand = false;
  disableEditType: Boolean = false;
  variations = '';
  type = '';
  structureGoalLength = 0;
  addgoalsIcon = false;
  styleConfigured: string;
  @ViewChild('oarClinicalGoalList') oarClinicalGoalList: ElementRef;
  @ViewChild('clinicalGoalList') clinicalGoalList: ElementRef;
  @Input()
  pattern: string | RegExp;
  @Input()
  set Structure(structureInfo) {
    if (structureInfo) {
      // sorting of Objectives based on priority in each phase
      for (let phase of structureInfo.Phases) {
        if (phase.Objectives) {
          phase = phase.Objectives.sort((a, b) => a.Priority < b.Priority ? -1 : a.Priority > b.Priority ? 1 : 0);
        }

      }
      this.structure = structureInfo;
      if (this.appService.editclicked && this.appService.editclicked !== []) {
        this.up = true;
        this.down = false;
        this.expand = true;
      }
    }
  }
  @Input()
  set typeD(type) {
    if (type) {
      this.type = type;
    }
  }
  @Input()
  set PhaseD(phase) {
    if (phase) {
      this.phaseAll = phase;
    }
  }
  // output variable to to amit the event for attching the click and touch events on controls in DOM
  @Output() controlTouch = new EventEmitter<boolean>();

  constructor(private toastmr: ToastsManager, private confirmationService: ConfirmationService, private appService: AppService,
    private dataServiceService: DataServiceService) {
    this.getConfiguredStyle();
  }


  ngOnInit() {
    this.loadData();
  }

  // Initialize the priority and calculate strucutre goal length and show the cards
  loadData() {
    if (this.structure && this.structure.Phases && this.structure.Phases.length !== 0) {
      this.structureGoalLength = 0;
      for (const phase of this.structure.Phases) {
        this.structureGoalLength = this.structureGoalLength + phase.Objectives.length;
      }
      this.down = false;
      this.up = true;
      this.expand = true;
    } else {
      this.addgoalsIcon = true;
    }


    this.dataServiceService.getGoalPriority().subscribe(
      data => {
        this.goalPriority = data['Goal-Priority'];
      }
    );
    this.name = this.structure.Name;
  }

  Delete() {
    // Emit event to attach click, touch events to controls
    this.controlTouch.emit(true);
    if (this.structure.type === 'TargetStructure') {
      if (this.appService.myGlobalVar.Targets.Structure.length === 1) {
        this.toastmr.clearAllToasts();
        this.toastmr.error('You cannot delete target. Minimum one target struture is to be there', 'Error!');
        return;
      }

      this.confirmationService.confirm({
        message: 'Are you sure you want to delete target  ' + this.structure.Name + '?',
        accept: () => {
          this.appService.deleteTargetStructureById(this.structure.StructureId);
        }
      });
    }
    if (this.structure.type === 'OAR') {
      // if (this.appService.myGlobalVar.OARs.Structure.length === 1) {
      //   this.toastmr.error('You cannot delete organ. Minimum one organ is to be there', 'Error!');
      //   return;
      // }
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete OAR ' + this.structure.Name + '?',
        accept: () => {
          this.appService.deleteOARById(this.structure.StructureId);
        }
      });
    }
  }

  Edit() {
    // Emit event to attach click, touch events to controls
    this.controlTouch.emit(false);

    if (this.structure.type === 'TargetStructure') {
      this.targetDisplayDialog = true;
      this.targetClinicalGoals = [];
      this.createGoals(this.targetClinicalGoals);
    }
    if (this.structure.type === 'OAR') {
      this.displayDialog = true;
      this.oarClinicalGoals = [];
      this.createGoals(this.oarClinicalGoals);
    }
  }

  createGoals(targetClinicalGoals: ClinicalGoals[]) {
    for (const structurePhase of this.structure.Phases) {
      if (structurePhase.Objectives !== undefined) {
        for (const objective of structurePhase.Objectives) {
          const goals: ClinicalGoals = new ClinicalGoals();
          goals.Phase = structurePhase.phaseId;
          goals.Goal = objective.ClinicalGoal.DoseLeft + objective.ClinicalGoal.DoseRight;
          goals.Priority = objective.Priority;
          goals.Variation = objective.AcceptableVariation.DoseLeft + objective.AcceptableVariation.DoseRight;
          targetClinicalGoals.push(goals);
        }
      }
    }
  }

  addGoal(type: string) {
    this.disableEditType = true;
    const goals: ClinicalGoals = new ClinicalGoals();
    goals.Goal = '';
    goals.Priority = '1';
    goals.Variation = '';
    goals.Phase = '1';
    goals.isGoalValid = false;
    goals.isVariationValid = false;
    if (type === 'OAR') {
      // maximum of 100 clinical goals can be added
      if (this.oarClinicalGoals.length < 100) {
        this.oarClinicalGoals.push(goals);
      }
    } else if (type === 'Target') {
      // maximum of 100 clinical goals can be added
      if (this.targetClinicalGoals.length < 100) {
        this.targetClinicalGoals.push(goals);
      }
    }
  }

  save(objGoal: ClinicalGoals[], StructureId: string, type: string) {
    this.appService.editclicked = [];
    this.appService.editclicked[this.structure.StructureId] = true;

    if (type === 'OAR') {
      this.appService.AddEditOAR(objGoal, StructureId, this.name, '', 'Edit');
    } else if (type === 'Target') {
      this.appService.AddEditTarget(objGoal, StructureId, this.name, '', '', 'Edit');
    }

    this.down = false;
    this.up = true;
  }
  deleteGoal(goal: ClinicalGoals, type: string) {
    // Emit event to attach click, touch events to controls
    this.controlTouch.emit(true);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete goal' + (goal.Goal !== '' ? ' : ' : '') + goal.Goal + '?',
      accept: () => {
        if (type === 'OAR') {
          const index = this.oarClinicalGoals.indexOf(goal);
          this.oarClinicalGoals.splice(index, 1);
        } else if (type === 'Target') {
          const index = this.targetClinicalGoals.indexOf(goal);
          this.targetClinicalGoals.splice(index, 1);
        }
        this.goalsValid(type);
      }
    });
  }

  close(type: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want cancel?',
      accept: () => {
        if (type === 'OAR') {
          this.displayDialog = false;
        } else if (type === 'Target') {
          this.targetDisplayDialog = false;
        }
        this.disableEditType = false;
      }
    });
  }

  onPriorityChange(priorityValue: string, goal: ClinicalGoals, type: string) {
    if (type === 'OAR') {
      const index = this.oarClinicalGoals.findIndex(li => li.Goal === goal.Goal && li.Phase === goal.Phase &&
        li.Priority === goal.Priority && li.Variation === goal.Variation);
      this.oarClinicalGoals[index].Priority = priorityValue;
    } else if (type === 'Target') {
      const index = this.targetClinicalGoals.findIndex(li => li.Goal === goal.Goal && li.Phase === goal.Phase &&
        li.Priority === goal.Priority && li.Variation === goal.Variation);
      this.targetClinicalGoals[index].Priority = priorityValue;
    }
  }

  onPhaseChange(phaseValue: string, goal: ClinicalGoals, type: string) {
    if (type === 'OAR') {
      const index = this.oarClinicalGoals.findIndex(li => li.Goal === goal.Goal && li.Phase === goal.Phase &&
        li.Priority === goal.Priority && li.Variation === goal.Variation);
      this.oarClinicalGoals[index].Phase = phaseValue;
    } else if (type === 'Target') {
      const index = this.targetClinicalGoals.findIndex(li => li.Goal === goal.Goal && li.Phase === goal.Phase &&
        li.Priority === goal.Priority && li.Variation === goal.Variation);
      this.targetClinicalGoals[index].Phase = phaseValue;
    }
  }

  updateGoal(rowData, goalStr, type) {
    rowData['Goal'] = goalStr;
    rowData['isGoalValid'] = true;
    if (goalStr.length === 0 && this.variations.length === 0) {
      this.disableEditType = true;
    } else {
      this.goalsValid(type);
    }
  }

  updateVariation(rowData, variationStr, type) {
    rowData['Variation'] = variationStr;
    rowData['isVariationValid'] = true;
    if (variationStr.length === 0) {
      this.disableEditType = true;
    } else {
      this.goalsValid(type);
    }
  }

  ValidateClinicalGoal(evt) {
    this.disableEditType = evt;
  }

  checkCollapse() {
    if (this.down === true) {
      this.down = false;
      this.up = true;
    } else {
      this.down = true;
      this.up = false;

    }
  }

  goalsValid(type: string): void {
    let allgoals = 0;
    if (type === 'OAR') {
      for (const goal of this.oarClinicalGoals) {
        if (goal.Goal === '' || goal.Variation === '') {
          allgoals = allgoals + 1;
        }
      }
      if (allgoals !== 0 && allgoals <= this.oarClinicalGoals.length) {
        this.disableEditType = true;
      } else {
        if (this.structure.Name === undefined || this.name === '') {
          this.disableEditType = true;
        } else {
          this.disableEditType = false;
        }
      }
    } else if (type === 'Target') {
      for (const goal of this.targetClinicalGoals) {
        if (goal.isGoalValid === false || goal.isVariationValid === false) {
          allgoals = allgoals + 1;
        }
      }
      if (allgoals !== 0 && allgoals <= this.targetClinicalGoals.length) {
        this.disableEditType = true;
      } else {
        if (this.structure.Name === undefined || this.name === '') {
          this.disableEditType = true;
        } else {
          this.disableEditType = false;
        }
      }
    }
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

  OmitSpecialChar(event) {
    let k;
    k = event.charCode; // k = event.keyCode; (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || (k >= 48 && k <= 57));
  }

  ScrollOARInView(rowIndex) {
    if (this.oarClinicalGoals.length === (rowIndex + 1)) {
      this.oarClinicalGoalList.nativeElement.scrollTop = this.oarClinicalGoalList.nativeElement.scrollHeight;
    }
  }

  ScrollInView(rowIndex) {
    if (this.targetClinicalGoals.length === (rowIndex + 1)) {
      this.clinicalGoalList.nativeElement.scrollTop = this.clinicalGoalList.nativeElement.scrollHeight;
    }
  }
}
