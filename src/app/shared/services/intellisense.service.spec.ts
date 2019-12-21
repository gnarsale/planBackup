import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { IntellisenseService } from './intellisense.service';
import { HttpClientModule } from '@angular/common/http';

describe('IntellisenseService', () => {
  let dataServ: DataServiceService;
  let intelliServ: IntellisenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [IntellisenseService, DataServiceService]
    });

    dataServ = TestBed.get(DataServiceService);
    intelliServ = TestBed.get(IntellisenseService);
  });

  it('should be created', inject([IntellisenseService], (service: IntellisenseService) => {
    expect(service).toBeTruthy();
  }));

  it('Fetch intellisense data from json file', fakeAsync(() => {

    spyOn(dataServ, 'getIntellisenseElements').and.returnValue('data');
    const Obj = intelliServ.getIntellisenseElements();

    tick();
    expect(Obj).toBeDefined();
  }));
});
