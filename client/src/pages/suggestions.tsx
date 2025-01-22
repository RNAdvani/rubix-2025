import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Camera, CircleCheckBig } from "lucide-react";
import { RecordCard } from "@/components/cards/record-card";
import { MediaPicker } from "@/components/media-picker";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export interface Photo {
  url: string;
}

const Suggestions = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([]);

  const navigate = useNavigate();

  const prompts = [
    "Share a message for your future self...",
    "What are your hopes and dreams for the future?",
    "Describe your perfect day...",
    "What advice would you give to your future self?",
    "Share a memory that makes you smile...",
  ];

  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);

  useState(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => {
        const currentIndex = prompts.indexOf(prev);
        return prompts[(currentIndex + 1) % prompts.length];
      });
    }, 10000);

    return () => clearInterval(interval);
  });

  const handlePhotosSelected = (photos: Photo[]) => {
    setSelectedPhotos(photos);
  };

  const handleNext = () => {
    // Store photos in sessionStorage before navigation
    sessionStorage.setItem("selectedPhotos", JSON.stringify(selectedPhotos));
    navigate("/editor");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Create Your Time Capsule Memory
            </CardTitle>
            <CardDescription>
              Choose how you want to preserve this moment in time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="space-y-6">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="upload" className="space-x-2">
                  <CircleCheckBig className="w-4 h-4" />
                  <span>Media</span>
                </TabsTrigger>
                <TabsTrigger value="record" className="space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>Record</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <MediaPicker onPhotosSelected={handlePhotosSelected} />
                {selectedPhotos.length > 0 && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={handleNext}>Edit Photos</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="record" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <RecordCard
                    icon={Camera}
                    title="Video Recording"
                    description="Record a video message"
                    isRecording={isRecording}
                    onToggleRecording={() => setIsRecording(!isRecording)}
                  />
                  <RecordCard
                    icon={Mic}
                    title="Audio Recording"
                    description="Record a voice message"
                    isRecording={isRecording}
                    onToggleRecording={() => setIsRecording(!isRecording)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 bg-card/50 backdrop-blur">
              <CardContent className="p-4">
                <p className="text-lg text-center font-medium animate-fade-in">
                  {currentPrompt}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
