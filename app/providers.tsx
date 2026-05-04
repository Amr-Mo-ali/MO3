"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { PUBLIC_LANGUAGE_STORAGE_KEY, type PublicLanguage } from "@/lib/public-i18n";

type PublicLanguageContextValue = {
  language: PublicLanguage;
  setLanguage: (language: PublicLanguage) => void;
  isArabic: boolean;
  isAdminRoute: boolean;
};

const PublicLanguageContext = createContext<PublicLanguageContextValue>({
  language: "en",
  setLanguage: () => undefined,
  isArabic: false,
  isAdminRoute: false,
});

function applyDocumentLanguage(language: PublicLanguage) {
  const root = document.documentElement;
  root.lang = language;
  root.dir = language === "ar" ? "rtl" : "ltr";
  root.dataset.publicLanguage = language;
}

export function usePublicLanguage() {
  return useContext(PublicLanguageContext);
}

export default function Providers({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const [language, setLanguageState] = useState<PublicLanguage>("en");

  useEffect(() => {
    if (isAdminRoute) {
      setLanguageState("en");
      applyDocumentLanguage("en");
      return;
    }

    const savedLanguage = window.localStorage.getItem(PUBLIC_LANGUAGE_STORAGE_KEY);
    const nextLanguage: PublicLanguage = savedLanguage === "ar" ? "ar" : "en";
    setLanguageState(nextLanguage);
    applyDocumentLanguage(nextLanguage);
  }, [isAdminRoute, pathname]);

  const setLanguage = (nextLanguage: PublicLanguage) => {
    if (isAdminRoute) {
      setLanguageState("en");
      applyDocumentLanguage("en");
      return;
    }

    setLanguageState(nextLanguage);
    window.localStorage.setItem(PUBLIC_LANGUAGE_STORAGE_KEY, nextLanguage);
    applyDocumentLanguage(nextLanguage);
  };

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      isArabic: language === "ar",
      isAdminRoute,
    }),
    [isAdminRoute, language]
  );

  return (
    <PublicLanguageContext.Provider value={contextValue}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </PublicLanguageContext.Provider>
  );
}
