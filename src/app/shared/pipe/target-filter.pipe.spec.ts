import { TargetFilterPipe } from './target-filter.pipe';
import { StructureModel } from 'src/app/shared/models/structure-model.model';

describe('TargetFilterPipe', () => {
  let targetFilterPipe: TargetFilterPipe;
  beforeEach(() => {
    targetFilterPipe = new TargetFilterPipe();
  });

  it('create an instance', () => {
    const pipe = new TargetFilterPipe();
    expect(pipe).toBeTruthy();
  });
  it('should return the filtered structure based on Meaning or Code', () => {
    const structureModel: StructureModel[] = [
      { Meaning: 'PTV',
        Code: 'Code1',
        Name: 'Planning Target Volume'
      },
      { Meaning: 'GTV',
      Code: 'Code1',
      Name: 'Grosss Target Volume'
      },
      { Meaning: 'CTV',
      Code: 'Code2',
      Name: 'Cumulative Target Volume'
      },
      { Meaning: 'PTV1',
      Code: 'Code3',
      Name: 'Planning Target Volume 1'
      }
    ];
    // filter using Meaning
    let filtredStructure = targetFilterPipe.transform(structureModel, 'PTV');
    expect(filtredStructure).toBeTruthy();
    expect(filtredStructure.length).toBe(2);
    // filter using Code
    filtredStructure = targetFilterPipe.transform(structureModel, 'Code1');
    expect(filtredStructure).toBeTruthy();
    expect(filtredStructure.length).toBe(2);
    // No filter
    filtredStructure =  targetFilterPipe.transform(structureModel, '');
    expect(filtredStructure).toBeTruthy();
    expect(filtredStructure.length).toBe(4);
    // Wrong filter data provided
    filtredStructure =  targetFilterPipe.transform(structureModel, 'XYZ');
    expect(filtredStructure).toBeTruthy();
    expect(filtredStructure.length).toBe(0);
  });
});
