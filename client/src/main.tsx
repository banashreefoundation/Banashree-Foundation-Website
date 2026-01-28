import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Routes from './components/routes.tsx'
import { loadImageCache } from './utils/imageApi'

function App() {
  const [cacheLoaded, setCacheLoaded] = useState(false);

  useEffect(() => {
    loadImageCache()
      .then(() => {
        console.log('✅ Image cache loaded, rendering app');
        setCacheLoaded(true);
      })
      .catch((error) => {
        console.error('❌ Failed to load image cache:', error);
        // Still render the app even if cache loading fails
        setCacheLoaded(true);
      });
  }, []);

  if (!cacheLoaded) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return <Routes />;
}

createRoot(document.getElementById('root')!).render(
  // Temporarily disabled StrictMode for testing - re-enable for production
  <StrictMode>
    <App />
   </StrictMode>
)
