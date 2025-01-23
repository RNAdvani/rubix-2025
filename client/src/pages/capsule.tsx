import { CapsulePage } from "@/components/capsule";
import { api } from "@/lib/api";
import { Capsule as CapsuleTypes } from "@/lib/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const Capsule = () => {
   const { id } = useParams();
   const [data, setData] = useState<CapsuleTypes>();
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         const res = await api.get(`/api/capsule/get/${id}`);

         if (res.data.success) {
            setData(res.data.data);
         } else {
            toast.error("Error fetching capsule");
         }
      };

      fetchData();
   }, []);

   console.log(data);
   const handleAddCollaborator = async () => {};

   const handleUpdateCollaborativeLock = async () => {
      setLoading(true);

      try {
         const res = await api.patch("/api/capsule/update", {
            capsuleId: id,
            isCollaboratorLock: !data?.isCollaboratorLock,
         });

         if (res.data.success) {
            setData((p) => ({
               ...p,
               isCollaboratorLock: !p?.isCollaboratorLock,
            }));
            toast.success("Capsule updated successfully");
         } else {
            toast.error("Error updating capsule");
         }
      } catch (error) {
         toast.error("Error updating capsule");
      } finally {
         setLoading(false);
      }
   };

   const handleAddMedia = async (files: any) => {
      console.log({ files });

      setLoading(true);

      const formData = new FormData();
      if (id) {
         formData.append("capsuleId", id);
      } else {
         toast.error("Capsule ID is missing");
         setLoading(false);
         return;
      }

      files.forEach((file: any) => {
         formData.append("media", file);
      });

      try {
         const res = await api.patch("/api/capsule/add-media", formData);
         console.log(res);
      } catch (error) {}
   };

   return (
      <div className="text-white">
         {data && (
            <CapsulePage
               data={data}
               onAddMedia={(files) => handleAddMedia(files)}
               onAddCollaborator={handleAddCollaborator}
               onUpdateCollaboratorLock={handleUpdateCollaborativeLock}
               loading={loading}
            />
         )}
      </div>
   );
};

export default Capsule;
