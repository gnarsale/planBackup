import { Pipe, PipeTransform } from '@angular/core';
import { PlanDirectiveTemplate } from 'src/app/shared/models/plan-directive-template.model';

@Pipe({
  name: 'planningDirectiveFilter'
})
export class PlanningDirectiveFilterPipe implements PipeTransform {
  // Filter Plan Directive Templates by template name
  transform(plantemplates: PlanDirectiveTemplate[], filterValue: string): any {
    if (filterValue) {
      return plantemplates.filter((plantemplate: PlanDirectiveTemplate, index: number) => {
        return (plantemplate.PlanDirectiveTemplateName.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
          (plantemplate.PlanDirectiveTemplateName === 'Planning Directive without a template'));
      });
    }
    return plantemplates;
  }
}
