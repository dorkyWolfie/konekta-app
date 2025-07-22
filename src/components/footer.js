import Link from "next/link"
import Image from "next/image"

export default async function Footer () {
    return (
        <footer className="flex flex-col w-full">
            <p className="text-center text-sm font-bold py-1 pt-2">© 2025 <Link className="hover:text-[#3b82f6]" href={"https://konekta.mk"}>Конекта</Link></p>
        </footer>
    );
}