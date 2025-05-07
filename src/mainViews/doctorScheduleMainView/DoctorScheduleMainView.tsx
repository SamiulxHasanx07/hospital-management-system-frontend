'use client';

import React, { useEffect, useState } from 'react';
import Button from '@/components/button/Button';
import instance from '@/shared/baseServices';
import { useUser } from '@/context/UserContext';
import Modal from '@/components/modal/Modal';
import { IDoctorSchedule, IDoctorTimeSlot } from '@/shared/interface';
import { formatTime, triggerForm } from '@/shared/internalServices';
import { IoTrashOutline } from 'react-icons/io5';

const DoctorScheduleMainView = () => {
    const [schedules, setSchedules] = useState<IDoctorSchedule[] | []>([]);
    const [slots, setSlots] = useState<IDoctorTimeSlot[] | []>([]);
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [visitFee, setVisitFee] = useState<number>(0);
    const [branch, setBranch] = useState<string>('');
    const [floorNumber, setFloorNumber] = useState<string>('');
    const [roomNumber, setRoomNumber] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [remarks, setRemarks] = useState<string>('');
    const [status, setStatus] = useState<string>('active');
    const [slotId, setSlotId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const getSchedules = async () => {
            try {
                setLoading(true)
                const response = await instance.get(`/doctor-schedule/by-doctor/${user?.id}`);
                if (response.data.length) {
                    setSchedules(response.data)
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.log(error)
            }
        }
        getSchedules()
    }, [user?.id])

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            setLoading(true)
            const doctorId = user?.id;
            const date = new Date().toISOString();
            const response = await instance.post('/doctor-schedule', {
                doctorId,
                slotId,
                date,
                visitFee,
                branch,
                floorNumber,
                roomNumber,
                location,
                remarks,
                status
            });

            setLoading(false)

            if (response.status == 200 || response.status == 201) {
                setIsOpen(false)
                triggerForm({
                    title: "",
                    text: `Successfully added schedule`,
                    icon: "success",
                    confirmButtonText: "OK",
                });
            }
        } catch (err) {
            setError('Error creating schedule. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveClick = async (id: number) => {
        try {
            setLoading(true)
            const response = await instance.delete(`/doctor-schedule/${id}`);
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
            {(!loading && !schedules.length && schedules.length == 0) ? (
                <>
                    <h2>You have not selected any schedule yet!</h2>
                    <Button onClick={() => setIsOpen(true)}>Add Schedule</Button>
                </>
            ) : ""}
            {schedules.length > 0 ? (
                <>
                    <h2>Add New Schedule</h2>
                    <Button onClick={() => setIsOpen(true)}>Add Schedule</Button>
                </>
            ) : ""}
            <div className='mt-5'>
                {loading && "Loading..."}
            </div>
            {!loading && schedules.length ? (
                <table className="min-w-full table-auto bg-white mt-4">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium">ID</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Start Time</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">End Time</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Maximum Patients</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Visit Fee</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Branch</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Floor</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Room</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Location</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Remarks</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map((item) => {
                            const timeSlot = slots.find((e) => e.id == item.id)
                            return (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-100 border-b border-gray-200 transition-all duration-200"
                                >
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.id}</td>
                                    <th className="px-6 py-4 text-sm text-gray-700">{formatTime(timeSlot?.startTime || "")}</th>
                                    <th className="px-6 py-4 text-sm text-gray-700">{formatTime(timeSlot?.endTime || "")}</th>
                                    <th className="px-6 py-4 text-sm text-gray-700">{timeSlot?.maxPatients}</th>
                                    <td className="px-6 py-4 text-sm text-gray-700">${item.visitFee}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.branch}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.floorNumber}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.roomNumber}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.location}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.remarks}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <span
                                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
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
            ) : ""}


            <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)} >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Select slot</label>
                        <select
                            onChange={(e) => setSlotId(Number(e.target.value))}
                            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value={0}>Select a department</option>
                            {slots.map((e, index) => {
                                const start = new Date(e.startTime);
                                const end = new Date(e.endTime);
                                const formattedStartTime = formatTime(start);
                                const formattedEndTime = formatTime(end);

                                return (
                                    <option value={e.id} key={index}>{formattedStartTime} - {formattedEndTime}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Visit Fee</label>
                        <input
                            type="number"
                            value={visitFee}
                            onChange={(e) => setVisitFee(Number(e.target.value))}
                            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Branch</label>
                        <input
                            type="text"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Floor Number</label>
                        <input
                            type="text"
                            value={floorNumber}
                            onChange={(e) => setFloorNumber(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Room Number</label>
                        <input
                            type="text"
                            value={roomNumber}
                            onChange={(e) => setRoomNumber(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Remarks</label>
                        <input
                            type="text"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Schedule'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DoctorScheduleMainView;