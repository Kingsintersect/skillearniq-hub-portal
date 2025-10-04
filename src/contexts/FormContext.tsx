'use client'

import React, { createContext, useContext } from 'react'
import { UseFormReturn, useForm, Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInFormData, signInSchema } from '@/schema/auth-schema'
import { useAuthContext } from '@/providers/AuthProvider'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

interface FormContextType {
    form: UseFormReturn<signInFormData>;
    onSubmit: (data: signInFormData) => Promise<void>;
    isLoggingIn: boolean;
    userType: 'general' | 'parent' | 'parentotprequest';
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export const FormProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const searchParams = useSearchParams()
    const referenceNumber = searchParams.get('email') || ''
    const { login, requestParentOTP, isLoggingIn, parentOTP } = useAuthContext()

    const form = useForm<signInFormData>({
        resolver: zodResolver(signInSchema) as Resolver<signInFormData>,
        mode: "onChange",
        defaultValues: {
            email: referenceNumber || "",
            password: "",
            rememberMe: false,
            userType: 'general',
        },
    })

    const userType = form.watch('userType')

    useEffect(() => {
        if (referenceNumber) {
            form.setValue('email', referenceNumber)
        }
    }, [referenceNumber, form])
    useEffect(() => {
        if (userType !== 'general') {
            form.setValue('password', '')
            form.clearErrors('password')
        }
    }, [userType, form])
    useEffect(() => {
        if (parentOTP) {
            form.setValue('userType', 'parent')
        }
    }, [userType, parentOTP, form])

    const onSubmit = async (data: signInFormData) => {
        if (userType === "parentotprequest") return requestParentOTP(data)
        else return login(data)
    }

    const value = {
        form,
        onSubmit,
        isLoggingIn,
        userType,
        parentOTP,
    }

    return (
        <FormContext.Provider value={value}>
            {children}
        </FormContext.Provider>
    )
}

export const useLoginFormContext = () => {
    const context = useContext(FormContext)
    if (!context) {
        throw new Error('useLoginFormContext must be used within a FormProvider')
    }
    return context
}