import React, { useState } from 'react';
import { Ticket, Activity, Cpu, LifeBuoy } from 'lucide-react';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import StatsDashboard from './components/StatsDashboard';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey(old => old + 1);
  };

  return (
    <div className="min-h-screen p-6 md:p-12 xl:p-16 max-w-[1400px] mx-auto flex flex-col gap-10 md:gap-16">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary-glow shrink-0">
            <LifeBuoy className="text-white w-8 h-8" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-none">
              Support<span className="text-primary">Flow</span>
            </h1>
            <p className="text-text-muted text-xs md:text-sm font-semibold flex items-center gap-2 tracking-wide uppercase">
              <Cpu className="w-4 h-4 text-primary opacity-80" />
              Intelligence Driven Hub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 glass px-5 py-2.5 self-start md:self-center">
          <div className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_12px_#10b981]"></div>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-text-muted">Security: AES-256</span>
          <div className="w-px h-4 bg-border"></div>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-success">Live Stream</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-16 items-start">
        <aside className="xl:col-span-4 flex flex-col gap-10 animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted px-1 flex items-center gap-2 opacity-80">
              <Activity className="w-4 h-4 text-primary" />
              Metrics Dashboard
            </h3>
            <StatsDashboard refreshKey={refreshKey} />
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted px-1 flex items-center gap-2 opacity-80">
              <LifeBuoy className="w-4 h-4 text-primary" />
              Submission Portal
            </h3>
            <TicketForm onTicketCreated={triggerRefresh} />
          </div>
        </aside>

        <main className="xl:col-span-8 flex flex-col gap-5 animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted flex items-center gap-2 opacity-80">
              <Ticket className="w-4 h-4 text-primary" />
              Active Operational Queue
            </h3>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest hidden md:block">
              Priority Sequence: Desired Status
            </div>
          </div>
          <TicketList refreshKey={refreshKey} onStatusChange={triggerRefresh} />
        </main>
      </div>

      <footer className="mt-auto pt-10 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6 text-text-muted text-[10px] font-bold tracking-[0.15em] uppercase">
        <p>&copy; 2024 SupportFlow Analytics • v2.1.0-Core</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-primary transition-colors border-b border-transparent hover:border-primary">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors border-b border-transparent hover:border-primary">Terms</a>
          <a href="#" className="hover:text-primary transition-colors border-b border-transparent hover:border-primary">Security</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
