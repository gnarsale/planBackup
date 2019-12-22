export class PlanDirectiveTemplate {
    constructor(public PlanDirectiveTemplateID: number, public PlanDirectiveTemplateName: string,
        public PlanDirectiveSiteID: number, public IsFavourite: boolean, public PlanDirectiveRegionId: number) {
        this.PlanDirectiveTemplateID = PlanDirectiveTemplateID;
        this.PlanDirectiveTemplateName = PlanDirectiveTemplateName;
        this.PlanDirectiveSiteID = PlanDirectiveSiteID;
        this.IsFavourite = IsFavourite;
        this.PlanDirectiveRegionId = PlanDirectiveRegionId;
    }
}

