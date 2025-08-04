/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: '*.googleusercontent.com'
      },
      {
        hostname: `${process.env.BUCKET_NAME}.s3.amazonaws.com`
      }
    ],
  }
};

export default nextConfig;
