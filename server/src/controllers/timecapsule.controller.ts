import { ErrorHandler } from "../lib/ErrorHandler";
import { TryCatch } from "../lib/TryCatch";
import { Media } from "../models/media.model";
import { TimeCapsule } from "../models/timecapsule.model";
import User from "../models/user.model";
import { uploadOnCloudinary } from "../services/cloudinary";
import { sendCapsuleEmail, sendCollaboratorEmail } from "../services/email";
import { postToInstagram } from "../services/instagram";
import { generateAccessCode } from "../utils";
import schedule from "node-schedule";

export const createCapsule = TryCatch(async (req, res, next) => {
  const { title, description, contributors } = req.body;

  const media = req.files as Express.Multer.File[];
  console.log(media);

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
        type: m?.resource_type,
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

  return res.status(201).json({
    success: true,
    data: capsule,
    message: "Capsule created successfully",
  });
});

export const getCreatedCapsules = TryCatch(async (req, res, next) => {
  const capsules = await TimeCapsule.find({
    creator: req.user._id,
  })
    .populate("media recipients contributors")
    .select(
      "+_id media recipients contributors title description unlockDate accessCode"
    );

  return res.status(200).json({ success: true, data: capsules });
});

export const getReceivedCapsules = TryCatch(async (req, res, next) => {
  const capsules = await TimeCapsule.find({
    $or: [
      { recipients: req.user._id }, // Filter where user is a recipient
      { contributors: req.user._id }, // Filter where user is a collaborator
    ],
  })
    .populate("media recipients contributors")
    .select("+_id media recipients contributors title description unlockDate");

  return res.status(200).json({ success: true, data: capsules });
});

