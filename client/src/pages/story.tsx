import { api } from "@/lib/api";
import { Media } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import StoryViewer from "@/components/story/story";

const Story = () => {
   const { id } = useParams();
   const [stories, setStories] = useState<Media[]>([]);
   const [loading, setLoading] = useState(false);

   const navigate = useNavigate();

   useEffect(() => {
      setLoading(true);
      const fetchStories = async () => {
         try {
            const res = await api.get(`/api/capsule/get/${id}`);

            if (res.data.success) {
               setStories(res.data.data.media);
            } else if (res.data.redirect) {
               navigate(`/unlocking/${id}`);
            }
         } catch (error) {
            toast.error("Something went wrong");
         } finally {
            setLoading(false);
         }
      };

      fetchStories();
   }, []);

   if (loading) {
      return (
         <div className="flex items-center justify-center h-full">
            <Loader2 className="size-9 animate-spin" />
         </div>
      );
   }

   return (
      <div>
         <StoryViewer items={stories} />
      </div>
   );
};

export default Story;
