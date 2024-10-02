"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFiles = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("./logger"));
const dotenv_1 = __importDefault(require("dotenv"));
const slugify_1 = __importDefault(require("slugify"));
dotenv_1.default.config();
const uploadsDir = process.env.UPLOADS_DIR || path_1.default.join(__dirname, '..', 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path_1.default.extname(file.originalname);
        const slugifyName = (0, slugify_1.default)(`${timestamp}-${file.fieldname}-${file.originalname}`, { remove: /[*+~.()'"!:@]/g });
        cb(null, `${slugifyName}${ext}`);
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
function getFilePathFromUrl(fileUrl) {
    const url = new URL(fileUrl);
    return url.pathname;
}
const deleteFiles = async (fileUrls) => {
    logger_1.default.info("Trying to delete files", { meta: { number_of_files: fileUrls.length } });
    try {
        await Promise.all(fileUrls.map((fileUrl) => {
            const filePath = getFilePathFromUrl(fileUrl);
            const fullPath = path_1.default.join(__dirname, '..', '..', filePath);
            console.log("fullPath", fullPath);
            if (fs_1.default.existsSync(fullPath)) {
                fs_1.default.unlink(fullPath, (err) => {
                    if (err) {
                        logger_1.default.error("Error while deleting file", { meta: err });
                    }
                    else {
                        logger_1.default.info('file deleted successfully');
                    }
                });
            }
            else {
                logger_1.default.warn("File not found ", fullPath);
            }
        }));
    }
    catch (error) {
        logger_1.default.error("Error while deleting files", { meta: error });
        throw error;
    }
};
exports.deleteFiles = deleteFiles;
