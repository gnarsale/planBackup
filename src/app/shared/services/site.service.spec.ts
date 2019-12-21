import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { SiteService } from './site.service';
//import { HttpClient } from 'selenium-webdriver/http';

describe('SiteService', () => {
  let siteService: SiteService;
  let dataService: DataServiceService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule],
      providers: [SiteService,DataServiceService]
    });
    siteService = TestBed.get(SiteService);
    dataService = TestBed.get(DataServiceService);
  });

  it('should be created', inject([SiteService], (service: SiteService) => {
    expect(service).toBeTruthy();
  }));

  it('getSiteByRegionId from webAPI', () => {
    spyOn(dataService, 'getSitesByRegionId').and.returnValue(true);
    siteService.getSiteByRegionId(1);
    expect(dataService.getSitesByRegionId).toHaveBeenCalled();
  });
});
