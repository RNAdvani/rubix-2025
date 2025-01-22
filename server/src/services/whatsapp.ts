import axios from "axios"

export const sendWhatsapp = async (message: string, phone: string) => {
    try {
        const res = await axios.post("https://api.zaply.dev/v1/instance/en8rb939np/message/send",{
            message: message,
            number: phone
        })
    } catch (error) {
        console.log(error)
    }
}