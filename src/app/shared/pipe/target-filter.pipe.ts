import { Pipe, PipeTransform } from '@angular/core';
import { StructureModel } from 'src/app/shared/models/structure-model.model';

@Pipe({
  name: 'targetFilter'
})
export class TargetFilterPipe implements PipeTransform {
  // Filter the Targets Based on Meaning and Code
  transform(structureCollection: StructureModel[], filterVlaue: string): any {
    if (filterVlaue) {
      return structureCollection.filter(
        (target: StructureModel, index: number) =>
          target.Meaning.toLowerCase().indexOf(filterVlaue.toLowerCase()) !== -1 ||
          target.Code.toLowerCase().indexOf(filterVlaue.toLocaleLowerCase()) !== -1
      );
    }
    return structureCollection;
  }
}
