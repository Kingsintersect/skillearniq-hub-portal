'use client'

import React from 'react'
import AuthContauiner from '../components/AuthContainer';
import { AuthContainerHeader } from '../components/AuthContainerHeader';
import LoginFormContainer from './components/LoginFormContainer';
import { FormProvider } from '@/contexts/FormContext';
import { ApplySection } from './components/LoginFormFields';

const LoginFormPage = () => {
    return (
        <AuthContauiner>
            {/* Header */}
            <AuthContainerHeader
                heading='Sign In'
                subHeading={`Please sign in to your account for more adventure!`}
            />
            {/* Form body */}
            <FormProvider>
                <LoginFormContainer />
            </FormProvider>

            {/* Apply Section */}
            <ApplySection />
        </AuthContauiner >
    );
}

export default LoginFormPage
