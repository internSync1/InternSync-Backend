import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../common/middleware/async';
import ErrorResponse from '../common/utils/errorResponse';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const uploadFile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        return next(new ErrorResponse('Please upload a file', 400));
    }

    const publicUrl = `/uploads/${req.file.filename}`;
    const downloadUrl = `/v1/file/download/${req.file.filename}`;
    const forwardedProto = (req.headers['x-forwarded-proto'] as string) || '';
    const proto = forwardedProto.split(',')[0] || req.protocol;
    const baseUrl = `${proto}://${req.get('host')}`;

    res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        url: publicUrl,
        publicUrl,
        data: {
            url: publicUrl,
            publicUrl,
            downloadUrl,
            absoluteUrl: `${baseUrl}${publicUrl}`,
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
        },
    });
});

export const downloadFile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const filename = req.params.filename;
    const filePath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(filePath)) {
        return next(new ErrorResponse(`File not found: ${filename}`, 404));
    }

    res.download(filePath, filename, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            if (!res.headersSent) {
                return next(new ErrorResponse('Could not download the file.', 500));
            }
        }
    });
});

export const deleteFile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const filename = req.params.filename;
    const filePath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(filePath)) {
        return next(new ErrorResponse(`File not found: ${filename}`, 404));
    }

    fs.unlinkSync(filePath);

    res.status(200).json({ success: true, message: 'File deleted successfully' });
});