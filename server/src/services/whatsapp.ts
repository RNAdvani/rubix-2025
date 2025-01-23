import axios from "axios";

export const sendWhatsapp = async (message: string, phone: string) => {
  try {
    const res = await axios.post(
      "https://api.zaply.dev/v1/instance/3wybo32lg8/message/send",
      {
        message: message,
        number: phone,
      },
      {
        headers: {
          Authorization: "Bearer ozi0e49y1wj3k7e000v1wa4k347nb2",
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};
