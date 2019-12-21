import { Injectable } from '@angular/core';
import { DataServiceService } from 'src/app/shared/services/data-service.service';

@Injectable({
  providedIn: 'root'
})

export class PlanDirectiveTemplateService {

  constructor(private dataservice: DataServiceService) { }

  getTemplatesBySiteId(siteId: number) {
    return this.dataservice.getTemplatesBySiteId(siteId);
  }

  getOrderIdByStructureSetId(structureSetId: string, patientId: string) {
    return this.dataservice.getOrderIdByStructureSetId(structureSetId, patientId);
  }

  addFavouriteTemplate(selectedSiteId: number, PlanDirectiveTemplateID: number, regionId: number) {
    return this.dataservice.addFavouriteTemplate(selectedSiteId, PlanDirectiveTemplateID, regionId);
  }

  deleteFavouriteTemplate(selectedSiteId: number, PlanDirectiveTemplateID: number) {
    return this.dataservice.deleteFavouriteTemplate(selectedSiteId, PlanDirectiveTemplateID);
  }

  getFavouriteTemplates(selectedSiteId: number) {
    return this.dataservice.getFavouriteTemplates(selectedSiteId);
  }

  /**
   * Fetch the OAR's List from json file
   */
  getOARs() {
    return this.dataservice.getOARs();
  }
}
