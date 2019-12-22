import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { PlanDirectiveTemplate } from 'src/app/shared/models/plan-directive-template.model';
import { Site } from 'src/app/shared/models/site.model';
import { SiteService } from 'src/app/shared/services/site.service';
import { PlanDirectiveTemplateService } from 'src/app/shared/services/plan-directive-template.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/shared/helpers/app-service';
import { PlanDirectiveTemplateDetailsService } from 'src/app/shared/services/plan-directive-template-details.service';
import { Patient } from 'src/app/shared/models/patient.model';
import { PlanOrderService } from 'src/app/shared/services/plan-order.service';
import { StructureModel } from 'src/app/shared/models/structure-model.model';
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
import { Notes } from 'src/app/shared/models/notes.model';
import { Note } from 'src/app/shared/models/note.model';
import { Targets } from 'src/app/shared/models/targets.model';
import { OARObjectives } from 'src/app/shared/models/oarobjectives.model';
import { OARs } from 'src/app/shared/models/oars.model';
import { TargetStructure } from 'src/app/shared/models/target-structure.model';
import { PhaseTargets } from 'src/app/shared/models/phase-targets.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

declare let $: any;
@Component({
    selector: 'app-plan-directive',
    templateUrl: './plan-directive.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./plan-directive.component.scss']
})

export class PlanDirectiveComponent implements OnInit {
    // Initializing neccessary variables
    page = 0;
    patientFirstNameCharacter: string;
    patientLastNameCharacter: string;
    structureSetId = '';
    patientId = '';
    selectedregionId: number;
    selectedSiteId: number;
    sites: Site[];
    plantemplates: PlanDirectiveTemplate[] = [];
    isPlanTemplateClicked = false;
    isFavoriteTemplateClicked = false;
    isCreateTemplateDisabled = true;
    favoriteTemplateId: number;
    planId: number;
    siteId: number;
    isSiteClicked = false;
    regionselected = false;
    patient: Patient;
    patientNames: string[];
    orderId: string;
    anatomicalSiteFilter: string;
    targetFilterValue: string;
    pdtFilter: string;
    searchSiteName = false;
    searchTemplateName = false;
    favTemplate: PlanDirectiveTemplate[] = [];
    StructureCollection: StructureModel[] = [];
    selectedStructureCollection: StructureModel[] = [];
    selectedStructure: StructureModel;
    isStrucutreSelected = false;
    structureName = '';
    siteName = '';
    phases = [1, 2, 3, 4];
    phaseTargets: Array<PhaseTargets> = [];
    numberofFractionError = true;
    treatmentInstruction = new TreatmentInstruction();
    filter = true;
    @ViewChild('closeCustomTemplateCreate') closeCustomTemplateCreate: ElementRef;
    definePhaseForm: FormGroup;

    set editMode(value: boolean) {
        this.planorderservice.editMode = value;
    }

    constructor(private siteService: SiteService, public appService: AppService, private router: Router,
        private planTemplateService: PlanDirectiveTemplateService, private activatedRoute: ActivatedRoute,
        private planDirectiveTemplateDetailsService: PlanDirectiveTemplateDetailsService, private planorderservice: PlanOrderService,
        private fb: FormBuilder) {
        // Getting route parameters
        this.getRouteParameters();
        this.editMode = false;
    }

