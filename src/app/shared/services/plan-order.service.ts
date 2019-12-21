import { Injectable } from '@angular/core';
import { PlanOrderModel } from 'src/app/shared/models/plan-order.model';
import { DataServiceService } from 'src/app/shared/services/data-service.service';

@Injectable({
  providedIn: 'root'
})
export class PlanOrderService {

  planOrders: PlanOrderModel[] = [];
  editMode = false;

  constructor(private dataservice: DataServiceService) { }

  getAllPlanOrders() {
    return this.dataservice.getAllPlanOrders();
  }

  getPriority() {
    return this.dataservice.getPriority();
  }

  updatePriorityByOrderId(priority: number, orderId: string) {
    return this.dataservice.updatePriorityByOrderId(priority, orderId);
  }

  updatePlanNotesByOrderId(planNotes: string, orderId: string) {
    return this.dataservice.updatePlanNotesByOrderId(planNotes, orderId);
  }

  addPlanOrderIntoOrderHistory(planOrderId: string, planStatus: number) {
    return this.dataservice.addPlanOrderIntoOrderHistory(planOrderId, planStatus);
  }

  getAllMachineID() {
    return this.dataservice.getAllMachineID();
  }
  
  
  getCompletedorderList(orderid:string) {
    return this.dataservice.getCompletedOrderList(orderid);
  }

  IsPhysicianEmailValid(email: string) {
    return this.dataservice.IsPhysicianEmailValid(email);
  }

  updateMachineIdByOrderId(orderId: string, machineId: string) {
    return this.dataservice.updateMachineIdByOrderId(orderId, machineId);
  }

  createOrder(order: PlanOrderModel[]) {
    return this.dataservice.createOrder(order);
  }

  updateClientNameAndPhysicianEmail(clientName: string, physicianEmail: string, orderId: string) {
    return this.dataservice.updateClientNameAndPhysicianEmail(clientName, physicianEmail, orderId);
  }

  getSiteAndTemplateIdByOrderId(templateName: string) {
    return this.dataservice.getSiteAndTemplateIdByOrderId(templateName);
  }

  deleteDirectiveByOrderId(orderId: string) {
    return this.dataservice.deleteDirectiveByOrderId(orderId);
  }

}
