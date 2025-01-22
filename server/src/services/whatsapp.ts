import axios from "axios";

export const sendWhatsapp = async (message: string, phone: string) => {
   try {
      const res = await axios.post(
         "https://api.zaply.dev/v1/instance/i50n26wf01/message/send",
         {
            message: message,
            number: phone,
         },
         {
            headers: {
               Authorization: "Bearer ss8yzxfg7fqhivpfq86p9fh16g3gam",
            },
         }
      );
   } catch (error) {
      console.log(error);
   }
};
