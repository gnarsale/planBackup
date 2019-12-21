import { Injectable } from '@angular/core';
import { DataServiceService } from 'src/app/shared/services/data-service.service';

@Injectable({
  providedIn: 'root'
})

export class AnatomicalRegionService {

  constructor(private dataservice: DataServiceService) { }

  getAllRegions() {
    return this.dataservice.getAllRegions();
  }
}
