import { ChakraProvider } from '@chakra-ui/react'
import HashConnectProvider from "../HashConnectAPIProvider"

import theme from '../theme'
import { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <HashConnectProvider debug>
        <Component {...pageProps} />
      </HashConnectProvider>
    </ChakraProvider>
  )
}

export default MyApp
