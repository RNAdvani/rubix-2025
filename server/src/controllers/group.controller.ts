// controllers/group.controller.ts
import { Request, Response } from "express";
import { Group } from "../models/group.model";

interface CreateGroupBody {
  name: string;
  owner: string;
  members: string[];
}

interface UpdateGroupBody {
  name?: string;
  owner?: string;
  members?: string[];
}

// Create a new group
export const createGroup = async (
  req: Request<{}, {}, CreateGroupBody>,
  res: Response
): Promise<any> => {
  try {
    const { name, owner, members } = req.body;

    const newGroup = new Group({ name, owner, members });
    await newGroup.save();

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
export const getAllGroups = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const groups = await Group.find().populate("owner").populate("members");
    return res.status(200).json(groups);
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
  req: Request<{ id: string }, {}, UpdateGroupBody>,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedGroup = await Group.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("owner")
      .populate("members");

    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res
      .status(200)
      .json({ message: "Group updated successfully", group: updatedGroup });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ message: "Error updating group", error: errorMessage });
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
