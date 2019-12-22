import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { StructureModel } from 'src/app/shared/models/structure-model.model';
import { PhaseTargets } from 'src/app/shared/models/phase-targets.model';
import { PlanDirectiveTemplateDetailsService } from 'src/app/shared/services/plan-directive-template-details.service';
import { PlanDirectiveTemplateService } from 'src/app/shared/services/plan-directive-template.service';
import { AppService } from 'src/app/shared/helpers/app-service';
import { TargetStructure } from 'src/app/shared/models/target-structure.model';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Targets } from 'src/app/shared/models/targets.model';
import { OARObjectives } from 'src/app/shared/models/oarobjectives.model';
import { OARs } from 'src/app/shared/models/oars.model';
import { TreatmentInstruction } from 'src/app/shared/models/treatment-instruction.model';
import { Structure } from 'src/app/shared/models/structure.model';
import { Objective } from 'src/app/shared/models/objective.model';
import { Objectives } from 'src/app/shared/models/objectives.model';
import { Session } from 'src/app/shared/models/session.model';
import { PrescriptionTarget } from 'src/app/shared/models/prescription-target.model';
import { PrescriptionTargets } from 'src/app/shared/models/prescription-targets.model';
import { PrescribedSessions } from 'src/app/shared/models/prescribed-sessions.model';
import { Notes } from 'src/app/shared/models/notes.model';
import { Note } from 'src/app/shared/models/note.model';
import { Phase } from 'src/app/shared/models/phase.model';
import { Phases } from 'src/app/shared/models/phases.model';
declare let $: any;

@Component({
  selector: 'app-plan-directive-without-template',
  templateUrl: './plan-directive-without-template.component.html',
  styleUrls: ['./plan-directive-without-template.component.css']
})
export class PlanDirectiveWithoutTemplateComponent implements OnInit {
  // Initializing neccessary variables
  page = 0;
  StructureCollection: StructureModel[] = [];
  selectedStructureCollection: StructureModel[] = [];
  selectedStructure: StructureModel;
  isStrucutreSelected = false;
  phaseTargets: Array<PhaseTargets> = [];
  definePhaseForm: FormGroup;
  numberofFractionError = true;
  phases = [1, 2, 3, 4];
  @Input() selectedregionId: number;
  @Input() selectedSiteId: number;
  siteName = '';
  @Input() orderId: string;
  targetFilterValue: string;

  @ViewChild('closeCustomTemplateCreate') closeCustomTemplateCreate: ElementRef;
  treatmentInstruction = new TreatmentInstruction();

  constructor(private planDirectiveTemplateDetailsService: PlanDirectiveTemplateDetailsService, public appService: AppService,
    private planTemplateService: PlanDirectiveTemplateService, private fb: FormBuilder, private router: Router, ) { }

