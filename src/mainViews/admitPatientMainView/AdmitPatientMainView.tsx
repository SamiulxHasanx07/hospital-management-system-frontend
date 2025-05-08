'use client';
import React, { useEffect, useState } from 'react';
import { Formik, Field, Form as FormikForm } from "formik";
import { triggerForm, validateRequired } from '@/shared/internalServices';
import { IBed } from '@/shared/interface';
import instance from '@/shared/baseServices';
import Modal from '@/components/modal/Modal';
import Button from '@/components/button/Button';
import { useUser } from '@/context/UserContext';

export interface IBedGroup {
    department: string;
    beds: IBed[];
}

const AdmitPatientMainView = () => {
    const [beds, setBeds] = useState<IBed[] | null>(null);
    const [departments, setDepartments] = useState<IBedGroup[] | null>(null)
    const [department, setDepartment] = useState<IBedGroup | null>(null)
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        const getBeds = async () => {
            try {
                const response = await instance.get("/bed/get-all");
                setBeds(response.data.beds)
                const groupedBeds = response.data.beds
                    .filter((bed: IBed) => bed.available)
                    .reduce((acc: IBedGroup[], bed: IBed) => {
                        const departmentIndex = acc.findIndex(item => item.department === bed.department);

                        if (departmentIndex === -1) {
                            acc.push({ department: bed.department, beds: [bed] });
                        } else {
                            acc[departmentIndex].beds.push(bed);
                        }

                        return acc;
                    }, []);
                setDepartments(groupedBeds)
            } catch (error) {
                console.log(error)
            }
        }
        getBeds()
    }, [])
    const initialValues = {
        patientId: "",
        name: "",
        age: "",
        gender: "",
        admittedById: "",
        condition: "",
        department: "",
        bedId: "",
        remarks: "",
    };

    const handleSubmit = async (values: any, { resetForm }) => {
        const modifiedValues = { ...values, admittedById: user?.actualId, patientId: user?.actualId, bedId: Number(values.bedId) }
        try {
            const response = await instance.post(`/admit-patient`, modifiedValues);
            if (response.status == 200 || response.status == 201) {
                triggerForm({
                    title: "",
                    text: `Successfully admited!`,
                    icon: "success",
                    confirmButtonText: "OK",
                });
                resetForm()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <div className='text-2xl font-bold mb-5'>Admit Emergency Patient</div>
            <Button onClick={() => setIsOpen(true)}>Emergency Admit Patient</Button>
            <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)} >
                <Formik initialValues={initialValues} onSubmit={(values, { resetForm }) => handleSubmit(values, { resetForm })}>
                    {({ errors, setFieldValue }) => (
                        <FormikForm className="space-y-4">
                            <div>
                                <label htmlFor="name">Name</label>
                                <Field
                                    name="name"
                                    type="text"
                                    className="block w-full p-2 border rounded"
                                    validate={validateRequired}
                                    placeholder="Name"
                                />
                                {errors.name && <div className="text-red-500">{errors.name}</div>}
                            </div>
                            <div>
                                <label htmlFor="age">Age</label>
                                <Field
                                    name="age"
                                    type="number"
                                    className="block w-full p-2 border rounded"
                                    validate={validateRequired}
                                    placeholder="Age"
                                />
                                {errors.age && <div className="text-red-500">{errors.age}</div>}
                            </div>

                            <div>
                                <label htmlFor="gender">Gender</label>
                                <Field
                                    as="select"
                                    name="gender"
                                    className="block w-full p-2 border rounded"
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        const value = e.target.value;
                                        setFieldValue("gender", value);
                                    }}
                                    validate={validateRequired}
                                    placeholder="Male/Female"
                                >
                                    <option value="">Select bed</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </Field>
                                {errors.gender && <div className="text-red-500">{errors.gender}</div>}
                            </div>
                            <div className='flex gap-8'>
                                <Field
                                    as="select"
                                    name="department"
                                    className="block w-full p-2 border rounded"
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        const value = e.target.value;
                                        const findValue = departments?.find((item) => item.department == value)
                                        setDepartment(findValue || null)
                                        setFieldValue("department", value);
                                    }}
                                    placeholder="Department"
                                >
                                    <option value="">Select department</option>
                                    {departments && departments.map((item, index) => {
                                        return (
                                            <option key={index} value={item.department}>{item.department.replace(/\b\w/g, c => c.toUpperCase())}</option>
                                        )
                                    })}
                                </Field>
                                <Field
                                    as="select"
                                    name="bed"
                                    className="block w-full p-2 border rounded"
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        const value = e.target.value;
                                        setFieldValue("bedId", value);
                                    }}
                                    placeholder="Select bed"
                                >
                                    <option value="">Select bed</option>
                                    {department && department.beds.map((bed, index) => {
                                        return (
                                            <option key={index} value={bed.id}>{bed.roomNumber} - {bed.bedNumber}</option>
                                        )
                                    })}
                                </Field>
                            </div>

                            <div>
                                <label htmlFor="condition">Condition</label>
                                <Field
                                    name="condition"
                                    type="text"
                                    className="block w-full p-2 border rounded"
                                    validate={validateRequired}
                                    placeholder="Explain condition"
                                />
                                {errors.condition && <div className="text-red-500">{errors.condition}</div>}
                            </div>

                            <div>
                                <label htmlFor="remarks">Remarks</label>
                                <Field
                                    name="remarks"
                                    type="text"
                                    className="block w-full p-2 border rounded"
                                    validate={validateRequired}
                                    placeholder="Remarkes"
                                />
                                {errors.remarks && <div className="text-red-500">{errors.remarks}</div>}
                            </div>
                            <Button
                                type="submit"
                                className='w-100'
                            >
                                Submit
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
            </Modal>
        </div>
    );
};

export default AdmitPatientMainView;