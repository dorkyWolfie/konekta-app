import "../globals.css";
import { Manrope } from 'next/font/google'
import Footer from "@/components/footer";
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: "Конекта",
  description: "Твојата дигитална прва импресија",
  robots: {
      index: false,
      follow: false,
      nocache: true,
    },
};

const manrope = Manrope({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['cyrillic', 'latin'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="mk" className={manrope.className}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/icon.ico" sizes="32x32" />
      </head>
      <body>
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
