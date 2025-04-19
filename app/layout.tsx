import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Copyright, Instagram, Mail, School } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Logo from "@/app/WaterLoop-logo-symbol.png";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Waterloop",
  description: "Every drop matters",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link
                      className="text-xl flex items-center gap-2"
                      href={"/"}
                    >
                      <Image src={Logo} height={50} alt="logo" />
                      Waterloop
                    </Link>
                    {user && (
                      <>
                        <Link href="/dashboard">Dashboard</Link>
                        <Link href="/dashboard/devices">Devices</Link>
                        <Link href="/dashboard/alerts">Alerts</Link>
                      </>
                    )}

                    {/* <div className="flex items-center gap-2">
                      <DeployButton />
                    </div> */}
                  </div>
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </nav>
              {/* <div className="flex flex-col gap-20 max-w-5xl p-5"> */}
              <div className="max-w-5xl w-full px-5 py-0">{children}</div>

              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
                <p>
                  Powered by{" "}
                  <a
                    href="https://supabase.com/"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Supabase
                  </a>
                </p>
                <p>|</p>
                <p>
                  Developed by{" "}
                  <a
                    href="https://www.linkedin.com/in/p-papadopoulos/"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Panos Papadopoulos
                  </a>
                </p>
                <p>|</p>
                <p className="flex items-center gap-2">
                  <a
                    href="https://waterloopwrs.tilda.ws/"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Waterloop
                  </a>
                  <span className="flex items-center">
                    {<Copyright size={12} />} {new Date().getFullYear()}
                  </span>
                </p>
                <p>|</p>
                <p className="flex items-center gap-2">
                  {<Instagram size={12} />}
                  <a
                    href="https://www.instagram.com/waterloop.wrs/"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    @waterloop.wrs
                  </a>
                </p>
                <p>|</p>
                <p className="flex items-center gap-2">
                  {<Mail size={12} />}
                  <a
                    href="mailto:waterloopteam2024@gmail.com"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    waterloopteam2024@gmail.com
                  </a>
                </p>
                <p>|</p>
                <p className="flex items-center gap-2">
                  {<School size={12} />}
                  <a
                    href="http://lyk-magoul.att.sch.gr/"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    ΓΕΛ Μαγούλας
                  </a>
                </p>
                {/* <ThemeSwitcher /> */}
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

