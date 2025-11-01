"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const Logo = () => (
  <svg width="42" height="30" viewBox="0 0 42 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.24261 17.051C3.37412 17.0157 3.51167 17.0075 3.6466 17.0268C3.78154 17.046 3.91094 17.0924 4.02666 17.1629C4.14237 17.2334 4.2419 17.3266 4.31898 17.4365C4.39607 17.5465 4.44906 17.6709 4.47458 17.8018C4.72277 18.6744 5.08136 19.5134 5.54208 20.2992C6.34093 21.6525 7.43526 22.817 8.74712 23.7096C10.059 24.6023 11.5561 25.2011 13.1318 25.4634L12.4136 24.2403C12.2831 24.0181 12.2483 23.7543 12.3168 23.507C12.3853 23.2597 12.5514 23.0492 12.7787 22.9216C13.006 22.7941 13.2758 22.7601 13.5288 22.827C13.7818 22.8939 13.9972 23.0564 14.1277 23.2786L16.0953 26.6297C16.2257 26.8519 16.2606 27.1157 16.1921 27.363C16.1236 27.6103 15.9575 27.8209 15.7302 27.9484L12.302 29.8718C12.0747 29.9993 11.8049 30.0334 11.5519 29.9664C11.2989 29.8995 11.0835 29.737 10.953 29.5148C10.8226 29.2927 10.7877 29.0289 10.8562 28.7816C10.9247 28.5343 11.0909 28.3237 11.3182 28.1962L12.7837 27.374C10.9232 27.0609 9.15601 26.3508 7.6081 25.2942C6.06019 24.2377 4.76956 22.8605 3.82802 21.2609C3.28227 20.3343 2.86094 19.3428 2.57451 18.311C2.52816 18.1856 2.50886 18.0522 2.51781 17.9192C2.52675 17.7862 2.56376 17.6564 2.6265 17.5381C2.68926 17.4197 2.7764 17.3154 2.88243 17.2315C2.98845 17.1477 3.11109 17.0862 3.24261 17.051Z" fill="#009EE3"/>
    <path d="M26.4914 15.228C26.7187 15.1004 26.9885 15.0664 27.2415 15.1333C27.4944 15.2003 27.7098 15.3627 27.8403 15.5849L29.8079 18.936C29.9384 19.1582 29.9732 19.422 29.9047 19.6693C29.8363 19.9166 29.6701 20.1272 29.4428 20.2547C29.2155 20.3822 28.9457 20.4162 28.6927 20.3493C28.4397 20.2824 28.2243 20.1199 28.0938 19.8978L27.2871 18.5238C26.3699 21.6425 24.2452 24.2889 21.3643 25.901C20.7414 26.2511 20.0897 26.5497 19.416 26.7937C19.2924 26.8381 19.1612 26.8584 19.0297 26.8532C18.8981 26.8481 18.7689 26.8176 18.6494 26.7637C18.5299 26.7097 18.4225 26.6333 18.3332 26.5387C18.2439 26.4441 18.1746 26.3333 18.1291 26.2126C18.0836 26.0918 18.063 25.9635 18.0682 25.8349C18.0735 25.7064 18.1046 25.5801 18.1598 25.4633C18.215 25.3464 18.2932 25.2414 18.3899 25.1541C18.4867 25.0669 18.6 24.999 18.7236 24.9546L18.7383 24.9797C19.3061 24.773 19.8553 24.5207 20.3805 24.2254C22.7861 22.8838 24.5692 20.6864 25.3583 18.0913L24.047 18.827C23.8197 18.9545 23.5499 18.9885 23.2969 18.9216C23.0439 18.8546 22.8285 18.6922 22.6981 18.47C22.5676 18.2478 22.5328 17.9841 22.6012 17.7368C22.6697 17.4895 22.8359 17.2789 23.0632 17.1514L26.4914 15.228Z" fill="#009EE3"/>
    <path d="M10.5231 3.22585C10.7726 3.13609 11.0483 3.14691 11.2897 3.25588C11.531 3.36486 11.7181 3.56311 11.81 3.80698C11.9018 4.05085 11.8908 4.32038 11.7793 4.55629C11.6678 4.79221 11.465 4.97518 11.2155 5.06494L11.2008 5.03981C10.633 5.24652 10.0837 5.49881 9.55858 5.7941C7.16526 7.14538 5.38836 9.3371 4.58934 11.9235L5.89207 11.1926C6.11937 11.0651 6.38918 11.031 6.64216 11.098C6.89513 11.1649 7.11055 11.3273 7.24101 11.5495C7.37147 11.7717 7.40629 12.0355 7.33782 12.2828C7.26934 12.53 7.10318 12.7406 6.87588 12.8682L3.44769 14.7916C3.22039 14.9191 2.95058 14.9532 2.69761 14.8862C2.44463 14.8193 2.22922 14.6569 2.09876 14.4347L0.131134 11.0835C0.000676358 10.8613 -0.034145 10.5976 0.0343238 10.3503C0.1028 10.103 0.268994 9.89237 0.496295 9.76484C0.723593 9.63731 0.993411 9.6033 1.24638 9.67024C1.49935 9.73718 1.71477 9.8996 1.84523 10.1218L2.65688 11.5041C3.2153 9.61947 4.21772 7.88895 5.58377 6.45134C6.94982 5.01374 8.64149 3.90903 10.5231 3.22585Z" fill="#009EE3"/>
    <path d="M17.6371 0.147738C17.8644 0.0202151 18.1342 -0.0138338 18.3872 0.0531026C18.6402 0.120041 18.8556 0.282502 18.986 0.504697C19.1165 0.726891 19.1513 0.990644 19.0828 1.23793C19.0144 1.48522 18.8482 1.6958 18.6209 1.82333L17.1554 2.64558C19.0159 2.95863 20.7831 3.66872 22.331 4.7253C23.8789 5.78189 25.1695 7.15903 26.1111 8.75867C26.6496 9.67741 27.0686 10.6583 27.3584 11.6786C27.418 11.8902 27.4022 12.1154 27.3134 12.317C27.2247 12.5186 27.0684 12.6846 26.8702 12.7878L26.656 12.908C26.5287 12.9398 26.3962 12.9464 26.2663 12.9275C26.1363 12.9086 26.0115 12.8645 25.8992 12.7979C25.7869 12.7312 25.6893 12.6434 25.6121 12.5395C25.535 12.4355 25.4797 12.3176 25.4497 12.1926C24.8989 10.2492 23.7938 8.4992 22.2635 7.14696C20.7331 5.79473 18.8407 4.89613 16.8073 4.5561L17.5255 5.77927C17.656 6.00147 17.6908 6.26522 17.6223 6.51251C17.5538 6.7598 17.3876 6.97038 17.1603 7.09791C16.933 7.22544 16.6632 7.25948 16.4103 7.19254C16.1573 7.12561 15.9419 6.96318 15.8114 6.74099L13.8438 3.3898C13.7133 3.16761 13.6785 2.90385 13.747 2.65656C13.8155 2.40928 13.9816 2.1987 14.2089 2.07117L17.6371 0.147738Z" fill="#009EE3"/>
    <path d="M37.3255 0.0335566C37.5784 -0.0333814 37.8482 0.000662096 38.0755 0.128192L41.5037 2.05158C41.731 2.17911 41.8972 2.38969 41.9657 2.63698C42.0341 2.88427 41.9993 3.14806 41.8689 3.37025L39.9012 6.7214C39.7708 6.9436 39.5554 7.10602 39.3024 7.17296C39.0494 7.2399 38.7796 7.20585 38.5523 7.07832C38.325 6.95079 38.1588 6.74022 38.0903 6.49293C38.0219 6.24564 38.0567 5.98188 38.1871 5.75969L38.9053 4.53652C36.872 4.87655 34.9796 5.77518 33.4492 7.12742C31.9188 8.47965 30.8137 10.2297 30.2629 12.173C30.2329 12.298 30.1777 12.416 30.1005 12.5199C30.0233 12.6238 29.9257 12.7117 29.8134 12.7783C29.7011 12.8449 29.5763 12.889 29.4464 12.9079C29.3165 12.9268 29.1839 12.9202 29.0566 12.8885L28.8424 12.7682C28.6443 12.6651 28.4879 12.499 28.3992 12.2974C28.3105 12.0958 28.2946 11.8706 28.3543 11.6591C28.644 10.6388 29.063 9.65783 29.6016 8.73909C30.5431 7.13944 31.8338 5.7623 33.3817 4.70572C34.9296 3.64914 36.6967 2.93908 38.5573 2.62604L37.0917 1.80375C36.8644 1.67622 36.6983 1.46564 36.6298 1.21835C36.5613 0.97106 36.5962 0.707307 36.7266 0.485113C36.8571 0.262919 37.0725 0.100496 37.3255 0.0335566Z" fill="#009EE3"/>
  </svg>
);

const MenuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);


export function GlobalNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  // Handle Escape key to close mobile menu and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="relative flex h-20 w-full items-center justify-between border-b border-gray-200 px-6 sm:px-10 bg-white z-50">
        <div className="flex items-center gap-3">
          <Link href="/" onClick={closeMobileMenu}>
            <Logo />
          </Link>
          <Link href="/" onClick={closeMobileMenu}>
            <span className="text-xl font-semibold text-gray-800 md:hidden lg:inline">
              Consenza
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex lg:hidden absolute left-1/2 -translate-x-1/2 items-center gap-8">
          <Link
            href="/"
            className={`text-sm font-medium transition-all px-3 py-2 ${
              isActive("/")
                ? "text-[#A8005C] underline underline-offset-4 decoration-2"
                : "text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4 hover:decoration-gray-400"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/home"
            className={`text-sm font-medium transition-all px-3 py-2 ${
              isActive("/home")
                ? "text-[#A8005C] underline underline-offset-4 decoration-2"
                : "text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4 hover:decoration-gray-400"
            }`}
          >
            Home
          </Link>
          <Link
            href="/discussions"
            className={`text-sm font-medium transition-all px-3 py-2 ${
              isActive("/discussions")
                ? "text-[#A8005C] underline underline-offset-4 decoration-2"
                : "text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4 hover:decoration-gray-400"
            }`}
          >
            Discussions
          </Link>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <MenuIcon />}
        </Button>

        <div className="hidden md:flex items-center gap-8">
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-all px-3 py-2 ${
                isActive("/")
                  ? "text-[#A8005C] underline underline-offset-4 decoration-2"
                  : "text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4 hover:decoration-gray-400"
              }`}
            >
              Home
            </Link>
            <Link
              href="/home"
              className={`text-sm font-medium transition-all px-3 py-2 ${
                isActive("/home")
                  ? "text-[#A8005C] underline underline-offset-4 decoration-2"
                  : "text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4 hover:decoration-gray-400"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/discussions"
              className={`text-sm font-medium transition-all px-3 py-2 ${
                isActive("/discussions")
                  ? "text-[#A8005C] underline underline-offset-4 decoration-2"
                  : "text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4 hover:decoration-gray-400"
              }`}
            >
              Discussions
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/discussions/new">
              <Button
                variant="default"
                className="h-10 rounded-md bg-[#A8005C] px-6 text-white hover:bg-[#8A004B] active:bg-[#6B0038] transition-all active:scale-[0.98]"
              >
                Create New
              </Button>
            </Link>
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-x-0 top-20 z-40 bg-white border-b border-gray-200 md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-[calc(100vh-5rem)] opacity-100 shadow-lg"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <nav className="flex flex-col px-6 py-6 gap-2">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className={`text-base font-medium transition-all px-4 py-3 ${
              isActive("/")
                ? "text-[#A8005C] underline underline-offset-4 decoration-2"
                : "text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4 hover:decoration-gray-400"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/home"
            onClick={closeMobileMenu}
            className={`text-base font-medium transition-all px-4 py-3 ${
              isActive("/home")
                ? "text-[#A8005C] underline underline-offset-4 decoration-2"
                : "text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4 hover:decoration-gray-400"
            }`}
          >
            Home
          </Link>
          <Link
            href="/discussions"
            onClick={closeMobileMenu}
            className={`text-base font-medium transition-all px-4 py-3 ${
              isActive("/discussions")
                ? "text-[#A8005C] underline underline-offset-4 decoration-2"
                : "text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4 hover:decoration-gray-400"
            }`}
          >
            Discussions
          </Link>
          
          <div className="flex flex-col gap-4 pt-4 border-t border-gray-200 mt-2">
            <Link href="/discussions/new" onClick={closeMobileMenu}>
              <Button
                variant="default"
                className="w-full h-10 rounded-md bg-[#A8005C] px-6 text-white hover:bg-[#8A004B] active:bg-[#6B0038] transition-all active:scale-[0.98]"
              >
                Create New
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
