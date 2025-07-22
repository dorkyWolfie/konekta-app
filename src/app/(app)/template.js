// 'use server';
import "../globals.css";
import mongoose from "mongoose";
import Link from "next/link";
import Image from "next/image";
import AppSidebar from "@/components/layout/appSidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { page } from "@/models/page";
import { openAside } from "@/components/mobMenu";
import { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faBars } from "@fortawesome/free-solid-svg-icons";

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

  mongoose.connect(process.env.MONGO_URI);
  const Page = await page.findOne({owner: session.user.email});

  function getSafeImageSrc(src) {
  if (typeof src !== "string") return "/konekta_logo_4.png";

  // Allow only if it's a valid URL or starts with /
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }

  return "/konekta_logo_4.png";
}

  return (
    <div className="overflow-x-hidden">
      <Toaster />
      <main className="flex min-h-screen">
        <aside id="sidebar" className="bg-white w-60 top-0 left-0 bottom-0 md:block justify-center hidden z-20 transition-all">
          <div className="fixed top-0 left-0 p-4 pt-8 flex flex-col items-center justify-center w-60">
            <div className="rounded-full overflow-hidden aspect-square w-24 m-auto">
              <Image src={getSafeImageSrc(session.user.image)} width={256} height={256} alt={"avatar"} className="w-full h-full object-cover" />
            </div>
            {Page && (
              <Link 
                target="_blank"
                href={'/' + Page.uri} 
                className="text-center mt-4 flex gap-1 items-center justify-center hover:text-[#3b82f6]">
                <span>konekta.mk/{Page.uri}</span>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-3 h-3" />
              </Link>
            )}
            <div className="w-full h-0.5 bg-[#e5e7eb] mt-6"></div>
            <div className="flex items-center">
              <AppSidebar />
            </div>
          </div>
        </aside>
        <div className="grow">
          <button onClick={openAside} className="md:hidden block absolute top-8 right-8 bg-[#3b82f6] text-white py-2 px-3 shadow-md">
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
          {children}
        </div>
      </main>
    </div>
  );
}
