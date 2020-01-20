import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TreatmentInstruction } from 'src/app/shared/models/treatment-instruction.model';
import { Structure } from 'src/app/shared/models/structure.model';
import { Objective } from 'src/app/shared/models/objective.model';
import { Session } from 'src/app/shared/models/session.model';
import { PrescriptionTarget } from 'src/app/shared/models/prescription-target.model';
import { Objectives } from 'src/app/shared/models/objectives.model';
import { Phase } from 'src/app/shared/models/phase.model';
import { Phases } from 'src/app/shared/models/phases.model';
import { PrescriptionTargets } from 'src/app/shared/models/prescription-targets.model';
import { PrescribedSessions } from 'src/app/shared/models/prescribed-sessions.model';
import { AcceptableVariation } from 'src/app/shared/models/acceptable-variation.model';
import { ClinicalGoal } from 'src/app/shared/models/clinical-goal-model.model';
import { ClinicalGoals } from 'src/app/shared/models/clinical-goal.model';
import { PhaseInfo } from 'src/app/component/plan/plan-directive-details/structure/models/phase-info';
import { PhaseCaption } from 'src/app/shared/models/phase-caption';
import { PlanDirectiveTreatmentDetails } from 'src/app/shared/models/plan-Directive-Treatment-Details';

@Injectable()
export class AppService {
    editclicked: any;
    myGlobalVar: TreatmentInstruction;
    treatmentInstruction = new BehaviorSubject(this.myGlobalVar);
    currentTreatmentInstruction = this.treatmentInstruction.asObservable();
    objCdata = new Objective();
    objPlanDirectiveDetails = new PlanDirectiveTreatmentDetails();
    constructor() {
    }

    /**
     * reflects latest value of TreatmentInstruction to all its subscribers
     * @param nextValue updated treatment instruction
     */
    changeTreatment(nextValue: TreatmentInstruction) {
        this.myGlobalVar = nextValue;
        // reflect updated TreatmentInstruction using observable
        this.treatmentInstruction.next(nextValue);
    }

    /**
     * this function deletes the target from treatment instruction object using target id
     * @param structureId contains target id which is to be deleted
     */
    deleteTargetStructureById(structureId: string) {
        // loop over target list present in TreatmentInstruction

        this.myGlobalVar.Targets.Structure.forEach((structure, index) => {
            // match for target id which is to be deleted
            if (structure.Id === structureId) {
                // remove the target from TreatmentInstruction object
                this.myGlobalVar.Targets.Structure.splice(index, 1);
                return;
            }
        });


        // loop over phase list present in TreatmentInstruction
        for (const phase of this.myGlobalVar.Phases.Phase) {
            // search for targets tagged in phases
            phase.PrescriptionTargets.PrescriptionTarget.forEach((pTarget, index) => {
                // match for target id chose clinical objectives is to be deleted
                if (pTarget.StructureId === structureId) {
                    // remove clinical objective of target
                    phase.PrescriptionTargets.PrescriptionTarget.splice(index, 1);
                }
            });
        }

        // to SET Target Ids
        this.myGlobalVar.Targets.Structure.forEach((target, index) => {
            // target.Id = 'Target' + (index + 1).toString();
            for (const phase of this.myGlobalVar.Phases.Phase) {
                // search for targets tagged in phases
                phase.PrescriptionTargets.PrescriptionTarget.forEach((pTarget, i) => {
                    // match for target id chose clinical objectives is to be deleted
                    if (pTarget.StructureId === target.Id) {
                        // remove clinical objective of target
                        pTarget.StructureId = 'Target' + (index + 1).toString();
                    }
                });
            }
            target.Id = 'Target' + (index + 1).toString();
        });
        // check if all the targets are removed
        if (this.myGlobalVar.Targets.Structure.length === 0) {
            // then make all the phases empty
            this.myGlobalVar.Phases.Phase = [];
        }
        // reflect updated TreatmentInstruction using observable
        this.treatmentInstruction.next(this.myGlobalVar);
    }

