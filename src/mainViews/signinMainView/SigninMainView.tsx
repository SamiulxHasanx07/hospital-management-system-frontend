'use client';
import { useState } from 'react';
import { Formik, Field, Form as FormikForm } from "formik";

import { useUser } from '@/context/UserContext';
import Button from '@/components/button/Button';
import instance from '@/shared/baseServices';
import { triggerForm, validateRequired } from '@/shared/internalServices';
import { useRouter } from 'next/navigation';

const SigninMainView = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUser } = useUser();
    const router = useRouter();

    const validate = (values: { email: string; password: string }) => {
        const errors: Partial<typeof values> = {};
        if (!values.email) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            errors.email = 'Invalid email format';
        }

        if (!values.password) {
            errors.password = 'Password is required';
        } else if (values.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        return errors;
    };

    const handleSubmit = async (values: { email: string; password: string }) => {
        setError('');
        setLoading(true);
        try {
            const res = await instance.post("/auth/login", values);
            const user = { ...res.data.user, actualId: res.data.actualId };
            triggerForm({
                title: "",
                text: `Successfully Registered`,
                icon: "success",
                confirmButtonText: "OK",
            });

            setUser(user);
            router.push("/dashboard");
        } catch (err: unknown) {
            setError(err?.message || 'Login failed');
            triggerForm({
                title: "",
                text: `${err?.message || 'Login failed'}`,
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-md mx-auto mt-5 p-6 bg-white border rounded-lg shadow-lg">
            <h2 className="text-center text-2xl font-semibold mb-6">Login</h2>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <Formik
                initialValues={{ email: '', password: '' }}
                validate={validate}
                onSubmit={handleSubmit}
            >
                {({ errors }) => (
                    <FormikForm>
                        {/* Email Input */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                            <Field
                                type="email"
                                id="email"
                                name="email"
                                placeholder="userName@gmail.com"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                validate={validateRequired}
                            />
                            {errors.email && (
                                <div className="text-red-600 text-sm mt-1">{errors.email}</div>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                            <Field
                                type="password"
                                id="password"
                                name="password"
                                placeholder="******"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                validate={validateRequired}
                            />
                            {errors.password && (
                                <div className="text-red-600 text-sm mt-1">{errors.password}</div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                        >
                            {loading ? (
                                <div className="flex justify-center">
                                    <div className="w-6 h-6 border-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                'Login'
                            )}
                        </Button>
                    </FormikForm>
                )}
            </Formik>
        </div>
    );
};

export default SigninMainView;
