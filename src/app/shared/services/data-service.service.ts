import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlanOrderModel } from 'src/app/shared/models/plan-order.model';
import { OrderPriority } from 'src/app/shared/models/order-priority.model';
import { StructureModel } from 'src/app/shared/models/structure-model.model';
import { Observable } from 'rxjs';
import { AnatomicalRegion } from 'src/app/shared/models/anatomical-region.model';
import { Site } from 'src/app/shared/models/site.model';
import { PlanDirectiveTemplate } from 'src/app/shared/models/plan-directive-template.model';
import { PlanOrderHistoryModel } from 'src/app/shared/models/plan-order-history.model';
import { environment } from 'src/environments/environment';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';
import { Patient } from 'src/app/shared/models/patient.model';
import { TemplateNameAndSiteName } from 'src/app/component/plan/plan-directive-details/template-and-site-name.model';
import { OARs } from 'src/app/shared/models/oars.model';
import { IRegion } from 'src/app/shared/models/iregion';
import { TemplateIdandSiteId } from 'src/app/shared/models/templateid-and-siteid';
import { PlanOrderDetails } from 'src/app/shared/models/plan-order-details.model';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  CHAT_URL = '';
  constructor(private http: HttpClient) {
    this.getUrl().subscribe(data => {
      const baseUrl = data['webAPIUrl'];
      this.CHAT_URL = data['WesbSocketConnectionUrl'];
      environment.webAPIBasePath = baseUrl;
    });

  }

  /**
   * Read goal intellinse elemtns from json file
   */
  getIntellisenseElements(): Observable<Object> {
    const url = 'assets/data/intellisense.json';
    return this.http.get(url);
  }

  GetStructureCollection(): Observable<StructureModel[]> {
    const url = environment.webAPIBasePath + 'PlanDirective/GetTargetsList';
    // const url = 'assets/data/structure.json';
    return this.http.get<StructureModel[]>(url);
  }

  getAllPlanOrders(): Observable<PlanOrderModel[]> {
    const url = environment.webAPIBasePath + 'PlanOrder/GetPlanOrder';
    // const url = 'assets/data/plan-order.json';
    // const url = "assets/XML/planOrder.json";
    return this.http.get<PlanOrderModel[]>(url);
  }

  getPriority(): Observable<OrderPriority[]> {
    const url = environment.webAPIBasePath + 'PlanDirective/GetAllPriority';
    return this.http.get<OrderPriority[]>(url);
  }

  getAllRegions(): Observable<AnatomicalRegion[]> {
    const url = environment.webAPIBasePath + 'plandirective/GetAllRegions';
    return this.http.get<[AnatomicalRegion]>(url);
  }

  getSitesByRegionId(regionId): Observable<Site[]> {
    const url = environment.webAPIBasePath + 'plandirective/GetPlanDirectiveSites?regionId=' + regionId;
    return this.http.get<[Site]>(url);
  }

  getTemplatesBySiteId(siteId): Observable<PlanDirectiveTemplate[]> {
    const url = environment.webAPIBasePath + 'plandirective/GetPlanDirectiveTemplates?siteId=' + siteId;
    return this.http.get<[PlanDirectiveTemplate]>(url);
  }

  updatePriorityByOrderId(priority: number, orderId: string) {
    const url = environment.webAPIBasePath + '/PlanOrder/UpdatePlanPriorityByOrderId';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { data: { PlanPriority: priority, PlanOrderId: orderId } };
    return this.http.post(url, body, { headers });
  }

  updatePlanNotesByOrderId(planNotes: string, orderId: string) {
    const url = environment.webAPIBasePath + '/PlanOrder/UpdatePlanNotesByOederId';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { data: { planOrderId: orderId, planNotes: planNotes } };
    return this.http.post(url, body, { headers });
  }

  getTemplateDetailsByTemplateId(templateId: number, orderId: string, isModifyTemplate: boolean) {
    const url = environment.webAPIBasePath + 'PlanDirective/GetXMLTemplate?templateId='
      + templateId + '&orderId=' + orderId + '&isModifyTemplate=' + isModifyTemplate;
    const templateDetail = this.http.get<string>(url);
    return templateDetail;
  }

  // get all completd order of current patientMRN
  getCompletedOrderList(orderId: string) {
    const url = environment.webAPIBasePath + 'planorder/GetCompletedOrderListByPatientMRN?orderId=' + orderId;
    const orderlist = this.http.get<Array<string>>(url);
    return orderlist;
  }

  getAllPlanOrderHistory(): Observable<PlanOrderHistoryModel[]> {
    const url = environment.webAPIBasePath + 'PlanOrder/GetPlanOrderHistory';
    return this.http.get<PlanOrderHistoryModel[]>(url);
  }

  saveTemplate(strTemplate: string, OrderId: string, TemplateId: number, SiteId: number) {
    const url = environment.webAPIBasePath + 'plandirective/SaveTemplate';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    const body = { request: { data: strTemplate, orderId: OrderId, templateId: TemplateId, templatename: '', siteId: SiteId } };
    return this.http.post(url, body, { headers });
  }

  submitTemplate(objSubmit: any) {
    objSubmit = objSubmit as PlanOrderDetails;
    const url = environment.webAPIBasePath + 'PlanOrder/SaveAndSubmitOrder';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    const body = {
      request: {
        PlanNotes: objSubmit.PlanNotes,
        PhysicianEmail: objSubmit.PhysicianEmail,
        ClientLastName: objSubmit.ClientLastName,
        MachineID: objSubmit.MachineID,
        PlanPriority: objSubmit.PlanPriority,
        PlanOrderId: objSubmit.PlanOrderId,
        Template: objSubmit.Template,
        TemplateId: objSubmit.TemplateId,
        TemplateName: objSubmit.TemplateName,
        PriorityName: objSubmit.PriorityName,
        RePlanChecked: objSubmit.RePlanChecked,
        completedOrderId: objSubmit.completedOrderId
      }
    };

    return this.http.post(url, body, { headers });
  }

  addPlanOrderIntoOrderHistory(planOrderId: string, planStatus: number) {
    const url = environment.webAPIBasePath + 'PlanOrder/UpdatePlanStatusByOrderId';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { data: { planOrderId: planOrderId, planStatus: planStatus } };
    return this.http.post(url, body, { headers });
  }

  getAllMachineID(): Observable<Array<string>> {
    const url = 'assets/data/machinesId.json';
    return this.http.get<Array<string>>(url);
  }

  IsPhysicianEmailValid(email: string) {
    const url = environment.webAPIBasePath + 'PlanOrder/IsPhysicianEmailValid';
    return this.http.get(url, { params: { physicianEmail: email } }).map(res => res);
  }

  updateMachineIdByOrderId(orderId: string, machineId: string) {
    const url = environment.webAPIBasePath + 'PlanOrder/UpdateMachineId';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { updatemachineId: { PlanOrderId: orderId, MachineId: machineId } };
    return this.http.post(url, body, { headers });
  }

  SaveAsTemplate(strTemplate: string, OrderId: string, TemplateName: string, siteId: number, templateId: number) {
    const url = environment.webAPIBasePath + 'plandirective/SaveAsTemplate';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { request: { data: strTemplate, orderId: OrderId, templatename: TemplateName, siteId: siteId, templateId: templateId } };
    return this.http.post(url, body);
  }

  createOrder(Orders: PlanOrderModel[]) {
    const PlanOrders = [];
    for (let index = 0; index < Orders.length; index++) {
      const order = Orders[index];
      const orders = {
        DueDate: order.DueDate,
        LastUpdated: order.LastUpdated,
        MachineID: order.MachineID,
        PatientDetails: order.PatientDetails,
        Physician: order.Physician,
        PlanDirective: order.PlanDirective,
        PlanNotes: order.PlanNotes,
        PlanOrderId: order.PlanOrderId,
        PlanPriority: order.PlanPriority,
        Status: order.Status,
        StructureSetID: order.StructureSetID
      };
      PlanOrders.push(orders);
    }
    const url = environment.webAPIBasePath + 'PlanOrder/CreatePlanOrder';
    // let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { PlanOrders };
    return this.http.post(url, body);
  }

  getOrderIdByStructureSetId(structureSetId: string, patientId: string): Observable<string> {
    const url = environment.webAPIBasePath + 'PlanOrder/ReturnOrderIdByStrutureId';
    const result = this.http.get<string>(url, {
      params: {
        structureSetId: structureSetId,
        patientId: patientId
      }
    });
    return result;
  }

  getPatientByOrderId(orderId: string): Observable<Patient> {
    const url = environment.webAPIBasePath + 'plandirective/GetPatientNameByOrderId';
    const result = this.http.get<Patient>(url, {
      params: {
        orderId: orderId
      }
    });
    return result;
  }

  getSiteNameById(siteId: string, templateId: string): Observable<TemplateNameAndSiteName> {
    const url = environment.webAPIBasePath + 'plandirective/GetSiteNameBySiteId';
    return this.http.get<TemplateNameAndSiteName>(url, {
      params: {
        siteId: siteId,
        templateId: templateId
      }
    });
  }

  updateClientNameAndPhysicianEmail(clientName: string, physicianEmail: string, orderId: string): Observable<string> {
    const url = environment.webAPIBasePath + 'PlanOrder/UpdateClientNameAndEmail';
    return this.http.get<string>(url, { params: { clientName: clientName, physicianEmail: physicianEmail, orderId: orderId } });
  }

  getSiteAndTemplateIdByOrderId(templateName: string): Observable<TemplateIdandSiteId> {
    const url = environment.webAPIBasePath + 'plandirective/GetTemplateIdAndSiteIdByOrderId';
    return this.http.get<TemplateIdandSiteId>(url, {
      params: {
        templateName: templateName
      }
    });
  }

  deleteDirectiveByOrderId(orderId: string) {
    const url = environment.webAPIBasePath + 'PlanDirective/DeletePlanDirectiveByOrderId';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { request: { orderId: orderId } };
    return this.http.post(url, body, { headers });
  }

  getStructureSetIdByOrderId(orderId: string) {
    const url = environment.webAPIBasePath + 'PlanDirective/GetStructureSetIdByOrderId?orderId=' + orderId;
    return this.http.get(url);
  }

  addFavouriteTemplate(siteId: number, templateId: number, regionId: number) {
    const url = environment.webAPIBasePath + 'plandirective/AddFavouriteTemplate';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { request: { siteId: siteId, templateId: templateId, regionId: regionId } };
    return this.http.post(url, body);
  }

  deleteFavouriteTemplate(siteId: number, templateId: number) {
    const url = environment.webAPIBasePath + 'plandirective/DeleteFavouriteTemplate';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { request: { siteId: siteId, templateId: templateId } };
    return this.http.post(url, body, { headers });
  }

  getFavouriteTemplates(siteId: number): Observable<PlanDirectiveTemplate[]> {
    const url = environment.webAPIBasePath + 'plandirective/GetFavouriteTemplates?siteId=' + siteId;
    return this.http.get<PlanDirectiveTemplate[]>(url);
  }

  getConfiguredStyle(): Observable<any> {
    const url = 'assets/data/style-configuration.json';
    return this.http.get<any>(url);
  }

  getOARs(): Observable<OARs> {
    const url = 'assets/XML/oar.json';
    return this.http.get<any>(url);
  }

  getUrl(): Observable<string> {
    return this.http.get<string>('assets/data/url.json');
  }

  getSelectRegions(): Observable<IRegion[]> {
    const url = 'assets/data/regions.json';
    return this.http.get<IRegion[]>(url);
  }
  getGoalPriority(): Observable<any> {
    const url = 'assets/data/goal-priority.json';
    return this.http.get<any>(url);
  }
  isAllImagesRecived(orderId: string): Observable<number> {
    const url = environment.webAPIBasePath + 'plandirective/AllImagesRecivedOrNot';
    return this.http.get<number>(url, {
      params: {
        orderId: orderId
      }
    });
  }

  getMessageSettings(): Observable<any> {
    const url = 'assets/data/message-setting.json';
    return this.http.get<any>(url);
  }
}

