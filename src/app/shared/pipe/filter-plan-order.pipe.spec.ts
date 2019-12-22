import { FilterPlanOrderPipe } from 'src/app/shared/pipe/filter-plan-order.pipe';
import { PlanOrderModel } from 'src/app/shared/models/plan-order.model';

describe('FilterPlanOrderPipe', () => {
    let filterPlanOrderPipe: FilterPlanOrderPipe;
let  mockPlanOrder: PlanOrderModel[];
let planFilter: any;
    // synchronous beforeEach
    beforeEach(() => {
        filterPlanOrderPipe = new FilterPlanOrderPipe();
         mockPlanOrder = [
            {
            PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 1,
            PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '210598', 'Name': 'Ruffin Abdullah', 'AnonymizedID': '' },
            StructureSetID: 'CT_1', MachineID: 'CT Scanner Test', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '1',
            GatewayID: 0, selected: false, active: true, DirectiveId: null
          }, {
            PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
            PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '327849', 'Name': 'Sam Bond', 'AnonymizedID': '' },
            StructureSetID: 'ProBeam', MachineID: 'Varian3xM', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '2',
            GatewayID: 0, selected: false, active: true, DirectiveId: null
          }, {
            PlanDirective: 'Create Directive', Physician: 'REMOTE-RO', PlanPriority: 2,
            PlanNotes: '', PlanOrderId: 'Order_1', PatientDetails: { 'ID': '456748', 'Name': 'Sonu Kumar', 'AnonymizedID': '' },
            StructureSetID: 'CT_2', MachineID: 'CT Scanner', LastUpdated: '05/12/2018', DueDate: '05/12/2018', Status: '3',
            GatewayID: 0, selected: false, active: true, DirectiveId: null
          }];
          planFilter = { PatientDetails: { searchInput: '' }, MachineID: '', StructureSetID: '', PlanPriority: '', Status: '' };
    });
    it('create an instance', () => {
        const pipe = new FilterPlanOrderPipe();
        expect(pipe).toBeTruthy();
      });

      it('should return the filter order based on multiple filter options', () => {
      planFilter.MachineID = 'CT Scanner';
      let filteredOrders = filterPlanOrderPipe.transform(mockPlanOrder, planFilter);
      expect(filteredOrders).toBeTruthy();
      expect(filteredOrders.length).toEqual(2);
    planFilter.StructureSetID = 'CT_';
       filteredOrders = filterPlanOrderPipe.transform(mockPlanOrder, planFilter);
      expect(filteredOrders).toBeTruthy();
      expect(filteredOrders.length).toEqual(2);

      planFilter.PlanPriority = 2;
       filteredOrders = filterPlanOrderPipe.transform(mockPlanOrder, planFilter);
      expect(filteredOrders).toBeTruthy();
      expect(filteredOrders.length).toEqual(1);

      planFilter.Status = 3;
       filteredOrders = filterPlanOrderPipe.transform(mockPlanOrder, planFilter);
      expect(filteredOrders).toBeTruthy();
      expect(filteredOrders.length).toEqual(1);
      });
      it('should return the filter order based on StructureSetId provided', () => {
        planFilter.StructureSetID = 'CT_';
        const filteredOrders = filterPlanOrderPipe.transform(mockPlanOrder, planFilter);
        expect(filteredOrders).toBeTruthy();
        expect(filteredOrders.length).toEqual(2);
      });
      it('should return the filter order based on PlanPriority provided', () => {
        planFilter.PlanPriority = 2;
        const filteredOrders = filterPlanOrderPipe.transform(mockPlanOrder, planFilter);
        expect(filteredOrders).toBeTruthy();
        expect(filteredOrders.length).toEqual(2);
      });
      it('should return the filter order based on Status provided', () => {
        planFilter.Status = 1;
        const filteredOrders = filterPlanOrderPipe.transform(mockPlanOrder, planFilter);
        expect(filteredOrders).toBeTruthy();
        expect(filteredOrders.length).toEqual(1);
      });
      it('should return the filter order based on Patient ID provided', () => {
        planFilter.PatientDetails.searchInput = '327849';
        const filteredOrders = filterPlanOrderPipe.transform(mockPlanOrder, planFilter);
        expect(filteredOrders).toBeTruthy();
        expect(filteredOrders.length).toEqual(1);
      });
      it('should return the filter order based on Patient name provided', () => {
        planFilter.PatientDetails.searchInput = 'S';
        const filteredOrders = filterPlanOrderPipe.transform(mockPlanOrder, planFilter);
        expect(filteredOrders).toBeTruthy();
        expect(filteredOrders.length).toEqual(2);
      });


      it('should return the all order if we not use filter option', () => {
        planFilter.MachineID = '';
        const filteredOrders = filterPlanOrderPipe.transform(mockPlanOrder, planFilter);
        expect(filteredOrders).toBeTruthy();
        expect(filteredOrders.length).toEqual(3);
        });

      it('should return the zero order if we provide wrong filter data', () => {
        planFilter.MachineID = 'pqr';
        const filteredOrders = filterPlanOrderPipe.transform(mockPlanOrder, planFilter);
        expect(filteredOrders).toBeTruthy();
        expect(filteredOrders.length).toEqual(0);
        });
   });
