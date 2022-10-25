import { useTranslation } from 'next-i18next';
import Head from 'next/head';

interface Props {
  titleKey?: string;
}

const Seo = ({ titleKey }: Props) => {
  const { t } = useTranslation('common', { keyPrefix: 'pages' });

  const title = titleKey ? t(`${titleKey}`) + ' | Yata' : 'Yata';
  const description = 'Yet another timer app'
  const url = typeof window !== 'undefined' ? window.location.origin : ''
  const ogImage = url +  '/app_image.png';
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <link rel="icon" href="/favicon/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />

      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />

      <meta property="og:image" content={ogImage} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:image" content={ogImage} />

      <meta property="og:url" content={url} />
      <meta property="twitter:url" content={url} />

      <meta property="og:type" content="website" />
    </Head>
  );
};

export { Seo };
