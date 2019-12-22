import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPlanOrder',
  pure: false
})
export class FilterPlanOrderPipe implements PipeTransform {

  transform(items: Array<any>, filter: { [key: string]: any }): Array<any> {
    return items.filter(item => {

      const notMatchingField = Object.keys(filter).filter(li =>
        li === 'PatientDetails' ? filter[li].searchInput !== '' : filter[li] !== ''
      )
        .find(key =>
          key === 'PatientDetails' ? (item[key].ID.toLowerCase().search(filter[key].searchInput.toLowerCase()) &&
            item[key].Name.toLowerCase().search(filter[key].searchInput.toLowerCase())) :
            item[key].toString().toLowerCase().search(filter[key].toString().toLowerCase())
        );

      return !notMatchingField; // true if matches all fields
    });
  }
}
