import axios from "axios";
import { ITimeCapsule } from "../schema";

const FACEBOOK_GRAPH_API_URL = "https://graph.instagram.com/v22.0";
const INSTAGRAM_ACCOUNT_ID = "17841471761488844"; // Get this via Instagram API
const ACCESS_TOKEN =
  "IGAANXZCxPacV1BZAFBWNUI4MXJSQ3BKNVEzWW8weHdtTkhlY2xhcUM4NlFZAVFp0MW9VR3Y3WklfTXI0M1ZAmbUdVT1gzNElDell1X3ZAtUURnUmJrdHZA4aFFCcnNHSUFxU3BlVUd4S1hwOTktMGljbHJZAUndRcDdmS2YzWV8wNE11NAZDZD";

export const postInstaMedia = async (
  caption: string,
  mediaUrl: string,
  resourceType: "VIDEO" | "IMAGE"
) => {
  try {
    const res = await axios.post(
      `${FACEBOOK_GRAPH_API_URL}/${INSTAGRAM_ACCOUNT_ID}/media`,
      {
        access_token: ACCESS_TOKEN,
        caption: caption,
        image_url: resourceType === "IMAGE" ? mediaUrl : undefined,
        video_url: resourceType === "VIDEO" ? mediaUrl : undefined,
        media_type: resourceType,
      }
    );
    return res.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

export const publishInstaMedia = async (mediaId: string) => {
  try {
    console.log("Media ID:", mediaId);
    const res = await axios.post(
      `${FACEBOOK_GRAPH_API_URL}/${INSTAGRAM_ACCOUNT_ID}/media_publish`,
      {
        access_token: ACCESS_TOKEN,
        creation_id: mediaId,
      }
    );
    return res.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

export const postInstaCarousel = async (
  caption: string,
  mediaUrls: { url: string; type: "IMAGE" | "VIDEO" }[]
) => {
  try {
    // Step 1: Upload all media items and collect their IDs
    const mediaIds = await Promise.all(
      mediaUrls.map(async (m) => {
        const res = await postInstaMedia("", m.url, m.type); // Assuming all are images
        return res?.id;
      })
    );

    console.log("Media IDs:", mediaIds);

    // Step 2: Create a carousel container
    const res = await axios.post(
      `${FACEBOOK_GRAPH_API_URL}/${INSTAGRAM_ACCOUNT_ID}/media`,
      {
        access_token: ACCESS_TOKEN,
        caption: caption,
        children: mediaIds,
        media_type: "CAROUSEL",
      }
    );

    return res.data;
  } catch (error) {
    // console.error(error);
    return null;
  }
};

export const postToInstagram = async (capsule: ITimeCapsule) => {
  const { media, title } = capsule;

  if (!media || media.length === 0) {
    console.error("No media found in capsule.");
    return;
  }

  const mediaArray = media.map((item) => {
    return {
      url: item?.url,
      type: item?.metadata?.type.toUpperCase() || "IMAGE",
    };
  }) as { url: string; type: "IMAGE" | "VIDEO" }[];

  console.log("Media Array:", mediaArray);

  if (media.length === 1) {
    const mediaUrl = mediaArray[0].url;
    const resourceType = mediaArray[0].type as "VIDEO" | "IMAGE";
    const singlePost = await postInstaMedia(title, mediaUrl, resourceType);

    if (singlePost) {
      await publishInstaMedia(singlePost.id);
      console.log("Single post published successfully.");
    }
  } else {
    const carouselPost = await postInstaCarousel(title, mediaArray);

    if (carouselPost) {
      await publishInstaMedia(carouselPost.id);
      console.log("Carousel post published successfully.");
    }
  }
};
