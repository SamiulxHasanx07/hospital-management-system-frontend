'use client';

import { useState } from 'react';
import { Formik, Field, Form as FormikForm } from 'formik';
import { useRouter } from 'next/navigation';

import { useUser } from '@/context/UserContext';
import Button from '@/components/button/Button';
import instance from '@/shared/baseServices';
import { triggerForm } from '@/shared/internalServices';

const SignupMainView = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUser } = useUser();
    const router = useRouter();

    const initialValues = {
        name: '',
        email: '',
        password: '',
        role: '',
    };

    const validate = (values: typeof initialValues) => {
        const errors: Partial<typeof values> = {};
        if (!values.name) errors.name = 'Name is required';
        if (!values.email) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            errors.email = 'Invalid email format';
        }
        if (!values.password) errors.password = 'Password is required';
        else if (values.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        if (!values.role) errors.role = 'Please select a role';

        return errors;
    };

    const handleSubmit = async (values: typeof initialValues) => {
        setError('');
        setLoading(true);
        try {
            const res = await instance.post('/auth/register', values);
            const user = res.data.user;
            triggerForm({
                title: '',
                text: 'Successfully Registered',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            setUser(user);
            router.push('/dashboard');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err?.message || 'Signup failed');
                triggerForm({
                    title: '',
                    text: err?.message || 'Signup failed',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-5 p-6 border rounded-lg shadow-lg">
            <h2 className="text-center text-xl font-semibold mb-4">Sign Up</h2>
            {error && <div className="bg-red-100 text-red-800 p-2 mb-4 rounded">{error}</div>}

            <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
                {({ errors }) => (
                    <FormikForm>
                        <div className="mb-4">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Sign up as</label>
                            <Field as="select" name="role" className="w-full p-3 border border-gray-300 rounded-md mt-2">
                                <option value="">Select Role</option>
                                <option value="DOCTOR">Doctor</option>
                                <option value="NURSE">Nurse</option>
                                <option value="PATIENT">Patient</option>
                            </Field>
                            {errors.role && <div className="text-red-600 text-xs mt-1">{errors.role}</div>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <Field
                                type="text"
                                name="name"
                                className="w-full p-3 border border-gray-300 rounded-md mt-2"
                                placeholder="John Doe"
                            />
                            {errors.name && <div className="text-red-600 text-xs mt-1">{errors.name}</div>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <Field
                                type="email"
                                name="email"
                                className="w-full p-3 border border-gray-300 rounded-md mt-2"
                                placeholder="john@example.com"
                            />
                            {errors.email && <div className="text-red-600 text-xs mt-1">{errors.email}</div>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <Field
                                type="password"
                                name="password"
                                className="w-full p-3 border border-gray-300 rounded-md mt-2"
                                placeholder="******"
                            />
                            {errors.password && <div className="text-red-600 text-xs mt-1">{errors.password}</div>}
                        </div>

                        <Button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md">
                            {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Sign Up'}
                        </Button>
                    </FormikForm>
                )}
            </Formik>
        </div>
    );
};

export default SignupMainView;
