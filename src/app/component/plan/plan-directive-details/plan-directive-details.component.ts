import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanDirectiveTemplateDetailsService } from 'src/app/shared/services/plan-directive-template-details.service';
import { AppService } from 'src/app/shared/helpers/app-service';
import { TreatmentInstruction } from 'src/app/shared/models/treatment-instruction.model';
import { Note } from 'src/app/shared/models/note.model';
import { PhaseInfo } from 'src/app/component/plan/plan-directive-details/structure/models/phase-info';
import { StructureInfo } from 'src/app/component/plan/plan-directive-details/structure/models/structure-info';
import { ClinicalGoals } from 'src/app/shared/models/clinical-goal.model';
import { GoalPriority } from 'src/app/component/plan/plan-directive-details/structure/models/goal-priority.model';
import { TargetPhase } from 'src/app/component/plan/plan-directive-details/structure/models/phase.model';
import { PlanDirectivePhaseComponent } from 'src/app/component/plan/plan-directive-details/plan-directive-phase/plan-directive-phase.component';
import { TotalPhaseComponent } from 'src/app/component/plan/plan-directive-details/total-phase/total-phase.component';
import { ConfirmationService } from 'src/../node_modules/primeng/api';
import { Patient } from 'src/app/shared/models/patient.model';
import { StructureModel } from 'src/app/shared/models/structure-model.model';
import { PlanDirectiveTemplate } from 'src/app/shared/models/plan-directive-template.model';
import { PlanDirectiveTemplateService } from 'src/app/shared/services/plan-directive-template.service';
import { OrderPriority } from 'src/app/shared/models/order-priority.model';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { PlanOrderService } from 'src/app/shared/services/plan-order.service';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { TemplateNameAndSiteName } from 'src/app/component/plan/plan-directive-details/template-and-site-name.model';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { StatusEnum } from 'src/app/shared/models/status-enum.enum';
import { Notes } from 'src/app/shared/models/notes.model';
import { HostListener } from '@angular/core';
declare let $: any;

