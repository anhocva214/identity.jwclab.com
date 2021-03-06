import Head from 'next/head'
import { Provider } from 'react-redux'
import store from '../Store/Store'
import Alert from 'react-s-alert';
import { PopupboxContainer } from 'react-popupbox';

// mandatory
import 'react-s-alert/dist/s-alert-default.css';

// optional - you can choose the effect you want
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

import "react-popupbox/dist/react-popupbox.css"

const MyApp = ({ Component, pageProps }) => {
    return (
        <>
            <Alert stack={{ limit: 3 }} />
            <PopupboxContainer/>
            <Head>
                <title>JWCLab</title>
                {/* Required meta tags */}
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.1/css/all.css" integrity="sha384-O8whS3fhG2OnA5Kas0Y9l3cfpmYjapjI0E4theH4iuMD+pLhbf6JI0jIMfYcK3yZ" crossOrigin="anonymous" />
                <link rel="stylesheet" href="css/main.css" />
                <link rel="stylesheet" href="css/main_login.css" />

                {/* Bootstrap CSS */}
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous" />

                <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
            </Head>
            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
            <style jsx global>{`
                .s-alert-box{
                    z-index: 99999;
                }
            `}</style>
        </>
    )
}


export default MyApp