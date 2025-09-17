import React from 'react'
import { SignupForm } from './components/signup-form';
import { BrandingPanel } from '@/components/global/generic-componenets';

const SignupPage = () => {
    return (
        <div className="min-h-screen flex">
            {/* Left Panel */}
            <BrandingPanel className='hidden lg:flex lg:w-1/3' />

            {/* Right Panel */}
            <div className="w-full lg:w-2/3 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-10/12 h-[90vh] overflow-y-auto pr-10">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">SIGN UP</h2>
                        <p className="text-gray-600">Create your student account to access the portal</p>
                    </div>

                    <SignupForm />
                </div>
            </div>
        </div >
    );
}

export default SignupPage