'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { FieldErrors, Path, PathValue, UseFormGetValues, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ProgramRequirementsLink } from "./requirements/ProgramRequirementsModal";


type genericObjectType = Record<string, unknown>;
export type ProgramNode = {
    id: number;
    name: string;
    children?: ProgramNode[];
};

interface ProgramAccordionProps<T extends genericObjectType> {
    nodes: ProgramNode[];
    level?: number;
    fieldKey: string;
    fieldIdKey: string;
    setValue: UseFormSetValue<T>;
    watch: UseFormWatch<T>;
}

export default function ProgramAccordion<T extends genericObjectType>({
    nodes,
    level = 0,
    fieldKey,
    fieldIdKey,
    setValue,
    watch,
}: ProgramAccordionProps<T>) {
    const selected = watch(fieldKey as Path<T>);
    const handleProgramSelect = (node: ProgramNode) => {
        setValue(fieldKey as Path<T>, node.name as PathValue<T, Path<T>>);
        setValue(fieldIdKey as Path<T>, String(node.id) as PathValue<T, Path<T>>);
    };

    return (
        <Accordion type="multiple" className={`pl-${level * 4}`}>
            {Array.isArray(nodes) && nodes.map((node, index) => {
                const id = `${level}-${index}-${node.name}`;

                return (
                    <AccordionItem key={id} value={id}>
                        <AccordionTrigger className="text-left">{node.name}</AccordionTrigger>
                        <AccordionContent>
                            <div
                                className={`pl-4 py-1 cursor-pointer rounded ${selected === node.name ? "bg-primary text-white" : "hover:bg-muted"
                                    }`}
                                onClick={() => handleProgramSelect(node)}
                            >
                                🎓 {node.name}
                            </div>

                            {Array.isArray(node.children) && node.children.length > 0 && (
                                <ProgramAccordion<T>
                                    nodes={node.children}
                                    level={level + 1}
                                    setValue={setValue}
                                    fieldKey={fieldKey}
                                    fieldIdKey={fieldIdKey}
                                    watch={watch}
                                />
                            )}
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}

interface ProgramAccordionDisplayProps<T extends genericObjectType> {
    programs: ProgramNode[],
    setValue: UseFormSetValue<T>,
    watch: UseFormWatch<T>,
    getValues: UseFormGetValues<T>,
    errors: FieldErrors<T>;
    fieldKey: string;
    fieldIdKey: string;
    heading?: string;
    subHeading?: string;
}
export const ProgramAccordionDisplay = <T extends genericObjectType>({
    programs,
    setValue,
    getValues,
    watch,
    errors,
    fieldKey,
    fieldIdKey,
    heading,
    subHeading,
}: ProgramAccordionDisplayProps<T>) => {
    const programValue = getValues(fieldKey as Path<T>)

    return (
        <div className="max-w-3xl mx-auto p-4">
            {heading && <h1 className="text-2xl font-bold mb-0 text-site-b-dark">{heading}</h1>}
            {subHeading && <p className="italic text-blue-500 mb-4">{subHeading}</p>}

            <ProgramRequirementsLink
                className="ml-20 text-xs text-orange-600  animate-bounce"
                downloadUrl="/documents/PROGRAMME_AND_REQUIREMENTS.docx"
            />

            <ProgramAccordion
                nodes={programs}
                setValue={setValue}
                watch={watch}
                fieldKey={fieldKey}
                fieldIdKey={fieldIdKey}
            />

            {errors.program && (
                <p className="text-red-500 text-sm mb-2">
                    {String(errors.program.message)}
                </p>
            )}
            {errors.program_id && (
                <p className="text-red-500 text-sm">
                    {String(errors.program_id.message)}
                </p>
            )}

            {programValue && (
                <div className="mt-6 text-green-700 font-semibold border-t pt-4">
                    ✅ You selected: <span className="text-primary">{String(programValue)}</span>
                </div>
            )}
        </div>
    );
}
