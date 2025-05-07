export interface IDoctorTimeSlot {
    id: number;
    startTime: string;
    endTime: string;
    maxPatients: number;
    available: boolean;
    createdAt: string;
}
export interface IDoctorSchedule {
    id: number;
    doctorId: number;
    date: string;
    visitFee: number;
    branch: string;
    floorNumber: string;
    roomNumber: string;
    location: string;
    remarks: string;
    status: string;
    slotId: number;
}
