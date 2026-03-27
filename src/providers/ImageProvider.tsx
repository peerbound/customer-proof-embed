import { ComponentChildren } from "preact";
import { ImageContext } from "./ImageContext";
import { EventImages } from "@/lib/images";

interface ImageProviderProps {
  images: EventImages;
  children: ComponentChildren;
}

export const ImageProvider = ({ images, children }: ImageProviderProps) => {
  return (
    <ImageContext.Provider value={images}>{children}</ImageContext.Provider>
  );
};
