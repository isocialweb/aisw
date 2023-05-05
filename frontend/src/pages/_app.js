import '@/styles/globals.css'
import withAuth from '../components/withAuth';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Aquí definimos las rutas que no requieren autenticación
  const isUnprotectedRoute = router.pathname === '/' || router.pathname === '/login';

  // Envuelve el componente con withAuth si no estamos en una ruta desprotegida
  const ComponentWithAuth = isUnprotectedRoute ? Component : withAuth(Component);

  return <ComponentWithAuth {...pageProps} />;
}

export default MyApp;

