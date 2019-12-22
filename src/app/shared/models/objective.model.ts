import { ClinicalGoal } from 'src/app/shared/models/clinical-goal-model.model';
import { AcceptableVariation } from 'src/app/shared/models/acceptable-variation.model';

export class Objective {
    StructureId: string;
    Phase: string;
    ClinicalGoal: ClinicalGoal;
    AcceptableVariation: AcceptableVariation;
    Priority: string;
}
