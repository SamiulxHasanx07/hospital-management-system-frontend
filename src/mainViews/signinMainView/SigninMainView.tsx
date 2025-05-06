'use client';
import { useState } from 'react';
import { Formik, Field, Form as FormikForm } from "formik";
import { Form, Alert, Spinner } from 'react-bootstrap';

import { useUser } from '@/context/UserContext';
import Button from '@/components/button/Button';
import instance from '@/shared/baseServices';
import { triggerForm, validateRequired } from '@/shared/internalServices';
import { useRouter } from 'next/navigation';

const SigninMainView = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUser } = useUser();
    const router = useRouter()


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
            const res = await instance.post("/auth/login", values); // adjust endpoint
            const user = res.data.user;
            triggerForm({
                title: "",
                text: `Successfully Registered`,
                icon: "success",
                confirmButtonText: "OK",
            })
            setUser(user);
            router.push("/dashboard")
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err?.message || 'Login failed');
                triggerForm({
                    title: "",
                    text: `${err?.message || 'Login failed'}`,
                    icon: "error",
                    confirmButtonText: "OK",
                })
            }

        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="max-w-md mx-auto mt-5 p-4 border rounded shadow">
            <h2 className="text-center mb-4">Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            <Formik
                initialValues={{ email: '', password: '' }}
                validate={validate}
                onSubmit={handleSubmit}
            >
                {({ errors }) => (
                    <FormikForm>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="email">Email</Form.Label>
                            <Field
                                type="email"
                                id="email"
                                name="email"
                                placeholder="userName@gmail.com"
                                validate={validateRequired}
                            />
                            {errors.email && (
                                <Form.Text className="text-danger">{errors.email}</Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Field
                                type="password"
                                id="password"
                                name="password"
                                placeholder="******"
                                validate={validateRequired}
                            />
                            {errors.password && (
                                <Form.Text className="text-danger">{errors.password}</Form.Text>
                            )}
                        </Form.Group>
                        <Button type='submit' className='w-100'>
                            {loading ? <Spinner size="sm" animation="border" /> : 'Login'}
                        </Button>
                    </FormikForm>
                )}
            </Formik>
        </div>
    );
};

export default SigninMainView;