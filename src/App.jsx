import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import AppRouter from './router/AppRouter';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRouter />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
