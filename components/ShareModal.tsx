
import React, { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Share2 size={24} className="text-pink-500" /> Compartilhar Agenda
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all">
              <X size={24} />
            </button>
          </div>
          
          <p className="text-slate-500 font-medium mb-6">
            Envie este link para suas clientes visualizarem seus horários disponíveis (apenas modo leitura).
          </p>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4 mb-4">
            <input 
              readOnly 
              value={shareUrl} 
              className="bg-transparent border-none outline-none text-slate-600 font-mono text-sm flex-1 truncate"
            />
            <button 
              onClick={handleCopy}
              className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-pink-500 text-white hover:bg-pink-600'}`}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
          
          {copied && (
            <p className="text-emerald-500 text-xs font-bold text-center animate-pulse">Link copiado com sucesso!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
