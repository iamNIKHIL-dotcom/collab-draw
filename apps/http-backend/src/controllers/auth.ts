import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
import { CreateUserSchema, SignInSchema } from "@repo/common/types";
import bcrypt from "bcryptjs";


export const signup = async (req:Request, res: Response) : Promise<any> => {
  try {
    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }
    const safeParsedData = data.data;
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: safeParsedData.email,
      },
    });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    await prismaClient.user.create({
      data: {
        email: safeParsedData.email,
        name: safeParsedData.name,
        password: bcrypt.hashSync(safeParsedData.password, 10),
      },
    });
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
}

export const signin = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = SignInSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ message: "Email or password is invalid" });
      return;
    }
    const safeParsedData = data.data;
    const user = await prismaClient.user.findUnique({
      where: {
        email: safeParsedData.email,
      },
    });
    if (!user) {
      res.status(400).json({ message: "Email or password is invalid" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      safeParsedData.password,
      user.password
    );
    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Email or password is invalid" });
      return;
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.status(201).json({ message: "User signed in successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }    
}