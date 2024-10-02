import multer from 'multer'
import path from 'path'
import fs from 'fs'
import logger from './logger';
import dotenv from 'dotenv';

import slugify from 'slugify'
dotenv.config();

const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const slugifyName = slugify(`${timestamp}-${file.fieldname}-${file.originalname}`, { remove: /[*+~.()'"!:@]/g })
        cb(null, `${slugifyName}${ext}`);
    },
});

export const upload = multer({ storage: storage });


function getFilePathFromUrl(fileUrl: string) {
    const url = new URL(fileUrl)
    return url.pathname
}


export const deleteFiles = async (fileUrls: string[]) => {
    logger.info("Trying to delete files", { meta: { number_of_files: fileUrls.length } });

    try {
        await Promise.all(
            fileUrls.map((fileUrl) => {
                const filePath = getFilePathFromUrl(fileUrl)
                const fullPath = path.join(__dirname, '..', '..', filePath);
                console.log("fullPath", fullPath);

                if (fs.existsSync(fullPath)) {
                    fs.unlink(fullPath, (err) => {
                        if (err) {
                            logger.error("Error while deleting file", { meta: err });
                        } else {
                            logger.info('file deleted successfully');

                        }
                    })
                } else {
                    logger.warn("File not found ", fullPath);
                }
            })
        )
    } catch (error) {
        logger.error("Error while deleting files", { meta: error });
        throw error;
    }
}

