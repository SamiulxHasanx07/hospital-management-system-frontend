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

export interface IAppointment {
    id: number;
    date: string;
    doctorId: number;
    patientId: number;
    scheduleId: number;
    slotId: number;
    disease: string;
    status: 'booked' | 'cancelled' | 'completed';
    remarks: string;
    doctor: {
        id: number;
        userId: number;
        specialty: string;
        experience: number;
    };
    patient: {
        id: number;
        userId: number;
        age: number;
        gender: string;
    };
}


export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

export interface IPatient {
    id: number;
    userId: number;
    age: number;
    gender: string;
    user: IUser;
}