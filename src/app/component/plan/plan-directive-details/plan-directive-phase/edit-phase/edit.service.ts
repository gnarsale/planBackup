import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditService {

  constructor() { }
  convertUpToTwoDecimal(number: number): number {
    return (Math.round((number) * 100) / 100);
  }
}
