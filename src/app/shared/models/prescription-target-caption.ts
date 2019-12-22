import { Objective } from 'src/app/shared/models/objective.model';

export class PrescriptionTargetCaption {
    FractionDoseGy = '0.01';
    Dose = '';
    StructureCode = '';
    StructureId: string;
    Objectives: Array<Objective>;
}
