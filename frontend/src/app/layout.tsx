import { Source_Sans_3 } from "next/font/google";

// CSS
import "./globals.css";

const sourceSans = Source_Sans_3({ subsets: ["latin"] });

export const metadata = {
  title: "Planning Poker Pro",
  description:
    "Planning poker, aka Scrum Poker, is a straightforward consensus-building tool for Agile teams to estimate the complexity of tasks.",
  keywords:
    "planning poker, scrum poker, agile, estimation, planning, scrum, agile estimation, user story",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={sourceSans.className}>
        {children}
        <footer className="bg-gray-100">
          <div className="mx-auto max-w-[1300px] flex space-x-10 justify-center">
            <a href="/cookies" className="underline text-purple">
              Cookies
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
