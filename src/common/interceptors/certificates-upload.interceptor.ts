import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';

// Factory that returns a configured interceptor for uploading doctor certificates and clinic images
export function CertificatesUploadInterceptor() {
  return FileFieldsInterceptor(
    [
      { name: 'certificates', maxCount: 10 },
      { name: 'clinicImages', maxCount: 10 },
    ],
    {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadRoot = join(process.cwd(), 'uploads');
          let subDir = 'certificates';
          
          // Set directory based on field name
          if (file.fieldname === 'clinicImages') {
            subDir = 'clinic-images';
          }
          
          const targetDir = join(uploadRoot, subDir);
          if (!existsSync(uploadRoot)) mkdirSync(uploadRoot, { recursive: true });
          if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
          cb(null, targetDir);
        },
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname).toLowerCase();
          let prefix = 'cert';
          
          if (file.fieldname === 'clinicImages') {
            prefix = 'clinic';
          }
          
          cb(null, `${prefix}-${unique}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Allow only image files and PDFs
        if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/i)) {
          return cb(new Error('Only jpg, jpeg, png, pdf are allowed'), false);
        }
        cb(null, true);
      },
      limits: { 
        fileSize: 5 * 1024 * 1024, // 5MB per file
        files: 10 // Max 10 files per field
      },
    },
  );
}
