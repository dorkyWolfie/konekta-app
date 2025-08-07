// For App Router: app/api/delete-file/route.js
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

export async function DELETE(request) {
  try {
    const { fileUrl } = await request.json();

    if (!fileUrl) {
      return NextResponse.json(
        { error: 'File URL is required' },
        { status: 400 }
      );
    }

    const url = new URL(fileUrl);
    let key;
    
    if (url.hostname.includes('s3')) {
      // Handle both formats of S3 URLs
      if (url.hostname.startsWith('s3.')) {
        // Format: https://s3.region.amazonaws.com/bucket/key
        key = url.pathname.substring(url.pathname.indexOf('/', 1) + 1);
      } else {
        // Format: https://bucket.s3.region.amazonaws.com/key
        key = url.pathname.substring(1); // Remove leading slash
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid S3 URL format' },
        { status: 400 }
      );
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(deleteCommand);

    return NextResponse.json(
      { message: 'File deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting file from S3:', error);
    return NextResponse.json(
      { error: 'Failed to delete file from S3' },
      { status: 500 }
    );
  }
}