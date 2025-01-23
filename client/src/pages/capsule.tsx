import { CapsulePage } from "@/components/capsule";
import { api } from "@/lib/api";
import { Capsule as CapsuleTypes } from "@/lib/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Capsule = () => {
   const { id } = useParams();
   const [data, setData] = useState<CapsuleTypes>();
   const [loading, setLoading] = useState(false);

   const navigate = useNavigate();

   useEffect(() => {
      const fetchData = async () => {
         const res = await api.get(`/api/capsule/get/${id}`);

         if (res.data.success) {
            setData(res.data.data);
         } else if (res.data.redirect) {
            navigate(`/unlocking/${id}`);
         } else {
            toast.error("Error fetching capsule");
         }
      };

      fetchData();
   }, []);

   const handleAddCollaborator = async (userId: string) => {
      setLoading(true);

      try {
         const res = await api.post("/api/capsule/add-contributors", {
            capsuleId: id,
            contributors: [userId],
         });

         if (res.data.success) {
            toast.success("Collaborator added successfully");
         }
      } catch (error) {
         toast.error("Error adding collaborator");
      } finally {
         setLoading(false);
      }
   };

   const handleAddRecipient = async (userId: string) => {
      setLoading(true);

      try {
         const res = await api.post("/api/capsule/add-recipients", {
            capsuleId: id,
            recipients: [userId],
         });

         if (res.data.success) {
            toast.success("Recipient added successfully");
         }
      } catch (error) {
         toast.error("Error adding recipient");
      } finally {
         setLoading(false);
      }
   };

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
               onAddRecipient={handleAddRecipient}
               onAddMedia={(files) => handleAddMedia(files)}
               onAddCollaborator={handleAddCollaborator}
               onUpdateCollaboratorLock={handleUpdateCollaborativeLock}
            />
         )}
      </div>
   );
};

export default Capsule;
