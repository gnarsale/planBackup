export enum StatusEnum {
    Requested = 'New',
    Assigned = 'In Progress',
    InProgress = 'Sent',
    StructuresReadyForReview = 'Sent',
    PlanReadyForReview = 'Sent',
    Completed = 'Sent',
    Failed = 'Failed',
    ImageTransferFailed = 'Image Transfer Failed',
    ImageTransferInProgress = 'Image Transfer In-Progress'
}
