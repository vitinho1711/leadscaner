import React, { useState, useEffect } from 'react';
import SdrSystem from './components/SdrSystem';
import Menu from './components/Menu';
import LandingPage from './landing/LandingPage';
import PromoVideoSimulation from './components/PromoVideoSimulation';
import PublicPreview from './components/SiteBuilder/PublicPreview';
import { Lock, ArrowRight, ShieldCheck, User, Clock, AlertCircle, Gift } from 'lucide-react';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [planInfo, setPlanInfo] = useState(null);
  const [route, setRoute] = useState(window.location.pathname);
  const [inviteCodeFromUrl, setInviteCodeFromUrl] = useState('');

  // Detecta se há código de convite na URL (?invite=LEAD-... ou ?code=LEAD-...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('invite') || params.get('code') || '';
    if (code) {
      const cleanCode = code.trim().toUpperCase();
      setAccessCode(cleanCode);
      setLoginMode('code');
      setInviteCodeFromUrl(cleanCode);
    }
  }, []);

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
      try {
        setUser(JSON.parse(savedUser.startsWith('{') ? savedUser : atob(savedUser)));
      } catch(e) {}
    }

    const handleStorage = () => {
      const updatedUser = localStorage.getItem('sdr_user');
      if (updatedUser) {
        try {
          setUser(JSON.parse(updatedUser.startsWith('{') ? updatedUser : atob(updatedUser)));
        } catch(e) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
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

  const [loginMode, setLoginMode] = useState('code'); // 'code' | 'credentials'

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const cleanCode = accessCode.trim().toUpperCase();
      let res;
      let data;

      if (loginMode === 'code') {
        // Tenta primeiro o login direto com o código de acesso
        res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessCode: cleanCode })
        });
        data = await res.json();

        // Se o backend retornou código inválido e é um código LEAD-, tenta registrar o convite automaticamente!
        if (!data.success && cleanCode.startsWith('LEAD-')) {
          const autoUsername = `user_${cleanCode.replace(/[^A-Z0-9]/g, '').slice(-4).toLowerCase()}`;
          const regRes = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: autoUsername,
              password: '123',
              inviteCode: cleanCode
            })
          });
          const regData = await regRes.json();
          if (regData.success) {
            data = regData;
          } else {
            // Se o usuário já existia com essa credencial padrão, tenta logar
            const loginRetry = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: autoUsername, password: '123' })
            });
            const retryData = await loginRetry.json();
            if (retryData.success) {
              data = retryData;
            }
          }
        }
      } else {
        res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        data = await res.json();
      }

      if (data && data.success) {
        localStorage.setItem('sdr_jwt_token', data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('sdr_user', btoa(JSON.stringify(data.user)));
        setUser(data.user);
        setIsAuthenticated(true);
        setError('');
        if (window.location.search) {
          window.history.replaceState({}, '', window.location.pathname);
        }
      } else {
        setError(data?.error || 'Erro ao fazer login. Verifique o código de convite.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sdr_jwt_token');
    localStorage.removeItem('token');
    localStorage.removeItem('sdr_user');
    setIsAuthenticated(false);
    setUser(null);
    setPlanInfo(null);
  };

  if (isMenuPath) {
    return <Menu />;
  }

  if (route === '/promo') {
    return <PromoVideoSimulation />;
  }

  if (route.startsWith('/preview/')) {
    return <PublicPreview />;
  }

  // Verifica se veio com convite ou rota explícita de autenticação
  const hasInvite = !!inviteCodeFromUrl || !!new URLSearchParams(window.location.search).get('invite') || !!new URLSearchParams(window.location.search).get('code');
  const isAuthRoute = route === '/login' || route === '/register' || route === '/entrar' || hasInvite;

  if (!isAuthenticated && route === '/' && !isAuthRoute) {
    return <LandingPage onGoToLogin={() => setRoute('/login')} />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4">
        <div className="w-full max-w-md p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Lock size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Lead Scanner AI</h2>
          <p className="text-gray-400 text-center mb-6 text-sm">
            {hasInvite ? 'Ative seu acesso ao sistema com seu código de convite' : 'Acesse o sistema com suas credenciais ou código'}
          </p>

          {hasInvite && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/40 rounded-xl flex items-center gap-3 animate-fade-in shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <div className="p-2 bg-purple-600/30 rounded-lg text-fuchsia-400">
                <Gift size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  Convite VIP Detectado!
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">7 Dias Grátis</span>
                </p>
                <p className="text-[11px] text-purple-200 mt-0.5">
                  Código <span className="font-mono text-fuchsia-300 font-bold tracking-wider">{accessCode}</span> pronto para ativação. Clique abaixo para entrar!
                </p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex p-1 bg-black/40 rounded-xl mb-6 border border-white/5">
            <button
              type="button"
              onClick={() => { setLoginMode('code'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                loginMode === 'code'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Código de Acesso
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode('credentials'); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                loginMode === 'credentials'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Usuário e Senha
            </button>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {loginMode === 'code' ? (
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Ex: ADMIN-MASTER"
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-600 font-mono text-sm uppercase"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Usuário (ex: admin)"
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-600 text-sm"
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
                      placeholder="Sua senha"
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-600 text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-xs text-center font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] flex items-center justify-center gap-2 mt-4 text-sm"
            >
              Entrar no Sistema <ArrowRight size={18} />
            </button>
          </form>

          <div className="text-center mt-5">
            <button
              type="button"
              onClick={() => {
                setRoute('/');
                setInviteCodeFromUrl('');
                window.history.pushState({}, '', '/');
              }}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              ← Voltar para a página inicial
            </button>
          </div>
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
          <span className="text-sm font-semibold text-green-400">
            Acesso Seguro
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
        <SdrSystem userRole={user?.role} userTier={user?.tier} planInfo={planInfo} handleLogout={handleLogout} />
      </main>
    </div>
  );
}

export default App;
