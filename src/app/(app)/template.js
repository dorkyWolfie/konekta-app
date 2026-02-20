import "../globals.css";
import mongoose from "mongoose";
import Link from "next/link";
import Image from "next/image";
import AppSidebar from "@/components/layout/appSidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { page } from "@/models/page";
import { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import Trial from "@/components/trial";
import MobileSidebar from "@/components/ui/mobileSidebar";
import { headers } from "next/headers";
import { detectLangFromHeaders } from "@/lib/i18n";

export const metadata = {
  title: "Конекта",
  description: "Твојата дигитална прва импресија",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function AppTemplate({ children, ...rest }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const headersList = await headers();
  const lang = detectLangFromHeaders(headersList);

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
    <div className="overflow-x-hidden">
      <Toaster />
      <main className="flex min-h-screen accMain" style={{background: Page?.bgColorPage}}>
        <aside id="sidebar" className="bg-white !p-6 relative w-60 !justify-center !items-center min-w-49 md:flex hidden">
          <div className="fixed top-8 asideWrapper">
            {/* USER AVATAR */}
            <div className="sidebarAvatar">
              <Image src={getSafeImageSrc(session.user.image)} width={256} height={256} alt={"avatar"} className="w-full h-full object-cover" />
            </div>
            {/* USER LINK (URI) */}
            {Page && (
              <Link
                target="_blank"
                href={'/' + Page.uri}
                className="sidebarUri">
                <Image src="/konekta_logo_4.png" alt="dekorativna slika" width={30} height={30} className="-mr-1" />
                <span>/{Page.uri}</span>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-3 h-3" />
              </Link>
            )}
            {/* DIVIDER */}
            <div className="w-full h-0.5 bg-[#e5e7eb] mt-6"></div>
            {/* SIDEBAR NAVIGATION */}
            <div className="flex items-center">
              <AppSidebar lang={lang} />
            </div>
          </div>
          {/* TRIAL EXPIRATION */}
          <div className="fixed bottom-8 !mx-auto">
            {/* DIVIDER */}
            <div className="px-4"><div className="w-full h-0.5 bg-[#e5e7eb] my-6"></div></div>
            <Trial lang={lang} />
          </div>
        </aside>
        <div className="grow">
          {children}
        </div>
        <MobileSidebar lang={lang} />
      </main>
    </div>
  );
}