    /**
     * this function deletes the oar from treatment instruction object using oar id
     * @param structureId contains oar id which is to be deleted
     */
    deleteOARById(structureId: string) {
        // loop over oar list present in TreatmentInstruction

        this.myGlobalVar.OARs.Structure.forEach((structure, index) => {
            // match for oar id which is to be deleted
            if (structure.Id === structureId) {
                // remove the oar from TreatmentInstruction object
                this.myGlobalVar.OARs.Structure.splice(index, 1);
                return;
            }
        });
        // loop over oar objectives present in TreatmentInstruction
        for (let index = this.myGlobalVar.OARObjectives.Objective.length - 1; index >= 0; index--) {
            const objective = this.myGlobalVar.OARObjectives.Objective[index];
            console.log(index);

            if (objective.StructureId === structureId) {
                console.log('Objecttive' + objective);
                this.myGlobalVar.OARObjectives.Objective.splice(index, 1);
            }
        }
        // reflect updated TreatmentInstruction using observable
        this.treatmentInstruction.next(this.myGlobalVar);
    }

    /**
     * Add or Update OAR's in TreatmentInstruction object
     * @param goals contains clinical objectives of OAR
     * @param structureId contains oar id
     * @param Name contains oar name
     * @param Meaning contains oar name
     * @param type oar ADD / Edit mode
     */
    AddEditOAR(goals: ClinicalGoals[], structureId: string, Name: string, Meaning: string, type: string) {
        // check for 'edit oar' mode
        if (type === 'Edit') {

            if (this.myGlobalVar.OARObjectives.Objective === null) { this.myGlobalVar.OARObjectives.Objective = []; }

            // loop over each clinical objective of oar
            for (let index = this.myGlobalVar.OARObjectives.Objective.length - 1; index >= 0; index--) {
                if (this.myGlobalVar.OARObjectives.Objective[index].StructureId === structureId) {
                    this.myGlobalVar.OARObjectives.Objective.splice(index, 1);
                    // reflect updated TreatmentInstruction using observable
                    this.treatmentInstruction.next(this.myGlobalVar);
                }
            }
            // loop over all the oar's present in TreatmentInstruction object
            for (const oarstructure of this.myGlobalVar.OARs.Structure) {
                // search for selected oar
                if (oarstructure.Id === structureId) {
                    // update name of selected oar
                    oarstructure.Name = Name;
                }
            }
        }
        // check for 'add oar' mode
        if (type === 'Add') {
            let OARlength;
            if (this.myGlobalVar.OARs.Structure !== null) {
                OARlength = this.myGlobalVar.OARs.Structure.length;
            } else {
                OARlength = 0;
                this.myGlobalVar.OARs.Structure = [];
            }

            const i = OARlength + 1;
            // create object of oarStructure
            const oarStructure = new Structure();
            // set the properties of oarStructure
            structureId = 'OAR' + i;
            oarStructure.Code = '12345';
            oarStructure.Meaning = Meaning;
            oarStructure.Name = Name;
            oarStructure.Schema = 'FMA';
            oarStructure.SchemaVersion = '3.2';
            oarStructure.Id = 'OAR' + i;
            // add the created OAR in TreatmentInstruction OAR list
            this.myGlobalVar.OARs.Structure.push(oarStructure);
            // reflect updated TreatmentInstruction using observable
            this.treatmentInstruction.next(this.myGlobalVar);
        }

        // loop over the phases in TreatmentInstruction
        for (const phase of this.myGlobalVar.Phases.Phase) {
            const PhaseId = phase.Id;
            // loop over the goals which is to be added in Oar
            for (const goal of goals) {
                if (PhaseId === goal.Phase) {
                    // convert goal in mayo syntax and assing it to Objective proprties
                    this.ConvertToMayoSyntax(goal);
                    // set in objective property
                    this.objCdata.StructureId = structureId;
                    // add objective into TreatmentInstruction OARObjective section
                    this.myGlobalVar.OARObjectives.Objective.push(this.objCdata);
                    // reflect updated TreatmentInstruction using observable
                    this.treatmentInstruction.next(this.myGlobalVar);
                }
            }
        }
    }

