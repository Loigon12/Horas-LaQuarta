import { useState, useEffect } from 'react';
import logo from './logo.jpg';

const RATES = { ejecutiva: 17000, gestion: 12000 };

const formatCOP = (val) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(val);

export default function App() {
  // Estado de los registros cargado desde localStorage
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('work_hours_data');
    return saved ? JSON.parse(saved) : [];
  });

  // Estado del formulario
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'ejecutiva',
    hours: '',
    desc: '',
  });

  // Guardar en localStorage cuando cambie el historial
  useEffect(() => {
    localStorage.setItem('work_hours_data', JSON.stringify(logs));
  }, [logs]);

  // Cálculos derivados del estado
  const execHours = logs
    .filter((item) => item.type === 'ejecutiva')
    .reduce((acc, item) => acc + item.hours, 0);

  const gestHours = logs
    .filter((item) => item.type === 'gestion')
    .reduce((acc, item) => acc + item.hours, 0);

  const subExec = execHours * RATES.ejecutiva;
  const subGest = gestHours * RATES.gestion;
  const totalCOP = subExec + subGest;

  // Manejadores de eventos
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.hours || parseFloat(formData.hours) <= 0) return;

    const newEntry = {
      date: formData.date,
      type: formData.type,
      hours: parseFloat(formData.hours),
      desc: formData.desc.trim(),
    };

    setLogs([newEntry, ...logs]);

    // Resetear campos de horas y descripción
    setFormData((prev) => ({
      ...prev,
      hours: '',
      desc: '',
    }));
  };

  const handleDelete = (index) => {
    setLogs(logs.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    if (confirm('¿Seguro que deseas eliminar todos los registros?')) {
      setLogs([]);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header & Totales */}
      <header className="space-y-6">
        <div className="flex items-center justify-between border-b border-theme pb-5">
          <div className="flex items-center space-x-4">
            <img
              src={logo}
              alt="Logo de la Página"
              className="w-12 h-12 rounded-full border-2 border-theme object-cover"
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-theme accent-text-cream">
                CONTROL DE HORAS
              </h1>
              <p className="text-xs text-theme-muted mt-1">Registro diario acumulativo</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase tracking-wider text-theme-muted font-semibold">
              Total acumulado
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-theme accent-text-cream font-mono tracking-tight">
              {formatCOP(totalCOP)}
            </div>
          </div>
        </div>

        {/* Métricas por categoría */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-theme-muted border border-theme-muted">
            <div className="flex items-center justify-between text-xs text-theme-muted mb-2">
              <span className="font-medium text-theme">Ejecutiva</span>
              <span className="text-theme-muted">$ 17.000 / h</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-semibold font-mono text-theme accent-text-cream">
                {execHours} hrs
              </span>
              <span className="text-sm font-mono text-theme-muted accent-text-cream">
                {formatCOP(subExec)}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-theme-muted border border-theme-muted">
            <div className="flex items-center justify-between text-xs text-theme-muted mb-2">
              <span className="font-medium text-theme">Gestión</span>
              <span className="text-theme-muted">$ 12.000 / h</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-semibold font-mono text-theme accent-text-cream">
                {gestHours} hrs
              </span>
              <span className="text-sm font-mono text-theme-muted accent-text-cream">
                {formatCOP(subGest)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Formulario de ingreso */}
      <section className="bg-theme-muted border border-theme-muted rounded-2xl p-5 shadow-2xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          {/* Fecha */}
          <div className="sm:col-span-3 space-y-1.5">
            <label htmlFor="date" className="text-xs font-medium text-theme-muted">
              Fecha
            </label>
            <input
              type="date"
              id="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-theme-muted border border-theme rounded-lg px-3 py-2 text-sm text-theme focus:outline-none focus:border-theme accent-border-cream transition-colors"
            />
          </div>

          {/* Categoría */}
          <div className="sm:col-span-3 space-y-1.5">
            <label htmlFor="type" className="text-xs font-medium text-theme-muted">
              Categoría
            </label>
            <select
              id="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-theme-muted border border-theme rounded-lg px-3 py-2 text-sm text-theme focus:outline-none focus:border-theme transition-colors"
            >
              <option value="ejecutiva">Ejecutiva ($17k)</option>
              <option value="gestion">Gestión ($12k)</option>
            </select>
          </div>

          {/* Horas */}
          <div className="sm:col-span-2 space-y-1.5">
            <label htmlFor="hours" className="text-xs font-medium text-theme-muted">
              Horas
            </label>
            <input
              type="number"
              id="hours"
              step="0.5"
              min="0.5"
              placeholder="e.g. 2.5"
              required
              value={formData.hours}
              onChange={handleChange}
              className="w-full bg-theme-muted border border-theme rounded-lg px-3 py-2 text-sm text-theme focus:outline-none focus:border-theme accent-border-cream transition-colors font-mono"
            />
          </div>

          {/* Descripción */}
          <div className="sm:col-span-4 space-y-1.5">
            <label htmlFor="desc" className="text-xs font-medium text-theme-muted">
              Descripción (Opcional)
            </label>
            <input
              type="text"
              id="desc"
              placeholder="Elegir outfits, editar... etc."
              value={formData.desc}
              onChange={handleChange}
              className="w-full bg-theme-muted border border-theme rounded-lg px-3 py-2 text-sm text-theme placeholder-theme-muted focus:outline-none focus:border-theme accent-border-cream transition-colors"
            />
          </div>

          {/* Botón Submit */}
          <div className="sm:col-span-12 pt-2">
            <button
              type="submit"
              className="w-full accent-cream font-semibold text-sm py-2.5 rounded-lg transition-all active:scale-[0.99] shadow-md cursor-pointer"
            >
              Guardar Registro
            </button>
          </div>
        </form>
      </section>

      {/* Historial de Registros */}
      <main className="space-y-4 flex-1">
        <div className="flex items-center justify-between text-xs text-theme-muted font-medium px-1">
          <span>Historial de Trabajo</span>
          <button
            onClick={handleClearAll}
            className="text-theme-muted hover:accent-text-cream transition-colors cursor-pointer"
          >
            Borrar todo
          </button>
        </div>

        <div className="space-y-2">
          {logs.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-theme rounded-xl">
              <p className="text-xs text-theme-muted">No hay horas registradas aún.</p>
            </div>
          ) : (
            logs.map((log, index) => {
              const isExec = log.type === 'ejecutiva';
              const rate = RATES[log.type];
              const earned = log.hours * rate;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-theme-muted border border-theme-muted hover:border-theme transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <span
                      className={`text-xs font-mono px-2.5 py-1 rounded-md border uppercase font-semibold tracking-wider ${
                        isExec
                          ? 'bg-theme border-logo-cream text-theme'
                          : 'bg-theme-muted border-theme-muted text-theme-muted'
                      }`}
                    >
                      {log.type}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-theme">
                        {log.desc || 'Sin descripción'}
                      </p>
                      <p className="text-xs font-mono text-theme-muted mt-0.5">
                        {log.date} • {log.hours} h × ${rate.toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-mono font-semibold text-theme accent-text-cream">
                      {formatCOP(earned)}
                    </span>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-theme-muted hover:accent-text-cream opacity-0 group-hover:opacity-100 transition-all text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}