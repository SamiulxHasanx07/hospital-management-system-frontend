'use client';
import { useUser } from '@/context/UserContext';
import instance from '@/shared/baseServices';
import { triggerForm } from '@/shared/internalServices';
import React, { useState } from 'react';

const ContactInfoMainView = () => {
    const { user } = useUser();
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [house, setHouse] = useState("");
    const [village, setVillage] = useState("");
    const [country, setCountry] = useState("");
    const [division, setDivision] = useState("");
    const [postOffice, setPostOffice] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = user?.id;
        const formData = {
            userId,
            phone,
            email,
            house,
            village,
            postOffice,
            city,
            division,
            country,
        };
        try {
            const response = await instance.post(`/contact/`, formData);
            if (response.status == 200 || response.status == 201) {
                triggerForm({
                    title: "",
                    text: `Contact info updated`,
                    icon: "success",
                    confirmButtonText: "OK",
                });
            }

        } catch (error) {
            console.log(error)
            triggerForm({
                title: "",
                text: `Something went wrong!`,
                icon: "error",
                confirmButtonText: "OK",
            });
        }
        console.log("Submitted:", formData);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <input
                    type="tel"
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">House</label>
                <input
                    type="text"
                    onChange={(e) => setHouse(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Village</label>
                <input
                    type="text"
                    onChange={(e) => setVillage(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Post Office</label>
                <input
                    type="text"
                    onChange={(e) => setPostOffice(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">City</label>
                <input
                    type="text"
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Division</label>
                <input
                    type="text"
                    onChange={(e) => setDivision(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Country</label>
                <input
                    type="text"
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default ContactInfoMainView;