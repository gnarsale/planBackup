import { Pipe, PipeTransform } from '@angular/core';
import { Site } from 'src/app/shared/models/site.model';

@Pipe({
  name: 'anatomicalFilter'
})
export class AnatomicalFilterPipe implements PipeTransform {
  // Filter Anatomical sites by site name
  transform(sites: Site[], filterValue: string): any {
    if (filterValue) {
      return sites.filter((site: Site, index: number) => site.PlanDirectiveSiteName
        .toLowerCase().indexOf(filterValue.toLowerCase()) !== -1);
    }
    return sites;
  }
}
