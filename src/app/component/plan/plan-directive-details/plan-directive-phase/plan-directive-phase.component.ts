import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/shared/helpers/app-service';
import { PhaseCaption } from 'src/app/shared/models/phase-caption';
import { PrescriptionTargetCaption } from 'src/app/shared/models/prescription-target-caption';
import { EditService } from 'src/app/component/plan/plan-directive-details/plan-directive-phase/edit-phase/edit.service';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { Target } from 'src/app/shared/models/target.model';
import { TotalPhase } from 'src/app/shared/models/total-phase';

@Component({
  selector: 'app-plan-directive-phase',
  templateUrl: './plan-directive-phase.component.html',
  styleUrls: ['./plan-directive-phase.component.scss']
})
export class PlanDirectivePhaseComponent implements OnInit {

  // Initializing variables
  phases: PhaseCaption[] = [];
  index = 0;
  fractioncount = 0;
  totalDose = 0;
  totalFractions = 0;
  totalphase: TotalPhase = new TotalPhase();
  targets: Target[] = [];
  styleConfigured: string;
  PrescriptionTargetData = new PrescriptionTargetCaption();

  constructor(private appService: AppService, private editService: EditService, private dataServiceService: DataServiceService) {
    this.getConfiguredStyle();
  }

  ngOnInit() {
    this.getAllPhases();
  }

  // Get all Pahses
  getAllPhases() {
    this.appService.currentTreatmentInstruction.subscribe(treatment => {
      if (!treatment) {
        this.phases = [];
        return;
      }
      this.phases = [];
      if (treatment.Targets.Structure !== null && treatment.Targets.Structure.length) {
        for (let i = 0; i < treatment.Phases.Phase.length; i++) {
          const ph = new PhaseCaption();
          ph.PrescriptionTargets = [];
          if (treatment.Phases.Phase[i] !== undefined && treatment.Phases.Phase[i].PrescriptionTargets !== undefined) {
            ph.targetCount = treatment.Phases.Phase[i].PrescriptionTargets.PrescriptionTarget.length;
            for (let k = 0; k < ph.targetCount; k++) {
              const prescriptionTarget = treatment.Phases.Phase[i].PrescriptionTargets.PrescriptionTarget[k];
              ph.FractionCount = Number(prescriptionTarget.FractionCount);
              const presTarget = new PrescriptionTargetCaption();
              presTarget.Dose = prescriptionTarget.TotalDose;
              presTarget.FractionDoseGy = prescriptionTarget.FractionDoseGy;
              let structureCode = '';
              for (let index = 0; index < treatment.Targets.Structure.length; index++) {
                if (prescriptionTarget.StructureId === treatment.Targets.Structure[index].Id) {
                  structureCode = treatment.Targets.Structure[index].Name;
                }
              }
              presTarget.StructureCode = structureCode;
              ph.PrescriptionTargets.push(presTarget);
            }
          }
          this.phases.push(ph);
        }

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
      } else {
        this.totalphase = new TotalPhase();
      }
    });
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

  getPrescribedTargets(target: Target, phase: PhaseCaption): any {
    this.PrescriptionTargetData = new PrescriptionTargetCaption();
    this.PrescriptionTargetData = phase.PrescriptionTargets.find(data => data.StructureCode === target.targetName);

    return this.PrescriptionTargetData !== undefined ? true : false;
  }
}

