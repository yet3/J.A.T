import { useTranslation } from 'next-i18next';
import Head from 'next/head';

interface Props {
  titleKey?: string;
}

const Seo = ({ titleKey }: Props) => {
  const { t } = useTranslation('common', {keyPrefix: 'pages'});

  return (
    <Head>
      <title>{titleKey ? t(`${titleKey}`) + ' | Yata' : 'Yata'}</title>
      <meta name='description' content='Yet another timer app' />
      <link rel='icon' href='/favicon.ico' />
    </Head>
  );
};

export { Seo };
