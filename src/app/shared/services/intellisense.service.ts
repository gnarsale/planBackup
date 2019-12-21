import { Injectable } from '@angular/core';
import { DataServiceService } from 'src/app/shared/services/data-service.service';

@Injectable({
  providedIn: 'root'
})
export class IntellisenseService {
  intellisenseObj: Intellisense = new Intellisense();
  constructor(private dataservice: DataServiceService) { }

  /**
   * Read goal intellinse elemtns from json file
   */
  getIntellisenseElements() {
    const url = 'assets/data/intellisense.json';
    return this.dataservice.getIntellisenseElements();
  }
}

export class Intellisense {
  states: object[] = [];
  operator: object[] = [];
  leftExpModel: object[] = [];
  rightExpModel: object[] = [];
  doseConstraints: string[] = [];
  mode: object;
}
