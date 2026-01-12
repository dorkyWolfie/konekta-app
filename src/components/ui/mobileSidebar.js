import mongoose from "mongoose";
import Image from "next/image";
import Link from "next/link";
import AppSidebar from "@/components/layout/appSidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { page } from "@/models/page";

export default async function MobileSidebar() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/");
  }

  mongoose.connect(process.env.MONGO_URI);
  const Page = await page.findOne({owner: session.user.email});
  
  function getSafeImageSrc(src) {
    if (typeof src !== "string") return "/user-astronaut-solid-full.webp";
  
    // Allow only if it's a valid URL or starts with /
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
      return src;
    }
  
    return "/user-astronaut-solid-full.webp";
  }

  return (
    <div className="mobileMenu">
      {Page && (
        <Link target="_blank" href={'/' + Page.uri} className="flex flex-col items-center gap-1">
          <Image src={getSafeImageSrc(session.user.image)} width={256} height={256} alt={"avatar"} className="w-12 h-12 object-cover rounded-full overflow-hidden" />
          <div className="flex flex-row items-center">
            <Image src="/konekta_logo_4.png" alt="dekorativna slika" width={20} height={20}  />
            <span>/{Page.uri}</span>
          </div>
        </Link>
      )}
      <AppSidebar />
    </div>
  );
}