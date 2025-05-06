'use client';
import { useState } from 'react';
import { Formik, Field, Form as FormikForm } from 'formik';
import { Form, Alert, Spinner } from 'react-bootstrap';
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
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Signup failed');
            triggerForm({
                title: '',
                text: err?.response?.data?.message || 'Signup failed',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-5 p-4 border rounded shadow">
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
                {({ errors }) => (
                    <FormikForm>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="role">Sign up as</Form.Label>
                            <Field as="select" name="role" className="form-select">
                                <option value="">Select Role</option>
                                <option value="DOCTOR">Doctor</option>
                                <option value="NURSE">Nurse</option>
                                <option value="PATIENT">Patient</option>
                            </Field>
                            {errors.role && <Form.Text className="text-danger">{errors.role}</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Field
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="John Doe"
                            />
                            {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Field
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="john@example.com"
                            />
                            {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Field
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="******"
                            />
                            {errors.password && (
                                <Form.Text className="text-danger">{errors.password}</Form.Text>
                            )}
                        </Form.Group>

                        <Button type="submit" className="w-100">
                            {loading ? <Spinner size="sm" animation="border" /> : 'Sign Up'}
                        </Button>
                    </FormikForm>
                )}
            </Formik>
        </div>
    );
};

export default SignupMainView;
