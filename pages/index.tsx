import React, { useEffect, useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';

// compnents
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
import QuoteGeneratorModal from '@/components/QuoteGenerator';

// Assets
import Clouds1 from '../assets/cloud-and-thunder.png';
import Clouds2 from '../assets/cloudy-weather.png';
import { API } from 'aws-amplify';
import { generateAQuote, quotesQueryName } from '@/src/graphql/queries';
import { GraphQLResult } from '@aws-amplify/api-graphql';

// interface for our appsync <> lambda function
interface GenerateAQuoteData {
  generateAQuote: {
    statusCode: number;
    headers: { [key: string]: string };
    body: string;
  };
}

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
  const [openGenerator, setOpenGenerator] = useState(false);
  const [processingQuote, setProcessingQuote] = useState(false);
  const [quoteReceived, setQuoteReceived] = useState<String | null>(null);

  // Function to fetch our DynamoDb object (quotes gennerated)
  const updateQuoteInfo = async () => {
    try {
      const response = await API.graphql<UpdateQuoteInfoData>({
        query: quotesQueryName,
        authMode: 'AWS_IAM',
        variables: {
          queryName: 'LIVE',
        },
      });

      // Create type guards
      if (!isGraphQLResultForquotesQueryName(response)) {
        throw new Error('Unexpected response from API.graphql');
      }

      if (!response.data) {
        throw new Error('Response data is undefined');
      }

      const receivedNumberOfQuotes =
        response.data.quotesQueryName.items[0].quotesGenerated;
      setNumberOfQuotes(receivedNumberOfQuotes);
    } catch (error) {
      console.log('error getting quote data', error);
    }
  };

  useEffect(() => {
    updateQuoteInfo();
  }, []);

  // Functions for quote generator modal
  const handleCloseGenerator = () => {
    setOpenGenerator(false);
    setProcessingQuote(false);
    setQuoteReceived(null);
  };

  const handleOpenGenerator = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setOpenGenerator(true);
    setProcessingQuote(true);
    try {
      //Run Lambda Function
      const runFunction = 'runFunction';
      const runFunctionStringified = JSON.stringify(runFunction);
      const response = await API.graphql<GenerateAQuoteData>({
        query: generateAQuote,
        authMode: 'AWS_IAM',
        variables: {
          input: runFunctionStringified,
        },
      });
      const responseStringified = JSON.stringify(response);
      const responseReStringified = JSON.stringify(responseStringified);
      const bodyIndex = responseReStringified.indexOf('body=') + 5;
      const bodyAndBase64 = responseReStringified.substring(bodyIndex);
      const bodyArray = bodyAndBase64.split(',');
      const body = bodyArray[0];
      console.log(body);
      setQuoteReceived(body);

      // End state:
      setProcessingQuote(false);

      // Fetch if any new quotes were generated from counter
      updateQuoteInfo();
    } catch (error) {
      console.log('error generating quote:', error);
      setProcessingQuote(false);
    }
  };

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
        {/* Quote Generator Modal Pop-Up */}
        <QuoteGeneratorModal
          open={openGenerator}
          close={handleCloseGenerator}
          processingQuote={processingQuote}
          setProcessingQuote={setProcessingQuote}
          quoteReceived={quoteReceived}
          setQuoteReceived={setQuoteReceived}
        />

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
