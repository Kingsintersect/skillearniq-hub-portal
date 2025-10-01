import { InputField } from '@/components/core/forms/input-field'
import { usePrograms } from '@/hooks/usePrograms'
import { SignUpFormData } from '@/schema/sign-up-schema'
import { GenericHookFormProps } from '@/types/forms'
import React from 'react'

type ParentInformationProps = GenericHookFormProps<SignUpFormData>;

export const ParentInformation: React.FC<ParentInformationProps> = ({ register, errors }) => {

    return (
        <div className="space-y-6">
            <h5 className="text-2xl text-accent">
                The Parent details are optional
            </h5>
            <div className="grid grid-cols-1 gap-4">
                <InputField
                    id='parent_first_name'
                    {...register('parent_first_name')}
                    type="parent_first_name"
                    label="Parent First Name"
                    placeholder="Enter your parent's first name"
                    error={errors.parent_first_name?.message}
                />

                <InputField
                    id='parent_last_name'
                    {...register('parent_last_name')}
                    label="Parent Last Name"
                    placeholder="Enter your parent's last name"
                    error={errors.parent_last_name?.message}
                />
            </div>
            <div className="grid grid-cols-1 gap-4">
                <InputField
                    id='parent_email'
                    {...register('parent_email')}
                    type="parent_email"
                    label="Parent Email Address"
                    placeholder="Enter your parent's email address"
                    error={errors.parent_email?.message}
                />

                <InputField
                    id='parent_phone_number'
                    {...register('parent_phone_number')}
                    label="Parent Phone Number"
                    placeholder="Enter your parent's phone number"
                    error={errors.parent_phone_number?.message}
                />
            </div>
        </div>
    )
}
