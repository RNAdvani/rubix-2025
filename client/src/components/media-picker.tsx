import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Photo {
  id: string;
  url: string;
  alt: string;
}

interface MediaPickerProps {
  onPhotosSelected?: (photos: Photo[]) => void;
}

const sampleImages = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&auto=format",
    alt: "Sunset landscape",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1682687221038-404670f05144?w=500&auto=format",
    alt: "Mountain view",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=500&auto=format",
    alt: "Ocean waves",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1682686581030-7fa4ea2b96c3?w=500&auto=format",
    alt: "Forest path",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1682686580024-580519d4b2d2?w=500&auto=format",
    alt: "City lights",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1682686578289-cf9c8c472c9b?w=500&auto=format",
    alt: "Desert dunes",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1682686580186-b55d2a91053c?w=500&auto=format",
    alt: "Snow peaks",
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=500&auto=format",
    alt: "Autumn leaves",
  },
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=500&auto=format",
    alt: "Tropical beach",
  },
  {
    id: "10",
    url: "https://images.unsplash.com/photo-1682695794947-17061dc284dd?w=500&auto=format",
    alt: "Urban architecture",
  },
  {
    id: "11",
    url: "https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=500&auto=format",
    alt: "Waterfall",
  },
  {
    id: "12",
    url: "https://images.unsplash.com/photo-1682687221038-404670f05144?w=500&auto=format",
    alt: "Starry night",
  },
];

export const MediaPicker = ({ onPhotosSelected }: MediaPickerProps) => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddPhotos = () => {
    // Get the selected photos from sampleImages
    const selectedPhotos = sampleImages.filter((img) =>
      selectedFiles.has(img.id)
    );

    // Store in sessionStorage
    sessionStorage.setItem("selectedPhotos", JSON.stringify(selectedPhotos));

    // Notify parent component if callback exists
    if (onPhotosSelected) {
      onPhotosSelected(selectedPhotos);
    }

    // Navigate to editor
    navigate("/editor");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6 flex flex-col">
      <h2 className="text-2xl font-bold">Select Photos</h2>
      <ScrollArea className="h-[600px] rounded-lg border">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-1 p-1">
          {sampleImages.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square cursor-pointer"
              onClick={() => toggleSelection(image.id)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className={cn(
                  "object-cover w-full h-full transition-opacity",
                  selectedFiles.has(image.id)
                    ? "opacity-75"
                    : "group-hover:opacity-75"
                )}
              />
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-colors",
                  selectedFiles.has(image.id)
                    ? "bg-black/20"
                    : "bg-transparent group-hover:bg-black/10"
                )}
              >
                {selectedFiles.has(image.id) && (
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Button
        disabled={selectedFiles.size === 0}
        className="gap-2 w-1/3"
        onClick={handleAddPhotos}
      >
        Edit Selected ({selectedFiles.size})
      </Button>
    </div>
  );
};
