import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

type Screen = 'login' | 'dashboard';

export default function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');

  return (
    <div style={{ height: '100%' }}>
      {screen === 'login' && (
        <Login onLogin={() => setScreen('dashboard')} />
      )}
      {screen === 'dashboard' && (
        <Dashboard onLogout={() => setScreen('login')} />
      )}
    </div>
  );
}
