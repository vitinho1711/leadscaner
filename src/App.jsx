import React, { useState, useEffect } from 'react';
import SdrSystem from './components/SdrSystem';
import Menu from './components/Menu';
import { Lock, ArrowRight, ShieldCheck, User, Clock, AlertCircle, Gift } from 'lucide-react';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [planInfo, setPlanInfo] = useState(null);
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const isMenuPath = route === '/menu' || route === '/cardapio';

  useEffect(() => {
    const token = localStorage.getItem('sdr_jwt_token');
    const savedUser = localStorage.getItem('sdr_user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }

    // Parse ?invite=CODE from URL
    const params = new URLSearchParams(window.location.search);
    const invite = params.get('invite');
    if (invite) {
      setInviteCode(invite);
      setIsRegistering(true);
    }
  }, []);

  // Fetch plan info after login
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchPlan = async () => {
      try {
        const token = localStorage.getItem('sdr_jwt_token');
        const res = await fetch('/api/plan', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPlanInfo(data);
        }
      } catch (e) {
        console.error('Erro ao buscar plano:', e);
      }
    };
    fetchPlan();
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const body = isRegistering
        ? { username, password, inviteCode }
        : { username, password };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('sdr_jwt_token', data.token);
        localStorage.setItem('sdr_user', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        setError('');
        // Clean invite param from URL
        if (window.location.search.includes('invite')) {
          window.history.replaceState({}, '', window.location.pathname);
        }
      } else {
        setError(data.error || (isRegistering ? 'Erro ao criar conta' : 'Erro ao fazer login'));
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sdr_jwt_token');
    localStorage.removeItem('sdr_user');
    setIsAuthenticated(false);
    setUser(null);
    setPlanInfo(null);
  };

  if (isMenuPath) {
    return <Menu />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="w-full max-w-md p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center">
              <Lock size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">{isRegistering ? 'Criar Conta' : 'Acesso Restrito'}</h2>
          <p className="text-gray-400 text-center mb-8 text-sm">
            {isRegistering ? 'Crie sua conta para acessar o SDR.' : 'Faça login com sua conta corporativa para acessar o SDR.'}
          </p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nome de Usuário"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>
            {isRegistering && (
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Gift size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Código de Convite"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-600"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5 ml-1">Insira o código de convite recebido para criar sua conta trial.</p>
              </div>
            )}
            {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] flex items-center justify-center gap-2 mt-4"
            >
              {isRegistering ? 'Criar Conta' : 'Entrar no Sistema'} <ArrowRight size={18} />
            </button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
                className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem conta? Criar uma'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Trial Expired Overlay */}
      {planInfo && planInfo.isExpired && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center">
          <div className="text-center p-8 bg-white/5 border border-white/10 rounded-2xl max-w-md">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Período de Teste Expirado</h2>
            <p className="text-gray-400 mb-6">Seu acesso trial de {planInfo.trialDays || 7} dias terminou. Entre em contato para continuar usando o Lead Scanner.</p>
            <button onClick={handleLogout} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition-colors">
              Sair
            </button>
          </div>
        </div>
      )}

      <header className="h-14 bg-black/80 border-b border-white/10 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-green-400" />
          <span className="text-sm font-semibold text-gray-200">
            Acesso: <span className="text-blue-400">{user?.username}</span> {user?.role === 'admin' ? '(Admin)' : ''}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {planInfo && !planInfo.isAdmin && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Clock size={14} className="text-amber-400" />
              <span className="text-xs font-semibold text-amber-400">
                Trial · {planInfo.daysLeft} {planInfo.daysLeft === 1 ? 'dia' : 'dias'}
              </span>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border border-transparent hover:border-red-500/20"
          >
            Sair da Conta
          </button>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden relative">
        <SdrSystem userRole={user?.role} planInfo={planInfo} />
      </main>
    </div>
  );
}

export default App;
