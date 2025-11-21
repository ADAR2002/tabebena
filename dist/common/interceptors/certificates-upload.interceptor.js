"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificatesUploadInterceptor = CertificatesUploadInterceptor;
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const fs_1 = require("fs");
const path_1 = require("path");
function CertificatesUploadInterceptor() {
    return (0, platform_express_1.FileFieldsInterceptor)([
        { name: 'certificates', maxCount: 10 },
        { name: 'clinicImages', maxCount: 10 },
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const uploadRoot = (0, path_1.join)(process.cwd(), 'uploads');
                let subDir = 'certificates';
                if (file.fieldname === 'clinicImages') {
                    subDir = 'clinic-images';
                }
                const targetDir = (0, path_1.join)(uploadRoot, subDir);
                if (!(0, fs_1.existsSync)(uploadRoot))
                    (0, fs_1.mkdirSync)(uploadRoot, { recursive: true });
                if (!(0, fs_1.existsSync)(targetDir))
                    (0, fs_1.mkdirSync)(targetDir, { recursive: true });
                cb(null, targetDir);
            },
            filename: (req, file, cb) => {
                const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                const ext = (0, path_1.extname)(file.originalname).toLowerCase();
                let prefix = 'cert';
                if (file.fieldname === 'clinicImages') {
                    prefix = 'clinic';
                }
                cb(null, `${prefix}-${unique}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/i)) {
                return cb(new Error('Only jpg, jpeg, png, pdf are allowed'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
            files: 10
        },
    });
}
//# sourceMappingURL=certificates-upload.interceptor.js.map