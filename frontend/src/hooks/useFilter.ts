/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const useFilter = (): {
  searchParams: URLSearchParams;
  updateFilter(filterName: string, filterValue: any): void;
  removeFilter(filterName: string): void;
} => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilter = useCallback(
    (filterName: string, filterValue: any | any[]): void => {
      if (filterValue === undefined || filterValue === null) {
        return;
      }

      if (searchParams.has(filterName)) {
        const currentValues = searchParams.getAll(filterName);

        if (
          Array.isArray(filterValue) &&
          filterValue.length > 0 &&
          typeof filterValue !== "string" &&
          typeof filterValue !== "number"
        ) {
          const newValues = [...new Set([...currentValues, ...filterValue])];
          searchParams.delete(filterName);
          newValues.forEach((value) => searchParams.append(filterName, value));
        } else {
          currentValues.forEach((value) =>
            searchParams.append(filterName, value)
          );
          searchParams.set(filterName, filterValue);
        }
      } else {
        searchParams.set(filterName, filterValue);
      }

      setSearchParams(searchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const removeFilter = useCallback(
    (filterName: string) => {
      searchParams.delete(filterName);
      setSearchParams(searchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  return {
    searchParams,
    updateFilter,
    removeFilter,
  };
};

export default useFilter;
