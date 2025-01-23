import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCapsule } from "../hooks/use-capsule";
import { useUser } from "../hooks/use-user";

type TimeCapsuleDialogProps = {
   isOpen: boolean;
   onClose: () => void;
};

export default function TimeCapsuleDialog({
   isOpen,
   onClose,
}: TimeCapsuleDialogProps) {
   const navigate = useNavigate();
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");

   const isValid = title && description;

   const { setCapsule } = useCapsule();
   const { user } = useUser();

   const handleCreateCapsule = async () => {
      if (user) {
         setCapsule({
            _id: "",
            title,
            description,
            creator: user,
            media: [],
            recipients: [],
            accessCode: "",
            contributors: [],
         });
         navigate("/dashboard/suggestions");
      } else {
         console.error("User is not logged in");
      }

      navigate("/dashboard/suggestions");
   };
   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="w-11/12 max-w-3xl h-[90vh] p-6">
            <ScrollArea className="h-full pr-4">
               <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center mb-6">
                     Create Time Capsule
                  </DialogTitle>
               </DialogHeader>

               <div className="grid gap-4 mb-6">
                  <div className="space-y-2">
                     <Label htmlFor="title">Title</Label>
                     <Input
                        id="title"
                        placeholder="Enter time capsule title"
                        className="w-full"
                        onChange={(e) => setTitle(e.target.value)}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="description">Description</Label>
                     <Textarea
                        id="description"
                        placeholder="Describe your time capsule..."
                        className="min-h-[100px] w-full"
                        onChange={(e) => setDescription(e.target.value)}
                     />
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-center">Use Cases</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     {[
                        {
                           title: "Families",
                           image:
                              "https://plus.unsplash.com/premium_photo-1661475916373-5aaaeb4a5393?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                           alt: "Family memories",
                           description:
                              "Hold onto every precious memory before it fades, and send it back when they're older.",
                        },
                        {
                           title: "Students",
                           image:
                              "https://plus.unsplash.com/premium_photo-1683135216954-ab7130031b44?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                           alt: "Student growth",
                           description:
                              "Capture growth, dreams, and early journeys as you navigate into who you want to be.",
                        },
                        {
                           title: "Leaving a Legacy",
                           image:
                              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
                           alt: "Legacy",
                           description:
                              "Ensure your stories live on—share them with exactly who you choose, and when you want it delivered.",
                        },
                        {
                           title: "Dear Future Me...",
                           image:
                              "https://images.unsplash.com/photo-1714273709972-f5b3606bf227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                           alt: "Future self",
                           description:
                              "Preserve the dreams, hopes, and memories that make this moment unique, and capture who you are today for your future self.",
                        },
                        {
                           title: "Future Events",
                           image:
                              "https://images.unsplash.com/photo-1521356279905-e1d72a443574?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
                           alt: "Special events",
                           description:
                              "For the big moments that matter the most—keep those memories alive for years to come.",
                        },
                        {
                           title: "Last Letter",
                           image:
                              "https://plus.unsplash.com/premium_photo-1661304840506-c97889ecf08a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                           alt: "Last letter",
                           description:
                              "Even when you're no longer by their side, continue to share your love, wisdom, and memories for the future.",
                        },
                     ].map(({ title, image, alt, description }) => (
                        <div
                           key={title}
                           className="space-y-3 text-center p-4 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                           <div className="relative w-32 h-32 mx-auto">
                              <img
                                 src={image}
                                 alt={alt}
                                 className="rounded-full object-cover w-full h-full shadow-md"
                              />
                           </div>
                           <h4 className="text-lg font-semibold text-primary">{title}</h4>
                           <p className="text-sm text-gray-600 text-justify">{description}</p>
                        </div>
                     ))}
                  </div>
               </div>

            </ScrollArea>
            <Button
               className="w-full"
               onClick={handleCreateCapsule}
               disabled={!isValid}
            >
               Create Capsule
            </Button>
         </DialogContent>
      </Dialog>
   );
}