    ngOnInit() {
        // this.getOrderId();
        if (!this.appService.objPlanDirectiveDetails.isBackButtonPressed) {
            this.getPatientNameAndId();
        } else {
            this.resetPlanDirective();
        }
        this.definePhaseForm = this.fb.group({
            noOfFractions: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{2}$'),
            Validators.max(50), Validators.min(1)])],
            totalDose: [0, Validators.compose([Validators.required, Validators.pattern('^[0-9]{2}$'),
            Validators.max(125), Validators.min(0.01)])]
        });
        if (!this.appService.objPlanDirectiveDetails.isBackButtonPressed) {
            this.getFavouriteTemplate(0);
        }
    }

    // Fetching the OrderId by StructureSetID
    getOrderId(): void {

        this.planTemplateService.getOrderIdByStructureSetId(this.structureSetId, this.patientId).subscribe(
            data => {
                this.orderId = data;
                this.appService.objPlanDirectiveDetails.currentOrderID = this.orderId;

            }
        );

    }

    // Getting route parameters
    getRouteParameters(): void {
        this.activatedRoute.params.subscribe(params => {
            this.structureSetId = params['structureSetId'];
            this.appService.objPlanDirectiveDetails.structureSetId = params['structureSetId'];
            this.patientId = params['patientId'];
            this.appService.objPlanDirectiveDetails.patientId = params['patientId'];
            this.appService.objPlanDirectiveDetails.currentOrderID = params['orderId'];
            this.orderId = params['orderId'];
        });
        this.isSiteClicked = false;
        this.isPlanTemplateClicked = false;
        this.isFavoriteTemplateClicked = false;
        this.isCreateTemplateDisabled = true;
    }

    // Checking for Region Selection and Get the Respective Sites
    selectedRegion(event: any): void {
        if (event.type === 'Whole Body') {
            // On click of Whole Region rdio button
            this.filter = false;
            this.searchSiteName = false;
            this.anatomicalSiteFilter = '';
            this.selectedregionId = event.event;
            this.appService.objPlanDirectiveDetails.selectedRegionID = event.event.toString();
            this.setFavroutiesByRegionId(this.selectedregionId);
            this.getSite();
        } else if (event.type === 'empty Region' || event.event.target.value === 'emptyVal') {
            // On click of Selected Region radio button
            this.setFavroutiesOfSelectedRegionRadio();
            this.filter = false;
            this.searchSiteName = false;
            this.anatomicalSiteFilter = '';
            this.selectedregionId = 0;
            this.selectedSiteId = 0;
            this.regionselected = false;
            this.sites = [];
            this.isSiteClicked = false;
            this.isPlanTemplateClicked = false;
            this.isFavoriteTemplateClicked = false;
            this.isCreateTemplateDisabled = true;
            this.appService.objPlanDirectiveDetails.selectedRegionID = '0';
            this.plantemplates = [];
        } else {
            if (event.event.target.value !== '0') {
                // if (event.event.target.value !== '0' && event.event.target.value !== '-1') {
                // On click of some region from dropdown
                this.filter = false;
                this.searchSiteName = false;
                this.anatomicalSiteFilter = '';
                this.selectedregionId = event.event.target.value;
                this.setFavroutiesByRegionId(this.selectedregionId);
                this.appService.objPlanDirectiveDetails.selectedRegionID = event.event.target.value;
                this.getSite();
            } else {
                // On click of --None-- in dropdown
                this.setFavroutiesOfSelectedRegionRadio();
                this.filter = false;
                this.searchSiteName = false;
                this.anatomicalSiteFilter = '';
                this.regionselected = false;
                this.selectedregionId = 0;
                this.selectedSiteId = 0;
                this.sites = [];
                this.isSiteClicked = false;
                this.isPlanTemplateClicked = false;
                this.isFavoriteTemplateClicked = false;
                this.isCreateTemplateDisabled = true;
                this.appService.objPlanDirectiveDetails.selectedRegionID = '0';
                this.plantemplates = [];
            }
        }
    }

    // Get Templates By Site ID
    getTemplates(value: number): void {
        this.filter = false;
        this.pdtFilter = '';
        this.searchTemplateName = false;
        this.isSiteClicked = true;
        this.isPlanTemplateClicked = false;
        this.isFavoriteTemplateClicked = false;
        this.isCreateTemplateDisabled = true;
        this.plantemplates = [];
        this.selectedSiteId = value;
        this.getSiteNameBySiteId(this.selectedSiteId);
        this.appService.objPlanDirectiveDetails.selectedSiteID = value.toString();
        this.planTemplateService.getTemplatesBySiteId(this.selectedSiteId).subscribe(data => {
            let tempPlantemplates: PlanDirectiveTemplate[] = [];
            this.plantemplates.push(new PlanDirectiveTemplate(0, 'Planning Directive without a template', 0, false, 0));
            tempPlantemplates = data as PlanDirectiveTemplate[];
            for (let i = 0; i < tempPlantemplates.length; i++) {

                this.plantemplates.push(tempPlantemplates[i]);
            }
            this.appService.objPlanDirectiveDetails.templates = this.plantemplates;
            this.setFavouriteTemplateBySiteId(this.selectedSiteId);
        });
        this.siteId = value;
        this.isSiteClicked = true;
    }

    // Which Template User has Selected
    selectedPlanTemplate(value: number): void {
        this.isCreateTemplateDisabled = false;
        this.planId = value;
        this.appService.objPlanDirectiveDetails.templateId = value.toString();
        this.appService.objPlanDirectiveDetails.favoriteTemplateId = null;
        this.isPlanTemplateClicked = true;
        this.isFavoriteTemplateClicked = false;
    }
    setFavouriteTemplateBySiteId(siteId: number) {
        this.getActualFavouriteTemplateList();
        const newFav: PlanDirectiveTemplate[] = [];
        for (let index = 0; index < this.appService.objPlanDirectiveDetails.favoriteTemplates.length; index++) {
            const element = this.appService.objPlanDirectiveDetails.favoriteTemplates[index];
            if (element.PlanDirectiveSiteID === Number(siteId)) {
                newFav.push(element);
            }
        }
        this.appService.objPlanDirectiveDetails.favoriteTemplates = newFav;
    }
    /**
    * navigate to planning-directive-details
    */
    createDirective() {
        localStorage.setItem('isModifyTemplate', 'true');
        if (this.appService.objPlanDirectiveDetails.templateId === '0') {
            this.openModal();
        } else {
            this.router.navigate(['/planning-directive-details', this.orderId, this.planId, this.selectedSiteId]);
        }
    }

    // Which  Favorite Template User has Selected
    selectedFavoritePlanTemplate(value: any): void {
        this.isCreateTemplateDisabled = false;
        this.favoriteTemplateId = value.PlanDirectiveTemplateID;
        this.appService.objPlanDirectiveDetails.favoriteTemplateId = value.PlanDirectiveTemplateID.toString();
        this.appService.objPlanDirectiveDetails.templateId = null;
        this.planId = value.PlanDirectiveTemplateID;
        this.selectedSiteId = value.PlanDirectiveSiteID;
        this.isPlanTemplateClicked = false;
        this.isFavoriteTemplateClicked = true;
    }

    // Get the Sites of respective region
    getSite(): void {
        this.regionselected = true;
        this.sites = [];
        this.isSiteClicked = false;
        this.isPlanTemplateClicked = false;
        this.isFavoriteTemplateClicked = false;
        this.isCreateTemplateDisabled = true;
        this.plantemplates = [];
        this.siteService.getSiteByRegionId(this.selectedregionId).subscribe(data => {
            this.sites = data as Site[];
            this.appService.objPlanDirectiveDetails.sites = data as Site[];
        });
    }

    // Set the values again when user pressed the back button from plan directive page
    resetPlanDirective(): void {
        this.getActualFavouriteTemplateList();
        this.selectedregionId = Number(this.appService.objPlanDirectiveDetails.selectedRegionID);
        this.selectedSiteId = Number(this.appService.objPlanDirectiveDetails.selectedSiteID);
        this.siteId = this.selectedSiteId;
        this.sites = this.appService.objPlanDirectiveDetails.sites;
        this.plantemplates = this.appService.objPlanDirectiveDetails.templates;

        this.isCreateTemplateDisabled = true;
        if (this.appService.objPlanDirectiveDetails.selectedRegionID && this.appService.objPlanDirectiveDetails.selectedRegionID !== '0') {
            this.regionselected = true;
            this.setFavroutiesByRegionId(this.selectedregionId);
        } else {
            this.setFavroutiesOfSelectedRegionRadio();
        }
        if (this.appService.objPlanDirectiveDetails.selectedSiteID !== null && this.appService.objPlanDirectiveDetails.selectedSiteID !== '') {
            this.isSiteClicked = true;
            this.setFavouriteTemplateBySiteId(this.siteId);
        }

        if (this.appService.objPlanDirectiveDetails.templateId !== null &&
            this.appService.objPlanDirectiveDetails.templateId !== '') {
            this.planId = Number(this.appService.objPlanDirectiveDetails.templateId);
        }
        // if (this.planId !== 0) {
        //   this.isPlanTemplateClicked = true;
        //   this.isFavoriteTemplateClicked = false;
        // } else {
        //   this.isPlanTemplateClicked = false;
        //   this.isFavoriteTemplateClicked = true;
        // }

        this.favoriteTemplateId = Number(this.appService.objPlanDirectiveDetails.favoriteTemplateId);
        if (!this.favoriteTemplateId) {
            this.isPlanTemplateClicked = true;
            this.isFavoriteTemplateClicked = false;
        } else {
            this.isPlanTemplateClicked = false;
            this.isFavoriteTemplateClicked = true;

            this.selectedSiteId = this.appService.objPlanDirectiveDetails.favoriteTemplates
                .find(x => x.PlanDirectiveTemplateID === this.favoriteTemplateId).PlanDirectiveSiteID;
            this.selectedregionId = this.appService.objPlanDirectiveDetails.favoriteTemplates
                .find(x => x.PlanDirectiveTemplateID === this.favoriteTemplateId).PlanDirectiveRegionId;
            this.planId = Number(this.appService.objPlanDirectiveDetails.favoriteTemplateId);
        }

        this.filter = false;
        this.isCreateTemplateDisabled = false;
        this.orderId = this.appService.objPlanDirectiveDetails.currentOrderID;
        this.patient = new Patient();
        this.patient.Name = this.appService.objPlanDirectiveDetails.patientName;
        this.patientFirstNameCharacter = this.appService.objPlanDirectiveDetails.firstCharacter;
        this.patientLastNameCharacter = this.appService.objPlanDirectiveDetails.lastCharacter;
        this.patient.ID = this.appService.objPlanDirectiveDetails.patientId;
    }

    // Get Patient name and id
    getPatientNameAndId(): void {
        this.planDirectiveTemplateDetailsService.getPatientByOrderId(this.orderId).subscribe(
            data => {
                this.patient = data as Patient;
                this.patientNames = this.patient.Name.split(' ');
                for (let index = 0; index < this.patientNames.length; index++) {
                    if (index === 0) {
                        this.patientLastNameCharacter = (this.patientNames[index])[0].toUpperCase();
                    } else {
                        this.patientFirstNameCharacter = (this.patientNames[index])[0].toUpperCase();
                    }
                }
                this.appService.objPlanDirectiveDetails.patientName = this.patient.Name;
                this.appService.objPlanDirectiveDetails.firstCharacter = this.patientFirstNameCharacter;
                this.appService.objPlanDirectiveDetails.lastCharacter = this.patientLastNameCharacter;
                this.appService.objPlanDirectiveDetails.patientId = this.patient.ID;
            }
        );
    }

    searchSite() {
        this.anatomicalSiteFilter = '';
        this.searchSiteName = !this.searchSiteName;
    }

    searchTemplate() {
        this.pdtFilter = '';
        this.searchTemplateName = !this.searchTemplateName;
    }

    templateSelected(plantemplate: PlanDirectiveTemplate, isFavourite: boolean) {
        if (isFavourite) {
            this.planTemplateService.deleteFavouriteTemplate(
                plantemplate.PlanDirectiveSiteID, plantemplate.PlanDirectiveTemplateID).subscribe(() => {
                    const favBackup = JSON.parse(this.appService.objPlanDirectiveDetails.favoriteTemplatesBackup);
                    for (let index = this.appService.objPlanDirectiveDetails.favoriteTemplates.length - 1; index >= 0; index--) {
                        const element = this.appService.objPlanDirectiveDetails.favoriteTemplates[index];
                        if (element.PlanDirectiveTemplateID === Number(plantemplate.PlanDirectiveTemplateID)) {
                            this.appService.objPlanDirectiveDetails.favoriteTemplates.splice(index, 1);
                            break;
                        }
                    }

                    for (let index = favBackup.length - 1; index >= 0; index--) {
                        const element = favBackup[index];
                        if (element.PlanDirectiveTemplateID === Number(plantemplate.PlanDirectiveTemplateID)) {
                            favBackup.splice(index, 1);
                            break;
                        }
                    }
                    this.appService.objPlanDirectiveDetails.favoriteTemplatesBackup = JSON.stringify(favBackup);
                    this.FavouriteTemplateCB(plantemplate.PlanDirectiveSiteID);
                });
        } else {
            this.planTemplateService.addFavouriteTemplate(
                plantemplate.PlanDirectiveSiteID, plantemplate.PlanDirectiveTemplateID, this.selectedregionId).subscribe(() => {
                    const favBackup = JSON.parse(this.appService.objPlanDirectiveDetails.favoriteTemplatesBackup);
                    const template = new PlanDirectiveTemplate(0, 'Planning Directive without a template', 0, false, 0);
                    template.IsFavourite = true;
                    template.PlanDirectiveRegionId = this.selectedregionId;
                    template.PlanDirectiveSiteID = plantemplate.PlanDirectiveSiteID;
                    template.PlanDirectiveTemplateID = plantemplate.PlanDirectiveTemplateID;
                    template.PlanDirectiveTemplateName = plantemplate.PlanDirectiveTemplateName;
                    this.appService.objPlanDirectiveDetails.favoriteTemplates.push(template);
                    favBackup.push(template);
                    this.appService.objPlanDirectiveDetails.favoriteTemplatesBackup = JSON.stringify(favBackup);
                    this.FavouriteTemplateCB(plantemplate.PlanDirectiveSiteID);
                });
        }
    }

    FavouriteTemplateCB(selectedSiteId) {
        // this.getFavouriteTemplate(selectedSiteId);
        this.plantemplates = [];
        this.planTemplateService.getTemplatesBySiteId(selectedSiteId).subscribe(data => {
            let tempPlantemplates: PlanDirectiveTemplate[] = [];
            this.plantemplates.push(new PlanDirectiveTemplate(0, 'Planning Directive without a template', 0, false, 0));
            tempPlantemplates = data as PlanDirectiveTemplate[];
            this.appService.objPlanDirectiveDetails.templates = this.plantemplates;
            this.plantemplates = this.plantemplates.concat(tempPlantemplates);
        });
    }

    getFavouriteTemplate(selectedSiteId: number) {
        this.planTemplateService.getFavouriteTemplates(selectedSiteId).subscribe((data) => {
            this.appService.objPlanDirectiveDetails.favoriteTemplates = data as PlanDirectiveTemplate[];
            this.appService.objPlanDirectiveDetails.favoriteTemplatesBackup =
                JSON.stringify(this.appService.objPlanDirectiveDetails.favoriteTemplates);
        });
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

    openModal() {
        this.clearDataOnLoad();
        // Fetch data from backend
        // this.planDirectiveTemplateDetailsService.GetStructureCollection().subscribe(
        //   data => {
        //     // assign data to data model
        //     this.StructureCollection = data as StructureModel[];
        //     for (let index = 0; index < this.StructureCollection.length; index++) {
        //       const structure = this.StructureCollection[index];
        //       structure.Name = 'ABCD';
        //     }
        //   }
        // );
        $('#modal').modal('show');




    }

    selectStrucutre(structure: StructureModel) {
        this.isStrucutreSelected = true;
        this.selectedStructure = structure;
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

    updateStrucutreName(structure: StructureModel, structureName: string, position: number) {
        structure.Name = structureName;
        // for (let index = 0; index < this.selectedStructureCollection.length; index++) {
        //   const seletedStrucutre = this.selectedStructureCollection[index];
        //   if (position === index) {
        //     seletedStrucutre.Name = structureName;
        //     break;
        //   }
        // }
    }
    undoSelectedStrucutre() {
        if (this.isStrucutreSelected === true) {
            this.isStrucutreSelected = false;
        }
    }

    getSiteNameBySiteId(selectedSiteId: number) {
        for (let index = 0; index < this.sites.length; index++) {
            const site = this.sites[index];
            if (site.PlanDirectiveSiteID === selectedSiteId) {
                this.siteName = site.PlanDirectiveSiteName;
                break;
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

    onSearch(value) {
        value ? this.isSiteClicked = false : this.isSiteClicked = true;
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

    clearDataOnLoad() {
        this.page = 0;
        this.isStrucutreSelected = false;
        this.selectedStructureCollection = [];
        this.selectedStructure = new StructureModel();
        this.phaseTargets = [];
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
            this.treatmentInstruction.AnatomicalRegion = this.getRegionName(this.selectedregionId);
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

    /**
    * Find selected region name using region id
    * @param regionId selected region's region id
    */
    getRegionName(regionId: number): string {
        // find from list of regions stored at service level using region id
        return this.appService.objPlanDirectiveDetails.regions.find(
            li => li.PlanDirectiveRegionID === Number(regionId)).PlanDirectiveRegionName;
    }

    setFavroutiesByRegionId(regionId: number) {
        this.getActualFavouriteTemplateList();
        const favrourites = this.appService.objPlanDirectiveDetails.favoriteTemplates;
        const newFav: PlanDirectiveTemplate[] = [];
        for (let index = 0; index < favrourites.length; index++) {
            const element = favrourites[index];
            if (element.PlanDirectiveRegionId === Number(regionId)) {
                newFav.push(element);
            }
        }
        this.appService.objPlanDirectiveDetails.favoriteTemplates = newFav;
    }

    setFavroutiesOfSelectedRegionRadio() {
        this.getActualFavouriteTemplateList();
        const favrourites = this.appService.objPlanDirectiveDetails.favoriteTemplates;
        const newFav: PlanDirectiveTemplate[] = [];
        for (let index = 0; index < favrourites.length; index++) {
            const element = favrourites[index];
            if (element.PlanDirectiveRegionId !== 6) {
                newFav.push(element);
            }
        }
        this.appService.objPlanDirectiveDetails.favoriteTemplates = newFav;
    }

    getActualFavouriteTemplateList() {
        this.appService.objPlanDirectiveDetails.favoriteTemplates =
            JSON.parse(this.appService.objPlanDirectiveDetails.favoriteTemplatesBackup);
    }

    clearFilter() {
        this.getActualFavouriteTemplateList();
    }

    removeAllFilter() {
        if (this.selectedSiteId) {
            this.setFavouriteTemplateBySiteId(this.selectedSiteId);
        } else if (Number(this.selectedregionId) > 0) {
            this.setFavroutiesByRegionId(this.selectedregionId);
        } else if (this.selectedregionId === 0) {
            this.setFavroutiesOfSelectedRegionRadio();
        } else if (this.selectedregionId === undefined) {
            this.appService.objPlanDirectiveDetails.favoriteTemplates = [];
        }
    }

    showAndHideFavouriteFilter() {

        if (this.appService.objPlanDirectiveDetails.favoriteTemplateId) {
            this.isFavoriteTemplateClicked = false;
            this.appService.objPlanDirectiveDetails.favoriteTemplateId = null;
            // this.appService.objPlanDirectiveDetails.selectedRegionID = '0';
            // this.appService.objPlanDirectiveDetails.selectedSiteID = '0';
            this.selectedSiteId = 0;
        }

        this.filter = !this.filter;
        if (this.filter) {
            this.clearFilter();
        } else {
            this.removeAllFilter();
        }
    }
}




