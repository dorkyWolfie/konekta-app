import Image from "next/image";
import ContactForm from "@/components/contactForm";
import PriceSlider from "@/components/priceSlider";
import ReviewCarousel from "@/components/reviewCarousel";

export default function Home() {
  return (
    <main>
      <section className="pt-20 section flex flex-row justify-between items-center gap-10">
        <div className="w-1/2">
          <h1>Твојата дигитална прва импресија</h1>
          <p className="text-base font-[600] pt-6 pb-2">Паметна NFC визит картичка која со еден допир ги споделува сите твои контакти, линкови и профили.</p>
          <p className="text-sm font-[800] ">Совршена за фриленсери, претприемачи и модерни бизниси.</p>
          <div className="flex justify-between gap-20 py-6">
            <button className="button-1">Нарачај сега!</button>
            <button className="button-2"><Link href="/#how-it-works">Види како функционира</Link></button>
          </div>
        </div>
        <Image src="/hero-img.png" alt="picture" width={500} height={500} />
      </section>
      <section className="section flex flex-col gap-6 items-center py-20">
        <h2>Зошто паметна визит картичка?</h2>
        <div className="flex flex-row items-center justify-between gap-5">
          <div className="w-3/5 flex flex-col gap-6">
            <p>Конекта не е само картичка – тоа е твојот прв впечаток. Со интегрирана NFC   технологија и уникатен QR код, таа овозможува споделување на твоите контакти, линкови,  профили и многу повеќе – <strong>со само еден допир.</strong></p>
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-[800] tracking-wide">Зошто ќе ја засакаш?</h3>
              <div>
                <h4>🔁 Една картичка засекогаш</h4>
                <p>Заборави на класичните хартиени визитки.</p>
                <p>Со Конекта имаш само една – која трае и лесно се ажурира.</p>
              </div>
              <div>
                <h4>🔒 100% Безбедна. Засекогаш</h4>
                <p>Твоите податоци се засекогаш безбедни. </p>
                <p className="font-[700]">Приватноста е секогаш на прво место.</p>
              </div>
              <div>
                <h4>⚡ Ефикасна и импресивна</h4>
                <p>Со еден допир ги споделуваш сите твои информации.</p>
                <p className="font-[700]">Брзо, паметно и модерно!</p>
              </div>
            </div>
          </div>
          <Image src="/hero-img.png" alt="picture" width={400} height={400} />
        </div>
      </section>
      <section className="section flex flex-col items-center gap-20">
        <div className="text-center">
          <h2>Лесна и едноставна!</h2>
        </div>
        <div className="flex flex-row gap-10">
          <div className="box-border items-center p-4 gap-4">
            <h3 className="py-2 px-4 corner-border text-xl font-bold">1</h3>
            <p>Нарачај ја твојата конекта картичка.</p>
          </div>
          <div className="box-border items-center p-4 gap-4">
            <h3 className="py-2 px-4 corner-border text-xl font-bold">2</h3>
            <p>Внеси ги твоите информации во профилот и персонализирај го.</p>
          </div>
          <div className="box-border items-center p-4 gap-4">
            <h3 className="py-2 px-4 corner-border text-xl font-bold">3</h3>
            <p>Почни да го споделуваш твојот дигитален профил.</p>
          </div>
        </div>
        <div className="flex flex-row gap-15 font-[700] text-xs text-[#4b5563] opacity-80">
          <p>✅ подржано од повеќето Android и iPhone уреди</p>
          <p>✅ без дополнителни апликации</p>
          <p>✅ вграден уникатен QR код</p>
        </div>
      </section>
      <section className="py-20 section section-col">
        <div className="text-center">
          <h2 className="pb-2">Не си сигурен/а дали конекта е за тебе?</h2>
          <h3 className="pb-2">Конекта е за секој што сака да остави впечаток – <strong>со стил.</strong></h3>
        </div>
        <div>
          <p className="pb-6 w-180 m-auto text-sm">Конекта е создадена за луѓе кои градат бренд, доверба, конекции што траат и вредат, и сакаат да се поврзат побрзо и попаметно. Без разлика дали си индивидуалец или дел од поголем тим, оваа картичка го поедноставува секое запознавање.</p>
          <div className="flex flex-row gap-10 flex-wrap justify-center">
            <div className="box-border flex-col w-100 items-left p-4 gap-2">
              <h4>👤 Фриленсери</h4>
              <p>Графички дизајнери, веб девелопери, маркетинг стручњаци – презентирај сè што нудиш со еден допир.</p>
            </div>
            <div className="box-border flex-col w-100 items-left p-4 gap-2">
              <h4>🎨 Креативци и уметници</h4>
              <p>Портфолио, Instagram, YouTube, Spotify – твојата работа заслужува лесно да се најде.</p>
            </div>
            <div className="box-border flex-col w-100 items-left p-4 gap-2">
              <h4>📣 Инфлуенсери и контент креатори</h4>
              <p>Сподели ги сите твои платформи на едно место – направи го вмрежувањето вистинско искуство.</p>
            </div>
            <div className="box-border flex-col w-100 items-left p-4 gap-2">
              <h4>🏢 Бизниси од сите големини</h4>
              <p>Од мали стартапи до големи компании – изгледајте професионално на состаноци, конференции и настани.</p>
            </div>
            <div className="box-border flex-col w-100 items-left p-4 gap-2">
              <h4>🚀 Претприемачи и основачи</h4>
              <p>Кога градиш нешто свое, секој контакт е важен. Конекта ти помага да го направиш вистинскиот прв чекор.</p>
            </div>
            <div className="box-border flex-col w-100 items-left p-4 gap-2">
              <h4>🎓 Студенти и млади професионалци</h4>
              <p>Подготвен/а си за кариера? Започни со визитка која покажува дека размислуваш напред.</p>
            </div>
          </div>
        </div>
      </section>
      <section id="proizvodi" className="section flex flex-col items-center gap-10">
        <h2>Изрази се со стил</h2>
        <div className="flex flex-row gap-10 flex-wrap">
          <Image src="/hero-img.png" alt="picture" width={150} height={150} className="border border-[#d1d5db] p-4" />
          <Image src="/hero-img.png" alt="picture" width={150} height={150} className="border border-[#d1d5db] p-4" />
          <Image src="/hero-img.png" alt="picture" width={150} height={150} className="border border-[#d1d5db] p-4" />
          <Image src="/hero-img.png" alt="picture" width={150} height={150} className="border border-[#d1d5db] p-4" />
        </div>
        <p className="font-[700] text-xs text-[#4b5563] opacity-80">Сите картички доаѓаат со NFC чип, уникатен QR код и пристап до твојот Конекта профил.</p>
      </section>
      <section id="cenovnik" className="py-20 section flex flex-col items-center gap-10">
        <h2>Избери план што одговара на твојот стил</h2>
        <PriceSlider />
        <div className="text-center">
          <h3 className="text-sm font-bold text-[#2563eb] pb-4">Потребно ти е нешто поинакво?</h3>
          <button className="button-1">КОНТАКТИРАЈ НЕ ЗА ПЕРСОНАЛИЗИРАНА ПОНУДА!</button>
        </div>
      </section>
      <section id="recenzii" className="flex flex-col gap-4 items-center relative py-6 ">
        {/* <svg className="absolute -top-45 left-0 -z-1 rotate-180 scale-x-[-1]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#2563eb" fillOpacity="1" d="M0,192L80,197.3C160,203,320,213,480,208C640,203,800,181,960,170.7C1120,160,1280,160,1360,160L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg> */}
        <h2>Што кажуваат нашите верни корисници?</h2>
        <ReviewCarousel />
        {/* <svg className="absolute top-12 left-0 -z-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#2563eb" fillOpacity="1" d="M0,192L80,197.3C160,203,320,213,480,208C640,203,800,181,960,170.7C1120,160,1280,160,1360,160L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg> */}
      </section>
      <section id="kontakt" className="py-20 section flex flex-col items-center gap-10">
        <h2 className="pb-6">Контактирај не за било какви прашања или забелешки</h2>
        <ContactForm />
      </section>
    </main>
  );
}
