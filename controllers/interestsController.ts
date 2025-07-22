import { Request, Response, NextFunction } from "express";
import Interest from "../models/interestsModel";
import asyncHandler from "../common/middleware/async";

export const createInterest = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.body;
        const interest = await Interest.create({ name });
        res.status(201).json({
            success: true,
            data: interest,
        });
    }
);

export const deleteInterest = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        await Interest.findByIdAndDelete(req.params.id);
        res.status(204).json({
            success: true,
        });
    }
);

export const getInterest = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const interests = await Interest.find({ isActive: true });
        res.status(200).json({
            success: true,
            data: interests,
        });
    }
);