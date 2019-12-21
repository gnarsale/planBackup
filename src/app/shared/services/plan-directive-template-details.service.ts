import { Injectable } from '@angular/core';
import { DataServiceService } from 'src/app/shared/services/data-service.service';

@Injectable({
  providedIn: 'root'
})
export class PlanDirectiveTemplateDetailsService {

  constructor(private dataService: DataServiceService) { }

  GetStructureCollection() {
    return this.dataService.GetStructureCollection();
  }

  getTemplateByTemplateId(templateId: number, orderId: string, isModifyTemplate: boolean ) {
    return this.dataService.getTemplateDetailsByTemplateId(templateId, orderId, isModifyTemplate);
  }

  saveTemplate(strTemplate: string, OrderId: string, TemplateId: number, SiteId: number) {
    return this.dataService.saveTemplate(strTemplate, OrderId, TemplateId, SiteId);
  }

  submitTemplate(objSubmit: object) {
    return this.dataService.submitTemplate(objSubmit);
  }

  SaveAsTemplate(strTemplate: string, OrderId: string, TemplateName: string, siteId: number, templateId: number) {
    return this.dataService.SaveAsTemplate(strTemplate, OrderId, TemplateName, siteId, templateId);
  }

  getPatientByOrderId(orderId: string) {
    return this.dataService.getPatientByOrderId(orderId);
  }

  getSiteNameById(siteId: string, templateId: string) {
    return this.dataService.getSiteNameById(siteId, templateId);
  }

  getStructureSetIdByorderId(orderId: string) {
    return this.dataService.getStructureSetIdByOrderId(orderId);
  }

  isAllImagesRecived(orderId: string) {
    return this.dataService.isAllImagesRecived(orderId);
  }
}
