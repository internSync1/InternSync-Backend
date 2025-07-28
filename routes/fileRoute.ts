import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadFile, downloadFile, deleteFile } from '../controllers/fileController';
import { firebaseAuth } from '../common/middleware/firebaseAuth';

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
router.post('/upload', firebaseAuth, upload.single('file'), (req, res, next) => uploadFile(req as any, res, next));
router.get('/download/:filename', firebaseAuth, (req, res, next) => downloadFile(req as any, res, next));
router.delete('/delete/:filename', firebaseAuth, (req, res, next) => deleteFile(req as any, res, next));

export default router;