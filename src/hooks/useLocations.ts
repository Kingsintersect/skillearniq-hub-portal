import { useQuery } from "@tanstack/react-query";
import { locationService } from "@/lib/services/locationService";

export const useCountries = () => {
    return useQuery({
        queryKey: ["countries"],
        queryFn: locationService.fetchCountries,
        select: (data) =>
            data.map((item) => ({
                id: item.id,
                label: item.name,
                value: String(item.id),
            })),
    });
};

export const useStates = () => {
    return useQuery({
        queryKey: ["states"],
        queryFn: () => locationService.fetchStates(),
        select: (data) => data.map((item) => ({
            id: item.id,
            label: item.name,
            value: String(item.id),
        })),
        retry: false,
    });
};

export const useLGA = (stateId?: number) => {
    return useQuery({
        queryKey: ["lga", stateId],
        queryFn: () => locationService.fetchLocalGovAreasInState(stateId!),
        enabled: Boolean(stateId), // don’t fetch until we have a countryId
        select: (data) =>
            data.map((item) => ({
                id: item.id,
                label: item.name,
                value: String(item.id),
            })),
    });
};
