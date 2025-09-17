import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { programService } from "@/lib/services/programService";

export const usePrograms = () => {
    const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
    const [selectedProgramName, setSelectedProgramName] = useState<string | null>(null);


    const { data: lmsPrograms = [], isLoading: isLoadingLmsProg, isError } = useQuery({
        queryKey: ['lmsPrograms'],
        queryFn: () => programService.getLmsPrograms(0),
    });

    const { data: programData = [], isLoading } = useQuery({
        queryKey: ["programs"],
        queryFn: programService.fetchPrograms,
    });

    const parentPrograms = useMemo(
        () =>
            programData
                .filter((item) => item.parent === 0)
                .map((item) => ({
                    id: item.id,
                    label: item.name.trim(),
                    value: String(item.id),
                })),
        [programData]
    );

    const childPrograms = useMemo(
        () =>
            programData
                .filter((item) => item.parent === selectedProgramId)
                .map((item) => ({
                    id: item.id,
                    label: item.name.trim(),
                    value: String(item.id),
                })),
        [programData, selectedProgramId]
    );

    const handleProgramChange = useCallback(
        (programId: string) => {
            const numericId = Number(programId);
            setSelectedProgramId(numericId);

            const selectedProgram = parentPrograms.find((p) => p.id === numericId);
            setSelectedProgramName(selectedProgram?.label || null);
        },
        [parentPrograms]
    );

    return {
        parentPrograms,
        childPrograms,
        selectedProgramId,
        selectedProgramName,
        isLoading,
        handleProgramChange,

        // lms programs
        lmsPrograms,
        isLoadingLmsProg,
        isError,
    };
};
