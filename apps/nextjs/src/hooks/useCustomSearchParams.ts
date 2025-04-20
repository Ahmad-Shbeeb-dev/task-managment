import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface Props<T extends string> {
  queries: { name: T; value: string }[];
  keepPrevious: boolean;
}

export const useCustomSearchParams = <T extends string>() => {
  const searchParams = useSearchParams();

  const setQueriesString = useCallback(
    ({ queries, keepPrevious }: Props<T>) => {
      const params = keepPrevious
        ? new URLSearchParams(searchParams) //keep previous params
        : new URLSearchParams(); //keep only one param

      queries.forEach((query) => {
        params.set(query.name, query.value);
      });

      return params.toString();
    },
    [searchParams],
  );

  return setQueriesString;
};
