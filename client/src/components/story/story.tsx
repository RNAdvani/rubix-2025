import React, { useState, useEffect, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import ImageStory from "./image";
import VideoStory from "./video";
import AudioStory from "./audio";
import { Media } from "@/lib/types";
import { identifyFileType } from "@/lib/utils";

interface StoryProps {
   items: Media[];
}

const Story: React.FC<StoryProps> = ({ items }) => {
   const [currentIndex, setCurrentIndex] = useState(0);
   const [progress, setProgress] = useState(0);
   const [isPaused, setIsPaused] = useState(false);
   const timerRef = useRef<NodeJS.Timeout | null>(null);
   const startXRef = useRef(0);

   const PROGRESS_DURATION = 2500;
   const PROGRESS_INTERVAL = 100;

   const stopTimer = () => {
      if (timerRef.current) {
         clearInterval(timerRef.current);
         timerRef.current = null;
      }
   };

   const startTimer = () => {
      stopTimer();
      timerRef.current = setInterval(() => {
         if (!isPaused) {
            setProgress((oldProgress) => {
               const newProgress =
                  oldProgress + (PROGRESS_INTERVAL / PROGRESS_DURATION) * 100;
               if (newProgress >= 100) {
                  setCurrentIndex((prev) => (prev + 1) % items.length);
                  return 0;
               }
               return newProgress;
            });
         }
      }, PROGRESS_INTERVAL);
   };

   useEffect(() => {
      startTimer();
      return stopTimer;
   }, [currentIndex, isPaused]);

   const handleTouchStart = (e: React.TouchEvent) => {
      startXRef.current = e.touches[0].clientX;
      setIsPaused(true);
   };

   const handleTouchEnd = (e: React.TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const diffX = startXRef.current - endX;

      if (diffX > 50) {
         setCurrentIndex((prev) => (prev + 1) % items.length);
      } else if (diffX < -50) {
         setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
      }

      setIsPaused(false);
   };

   const currentItem = items[currentIndex];

   const renderStoryContent = () => {
      if (!currentItem || !currentItem.url) return null;
      switch (identifyFileType(currentItem.url)) {
         case "image":
            return <ImageStory url={currentItem.url} />;
         case "video":
            return <VideoStory url={currentItem.url} />;
         case "audio":
            return <AudioStory url={currentItem.url} />;
         default:
            return null;
      }
   };

   return (
      <div
         className="relative w-full h-full bg-black"
         onTouchStart={handleTouchStart}
         onTouchEnd={handleTouchEnd}
      >
         <div className="absolute top-0 z-10 w-full flex items-center gap-2 p-2">
            {items.map((_, index) => (
               <Progress
                  key={index}
                  value={
                     index < currentIndex
                        ? 100
                        : index === currentIndex
                        ? progress
                        : 0
                  }
                  className="flex-1"
               />
            ))}
         </div>
         {renderStoryContent()}
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {currentIndex + 1} / {items.length}
         </div>
      </div>
   );
};

export default Story;
