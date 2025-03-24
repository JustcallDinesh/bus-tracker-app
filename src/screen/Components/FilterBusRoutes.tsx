import { useMemo } from "react";

interface FilterBusRoutesProps {
    busRoutes: { busName: string; /* Add other route properties */ }[];
    searchQuery: string;
}
const FilterBusRoutes: React.FC<FilterBusRoutesProps> = ({ busRoutes, searchQuery }) => {
    const filteredRoutes = useMemo(() => {
        return busRoutes.filter((route) => {
            const routeName = route.busName.toLowerCase();
            const query = searchQuery.toLowerCase();
            return routeName.includes(query);
        });
    }, [busRoutes, searchQuery]);

    return filteredRoutes; // Return the filteredRoutes directly
};

export default FilterBusRoutes;