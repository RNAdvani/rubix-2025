interface ImageStoryProps {
   url: string;
}

const ImageStory: React.FC<ImageStoryProps> = ({ url }) => {
   return (
      <div className="h-screen w-auto flex items-center justify-center">
         <img
            src={url || "/placeholder.svg"}
            alt="Story"
            className="max-w-full max-h-full object-contain"
         />
      </div>
   );
};

export default ImageStory;
