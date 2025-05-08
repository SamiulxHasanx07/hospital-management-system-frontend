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
export interface IDoctor {
    id: number;
    userId: number;
    specialty: string;
    experience: number;
    user: IUser;
}

export interface ISchedule {
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

export interface IBed {
    id: number;
    department: string;
    roomNumber: string;
    bedNumber: string;
    available: boolean;
    createdAt: string;
}

export interface IAdmission {
    id: number;
    patientId: number;
    name: string;
    age: number;
    gender: string;
    admittedById: number;
    condition: string;
    department: string;
    bedId: number;
    admissionTime: string;
    status: string;
    remarks: string;
    patient: {
        id: number;
        userId: number;
        age: number;
        gender: string;
    };
    admittedBy: {
        id: number;
        name: string;
        email: string;
        password: string;
        role: string;
    };
    bed: {
        id: number;
        department: string;
        roomNumber: string;
        bedNumber: string;
        available: boolean;
        createdAt: string;
    };
}

export interface INurse {
    id: number;
    userId: number;
    department: string;
    shift: string;
    user: {
        id: number;
        name: string;
        email: string;
        password: string;
        role: "NURSE";
    };
}