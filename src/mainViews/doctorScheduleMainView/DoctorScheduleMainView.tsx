'use client';

import React, { useEffect, useState } from 'react';
import Button from '@/components/button/Button';
import instance from '@/shared/baseServices';
import { useUser } from '@/context/UserContext';
import Modal from '@/components/modal/Modal';
import { IDoctorTimeSlot } from '@/shared/interface';
const DoctorScheduleMainView = () => {
    const [schedules, setSchedules] = useState([]);
    const [slots, setSlots] = useState<IDoctorTimeSlot[] | []>([]);
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState<string>('');
    const [visitFee, setVisitFee] = useState<number>(0);
    const [branch, setBranch] = useState<string>('');
    const [floorNumber, setFloorNumber] = useState<string>('');
    const [roomNumber, setRoomNumber] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [remarks, setRemarks] = useState<string>('');
    const [status, setStatus] = useState<string>('active');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const getSchedules = async () => {
            try {
                const response = await instance.get(`/doctor-schedule/by-doctor/${user?.id}`);
                if (response.data.length) {
                    setSchedules(response.data)
                }
                return response.data;
            } catch (error) {
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
            const doctorId = user?.id;
            const response = await instance('/doctor-schedule', {
                doctorId,
                date,
                visitFee,
                branch,
                floorNumber,
                roomNumber,
                location,
                remarks,
                status
            });
            console.log({
                doctorId,
                date,
                visitFee,
                branch,
                floorNumber,
                roomNumber,
                location,
                remarks,
                status
            })
            if (response.status === 200) {
                console.log("Schedule created successfully!")
            }
        } catch (err) {
            setError('Error creating schedule. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {(!schedules.length || schedules.length == 0) && (
                <>
                    <h2>You have not selected any schedule yet!</h2>
                    <Button onClick={() => setIsOpen(true)}>Add Schedule</Button>
                </>
            )}
            <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)} >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Select slot</label>
                        <select
                            // value={department}
                            // onChange={(e) => setDepartment(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select a department</option>
                            {slots.map((e, index) => {
                                const start = new Date(e.startTime);
                                const end = new Date(e.endTime);

                                const formattedStartTime = start.toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                });

                                const formattedEndTime = end.toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                });
                                return (
                                    <option key={index}>{formattedStartTime} - {formattedEndTime}</option>
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