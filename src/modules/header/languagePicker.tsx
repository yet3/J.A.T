import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

const LANGS: { name: string; key: string }[] = [
  { name: 'EN', key: 'en' },
  { name: 'PL', key: 'pl' },
];

const LanguagePicker = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const handleMouseDown = (e: globalThis.MouseEvent) => {
        if (!pickerRef.current?.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      window.addEventListener('mousedown', handleMouseDown);

      return () => {
        window.removeEventListener('mousedown', handleMouseDown);
      };
    }
  }, [isOpen]);

  const handleChangeLang = async (key: string) => {
    await i18n.changeLanguage(key);
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: key });
  };

  const selectedLang = LANGS.find((l) => l.key === i18n.language)!;
  return (
    <div className="w-full h-full relative" ref={pickerRef}>
      <button onClick={() => setIsOpen((p) => !p)} className="border-primary border-r w-full h-full">
        {selectedLang.name}
      </button>

      {isOpen && (
        <ul className="grid gap-2 absolute w-full">
          {LANGS.filter((l) => l.key !== selectedLang.key).map((lang) => (
            <li key={lang.key} className='h-12 bg-primary w-full border-primary border-r border-y grid place-items-center'>
              <button className='w-full' onClick={() => handleChangeLang(lang.key)}>{lang.name}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { LanguagePicker };
