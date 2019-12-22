import { TargetStructure } from 'src/app/shared/models/target-structure.model';

export class PhaseTargets {
    phaseId: number;
    fractionCount = 0;
    targets: Array<TargetStructure>;
}
