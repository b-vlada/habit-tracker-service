import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Habits } from './pages/Habits';
import { Goals } from './pages/Goals';
import { Statistics } from './pages/Statistics';

function App() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5EB] flex items-center justify-center">
        <div className="text-neutral-gray">Загрузка...</div>
      </div>
    );
  }

  if (!userName) {
    return <Login />;
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5EB]">
      <Sidebar />
      
      <main className="flex-1 px-4 pt-6 pb-56 lg:pb-8 lg:ml-64 lg:pt-8 w-full max-w-5xl mx-auto overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home userName={userName} />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/stats" element={<Statistics />} />
        </Routes>
        
        <div className="h-32 lg:hidden"></div>
      </main>

      <BottomNav />
    </div>
  );
}

export default App;