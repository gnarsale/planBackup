import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/shared/helpers/app-service';
import { TreatmentInstruction } from 'src/app/shared/models/treatment-instruction.model';
import { Objectives } from 'src/app/shared/models/objectives.model';
import { Target } from 'src/app/shared/models/target.model';
import { TotalPhase } from 'src/app/shared/models/total-phase';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { EditService } from 'src/app/component/plan/plan-directive-details/plan-directive-phase/edit-phase/edit.service';
import { PhaseCaption } from 'src/app/shared/models/phase-caption';
import { PrescriptionTargetCaption } from 'src/app/shared/models/prescription-target-caption';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';

@Component({
  selector: 'app-edit-phase',
  templateUrl: './edit-phase.component.html',
  styleUrls: ['./edit-phase.component.scss']
})
export class EditPhaseComponent implements OnInit {

  // Initializing Variables
  treatmentInstruction: TreatmentInstruction;
  totalDose = 0;
  totalFractions = 0;
  targetName: string;
  totalphase: TotalPhase = new TotalPhase();
  targets: Target[] = [];
  phases: PhaseCaption[] = [];
  phaseLength = 0;
  phasesundo = '';
  showDialog: boolean;
  targetlength: number;
  target: Target = new Target();
  fractionSubject: Subject<any> = new Subject<any>();
  doseValidate: Array<Object>;
  disableEditSave = false;
  phasesDivHeight = 166;
  fractionError = false;
  doseError = false;
  doseAcrossPhaseError = false;
  PrescriptionTargetData = new PrescriptionTargetCaption();
  @ViewChild('phaseList') phaseList: ElementRef;
  // output variable to to amit the event for attching the click and touch events on controls in DOM
  @Output() controlTouch = new EventEmitter<boolean>();

  // Getting Input from the Parent Component to show the edit Phase dialog
  @Input()
  set ShowDialog(val: boolean) {
    this.showDialog = val;
  }

  constructor(private toastmr: ToastsManager,
    private editService: EditService, private confirmationService: ConfirmationService, private appService: AppService) { }

  ngOnInit() {
    this.handleFractionChange();
    this.getPhasesAndCalculateTotalPhase();
  }

