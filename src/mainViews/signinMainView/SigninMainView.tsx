'use client';
import axios from 'axios';
import { useState } from 'react';
import { Formik, Form } from 'formik';
import { Form as RBForm, Alert, Spinner } from 'react-bootstrap';

import { useUser } from '@/context/UserContext';
import Button from '@/components/button/Button';

const SigninMainView = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUser } = useUser();


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
            const res = await axios.post('http://localhost:5000/api/auth/login', values); // adjust endpoint
            const user = res.data.user;
            setUser(user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
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
                {({ handleChange, values, touched, errors }) => (
                    <Form>
                        <RBForm.Group className="mb-3">
                            <RBForm.Label>Email</RBForm.Label>
                            <RBForm.Control
                                type="email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email && touched.email}
                            />
                            <RBForm.Control.Feedback type="invalid">
                                {errors.email}
                            </RBForm.Control.Feedback>
                        </RBForm.Group>

                        <RBForm.Group className="mb-3">
                            <RBForm.Label>Password</RBForm.Label>
                            <RBForm.Control
                                type="password"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password && touched.password}
                            />
                            <RBForm.Control.Feedback type="invalid">
                                {errors.password}
                            </RBForm.Control.Feedback>
                        </RBForm.Group>
                        <Button type='submit' className='w-100'>
                            {loading ? <Spinner size="sm" animation="border" /> : 'Login'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default SigninMainView;