import { AppService } from 'src/app/shared/helpers/app-service'
import { TreatmentInstruction } from 'src/app/shared/models/treatment-instruction.model';
import { async } from '@angular/core/testing';
import { ClinicalGoals } from '../models/clinical-goal.model';
import { AcceptableVariation } from '../models/acceptable-variation.model';
import { ClinicalGoal } from '../models/clinical-goal-model.model';
import { Objective } from 'src/app/shared/models/objective.model';
import { PhaseCaption } from 'src/app/shared/models/phase-caption';
import { PrescriptionTargetCaption } from '../models/prescription-target-caption';

describe('AppService', () => {
    let appservice: AppService;
    let originalTimeout: any;
    let mokTreatmentInstruction: TreatmentInstruction;

    beforeEach(async(() => {
        appservice = new AppService();
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

        mokTreatmentInstruction =
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

        appservice.changeTreatment(mokTreatmentInstruction);
    }));

    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('create an instance', () => {
        const appService = new AppService();
        expect(appService).toBeTruthy();
    });

    it('Check treatment function output for nextValue', () => {
        appservice.changeTreatment(mokTreatmentInstruction);
        const treatmentObj = appservice.myGlobalVar;
        expect(treatmentObj).toEqual(mokTreatmentInstruction);
    });

    it('check delete Target Structure', () => {
        appservice.deleteTargetStructureById('Target1');
        const treatmentObj = appservice.myGlobalVar;
        expect(treatmentObj.Targets.Structure.length).toBe(1);
    });

    it('check delete OAR', () => {
        appservice.deleteOARById('Target1');
        const treatmentObj = appservice.myGlobalVar;
        expect(treatmentObj.OARs.Structure.length).toBe(4);
    });

    it('Add new OAR in Goals list for Add', () => {
        const goalOar: ClinicalGoals[] = [{
            Goal: 'DMax<=9Gy', Phase: '1', Priority: 'p1',
            Variation: 'D0.03cc ≤ 56.25Gy', isGoalValid: true, isVariationValid: true
        }];
        spyOn(appservice, 'ConvertToMayoSyntax').and.returnValue(true);
        appservice.AddEditOAR(goalOar, 'str11', 'strName11', 'strMeaning11', 'Add');
        const treatmentObj = appservice.myGlobalVar;
        expect(treatmentObj.OARs.Structure.length).toBe(5);
    });

    it('Edit OAR in Goals list ', () => {
        const goalOar: ClinicalGoals[] =
            [{ Goal: 'DMax<=2Gy', Phase: '1', Priority: 'p1', Variation: 'D0.03cc≤56.25Gy', isGoalValid: true, isVariationValid: true }];
        spyOn(appservice, 'ConvertToMayoSyntax').and.returnValue(true);
        appservice.AddEditOAR(goalOar, 'str11', 'strName11', 'strMeaning11', 'Edit');
        const treatmentObj = appservice.myGlobalVar;
        expect(treatmentObj.OARs.Structure.length).toBe(4);
    });

    it('Add new Target', () => {
        const goalOar: ClinicalGoals[] =
            [{ Goal: 'DMax<=2Gy', Phase: '1', Priority: 'p1', Variation: 'D0.03cc≤56.25Gy', isGoalValid: true, isVariationValid: true }];
        spyOn(appservice, 'ConvertToMayoSyntax').and.returnValue(true);
        appservice.AddEditTarget(goalOar, '', 'strName11', 'strCode11', 'strMeaning11', 'Add');
        const treatmentObj = appservice.myGlobalVar;
        expect(treatmentObj.OARs.Structure.length).toBe(4);
    });

    it('Edit Target', () => {
        const goalOar: ClinicalGoals[] =
            [{ Goal: 'DMax<=9Gy', Phase: '1', Priority: 'p1', Variation: 'D0.03cc≤56.25Gy', isGoalValid: true, isVariationValid: true }];
        spyOn(appservice, 'ConvertToMayoSyntax').and.returnValue(true);
        appservice.AddEditTarget(goalOar, 'str11', 'strName11', '', '', 'Edit');
        const treatmentObj = appservice.myGlobalVar;
        expect(treatmentObj.OARs.Structure.length).toBe(4);
    });

    it('Add Notes', () => {
        appservice.AddEditNotes('New test comment', 2, 'Add');
        const treatmentObj = appservice.myGlobalVar;
        expect(treatmentObj.Notes.Note.length).toBe(3);
    });

    it('Edit Notes', () => {
        appservice.AddEditNotes('New test comment', 1, 'Edit');
        const treatmentObj = appservice.myGlobalVar;
        expect(treatmentObj.Notes.Note.length).toBe(2);
    });

    it('check for ConvertToMayoSyntax', () => {
        const goals: ClinicalGoals = {
            Goal: 'DMax<=9Gy', Phase: '1', Priority: 'p1',
            Variation: 'DMax<=9Gy', isGoalValid: true, isVariationValid: true
        };
        appservice.ConvertToMayoSyntax(goals);
        const objData = appservice.objCdata;
        const objResult = new Objective();
        const acceptableVariation = new AcceptableVariation();
        acceptableVariation.DVHObjective = 'Max[Gy]';
        acceptableVariation.Evaluator = '<=9';
        const clinicalgoal = new ClinicalGoal();
        clinicalgoal.DVHObjective = 'Max[Gy]';
        clinicalgoal.Evaluator = '<=9';
        objResult.Priority = 'p1';
        objResult.Phase = '1';
        objResult.AcceptableVariation = acceptableVariation;
        objResult.ClinicalGoal = clinicalgoal;

        expect(objData).toEqual(objResult);
    });

    it('check for ConvertToMayoSyntax with different input', () => {
        const goals: ClinicalGoals = {
            Goal: 'DMean<=9cc', Phase: '1', Priority: 'p1',
            Variation: 'DMean<=9cc', isGoalValid: true, isVariationValid: true
        };
        appservice.ConvertToMayoSyntax(goals);
        const objData = appservice.objCdata;
        const objResult = new Objective();
        const acceptableVariation = new AcceptableVariation();
        acceptableVariation.DVHObjective = 'Mean[cc]';
        acceptableVariation.Evaluator = '<=9';
        const clinicalgoal = new ClinicalGoal();
        clinicalgoal.DVHObjective = 'Mean[cc]';
        clinicalgoal.Evaluator = '<=9';
        objResult.Priority = 'p1';
        objResult.Phase = '1';
        objResult.AcceptableVariation = acceptableVariation;
        objResult.ClinicalGoal = clinicalgoal;

        expect(objData).toEqual(objResult);
    });

    it('Check for getTargetIdByName function', () => {
        var TargetResult = appservice.getTargetIdByName('PTV');
        expect(TargetResult).toEqual('Target1');
    });

    it('Check for getTargetIdByName function', () => {
        var phaseCapArray: PhaseCaption[] = [];
        var phaseCap = new PhaseCaption();
        var presTargets: PrescriptionTargetCaption[] = [];
        var presTarget = new PrescriptionTargetCaption();
        presTarget.Dose = '60';
        presTarget.FractionDoseGy = '4';
        presTarget.StructureCode = 'Target1';
        presTarget.StructureId = 'Target1';
        const objArray: Objective[] = [];
        var obj: Objective = new Objective();
        obj.StructureId = 'Target1';
        obj.Phase = '1';
        var clinGoal = new ClinicalGoal(); clinGoal.DVHObjective = 'D5%[Gy]';
        clinGoal.Evaluator = '<=52', clinGoal.DoseLeft = 'D5%'; clinGoal.DoseRight = '[Gy]';
        obj.ClinicalGoal = clinGoal;
        objArray.push(obj);
        presTarget.Objectives = objArray;
        presTargets.push(presTarget);
        phaseCap.PrescriptionTargets = presTargets;
        phaseCapArray.push(phaseCap);
        appservice.savePhases(phaseCapArray);
        var globalVar = appservice.myGlobalVar;
        expect(globalVar.Phases.Phase.length).toEqual(1);
    });

});