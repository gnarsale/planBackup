import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { WebsocketService } from './websocket.service';
import { PlanOrderModel } from '../models/plan-order.model';
import { DataServiceService } from './data-service.service';
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  public planOrders = new Subject<PlanOrderModel[]>();
  wsService: WebsocketService;
  CHAT_URL = '';
  constructor(wsService: WebsocketService, dataService: DataServiceService) {
    this.CHAT_URL = dataService.CHAT_URL;
    this.planOrders = <Subject<PlanOrderModel[]>>wsService
      .connect(this.CHAT_URL)
      .map((response: MessageEvent): PlanOrderModel[] => {
        const data = JSON.parse(response.data);
        return data;
      });

  }
}


