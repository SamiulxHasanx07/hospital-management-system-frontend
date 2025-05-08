'use client';
import { useUser } from '@/context/UserContext';
import instance from '@/shared/baseServices';
import { IAppointment, IDoctor, IDoctorTimeSlot } from '@/shared/interface';
import { formatDate, formatTime } from '@/shared/internalServices';
import React, { useEffect, useState } from 'react';

const AppointmentsUserMainView = () => {
    const { user, setUser } = useUser();
    const [doctors, setDoctors] = useState<IDoctor[] | null>(null)
    const [appointments, setAppointments] = useState<IAppointment[] | null>(null);
    const [slots, setSlots] = useState<IDoctorTimeSlot[] | []>([]);

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
                const response = await instance.get(`appointment/by-patient/4}`);
                setAppointments(response.data)
                console.log("from api", response.data)
            } catch (error) {
                console.log(error)
            }
        }
        getAppointments()
    }, [])

    useEffect(() => {
        const getDoctors = async () => {
            try {
                const response = await instance.get(`/doctors`);
                setDoctors(response.data);
            } catch (error) {
                console.log(error)
            }
        }
        getDoctors()
    }, []);

    console.log(doctors, "doc")
    return (
        <div>
            <table className="min-w-full table-auto bg-white mt-4">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium">SN</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Patient Name</th>
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

                        const findDoctor = doctors && doctors.find((doctor) => doctor?.id == item.doctorId)

                        return (
                            <tr
                                key={item.id}
                                className="hover:bg-gray-100 border-b border-gray-200 transition-all duration-200"
                            >
                                <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{formatDate(item.date)}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{findDoctor?.user.name}</td>
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

export default AppointmentsUserMainView;