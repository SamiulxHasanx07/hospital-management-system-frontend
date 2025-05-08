'use client';

import { useUser } from '@/context/UserContext';
import instance from '@/shared/baseServices';
import { IAppointment, IDoctorTimeSlot, IPatient } from '@/shared/interface';
import { formatDate, formatTime } from '@/shared/internalServices';
import React, { useEffect, useState } from 'react';

const AppointmentsMainView = () => {
    const [loading, setLoading] = useState(true);
    const { user, setUser } = useUser();
    const [appointments, setAppointments] = useState<IAppointment[] | null>(null);
    const [slots, setSlots] = useState<IDoctorTimeSlot[] | []>([]);
    const [patients, setPatients] = useState<IPatient[]>([]);



    useEffect(() => {
        const getSlots = async () => {
            try {
                const response = await instance.get(`/schedule/slots`);
                if (response.data.length) {
                    setSlots(response.data)
                }
                return response.data;
            } catch (error) {
                console.log(error)
            }
        }
        getSlots()
    }, [])

    useEffect(() => {
        const getAppointments = async () => {
            try {
                setLoading(true);
                const response = await instance.get(`/appointment/by-doctor/${user?.actualId}`);
                setAppointments(response.data)
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error)
            }
        }
        getAppointments()
    }, [])
    useEffect(() => {
        const getPatient = async () => {
            try {
                const response = await instance.get(`/patients`);
                setPatients(response.data);
            } catch (error) {
                console.log(error)
            }
        }
        getPatient()
    }, []);
    return (
        <div>
            {loading && "Loading..."}
            <table className="min-w-full table-auto bg-white mt-4">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium">SN</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Patient Name</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Age</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Gender</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Start time</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">End time</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Disease</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Remarks</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments && appointments.map((item, index) => {
                        const findSlot = slots.find((e) => e.id == item.slotId)

                        const findUserInfo = patients.find((patient) => patient?.id == item.patientId)

                        return (
                            <tr
                                key={item.id}
                                className="hover:bg-gray-100 border-b border-gray-200 transition-all duration-200"
                            >
                                <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{formatDate(item.date)}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{findUserInfo?.user.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.patient.age}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.patient.gender}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{formatTime(findSlot?.startTime || "")}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{formatTime(findSlot?.endTime || "")}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.disease}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{item.remarks}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    <span
                                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${item.status === "booked"
                                            ? "bg-green-200 text-green-800"
                                            : "bg-red-200 text-red-800"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>


        </div>
    );
};

export default AppointmentsMainView;