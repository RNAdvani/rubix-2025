import { useRef, useEffect } from "react";
import { Music } from "lucide-react";

interface AudioStoryProps {
   url: string;
}

const AudioStory: React.FC<AudioStoryProps> = ({ url }) => {
   const audioRef = useRef<HTMLAudioElement>(null);

   useEffect(() => {
      if (audioRef.current) {
         audioRef.current.play();
      }
   }, [url]);

   return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
         <Music size={64} className="text-white mb-4" />
         <audio ref={audioRef} src={url} className="w-3/4" controls />
      </div>
   );
};

export default AudioStory;
