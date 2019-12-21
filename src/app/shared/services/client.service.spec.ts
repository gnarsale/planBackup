import { TestBed, inject } from '@angular/core/testing';
import { WebsocketService } from './websocket.service';
import { DataServiceService } from './data-service.service';
import { HttpClientModule } from '@angular/common/http';
import { ClientService } from './client.service';

let dataService: DataServiceService;

describe('ClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ClientService, WebsocketService, DataServiceService]
    });

    dataService = TestBed.get(DataServiceService);
    dataService.CHAT_URL = 'ws://localhost:6320/';
  });

  it('should be created', inject([ClientService], (service: ClientService) => {
    expect(service).toBeTruthy();
  }));
});
