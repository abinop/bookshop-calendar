import '../styles/globals.css';
import { EventProvider } from '../contexts/EventContext';

function MyApp({ Component, pageProps }) {
  return (
    <EventProvider>
      <Component {...pageProps} />
    </EventProvider>
  );
}

export default MyApp; 