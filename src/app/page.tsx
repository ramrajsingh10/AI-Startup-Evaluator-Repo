import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppLogo, AnalyticsIcon, AdminShieldIcon, FounderCloudIcon, InvestorMoneyIcon } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-20">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <AppLogo className="h-6 w-auto text-primary" />
          <span className="sr-only">StartupVerse</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {/* Admin Button Added */}
          <Button asChild variant="ghost">
            <Link href="/admin">Admin</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full pt-24 md:pt-32 lg:pt-40 border-y bg-primary/5">
          <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
              <div>
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem] font-headline">
                  The Platform Where Innovation Meets Investment
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
                  StartupVerse connects visionary founders with discerning investors, managed by a seamless administrative backend.
                </p>
                <div className="space-x-4 mt-6">
                  {/* Find a Startup now links to /investor */}
                  <Button asChild size="lg">
                    <Link href="/investor">Find a Startup</Link>
                  </Button>
                  {/* Submit Your Deck now links to /founder/submit */}
                  <Button asChild variant="outline" size="lg">
                    <Link href="/founder/submit">Submit Your Deck</Link>
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-2 rounded-xl">
                   <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-2 rounded-xl transform -rotate-3">
                     <div className="bg-background p-8 rounded-lg shadow-2xl w-full max-w-md">
                        <h3 className="text-lg font-bold font-headline">Featured Startup</h3>
                        <p className="text-sm text-muted-foreground mt-1">InnovateX - AI-driven solutions</p>
                        <div className="mt-4 flex items-center gap-4">
                           <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                              <AnalyticsIcon className="h-6 w-6 text-primary" />
                           </div>
                           <div>
                              <p className="font-semibold">Next-Gen Analytics</p>
                              <p className="text-sm text-muted-foreground">Series A</p>
                           </div>
                        </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-accent px-3 py-1 text-sm text-accent-foreground">Key Roles</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">A Universe for Everyone</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Whether you're a founder with a groundbreaking idea, an investor seeking the next big thing, or an admin managing the flow, StartupVerse is built for you.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              <div className="grid gap-1 text-center p-6 rounded-lg hover:bg-accent/50 transition-colors">
                <AdminShieldIcon className="h-8 w-8 mx-auto text-primary" />
                <h3 className="text-lg font-bold font-headline mt-4">Admins</h3>
                <p className="text-sm text-muted-foreground">
                  Effortlessly manage access, review submissions, and oversee the entire ecosystem with powerful, intuitive tools.
                </p>
              </div>
              <div className="grid gap-1 text-center p-6 rounded-lg hover:bg-accent/50 transition-colors">
                <FounderCloudIcon className="h-8 w-8 mx-auto text-primary" />
                <h3 className="text-lg font-bold font-headline mt-4">Founders</h3>
                <p className="text-sm text-muted-foreground">
                  Submit your vision, connect with interested investors, and get critical feedback through AI-powered memo generation.
                </p>
              </div>
              <div className="grid gap-1 text-center p-6 rounded-lg hover:bg-accent/50 transition-colors">
                <InvestorMoneyIcon className="h-8 w-8 mx-auto text-primary" />
                <h3 className="text-lg font-bold font-headline mt-4">Investors</h3>
                <p className="text-sm text-muted-foreground">
                  Discover curated startups, analyze AI-generated memos, and connect directly with founders of high-potential ventures.
                </p>
              </div>
            </div>
            <div className="flex justify-center flex-col sm:flex-row items-start gap-4">
              <Button asChild size="lg">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 StartupVerse. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