  ngOnInit() {
    this.definePhaseForm = this.fb.group({
      noOfFractions: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{2}$'),
      Validators.max(50), Validators.min(1)])],
      totalDose: [0, Validators.compose([Validators.required, Validators.pattern('^[0-9]{2}$'),
      Validators.max(125), Validators.min(0.01)])]
    });

    this.openModal();
  }

  undoSelectedStrucutre() {
    if (this.isStrucutreSelected === true) {
      this.isStrucutreSelected = false;
    }
  }

  openModal() {
    this.clearDataOnLoad();
    // Fetch data from backend
    this.planDirectiveTemplateDetailsService.GetStructureCollection().subscribe(
      data => {
        // assign data to data model
        this.StructureCollection = data as StructureModel[];
        for (let index = 0; index < this.StructureCollection.length; index++) {
          const structure = this.StructureCollection[index];
          structure.Name = 'ABCD';
        }

       // $('#modal').modal('show');
      }
    );
  }

  selectStrucutre(structure: StructureModel) {
    this.isStrucutreSelected = true;
    this.selectedStructure = structure;
  }

  gotoNext() {
    this.page++;
  }

  gotoPrev() {
    if (this.page === 1) {
      this.phaseTargets = [];
      this.page--;
    }
  }

  clearDataOnLoad() {
    this.page = 0;
    this.isStrucutreSelected = false;
    this.selectedStructureCollection = [];
    this.selectedStructure = new StructureModel();
    this.phaseTargets = [];
  }

  addSelectedTarget() {
    this.selectedStructureCollection.push(JSON.parse(JSON.stringify(this.selectedStructure)));
  }

  deleteStructureTarget(structure: StructureModel) {
    if (this.selectedStructureCollection) {
      for (let index = 0; index < this.selectedStructureCollection.length; index++) {
        const structureTarget = this.selectedStructureCollection[index];
        if (structureTarget.Code === structure.Code) {
          this.selectedStructureCollection.splice(index, 1);
          break;
        }
      }
    }
  }

  getSelectedPhaseNumber(phaseId: number) {
    this.phaseTargets = [];
    for (let index = 0; index < phaseId; index++) {
      const phaseTarget = new PhaseTargets();
      phaseTarget.phaseId = index + 1;
      const targets: Array<TargetStructure> = [];
      for (let i = 0; i < this.selectedStructureCollection.length; i++) {
        let target: TargetStructure;
        target = new TargetStructure();
        const structure = this.selectedStructureCollection[i];
        target.targetId = 'Target' + (i + 1);
        target.targetName = structure.Name;
        targets.push(target);
      }
      phaseTarget.targets = targets;
      this.phaseTargets.push(phaseTarget);
    }
  }

  updateStrucutreName(structure: StructureModel, structureName: string, position: number) {
    structure.Name = structureName;
  }

  enableDoseFraction(target: TargetStructure) {
    if (target.isHidden === false) {
      target.isHidden = true;
    } else {
      target.doseFraction = 0;
      target.totalDose = 0;
      target.isHidden = false;
    }
  }

  updateNumberOfFraction(phaseTarget: PhaseTargets, fractionCount: number) {
    fractionCount = Number(fractionCount);
    if (fractionCount <= 50 && fractionCount >= 1) {
      phaseTarget.fractionCount = fractionCount;
      // calculate Dose / Fraction for each added target in phase
      for (const li of phaseTarget.targets) {
        if (!li.isHidden) {
          li.doseFraction = li.totalDose / fractionCount;
        }
      }

      this.numberofFractionError = false;
    } else {
      this.numberofFractionError = true;

      // make Dose / Fraction 0 in case of invalid No. of fraction entry
      for (const li of phaseTarget.targets) {
        if (!li.isHidden) {
          li.doseFraction = 0;
        }
      }
    }
  }

  updateTotalDose(target: TargetStructure, phaseTarget: PhaseTargets, totalDose: number) {
    totalDose = Number(totalDose);
    if (totalDose > 0) {
      if (totalDose <= 125 && totalDose >= 1) {
        target.totalDose = Number(totalDose);
        if (phaseTarget.fractionCount !== 0) {
          target.doseFraction = target.totalDose / phaseTarget.fractionCount;
        }
      }
    } else {
      target.doseFraction = 0;
    }
  }

  createTemplate(): void {

    const targets = new Targets();
    const oars = new OARs();
    const structures: Structure[] = [];
    targets.Structure = structures;

    // fetch OARs from json file and append it to Treatment Instruction object
    this.planTemplateService.getOARs().subscribe(data => {
      oars.Structure = data['Structure'];
      this.treatmentInstruction.OARs = oars;

      // adding Target[] to Treatment Instruction
      for (let i = 0; i < this.selectedStructureCollection.length; i++) {
        const structureTarget = this.selectedStructureCollection[i];
        const target = new Structure();
        target.Code = structureTarget.Code;
        target.Meaning = structureTarget.Meaning;
        target.Id = 'Target' + (i + 1);
        target.Color = '';
        target.Name = structureTarget.Name;
        target.Schema = '99VMS_STRUCTCODE';
        target.SchemaVersion = '1';
        structures.push(target);
      }

      // adding Treatment Instruction Details
      this.treatmentInstruction.Targets = targets;
      this.treatmentInstruction.Identifier = '6a10990d-6696-480d-b9f2-3024add297c1';
      this.treatmentInstruction.DisplayName = this.siteName;
      this.treatmentInstruction.AnatomicalRegion = this.selectedregionId ? this.getRegionName(this.selectedregionId) : 'No Template Region';
      this.treatmentInstruction.AnatomicalSite = this.siteName;

      const phases = new Phases();
      const phase: Array<Phase> = [];

      // adding Phase[] to Treatment Instruction
      for (const li of this.phaseTargets) {
        const phaseTgt = new Phase();
        const prescriptionTargets = new PrescriptionTargets();
        const prescriptionTgts: Array<PrescriptionTarget> = [];
        prescriptionTargets.PrescriptionTarget = prescriptionTgts;
        phaseTgt.PrescriptionTargets = prescriptionTargets;
        const objectives = new Objectives();
        objectives.Objective = [];
        phaseTgt.Id = li.phaseId.toString();
        phaseTgt.PhaseId = li.phaseId.toString();

        for (const tgt of li.targets.filter(item => item.isHidden === false)) {
          // Adding prescription targets in each phase
          const prescriptionTgt = new PrescriptionTarget();
          prescriptionTgt.StructureId = tgt.targetId;
          prescriptionTgt.FractionCount = li.fractionCount.toString();
          prescriptionTgt.Objectives = objectives;
          prescriptionTgt.FractionDoseGy = tgt.doseFraction.toString();
          prescriptionTgt.TotalDose = tgt.totalDose.toString();
          prescriptionTgts.push(prescriptionTgt);
        }

        phaseTgt.PrescriptionTargets.PrescriptionTarget = prescriptionTgts;
        phase.push(JSON.parse(JSON.stringify(phaseTgt)));
        phases.Phase = phase;
      }
      this.treatmentInstruction.Phases = phases;

      // adding Note[] to Treatment Instruction
      const notes = new Notes();
      const note: Array<Note> = [];
      notes.Note = note;
      this.treatmentInstruction.Notes = notes;

      // adding OARObjectives to Treatment Instruction
      const oarObjs = new OARObjectives();
      const Objtv: Array<Objective> = [];
      oarObjs.Objective = Objtv;
      this.treatmentInstruction.OARObjectives = oarObjs;

      // adding PrescribedSessions to Treatment Instruction
      const prescSessions = new PrescribedSessions();
      const sessions: Array<Session> = [];
      prescSessions.Session = [];
      let j = 1;
      for (let index = 0; index < this.phaseTargets.length; index++) {
        const phaseTarget = this.phaseTargets[index];
        for (let i = 0; i < phaseTarget.fractionCount; i++) {
          const session = new Session();
          session.Id = j.toString();
          session.Imaging = '';
          session.ReferencedPhase = phaseTarget.phaseId.toString();
          j++;
          sessions.push(session);
        }
      }

      prescSessions.Session = sessions;
      this.treatmentInstruction.PrescribedSessions = prescSessions;

      // assign treatment instruction object to service object
      this.appService.myGlobalVar = this.treatmentInstruction;
      this.appService.changeTreatment(this.treatmentInstruction);

      // close add Empty Template creation pop up
      this.closeCustomTemplateCreate.nativeElement.click();

      // navigate to plan directive details page
      this.router.navigate(['planning-directive-details', this.orderId, '0', this.selectedSiteId]);
    }, err => {
    });
  }

  getRegionName(regionId: number): string {
    // find from list of regions stored at service level using region id
    return this.appService.objPlanDirectiveDetails.regions.find(
      li => li.PlanDirectiveRegionID === Number(regionId)).PlanDirectiveRegionName;
  }

}
