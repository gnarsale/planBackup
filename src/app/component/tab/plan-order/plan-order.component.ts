import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, OnDestroy, AfterViewInit } from '@angular/core';
import { PlanOrderService } from 'src/app/shared/services/plan-order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanOrderModel } from 'src/app/shared/models/plan-order.model';
import { OrderPriority } from 'src/app/shared/models/order-priority.model';
import { StatusEnum } from 'src/app/shared/models/status-enum.enum';
import { DateformatPipe } from 'src/app/shared/pipe/dateformat.pipe';
import { ConfirmationService } from 'src/../node_modules/primeng/api';
import { AppService } from 'src/app/shared/helpers/app-service';
import { PlanDirectiveTreatmentDetails } from 'src/app/shared/models/plan-Directive-Treatment-Details';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { ToastsManager } from 'src/../node_modules/ng6-toastr/ng2-toastr';
import { TemplateIdandSiteId } from 'src/app/shared/models/templateid-and-siteid';

@Component({
  selector: 'app-plan-order',
  templateUrl: './plan-order.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./plan-order.component.scss']
})

export class PlanOrderComponent implements OnInit, AfterViewInit {

  templatesiteid: TemplateIdandSiteId;
  email: boolean;
  displayDialog: boolean;
  display = false;
  clientName: string;
  physicianEmail: string;
  planOrder: PlanOrderModel;
  isPlaceOrderDisabled = true;
  isDeleteDisabled = true;
  selectedPlanOrder: PlanOrderModel;
  status = '';
  machineID: Array<string> = [];
  planOrders: PlanOrderModel[] = [];
  statusOptions: string[];
  priorityOptions: OrderPriority[];
  selectedRows: PlanOrderModel[];
  isPhysicianEmailValid = false;
  dates = new DateformatPipe;
  // Banner Label Text
  bannerLabel = 'Planning Orders';
  orderId = '';
  value: string;
  planNotesBackup = '';
  planStage = '';
  statusCode = '';
  enableAdvancedSearch: Boolean = false;
  planFilter = { PatientDetails: { searchInput: '' }, MachineID: '', StructureSetID: '', PlanPriority: '', Status: '' };
  styleConfigured: string;
  planNotes = '';
  orderNumberPattern = '';

  @ViewChild('closeNotes') closeAddNotes: ElementRef;

  statusKeys(): Array<string> {
    const keys = Object.keys(StatusEnum);
    return keys.slice(keys.length / 2);
  }

  set editMode(value: boolean) {
    this.planorderservice.editMode = value;
  }

  constructor(private appService: AppService, private toastmr: ToastsManager,
    private confirmationService: ConfirmationService, private planorderservice: PlanOrderService,
    private router: Router, private route: ActivatedRoute,
    private dataServiceService: DataServiceService, private clientService: ClientService) {
    this.planOrders = [];
    this.getConfiguredStyle();
    this.getRouteParameters();
    dataServiceService.getUrl().subscribe(data => {
      this.orderNumberPattern = data['OrderNumberPattern'].toString();
    });

  }

  ngOnInit() {
    this.getPriorityandStatusList();
  }

  ngAfterViewInit() {
    this.getPlans();
    this.clientService.planOrders.subscribe(msg => {
      this.planOrders = msg['Data'];
    });
  }

  // ngOnDestroy() {
  //   this.clientService.planOrders.unsubscribe();
  //   this.clientService.planOrders.complete();
  // }

  getPriorityandStatusList(): void {
    this.appService.objPlanDirectiveDetails = new PlanDirectiveTreatmentDetails();
    this.getAllMachineID();
    this.getPriority();
    this.statusOptions = Object.keys(StatusEnum).map(itm => StatusEnum[itm]);
  }

  /**
   * This function reads the orderId from url
   */
  getRouteParameters(): void {
    if (this.route !== null || this.route !== undefined) {
      // subscribe to route.params and read orderId from route parameters
      this.route.params.subscribe(params => {
        // assign orderId to class variable
        this.orderId = params['orderId'];
      });
    }
  }

