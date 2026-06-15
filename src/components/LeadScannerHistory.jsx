import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Download, Eye, Play, MoreHorizontal, FileSpreadsheet, Trash2, Eraser, Loader2 } from 'lucide-react';

export default function LeadScannerHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      const json = await res.json();
      setHistory(json.data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este histórico?')) {
      try {
        await fetch(`/api/history/${encodeURIComponent(id)}`, { method: 'DELETE' });
        setHistory(history.filter(h => h.id !== id));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleClearAll = async () => {
    if (history.length === 0) return;
    if (window.confirm('Atenção: Isso vai apagar TODO o seu histórico de análises permanentemente. Tem certeza?')) {
      try {
        await fetch(`/api/history`, { method: 'DELETE' });
        setHistory([]);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleExportCSV = () => {
    if (history.length === 0) return alert('Nenhum histórico para exportar.');
    
    const headers = ['ID', 'Arquivo Original', 'Data', 'Hora', 'Total Analisado', 'Leads Aprovados', 'Taxa', 'Status'];
    const csvContent = [
      headers.join(';'),
      ...history.map(h => [
        `"=""${String(h.id).replace(/"/g, '""')}"""`,
        `"${String(h.name).replace(/"/g, '""')}"`,
        `"${String(h.date).replace(/"/g, '""')}"`,
        `"${String(h.time).replace(/"/g, '""')}"`,
        `"=""${String(h.total).replace(/"/g, '""')}"""`,
        `"=""${String(h.approved).replace(/"/g, '""')}"""`,
        `"${String(h.rate).replace(/"/g, '""')}"`,
        `"${String(h.status).replace(/"/g, '""')}"`
      ].join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `historico_sdr_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHistory = history.filter(h => 
    !searchTerm || h.name.toLowerCase().includes(searchTerm.toLowerCase()) || h.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in text-white space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">Histórico de Análises <History size={20} className="text-gray-500" /></h1>
          <p className="text-sm text-gray-400">Acompanhe todas as planilhas e buscas processadas pela Inteligência Artificial.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleClearAll} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors">
            <Eraser size={16} /> Limpar Histórico
          </button>
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-[#121216] border border-white/5 hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">
            <Download size={16} /> Exportar Relatório
          </button>
        </div>
      </div>

      <div className="bg-[#121216] border border-white/5 rounded-2xl overflow-hidden flex flex-col min-h-[600px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar arquivo ou ID..." 
                className="pl-9 pr-4 py-2 bg-[#121216] border border-white/10 rounded-lg text-xs focus:outline-none focus:border-purple-500/50 w-64 text-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            Mostrando <span className="text-white font-bold">{filteredHistory.length}</span> análises
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 border-b border-white/5">
              <tr className="text-gray-400">
                <th className="py-4 px-6 font-medium w-24">ID</th>
                <th className="py-4 px-4 font-medium">Nome / Arquivo</th>
                <th className="py-4 px-4 font-medium">Data e Hora</th>
                <th className="py-4 px-4 font-medium text-center">Total Analisado</th>
                <th className="py-4 px-4 font-medium text-center">Leads Aprovados</th>
                <th className="py-4 px-4 font-medium text-center">Taxa de Aprovação</th>
                <th className="py-4 px-4 font-medium text-center">Status</th>
                <th className="py-4 px-6 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500 font-medium"><Loader2 className="animate-spin mx-auto mb-2" size={24} /> Carregando histórico...</td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500 font-medium">Nenhum histórico encontrado.</td>
                </tr>
              ) : filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-6 text-gray-500 font-mono text-xs">{item.id}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 font-medium text-white">
                      {item.name.includes('Busca:') ? <Search size={16} className="text-blue-400" /> : <FileSpreadsheet size={16} className={item.name.includes('.csv') ? 'text-emerald-400' : 'text-emerald-500'} />}
                      <span className="truncate max-w-[200px]" title={item.name}>{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white">{item.date}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">{item.total}</td>
                  <td className={`py-4 px-4 text-center font-bold ${item.approved > 0 ? 'text-emerald-400' : 'text-gray-500'}`}>
                    {item.approved}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold border bg-purple-500/10 text-purple-400 border-purple-500/20">
                      {item.rate}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Concluído' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Concluído' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20" title="Excluir">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
