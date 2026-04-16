import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { EmbedOptions } from "@/lib/options";

export const OptionsContext = createContext<EmbedOptions | null>(null);

export const useOptions = () => {
  const context = useContext(OptionsContext);
  if (!context) {
    throw new Error(
      "useOptions must be used within an OptionsContext.Provider",
    );
  }
  return context;
};
