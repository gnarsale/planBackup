import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { PlanOrderHistoryService } from 'src/app/shared/services/plan-order-history.service';
import { PlanOrderHistoryModel } from 'src/app/shared/models/plan-order-history.model';
import { StatusEnum } from 'src/app/shared/models/status-enum.enum';
import { OrderPriority } from 'src/app/shared/models/order-priority.model';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { PlanOrderService } from 'src/app/shared/services/plan-order.service';
import { DateformatPipe } from 'src/app/shared/pipe/dateformat.pipe';
import { ClientService } from 'src/app/shared/services/client.service';

@Component({
  selector: 'app-plan-order-history',
  templateUrl: './plan-order-history.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./plan-order-history.component.scss']
})

export class PlanOrderHistoryComponent implements OnInit, AfterViewInit {
  displayDialog: boolean;
  planOrderHistory: PlanOrderHistoryModel;
  planOrderHistorys: PlanOrderHistoryModel[];
  statusOptions: string[];
  priorityOptions: OrderPriority[];
  dates = new DateformatPipe;
  bannerLabel = 'Order History';
  styleConfigured: string;

  constructor(private planOrderHistoryService: PlanOrderHistoryService, private dataServiceService: DataServiceService,
    private planorderservice: PlanOrderService, private clientService: ClientService) { }

  ngOnInit() {
    this.getConfiguredStyle();
    const statusOption = Object.keys(StatusEnum);
    this.statusOptions = statusOption.slice(statusOption.length / 2);
    this.getPriority();
    this.getPlanOrderHistory();
  }

  // fetch priority list from db
  getPriority(): void {
    this.planorderservice.getPriority()
      .subscribe(
        data => {
          this.priorityOptions = data as OrderPriority[];
        },
        err => {

        });
  }
  ngAfterViewInit() {
    this.getPlanOrderHistory();
    this.clientService.planOrders.subscribe(msg => {
      console.log('Response from Web socket: ' + JSON.stringify(msg['Data']));
      this.planOrderHistory = msg['Data'];
    });
  }
  // get plan orders history
  getPlanOrderHistory() {
    this.planOrderHistoryService.getAllPlanOrderHistory().subscribe(data => {
      this.planOrderHistorys = data as PlanOrderHistoryModel[];
      for (let i = 0; i < this.planOrderHistorys.length; i++) {
        this.planOrderHistorys[i].DueDate = this.dates
          .transform(this.planOrderHistorys[i].DueDate.split('(').pop().split(')').shift());
        this.planOrderHistorys[i].LastUpdated = this.dates
          .transform(this.planOrderHistorys[i].LastUpdated.split('(').pop().split(')').shift());
      }
    },
      err => {
        //this.hideLoader = true;
        //this.msgService.emitChange({ Message: 'Error while fetching plan order, please try after sometime.', isError: true });
      });
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
}
