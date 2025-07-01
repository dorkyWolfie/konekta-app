import Image from "next/image";
import ContactForm from "@/components/contactForm";
import PriceSlider from "@/components/priceSlider";
import ReviewCarousel from "@/components/reviewCarousel";
import Wave from "@/components/wave";

export default function Home() {
  return (
    <main>
      <section className="pt-15 section flex flex-row justify-between items-center gap-10">
        <div className="w-1/2">
          <h1>Твојата дигитална прва импресија</h1>
          <p className="text-base font-[600] pt-6 pb-2">Паметна NFC визит картичка која со еден допир ги споделува сите твои контакти, линкови и профили.</p>
          <p className="text-sm font-[800] ">Совршена за фриленсери, претприемачи и модерни бизниси.</p>
          <div className="flex justify-between gap-20 py-6">
            <button className="button-1">Нарачај сега!</button>
            <button className="button-2">Види како функционира</button>
          </div>
        </div>
        <Image src="/hero-img.png" alt="picture" width={500} height={500} />
      </section>
      <section className="sgap section section-col">
        <h2>Зошто паметна визит картичка?</h2>
      <div className="div-img">
        <div className="div-text">
          <p>Конекта не е само картичка – тоа е твојот прв впечаток. Со интегрирана NFC технологија и уникатен QR код, таа овозможува споделување на твоите контакти, линкови, профили и многу повеќе – <strong>со само еден допир.</strong></p>
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
          <h2>Толку е лесна и едноставна!</h2>
          <p>Што ќе се прашаш како досега си живеел без неа!</p>
        </div>
        <div className="flex flex-row gap-10">
          <div className="flex items-center border border-gray-300/60 p-4 gap-4">
            <h3 className="py-2 px-4 corner-border text-xl font-bold">1</h3>
            <p>Нарачај ја твојата конекта картичка.</p>
          </div>
          <div className="flex items-center border border-gray-300/60 p-4 gap-4">
            <h3 className="py-2 px-4 corner-border text-xl font-bold">2</h3>
            <p>Внеси ги твоите информации во профилот и персонализирај го.</p>
          </div>
          <div className="flex items-center border border-gray-300/60 p-4 gap-4">
            <h3 className="py-2 px-4 corner-border text-xl font-bold">3</h3>
            <p>Почни да го споделуваш твојот дигитален профил.</p>
          </div>
        </div>
        <div className="flex flex-row gap-15 font-[600] text-xs text-gray-600/80">
          <p>✅ подржано од повеќето Android и iPhone уреди</p>
          <p>✅ без дополнителни апликации</p>
          <p>✅ вграден уникатен QR код</p>
        </div>
      </section>
      <section className="sgap section section-col">
        <div className="text-center">
          <h2 className="pb-2">Не си сигурен/а дали конекта е за тебе?</h2>
          <h3>Конекта е за секој што сака да остави впечаток – <strong>со стил.</strong></h3>
        </div>
        <div>
          <p className="pb-6 w-180 m-auto">Конекта е создадена за луѓе кои градат бренд, доверба, конекции што траат и вредат, и сакаат да се поврзат побрзо и попаметно. Без разлика дали си индивидуалец или дел од поголем тим, оваа картичка го поедноставува секое запознавање.</p>
          <div className="flex flex-row gap-10 flex-wrap justify-center">
            <div className="box-border">
              <h4>👤 Фриленсери</h4>
              <p>Графички дизајнери, веб девелопери, маркетинг стручњаци – презентирај сè што нудиш со еден допир.</p>
            </div>
            <div className="box-border">
              <h4>🎨 Креативци и уметници</h4>
              <p>Портфолио, Instagram, YouTube, Spotify – твојата работа заслужува лесно да се најде.</p>
            </div>
            <div className="box-border">
              <h4>📣 Инфлуенсери и контент креатори</h4>
              <p>Сподели ги сите твои платформи на едно место – направи го вмрежувањето вистинско искуство.</p>
            </div>
            <div className="box-border">
              <h4>🏢 Бизниси од сите големини</h4>
              <p>Од мали стартапи до големи компании – изгледајте професионално на состаноци, конференции и настани.</p>
            </div>
            <div className="box-border">
              <h4>🚀 Претприемачи и основачи</h4>
              <p>Кога градиш нешто свое, секој контакт е важен. Конекта ти помага да го направиш вистинскиот прв чекор.</p>
            </div>
            <div className="box-border">
              <h4>🎓 Студенти и млади професионалци</h4>
              <p>Подготвен/а си за кариера? Започни со визитка која покажува дека размислуваш напред.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section section-col">
        <h2>Изрази се со стил</h2>
        <div className="flex flex-row gap-10 flex-wrap">
          <img src="../../hero-img.png" alt="" className="w-50 border border-gray-300/60 p-4" />
          <img src="../../hero-img.png" alt="" className="w-50 border border-gray-300/60 p-4" />
          <img src="../../hero-img.png" alt="" className="w-50 border border-gray-300/60 p-4" />
          <img src="../../hero-img.png" alt="" className="w-50 border border-gray-300/60 p-4" />
        </div>
        <p className="font-[600] text-xs text-gray-600/80">Сите картички доаѓаат со NFC чип, уникатен QR код и пристап до твојот Конекта профил.</p>
      </section>
      <section className="sgap section section-col">
        <h2>Избери план што одговара на твојот стил</h2>
        <PriceSlider />
        <div className="text-center">
          <h3 className="text-sm font-bold text-blue-600 pb-4">Потребно ти е нешто поинакво?</h3>
          <button className="button-1">КОНТАКТИРАЈ НЕ ЗА ПЕРСОНАЛИЗИРАНА ПОНУДА!</button>
        </div>
      </section>
      <section className="section-col relative">
        <h2>Што кажуваат нашите верни корисници?</h2>
        <ReviewCarousel />
        <svg id="wave_copy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1564.47 1101.62"><path class="cls-1" d="M1564.47,360.78c-12.73,17.91-36.48,25.19-58.46,24.15-21.98-1.04-42.93-9.04-63.74-16.18-103.05-35.35-215.91-51.27-321.29-23.6-30.78,8.08-60.53,19.76-91.4,27.47-49.65,12.4-102.48,14.24-151.89.91-44.39-11.98-85.04-35.76-129.85-46.05-56.87-13.06-118.75-2.79-168.33,27.92-21.62,13.39-42.01,30.91-67.13,34.95l.21-312.53,1049.45.07,2.44,282.88Z"/></svg>
      </section>
      <section className="sgap section section-col">
        <h2 className="pb-4">Контактирај не за било какви прашања или забелешки</h2>
        <ContactForm />
      </section>
    </main>
  );
}
