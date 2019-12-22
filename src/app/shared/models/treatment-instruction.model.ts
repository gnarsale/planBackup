import { OARs } from 'src/app/shared/models/oars.model';
import { OARObjectives } from 'src/app/shared/models/oarobjectives.model';
import { Targets } from 'src/app/shared/models/targets.model';
import { PrescribedSessions } from 'src/app/shared/models/prescribed-sessions.model';
import { Phases } from 'src/app/shared/models/phases.model';
import { Notes } from 'src/app/shared/models/notes.model';

export class TreatmentInstruction {
    Identifier: string;
    DisplayName: string;
    AnatomicalRegion: string;
    AnatomicalSite: string;
    OARs: OARs;
    Targets: Targets;
    OARObjectives: OARObjectives;
    PrescribedSessions: PrescribedSessions;
    Phases: Phases;
    Notes: Notes;
}
