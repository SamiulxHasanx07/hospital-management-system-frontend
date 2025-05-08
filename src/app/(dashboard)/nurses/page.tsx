'use client';
import instance from '@/shared/baseServices';
import { INurse } from '@/shared/interface';
import { triggerForm } from '@/shared/internalServices';
import React, { useEffect, useState } from 'react';
import { IoTrashOutline } from 'react-icons/io5';

const Doctors = () => {
    const [nurses, setNurses] = useState<INurse[] | null>(null);
    const [loading, setLoading] = useState(true);
    const getNurses = async () => {
        try {
            setLoading(true)
            const response = await instance.get("/nurses");
            setNurses(response.data)
            setLoading(false)

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        getNurses()
    }, [])

    const handleRemoveClick = async (id: number) => {
        try {
            const response = await instance.delete(`/nurses/${id}`);
            if (response.status == 200 || response.status == 201) {
                triggerForm({
                    title: "",
                    text: `Doctor deleted succesfull!`,
                    icon: "success",
                    confirmButtonText: "OK",
                });
                getNurses()
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <div className='text-2xl'>All Nurses</div>
            {!loading && !nurses?.length && (
                <div>Nurse not found!</div>
            )}
            {loading && <div className='text-xl'>Loading...</div>}
            {!loading && nurses?.length && (
                <table className="min-w-full table-auto bg-white mt-5">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium">SN</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Department</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Shift</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nurses?.map((item, index) => {
                            return (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-100 border-b border-gray-200 transition-all duration-200"
                                >
                                    <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.user.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.department}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.shift}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700"><span className='cursor-pointer' onClick={() => handleRemoveClick(item.id)}><IoTrashOutline size={20} /></span></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Doctors;