'use client';

import React, { useEffect, useState } from 'react';
import Button from '@/components/button/Button';
import instance from '@/shared/baseServices';
import { useUser } from '@/context/UserContext';
import Modal from '@/components/modal/Modal';
const DoctorScheduleMainView = () => {
    const [schedules, setSchedules] = useState([]);
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);

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


    return (
        <div>
            {(!schedules.length || schedules.length == 0) && (
                <>
                    <h2>You have not selected any schedule yet!</h2>
                    <Button onClick={() => setIsOpen(true)}>Add Schedule</Button>
                </>
            )}
            <Modal isOpen={isOpen} closeModal={()=>setIsOpen(false)} >
                Test
            </Modal>
        </div>
    );
};

export default DoctorScheduleMainView;