    /**
      * Add or Update target's in TreatmentInstruction object
      * @param goals contains clinical objectives of target
      * @param targetId contains target id
      * @param Name contains target name
      * @param Meaning contains target name
      * @param type target ADD / Edit mode
      */
    AddEditTarget(goals: ClinicalGoals[], targetId: string, Name: string, Code: string, Meaning: string, type: string) {
        // check for 'edit tagret' mode
        if (type === 'Edit') {
            // loop over each phase of Target
            for (const phase of this.myGlobalVar.Phases.Phase) {
                // loop over each clinical objective of target
                for (const pTarget of phase.PrescriptionTargets.PrescriptionTarget) {
                    const structureId = pTarget.StructureId;

                    if (pTarget.Objectives.Objective === null) { pTarget.Objectives.Objective = []; }

                    // match for oar structure id which is to be updated
                    if (structureId === targetId && pTarget.Objectives) {
                        // loop over all the clinical objectives of selected target
                        for (let index = pTarget.Objectives.Objective.length - 1; index >= 0; index--) {
                            // first delete all the clinical objectives from selected target
                            pTarget.Objectives.Objective.splice(index, 1);
                            // reflect updated TreatmentInstruction using observable

                        }
                    }
                }
            }
            this.treatmentInstruction.next(this.myGlobalVar);
            // loop over all the target's present in TreatmentInstruction object
            for (const structure of this.myGlobalVar.Targets.Structure) {
                // search for selected target
                if (structure.Id === targetId) {
                    // update name of selected target
                    structure.Name = Name;
                }
            }

            // check if any goal added to target
            if (goals) {
                // loop over the phases in TreatmentInstruction
                for (const targetPhase of this.myGlobalVar.Phases.Phase) {
                    for (let i = 0; i < goals.length; i++) {
                        if (targetPhase.Id === goals[i].Phase) {
                            const targetlength = targetPhase.PrescriptionTargets.PrescriptionTarget.
                                filter(target => target.StructureId === targetId).length;
                            if (targetlength === 0) {
                                // create object of PrescriptionTarget
                                const ptarget = new PrescriptionTarget();
                                // set the properties of PrescriptionTarget
                                ptarget.TotalDose = '0.01';
                                ptarget.FractionCount = '1';
                                ptarget.FractionDoseGy = '0.01';
                                ptarget.StructureId = targetId;
                                const tObj: Array<Objective> = [];
                                const ob = new Objectives();
                                ob.Objective = tObj;
                                ptarget.Objectives = ob;
                                // add the created PrescriptionTarget in TreatmentInstruction object
                                targetPhase.PrescriptionTargets.PrescriptionTarget.push(ptarget);
                                // reflect updated TreatmentInstruction using observable
                                this.treatmentInstruction.next(this.myGlobalVar);
                            }
                        }
                    }
                }
            }
        }

        // check for 'add tagret' mode
        if (type === 'Add') {

            let Targetlength;
            if (this.myGlobalVar.Targets.Structure !== null) {
                Targetlength = this.myGlobalVar.Targets.Structure.length;
            } else {
                Targetlength = 0;
                this.myGlobalVar.Targets.Structure = [];
            }

            const len = Targetlength + 1;
            // create object of Target
            const targetStructure = new Structure();
            const obk = new PhaseInfo();
            obk.Objectives = [];
            // set the properties of target
            targetStructure.Code = Code;
            targetStructure.Meaning = Meaning;
            targetStructure.Name = Name;
            targetStructure.Schema = '99VMS_STRUCTCODE';
            targetStructure.SchemaVersion = '1';
            targetStructure.Id = 'Target' + len;
            targetId = 'Target' + len;
            // Add the target in target list of TreatmentInstruction
            this.myGlobalVar.Targets.Structure.push(targetStructure);
            // reflect updated TreatmentInstruction using observable
            this.treatmentInstruction.next(this.myGlobalVar);
            for (const phase of this.myGlobalVar.Phases.Phase) {
                const PhaseId = phase.Id;
                for (let index = 0; index < goals.length; index++) {
                    if (PhaseId === goals[index].Phase) {
                        // create object of PrescriptionTarget
                        const ptarget = new PrescriptionTarget();
                        // set the properties of PrescriptionTarget
                        ptarget.TotalDose = '0.01';
                        ptarget.FractionCount = '1';
                        ptarget.FractionDoseGy = '0.01';
                        ptarget.StructureId = 'Target' + len;
                        const tObj: Array<Objective> = [];
                        const ob = new Objectives();
                        ob.Objective = tObj;
                        ptarget.Objectives = ob;
                        // add the created PrescriptionTarget in TreatmentInstruction object
                        phase.PrescriptionTargets.PrescriptionTarget.push(ptarget);
                        // reflect updated TreatmentInstruction using observable
                        this.treatmentInstruction.next(this.myGlobalVar);
                        break;
                    }
                }
            }
        }

        // loop over the phases in TreatmentInstruction
        for (const phase of this.myGlobalVar.Phases.Phase) {
            const PhaseId = phase.Id;
            // loop over the goals which is to be added in target
            for (let index = 0; index < goals.length; index++) {
                if (PhaseId === goals[index].Phase) {
                    for (const pTarget of phase.PrescriptionTargets.PrescriptionTarget) {
                        const structureId = pTarget.StructureId;
                        if (structureId === targetId) {
                            // convert goal in mayo syntax and assing it to Objective proprties

                            this.ConvertToMayoSyntax(goals[index]);
                            // set in objective property
                            this.objCdata.StructureId = structureId;
                            // add objective into PrescriptionTarget
                            pTarget.Objectives.Objective.push(this.objCdata);
                            // reflect updated TreatmentInstruction using observable
                            this.treatmentInstruction.next(this.myGlobalVar);
                        }
                    }
                }
                // reflect updated TreatmentInstruction using observable
                this.treatmentInstruction.next(this.myGlobalVar);
            }
        }

        if (type === 'Edit') {

            let deleteTarget = false;
            let i = 0;
            for (let index = 0; index < this.myGlobalVar.Phases.Phase.length; index++) {
                const phase = this.myGlobalVar.Phases.Phase[index];
                for (i = phase.PrescriptionTargets.PrescriptionTarget.length - 1; i >= 0; i--) {
                    const presTarget = phase.PrescriptionTargets.PrescriptionTarget[i];
                    if (presTarget.StructureId === targetId) {
                        if (presTarget.Objectives && presTarget.Objectives.Objective.length !== 0) {
                            deleteTarget = false;
                        } else {
                            deleteTarget = true;
                            break;
                        }
                    }
                }

                if (deleteTarget === true) {
                    phase.PrescriptionTargets.PrescriptionTarget.splice(i, 1);
                }

            }
            this.treatmentInstruction.next(this.myGlobalVar);
        }
    }

