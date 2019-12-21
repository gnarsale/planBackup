import { Injectable } from '@angular/core';
import { DataServiceService } from 'src/app/shared/services/data-service.service';

@Injectable({
  providedIn: 'root'
})

export class SiteService {

  constructor(private dataservice: DataServiceService) { }

  getSiteByRegionId(regionId: number) {
    return this.dataservice.getSitesByRegionId(regionId);
  }
}
