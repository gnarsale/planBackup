import { Objectives } from 'src/app/shared/models/objectives.model';

export class PrescriptionTarget {
    StructureId: string;
    FractionDoseGy: string;
    FractionCount: string;
    TotalDose: string;
    Objectives: Objectives; // to be define granular level
}
