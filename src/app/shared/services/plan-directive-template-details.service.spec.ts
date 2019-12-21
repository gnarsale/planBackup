import { TestBed, inject, async } from '@angular/core/testing';
import { PlanDirectiveTemplateDetailsService } from './plan-directive-template-details.service';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { HttpClientModule } from '@angular/common/http';
describe('PlanDirectiveTemplateDetailsService', () => {
  let dataService: DataServiceService;
  let planDirectiveTemplateDetailsService: PlanDirectiveTemplateDetailsService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [PlanDirectiveTemplateDetailsService, DataServiceService]
    });
  }));

  beforeEach(() => {
    dataService = TestBed.get(DataServiceService);
    planDirectiveTemplateDetailsService = TestBed.get(PlanDirectiveTemplateDetailsService);
  });
  it('should be created', inject([PlanDirectiveTemplateDetailsService], (service: PlanDirectiveTemplateDetailsService) => {
    expect(service).toBeTruthy();
  }));

  it('should fetch StructureCollection ', () => {
    spyOn(dataService, 'GetStructureCollection').and.returnValue(true);
    planDirectiveTemplateDetailsService.GetStructureCollection();
    expect(dataService.GetStructureCollection).toHaveBeenCalled();
  });

  it('should fetch template details using template id and orderid from database  ', () => {
    spyOn(dataService, 'getTemplateDetailsByTemplateId').and.returnValue(true);
    planDirectiveTemplateDetailsService.getTemplateByTemplateId(1, 'Order_1');
    expect(dataService.getTemplateDetailsByTemplateId).toHaveBeenCalled();
  });

  it('should save the instance of template based on orderId ', () => {
    spyOn(dataService, 'saveTemplate').and.returnValue(true);
    planDirectiveTemplateDetailsService.saveTemplate('Order_1', 'template1', 1, 3);
    expect(dataService.saveTemplate).toHaveBeenCalled();
  });
  it('should fetch StructureCollection ', () => {
    spyOn(dataService, 'submitTemplate').and.returnValue(true);

    const objSubmit = {
      PlanNotes: 'Notes',
      PhysicianEmail: 'xyz@ganil.com',
      ClientLastName: 'ClientLastName',
      MachineID: 'Machine1',
      PlanPriority: 1,
      PlanOrderId: 'Order_1',
      Template: 'Template 1',
      TemplateId: 2,
      TemplateName: 'Oral SCC',
      PriorityName: 'Stat'
    };
    planDirectiveTemplateDetailsService.submitTemplate(objSubmit);
    expect(dataService.submitTemplate).toHaveBeenCalled();
  });

  it('should save the instance of template with provided template name based on orderId ', () => {
    spyOn(dataService, 'SaveAsTemplate').and.returnValue(true);
    planDirectiveTemplateDetailsService.SaveAsTemplate('Template Data', 'Order_1', 'Template 1', 3, 3);
    expect(dataService.SaveAsTemplate).toHaveBeenCalled();
  });

  it('should fetch patient details by orderId ', () => {
    spyOn(dataService, 'getPatientByOrderId').and.returnValue(true);
    planDirectiveTemplateDetailsService.getPatientByOrderId('Order_1');
    expect(dataService.getPatientByOrderId).toHaveBeenCalled();
  });

  it('should fetch site name and template name using site id and template id ', () => {
    spyOn(dataService, 'getSiteNameById').and.returnValue(true);
    planDirectiveTemplateDetailsService.getSiteNameById('3', '4');
    expect(dataService.getSiteNameById).toHaveBeenCalled();
  });

  it('should fetch structureSet lable using orderId ', () => {
    spyOn(dataService, 'getStructureSetIdByOrderId').and.returnValue(true);
    planDirectiveTemplateDetailsService.getStructureSetIdByorderId('Order_1');
    expect(dataService.getStructureSetIdByOrderId).toHaveBeenCalled();
  });
});
