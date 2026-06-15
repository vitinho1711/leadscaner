import React, { useState, useEffect } from 'react';
import { Copy, Trash2, Plus, Users, Clock, Link, Gift, Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function LeadScannerInvites() {
  const [invites, setInvites] = useState([]);
  const [testers, setTesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [form, setForm] = useState({
    trialDays: 7,
    maxLeads: 50,
    maxMessagesPerDay: 20,
    maxScrapesPerDay: 3,
    expiresInHours: 72
  });

  const token = localStorage.getItem('sdr_jwt_token');

  const fetchInvites = async () => {
    try {
      const res = await fetch('/api/invites', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      setInvites(json.data || []);
    } catch (e) {
      console.error('Erro ao buscar convites:', e);
    }
  };

  const fetchTesters = async () => {
    try {
      const res = await fetch('/api/admin/testers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      setTesters(json.data || []);
    } catch (e) {
      console.error('Erro ao buscar testers:', e);
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchInvites(), fetchTesters()]);
      setLoading(false);
    };
    load();
  }, []);

  const handleGenerate = async () => {
    try {
      const res = await fetch('/api/invite/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchInvites();
        setForm({ trialDays: 7, maxLeads: 50, maxMessagesPerDay: 20, maxScrapesPerDay: 3, expiresInHours: 72 });
      }
    } catch (e) {
      console.error('Erro ao gerar convite:', e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este convite?')) return;
    try {
      await fetch(`/api/invites/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchInvites();
    } catch (e) {
      console.error('Erro ao excluir convite:', e);
    }
  };

  const handleCopyLink = (code) => {
    const link = `${window.location.origin}?invite=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusInfo = (invite) => {
    if (invite.usedBy) return { label: 'Usado', color: 'blue', icon: '🔵', detail: invite.usedBy };
    const now = new Date();
    const expires = new Date(invite.expiresAt);
    if (expires < now) return { label: 'Expirado', color: 'red', icon: '🔴', detail: null };
    return { label: 'Ativo', color: 'green', icon: '🟢', detail: null };
  };

  const stats = {
    total: invites.length,
    ativos: invites.filter(i => !i.usedBy && new Date(i.expiresAt) > new Date()).length,
    usados: invites.filter(i => i.usedBy).length,
    expirados: invites.filter(i => !i.usedBy && new Date(i.expiresAt) <= new Date()).length
  };

  return (
    <div className="animate-fade-in text-white space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            Gerenciar Convites <Gift size={20} className="text-purple-400" />
          </h1>
          <p className="text-sm text-gray-400">Crie e gerencie códigos de convite para novos usuários trial.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]"
        >
          <Plus size={16} /> Gerar Convite
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#121216] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Gift size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Convites</p>
              <h3 className="text-2xl font-bold mt-0.5">{loading ? '-' : stats.total}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#121216] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Ativos</p>
              <h3 className="text-2xl font-bold mt-0.5">{loading ? '-' : stats.ativos}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#121216] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Usados</p>
              <h3 className="text-2xl font-bold mt-0.5">{loading ? '-' : stats.usados}</h3>
            </div>
          </div>
        </div>

        <div className="bg-[#121216] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <XCircle size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Expirados</p>
              <h3 className="text-2xl font-bold mt-0.5">{loading ? '-' : stats.expirados}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Cards */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Link size={18} className="text-blue-400" /> Códigos de Convite
        </h3>

        {loading && <p className="text-gray-500 text-sm">Carregando...</p>}

        {!loading && invites.length === 0 && (
          <div className="bg-[#121216] border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <Gift size={48} className="text-gray-600 mb-4" />
            <p className="text-gray-500">Nenhum convite gerado ainda.</p>
            <p className="text-xs text-gray-600 mt-1">Clique em "Gerar Convite" para criar o primeiro.</p>
          </div>
        )}

        <AnimatePresence>
          {invites.map((invite) => {
            const status = getStatusInfo(invite);
            return (
              <motion.div
                key={invite._id || invite.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#121216] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    {/* Code */}
                    <div className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg">
                      <code className="text-lg font-bold text-purple-400 tracking-wider" style={{ fontFamily: 'monospace' }}>
                        {invite.code}
                      </code>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      status.color === 'green'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : status.color === 'blue'
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {status.icon} {status.label}
                      {status.detail && <span className="ml-1 text-gray-400">({status.detail})</span>}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(invite.code)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                        copiedId === invite.code
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <Copy size={12} />
                      {copiedId === invite.code ? 'Copiado!' : 'Copiar Link'}
                    </button>
                    <button
                      onClick={() => handleDelete(invite._id)}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Details Row */}
                <div className="flex items-center gap-6 mt-4 text-xs text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> Trial: {invite.trialDays || 7} dias
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={12} /> Máx leads: {invite.maxLeads || 50}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield size={12} /> Msgs/dia: {invite.maxMessagesPerDay || 20}
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertCircle size={12} /> Buscas/dia: {invite.maxScrapesPerDay || 3}
                  </span>
                  {invite.createdAt && (
                    <span className="flex items-center gap-1 ml-auto">
                      Criado em: {new Date(invite.createdAt).toLocaleDateString('pt-BR')} às {new Date(invite.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Active Testers Section */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Users size={18} className="text-emerald-400" /> Testers Ativos
        </h3>

        {testers.length === 0 && !loading && (
          <div className="bg-[#121216] border border-white/5 rounded-xl p-8 text-center">
            <Users size={32} className="text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Nenhum tester ativo no momento.</p>
          </div>
        )}

        {testers.length > 0 && (
          <div className="bg-[#121216] border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-black/20 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Dias Restantes</th>
                  <th className="px-6 py-4">Leads Usados</th>
                  <th className="px-6 py-4">Msgs Hoje</th>
                  <th className="px-6 py-4">Buscas Hoje</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {testers.map((tester, i) => (
                  <tr key={tester.username || i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{tester.username}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${tester.daysLeft <= 2 ? 'text-red-400' : tester.daysLeft <= 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {tester.daysLeft} dias
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {tester.usage?.leadsCount || 0} / {tester.limits?.maxLeads || 50}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {tester.usage?.messagesToday || 0} / {tester.limits?.maxMessagesPerDay || 20}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {tester.usage?.scrapesToday || 0} / {tester.limits?.maxScrapesPerDay || 3}
                    </td>
                    <td className="px-6 py-4">
                      {tester.isExpired ? (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold border border-red-500/20">Expirado</span>
                      ) : (
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-bold border border-emerald-500/20">Ativo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#121212] border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>

              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <Gift size={20} className="text-purple-400" /> Gerar Novo Convite
              </h2>
              <p className="text-sm text-gray-400 mb-6">Configure os limites do período trial para este convite.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Dias de Trial</label>
                  <input
                    type="number"
                    value={form.trialDays}
                    onChange={(e) => setForm({ ...form, trialDays: Math.min(30, Math.max(1, +e.target.value)) })}
                    min={1}
                    max={30}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <p className="text-[10px] text-gray-600 mt-1">Mínimo 1, máximo 30 dias</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Máximo de Leads</label>
                    <input
                      type="number"
                      value={form.maxLeads}
                      onChange={(e) => setForm({ ...form, maxLeads: Math.min(500, Math.max(10, +e.target.value)) })}
                      min={10}
                      max={500}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Mensagens por Dia</label>
                    <input
                      type="number"
                      value={form.maxMessagesPerDay}
                      onChange={(e) => setForm({ ...form, maxMessagesPerDay: Math.min(100, Math.max(5, +e.target.value)) })}
                      min={5}
                      max={100}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Buscas por Dia</label>
                    <input
                      type="number"
                      value={form.maxScrapesPerDay}
                      onChange={(e) => setForm({ ...form, maxScrapesPerDay: Math.min(20, Math.max(1, +e.target.value)) })}
                      min={1}
                      max={20}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Validade do Código (horas)</label>
                    <input
                      type="number"
                      value={form.expiresInHours}
                      onChange={(e) => setForm({ ...form, expiresInHours: Math.min(720, Math.max(1, +e.target.value)) })}
                      min={1}
                      max={720}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl text-sm font-bold text-white transition-all shadow-[0_0_15px_rgba(124,58,237,0.5)] flex items-center justify-center gap-2"
                >
                  <Gift size={16} /> Gerar Convite
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
