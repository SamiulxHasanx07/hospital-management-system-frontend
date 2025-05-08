'use client';
import instance from '@/shared/baseServices';
import { IDoctor } from '@/shared/interface';
import { triggerForm } from '@/shared/internalServices';
import React, { useEffect, useState } from 'react';
import { IoTrashOutline } from 'react-icons/io5';

const Doctors = () => {
    const [doctors, setDoctors] = useState<IDoctor[] | null>(null);
    const [loading, setLoading] = useState(true);
    const getDoctors = async () => {
        try {
            setLoading(true)
            const response = await instance.get("/doctors");
            setDoctors(response.data)
            setLoading(false)

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    useEffect(() => {
        getDoctors()
    }, [])

    const handleRemoveClick = async (id: number) => {
        try {
            const response = await instance.delete(`/doctors/${id}`);
            if (response.status == 200 || response.status == 201) {
                triggerForm({
                    title: "",
                    text: `Doctor deleted succesfull!`,
                    icon: "success",
                    confirmButtonText: "OK",
                });
                getDoctors()
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <div className='text-2xl'>All Doctors</div>
            {!loading && !doctors?.length && (
                <div>Doctors not found!</div>
            )}
            {loading && <div className='text-xl'>Loading...</div>}
            {!loading && doctors?.length && (
                <table className="min-w-full table-auto bg-white mt-5">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium">SN</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Specialty</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Experience</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors?.map((item, index) => {
                            return (
                                <tr key={index} className="hover:bg-gray-100 border-b border-gray-200 transition-all duration-200">
                                    <td className="px-6 py-4 text-sm text-gray-700">1</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.user.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.specialty}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.experience} years</td>
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