import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AnatomicalRegionService } from './anatomical-region.service';
import { DataServiceService } from 'src/app/shared/services/data-service.service';

describe('AnatomicalRegionService', () => {
  let anatomicalRegionService: AnatomicalRegionService;
  let dataService: DataServiceService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [AnatomicalRegionService, HttpClient]
    });
    anatomicalRegionService = TestBed.get(AnatomicalRegionService);
    dataService = TestBed.get(DataServiceService);
  });

  it('should be created', inject([AnatomicalRegionService], (service: AnatomicalRegionService) => {
    expect(service).toBeTruthy();
  }));

  it('getAllRegions from webAPI', () => {
    spyOn(dataService, 'getAllRegions').and.returnValue(true);
    anatomicalRegionService.getAllRegions();
    expect(dataService.getAllRegions).toHaveBeenCalled();
  });
});
