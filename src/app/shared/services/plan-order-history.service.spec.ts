import { TestBed, inject } from '@angular/core/testing';
import { PlanOrderHistoryService } from './plan-order-history.service';
import { HttpClientModule } from '@angular/common/http';
import { DataServiceService } from 'src/app/shared/services/data-service.service';

describe('PlanOrderHistoryService', () => {
  let planOrderHistoryService: PlanOrderHistoryService;
  let dataService: DataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports:[HttpClientModule],
      providers: [PlanOrderHistoryService,DataServiceService]
    });

    planOrderHistoryService = TestBed.get(PlanOrderHistoryService);
    dataService = TestBed.get(DataServiceService);
  });

  it('should be created', inject([PlanOrderHistoryService], (service: PlanOrderHistoryService) => {
    expect(service).toBeTruthy();
  }));

  it('getAllPlanOrderHistory from webAPI', () => {
    spyOn(dataService, 'getAllPlanOrderHistory').and.returnValue(true);
    planOrderHistoryService.getAllPlanOrderHistory();
    expect(dataService.getAllPlanOrderHistory).toHaveBeenCalled();
  });
});
