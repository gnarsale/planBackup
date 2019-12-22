import { Site } from 'src/app/shared/models/site.model';
import { AnatomicalRegion } from 'src/app/shared/models/anatomical-region.model';
import { PlanDirectiveTemplate } from 'src/app/shared/models/plan-directive-template.model';

export class PlanDirectiveTreatmentDetails {
    currentOrderID = '';
    structureSetId = '';
    patientId = '';
    selectedSiteID = '';
    selectedRegionID = '0';
    sites: Site[] = [];
    regions: AnatomicalRegion[] = [];
    templates: PlanDirectiveTemplate[] = [];
    favoriteTemplates: PlanDirectiveTemplate[] = [];
    isBackButtonPressed = false;
    regionType: string;
    templateId: string;
    firstCharacter: string;
    lastCharacter: string;
    patientName: string;
    favoriteTemplateId: string;
    favoriteTemplatesBackup: string;
}
