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
import { API } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import { quotesQueryName } from '@/src/graphql/queries';

// interface for DynamoDb object
interface UpdateQuoteInfoData {
  id: string;
  queryName: String;
  quotesGenerated: number;
  createdAt: String;
  updatedAt: String;
}

// type guard for our fetch function
function isGraphQLResultForquotesQueryName(
  response: any
): response is GraphQLResult<{
  quotesQueryName: {
    items: [UpdateQuoteInfoData];
  };
}> {
  return (
    response.data &&
    response.data.quotesQueryName &&
    response.data.quotesQueryName.items
  );
}

export default function Home() {
  const [numberOfQuotes, setNumberOfQuotes] = useState<Number | null>(0);

  // Function to fetch our DynamoDb object (quotes gennerated)
  const updateQuoteInfo = async () => {
    try {
      const response = await API.graphql<UpdateQuoteInfoData>({
        query: quotesQueryName,
        authMode: 'AWS_IAM',
        variables: { queryName: 'LIVE' },
      });

      if (!isGraphQLResultForquotesQueryName(response)) {
        throw new Error('Unexpected response from API.graphql');
      }

      if (!response.data) {
        throw new Error('Response data is undefined');
      }

      const receivednumberOfQuotes =
        response.data.quotesQueryName.items[0].quotesGenerated;
      setNumberOfQuotes(receivednumberOfQuotes);
    } catch (error) {
      console.log('error getting quote data', error);
    }
  };

  useEffect(() => {
    updateQuoteInfo();
  }, []);

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

            <GenerateQuoteButton>
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
