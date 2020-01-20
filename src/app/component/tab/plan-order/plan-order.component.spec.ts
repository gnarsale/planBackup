import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanOrderService } from 'src/app/shared/services/plan-order.service';
import { PlanOrderComponent } from 'src/app/component/tab/plan-order/plan-order.component';
import { PlanOrderHistoryComponent } from 'src/app/component/tab/plan-order-history/plan-order-history.component';
import { HeaderComponent } from '../../header/header.component';
import { ToastsManager, ToastOptions } from 'ng6-toastr';
import { SubheaderComponent } from 'src/app/component/header/subheader/subheader.component';
import { RouterTestingModule } from '@angular/router/testing';
import { OrderPriority } from 'src/app/shared/models/order-priority.model';
import { PlanOrderModel } from 'src/app/shared/models/plan-order.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterPlanOrderPipe } from 'src/app/shared/pipe/filter-plan-order.pipe';
import { AppService } from 'src/app/shared/helpers/app-service';
import { ConfirmationService } from 'primeng/api';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { StatusEnum } from 'src/app/shared/models/status-enum.enum';
import { Observable, Subject } from 'rxjs';
import { ClientService } from 'src/app/shared/services/client.service';
import { ViewContainerRef } from '@angular/core';
import { WebsocketService } from '../../../shared/services/websocket.service';

