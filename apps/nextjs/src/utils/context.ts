import { createContext } from "react";

export const PageTitleContext = createContext<{
  pageTitle: string | null;
  setPageTitle: React.Dispatch<React.SetStateAction<string | null>> | null;
}>({ pageTitle: null, setPageTitle: null });
