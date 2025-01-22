import React from "react";
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

type TimeCapsuleDialogProps = {
   isOpen: boolean;
   onClose: () => void;
};

export default function TimeCapsuleDialog({
   isOpen,
   onClose,
}: TimeCapsuleDialogProps) {
   const navigate = useNavigate();
   const handleCreateCapsule = () => {
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
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="description">Description</Label>
                     <Textarea
                        id="description"
                        placeholder="Describe your time capsule..."
                        className="min-h-[100px] w-full"
                     />
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-center">
                     Use Cases
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     {/* Families */}
                     <div className="space-y-3 text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="relative w-32 h-32 mx-auto">
                           <img
                              src="https://plus.unsplash.com/premium_photo-1661475916373-5aaaeb4a5393?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Updated family image
                              alt="Family memories"
                              className="rounded-full object-cover w-full h-full shadow-md"
                           />
                        </div>
                        <h4 className="text-lg font-semibold text-blue-600">
                           Families
                        </h4>
                        <p className="text-sm text-gray-600">
                           Hold onto every precious memory before it fades, and
                           send it back when they're older.
                        </p>
                     </div>

                     {/* Students */}
                     <div className="space-y-3 text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="relative w-32 h-32 mx-auto">
                           <img
                              src="https://plus.unsplash.com/premium_photo-1683135216954-ab7130031b44?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Updated student image
                              alt="Student growth"
                              className="rounded-full object-cover w-full h-full shadow-md"
                           />
                        </div>
                        <h4 className="text-lg font-semibold text-blue-600">
                           Students
                        </h4>
                        <p className="text-sm text-gray-600">
                           Capture growth, dreams, and early journeys as you
                           navigate into who you want to be.
                        </p>
                     </div>

                     {/* Legacy */}
                     <div className="space-y-3 text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="relative w-32 h-32 mx-auto">
                           <img
                              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97" // Updated legacy image
                              alt="Legacy"
                              className="rounded-full object-cover w-full h-full shadow-md"
                           />
                        </div>
                        <h4 className="text-lg font-semibold text-blue-600">
                           Leaving a Legacy
                        </h4>
                        <p className="text-sm text-gray-600">
                           Ensure your stories live on—share them with exactly
                           who you choose, and when you want it delivered.
                        </p>
                     </div>

                     {/* Future Me */}
                     <div className="space-y-3 text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="relative w-32 h-32 mx-auto">
                           <img
                              src="https://images.unsplash.com/photo-1714273709972-f5b3606bf227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Updated future self image
                              alt="Future self"
                              className="rounded-full object-cover w-full h-full shadow-md"
                           />
                        </div>
                        <h4 className="text-lg font-semibold text-blue-600">
                           Dear Future Me...
                        </h4>
                        <p className="text-sm text-gray-600">
                           Preserve the dreams, hopes, and memories that make
                           this moment unique, and capture who you are today for
                           your future self.
                        </p>
                     </div>

                     {/* Events */}
                     <div className="space-y-3 text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="relative w-32 h-32 mx-auto">
                           <img
                              src="https://images.unsplash.com/photo-1559736454-21a2d22a29d1" // Updated event image
                              alt="Special events"
                              className="rounded-full object-cover w-full h-full shadow-md"
                           />
                        </div>
                        <h4 className="text-lg font-semibold text-blue-600">
                           Future Events
                        </h4>
                        <p className="text-sm text-gray-600">
                           For the big moments that matter the most—keep those
                           memories alive for years to come.
                        </p>
                     </div>

                     {/* Last Letter */}
                     <div className="space-y-3 text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="relative w-32 h-32 mx-auto">
                           <img
                              src="https://plus.unsplash.com/premium_photo-1661304840506-c97889ecf08a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Updated last letter image
                              alt="Last letter"
                              className="rounded-full object-cover w-full h-full shadow-md"
                           />
                        </div>
                        <h4 className="text-lg font-semibold text-blue-600">
                           Last Letter
                        </h4>
                        <p className="text-sm text-gray-600">
                           Even when you're no longer by their side, continue to
                           share your love, wisdom, and memories for the future.
                        </p>
                     </div>
                  </div>
               </div>
            </ScrollArea>
            <Button className="w-full" onClick={handleCreateCapsule}>
               Create Capsule
            </Button>
         </DialogContent>
      </Dialog>
   );
}
