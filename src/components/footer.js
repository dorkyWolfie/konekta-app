import Link from "next/link"
import Image from "next/image"

export default async function Footer () {
    return (
        <footer className="flex flex-col w-full">
            <div className="bg-[#1e40af] text-white py-10 px-10 max-sm:hidden">
                <div className="max-w-6xl mx-auto flex flex-row justify-between gap-4">
                    <Link href={"/"} className="self-center"><Image src="/konekta_logo_3.webp" alt="logo" width={100} height={50} /></Link>
                    <nav className="flex flex-col">
                        <Link className="hover:text-[#bae6fd]" href={"/#proizvodi"}>Производи</Link>
                        <Link className="hover:text-[#bae6fd]" href={"/#cenovnik"}>Ценовник</Link>
                        <Link className="hover:text-[#bae6fd]" href={"/#recenzii"}>Рецензии</Link>
                        <Link className="hover:text-[#bae6fd]" href={"/#kontakt"}>Контакт</Link>
                    </nav>
                    <nav className="flex flex-col">
                        <Link className="hover:text-[#bae6fd]" href={"/privatnost"}>Политика на приватност</Link>
                        <Link className="hover:text-[#bae6fd]" href={"/kolacinja"}>Колачиња</Link>
                        <Link className="hover:text-[#bae6fd]" href={"/uslovi-na-koristenje"}>Услови на користење</Link>
                        <Link className="hover:text-[#bae6fd]" href={"/upatstvo-za-koristenje"}>Упатство за користење</Link>
                        <Link className="hover:text-[#bae6fd]" href={"/reklamacija"}>Политика на поврат и рефундација</Link>
                    </nav>
                </div>
            </div>
            <p className="text-center text-sm font-bold py-1 pt-2">© 2025 <Link className="hover:text-[#3b82f6]" href={"/"}>Конекта</Link></p>
        </footer>
    );
}