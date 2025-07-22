import { Request, Response, NextFunction } from "express";
import Question from "../models/questionModel";
import asyncHandler from "../common/middleware/async";

export const createQuestion = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { text } = req.body;
        const question = await Question.create({ text });
        res.status(201).json({
            success: true,
            data: question,
        });
    }
);

export const deleteQuestion = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        await Question.findByIdAndDelete(req.params.id);
        res.status(204).json({
            success: true,
        });
    }
);

export const getQuestions = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const questions = await Question.find({ isActive: true });
        res.status(200).json({
            success: true,
            data: questions,
        });
    }
);