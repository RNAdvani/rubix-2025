import { ErrorHandler } from "../lib/ErrorHandler";
import { TryCatch } from "../lib/TryCatch";
import { Media } from "../models/media.model";
import { TimeCapsule } from "../models/timecapsule.model";
import { uploadOnCloudinary } from "../services/cloudinary";

export const createCapsule = TryCatch(async (req, res, next) => {
  const { title, description, contributors } = req.body;

  const media = req.files as Express.Multer.File[];

  if (!title || !description)
    return next(new ErrorHandler(400, "Please provide title and description"));

  if (!media || media.length === 0)
    return next(new ErrorHandler(400, "Please provide media"));

  const capsule = await TimeCapsule.create({
    title,
    description,
    creator: req.user._id,
    media: [],
    recipients: [req.user._id],
  });

  const promises = media.map(async (m: Express.Multer.File) => {
    return uploadOnCloudinary(m.path, "image");
  });

  const mediaUrls = await Promise.all(promises);

  const mediaPromises = mediaUrls.map(async (m) => {
    return Media.create({
      url: m?.secure_url,
      metadata: {
        type: "",
        timestamp: "",
        tags: [],
        description: "",
        inPictures: [],
        location: { type: "", coordinates: [0, 0] },
      },
      AIGeneratedSummary: "",
    });
  });

  const mediaDocs = await Promise.all(mediaPromises);

  capsule.media = mediaDocs.map((m) => m._id);

  if (contributors && contributors.length > 0) {
    capsule.isCollaborative = true;
    capsule.contributors = contributors;
  }

  await capsule.save();

  return res.status(201).json({ success: true, data: capsule });
});

export const getCreatedCapsules = TryCatch(async (req, res, next) => {
  const capsules = await TimeCapsule.find({
    creator: req.user._id,
  }).populate("media");

  return res.status(200).json({ success: true, data: capsules });
});

export const getReceivedCapsules = TryCatch(async (req, res, next) => {
  const capsules = await TimeCapsule.find({
    recipients: req.user._id,
  });

  return res.status(200).json({ success: true, data: capsules });
});

export const getCapsule = TryCatch(async (req, res, next) => {
  const capsule = await TimeCapsule.findById(req.params.id);

  if (!capsule)
    return next(new ErrorHandler(404, "Capsule not found or has been deleted"));

  if (!capsule.recipients.includes(req.user._id)) {
    return next(
      new ErrorHandler(403, "You are not allowed to view this capsule")
    );
  }

  if (Date.now() < capsule.unlockDate.getTime() || capsule.isPermanentLock) {
    return next(new ErrorHandler(403, "This capsule is locked"));
  }

  return res.status(200).json({ success: true, data: capsule });
});

export const addRecepients = TryCatch(async (req, res, next) => {
  const { capsuleId, recipients } = req.body;

  if (!recipients || recipients.length === 0)
    return next(new ErrorHandler(400, "Please provide recipients"));

  const capsule = await TimeCapsule.findById(capsuleId);

  if (!capsule)
    return next(new ErrorHandler(404, "Capsule not found or has been deleted"));

  if (!capsule.creator.equals(req.user._id))
    return next(
      new ErrorHandler(403, "You are not allowed to perform this action")
    );

  capsule.recipients = [...new Set([...capsule.recipients, ...recipients])];

  await capsule.save();

  return res.status(200).json({ success: true, data: capsule });
});

export const addContributors = TryCatch(async (req, res, next) => {
  const { capsuleId, contributors } = req.body;

  if (!contributors || contributors.length === 0)
    return next(new ErrorHandler(400, "Please provide contributors"));

  const capsule = await TimeCapsule.findById(capsuleId);

  if (!capsule)
    return next(new ErrorHandler(404, "Capsule not found or has been deleted"));

  if (!capsule.creator.equals(req.user._id))
    return next(
      new ErrorHandler(403, "You are not allowed to perform this action")
    );

  if (!capsule.isCollaborative) {
    capsule.isCollaborative = true;
  }

  let isError = false;

  contributors.forEach((c: any) => {
    if (capsule.contributors.includes(c)) {
      isError = true;
    }
  });

  if (isError)
    return next(new ErrorHandler(400, "Some contributors already exist"));

  capsule.contributors = [
    ...new Set([...capsule.contributors, ...contributors]),
  ];

  await capsule.save();

  return res.status(200).json({ success: true, data: capsule });
});

export const addMedia = TryCatch(async (req, res, next) => {
  const { capsuleId, media } = req.body;

  if (!media || media.length === 0)
    return next(new ErrorHandler(400, "Please provide media"));

  const capsule = await TimeCapsule.findById(capsuleId);

  if (!capsule)
    return next(new ErrorHandler(404, "Capsule not found or has been deleted"));

  if (!capsule.creator.equals(req.user._id))
    return next(
      new ErrorHandler(403, "You are not allowed to perform this action")
    );

  const promises = media.map(async (m: Express.Multer.File) => {
    return uploadOnCloudinary(m.path, "image");
  });

  const mediaUrls = await Promise.all(promises);

  capsule.media = [
    ...capsule.media,
    ...mediaUrls.map((m) => {
      return {
        url: m.secure_url,
        metadata: {
          type: "",
          timestamp: "",
          tags: [],
          description: "",
          inPictures: [],
          location: { type: "", coordinates: [0, 0] },
        },
        AIGeneratedSummary: "",
      };
    }),
  ];

  await capsule.save();

  return res.status(200).json({ success: true, data: capsule });
});