@Component({
    selector: 'app-plan-directive-details',
    templateUrl: './plan-directive-details.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./plan-directive-details.component.scss']

})
export class PlanDirectiveDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
    StructureCollection: Array<StructureModel> = [];
    Structure: StructureModel = new StructureModel;
    disableAddType: Boolean = false;
    TemplateSiteName = new TemplateNameAndSiteName();
    patientNames: string[];
    patientFirstNameCharacter: string;
    patientLastNameCharacter: string;
    orderId: string;
    templateId: number;
    priorityOptions: OrderPriority[];
    machineID: Array<string> = [];
    completedOrderId: Array<string> = [];
    RePlanCheckbox = false;
    siteId: number;
    structuresetId: string;
    i = 0;
    readwrite = 'readWrite';
    targetStructureslength: number;
    structuresInfo: StructureInfo[] = [];
    oarStructureLength: number;
    oarStructureInfo: StructureInfo[] = [];
    showEditDialog: boolean;
    displayDialog: boolean;
    showNotesDialog: boolean;
    notes: string;
    notesArray: Note[];
    editNotes: boolean[] = [];
    goalPriority: GoalPriority[];
    clinicalGoals: ClinicalGoals[] = [];
    phaseAll: TargetPhase[] = [];
    Type: string;
    isTarget: boolean;
    // visible / hide Add notes textarea
    displayAddNotes = false;
    obj: TreatmentInstruction;
    patient = new Patient();
    display = false;
    newTemplateName: string;
    variations = '';
    allTemplates: PlanDirectiveTemplate[] = [];
    newTemplateId: number;
    newTemplate: PlanDirectiveTemplate;
    favouriteTemplates: PlanDirectiveTemplate[];
    phaseLength: number;
    // form control for submit place order form
    placeOrderForm: FormGroup;
    // object with dynamic properties
    objSubmitOrder: { [k: string]: any } = {};
    // indicates User wants to save and submit Plan order
    isSaveAndSubmit: Boolean = false;
    disableSaveOptions = true;
    styleConfigured: string;
    statusOptions: string[];

    // TO DO : fetch selected region id on third page
    selectedregionId = 0;

    @ViewChild('clinicalGoalList') clinicalGoalList: ElementRef;
    @ViewChild('note') NoteTextArea: ElementRef;
    @ViewChild('notesDiv') NotesDiv: ElementRef;
    @ViewChild('closeSubmitOrder') closeSubmitOrder: ElementRef;
    @ViewChild('closeSubmitOrder') Plan: ElementRef;
    @ViewChild(PlanDirectivePhaseComponent) phaseComponent: PlanDirectivePhaseComponent;
    @ViewChild(TotalPhaseComponent) totalPhase: TotalPhaseComponent;

    get editMode() {
        return this.planorderservice.editMode;
    }

    constructor(private toastmr: ToastsManager,
        private confirmationService: ConfirmationService, private planorderservice: PlanOrderService,
        private activatedRoute: ActivatedRoute, private router: Router, private fb: FormBuilder,
        public appService: AppService, private planTemplateService: PlanDirectiveTemplateService,
        private planDirectiveTemplateDetailsService: PlanDirectiveTemplateDetailsService,
        private planDirectiveTemplateService: PlanDirectiveTemplateService,
        private dataServiceService: DataServiceService) {
        this.routeParameters();
        this.getPatient();
        this.getTemplateAndSiteName();
        this.getConfiguredStyle();
    }

    ngOnInit() {
        this.createSubmitOrderForm();
        this.getTemplate();
        this.getAllMachineID();
        this.getPriority();
    }

    ngAfterViewInit() {
        this.controlStatusCheck(false);
    }

    ngOnDestroy() {
        if (localStorage.length > 0) {
            localStorage.removeItem('isModifyTemplate');
        }

        this.appService.changeTreatment(null);
    }

    // @HostListener allows us to also guard against browser refresh, close, etc.
    @HostListener('window:beforeunload', ['$event'])
    canDeactivate($event: any) {
        // insert logic to check if there are pending changes here;
        // returning true will navigate without confirmation
        // returning false will show a confirm dialog before navigating away
        if (!this.disableSaveOptions) {
            return $event.returnValue = true;
        } else {
            return true;
        }
    }

    openCreateCustomDirectiveModal() {
        $('#modal').modal('show');
    }

    /**
     * Function to attach click and touch event on the controls to check its state.
     * @param evt provide the value to directly enable save options without attaching event on controls
     */
    controlStatusCheck(evt) {
        // if event value is true that means directly enable save options
        if (evt) {
            this.disableSaveOptions = false;
        }
        setTimeout(() => {
            let container, inputs, index;

            // Get the container
            container = document.getElementById('directiveDetails');
            // filter input, select, textbox controls from container
            inputs = container.querySelectorAll('input,select,textarea');
            for (index = 0; index < inputs.length; ++index) {
                // attach the events on controls
                $(inputs[index]).on('click touchend', (e) => {
                    if (e.type === 'click') {

                        if (e.target.name != 'commentNotes') {
                            this.disableSaveOptions = false;
                        }
                    } else {
                        if (e.target.name != 'commentNotes') {
                            this.disableSaveOptions = false;
                        }
                    }
                });
            }
        }, 500);
    }

    // create model driven form for submit place place order
    createSubmitOrderForm(): void {
        this.placeOrderForm = this.fb.group({
            'priority': new FormControl('', Validators.required),
            'machineid': new FormControl('', Validators.required),
            'plannotes': new FormControl(''),
            'completedOrderId': new FormControl(''),
            'RePlanCheckbox': new FormControl('')
        });
    }

    RePlanSelectedChangedEvent(e) {
        this.RePlanCheckbox = e.target.checked;

        if (this.RePlanCheckbox) {
            this.getCompletedOrderList();
            this.placeOrderForm.get('completedOrderId').setValidators(Validators.required);
        } else {
            this.placeOrderForm.get('completedOrderId').setValidators(null);
            this.placeOrderForm.get('completedOrderId').updateValueAndValidity();
        }
    }

    // Get Order Priotity List
    getPriority(): void {
        this.planorderservice.getPriority()
            .subscribe(
                data => {
                    this.priorityOptions = data as OrderPriority[];
                });
    }

    // Get Completed order List by Patient MRN
    getCompletedOrderList(): void {

        this.planorderservice.getCompletedorderList(this.orderId).subscribe(
            data => {
                this.completedOrderId = data as Array<string>;
            }
        );
    }

    updateSubmitOrderDetails(value) {
        // CHANGE priority in json object
        if (value === '') {
            this.objSubmitOrder.PlanPriority = null;
        } else {
            this.objSubmitOrder.PlanPriority = value;
            for (const priority of this.priorityOptions) {
                if (priority.id === Number(value)) {
                    this.objSubmitOrder.PriorityName = priority.priority;
                }
            }
        }
    }

    // Load the template into JSON object
    updateTemplateInUI(): void {
        this.appService.currentTreatmentInstruction.subscribe(objTreatment => {
            if (!objTreatment) {
                return;
            }
            this.cleanPreviousObjects();
            this.phaseAll = [];
            if (objTreatment.Targets.Structure !== null) {
                for (const struct of objTreatment.Targets.Structure) {
                    const structure = new StructureInfo();
                    structure.Code = struct.Code;
                    structure.Meaning = struct.Meaning;
                    structure.Name = struct.Name;
                    structure.StructureId = struct.Id;
                    structure.type = 'TargetStructure';
                    this.structuresInfo.push(structure);
                }
            }

            this.phaseLength = objTreatment.Phases.Phase.length;
            objTreatment.Phases.Phase.forEach((phase, i) => {
                const PrescriptionTargets = phase.PrescriptionTargets;
                const phaseInfo = new PhaseInfo();
                phaseInfo.phaseId = phase.Id;
                const phaseD = new TargetPhase();
                const phaseNumber = i + 1;
                phaseD.Name = 'Phase ' + phaseNumber;
                phaseD.Value = phaseNumber.toString();
                this.phaseAll.push(phaseD);
                for (const pTarget of PrescriptionTargets.PrescriptionTarget) {
                    const structureId = pTarget.StructureId;
                    for (const structureInfo of this.structuresInfo) {
                        if (structureInfo.StructureId === structureId && pTarget.Objectives) {
                            const objectives = pTarget.Objectives.Objective !== null ? pTarget.Objectives.Objective : [];
                            phaseInfo.Objectives = objectives;
                            objectives.forEach((objective, obj) => {
                                phaseInfo.Objectives = objectives;
                                if (objective.ClinicalGoal.DVHObjective.includes('Max')
                                    || objective.ClinicalGoal.DVHObjective.includes('Mean')
                                    || objective.ClinicalGoal.DVHObjective.includes('Min')) {
                                    phaseInfo.Objectives[obj].ClinicalGoal.DoseLeft = 'D' + objective.ClinicalGoal.DVHObjective
                                        .substring(0, objective.ClinicalGoal.DVHObjective.indexOf('['));
                                } else {
                                    phaseInfo.Objectives[obj].ClinicalGoal.DoseLeft = objective.ClinicalGoal.DVHObjective
                                        .substring(0, objective.ClinicalGoal.DVHObjective.indexOf('['));
                                }

                                phaseInfo.Objectives[obj].ClinicalGoal.DoseRight = objective.ClinicalGoal.Evaluator +
                                    objective.ClinicalGoal.DVHObjective
                                        .substring(objective.ClinicalGoal.DVHObjective.indexOf('[') + 1, objective
                                            .ClinicalGoal.DVHObjective.indexOf(']'));

                                if (objective.AcceptableVariation.DVHObjective.includes('Max')
                                    || objective.AcceptableVariation.DVHObjective.includes('Mean')
                                    || objective.AcceptableVariation.DVHObjective.includes('Min')) {
                                    phaseInfo.Objectives[obj].AcceptableVariation.DoseLeft = 'D'
                                        + objective.AcceptableVariation.DVHObjective
                                            .substring(0, objective.AcceptableVariation.DVHObjective.indexOf('['));
                                } else {
                                    phaseInfo.Objectives[obj].AcceptableVariation.DoseLeft =
                                        objective.AcceptableVariation.DVHObjective
                                            .substring(0, objective.AcceptableVariation.DVHObjective.indexOf('['));
                                }
                                phaseInfo.Objectives[obj].AcceptableVariation.DoseRight = objective.AcceptableVariation.Evaluator +
                                    objective.AcceptableVariation.DVHObjective
                                        .substring(objective.AcceptableVariation.DVHObjective.indexOf('[') + 1, objective
                                            .AcceptableVariation.DVHObjective.indexOf(']'));
                            });
                            structureInfo.Phases.push(JSON.parse(JSON.stringify(phaseInfo)));
                        }
                    }
                }
            });

            if (objTreatment.OARs.Structure !== null) {
                this.oarStructureLength = objTreatment.OARs.Structure.length;
                objTreatment.OARs.Structure.forEach((oarstructure) => {
                    const oarStructure = new StructureInfo();
                    oarStructure.Meaning = oarstructure.Meaning;
                    oarStructure.Code = oarstructure.Code;
                    oarStructure.Name = oarstructure.Name;
                    oarStructure.StructureId = oarstructure.Id;
                    oarStructure.type = 'OAR';

                    for (const phase of objTreatment.Phases.Phase) {
                        if (objTreatment.OARObjectives.Objective !== null) {
                            for (const objective of objTreatment.OARObjectives.Objective) {
                                if (objective.StructureId === oarStructure.StructureId) {
                                    const phaseinfo = new PhaseInfo();
                                    phaseinfo.phaseId = objective.Phase;
                                    if (phaseinfo.phaseId === phase.Id) {

                                        if (objective.ClinicalGoal.DVHObjective.includes('Max')
                                            || objective.ClinicalGoal.DVHObjective.includes('Mean') ||
                                            objective.ClinicalGoal.DVHObjective.includes('Min')) {
                                            objective.ClinicalGoal.DoseLeft = 'D' + objective.ClinicalGoal.DVHObjective
                                                .substring(0, objective.ClinicalGoal.DVHObjective.indexOf('['));
                                        } else {
                                            objective.ClinicalGoal.DoseLeft = objective.ClinicalGoal.DVHObjective
                                                .substring(0, objective.ClinicalGoal.DVHObjective.indexOf('['));
                                        }

                                        objective.ClinicalGoal.DoseRight = objective.ClinicalGoal.Evaluator + objective.ClinicalGoal.DVHObjective
                                            .substring(objective.ClinicalGoal.DVHObjective
                                                .indexOf('[') + 1, objective.ClinicalGoal.DVHObjective.indexOf(']'));

                                        if (objective.AcceptableVariation.DVHObjective.includes('Max')
                                            || objective.AcceptableVariation.DVHObjective.includes('Mean') ||
                                            objective.AcceptableVariation.DVHObjective.includes('Min')) {
                                            objective.AcceptableVariation.DoseLeft = 'D' + objective.AcceptableVariation.DVHObjective
                                                .substring(0, objective.AcceptableVariation.DVHObjective.indexOf('['));
                                        } else {
                                            objective.AcceptableVariation.DoseLeft = objective.AcceptableVariation.DVHObjective
                                                .substring(0, objective.AcceptableVariation.DVHObjective.indexOf('['));
                                        }

                                        objective.AcceptableVariation.DoseRight = objective.AcceptableVariation.Evaluator
                                            + objective.AcceptableVariation.DVHObjective
                                                .substring(objective.AcceptableVariation.DVHObjective
                                                    .indexOf('[') + 1, objective.AcceptableVariation.DVHObjective.indexOf(']'));

                                        if (oarStructure.Phases.filter(li => li.phaseId === objective.Phase).length > 0) {
                                            for (let k = 0; k < oarStructure.Phases.length; k++) {
                                                if (oarStructure.Phases[k].phaseId === objective.Phase) {
                                                    oarStructure.Phases[k].Objectives.push(objective);
                                                }
                                            }
                                        } else {
                                            phaseinfo.Objectives = [objective];
                                            oarStructure.Phases.push(phaseinfo);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.oarStructureInfo.push(oarStructure);
                });
            }
            if (objTreatment.Notes !== null) {
                this.notesArray = objTreatment.Notes.Note;
            } else {

                this.notesArray = [];
            }

            if (objTreatment.Notes.Note.length !== null) {
                for (let i = 0; i < objTreatment.Notes.Note.length; i++) {
                    this.editNotes.push(false);
                }
            }
        });
    }

    // Get the plan directvie template
    getTemplate(): void {
        this.showEditDialog = false;
        this.GetStructureCollection();
        let isModifyTemplate = false;
        if (this.templateId > 0) {
            if (localStorage.getItem('isModifyTemplate') === 'true') {
                isModifyTemplate = true;
            }
            this.planDirectiveTemplateDetailsService.getTemplateByTemplateId(this.templateId, this.orderId, isModifyTemplate).subscribe(
                data => {
                    let objTreatment: TreatmentInstruction;
                    objTreatment = JSON.parse(data);
                    if (objTreatment) {
                        if (objTreatment.Notes === null) {
                            const notes = new Notes();
                            const note = new Array<Note>();
                            notes.Note = note;
                            objTreatment.Notes = notes;
                        }
                    }
                    this.appService.changeTreatment(objTreatment);
                    this.obj = objTreatment;
                    this.goalPriority = [
                        { Name: '1-Must', Value: '1' },
                        { Name: '2-Very Important', Value: '2' },
                        { Name: '3-Important', Value: '3' },
                        { Name: '4-Less Important', Value: '4' },
                        { Name: 'R-Report Value Only', Value: 'R' }];
                    this.updateTemplateInUI();
                });
        } else {
            this.obj = this.appService.myGlobalVar;
            this.updateTemplateInUI();
        }
    }

    // Get template name site name
    getTemplateAndSiteName(): void {
        this.planDirectiveTemplateService.getTemplatesBySiteId(this.siteId).subscribe(data => {
            this.allTemplates = data as PlanDirectiveTemplate[];
            this.getFavouriteTemplate(this.siteId);
        });
        this.planDirectiveTemplateDetailsService.getSiteNameById(this.siteId.toString(), this.templateId.toString()).subscribe(
            data => {
                this.TemplateSiteName.siteName = data[0]; this.TemplateSiteName.templateName = data[1];
                this.newTemplateName = this.TemplateSiteName.templateName;
            }
        );
    }

    // Get Patient name and MRN
    getPatient(): void {
        this.appService.objPlanDirectiveDetails.isBackButtonPressed = false;
        this.planDirectiveTemplateDetailsService.getPatientByOrderId(this.orderId).subscribe(
            data => {
                this.patient = data as Patient;
                this.patientNames = this.patient.Name.split(' ');
                for (const index in this.patientNames) {
                    if (Number(index) === 0) {
                        this.patientLastNameCharacter = (this.patientNames[Number(index)])[0].toUpperCase();
                    } else {
                        this.patientFirstNameCharacter = (this.patientNames[Number(index)])[0].toUpperCase();
                    }
                }
            }
        );
    }

    // Reading the URL parameter
    routeParameters(): void {
        this.activatedRoute.params.subscribe(params => {
            this.orderId = params['orderId'];
            this.templateId = params['templateId'];
            this.siteId = params['siteId'];
            this.appService.objPlanDirectiveDetails.currentOrderID = this.orderId;
            if (this.templateId > 0) {
                this.planDirectiveTemplateDetailsService.getStructureSetIdByorderId(this.orderId).subscribe
                    (data => {
                        this.structuresetId = data as string;
                    });
            } else {
                this.disableSaveOptions = true;
                this.openCreateCustomDirectiveModal();
            }
        });
    }

    // Set selected structure on selection of Structure Name dropdown
    SetStructure(structure): void {

        if (structure) {
            this.Structure = structure;
            this.goalsValid();
        }
    }

    // Get all Target Strucutre
    GetStructureCollection(): void {
        this.planDirectiveTemplateDetailsService.GetStructureCollection().subscribe(
            data => {

                data.forEach(element => {
                    element.Name = '';
                });

                // assign data to data model
                this.StructureCollection = data as StructureModel[];
            }
        );
    }

    // Clear the Target and Organ Object data
    public cleanPreviousObjects(): void {
        this.structuresInfo = [];
        this.oarStructureInfo = [];
        this.notesArray = [];
        this.oarStructureLength = 0;
        this.phaseLength = 0;
    }

    // Open edit-phase window
    openEditPopup(): void {
        this.controlStatusCheck(false);
        this.showEditDialog = false;
        setTimeout(() => {
            this.showEditDialog = true;
        }, 100);
    }

    // Add target or organ
    Add(type: string): void {
        this.controlStatusCheck(false);
        this.disableAddType = true;
        this.Structure = new StructureModel();
        if (type === 'OAR') {
            this.Type = 'Organs';
            this.isTarget = false;
        }
        if (type === 'Target') {
            this.Type = 'Target';
            this.isTarget = true;
        }
        // Validation for maximum no of targets and OAR's that can be created
        if (type === 'Target' ? this.structuresInfo.length < 50 : this.oarStructureInfo.length < 199) {
            this.displayDialog = true;
            this.clinicalGoals = [];
        } else {
            // display error message to user in case maximum no of target's or organs already created
            this.toastmr.error('Maximum of ' + (type === 'Target' ? 50 : 199) + ' ' + this.Type + 's' + ' can be created.', 'Error!');
        }
    }

    // Add goals in struture
    addGoal(): void {
        this.disableAddType = true;
        // maximum of 100 clinical goals can be added
        if (this.clinicalGoals.length <= 100) {
            const goals = new ClinicalGoals();
            goals.Goal = '';
            goals.Priority = '1';
            goals.Variation = '';
            goals.Phase = '1';
            goals.isGoalValid = false;
            goals.isVariationValid = false;
            this.clinicalGoals.push(goals);
        }
        this.controlStatusCheck(false);
    }

    // delete goal from structure
    deleteGoal(goal: ClinicalGoals): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete goal' + (goal.Goal !== '' ? ' : ' : '') + goal.Goal + '?',
            accept: () => {
                const index = this.clinicalGoals.indexOf(goal);
                this.clinicalGoals.splice(index, 1);
                this.goalsValid();
            }
        });

    }

    /**
     * Calls AddEditNotes function from app-service to add / update note
     * @param comment it contains the Notes text value to add / edit
     * @param position it contains position of the note object in array and used to enable edit mode for that particular note
     * @param type it represents the Add / Edit mode
     */
    AddEditNotes(comment: object, position: number, type: string): any {

        // check for blanck value or empty space in note
        if (comment['commentNotes'].trim() === '') {
            return false;
        }
        // calls function to add / edit note from app-service
        this.appService.AddEditNotes(comment['commentNotes'], position, type);
        // check Add note mode
        if (type === 'Add') {
            this.editNotes.push(false);
            this.displayAddNotes = false;
            this.disableSaveOptions = false;  //Enable saveas new template button when notes saved
        } else if (type === 'Edit') {
            this.editNotes[position] = false;
            this.disableSaveOptions = false; //Enable saveas new template button when notes saved
        }
    }

    // Function to populate the notes in form in Edit Mode
    displayEditNotes(editPosition: number): void {
        // close all other edit posiitons
        for (let li = 0; li < this.editNotes.length; li++) {
            this.editNotes[li] = false;
        }
        this.editNotes[editPosition] = true;

        this.controlStatusCheck(false);
    }

    // Add notes
    openNotesPopup(): void {
        // close all edit posiitons
        for (let li = 0; li < this.editNotes.length; li++) {
            this.editNotes[li] = false;
        }
        this.notes = '';
        this.displayAddNotes = true;
        this.NotesDiv.nativeElement.scrollTop = 0;

        this.controlStatusCheck(false);
    }

    // lose notes
    close(): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to cancel?',
            accept: () => {
                this.displayDialog = false;
                this.disableAddType = false;
                this.Structure = new StructureModel();
            }
        });

    }

    // On chnaging priority of clinical goal
    onPriorityChange(priorityValue: string, goal: ClinicalGoals): void {
        const index = this.clinicalGoals.findIndex(g =>
            g.Goal === goal.Goal && g.Phase === goal.Phase && g.Priority === goal.Priority && g.Variation === goal.Variation);
        this.clinicalGoals[index].Priority = priorityValue;
    }

    // Save the updated clinical golas
    save(clinicalGoals: ClinicalGoals[], isTarget: boolean): void {
        if (isTarget) {
            this.appService.AddEditTarget(clinicalGoals, '', this.Structure.Name, this.Structure.Code, this.Structure.Meaning, 'Add');
        } else {
            this.appService.AddEditOAR(clinicalGoals, '', this.Structure.Code, this.Structure.Meaning, 'Add');
        }
        this.displayDialog = false;
        this.Structure = new StructureModel();
    }

    // Change the phase of clinical goals
    onPhaseChange(phaseValue: string, goal: ClinicalGoals): void {
        const index = this.clinicalGoals.findIndex(g =>
            g.Goal === goal.Goal && g.Phase === goal.Phase && g.Priority === goal.Priority && g.Variation === goal.Variation);
        this.clinicalGoals[index].Phase = phaseValue;
    }

    // Save as new Template as well as save instance of template
    saveAsTemplate(templateName: string): void {
        // this.showDialog();

        this.obj.AnatomicalSite = this.TemplateSiteName.siteName;
        this.obj.DisplayName = templateName;
        const strTemplate = JSON.stringify(this.obj);
        // let TemplateName = "Template1";
        this.planDirectiveTemplateDetailsService
            .SaveAsTemplate(strTemplate, this.orderId, templateName, this.siteId, this.templateId).subscribe(
                () => {
                    this.display = false;
                    // this.showSuccess(this.newTemplateName);
                    this.appService.objPlanDirectiveDetails.isBackButtonPressed = true;
                    const message = 'Instance of template ' + this.newTemplateName +
                        ' saved successfully and added the template in original template list';
                    this.router.navigate(['/Orders']).then(() => {
                        this.toastmr.success(message, 'Success!');
                    });
                    // this.router.navigate(['/Orders']);
                },
            );
    }

    // Save the instance of template
    saveTemplate(): void {
        // this.confirmationService.confirm({
        //     message: 'Are you sure you want to save template?',
        //     accept: () => {
        const strTemplate = JSON.stringify(this.obj);
        // let TemplateName = "Template1";
        this.planDirectiveTemplateDetailsService.saveTemplate(strTemplate, this.orderId, this.templateId, this.siteId).subscribe(
            () => {
                // this.showSaveAsSuccess(this.TemplateSiteName.templateName);
                this.appService.objPlanDirectiveDetails.isBackButtonPressed = true;
                const message = 'Instance of template ' + this.TemplateSiteName.templateName + ' saved successfully';
                this.router.navigate(['/Orders']).then(() => {
                    this.toastmr.success(message, 'Success!');
                });
            },
            () => {
                this.appService.objPlanDirectiveDetails.isBackButtonPressed = false;
                this.toastmr.error('Some Error occurred while placing order. Please try again', 'Error!');
            });
        //     }
        // });
    }

    // function to save and submit plan order directive
    SaveAndSubmitTemplate(): void {

        this.planDirectiveTemplateDetailsService.isAllImagesRecived(this.orderId).subscribe(
            data => {
                this.statusOptions = Object.keys(StatusEnum).map(itm => StatusEnum[itm]);
                if (data !== -1) {

                    if (this.statusOptions[data - 1] === 'Image Transfer In-Progress') {

                        this.toastmr.error('Image transfer is in progress for Patient ' +
                            this.patient.Name + '  , MRN ' +
                            this.patient.ID + '. Please wait untill all images are transfered. Click to dismiss message.', 'Error!');
                    } else {

                        if (this.statusOptions[data - 1] === 'Image Transfer Failed') {
                            this.toastmr.error('Image transfer failed for patient ' +
                                this.patient.Name + '  , MRN ' + this.patient.ID, 'Error!');
                        } else {

                            this.isSaveAndSubmit = true;
                            this.objSubmitOrder.PlanOrderId = this.orderId;
                            this.objSubmitOrder.TemplateId = this.templateId;
                            this.objSubmitOrder.Template = JSON.stringify(this.obj);
                            this.objSubmitOrder.TemplateName = this.TemplateSiteName.templateName;
                            this.objSubmitOrder.RePlanChecked = this.RePlanCheckbox;
                            this.planDirectiveTemplateDetailsService.submitTemplate(this.objSubmitOrder).subscribe(
                                () => {
                                    // close add Place order modal popup
                                    this.closeSubmitOrder.nativeElement.click();
                                    this.appService.objPlanDirectiveDetails.isBackButtonPressed = true;
                                    const message = 'Instance of template ' + this.objSubmitOrder.TemplateName +
                                        ' saved successfully and plan order submitted successfully';
                                    this.router.navigate(['/Orders']).then(() => {
                                        this.toastmr.success(message, 'Success!');
                                    });
                                },
                                () => {
                                    this.appService.objPlanDirectiveDetails.isBackButtonPressed = false;
                                    this.toastmr.error('Some Error occurred while placing order. Please try again', 'Error!');
                                    // close add Place order modal popup
                                    this.closeSubmitOrder.nativeElement.click();
                                });
                        }
                    }
                } else {
                    this.toastmr.error('Some error occurred ', 'Error!');
                }
            },
            err => {
                this.appService.objPlanDirectiveDetails.isBackButtonPressed = false;
                this.toastmr.error('Some Images are not recived for patient => ' +
                    this.patient.Name + ' MRN => ' + this.patient.ID, 'Error!');
            }

        );

    }


    // Update the goal enter by user
    updateGoal(rowData, goalStr): void {
        rowData['Goal'] = goalStr;
        rowData['isGoalValid'] = true;
        if (goalStr.length === 0 && this.variations.length === 0) {
            this.disableAddType = true;
        } else {
            this.goalsValid();
        }
    }

    // Update the variation enter by user
    updateVariation(rowData, variationStr): void {
        rowData['Variation'] = variationStr;
        rowData['isVariationValid'] = true;
        if (variationStr.length === 0) {
            this.disableAddType = true;
        } else {
            this.goalsValid();
        }
    }

    // Show save as dialog
    showTemplateSaveAsDialog(): void {
        this.display = true;
    }

    // Cancel save template
    cancelSaveTemplateName(): void {
        this.newTemplateName = this.TemplateSiteName.templateName;
        this.display = false;
    }

    // Save template
    onSaveTemplateName(): void {
        this.saveAsTemplate(this.newTemplateName);
    }

    // Back button pressed go to directive selection page
    GoToPlanDirective(): void {
        // take confiramation to go back
        this.confirmationService.confirm({
            message: 'Are you sure you want to go back?',
            accept: () => {
                this.appService.objPlanDirectiveDetails.isBackButtonPressed = true;
                // navigate to previous page
                this.router.navigate(
                    ['/planning-directive-create',
                        this.structuresetId,
                        this.patient.ID,
                        this.orderId
                    ]);
            },
            reject: () => {
                this.appService.objPlanDirectiveDetails.isBackButtonPressed = false;
            }
        });
    }

    // redirect user to orders page
    GoToOrders(): void {
        // take confiramation to cancel to directive creation
        this.confirmationService.confirm({
            message: 'Are you sure you want to cancel directive planning?',
            accept: () => {
                this.appService.objPlanDirectiveDetails.isBackButtonPressed = true;
                // navigate to previous page
                this.router.navigate(
                    ['/Orders']);
            }
        });
    }


    // Validate clinical golas
    validateClinicalGoal(evt): void {
        this.disableAddType = evt;
    }

    // Validate variation goals
    variationValidation(variation: string): void {
        this.variations = variation;
        if (variation.length === 0) {
            this.disableAddType = true;
        } else {
            this.goalsValid();
        }
    }

    // Validate entered goals
    goalsValid(): void {
        let allgoals = 0;
        for (const goal of this.clinicalGoals) {
            if (goal.isGoalValid === false || goal.isVariationValid === false) {
                allgoals = allgoals + 1;
            }
        }
        if (allgoals !== 0 && allgoals <= this.clinicalGoals.length) {
            this.disableAddType = true;
        } else {
            this.disableAddType = this.Structure.Code === undefined || (this.Structure.Name === '' && this.Type === 'Target');
        }
    }

    // Change template from dropdown
    templateChanged(templateId: number, previousTemplateId): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to change Template?',
            accept: () => {
                this.appService.changeTreatment(null);
                this.cleanPreviousObjects();
                this.newTemplateId = Number(templateId);
                this.newTemplate = this.getTemplateById(this.newTemplateId);
                this.appService.objPlanDirectiveDetails.isBackButtonPressed = true;
                this.templateId = this.newTemplateId;
                this.getTemplate();
                this.router.navigate(
                    ['/planning-directive-details',
                        this.orderId, this.newTemplate.PlanDirectiveTemplateID, this.newTemplate.PlanDirectiveSiteID
                    ]);
            },
            reject: () => {
                // TODO not to navigate for reject.
                this.templateId = Number(previousTemplateId);
                const copyTemplates = JSON.parse(JSON.stringify(this.allTemplates));
                this.allTemplates = [];
                this.allTemplates = copyTemplates;
                this.newTemplate = this.getTemplateById(this.templateId);
                // this.getTemplate();
                this.router.navigate(
                    ['/planning-directive-details',
                        this.orderId, this.newTemplate.PlanDirectiveTemplateID, this.newTemplate.PlanDirectiveSiteID
                    ]);
                // location.reload();
            }
        });
    }

    // Get template by template id
    getTemplateById(templateId: number): PlanDirectiveTemplate {
        const newTemplate = new PlanDirectiveTemplate(0, '', 0, false, 0);
        for (const template of this.allTemplates) {
            if (template.PlanDirectiveTemplateID === templateId) {
                newTemplate.PlanDirectiveTemplateID = template.PlanDirectiveTemplateID;
                newTemplate.PlanDirectiveSiteID = template.PlanDirectiveSiteID;
                newTemplate.PlanDirectiveTemplateName = template.PlanDirectiveTemplateName;
                break;
            }
        }
        return newTemplate;
    }

    // get favourite templates
    getFavouriteTemplate(selectedSiteId: number) {
        this.planTemplateService.getFavouriteTemplates(selectedSiteId).subscribe((data) => {
            this.favouriteTemplates = data as PlanDirectiveTemplate[];
            this.arrangeTemplates(this.favouriteTemplates);
        });
    }

    // Arrange the template drop down asper favourite on top
    arrangeTemplates(favouriteTemplates: PlanDirectiveTemplate[]) {
        const tem: PlanDirectiveTemplate[] = [];
        let selectedIsFavrouriteTemplate = false;

        const fav = favouriteTemplates.filter((data) => data.PlanDirectiveSiteID === Number(this.siteId));
        favouriteTemplates = fav;
        for (const favouriteTemplate of favouriteTemplates) {
            if (Number(this.templateId) === favouriteTemplate.PlanDirectiveTemplateID) {
                selectedIsFavrouriteTemplate = true;
            }
        }

        if (selectedIsFavrouriteTemplate === true) {
            for (const favouriteTemplate of favouriteTemplates) {
                tem.push(favouriteTemplate);
            }
        }

        const nonFav: PlanDirectiveTemplate[] = [];

        for (const template of this.allTemplates) {
            let i = 0;
            for (i = 0; i < tem.length; i++) {
                const element = tem[i];
                if (template.PlanDirectiveTemplateID === element.PlanDirectiveTemplateID) {
                    break;
                }
            }
            if (i === tem.length) {
                nonFav.push(template);
            }
        }

        for (let i = 0; i < nonFav.length; i++) {
            tem.push(nonFav[i]);
        }

        this.allTemplates = tem;

    }
    /**
     * Fetches the machine id from server
     */
    getAllMachineID(): void {
        this.planorderservice.getAllMachineID().subscribe(
            data => {
                this.machineID = data['MachineID'];
            }
        );
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

    ScrollInView(rowIndex) {
        if (this.clinicalGoals.length === (rowIndex + 1)) {
            this.clinicalGoalList.nativeElement.scrollTop = this.clinicalGoalList.nativeElement.scrollHeight;
        }
    }
}

