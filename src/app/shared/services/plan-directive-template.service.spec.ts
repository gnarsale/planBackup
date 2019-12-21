import { TestBed, inject, async } from '@angular/core/testing';
import { PlanDirectiveTemplateService } from './plan-directive-template.service';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { HttpClientModule } from '@angular/common/http';

describe('PlanDirectiveTemplateService', () => {
  let dataService: DataServiceService;
  let planDirectiveTemplateService: PlanDirectiveTemplateService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [PlanDirectiveTemplateService, DataServiceService]

    });
  }));
  beforeEach(() => {

    dataService = TestBed.get(DataServiceService);
    planDirectiveTemplateService = TestBed.get(PlanDirectiveTemplateService);
  });
  it('should be created', inject([PlanDirectiveTemplateService], (service: PlanDirectiveTemplateService) => {
    expect(service).toBeTruthy();
  }));

  it('should fetch templates by site id', () => {
    spyOn(dataService, 'getTemplatesBySiteId').and.returnValue(true);
    planDirectiveTemplateService.getTemplatesBySiteId(1);
    expect(dataService.getTemplatesBySiteId).toHaveBeenCalled();
  });

  it('should fetch OrderId by StructureSetId', () => {
    spyOn(dataService, 'getOrderIdByStructureSetId').and.returnValue(true);
    planDirectiveTemplateService.getOrderIdByStructureSetId('CT_1', 'Eclipse-03');
    expect(dataService.getOrderIdByStructureSetId).toHaveBeenCalled();
  });

  it('should add new favrourite template using template and site id', () => {
    spyOn(dataService, 'addFavouriteTemplate').and.returnValue(true);
    planDirectiveTemplateService.addFavouriteTemplate(2, 7, 1);
    expect(dataService.addFavouriteTemplate).toHaveBeenCalled();
  });


  it('should delete from favrourite template using template and site id', () => {
    spyOn(dataService, 'deleteFavouriteTemplate').and.returnValue(true);
    planDirectiveTemplateService.deleteFavouriteTemplate(1, 3);
    expect(dataService.deleteFavouriteTemplate).toHaveBeenCalled();
  });

  it('should fetch all favrourite template using site id', () => {
    spyOn(dataService, 'getFavouriteTemplates').and.returnValue(true);
    planDirectiveTemplateService.getFavouriteTemplates(1);
    expect(dataService.getFavouriteTemplates).toHaveBeenCalled();
  });

  it('should fetch all th Organs from database', () => {
    spyOn(dataService, 'getOARs').and.returnValue(true);
    planDirectiveTemplateService.getOARs();
    expect(dataService.getOARs).toHaveBeenCalled();
  });
});
