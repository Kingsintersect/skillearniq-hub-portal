import { Control, FieldErrors, FieldValues, FormState, UseFormGetValues, UseFormHandleSubmit, UseFormRegister, UseFormReset, UseFormSetValue, UseFormTrigger, UseFormWatch } from 'react-hook-form';
import { ZodError } from 'zod';

export interface GenericHookFormProps<T extends FieldValues> {
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    control?: Control<T>;
    onubmit?: UseFormHandleSubmit<T>;
    formState?: FormState<T>;
    getValues?: UseFormGetValues<T>;
    setValue?: UseFormSetValue<T>;
    trigger?: UseFormTrigger<T>;
    reset?: UseFormReset<T>;
    watch?: UseFormWatch<T>;
}


export function formatZodErrors(error: ZodError | ZodError["issues"]) {
    const issues = error instanceof ZodError ? error.issues : error;

    // Group by field
    const grouped: Record<string, string[]> = {};

    for (const issue of issues) {
        const field = issue.path.join(".") || "form";
        if (!grouped[field]) grouped[field] = [];
        grouped[field].push(issue.message);
    }

    return grouped;

    // USE CASES
    // try {
    //     schema.parse(data);
    // } catch (e) {
    //     if (e instanceof ZodError) {
    //         const formattedErrors = formatZodErrors(e);
    //         console.log(formattedErrors);
    //     }
    // }

    // {
    //   program_id: ["Please select your program_id"],
    //   academic_session: ["Please select your academic session"],
    //   academic_semester: ["Please select your academic semster"],
    //   start_year: ["Please select your academic year"]
    // }

    // IN REACT
    // {
    //     Object.entries(errors).map(([field, messages]) => (
    //         <div key= { field } className = "text-red-500 text-sm" >
    //         <strong>{ field }: </strong> {messages.join(", ")}
    //     </div>
    //     ))
    // }

}


export function flattenZodErrors(error: ZodError | ZodError["issues"]): string[] {
    const issues = error instanceof ZodError ? error.issues : error;
    return issues.map((issue) => issue.message);

    // USE CASES
    // try {
    //     schema.parse(data);
    // } catch (e) {
    //     if (e instanceof ZodError) {
    //         const flatErrors = flattenZodErrors(e);
    //         console.log(flatErrors);
    //     }
    // }

    // catch (err) {
    //     if (err instanceof ZodError) {
    //         const errorMessages = flattenZodErrors(err);
    //         toast.error(errorMessages.join(", "));
    //     }
    // }
}