  // Retrieving the Phases and calculating the total phase
  getPhasesAndCalculateTotalPhase(): void {
    this.appService.currentTreatmentInstruction.subscribe(treatment => {
      if (!treatment) {
        this.treatmentInstruction = treatment;
        this.totalphase = new TotalPhase();
        this.phases = [];
        return;
      }
      this.phases = [];
      if (treatment.Targets.Structure !== null && treatment.Targets.Structure.length) {
        const phaseArray = treatment.Phases.Phase;
        this.totalDose = 0;
        this.totalFractions = 0;
        if (treatment.Targets.Structure.length) {
          for (const phasearray of phaseArray) {
            const targets = phasearray.PrescriptionTargets.PrescriptionTarget;
            for (const target of targets) {
              this.totalDose = this.totalDose + Number(target.TotalDose);
              this.totalFractions = treatment.PrescribedSessions.Session.length;
            }
          }
        }
        this.targets = [];
        for (const structure of treatment.Targets.Structure) {
          let dose = 0;
          for (const phase of phaseArray) {
            const targets = phase.PrescriptionTargets.PrescriptionTarget;
            for (const target of targets) {
              if (structure.Id === target.StructureId) {
                dose += Number(target.TotalDose);
                this.totalFractions = treatment.PrescribedSessions.Session.length;
              }
            }
          }
          this.targets.push({
            targetId: structure.Id,
            targetName: structure.Name,
            targetValue: this.editService.convertUpToTwoDecimal(dose).toString(),
            isError: false
          });
        }
        this.totalphase.targets = this.targets;
        this.totalphase.totaldose = this.editService.convertUpToTwoDecimal(this.totalDose).toString();
        this.totalphase.fractioncount = this.editService.convertUpToTwoDecimal(this.totalFractions).toString();
        for (const phase of treatment.Phases.Phase) {
          const ph = new PhaseCaption();
          ph.PrescriptionTargets = [];
          if (phase !== undefined && phase.PrescriptionTargets !== undefined) {
            ph.targetCount = phase.PrescriptionTargets.PrescriptionTarget.length;
            ph.PhaseIndex = phase.Id;
            let sessionsCount = 0;
            for (const prescibedSession of treatment.PrescribedSessions.Session) {
              if (prescibedSession.ReferencedPhase === phase.Id) {
                sessionsCount = sessionsCount + 1;
              }
            }
            ph.PrescribedSessionsCount = sessionsCount.toString();
            ph.FractionCount = sessionsCount;
            for (let k = 0; k < ph.targetCount; k++) {
              const prescriptionTarget = phase.PrescriptionTargets.PrescriptionTarget[k];
              const presTarget = new PrescriptionTargetCaption();
              presTarget.Dose = prescriptionTarget.TotalDose;
              if (prescriptionTarget.Objectives) {
                presTarget.Objectives = prescriptionTarget.Objectives.Objective;
              }
              presTarget.StructureId = prescriptionTarget.StructureId;
              presTarget.FractionDoseGy = prescriptionTarget.FractionDoseGy;
              this.targetlength = treatment.Targets.Structure.length;
              let structureCode = '';
              for (const targets of treatment.Targets.Structure) {
                if (targets.Id === undefined) {
                  if (prescriptionTarget.StructureId === targets.Id) {
                    structureCode = targets.Name;
                  }
                } else if (prescriptionTarget.StructureId === targets.Id) {
                  structureCode = targets.Name;
                }
              }
              presTarget.StructureCode = structureCode;
              ph.PrescriptionTargets.push(presTarget);
            }
          }
          this.phases.push(ph);
        }
        this.phaseLength = this.phases.length;
        this.phasesundo = JSON.stringify(this.phases);
      } else {
        this.totalphase = new TotalPhase();
      }
      this.validateEditPhases();
    });
  }

