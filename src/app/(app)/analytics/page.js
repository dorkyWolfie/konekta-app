import SectionBox from "@/components/layout/sectionBox";
import Chart from "@/components/chart";
import mongoose from "mongoose";
import Link from "next/link";
import Image from "next/image";
import { event } from "@/models/event";
import { page } from "@/models/page";
import { user } from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faGlobe, faUser, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { isToday } from "date-fns";
import { getButtonType, icons } from "@/app/(page)/[uri]/page";

export default async function AnalyticsPage() {
  mongoose.connect(process.env.MONGO_URI);
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/');
  }

  const User = await user.findOne({ email: session.user.email }).lean();
  const Page = await page.findOne({ owner: session?.user?.email });
  
  const groupedViews = await event.aggregate([
    {
      $match: {
        type: "view",
        uri: Page.uri,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            date: "$createdAt",
            format: "%Y-%m-%d",
          },
        },
        count: { "$count": {} },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    }
  ]);

  const clicks = await event.find({
    page: Page.uri,
    type: 'click',
  });

  const buttonClicks = clicks.filter(c => Page.buttons?.some(b => b.value === c.uri));
  const linkClicks = clicks.filter(c => Page.links?.some(l => l.url === c.uri));
  const fileClicks = clicks.filter(c => Page.files?.some(f => f.url === c.uri));

  if (!User || User.subscriptionStatus !== 'pro') {
    return (
      <SectionBox>
        <h2>Аналитика не е достапна</h2>
        <p>Овој профил не е активиран. Доколку сакате да го активирате или мислите дека е грешка ве молиме <Link href="/kontakt" className="text-[#2563eb] hover:[#1d4ed8] hover:underline">кликнете тука</Link></p>
      </SectionBox>
    )
  }

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="shrink">
      <SectionBox>
        <h2 className="text-xl mb-6 font-bold text-center">Прегледи</h2>
        <Chart data={groupedViews.map(o => ({
          'date': o._id, 
          'views': o.count
        }))} />
      </SectionBox>
      <SectionBox>
        <h2 className="text-xl mb-6 font-bold text-center">Кликови од Копчиња</h2>
        {Page.buttons.map(button => {
          const today = buttonClicks.filter(c => c.uri === button.value && isToday(c.createdAt)).length;
          const total = buttonClicks.filter(c => c.uri === button.value).length;
          return (
            <div key={button.key} className="flex gap-6 items-center justify-center border-t border-[#e5e7eb] py-4">
              <div className="text-[#3b82f6] pl-4">
                {button.icon ? (
                  <Image 
                    src={button.icon} alt={button.title || button.type} 
                    width={24} height={24} className="w-6 h-6 object-contain" 
                  />
                ) : (
                  <FontAwesomeIcon 
                    icon={icons[getButtonType(button.type)] || (button.isCustom ? faUser : faGlobe)} className="w-6 h-6" 
                  />
                )}
              </div>
              <div className="grow">
                <h3>{button.title || 'Нема наслов'}</h3>
                <Link target="_blank" href={button.value} className="text-[#1d4ed8] text-xs">{button.value}</Link>
              </div>
              <div className="text-center flex items-center justify-center gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-xl">{today}</span>
                  <span className="text-[#9ca3af] text-xs uppercase font-bold">Денес:</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xl">{total}</span>
                  <span className="text-[#9ca3af] text-xs uppercase font-bold">Вкупно:</span>
                </div>
              </div>
            </div>
          );
        })}
      </SectionBox>
      <SectionBox>
        <h2 className="text-xl mb-6 font-bold text-center">Кликови од Линкови</h2>
        {Page.links.map(link => {
          const today = linkClicks.filter(c => c.uri === link.url && isToday(c.createdAt)).length;
          const total = linkClicks.filter(c => c.uri === link.url).length;
          return (
            <div key={link.title} className="flex gap-6 items-center justify-center border-t border-[#e5e7eb] py-4">
              <div className="text-[#3b82f6] pl-4">
                {link.icon ? (
                  <Image 
                    src={link.icon} alt={link.title} 
                    width={24} height={24} className="w-6 h-6 object-contain" 
                  />
                  ) : ( <FontAwesomeIcon icon={faLink} className="w-6 h-6" />
                )}
              </div>
              <div className="grow">
                <h3>{link.title || 'Нема наслов'}</h3>
                <Link target="_blank" href={link.url} className="text-[#1d4ed8] text-xs">{link.url}</Link>
              </div>
              <div className="text-center flex items-center justify-center gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-xl">{today}</span>
                  <span className="text-[#9ca3af] text-xs uppercase font-bold">Денес:</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xl">{total}</span>
                  <span className="text-[#9ca3af] text-xs uppercase font-bold">Вкупно:</span>
                </div>
              </div>
            </div>
          );
        })}
      </SectionBox>
      <SectionBox>
        <h2 className="text-xl mb-6 font-bold text-center">Кликови од Датотеки</h2>
        {Page.files.map(file => {
          const today = fileClicks.filter(c => c.uri === file.url && isToday(c.createdAt)).length;
          const total = fileClicks.filter(c => c.uri === file.url).length;
          return (
            <div key={file.key || file.title} className="flex gap-6 items-center justify-center border-t border-[#e5e7eb] py-4">
              <div className="text-[#3b82f6] pl-4">
                {file.url && file.type === 'application/pdf' && (
                  <FontAwesomeIcon icon={faFilePdf} width={24} height={24} />
                ) || (
                  <Image src={file.url} alt={file.title || 'uploaded file'} className="w-full h-full object-cover object-center -mr-1 aspect-square" width={24} height={24} />
                )}
              </div>
              <div className="grow">
                <h3>{file.title || 'Нема наслов'}</h3>
                <Link target="_blank" href={file.url} title={file.url} className="text-[#1d4ed8] text-xs w-3">
                  <span className="block sm:hidden">{truncateText(file.url, 30)}</span>
                  <span className="hidden sm:block">{file.url}</span>
                </Link>
              </div>
              <div className="text-center flex items-center justify-center gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-xl">{today}</span>
                  <span className="text-[#9ca3af] text-xs uppercase font-bold">Денес:</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xl">{total}</span>
                  <span className="text-[#9ca3af] text-xs uppercase font-bold">Вкупно:</span>
                </div>
              </div>
            </div>
          );
        })}
      </SectionBox>
    </div>
  )
}