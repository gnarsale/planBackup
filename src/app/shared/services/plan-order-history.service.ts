import { Injectable } from '@angular/core';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { PlanOrderHistoryModel } from 'src/app/shared/models/plan-order-history.model';

@Injectable({
  providedIn: 'root'
})
export class PlanOrderHistoryService {

  planOrderHistory: PlanOrderHistoryModel[] = [];

  constructor(private dataservice: DataServiceService) { }

  getAllPlanOrderHistory() {
    return this.dataservice.getAllPlanOrderHistory();
  }

}
