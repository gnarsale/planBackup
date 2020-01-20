import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanOrderService } from 'src/app/shared/services/plan-order.service';
import { PlanOrderComponent } from 'src/app/component/tab/plan-order/plan-order.component';
import { PlanOrderHistoryComponent } from 'src/app/component/tab/plan-order-history/plan-order-history.component';
import { HeaderComponent } from '../../header/header.component';
import { SubheaderComponent } from 'src/app/component/header/subheader/subheader.component';
import { RouterTestingModule } from '@angular/router/testing';
import { OrderPriority } from 'src/app/shared/models/order-priority.model';
import { PlanOrderModel } from 'src/app/shared/models/plan-order.model';
import { FormsModule } from '@angular/forms';
import { FilterPlanOrderPipe } from 'src/app/shared/pipe/filter-plan-order.pipe';
import { AppService } from 'src/app/shared/helpers/app-service';
import { ConfirmationService } from 'primeng/api';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { Observable } from 'rxjs';
import { ClientService } from 'src/app/shared/services/client.service';
import { PlanOrderHistoryService } from 'src/app/shared/services/plan-order-history.service';

describe('PlanOrderHistoryComponent', () => {
  let component: PlanOrderHistoryComponent;
  let fixture: ComponentFixture<PlanOrderHistoryComponent>;
  let dataService: DataServiceService;
  let planOrderService: PlanOrderService;
  let planOrderHistoryService: PlanOrderHistoryService;
  let originalTimeout;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, TableModule, DialogModule, HttpClientModule, RouterTestingModule.withRoutes([
        { path: 'plan-order-history', component: PlanOrderHistoryComponent }
      ])],
      declarations: [HeaderComponent, SubheaderComponent, PlanOrderComponent, FilterPlanOrderPipe,
        PlanOrderHistoryComponent],
      providers: [PlanOrderService,
        ConfirmationService, DataServiceService, ClientService, AppService]
    }).compileComponents();

    planOrderService = TestBed.get(PlanOrderService);
    dataService = TestBed.get(DataServiceService);
    planOrderHistoryService = TestBed.get(PlanOrderHistoryService);
    dataService.CHAT_URL = 'ws://localhost:6320/';
    fixture = TestBed.createComponent(PlanOrderHistoryComponent);
    component = fixture.componentInstance;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

  }));

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch this.styleConfigured value from json file', async(() => {
    spyOn(dataService, 'getConfiguredStyle').and.returnValue(Observable.of({ configureStyle: 'varian' }));
    component.getConfiguredStyle();
    fixture.whenStable().then(() => {
      expect(component.styleConfigured).toEqual('varian');
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

  it('Fetch plan order history from db : Success case', async(() => {

    const mockPlanOrder: PlanOrderModel[] = [{
      PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
      PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
      StructureSetID: 'CT_1', MachineID: 'Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
      GatewayID: 0, selected: false, active: true, DirectiveId: null
    }];

    spyOn(planOrderHistoryService, 'getAllPlanOrderHistory').and.returnValue(Observable.of<PlanOrderModel[]>(mockPlanOrder));

    component.ngAfterViewInit();

    fixture.whenStable().then(() => {
      expect(component.planOrderHistorys.length > 0).toBeTruthy();
    });
  }));

  it('Fetch plan order history from db : Error Case', async(() => {
    component.bannerLabel = 'Planning Order History';

    spyOn(planOrderHistoryService, 'getAllPlanOrderHistory').and.returnValue(Observable.throw('error'));

    component.getPlanOrderHistory();

    fixture.whenStable().then(() => {
      expect(component.planOrderHistorys).toBeUndefined();
    });
  }));

  it('should execute ngOnInit', async(() => {
    spyOn(component, 'getConfiguredStyle').and.returnValue(true);
    spyOn(component, 'getPriority').and.returnValue(true);
    spyOn(component, 'getPlanOrderHistory').and.returnValue(true);
    component.ngOnInit();
    fixture.whenStable().then(() => {
    expect(component.getConfiguredStyle).toHaveBeenCalled();
    expect(component.getPriority).toHaveBeenCalled();
    expect(component.getPlanOrderHistory).toHaveBeenCalled();
    });
    })); 

});
