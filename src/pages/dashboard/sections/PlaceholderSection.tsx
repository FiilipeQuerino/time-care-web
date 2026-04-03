interface PlaceholderSectionProps {
  title: string;
}

export const PlaceholderSection = ({ title }: PlaceholderSectionProps) => (
  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-500">Tela basica pronta para evoluir com as proximas integracoes.</p>
  </div>
);
