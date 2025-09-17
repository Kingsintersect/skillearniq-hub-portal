import { GENDER_OPTIONS, NATIONALITY_OPTIONS, STATE_OPTIONS } from "@/lib/dummy-data";
import { useMemo } from "react";

export const useStaticData = () => {
    const NewGender = useMemo(() => GENDER_OPTIONS, []);
    const NewNationality = useMemo(() => NATIONALITY_OPTIONS, []);
    const NewState = useMemo(() => STATE_OPTIONS, []);

    return { NewGender, NewNationality, NewState };
};
