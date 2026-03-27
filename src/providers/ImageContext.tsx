import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { EventImages } from "@/lib/images";

export const ImageContext = createContext<EventImages | null>(null);

export const useImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImages must be used within an ImageProvider");
  }
  return context;
};
