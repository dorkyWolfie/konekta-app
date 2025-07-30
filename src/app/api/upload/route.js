// image storage
import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import uniqid from 'uniqid';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

export async function POST(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();

    if (!formData.has('file')) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const file = formData.get('file');

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: 'File too large' }, { status: 400 });
    }

    const s3Client = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });

    const randomId = uniqid();
    const ext = file.name.split('.').pop();

    // Validate extension matches MIME type
    const typeExtMap = {
      'image/jpeg': ['jpg', 'jpeg'],
      'image/png': ['png'],
      'image/webp': ['webp'],
      'image/gif': ['gif'],
      'application/pdf': ['pdf'],
    };

    if (!typeExtMap[file.type]?.includes(ext.toLowerCase())) {
      return Response.json({ error: 'File extension mismatch' }, { status: 400 });
    }


    const newFilename = `${session.user.email}-${randomId}.${ext}`;
    const bucketName = process.env.BUCKET_NAME;

    const chunks = [];
    for await (const chunk of file.stream()) {
      chunks.push(chunk);
    }

    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: newFilename,
      ACL: 'public-read',
      Body: Buffer.concat(chunks),
      ContentType: file.type,
      CacheControl: 'public, max-age=31536000',
      ContentDisposition: 'inline',
    }))

    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
    return Response.json(link);
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}