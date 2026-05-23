import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-brand-primary-border/30 bg-canvas-background/90 px-4 backdrop-blur-md sm:px-6 lg:px-12">
      <div className="flex items-center gap-4">
        <button className="block text-charcoal-ink transition-colors hover:text-brand-primary lg:hidden">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-primary-border bg-white shadow-sm">
            <Image src="/kage-chan.svg" alt="KageWire Logo" width={26} height={26} className="object-contain" />
          </div>
          <span className="hidden font-serif text-2xl font-bold tracking-tight text-charcoal-ink sm:block">
            KageWire
          </span>
        </Link>
      </div>
      
      <nav className="hidden gap-8 lg:flex">
        <Link href="/" className="text-sm font-bold tracking-wide text-brand-primary">Home</Link>
        <Link href="#" className="group flex items-center gap-1 text-sm font-bold tracking-wide text-muted-text transition-colors hover:text-brand-primary">
          Anime
          <svg className="h-3 w-3 text-muted-gray transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </Link>
        <Link href="#" className="group flex items-center gap-1 text-sm font-bold tracking-wide text-muted-text transition-colors hover:text-brand-primary">
          Manga
          <svg className="h-3 w-3 text-muted-gray transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </Link>
        <Link href="#" className="text-sm font-bold tracking-wide text-muted-text transition-colors hover:text-brand-primary">Reviews</Link>
      </nav>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Search chronicles..." 
            className="w-48 rounded-full border border-brand-primary-border/50 bg-surface-slate/50 px-4 py-1.5 pl-9 text-sm text-charcoal-ink placeholder-muted-gray transition-all focus:w-64 focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
          <svg className="absolute left-3 top-2 h-4 w-4 text-muted-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <ThemeToggle />

        <div className="h-5 w-px bg-brand-primary-border/30 hidden sm:block"></div>

        <Link href="/auth/login" className="hidden text-sm font-bold tracking-wide text-muted-gray transition-colors hover:text-brand-primary sm:block">Log In</Link>
        <Link href="/auth/register" className="rounded-full bg-brand-primary px-4 py-1.5 text-xs font-bold tracking-wide text-white transition-all hover:scale-105 hover:bg-brand-secondary sm:text-sm">Sign Up</Link>
      </div>
    </header>
  );
}
