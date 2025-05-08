'use client';

import instance from '@/shared/baseServices';
import { IAdmission } from '@/shared/interface';
import React, { useEffect, useState } from 'react';

const AdmittedPatients = () => {
    const [patients, setPatients] = useState<IAdmission[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAdmittedPatients = async () => {
            try {
                setLoading(true)
                const response = await instance.get("/admit-patient");
                setPatients(response.data)
                setLoading(false)

            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
        getAdmittedPatients()
    }, [])

    return (
        <div>
            <div className='text-2xl'>All Nurses</div>
            {!loading && !patients?.length && (
                <div>Nurse not found!</div>
            )}
            {loading && <div className='text-xl'>Loading...</div>}
            {!loading && patients?.length && (
                <table className="min-w-full table-auto bg-white mt-5">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium">SN</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Admission Date</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Patient Name</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Age</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Gender</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Department</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Condition</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Bed</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients?.map((item, index) => {
                            return (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-100 border-b border-gray-200 transition-all duration-200"
                                >
                                    <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {new Date(item.admissionTime).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.age}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.gender}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.department}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{item.condition}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {item.bed.roomNumber} - {item.bed.bedNumber}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 capitalize">
                                        {item.status}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdmittedPatients;