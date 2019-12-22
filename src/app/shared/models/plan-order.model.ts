import { Patient } from 'src/app/shared/models/patient.model';

export interface PlanOrderModel {
    PlanOrderId: string;
    PatientDetails: Patient;
    StructureSetID: string;
    MachineID: string;
    PlanDirective: string;
    PlanPriority: number;
    Status: string;
    LastUpdated: string;
    DueDate: string;
    Physician: string;
    PlanNotes: string;
    GatewayID: number;
    selected: boolean;
    active: boolean;
    DirectiveId: string;
}
