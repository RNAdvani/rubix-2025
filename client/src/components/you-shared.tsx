import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Capsule } from "@/lib/types";
import { toast } from "sonner";

export default function YouShared() {
   const [capsules, setCapsules] = useState<Capsule[]>([]);

   useEffect(() => {
      const fetchData = async () => {
         const res = await api.get("/api/capsule/get-created");

         if (res.data.success) {
            setCapsules((p) => [...p, ...res.data.data]);
         } else {
            toast.error("Error fetching capsules");
         }
      };

      fetchData();
   }, []);

   return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {capsules.map((item) => (
            <Card key={item._id} className="relative overflow-hidden h-64">
               <img
                  src={
                     item.media && item.media[0]
                        ? (item.media[0] as any).url
                        : ""
                  }
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/90"></div>
               <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                  <div>
                     <CardTitle className="text-white mb-2">
                        {item.title}
                     </CardTitle>
                     <CardDescription className="text-white/80">
                        {item.description}
                     </CardDescription>
                  </div>
                  <div className="flex -space-x-2 overflow-hidden">
                     {item?.recipients?.map((user) => (
                        <Avatar
                           key={user._id}
                           className="inline-block border-2 border-background"
                        >
                           <AvatarFallback>
                              {user.name[0].charAt(0).toUpperCase()}
                           </AvatarFallback>
                        </Avatar>
                     ))}
                  </div>
               </div>
            </Card>
         ))}
      </div>
   );
}
