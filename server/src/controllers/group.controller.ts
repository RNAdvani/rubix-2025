// controllers/group.controller.ts
import { Request, Response } from "express";
import { Group } from "../models/group.model";
import User from "../models/user.model";

interface CreateGroupBody {
  name: string;
  ownerId: string;
  membersId: string[];
}

interface UpdateGroupBody {
  name?: string;
  ownerId?: string;
  membersId?: string[];
}

// Create a new group
export const createGroup = async (
  req: Request<{}, {}, CreateGroupBody>,
  res: Response
): Promise<any> => {
  try {
    const { name, ownerId, membersId } = req.body;

    const owner = await User.findById(ownerId);

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const members = await Promise.all(
      membersId.map((memberId) => User.findById(memberId))
    );

    const newGroup = await Group.create({
      name,
      owner,
      members,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res
      .status(201)
      .json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ message: "Error creating group", error: errorMessage });
  }
};

// Get all groups
export const getAllGroupsOfUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.body;
    const groups = await Group.find({
      $or: [{ members: { $in: [userId] } }, { owner: userId }],
    });
    return res.status(200).json({ groups });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ message: "Error retrieving groups", error: errorMessage });
  }
};

// Get a specific group by ID
export const getGroupById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const group = await Group.findById(id)
      .populate("owner")
      .populate("members");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.status(200).json(group);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ message: "Error retrieving group", error: errorMessage });
  }
};

// Update a group
export const updateGroup = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { groupId, userIds } = req.body;

    // Validate input
    if (!groupId || !userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Find the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const user = await User.findById(userIds[0]);

    // Verify that all user IDs exist
    const existingUsers = await User.find({ _id: { $in: userIds } });
    if (existingUsers.length !== userIds.length) {
      return res.status(400).json({ message: "One or more users not found" });
    }

    // Add new members, avoiding duplicates
    const newMembers = userIds.filter(
      (userId) =>
        !group.members.some((member: any) => member.toString() === userId)
    );

    group.members.push(...newMembers);
    await group.save();

    return res.status(200).json({
      message: "Members added successfully",
      addedMembers: newMembers,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      message: "Error adding members",
      error: errorMessage,
    });
  }
};

// Delete a group
export const deleteGroup = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const deletedGroup = await Group.findByIdAndDelete(id);
    if (!deletedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res
      .status(200)
      .json({ message: "Group deleted successfully", group: deletedGroup });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ message: "Error deleting group", error: errorMessage });
  }
};
