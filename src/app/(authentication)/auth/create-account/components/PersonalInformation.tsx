"use client";

import { InputField } from '@/components/core/forms/input-field'
import { SignUpFormData } from '@/schema/sign-up-schema';
import React from 'react'
import { GenericHookFormProps } from '@/types/forms';
import { Controller } from 'react-hook-form';
import { DynamicSelect } from '@/components/core/forms/select-menu';
import { useStaticData } from '@/hooks/useStaticData';
import { useStates } from '@/hooks/useLocations';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type PersonalInformationProps = GenericHookFormProps<SignUpFormData>;

export const PersonalInformation: React.FC<PersonalInformationProps> = ({ register, errors, control }) => {
    const { NewNationality, NewGender } = useStaticData();
    const {
        data: states,
        isLoading: isStatesLoading,
        isError,
        refetch,
        isFetching,
    } = useStates();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    id='first_name'
                    {...register('first_name')}
                    label="First Name"
                    placeholder="Enter your first name"
                    error={errors.first_name?.message}
                    required
                />
                <InputField
                    id='last_name'
                    {...register('last_name')}
                    label="Last Name"
                    placeholder="Enter your last name"
                    error={errors.last_name?.message}
                    required
                />
                <div className="col-span-full">
                    <InputField
                        id='other_name'
                        {...register('other_name')}
                        label="Other Name"
                        placeholder="Enter your other names"
                        error={errors.other_name?.message}
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                {control && (
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <DynamicSelect
                                label="Gender"
                                placeholder="Select your gender"
                                options={NewGender}
                                value={field.value}
                                onValueChange={field.onChange}
                                error={errors.gender?.message}
                                required
                            />
                        )}
                    />
                )}
                {control && (
                    <Controller
                        name="nationality"
                        control={control}
                        render={({ field }) => (
                            <DynamicSelect
                                label="Nationality"
                                placeholder="Select your country"
                                options={NewNationality}
                                value={field.value}
                                onValueChange={field.onChange}
                                error={errors.nationality?.message}
                                required
                            // value={selectedCountryId ? String(selectedCountryId) : ""}
                            // onValueChange={(val) => setSelectedCountryId(Number(val))}
                            />
                        )}
                    />
                )}
                {isStatesLoading ? (
                    <p className='flex items-center gap-5'>Loading states... <Loader2 size={20} className="text-accent animate-spin" /></p>
                ) : isError ? (
                    <div className="space-y-2">
                        <p className="text-red-500">Failed to load states. Please try again.</p>
                        <Button
                            type='button'
                            onClick={() => refetch()}
                            loading={isFetching}
                            className="px-3 py-0.5 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Retry
                        </Button>
                    </div>
                ) : control && states && states.length > 0 ? (
                    <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                            <DynamicSelect
                                label="State"
                                placeholder="Select your state"
                                options={states}
                                value={field.value ?? undefined}
                                onValueChange={field.onChange}
                                error={errors.state?.message}
                            />
                        )}
                    />
                ) : (
                    <p>No states available.</p>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                <InputField
                    id='phone'
                    {...register('phone')}
                    label="Phone Number"
                    placeholder="Enter your phone number e.g 08123456789"
                    error={errors.phone?.message}
                    required
                />
            </div>
        </div>
    )
}
