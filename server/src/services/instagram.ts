import axios from "axios";

const FACEBOOK_GRAPH_API_URL = "https://graph.instagram.com/v22.0";
const INSTAGRAM_ACCOUNT_ID = "17841471761488844"; // Get this via Instagram API
const ACCESS_TOKEN = "IGAANXZCxPacV1BZAFBWNUI4MXJSQ3BKNVEzWW8weHdtTkhlY2xhcUM4NlFZAVFp0MW9VR3Y3WklfTXI0M1ZAmbUdVT1gzNElDell1X3ZAtUURnUmJrdHZA4aFFCcnNHSUFxU3BlVUd4S1hwOTktMGljbHJZAUndRcDdmS2YzWV8wNE11NAZDZD";

export const postInstaMedia = async (caption: string, mediaUrl: string,resourceType:"VIDEO"|"IMAGE") => {
    try {
        const res = await axios.post(`${FACEBOOK_GRAPH_API_URL}/${INSTAGRAM_ACCOUNT_ID}/media`,{
            access_token: ACCESS_TOKEN,
            caption: caption,
            image_url: resourceType === "IMAGE" ? mediaUrl : undefined,
            video_url: resourceType === "VIDEO" ? mediaUrl : undefined,
            media_type: resourceType
        })
        return res.data
    } catch (error) {
        console.log(error)
        return null
    }
}

export const publishInstaMedia = async (mediaId: string) => {
    try {
        console.log('Media ID:',mediaId)
        const res = await axios.post(`${FACEBOOK_GRAPH_API_URL}/${INSTAGRAM_ACCOUNT_ID}/media_publish`,{
            access_token: ACCESS_TOKEN,
            creation_id: mediaId
        })
        return res.data
    } catch (error) {
        console.log(error)
        return null
    }
}