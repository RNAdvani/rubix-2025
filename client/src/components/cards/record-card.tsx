import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export const RecordCard = ({
   icon: Icon,
   title,
   description,
   isRecording,
   onToggleRecording,
}: {
   icon: any;
   title: string;
   description: string;
   isRecording: boolean;
   onToggleRecording: () => void;
}) => {
   return (
      <Card
         className={`relative overflow-hidden group hover:border-primary transition-colors ${
            isRecording ? "border-destructive" : ""
         }`}
      >
         <CardContent className="p-6 text-center space-y-4">
            <Icon
               className={`w-12 h-12 mx-auto ${
                  isRecording
                     ? "text-destructive animate-pulse"
                     : "text-muted-foreground group-hover:text-primary"
               } transition-colors`}
            />
            <div>
               <h3 className="font-semibold">{title}</h3>
               <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button
               variant={isRecording ? "destructive" : "secondary"}
               className="w-full"
               onClick={onToggleRecording}
            >
               {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
         </CardContent>
      </Card>
   );
};
