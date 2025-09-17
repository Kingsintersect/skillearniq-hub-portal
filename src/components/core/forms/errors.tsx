import { FieldErrors, FieldValues } from "react-hook-form";

type FormErrorListProps<T extends FieldValues> = {
    errors: FieldErrors<T>;
};

export function FormErrorList<T extends FieldValues>({ errors }: FormErrorListProps<T>) {
    const allErrors = Object.values(errors).map((err) => err?.message as string);

    if (allErrors.length === 0) return null;

    return (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
            <ul className="list-disc pl-5 text-red-600 text-sm space-y-1">
                {allErrors.map((err, index) => (
                    <li key={index}>{err}</li>
                ))}
            </ul>
        </div>
    );
}
