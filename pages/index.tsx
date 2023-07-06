import {
  GradientBackgroundCon,
  BackgroundImage1,
  BackgroundImage2,
  FooterLink,
  FooterContainer,
  QuoteGeneratorContainer,
  QuoteGeneratorSubTitle,
  QuoteGeneratorTitle,
  GenerateQuoteButton,
  GenerateQuoteButtonText,
  QuoteGenneratorInnerContainer,
} from '@/components/QuoteGenerator/QuoteGeneratorElements';
import Head from 'next/head';
import Clouds1 from '@/assets/cloud-and-thunder.png';
import Clouds2 from '@/assets/cloudy-weather.png';
import React, { useState } from 'react';

export default function Home() {
  const [numberOfQuotes, setNumberOfQuotes] = useState<Number | null>(0);

  return (
    <>
      <Head>
        <title>Inspirational Quote Generator</title>
        <meta name='description' content='Inspirational Quote Generator' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {/* {Background} */}
      <GradientBackgroundCon>
        {/* Quote Generator Modal Pop=Up */}
        {/* QuoteGeneratorModal */}
        {/* Quote Generator */}
        <QuoteGeneratorContainer>
          <QuoteGenneratorInnerContainer>
            <QuoteGeneratorTitle>
              Daily Inspirational Generator
            </QuoteGeneratorTitle>

            <QuoteGeneratorSubTitle>
              Looking for a splash of inspiration? Generate a quote card with a
              random inspirational quote provided by{' '}
              <FooterLink
                href='https://zenquotes.io/'
                target='_blank'
                rel='noopener noreferrer'
              >
                ZenQuotes API
              </FooterLink>
              .
            </QuoteGeneratorSubTitle>

            <GenerateQuoteButton onClick={handleOpenGenerator}>
              <GenerateQuoteButtonText>Make a Quote</GenerateQuoteButtonText>
            </GenerateQuoteButton>
          </QuoteGenneratorInnerContainer>
        </QuoteGeneratorContainer>

        {/* Background Images */}
        <BackgroundImage1 src={Clouds1} height='300' alt='cloudybackground1' />
        <BackgroundImage2 src={Clouds2} height='300' alt='cloudybackground2' />

        <FooterContainer>
          <>
            Quotes Generated:{numberOfQuotes}
            <br />
            Developed with 💖 by{' '}
            <FooterLink
              href='https://maxchaoma.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              @MaxMa
            </FooterLink>
          </>
        </FooterContainer>
      </GradientBackgroundCon>
    </>
  );
}