  /**
   * Fetch priority list from database
   */
  getPriority(): void {
    this.planorderservice.getPriority()
      .subscribe(
        data => {
          // assign priority list to data model
          this.priorityOptions = data as OrderPriority[];
        },
        err => {

        });
  }

  /**
   * Get all the order from database
   */
  getPlans(): void {
    this.planorderservice.getAllPlanOrders()
      .subscribe(
        data => {
          this.planOrders = [];
          this.planOrders = data as PlanOrderModel[];

          for (let i = 0; i < this.planOrders.length; i++) {
            if (this.planOrders[i] && this.planOrders[i].DueDate !== null) {
              this.planOrders[i].DueDate = this.dates.transform(this.planOrders[i].DueDate.split('(').pop().split(')').shift());
              this.planOrders[i].LastUpdated = this.dates.transform(this.planOrders[i].LastUpdated.split('(').pop().split(')').shift());
            }
          }
          // show ascending direction icon on priority column by default
          // document.getElementById('prioritySortIcon').getElementsByTagName('i')[0].className += ' pi-sort-up';


        },
        err => {
          this.toastmr.error('Error while fetching plan order, please try after sometime.', 'Error!');
        });
  }

  /**
   * Get the index by status name
   * @param status status name
   */
  findIndexOfStatus(status: string): number {
    for (let i = 0; i < this.statusOptions.length; i++) {
      if (status === this.statusOptions[i]) {
        return i + 1;
      }
    }
  }

  /**
   * Update Priority for plan order in database
   * @param value selected priority value to be update in database
   * @param planOrder selected rowData for which priority is to be updated
   */
  onPriorityChange(value: string, planOrder: PlanOrderModel): void {
    // unselected selected record in grid
    this.planOrders.forEach(order => {
      if (order.selected) {
        order.selected = false;
      }
    });

    // CHANGE priority in json object
    planOrder.PlanPriority = value === '0' ? 0 : Number(value);

    // update priority in db
    this.planorderservice.updatePriorityByOrderId(planOrder.PlanPriority, planOrder.PlanOrderId).subscribe(
      (success) => {
      },
      (error) => {
        this.toastmr.error('Some error occurred please set priority again', 'Error!');
      }
    );
  }

  /**
   * to update the order notes
   * @param planOrder order
   */
  selectNotes(planOrder: PlanOrderModel): void {
    this.planOrder = planOrder;
    this.planNotesBackup = planOrder.PlanNotes;
  }

  // TO Do Optimisation on this function to get only one order return istead of loading all orders
  savePlanNotes(planNotes: string, orderId: string): void {
    // close add notes modal popup
    this.closeAddNotes.nativeElement.click();
    this.planorderservice.updatePlanNotesByOrderId(planNotes, orderId).subscribe(
      (success) => {
      },
      (error) => {
        this.toastmr.error('Some error occurred please enter the notes again', 'Error!');
      }
    );
  }

  updateStatusByOrderId(planOrders: PlanOrderModel[], status: string) {
    for (let i = 0; i < planOrders.length; i++) {
      const planOrder = planOrders[i];
      planOrder.Status = this.findIndexOfStatus(status).toString();
      const orderID = planOrder.PlanOrderId;
      const orderstatus = planOrder.Status;
      for (let index = 0; index < this.planOrders.length; index++) {
        const order = this.planOrders[index];
        if (order.PlanOrderId === planOrder.PlanOrderId) {
          this.planOrders.splice(index, 1);
        }
      }
      this.planorderservice.addPlanOrderIntoOrderHistory(orderID, Number(orderstatus)).subscribe();
    }
  }

  /**
   * fetched machineId list from database
   */
  getAllMachineID(): void {
    this.planorderservice.getAllMachineID().subscribe(
      data => {
        this.machineID = data['MachineID'];
      }
    );
  }

  /**
  * Update machineId for plan order in database
  * @param machineId selected machineId value to be update in database
  * @param planOrder selected rowData for which machineId is to be updated
  */
  updateMachineId(planOrder: PlanOrderModel, machineId: string): void {
    // unselected selected record in grid
    this.planOrders.forEach(order => {
      if (order.selected) {
        order.selected = false;
      }
    });
    planOrder.MachineID = machineId;
    this.planorderservice.updateMachineIdByOrderId(planOrder.PlanOrderId, planOrder.MachineID).subscribe(
      (success) => {
      },
      (error) => {
        this.toastmr.error('Some error occurred please set the Machine Id again', 'Error!');
      }
    );
  }

