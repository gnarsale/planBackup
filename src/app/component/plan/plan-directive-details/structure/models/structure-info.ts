import { PhaseInfo } from 'src/app/component/plan/plan-directive-details/structure/models/phase-info';

export class StructureInfo {
    Code: string;
    Name: string;
    Meaning: string;
    StructureId: string;
    Phases: Array<PhaseInfo> = [];
    type: string;
    Schema: string;
    SchemaVersion: string;
    Color: string;
}
