import { Request, Response } from "express";
import prisma from "../config/database";
import {
  PASSWORD_POLICY_REGEX,
  PASSWORD_POLICY_MESSAGE,
  isValidEmail,
  hashPassword,
  sanitizeError,
  UserUpdateData,
} from "../utils/constants";

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        // Exclude password from response
      },
    });
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: sanitizeError(error),
    });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        // Exclude password from response
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: sanitizeError(error),
    });
  }
};

// Create new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password, role, is_active } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Email format validation
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Password policy validation
    if (!PASSWORD_POLICY_REGEX.test(password)) {
      return res.status(400).json({
        success: false,
        message: PASSWORD_POLICY_MESSAGE,
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
        role: role || "USER",
        is_active: is_active !== undefined ? is_active : true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        // Exclude password from response
      },
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: sanitizeError(error),
    });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, name, password, role, is_active } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If email is being updated, check if it's already taken
    if (email && email !== existingUser.email) {
      // Validate email format
      if (!isValidEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      const emailTaken = await prisma.user.findUnique({
        where: { email },
      });

      if (emailTaken) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    // Prepare update data with proper type
    const updateData: UserUpdateData = {};
    if (email) updateData.email = email;
    if (name !== undefined) updateData.name = name;
    if (role) updateData.role = role;
    if (is_active !== undefined) updateData.is_active = is_active;

    // Hash password if provided (with validation)
    if (password) {
      if (!PASSWORD_POLICY_REGEX.test(password)) {
        return res.status(400).json({
          success: false,
          message: PASSWORD_POLICY_MESSAGE,
        });
      }
      updateData.password = await hashPassword(password);
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        // Exclude password from response
      },
    });

    res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: sanitizeError(error),
    });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: sanitizeError(error),
    });
  }
};
