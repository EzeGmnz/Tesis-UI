import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import '../styles/globals.scss';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={darkTheme}>
            <SWRConfig>
                <Component {...pageProps} />
            </SWRConfig>
        </ThemeProvider>
    );
}

export default MyApp;
