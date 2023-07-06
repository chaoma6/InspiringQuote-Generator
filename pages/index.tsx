import { GradientBackgroundCon } from '@/components/QuoteGenerator/QuoteGeneratorElements';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Inspirational Quote Generator</title>
        <meta name='description' content='Inspirational Quote Generator' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {/* {Background} */}

      <GradientBackgroundCon></GradientBackgroundCon>
    </>
  );
}