  /**
   * If Revert back changes if user cancel the phase editing window
   */
  cancelPhaseEditing(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel edited phases?',
      accept: () => {
        this.doseError = false;
        this.fractionError = false;
        this.doseAcrossPhaseError = false;
        this.showDialog = false;
        this.doseValidate = undefined;
        this.disableEditSave = false;
        if (this.phases.length === 0) {
          return;
        }
        for (const phase in this.phases) {
          if (Number(phase) === this.phaseLength) {
            this.phases.splice(Number(phase), 1);
          }

        }
        this.phases = JSON.parse(this.phasesundo);
        this.calculateTotalPhase();
      }
    });
  }

  /**
   * Get the Number Range to display in Session Section for Phases in phase edit window
   * @param phanseIndex phase ID
   * @param count Session count
   */
  getNumberArray(phanseIndex: number, count: number): any {
    phanseIndex = this.getPreviousPhaseSessionsCount(Number(phanseIndex));
    const x = [];
    let i = 1;
    count = Number(count);
    while (count >= i) {
      x.push(phanseIndex++);
      i++;
    }
    return x;
  }

  /**
   * Get the Previous Session count for previous phase Sessions
   * @param phanseIndex for which phase we want to get Previous Session count
   */
  getPreviousPhaseSessionsCount(phanseIndex: number): number {
    let previousSessionCount = 1;
    for (let i = 0; i < phanseIndex; i++) {
      previousSessionCount = previousSessionCount + Number(this.phases[i].PrescribedSessionsCount);
    }
    return previousSessionCount;
  }

  /**
   *If User adds new Phase
   */
  addNewPhase(): void {
    // Emit event to attach click, touch events to controls
    this.controlTouch.emit(true);
    // maximum 10 phases can be created
    if (this.phases.length + 1 > 10) {
      return;
    }
    const phase = new PhaseCaption();
    const prisTargets: PrescriptionTargetCaption[] = [];
    const phaselength = this.phases.length + 1;
    const targetCount = this.targetlength;
    phase.PhaseIndex = phaselength.toString();
    phase.targetCount = targetCount;
    phase.PrescribedSessionsCount = '1';
    for (let i = 0; i < this.targetlength; i++) {
      const phasetarget = new PrescriptionTargetCaption();
      const objectives = new Objectives();
      objectives.Objective = [];
      phasetarget.Objectives = objectives.Objective;
      phasetarget.StructureCode = this.totalphase.targets[i].targetName;
      phasetarget.StructureId = this.totalphase.targets[i].targetId;
      prisTargets.push(phasetarget);
    }
    phase.PrescriptionTargets = prisTargets;
    this.phases.push(JSON.parse(JSON.stringify(phase)));
    for (const k in this.phases) {
      if (Number(k) === this.phases.length - 1) {
        phase.PrescribedSessionsCount = '1';
        for (const target of this.phases[k].PrescriptionTargets) {
          target.FractionDoseGy = '0.01';
          target.Dose = (Number(phase.PrescribedSessionsCount) * Number(target.FractionDoseGy)).toFixed(2).toString();
        }
      }
    }
    this.validateEditPhases();
    setTimeout(() => {
      this.phaseList.nativeElement.scrollLeft = this.phaseList.nativeElement.scrollWidth + 293;
    }, 25);
    this.calculateTotalPhase();
  }

  /**
    *  Edited Phases get Saved
    */
  savingPhaseEdit(): void {
    this.showDialog = false;
    this.appService.savePhases(this.phases);
  }

  /**
   * Phase get Deleted
   * @param phasec phase which we want to delete
   */
  onPhaseDelete(phasec: PhaseCaption): void {
    // Emit event to attach click, touch events to controls
    if (this.phases.length - 1 < 1) {
      this.toastmr.error('You cannot delete phase. Minimum one phase should be there.', 'Error!');
      return;
    }
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete Phase' + phasec.PhaseIndex + ' ?',
      accept: () => {
        this.controlTouch.emit(true);


        for (const index in this.phases) {
          if (this.phases[Number(index)].PhaseIndex === phasec.PhaseIndex) {
            this.phases.splice(Number(index), 1);
          }
        }
        this.phases.forEach((phase, index) => {
          phase.PhaseIndex = (index + 1).toString();
        });
        this.validateEditPhases();
        const fractionErrorCount = this.doseValidate.filter((element) => element['isFractionInValid'] === true);
        const doseErrorCount = this.doseValidate.filter((element) => element['isError'] === true);

        this.fractionError = fractionErrorCount.length > 0 ? true : false;
        this.doseError = doseErrorCount.length > 0 ? true : false;

        this.calculateTotalPhase();
      }
    });

  }

  /**
   *  Fraction count get saved for particular phase
   * @param phasec phase for which we want to change Fraction count
   * @param FractionCount  Fraction count to be changed
   */
  phaseFractionCountChange(phasec: PhaseCaption, FractionCount: number): void {
    if (FractionCount !== null) {
      this.fractionSubject.next({ phasec, FractionCount });
      this.validateEditPhases();
      // this.calculateTotalPhase();
    }

    // Checking Error in Number of Fractions
    for (let i = 0; i < this.phases.length; i++) {
      if (this.doseValidate[i]['isFractionInValid']) {
        this.fractionError = true;
        break;
      } else {
        this.fractionError = false;
      }
    }
    let k = 1;
    // Checking error in Dose
    for (let i = 0; i < this.phases.length; i++) {

      for (const element of this.doseValidate[i]['prescriptionTargets']) {
        if (element['isError']) {
          this.doseError = true;
          k = 0;
          break;
        } else {
          this.doseError = false;
        }
      }
      if (k === 0) {
        break;
      }
    }
  }

  /**
   * Fraction Dose get saved for particular phase
   * @param phasec phase for which we want to change Fraction dose
   * @param FractionCount Fraction count
   **/
  phaseFractionDoseChange(phasec: PhaseCaption, FractionCount, StructureId: string): void {
    if (FractionCount.target.value >= 0 && phasec.FractionCount !== 0 && this.ValidateCharLength(FractionCount)) {
      for (const index in this.phases) {
        if (this.phases[Number(index)].PhaseIndex === phasec.PhaseIndex) {
          const phase = this.phases[Number(index)];
          phase.PrescriptionTargets.forEach((phaseTarget, k1) => {
            phaseTarget.FractionDoseGy = phasec.PrescriptionTargets[k1].FractionDoseGy;
            if (StructureId === phaseTarget.StructureId) {
              phaseTarget.FractionDoseGy = FractionCount.target.value.toString();
            }
            phaseTarget.Dose =
              (Number(phasec.PrescriptionTargets[k1].FractionDoseGy)
                * Number(phasec.FractionCount)).toFixed(2).toString();

            // if (Number(phaseTarget.Dose) > 125) {
            //   phaseTarget.Dose = '0';
            // }
            phaseTarget.StructureCode = phasec.PrescriptionTargets[k1].StructureCode;
          });
        }
      }
      // call function to validate dosees entered
      this.validateEditPhases();
      this.calculateTotalPhase();
      let k = 1;
      for (let i = 0; i < this.phases.length; i++) {
        for (const element of this.doseValidate[i]['prescriptionTargets']) {
          if (element['isError']) {
            this.doseError = true;
            k = 0;
            break;
          } else {
            this.doseError = false;
          }
        }
        if (k === 0) {
          break;
        }
      }

    }
  }

  /**
   * Function to validate the dosees for each target and for each phase
   * If dose is invalid the disables the Save button
   */
  validateEditPhases(): void {
    // reset doseValidate array
    this.doseValidate = [];
    // indicates error in dose values
    let containsError = false;
    for (const [i, phase] of this.phases.entries()) {
      const objDoseValidate: any = {};
      const tempPrescriptionTargets: Object[] = [];
      // contains sum of doses in each phase for all PrescriptionTargets
      let tempDoseInPhase = 0;
      // Fraction count validation in each phase
      if (phase.FractionCount > 50 || phase.FractionCount < 1) {
        containsError = true;
        objDoseValidate['isFractionInValid'] = true;
      } else {
        objDoseValidate['isFractionInValid'] = false;
      }
      for (const [j, phaseTarget] of phase.PrescriptionTargets.entries()) {
        const objTargetValidate: object = {};
        objDoseValidate['phaseIndex'] = phase.PhaseIndex;
        objTargetValidate['structureCode'] = phaseTarget.StructureCode;
        tempDoseInPhase += Number(phaseTarget.FractionDoseGy) * Number(phase.FractionCount);
        if (tempDoseInPhase > 6250 || tempDoseInPhase < 0.01 ||
          (Number(phaseTarget.FractionDoseGy) * Number(phase.FractionCount) > 125)
          || (Number(phaseTarget.FractionDoseGy) * Number(phase.FractionCount) < 0.01)) {
          // set the error flag to true which will turn the textbox border to red
          objTargetValidate['isError'] = true;
          containsError = true;
        } else {
          // set the error flag to false which will turn the textbox border to black
          objTargetValidate['isError'] = false;
        }

        // const tempDoseAcrossPhase = (i !== 0) ?
        //   this.doseValidate[i - 1]['prescriptionTargets'].filter(x => x.structureCode === phaseTarget.StructureId).doseAcrossPhase : 0;
        // objTargetValidate['doseAcrossPhase'] = tempDoseAcrossPhase + (Number(phaseTarget.FractionDoseGy) * Number(phase.FractionCount));
        // objTargetValidate['doseAcrossPhaseError'] = false;

        // if (objTargetValidate['doseAcrossPhase'] > 125) {
        //   // objTargetValidate['isError'] = true;
        //   containsError = true;
        //   objTargetValidate['doseAcrossPhaseError'] = true;
        //   this.doseAcrossPhaseError = true;
        // }

        tempPrescriptionTargets.push(objTargetValidate);
      }
      objDoseValidate['prescriptionTargets'] = tempPrescriptionTargets;
      this.doseValidate.push(objDoseValidate);
    }
    this.disableEditSave = containsError;
    // logic for validation of doses ends
  }

  /**
   * Claculate the Total dose for Targets in all Phases
   */
  calculateTotalPhase(): void {
    this.targets = [];
    this.totalphase.totaldose = '';
    let totaldose = 0;
    let totalfraction = 0;
    // indicates error in dose values across phases
    let containsError = false;
    // indicates error in dose values across phases
    this.doseAcrossPhaseError = false;
    this.totalphase.targets.forEach((target, i) => {
      let targetDose = 0;
      for (const phase of this.phases) {
        for (const phaseTarget of phase.PrescriptionTargets) {
          if (target.targetName === phaseTarget.StructureCode && Number(phaseTarget.Dose) !== 0) {
            targetDose += Number(phaseTarget.Dose);
          }
        }
      }

      target.targetValue = this.editService.convertUpToTwoDecimal(targetDose).toString();

      if (targetDose > 125) {
        target.isError = true;
        this.doseAcrossPhaseError = true;
        containsError = true;
      } else {
        target.isError = false;
      }

      totaldose += Number(target.targetValue);
    });
    for (const phase of this.phases) {
      totalfraction = Number(totalfraction) + Number(phase.FractionCount);
    }

    if (!this.disableEditSave) {
      this.disableEditSave = containsError;
    }

    this.totalphase.totaldose = this.editService.convertUpToTwoDecimal(totaldose).toString();
    this.totalphase.fractioncount = this.editService.convertUpToTwoDecimal(totalfraction).toString();
  }

  /**
   *  Update of Number of Fraction Change
   */
  handleFractionChange(): void {
    this.fractionSubject
      .debounceTime(50)
      .distinctUntilChanged()
      .subscribe((value) => {
        if (value.FractionCount >= 0) {
          for (const i of this.totalphase.targets) {
            for (const phase of this.phases) {
              if (phase.PhaseIndex === value.phasec.PhaseIndex) {
                phase.FractionCount = value.phasec.FractionCount;
                phase.PrescriptionTargets.forEach((phaseTarget, k) => {
                  phaseTarget.Dose = (
                    Number(value.phasec.FractionCount) *
                    Number(value.phasec.PrescriptionTargets[k].FractionDoseGy)).toFixed(2).toString();
                  // if (Number(phaseTarget.Dose) > 125) {
                  //   phaseTarget.Dose = '0';
                  // }
                  phase.PrescribedSessionsCount = value.phasec.FractionCount !== null ? value.phasec.FractionCount.toString() : 0;
                });

              }
            }
          }
        }
        this.calculateTotalPhase();
      });
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
  getPrescribedTargets(target: Target, phase: PhaseCaption): any {
    this.PrescriptionTargetData = new PrescriptionTargetCaption();
    this.PrescriptionTargetData = phase.PrescriptionTargets.find(data => data.StructureId === target.targetId);

    return this.PrescriptionTargetData !== undefined ? true : false;
  }

  ValidateCharLength(val) {
    if (val.target.value.includes('.')) {
      if (val.target.value.length > 7) {
        val.target.value = val.target.value.substring(0, 7);
      }
    } else if (val.target.value.length > 3) {
      val.target.value = val.target.value.substring(0, 3);
    }
    return true;
  }
}




