import { TryCatch } from "../lib/TryCatch";

export const createCapsule = TryCatch(async (req, res, next) => {
  const {
    title,
    description,
    unlockDate,
    creator,
    media,
    isPublic,
    recipients,
    accessCode,
    isCollaborative,
    contributors,
    createdAt,
    updatedAt,
  } = req.body;
});
