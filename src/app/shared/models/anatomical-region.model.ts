export class AnatomicalRegion {
    PlanDirectiveRegionID: number;
    PlanDirectiveRegionName: string;
    IsVisible: boolean;

    constructor(PlanDirectiveRegionID: number, PlanDirectiveRegionName: string, IsVisible: boolean) {
        this.PlanDirectiveRegionID = PlanDirectiveRegionID;
        this.PlanDirectiveRegionName = PlanDirectiveRegionName;
        this.IsVisible = IsVisible;
    }

}
