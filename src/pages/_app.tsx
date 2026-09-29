import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Lottery Sambad Result Today - Live 1:00 PM, 6:00 PM, 8:00 PM Results</title>
        <meta name="description" content="Check official Lottery Sambad today results for Nagaland State Lotteries, Sikkim State Lotteries (1 PM, 6 PM, 8 PM). Fast ticket checker and live result updates." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏆</text></svg>" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
