'use client';

import Modal from '@/components/modal/Modal';
import instance from '@/shared/baseServices';
import { IBed } from '@/shared/interface';
import React, { useEffect, useState } from 'react';
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { triggerForm, validateRequired } from '@/shared/internalServices';
import Button from '@/components/button/Button';

const Departments = () => {
    const [beds, setBeds] = useState<IBed[]>([])
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const getBeds = async () => {
            try {
                setLoading(true)
                const response = await instance.get("/bed/get-all");
                setBeds(response.data.beds)
                setLoading(false)
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
        getBeds()
    }, [])

    const departmentData = beds.reduce((acc: any[], bed) => {
        const existing = acc.find(item => item.department === bed.department);
        if (existing) {
            existing.availableCount += bed.available ? 1 : 0;
        } else {
            acc.push({
                department: bed.department,
                availableCount: bed.available ? 1 : 0,
            });
        }
        return acc;
    }, []);

    return (
        <div>
            <div className='text-2xl font-bold'>Depatments</div>
            {!loading && !beds.length && <div>No bed found!</div>}
            {!loading && <Button className='mt-4' onClick={() => setIsOpen(true)}>Add Bed/Department</Button>}
            {loading && <div>Loading...</div>}
            {departmentData.length && (
                <table className="min-w-full table-auto bg-white mt-5">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium">SN</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Department</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Available Beds</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departmentData?.map((bed, index) => (
                            <tr
                                key={bed.department}
                                className="hover:bg-gray-100 border-b border-gray-200 transition-all duration-200"
                            >
                                <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{bed.department}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{bed.availableCount}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {new Date(bed.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
                <Formik
                    initialValues={{
                        department: "",
                        roomNumber: "",
                        bedNumber: "",
                    }}
                    // Simple validation (you can extend this based on your needs)
                    validate={(values) => {
                        const errors: any = {};
                        if (!values.department) errors.department = "Department is required";
                        if (!values.roomNumber) errors.roomNumber = "Room number is required";
                        if (!values.bedNumber) errors.bedNumber = "Bed number is required";
                        return errors;
                    }}
                    onSubmit={async (values, { resetForm }) => {
                        console.log("Form data:", values);
                        try {
                            const response = await instance.post("/bed/add", values);
                            const data = response.data;
                            triggerForm({
                                title: "",
                                text: `Added new bed`,
                                icon: "success",
                                confirmButtonText: "OK",
                            });
                            resetForm()

                        } catch (error) {
                            console.error("Error:", error);
                        }
                    }}
                >
                    {({ errors, touched }) => (
                        <FormikForm>
                            <div className="mb-4">
                                <label htmlFor="department" className="block text-gray-700 mb-2">
                                    Department
                                </label>
                                <Field
                                    type="text"
                                    id="department"
                                    name="department"
                                    placeholder="e.g., medicine"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    validate={validateRequired}
                                />
                                <ErrorMessage
                                    name="department"
                                    component="div"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="roomNumber" className="block text-gray-700 mb-2">
                                    Room Number
                                </label>
                                <Field
                                    type="text"
                                    id="roomNumber"
                                    name="roomNumber"
                                    placeholder="e.g., A101"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    validate={validateRequired}
                                />
                                <ErrorMessage
                                    name="roomNumber"
                                    component="div"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="bedNumber" className="block text-gray-700 mb-2">
                                    Bed Number
                                </label>
                                <Field
                                    type="text"
                                    id="bedNumber"
                                    name="bedNumber"
                                    placeholder="e.g., M1"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    validate={validateRequired}
                                />
                                <ErrorMessage
                                    name="bedNumber"
                                    component="div"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>

                            <div className="mb-4">
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </FormikForm>
                    )}
                </Formik>
            </Modal>
        </div>
    );
};

export default Departments;