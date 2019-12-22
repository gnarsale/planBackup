import { Patient } from 'src/app/shared/models/patient.model';
import { StatusEnum } from 'src/app/shared/models/status-enum.enum';

export interface PlanOrderHistoryModel {
    OrderID: string;
    PatientDetails: Patient;
    StructureSetID: string;
    MachineID: string;
    PlanDirective: string;
    PlanPriority: number;
    Status: StatusEnum;
    LastUpdated: string;
    DueDate: string;
    Physician: string;
    PlanNotes: string;
}