export const getCapsule = TryCatch(async (req, res, next) => {
  const capsule = await TimeCapsule.findById(req.params.id).populate(
    "media recipients contributors accessCode unlockDate"
  );

  const { accessCode } = req.query;

  if (!capsule)
    return next(new ErrorHandler(404, "Capsule not found or has been deleted"));

  const isRecipient = capsule.recipients.some(
    (recipient: any) => recipient.toString() === req.user.toString()
  );

  if (!capsule.creator.equals(req.user._id) && !isRecipient) {
    return next(
      new ErrorHandler(403, "You are not allowed to view this capsule")
    );
  }

  if (Date.now() > new Date(capsule.unlockDate).getTime()) {
    return res.status(200).json({ success: true, data: capsule });
  }

  if (accessCode) {
    if (capsule.accessCode !== accessCode) {
      return next(new ErrorHandler(403, "Invalid access code"));
    }
    return res.status(200).json({ success: true, data: capsule });
  }

  if (
    !capsule.isPermanentLock &&
    Date.now() < new Date(capsule.unlockDate).getTime()
  ) {
    return res.status(200).json({ isPasswordRequired: true });
  }

  if (
    Date.now() < new Date(capsule.unlockDate).getTime() ||
    capsule.isPermanentLock
  ) {
    return res.status(200).json({ redirect: true });
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

  contributors.forEach(async (c: any) => {
    if (capsule.contributors.includes(c)) {
      isError = true;
    }

    const contributorUser = await User.findById(c);

    await sendCollaboratorEmail({
      creatorEmail: req.user.email,
      creatorName: req.user.name,
      description: capsule.description,
      email: contributorUser.email,
      message: "You have been invited to collaborate on a Time Capsule.",
      title: capsule.title,
      accessLink: `http://localhost:5173/capsule/${capsule._id}`,
    });
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
  const { capsuleId } = req.body;
  const media = req.files as Express.Multer.File[];

  if (!media || media.length === 0)
    return next(new ErrorHandler(400, "Please provide media"));

  const capsule = await TimeCapsule.findById(capsuleId);

  if (!capsule)
    return next(new ErrorHandler(404, "Capsule not found or has been deleted"));

  if (!capsule.creator.equals(req.user._id))
    return next(
      new ErrorHandler(403, "You are not allowed to perform this action")
    );

  const mediaUrls = await Promise.all(
    media.map(async (file) => {
      return uploadOnCloudinary(file.path, "image");
    })
  );

  const mediaPromises = mediaUrls.map(async (m) => {
    return Media.create({
      url: m?.secure_url,
      metadata: {
        type: m?.resource_type,
        timestamp: Date.now(),
        tags: [],
        description: "",
        inPictures: [],
        location: { type: "", coordinates: [0, 0] },
      },
      AIGeneratedSummary: "",
    });
  });

  const mediaDocs = await Promise.all(mediaPromises);

  capsule.media.push(...mediaDocs.map((m) => m._id));

  await capsule.save();

  return res.status(200).json({ success: true, data: capsule });
});

export const updateCapsule = TryCatch(async (req, res, next) => {
  const { capsuleId, title, description, isCollaboratorLock } = req.body;

  const capsule = await TimeCapsule.findById(capsuleId);

  if (!capsule)
    return next(new ErrorHandler(404, "Capsule not found or has been deleted"));

  if (!capsule.creator.equals(req.user._id))
    return next(
      new ErrorHandler(403, "You are not allowed to perform this action")
    );

  capsule.title = title || capsule.title;

  capsule.description = description || capsule.description;

  capsule.isCollaboratorLock = isCollaboratorLock || capsule.isCollaboratorLock;

  await capsule.save();

  return res.status(200).json({ success: true, data: capsule });
});

export const lockCapsule = TryCatch(async (req, res, next) => {
  const { capsuleId, isPermanentLock = false, unlockDate } = req.body;

  const capsule = await TimeCapsule.findById(capsuleId).populate("recipients");

  if (!capsule) {
    return next(new ErrorHandler(404, "Capsule not found"));
  }

  if (!capsule.creator.equals(req.user._id)) {
    return next(
      new ErrorHandler(403, "You are not authorized to lock this capsule")
    );
  }

  capsule.unlockDate = unlockDate;

  if (isPermanentLock) {
    capsule.isPermanentLock = true;
    capsule.accessCode = undefined; // Clear access code for permanent lock

    // Notify all recipients about the permanent lock
    const notifyRecipient = async (email: string) => {
      await sendCapsuleEmail({
        email,
        creatorName: req.user.name,
        creatorEmail: req.user.email,
        title: capsule.title,
        description: capsule.description,
        unlockDate: capsule.unlockDate,
        message: "The capsule has been permanently locked.",
      });
    };

    for (const recipient of capsule.recipients) {
      await notifyRecipient(recipient.email);
    }

    for (const anon of capsule.anonymousRecipients) {
      await notifyRecipient(anon.email);
    }
  } else {
    const accessCode = generateAccessCode();
    capsule.accessCode = accessCode;

    // Notify all recipients with the access code
    const notifyRecipient = async (email: string, code: string) => {
      await sendCapsuleEmail({
        email,
        creatorName: req.user.name,
        creatorEmail: req.user.email,
        title: capsule.title,
        description: capsule.description,
        unlockDate: capsule.unlockDate,
        accessLink: `http://localhost:5173/capsule/${capsule._id}`,
        accessCode: code,
        message: "You can access the capsule using the link and code provided.",
      });
    };

    for (const recipient of capsule.recipients) {
      await notifyRecipient(recipient.email, accessCode);
    }

    for (const anon of capsule.anonymousRecipients) {
      await notifyRecipient(anon.email, accessCode);
    }
  }

  await capsule.save();

  return res.status(200).json({
    success: true,
    message: isPermanentLock
      ? "Capsule permanently locked and notifications sent."
      : "Capsule locked with an access code and notifications sent.",
  });
});

export const postOnInstagram = TryCatch(async (req, res, next) => {
  const { capsuleId } = req.body;

  const capsule = await TimeCapsule.findById(capsuleId).populate("media");

  if (!capsule)
    return next(new ErrorHandler(404, "Capsule not found or has been deleted"));

  // if (!capsule.creator.equals(req.user._id))
  //   return next(
  //     new ErrorHandler(403, "You are not allowed to perform this action")
  //   );

  const unlockDate = new Date(capsule.unlockDate);

  // Check if unlockDate is valid
  if (isNaN(unlockDate.getTime())) {
    return next(new ErrorHandler(400, "Unlock date must be a valid date"));
  }

  if (unlockDate.getTime() <= Date.now()) {
    // If the unlockDate is in the past, post immediately
    try {
      await postToInstagram(capsule);
      capsule.isInstagramUpload = true;
      await capsule.save();
      return res.status(200).json({
        success: true,
        message: "Posted successfully on Instagram (immediate post)",
      });
    } catch (err) {
      return next(new ErrorHandler(500, "Failed to post to Instagram"));
    }
  }

  // If unlockDate is in the future, schedule the post
  schedule.scheduleJob(unlockDate, async () => {
    try {
      await postToInstagram(capsule);
      capsule.isInstagramUpload = true;
      await capsule.save();
      console.log(`Capsule ${capsuleId} successfully posted to Instagram`);
    } catch (err) {
      console.error(`Failed to post capsule ${capsuleId}:`, err);
    }
  });

  return res.status(200).json({
    success: true,
    message: `Capsule scheduled for Instagram posting on ${unlockDate}`,
  });
});