  cancelNotes(planorder: PlanOrderModel): void {
    planorder.PlanNotes = this.planNotesBackup;
  }

  updateOrderHistory(): void {
    // Take confirmation from user to delete plan order
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete plan order?',
      accept: () => {
        // Update the status of the plan order after confirmation
        this.updateStatusByOrderId(this.selectedRows, 'Approved');
      }
    }
    );
  }

  orderSelected(selectedRows): void {
    this.selectedPlanOrder = selectedRows;

    /**
     * Do not delete below commented code
     * unComment below code and comment working code in case of multiple rowData selection in Plan Order grid
     */

    // let k = 0;
    // let d = 0;
    // for (let index = 0; index < this.selectedRows.length; index++) {
    //   const row = this.selectedRows[index];
    //   if (row.Status === 2) {
    //     k = k + 1;
    //   }
    //   if (row.Status === 1 || row.Status === 2) {
    //     d = d + 1;
    //   }
    // }
    // if (k === this.selectedRows.length && this.selectedRows.length !== 0) {
    //   this.isPlaceOrderDisabled = false;
    // } else {
    //   this.isPlaceOrderDisabled = true;
    // }
    // if (d === this.selectedRows.length && this.selectedRows.length !== 0) {
    //   this.isDeleteDisabled = false;
    // } else {
    //   this.isDeleteDisabled = true;
    // }

    // Comment below code and uncomment above code in case of multiple rowData selection in Plan Order grid
    if (selectedRows !== null) {
      this.isPlaceOrderDisabled = selectedRows.Status === '2' ? false : true;

      if (selectedRows.Status === '1' || selectedRows.Status === '2') {
        this.isDeleteDisabled = false;
      } else {
        this.isDeleteDisabled = true;
      }
    } else {
      this.isPlaceOrderDisabled = true;
      this.isDeleteDisabled = true;
    }
  }

  updateDirective(rowData: PlanOrderModel): void {
    this.planorderservice.getSiteAndTemplateIdByOrderId(rowData.PlanDirective).subscribe(
      data => {
        this.templatesiteid = data as TemplateIdandSiteId;
        if (this.templatesiteid) {
          this.router.navigate(
            ['/planning-directive-details',
              rowData.PlanOrderId,
              this.templatesiteid.templateId,
              this.templatesiteid.siteId
            ]);
        }
      }
    );
    this.editMode = true;
  }

  replaceTemplate(rowData: PlanOrderModel): void {
    this.router.navigate(
      ['/planning-directive-create', rowData.StructureSetID, rowData.PatientDetails.ID, rowData.PlanOrderId]);
  }

  removeTemplate(rowData: PlanOrderModel): void {
    this.planorderservice.deleteDirectiveByOrderId(rowData.PlanOrderId).subscribe(
      (success) => {
        this.toastmr.success('Plan directive removed successfully', 'Success!');
        this.getPlans();
      },
      (error) => {
        this.toastmr.error('Some error occurred please try again', 'Error!');
      }
    );
  }

  updatePlanFilterModel(updateProp: string): void {
    if (updateProp === 'status') {
      this.planFilter.Status = StatusEnum[this.statusCode] !== undefined ? StatusEnum[this.statusCode] : '';
    }
    if (updateProp === 'planStage') {
      this.planFilter.PlanPriority = this.planStage !== '' ? this.planStage : '';
    }
  }

  getConfiguredStyle(): void {
    this.dataServiceService.getConfiguredStyle().subscribe(
      data => {
        this.styleConfigured = data.configureStyle;
        if (this.styleConfigured !== 'oncology360' && this.styleConfigured !== 'varian') {
          this.styleConfigured = 'varian';
        }
      }
    );
  }

  noteUpdate(planNotes: string, planOrder: PlanOrderModel) {
    planOrder.PlanNotes = planNotes;
  }


}
