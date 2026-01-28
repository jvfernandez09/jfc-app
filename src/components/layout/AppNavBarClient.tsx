"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

type MeUser = {
  id: string;
  name: string;
  email: string;
} | null;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function AppNavbarClient({ user }: { user: MeUser }) {
  const pathname = usePathname();

  const [contactsOpen, setContactsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const contactsRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  const isContactsActive = useMemo(() => {
    return pathname.startsWith("/business") || pathname.startsWith("/people");
  }, [pathname]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    closeAll();
  }, [pathname]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;

      if (contactsRef.current && !contactsRef.current.contains(target)) {
        setContactsOpen(false);
      }

      if (userRef.current && !userRef.current.contains(target)) {
        setUserOpen(false);
      }

      if (rootRef.current && !rootRef.current.contains(target)) {
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const closeAll = () => {
    setContactsOpen(false);
    setUserOpen(false);
    setMobileOpen(false);
  };

  const displayName = user?.name ?? "Account";

  const navLinkClass = (href: string) => {
    const active = pathname === href;

    return cx(
      "relative flex h-16 items-center px-2 text-sm font-medium transition",
      active ? "text-gray-900" : "text-gray-500 hover:text-gray-800",
      active
        ? "after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-[rgb(var(--brand))]"
        : "after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-transparent hover:after:bg-gray-300"
    );
  };

  const dropdownButtonClass = (active: boolean) => {
    return cx(
      "relative flex h-16 items-center gap-1 px-2 text-sm font-medium transition",
      active ? "text-gray-900" : "text-gray-500 hover:text-gray-800",
      active
        ? "after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-[rgb(var(--brand))]"
        : "after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-transparent hover:after:bg-gray-300"
    );
  };

  const dropdownPanelClass = (open: boolean, align: "left" | "right") => {
    return cx(
      "absolute top-14 rounded-md border border-gray-200 bg-white shadow-sm",
      align === "left" ? "left-0 origin-top-left" : "right-0 origin-top-right",
      "transition-all duration-200 ease-out",
      open
        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
        : "opacity-0 -translate-y-1 scale-95 pointer-events-none"
    );
  };

  const mobileLinkClass = (href: string) => {
    const active = pathname === href;

    return cx(
      "block px-4 py-4 text-base",
      active
        ? "bg-indigo-50 text-indigo-600 border-l-2 border-indigo-500 font-semibold"
        : "text-gray-800 hover:bg-gray-50 font-normal"
    );
  };

  return (
    <header ref={rootRef} className="relative border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-7">
        {/* LEFT */}
        <div className="flex items-center gap-8">
          <Link href="/task" className="flex items-center" onClick={closeAll}>
            <Image
              src="/jblogo.png"
              alt="Logo"
              width={48}
              height={57}
              priority
              className="object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/task" className={navLinkClass("/task")}>
              Task List
            </Link>

            <div className="relative" ref={contactsRef}>
              <button
                type="button"
                onClick={() => setContactsOpen((v) => !v)}
                className={dropdownButtonClass(isContactsActive)}
              >
                Contacts
                <ChevronDown
                  className={cx(
                    "h-4 w-4 text-gray-400 transition-transform duration-200",
                    contactsOpen ? "rotate-180" : "rotate-0"
                  )}
                />
              </button>

              {mounted && contactsOpen && (
                <div className={cx(dropdownPanelClass(true, "left"), "w-44")}>
                  <Link
                    href="/people"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setContactsOpen(false)}
                  >
                    People
                  </Link>

                  <Link
                    href="/business"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setContactsOpen(false)}
                  >
                    Business
                  </Link>
                </div>
              )}


            </div>

            <Link href="/tag" className={navLinkClass("/tag")}>
              Tags
            </Link>

            <Link href="/categories" className={navLinkClass("/categories")}>
              Categories
            </Link>
          </nav>
        </div>

        <div className="hidden md:block">
          <div className="relative" ref={userRef}>
            <button
              type="button"
              onClick={() => setUserOpen((v) => !v)}
              className="flex h-16 items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800"
            >
              {displayName}
              <ChevronDown
                className={cx(
                  "h-4 w-4 text-gray-400 transition-transform duration-200",
                  userOpen ? "rotate-180" : "rotate-0"
                )}
              />
            </button>

            {mounted && userOpen && (
              <div className={cx(dropdownPanelClass(true, "right"), "w-48")}>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setUserOpen(false)}
                >
                  Profile
                </Link>

                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Log Out
                  </button>
                </form>


              </div>
            )}


          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100 md:hidden"
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-gray-600" />
          ) : (
            <Menu className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-sm">
          <div>
            <Link
              href="/task"
              className={mobileLinkClass("/task")}
              onClick={closeAll}
            >
              Task List
            </Link>

            <Link
              href="/tag"
              className={mobileLinkClass("/tag")}
              onClick={closeAll}
            >
              Tags
            </Link>

            <Link
              href="/categories"
              className={mobileLinkClass("/categories")}
              onClick={closeAll}
            >
              Categories
            </Link>

            <Link
              href="/people"
              className={mobileLinkClass("/people")}
              onClick={closeAll}
            >
              People
            </Link>

            <Link
              href="/business"
              className={mobileLinkClass("/business")}
              onClick={closeAll}
            >
              Businesses
            </Link>
          </div>

          <div className="border-t border-gray-200 px-4 py-4">
            <div className="text-sm font-semibold text-gray-900">
              {displayName}
            </div>
            <div className="mt-4 space-y-3">
              <Link
                href="/profile"
                className="block text-base font-medium text-gray-800 hover:text-gray-900"
                onClick={closeAll}
              >
                Profile
              </Link>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="block text-left text-base font-medium text-gray-800 hover:text-gray-900"
                >
                  Log Out
                </button>
              </form>

            </div>
          </div>
        </div>
      )}
    </header>
  );
}
