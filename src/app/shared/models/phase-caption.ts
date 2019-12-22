import { PrescriptionTargetCaption } from 'src/app/shared/models/prescription-target-caption';

export class PhaseCaption {
    PhaseIndex = '';
    targetCount: number;
    FractionCount = 1;
    PrescriptionTargets: Array<PrescriptionTargetCaption>;
    PrescribedSessionsCount: string;
}
