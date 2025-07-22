import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadFile, downloadFile, deleteFile } from '../controllers/fileController';
import { protect } from '../common/middleware/auth'; // Assuming you want to protect these routes

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, file.originalname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Images and PDFs Only!'));
    }
}


// Routes
router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/download/:filename', protect, downloadFile);
router.delete('/delete/:filename', protect, deleteFile);

export default router;