'use client';
import Button from '@/components/button/Button';
import Modal from '@/components/modal/Modal';
import { useUser } from '@/context/UserContext';
import instance from '@/shared/baseServices';
import { IAppointment, IDoctor, IDoctorTimeSlot, ISchedule } from '@/shared/interface';
import { formatDate, formatTime, triggerForm, validateRequired } from '@/shared/internalServices';
import React, { use, useEffect, useState } from 'react';
import { Formik, Field, Form as FormikForm } from "formik";
import { IoTrashOutline } from 'react-icons/io5';

const AppointmentsUserMainView = () => {
    const { user } = useUser();
    const [doctorSchedules, setDoctorSchedules] = useState<ISchedule[] | null>(null)
    const [doctors, setDoctors] = useState<IDoctor[] | null>(null)
    const [appointments, setAppointments] = useState<IAppointment[] | null>(null);
    const [slots, setSlots] = useState<IDoctorTimeSlot[] | []>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [doctorSchedule, setDoctorSchedule] = useState<ISchedule | null>(null)

    useEffect(() => {
        const getSlots = async () => {
            try {
                setLoading(true)
                const response = await instance.get(`/schedule/slots`);
                if (response.data.length) {
                    setSlots(response.data)
                }
                setLoading(false)
                return response.data;
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
        getSlots()
    }, [])

    useEffect(() => {
        const getSlots = async () => {
            try {
                const response = await instance.get(`/doctor-schedule`);
                setDoctorSchedules(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        getSlots()
    }, [])

    useEffect(() => {
        const getAppointments = async () => {
            try {
                setLoading(true)
                const response = await instance.get(`appointment/by-patient/4}`);
                setAppointments(response.data)
                setLoading(false)
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
        getAppointments()
    }, [])

    useEffect(() => {
        const getDoctors = async () => {
            try {
                setLoading(true)
                const response = await instance.get(`/doctors`);
                setDoctors(response.data);
                setLoading(false)
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
        getDoctors()
    }, []);

    const handleSubmit = async (values: any, { resetForm }: any) => {
        try {
            setLoading(true)
            const isoDate = new Date(`${values.date}T10:00:00Z`).toISOString();
            const getDoctor = doctors?.find((item) => item.userId == doctorSchedule?.doctorId)
            const modifiedValues = {
                ...values, doctorId: getDoctor?.id, scheduleId: doctorSchedule?.id, slotId: doctorSchedule?.slotId,
                patientId: user?.actualId, date: isoDate
            }
            await instance.post(`/appointment`, modifiedValues);
            resetForm();
            triggerForm({
                title: "",
                text: `Successfully created new appointment!'}`,
                icon: "success",
                confirmButtonText: "OK",
            });

            setLoading(false)
        } catch (error) {
            setLoading(false);
            console.error("Booking failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveClick = async (id: number) => {
        try {
            setLoading(true)
            const response = await instance.delete(`/appointment/${id}`);
            setLoading(false)
            if (response.status == 200 || response.status == 201) {
                triggerForm({
                    title: "",
                    text: `Successfully deleted schedule`,
                    icon: "success",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }


    return (
        <div>
            {!loading && (
                <>
                    <h2 className='text-2xl mb-4'>Add New Schedule</h2>
                    <Button onClick={() => setIsOpen(true)}>New appointment</Button>
                </>
            )}
            {loading && (
                <div className='text-2xl'>Loading...</div>
            )}
            {!loading && (
                <table className="min-w-full table-auto bg-white mt-5">
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
                            <th className="px-6 py-3 text-left text-sm font-medium">Cancel appointment</th>
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
                                    <td className="px-6 py-4 text-sm text-gray-700"><span onClick={() => handleRemoveClick(item.id)}><IoTrashOutline size={20} /></span></td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
            )}

            <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)} >
                <Formik
                    initialValues={{
                        date: '',
                        doctorId: '',
                        scheduleId: '',
                        slotId: '',
                        disease: '',
                        remarks: '',
                        status: 'booked',
                    }}
                    onSubmit={(values, { resetForm }) => handleSubmit(values, { resetForm })}
                >
                    {({ errors, setFieldValue }) => (
                        <FormikForm className="space-y-4">
                            <div>
                                <label htmlFor="date">Date</label>
                                <Field
                                    name="date"
                                    type="date"
                                    className="block w-full p-2 border rounded"
                                    validate={validateRequired}
                                />
                                {errors.date && <div className="text-red-500">{errors.date}</div>}
                            </div>
                            <Field
                                as="select"
                                name="schedule"
                                className="block w-full p-2 border rounded"
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    const selectedId = Number(e.target.value);
                                    const selectedSchedule = doctorSchedules && doctorSchedules.find(item => item.id === selectedId);
                                    setDoctorSchedule(selectedSchedule || null)
                                }}
                            >
                                <option value="">Select doctor schedule</option>
                                {doctorSchedules && doctorSchedules.map((item, index) => {
                                    const findSlot = slots.find((e) => e.id == item.slotId)
                                    const findDoctor = doctors && doctors.find((doctor) => doctor?.userId == item.doctorId)
                                    return (
                                        <option key={index} value={item.id}>{findDoctor?.user.name} {formatTime(findSlot?.startTime || "")} to {formatTime(findSlot?.endTime || "")}</option>
                                    )
                                })}
                            </Field>
                            <div>
                                <label htmlFor="disease">Disease</label>
                                <Field
                                    name="disease"
                                    className="block w-full p-2 border rounded"
                                    validate={validateRequired}
                                />
                                {errors.disease && <div className="text-red-500">{errors.disease}</div>}
                            </div>

                            <div>
                                <label htmlFor="remarks">Remarks</label>
                                <Field
                                    name="remarks"
                                    className="block w-full p-2 border rounded"
                                    validate={validateRequired}
                                />
                                {errors.remarks && <div className="text-red-500">{errors.remarks}</div>}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded"
                                disabled={loading}
                            >
                                {loading ? "Booking..." : "Book Appointment"}
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
            </Modal>
        </div>
    );
};

export default AppointmentsUserMainView;