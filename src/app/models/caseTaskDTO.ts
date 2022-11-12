import { UserDetailDTO } from "./userDTO";

export class CaseTaskDTO {

    constructor() {
        this.id = 0;
    }

    id: number;
    index: number;
    taskName: string;
    notes: string;
    assignedToId: number;
    assignedTo: UserDetailDTO;
    assignedBy: UserDetailDTO;
    priorityId: number;
    priority:{id:number; name:string;}
    statusId: number;
    status:{id:number; name:string;}
    sendUpdate: boolean;
    dueDate: Date;
    time: string;
    caseId?: number;

    // statusName: string;
    // priorityName: string;
}