    /**
     * This function Add's or update's in TreatmentInstruction object
     * @param comment Notes to Add / Update
     * @param position inex of note in notes array
     * @param type Add / Edit Mode
     */
    AddEditNotes(comment: string, position: number, type: string) {
        const date = new Date();
        // Check Edit Notes mode
        if (type === 'Edit') {
            // set the updated value in notes properties
            this.myGlobalVar.Notes.Note[position].Comment = comment;
            this.myGlobalVar.Notes.Note[position].TimeStamp = date.toString();
            this.myGlobalVar.Notes.Note[position].UpdatedBy = 'RO';
        }
        // Check Add Notes mode
        if (type === 'Add') {
            // add the note in notes array in TreatmentInstruction object
            this.myGlobalVar.Notes.Note.push({ 'Comment': comment, 'TimeStamp': date.toString(), 'UpdatedBy': 'RO' });
            // reflect updated TreatmentInstruction using observable
            this.treatmentInstruction.next(this.myGlobalVar);
        }
    }

    /**
     * Converts clinical goals to mayo syntax
     * @param goals Clinical objectives to convert in mayo syntax
     */
    ConvertToMayoSyntax(goals: ClinicalGoals) {


        let doseUnit = '';
        let doseLeft = '';
        let doseRight = '';
        let unit = '';
        const obj = new Objective();
        const acceptableVariation = new AcceptableVariation();
        const clinicalgoal = new ClinicalGoal();
        obj.AcceptableVariation = acceptableVariation;
        obj.ClinicalGoal = clinicalgoal;
        let doseList = goals.Goal.split(/\<=|>=|<|>/);
        if (doseList.length > 0) {
            doseLeft = doseList[0];
            doseRight = doseList[1];
            unit = goals.Goal.substring((doseLeft.length), goals.Goal.indexOf(doseRight));
            const doseUnitList = doseRight.split(/\Gy|cc|%/);
            if (doseRight.indexOf('Gy') > 0) {
                doseUnit = 'Gy';
            } else if (doseRight.indexOf('cc') > 0) {
                doseUnit = 'cc';
            } else if (doseRight.indexOf('%') > 0) {
                doseUnit = '%';
            }
            doseRight = doseUnitList[0];
        }
        if (doseLeft.indexOf('DMax') >= 0) {
            obj.ClinicalGoal.DVHObjective = 'Max[' + doseUnit + ']';
        } else if (doseLeft.indexOf('DMean') >= 0) {
            obj.ClinicalGoal.DVHObjective = 'Mean[' + doseUnit + ']';
        } else if (doseLeft.indexOf('DMin') >= 0) {
            obj.ClinicalGoal.DVHObjective = 'Min[' + doseUnit + ']';
        } else {
            obj.ClinicalGoal.DVHObjective = doseLeft + '[' + doseUnit + ']';
        }
        obj.ClinicalGoal.Evaluator = unit + doseRight;
        obj.Priority = goals.Priority;
        obj.Phase = goals.Phase;
        doseList = goals.Variation.split(/\<=|>=|<|>/);
        if (doseList.length > 0) {
            doseLeft = doseList[0];
            doseRight = doseList[1];
            unit = goals.Variation.substring((doseLeft.length), goals.Variation.indexOf(doseRight));
            const doseUnitList = doseRight.split(/\Gy|cc|%/);
            if (doseRight.indexOf('Gy') > 0) {
                doseUnit = 'Gy';
            } else if (doseRight.indexOf('cc') > 0) {
                doseUnit = 'cc';
            } else if (doseRight.indexOf('%') > 0) {
                doseUnit = '%';
            }
            doseRight = doseUnitList[0];
        }

        if (doseLeft.indexOf('DMax') >= 0) {
            obj.AcceptableVariation.DVHObjective = 'Max[' + doseUnit + ']';
        } else if (doseLeft.indexOf('DMean') >= 0) {
            obj.AcceptableVariation.DVHObjective = 'Mean[' + doseUnit + ']';
        } else if (doseLeft.indexOf('DMin') >= 0) {
            obj.AcceptableVariation.DVHObjective = 'Min[' + doseUnit + ']';
        } else {
            obj.AcceptableVariation.DVHObjective = doseLeft + '[' + doseUnit + ']';
        }
        obj.AcceptableVariation.Evaluator = unit + doseRight;
        this.objCdata = obj;

    }

