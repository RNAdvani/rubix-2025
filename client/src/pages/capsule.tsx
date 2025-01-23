import { CapsulePage } from "@/components/capsule";
import { api } from "@/lib/api";
import { Capsule as CapsuleTypes } from "@/lib/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const Capsule = () => {
   const { id } = useParams();
   const [data, setData] = useState<CapsuleTypes>();

   useEffect(() => {
      const fetchData = async () => {
         const res = await api.get(`/api/capsule/get/${id}`);

         if (res.data.success) {
            setData(res.data.data);
            console.log(res.data.data);
         } else {
            toast.error("Error fetching capsule");
         }
      };

      fetchData();
   }, []);

   return (
      <div className="text-white">
         {data && (
            <CapsulePage
               data={data}
               onAddCollaborator={() => {}}
               onUpdateCollaborative={() => {}}
               onUpdateCollaboratorLock={() => {}}
            />
         )}
      </div>
   );
};

export default Capsule;
