import { TestBed, inject } from '@angular/core/testing';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { PlanOrderService } from 'src/app/shared/services/plan-order.service';
import { HttpClientModule } from '@angular/common/http';
import { PlanOrderModel } from 'src/app/shared/models/plan-order.model';

describe('PlanOrderService', () => {

  let planOrderService: PlanOrderService;
  let dataService: DataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [PlanOrderService, DataServiceService]
    });

    planOrderService = TestBed.get(PlanOrderService);
    dataService = TestBed.get(DataServiceService);
  });

  it('should be created', inject([PlanOrderService], (service: PlanOrderService) => {
    expect(service).toBeTruthy();
  }));

  it('Fetch getAllPlanOrders from webAPI', () => {
    spyOn(dataService, 'getAllPlanOrders').and.returnValue(true);
    planOrderService.getAllPlanOrders();
    expect(dataService.getAllPlanOrders).toHaveBeenCalled();
  });

  it('Fetch getPriority from webAPI', () => {
    spyOn(dataService, 'getPriority').and.returnValue(true);
    planOrderService.getPriority();
    expect(dataService.getPriority).toHaveBeenCalled();
  });

  it('Fetch getAllMachineID from webAPI', () => {
    spyOn(dataService, 'getAllMachineID').and.returnValue(true);
    planOrderService.getAllMachineID();
    expect(dataService.getAllMachineID).toHaveBeenCalled();
  });

  it('UpdatePriorityByOrderId from webAPI', () => {
    spyOn(dataService, 'updatePriorityByOrderId').and.returnValue(true);
    planOrderService.updatePriorityByOrderId(1, 'OrderId_1');
    expect(dataService.updatePriorityByOrderId).toHaveBeenCalled();
  });

  it('UpdatePlanNotesByOrderId from webAPI', () => {
    spyOn(dataService, 'updatePlanNotesByOrderId').and.returnValue(true);
    planOrderService.updatePlanNotesByOrderId('TestNote', 'OrderId_1');
    expect(dataService.updatePlanNotesByOrderId).toHaveBeenCalled();
  });

  it('AddPlanOrderIntoOrderHistory from webAPI', () => {
    spyOn(dataService, 'addPlanOrderIntoOrderHistory').and.returnValue(true);
    planOrderService.addPlanOrderIntoOrderHistory('TestNote', 1);
    expect(dataService.addPlanOrderIntoOrderHistory).toHaveBeenCalled();
  });

  it('IsPhysicianEmailValid from webAPI', () => {
    spyOn(dataService, 'IsPhysicianEmailValid').and.returnValue(true);
    planOrderService.IsPhysicianEmailValid('TestEmailId');
    expect(dataService.IsPhysicianEmailValid).toHaveBeenCalled();
  });

  it('UpdateMachineIdByOrderId from webAPI', () => {
    spyOn(dataService, 'updateMachineIdByOrderId').and.returnValue(true);
    planOrderService.updateMachineIdByOrderId('Order_1', 'Machine_1');
    expect(dataService.updateMachineIdByOrderId).toHaveBeenCalled();
  });

  it('UpdateClientNameAndPhysicianEmail from webAPI', () => {
    spyOn(dataService, 'updateClientNameAndPhysicianEmail').and.returnValue(true);
    planOrderService.updateClientNameAndPhysicianEmail('Client_1', 'test@test.com', 'Order_1');
    expect(dataService.updateClientNameAndPhysicianEmail).toHaveBeenCalled();
  });

  it('getSiteAndTemplateIdByOrderId from webAPI', () => {
    spyOn(dataService, 'getSiteAndTemplateIdByOrderId').and.returnValue(true);
    planOrderService.getSiteAndTemplateIdByOrderId('Template_1');
    expect(dataService.getSiteAndTemplateIdByOrderId).toHaveBeenCalled();
  });

  it('deleteDirectiveByOrderId from webAPI', () => {
    spyOn(dataService, 'deleteDirectiveByOrderId').and.returnValue(true);
    planOrderService.deleteDirectiveByOrderId('Order_1');
    expect(dataService.deleteDirectiveByOrderId).toHaveBeenCalled();
  });

  it('CreateOrder from webAPI', () => {
    const mockPlanOrder: PlanOrderModel[] = [{
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true, DirectiveId: null
    }];
    spyOn(dataService, 'createOrder').and.returnValue(true);
    planOrderService.createOrder(mockPlanOrder);
    expect(dataService.createOrder).toHaveBeenCalled();
  });

});