    /**
     * Save the phases in TreatmentInstruction Object
     * @param phases updated phases
     */
    savePhases(phases: PhaseCaption[]) {
        let totalfractioncount = 0;
        const globalphases = new Phases();
        globalphases.Phase = [];
        for (let i = 0; i < phases.length; i++) {
            const phase = phases[i];
            const globalphase = new Phase();
            const obj = new Objective();
            const prescriptiontargets = new PrescriptionTargets();
            prescriptiontargets.PrescriptionTarget = [];
            globalphase.PrescriptionTargets = prescriptiontargets;
            globalphase.Id = phase.PhaseIndex;
            for (const phasetarget of phase.PrescriptionTargets) {
                // create object of PrescriptionTarget
                const globalTarget = new PrescriptionTarget();
                const objective = new Objectives();
                let objs: Array<Objective> = [];
                objs = [];
                objs.push(obj);
                objective.Objective = objs;
                // set properties of PrescriptionTarget
                globalTarget.Objectives = objective;
                globalTarget.FractionCount = phase.FractionCount.toString();
                totalfractioncount = totalfractioncount + Number(globalTarget.FractionCount);
                globalTarget.FractionDoseGy = phasetarget.FractionDoseGy;
                globalTarget.Objectives.Objective = phasetarget.Objectives;
                globalTarget.StructureId = this.getTargetIdByName(phasetarget.StructureCode);
                globalTarget.TotalDose = phasetarget.Dose.toString();
                globalphase.PrescriptionTargets.PrescriptionTarget.push(globalTarget);
            }
            globalphases.Phase.push(globalphase);
        }
        this.myGlobalVar.Phases = globalphases;
        // reflect updated TreatmentInstruction using observable
        this.treatmentInstruction.next(this.myGlobalVar);
        const presession = new PrescribedSessions();
        presession.Session = [];
        let id = 1;
        for (const phase of phases) {
            const ReferencedPhase = phase.PhaseIndex;
            for (let i = 0; i < Number(phase.PrescribedSessionsCount); i++) {
                const session = new Session();
                session.Id = id.toString();
                session.Imaging = '';
                session.ReferencedPhase = ReferencedPhase;
                id = id + 1;
                presession.Session.push(session);
            }
        }
        this.myGlobalVar.PrescribedSessions = presession;
        // reflect updated TreatmentInstruction using observable
        this.treatmentInstruction.next(this.myGlobalVar);
    }

    /**
     * this function returns the target id using target name
     * @param targetname Target code name whose id is required
     */
    getTargetIdByName(targetname: string): string {
        let targetId = '';
        // loop over targets in TreatmentInstruction
        for (const struture of this.myGlobalVar.Targets.Structure) {
            // match target code
            if (targetname === struture.Name) {
                // assign the target id
                targetId = struture.Id;
                break;
            }
        }
        // return target id
        return targetId;
    }

    deleteTargetStructureFromPhases() {

    }
}
