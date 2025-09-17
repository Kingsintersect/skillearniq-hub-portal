import { InputField } from '@/components/core/forms/input-field'
import { ProgramAccordionDisplay } from '@/components/ProgramAccordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { usePrograms } from '@/hooks/usePrograms'
import { SignUpFormData } from '@/schema/sign-up-schema'
import { GenericHookFormProps } from '@/types/forms'
import { AlertCircleIcon } from 'lucide-react'
import React from 'react'

type AcademicInformationProps = GenericHookFormProps<SignUpFormData>;

export const AcademicInformation: React.FC<AcademicInformationProps> = ({ register, setValue, getValues, watch, errors }) => {
    const { lmsPrograms: programs, isLoadingLmsProg: isLoading, isError } = usePrograms();

    setValue!("start_year", new Date().getFullYear().toString());
    setValue!("academic_session", `${new Date().getFullYear()}/${(new Date().getFullYear() + 1).toString().slice(-2)}`);
    setValue!("academic_semester", "1st Semester");

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <InputField
                    id='regNumber'
                    {...register('regNumber')}
                    label="Student Registration Number"
                    placeholder="Enter your student Registration Number"
                    error={errors.regNumber?.message}
                    required
                />
            </div>
            <div className="grid grid-cols-1 gap-4">
                {(isLoading) && (
                    <div className='w-full flex items-center justify-center'>
                        <LoadingSpinner size="md" className="mr-2" />
                        Loading Programs...
                    </div>
                )}
                {(isError || !programs) && (
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>Failed to load programs.</AlertTitle>
                        <AlertDescription>
                            <p>Please check your network connection and try again.</p>
                        </AlertDescription>
                    </Alert>
                )}
                <ProgramAccordionDisplay<SignUpFormData>
                    programs={programs}
                    setValue={setValue!}
                    getValues={getValues!}
                    errors={errors}
                    watch={watch!}
                    fieldKey="program"
                    fieldIdKey="program_id"
                    subHeading="any program can be selected from the parent to the child program..."
                />
            </div>
        </div>
    )
}