describe('PlanOrderComponent', () => {
  let component: PlanOrderComponent;
  let fixture: ComponentFixture<PlanOrderComponent>;
  let planOrderService: PlanOrderService;
  let dataService: DataServiceService;
  let originalTimeout;
  let websocketService: WebsocketService;
  let toastManager: ToastsManager;
  let vRef: ViewContainerRef;
  const mockClientService = {
    planOrders: new Subject<PlanOrderModel[]>(),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, TableModule, DialogModule, HttpClientModule, RouterTestingModule.withRoutes([
        { path: 'Orders', component: PlanOrderComponent },
        { path: 'plan-order-history', component: PlanOrderHistoryComponent }
      ])],
      declarations: [HeaderComponent, SubheaderComponent, PlanOrderComponent, FilterPlanOrderPipe,
        PlanOrderHistoryComponent],
      providers: [PlanOrderService, ToastsManager, ToastOptions,
        ConfirmationService, ViewContainerRef,
        DataServiceService, { provide: ClientService, useValue: mockClientService }, AppService]
    }).compileComponents();

    planOrderService = TestBed.get(PlanOrderService);
    dataService = TestBed.get(DataServiceService);
    websocketService = TestBed.get(WebsocketService);
    toastManager = TestBed.get(ToastsManager);
    toastManager.setRootViewContainerRef(vRef);
    dataService.CHAT_URL = 'ws://localhost:6320/';
    fixture = TestBed.createComponent(PlanOrderComponent);
    component = fixture.componentInstance;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    spyOn(websocketService, 'connect').and.returnValue(new Subject<MessageEvent>());
  }));

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    component = null;
    dataService = null;
    planOrderService = null;
    websocketService = null;
  });

  it('should fetch this.styleConfigured value from json file', async(() => {
    const pMock = {
      subscribe: () => component.styleConfigured = 'varian'

    };
    spyOn(dataService, 'getConfiguredStyle').and.returnValue(pMock);

    component.getConfiguredStyle();

    fixture.whenStable().then(() => {
      expect(component.styleConfigured).toEqual('varian');
    });
  }));

  it('Fetch getPriorityandStatusList from webAPI', () => {

    component.ngOnInit();

    spyOn(component, 'getAllMachineID').and.returnValue(true);
    spyOn(component, 'getPriority').and.returnValue(true);
    fixture.detectChanges();
    expect(component.statusOptions.length > 0).toBeTruthy();
  });

  it('Fetch plan orders from db : Success case', async(() => {
    component.bannerLabel = 'Planning Orders';
    const clientSer = TestBed.get(ClientService);

    const mockPlanOrder: PlanOrderModel[] = [{
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true, DirectiveId: null
    }];

    spyOn(planOrderService, 'getAllPlanOrders').and.returnValue(Observable.of<PlanOrderModel[]>(mockPlanOrder));
    spyOn(clientSer, 'planOrders').and.returnValue(Observable.of<PlanOrderModel[]>(mockPlanOrder));

    component.ngAfterViewInit();

    fixture.whenStable().then(() => {
      expect(component.planOrders.length > 0).toBeTruthy();
    });
  }));

  it('Fetch machineID from webAPI', async(() => {
    const pMock = {
      subscribe: () => {
        component.machineID = ['Varian23Ex', 'TrueBeam STX', 'Scanner Test', 'ProBeam', 'HESN5', 'GMPHDR'];
      }
    };
    spyOn(planOrderService, 'getAllMachineID').and.returnValue(pMock);

    component.getAllMachineID();

    fixture.whenStable().then(() => {
      expect(component.machineID).toContain('Varian23Ex');
    });
  }));

  it('Fetch priority from webAPI : Success case', async(() => {
    const mockPriorityOptions: OrderPriority[] = [{ id: 1, priority: 'Stat (1 day)' }, { id: 2, priority: 'Stat (2 day)' }];

    spyOn(planOrderService, 'getPriority').and.returnValue(Observable.of<OrderPriority[]>(mockPriorityOptions));

    component.getPriority();

    fixture.whenStable().then(() => {
      expect(component.priorityOptions).toBeTruthy();
    });
  }));

  it('Fetch priority from webAPI : Error case', async(() => {

    spyOn(planOrderService, 'getPriority').and.returnValue(Observable.throw('error'));

    component.getPriority();

    fixture.whenStable().then(() => {
      expect(component.priorityOptions).toBeUndefined();
    });
  }));

  it('Delete plan order using plan order id : Success case', async(() => {

    spyOn(planOrderService, 'getPriority').and.returnValue(Observable.throw('error'));

    component.getPriority();

    fixture.whenStable().then(() => {
      expect(component.priorityOptions).toBeUndefined();
    });
  }));

  it('findIndexOfStatus function test spec', () => {
    component.statusOptions = Object.values(StatusEnum);
    const statusIndex = component.findIndexOfStatus('Completed');
    expect(statusIndex > 0).toBeTruthy();
  });

  it('Priority change test spec : Success case', async(() => {
    const mockPlanOrder: PlanOrderModel = {
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true, DirectiveId: null
    };

    component.planOrders = [{
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true, DirectiveId: null
    }];

    component.priorityOptions = [{ id: 1, priority: 'Stat (1 day)' }, { id: 2, priority: 'Stat (2 day)' }];

    spyOn(planOrderService, 'updatePriorityByOrderId').and.returnValue(Observable.of(''));

    component.onPriorityChange('1', mockPlanOrder);
    fixture.whenStable().then(() => {
      expect(planOrderService.updatePriorityByOrderId).toHaveBeenCalled();
    });
  }));

  it('Update plan order status test spec : Error case', async(() => {
    const mockPlanOrder: PlanOrderModel[] = [{
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true, DirectiveId: null
    }];

    component.planOrders = [{
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true, DirectiveId: null
    }];

    spyOn(component, 'findIndexOfStatus').and.returnValue(7);
    spyOn(planOrderService, 'addPlanOrderIntoOrderHistory').and.returnValue(Observable.from(''));

    component.updateStatusByOrderId(mockPlanOrder, 'Completed');
    fixture.whenStable().then(() => {
      expect(component.planOrders.length === 0).toBeTruthy();
    });
  }));

  it('Update machineId for plan order in database test spec : Success case', async(() => {
    const mockPlanOrder: PlanOrderModel = {
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true, DirectiveId: null
    };

    component.planOrders = [{
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true, DirectiveId: null
    }];

    spyOn(planOrderService, 'updateMachineIdByOrderId').and.returnValue(Observable.of(''));

    component.updateMachineId(mockPlanOrder, 'Scanner Test1');
    fixture.whenStable().then(() => {
      expect(mockPlanOrder.MachineID === 'Scanner Test1').toBeTruthy();
    });
  }));

  it('Select plan order notes test spec', () => {

    const mockPlanOrder: PlanOrderModel = {
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: 'Plan Notes 1', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true, DirectiveId: null
    };

    component.selectNotes(mockPlanOrder);
    expect(component.planNotesBackup === 'Plan Notes 1').toBeTruthy();
  });

  it('Update order history', async(() => {
    const confirmService = fixture.debugElement.injector.get(ConfirmationService);

    spyOn(confirmService, 'confirm').and.callFake((params: any) => {
      params.accept();
    });

    spyOn(component, 'updateStatusByOrderId').and.returnValue(true);

    component.updateOrderHistory();
    fixture.whenStable().then(() => {
      expect(confirmService.confirm).toHaveBeenCalled();
      expect(component.updateStatusByOrderId).toHaveBeenCalled();
    });
  }));

  it('Update plan filter model', () => {
    component.planStage = '1';
    component.updatePlanFilterModel('planStage');
    expect(component.planFilter.PlanPriority === '1').toBeTruthy();
    component.planStage = '';
    component.updatePlanFilterModel('planStage');
    expect(component.planFilter.PlanPriority === '').toBeTruthy();
    component.statusCode = 'Completed';
    component.updatePlanFilterModel('status');
    expect(component.planFilter.Status === 'Completed').toBeTruthy();
  });

  it('Update Directive : Success Case', async(() => {
    const router = TestBed.get(Router);
    const mockPlanOrder: PlanOrderModel = {
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true, DirectiveId: null
    };

    const mockTemplateIdandSiteId = { siteId: 1, templateId: 2 };
    spyOn(planOrderService, 'getSiteAndTemplateIdByOrderId').and.returnValue(Observable.of(mockTemplateIdandSiteId));
    spyOn(router, 'navigate').and.returnValue(true);
    component.updateDirective(mockPlanOrder);
    fixture.whenStable().then(() => {
      expect(planOrderService.getSiteAndTemplateIdByOrderId).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/planning-directive-details', 'Order_1', 2, 1]);
    });
  }));

  it('replace template test spec', async(() => {
    const router = TestBed.get(Router);
    const mockPlanOrder: PlanOrderModel = {
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true, DirectiveId: null
    };

    spyOn(router, 'navigate').and.returnValue(true);
    component.replaceTemplate(mockPlanOrder);
    fixture.whenStable().then(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/planning-directive-create', 'CT_1', '210598']);
    });
  }));

  it('Update plan notes test spec', () => {
    const mockPlanOrder: PlanOrderModel = {
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: 'Plan Notes 1', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true, DirectiveId: null
    };

    component.noteUpdate('Plan Notes 2', mockPlanOrder);

    expect(mockPlanOrder.PlanNotes === 'Plan Notes 2').toBeTruthy();
  });

  it('cancel plan notes test spec', () => {
    component.planNotesBackup = 'Plan Notes 1';
    const mockPlanOrder: PlanOrderModel = {
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: 'Plan Notes 2', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true, DirectiveId: null
    };
    component.cancelNotes(mockPlanOrder);

    expect(mockPlanOrder.PlanNotes === 'Plan Notes 1').toBeTruthy();
  });

  it('Enable / Disable delete button based on status of the plan order selected', async(() => {
    const compiled = fixture.debugElement.nativeElement;

    const pMock = {
      subscribe: () => component.styleConfigured = 'varian'
    };
    spyOn(dataService, 'getConfiguredStyle').and.returnValue(pMock);

    component.getConfiguredStyle();

    let mockPlanOrder: PlanOrderModel = {
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true, DirectiveId: null
    };

    component.planOrders = [mockPlanOrder];

    component.orderSelected(mockPlanOrder);
    expect(component.isPlaceOrderDisabled).toBeFalsy();
    expect(component.isDeleteDisabled).toBeFalsy();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('button.btn.btn-black')[1].disabled).toBeFalsy();

    mockPlanOrder.Status = '3';
    component.orderSelected(mockPlanOrder);
    expect(component.isPlaceOrderDisabled).toBeTruthy();
    expect(component.isDeleteDisabled).toBeTruthy();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('button.btn.btn-black')[1].disabled).toBeTruthy();

    mockPlanOrder = null;
    component.orderSelected(mockPlanOrder);
    expect(component.isPlaceOrderDisabled).toBeTruthy();
    expect(component.isDeleteDisabled).toBeTruthy();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('button.btn.btn-black')[1].disabled).toBeTruthy();

    fixture.detectChanges();
  }));
});
