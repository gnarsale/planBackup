import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DataServiceService } from './data-service.service';
import { observable, Observable } from 'rxjs';

describe('DataServiceService', () => {
  let dataService: DataServiceService;
  let httpClient: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [DataServiceService, HttpClient]
    });
    dataService = TestBed.get(DataServiceService);
    httpClient = TestBed.get(HttpClient);
  });

  it('should be created', inject([DataServiceService], (service: DataServiceService) => {
    expect(service).toBeTruthy();
  }));

  it('Fetch getAllPlanOrders from webAPI', () => {
    const mockPlanOrder = [{
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true
    }];
    spyOn(httpClient, 'get').and.returnValue(Observable.from(mockPlanOrder));
    dataService.getAllPlanOrders();
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('Fetch GetStructureCollection from webAPI', () => {
    const mockStructure = [{
      Meaning: "TestA", Code: "TestA", Name: "TestStructureA"
    }];
    spyOn(httpClient, 'get').and.returnValue(Observable.from(mockStructure));
    dataService.GetStructureCollection();
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('Fetch getPriority from webAPI', () => {
    const mockPriority = [{
      id: 1, Priority: "High"
    }];
    spyOn(httpClient, 'get').and.returnValue(Observable.from(mockPriority));
    dataService.getPriority();
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('Fetch getAllRegions from webAPI', () => {
    const mockRegions = [{
      PlanDirectiveRegionID: 1, PlanDirectiveRegionName: "SouthRegion", IsVisible: true
    }];
    spyOn(httpClient, 'get').and.returnValue(Observable.from(mockRegions));
    dataService.getAllRegions();
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('Fetch getAllRegions from webAPI', () => {
    const mockSite = [{
      PlanDirectiveSiteID: 1, PlanDirectiveSiteName: "SouthRegion", PlanDirectiveRegionID: 1
    }];
    spyOn(httpClient, 'get').and.returnValue(Observable.from(mockSite));
    dataService.getSitesByRegionId(1);
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('Fetch getTemplatesBySiteId from webAPI', () => {
    const mockPlanTemplate = [{
      PlanDirectiveTemplateID: 1, PlanDirectiveTemplateName: "TestTemplate", PlanDirectiveSiteID: 1, IsFavourite: true
    }];
    spyOn(httpClient, 'get').and.returnValue(Observable.from(mockPlanTemplate));
    dataService.getTemplatesBySiteId(1);
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('Fetch getTemplateDetailsByTemplateId from webAPI', () => {
    spyOn(httpClient, 'get').and.returnValue(Observable.from("Test"));
    dataService.getTemplateDetailsByTemplateId(1, "OrderId_1");
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('Fetch getAllPlanOrderHistory from webAPI', () => {
    const mockPlanOrderHistory = [{
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true
    }];
    spyOn(httpClient, 'get').and.returnValue(Observable.from(mockPlanOrderHistory));
    dataService.getAllPlanOrderHistory();
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('Fetch getAllMachineID from webAPI', () => {
    const mockMachineId = [{
      "MachineID": ["Varian23Ex", "TrueBeam STX", "Scanner Test", "ProBeam", "HESN5", "GMPHDR"]
    }]
    spyOn(httpClient, 'get').and.returnValue(Observable.from(mockMachineId));
    dataService.getAllMachineID();
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('UpdateMachineIdByOrderId from webAPI', () => {
    spyOn(httpClient, 'post').and.returnValue(true);
    dataService.updateMachineIdByOrderId("OrderId_1", "Machine_1");
    expect(httpClient.post).toHaveBeenCalled();
  });

  it('SaveAsTemplate from webAPI', () => {
    spyOn(httpClient, 'post').and.returnValue(true);
    dataService.SaveAsTemplate("TestTemplate", "OrderId_1", "Template_1", 1, 1);
    expect(httpClient.post).toHaveBeenCalled();
  });


  it('createOrder from webAPI', () => {
    const mockPlanOrder = [{
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true, DirectiveId: null
    }];
    spyOn(httpClient, 'post').and.returnValue(true);
    dataService.createOrder(mockPlanOrder);
    expect(httpClient.post).toHaveBeenCalled();
  });


  it('getOrderIdByStructureSetId from webAPI', () => {
    const mockOrderId = [{
      "OrderID": ["Order_1", "Order_2", "Order_3", "Order_4", "Order_5", "Order_6"]
    }]
    spyOn(httpClient, 'get').and.returnValue(Observable.from(mockOrderId));
    dataService.getOrderIdByStructureSetId("structure_1", "patient_1");
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('getPatientByOrderId from webAPI', () => {
    const mockPatient = [{
      ID: "patient_1", AnonymizedID: "Test_Patient1", Name: "TestName"
    }]
    spyOn(httpClient, 'get').and.returnValue(Observable.from(mockPatient));
    dataService.getPatientByOrderId("OrderId_1");
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('getSiteNameById from webAPI', () => {
    const mockSite = [{
      "Patient": [{ siteName: "test_Site", templateName: "test_Template" }]
    }]
    spyOn(httpClient, 'get').and.returnValue(Observable.from(mockSite));
    dataService.getSiteNameById("Site_1", "Template_1");
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('updateClientNameAndPhysicianEmail from webAPI', () => {
    const mockSite = [{
      "Patient": [{ siteName: "test_Site", templateName: "test_Template" }]
    }]
    spyOn(httpClient, 'get').and.returnValue(Observable.from(mockSite));
    dataService.updateClientNameAndPhysicianEmail("Client_1", "test@test.com", "Order_1");
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('deleteDirectiveByOrderId from webAPI', () => {
    spyOn(httpClient, 'post').and.returnValue(true);
    dataService.deleteDirectiveByOrderId("OrderId_1");
    expect(httpClient.post).toHaveBeenCalled();
  });

  it('addFavouriteTemplate from webAPI', () => {
    //const mockSite= [{siteName: "test_Site", templateName: "test_Template"}]
    spyOn(httpClient, 'post').and.returnValue(true);
    dataService.addFavouriteTemplate(2, 7, 1);
    expect(httpClient.post).toHaveBeenCalled();
  });

  it('getStructureSetIdByOrderId from webAPI', () => {
    spyOn(httpClient, 'get').and.returnValue(true);
    dataService.getStructureSetIdByOrderId('Order_1');
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('deleteFavouriteTemplate from webAPI', () => {
    spyOn(httpClient, 'post').and.returnValue(true);
    dataService.deleteFavouriteTemplate(1, 1);
    expect(httpClient.post).toHaveBeenCalled();
  });


  it('Fetch getFavouriteTemplates from webAPI', () => {
    const mockPlanDirectiveTemplate = [{ PlanDirectiveTemplateID: 1, PlanDirectiveTemplateName: "Test_1", PlanDirectiveSiteID: 1, IsFavourite: true }]
    spyOn(httpClient, 'get').and.returnValue(Observable.from(mockPlanDirectiveTemplate));
    dataService.getFavouriteTemplates(1);
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('Fetch getOARs from webAPI', () => {
    const mockStructure = {
      "Structure": [
        {
          "Id": "OAR1",
          "Code": "14544",
          "Schema": "FMA",
          "SchemaVersion": "3.2",
          "Meaning": "Kidney Combined",
          "Name": "Kidney Combined"
        },
        {
          "Id": "OAR2",
          "Code": "14544",
          "Schema": "FMA",
          "SchemaVersion": "3.2",
          "Meaning": "Spinal Cord",
          "Name": "Spinal Cord"
        }]
    }
    const mockOARs = [{ Structure: Array(mockStructure) }]
    spyOn(httpClient, 'get').and.returnValue(Observable.from(mockOARs));
    dataService.getOARs();
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('Fetch getSelectRegions from webAPI', () => {
    const mockRegion = [{ name: "South", value: "s" }]
    spyOn(httpClient, 'get').and.returnValue(Observable.from(mockRegion));
    dataService.getSelectRegions();
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('Fetch getGoalPriority from webAPI', () => {
    const mockGoalPriority = {
      "Goal-Priority": [{
        "Name": "1-Must",
        "Value": "1"
      },
      {
        "Name": "2-Very Important",
        "Value": "2"
      }]
    }
    const mockPriority = [{ GoalPriority: Array(mockGoalPriority) }]
    spyOn(httpClient, 'get').and.returnValue(Observable.from(mockPriority));
    dataService.getGoalPriority();
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('Fetch getIntellisenseElements from webAPI', () => {
    const mockStates = {
      "states": [
        {
          "key": "DMin",
          "id": 1
        },
        {
          "key": "DMax",
          "id": 2
        }]
    }
    const mockStates1 = [{ GoalPriority: Array(mockStates) }]
    spyOn(httpClient, 'get').and.returnValue(Observable.from(mockStates1));
    dataService.getIntellisenseElements();
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('updatePriorityByOrderId from webAPI', () => {
    spyOn(httpClient, 'post').and.returnValue(true);
    dataService.updatePriorityByOrderId(1, "OrderId_1");
    expect(httpClient.post).toHaveBeenCalled();
  });

  it('updatePlanNotesByOrderId from webAPI', () => {
    spyOn(httpClient, 'post').and.returnValue(true);
    dataService.updatePlanNotesByOrderId("Plan Notes", "OrderId_1");
    expect(httpClient.post).toHaveBeenCalled();
  });

  it('saveTemplate from webAPI', () => {
    spyOn(httpClient, 'post').and.returnValue(true);
    dataService.saveTemplate("Template", "OrderId_1", 1, 1);
    expect(httpClient.post).toHaveBeenCalled();
  });

  it('submitTemplate from webAPI', () => {
    const mockPlanDetails = [{
      PlanNotes: "Test Notes", PhysicianEmail: "test@test.com", ClientLastName: "TestName",
      MachineID: "Machine_1", PlanPriority: 1, PlanOrderId: "Order_1", Template: "Template_1", TemplateId: 1, TemplateName: "TestTemplate"
    }]
    spyOn(httpClient, 'post').and.returnValue(mockPlanDetails);
    dataService.submitTemplate(mockPlanDetails);
    expect(httpClient.post).toHaveBeenCalled();
  });

  it('addPlanOrderIntoOrderHistory from webAPI', () => {
    spyOn(httpClient, 'post').and.returnValue(true);
    dataService.addPlanOrderIntoOrderHistory("OrderId_1", 1);
    expect(httpClient.post).toHaveBeenCalled();
  });

  it('IsPhysicianEmailValid from webAPI', () => {
    const mockEmailId = [{ EmailID: "test@test.com" }]
    spyOn(httpClient, 'get').and.returnValue(mockEmailId);
    dataService.IsPhysicianEmailValid("test@test.com");
    expect(httpClient.get).toHaveBeenCalled();
  });

  it('getSiteAndTemplateIdByOrderId from webAPI', () => {
    const mockSiteTemplate = [{ siteId: 1, templateId: 1 }]
    spyOn(httpClient, 'get').and.returnValue(mockSiteTemplate);
    dataService.getSiteAndTemplateIdByOrderId("TestTemplate");
    expect(httpClient.get).toHaveBeenCalled();
  });
});
