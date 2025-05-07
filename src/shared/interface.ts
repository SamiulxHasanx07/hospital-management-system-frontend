export interface IDoctorTimeSlot {
    id: number;
    startTime: string;
    endTime: string;
    maxPatients: number;
    available: boolean;
    createdAt: string;
}
