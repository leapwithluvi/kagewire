'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  Bookmark,
  ChevronDown,
  Layers,
  Sparkles,
  BookOpen,
  Film,
  Megaphone,
  Loader2,
  ArrowRight,
} from 'lucide-react';

interface SearchResultItem {
  id: string;
  title: string;
  poster: string;
  type: 'anime' | 'donghua' | 'comic';
  href: string;
  subtitle?: string;
  badge?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsExploreOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Click outside listener using pointerdown for cross-device support (mouse + touch)
  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      const target = event.target as Node;

      // Close Jelajahi dropdown if clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsExploreOpen(false);
      }

      // Close search results dropdown if clicked outside
      const isInsideDesktopSearch = searchRef.current && searchRef.current.contains(target);
      const isInsideMobileSearch = mobileSearchRef.current && mobileSearchRef.current.contains(target);
      if (!isInsideDesktopSearch && !isInsideMobileSearch) {
        setIsSearchOpen(false);
      }

      // Close mobile menu if clicked outside both the drawer and the burger toggle button
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        mobileToggleRef.current &&
        !mobileToggleRef.current.contains(target)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  // Live search debounce
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setIsSearchOpen(false);
      return;
    }

    setIsSearching(true);
    setIsSearchOpen(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch (err) {
        console.error('Failed to fetch search results:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Anime', href: '/anime' },
    { label: 'Donghua', href: '/donghua' },
    { label: 'Komik', href: '/comic' },
    { label: 'Jadwal', href: '/schedule' },
  ];

  const exploreCategories = [
    {
      title: 'Anime',
      icon: Film,
      links: [
        { label: 'Katalog Semua Anime', href: '/anime/list' },
        { label: 'Anime On-Going', href: '/anime/ongoing' },
      ],
    },
    {
      title: 'Donghua',
      icon: Sparkles,
      links: [
        { label: 'Katalog Semua Donghua', href: '/donghua/list' },
        { label: 'Donghua On-Going', href: '/donghua/ongoing' },
      ],
    },
    {
      title: 'Komik & Manhwa',
      icon: BookOpen,
      links: [
        { label: 'Katalog Semua Komik', href: '/comic/list' },
        { label: 'Komik On-Going', href: '/comic/ongoing' },
        { label: 'Jadwal Rilis Komik', href: '/comic/schedule', highlight: true },
      ],
    },
    {
      title: 'Eksplorasi & Iklan',
      icon: Layers,
      links: [
        { label: 'Daftar Genre', href: '/genre' },
        { label: 'Jadwal Rilis Episode Anime', href: '/schedule' },
        { label: 'Sewa & Pasang Iklan', href: '/advertise', highlight: true },
      ],
    },
  ];

  const renderSearchResults = (isMobile = false) => {
    if (!isSearchOpen || searchQuery.trim().length < 2) return null;

    return (
      <div
        className={`absolute top-full left-0 right-0 mt-2 rounded-xl border border-border-subtle bg-surface-card shadow-2xl backdrop-blur-xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-150 ${
          isMobile ? 'w-full' : 'w-[360px] lg:w-[420px]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-border-subtle bg-surface-main text-xs">
          <span className="font-semibold text-content-secondary flex items-center gap-1.5">
            {isSearching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber" />
                <span>Mencari...</span>
              </>
            ) : (
              <span>Hasil Pencarian ({searchResults.length})</span>
            )}
          </span>
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="text-content-muted hover:text-content-primary p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[340px] overflow-y-auto divide-y divide-border-subtle/50">
          {searchResults.length > 0 ? (
            searchResults.map((item) => {
              const badgeColors = {
                anime: 'bg-amber/20 text-amber border-amber/30',
                donghua: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
                comic: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
              }[item.type];

              return (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={item.href}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-2.5 hover:bg-surface-secondary transition-colors group"
                >
                  <div className="w-10 h-14 rounded-md overflow-hidden bg-surface-secondary flex-shrink-0 border border-border-subtle">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.poster || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${badgeColors}`}>
                        {item.type}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] font-mono text-content-muted">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-semibold text-content-primary truncate group-hover:text-amber transition-colors">
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <p className="text-[11px] text-content-muted truncate font-mono">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })
          ) : !isSearching ? (
            <div className="p-6 text-center text-xs text-content-muted">
              Tidak ada judul yang cocok dengan &quot;{searchQuery}&quot;.
            </div>
          ) : null}
        </div>

        {/* View All Footer */}
        <Link
          href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
          onClick={() => {
            setIsSearchOpen(false);
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center justify-center gap-1.5 p-2.5 bg-surface-main hover:bg-surface-secondary text-xs font-semibold text-amber border-t border-border-subtle transition-colors"
        >
          <span>Lihat semua hasil untuk &quot;{searchQuery}&quot;</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] bg-surface-main/95 backdrop-blur-md border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[68px] flex items-center justify-between gap-4">
        {/* Brand Logo & Mascot */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex items-center justify-center bg-surface-secondary border border-border-subtle group-hover:border-amber/40 transition-colors shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kage-chan.svg"
              alt="Kage-chan Mascot"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-lg sm:text-xl tracking-wider text-content-primary">
              KAGEWIRE
            </span>
            <span className="w-2 h-2 rounded-full bg-amber" />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname === link.href || (pathname.startsWith(link.href) && !pathname.startsWith('/anime/list') && !pathname.startsWith('/anime/ongoing') && !pathname.startsWith('/donghua/list') && !pathname.startsWith('/donghua/ongoing') && !pathname.startsWith('/comic/list') && !pathname.startsWith('/comic/ongoing'));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold tracking-normal transition-all ${
                  isActive
                    ? 'text-amber bg-amber-muted'
                    : 'text-content-secondary hover:text-content-primary hover:bg-surface-secondary'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Jelajahi Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExploreOpen((prev) => !prev);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold tracking-normal transition-all cursor-pointer select-none ${
                isExploreOpen || ['/genre', '/anime/list', '/donghua/list', '/comic/list', '/advertise'].some((p) => pathname.startsWith(p))
                  ? 'text-amber bg-amber-muted'
                  : 'text-content-secondary hover:text-content-primary hover:bg-surface-secondary'
              }`}
            >
              <span>Jelajahi</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 pointer-events-none ${
                  isExploreOpen ? 'rotate-180 text-amber' : ''
                }`}
              />
            </button>

            {isExploreOpen && (
              <div className="absolute top-full left-0 mt-2 w-[520px] rounded-xl border border-border-subtle bg-surface-card p-5 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95 z-50">
                <div className="grid grid-cols-2 gap-5">
                  {exploreCategories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <div key={cat.title} className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-content-primary uppercase tracking-wider pb-1.5 border-b border-border-subtle">
                          <Icon className="w-4 h-4 text-amber" />
                          <span>{cat.title}</span>
                        </div>
                        <ul className="space-y-1">
                          {cat.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                onClick={() => setIsExploreOpen(false)}
                                className={`block px-2.5 py-1.5 rounded-md text-sm transition-colors ${
                                  link.highlight
                                    ? 'text-amber font-semibold hover:bg-amber/10'
                                    : 'text-content-secondary hover:text-content-primary hover:bg-surface-secondary'
                                }`}
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 pt-3.5 border-t border-border-subtle flex items-center justify-between text-xs text-content-muted">
                  <span>KageWire Discovery Portal</span>
                  <Link
                    href="/advertise"
                    onClick={() => setIsExploreOpen(false)}
                    className="text-amber hover:underline font-semibold flex items-center gap-1.5"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>Pasang Iklan Mulai Rp 100rb</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Section: Search & Bookmarks */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Search with Live Dropdown */}
          <div className="hidden sm:block relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="flex items-center relative w-48 lg:w-64">
              <Search className="w-4 h-4 absolute left-3.5 text-content-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Cari anime, donghua, komik..."
                value={searchQuery}
                onFocus={() => {
                  if (searchResults.length > 0) setIsSearchOpen(true);
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-card border border-border-subtle rounded-lg pl-9 pr-3.5 py-2 text-sm text-content-primary placeholder-content-muted focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/50 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2.5 text-content-muted hover:text-content-primary p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
            {renderSearchResults(false)}
          </div>

          <Link
            href="/advertise"
            className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber to-amber-hover text-background text-sm font-bold hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber/20"
            title="Sewa Slot Iklan"
          >
            <Megaphone className="w-4 h-4" />
            <span>Pasang Iklan</span>
          </Link>

          <Link
            href="/bookmarks"
            className={`p-2.5 rounded-lg transition-colors ${
              pathname === '/bookmarks'
                ? 'bg-amber-muted text-amber border border-amber-border'
                : 'text-content-secondary hover:text-content-primary hover:bg-surface-secondary border border-border-subtle'
            }`}
            title="Daftar Simpanan & Riwayat"
          >
            <Bookmark className="w-5 h-5" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            ref={mobileToggleRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen((prev) => !prev);
            }}
            className="md:hidden p-2.5 rounded-lg bg-surface-secondary text-content-secondary hover:text-content-primary border border-border-subtle active:scale-95 transition-transform cursor-pointer select-none touch-manipulation"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 pointer-events-none text-amber" />
            ) : (
              <Menu className="w-5 h-5 pointer-events-none" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden border-t border-border-subtle bg-surface-main px-4 py-5 space-y-5 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200 shadow-2xl"
        >
          {/* Mobile Search with Live Dropdown */}
          <div className="relative" ref={mobileSearchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-content-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Cari judul anime, donghua, komik..."
                value={searchQuery}
                onFocus={() => {
                  if (searchResults.length > 0) setIsSearchOpen(true);
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-card border border-border-subtle rounded-lg pl-10 pr-9 py-2.5 text-sm text-content-primary placeholder-content-muted focus:outline-none focus:border-amber"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-3 top-3 text-content-muted hover:text-content-primary p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
            {renderSearchResults(true)}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-2.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-semibold text-center transition-all ${
                  pathname === link.href
                    ? 'bg-amber text-background shadow-md shadow-amber/20 font-bold'
                    : 'bg-surface-card text-content-secondary border border-border-subtle hover:text-content-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Categorized Explore Links */}
          <div className="space-y-4 pt-3 border-t border-border-subtle">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber">
                Jelajahi Kategori
              </span>
              <span className="text-[10px] font-mono text-content-muted">
                Semua Katalog Konten
              </span>
            </div>
            {exploreCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.title}>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-content-muted mb-2">
                    <Icon className="w-4 h-4 text-amber" />
                    <span>{cat.title}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {cat.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                          link.highlight
                            ? 'text-amber font-semibold bg-amber/10 border border-amber/20'
                            : 'text-content-secondary hover:text-content-primary hover:bg-surface-card border border-transparent hover:border-border-subtle'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
