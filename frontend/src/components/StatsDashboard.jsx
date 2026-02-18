import React, { useState, useEffect } from 'react';
import { Layers, Activity, TrendingUp, Grid } from 'lucide-react';
import { ticketService } from '../api/api';

const StatsDashboard = ({ refreshKey }) => {
    const [stats, setStats] = useState(null);

    const fetchStats = async () => {
        try {
            const res = await ticketService.getStats();
            setStats(res.data);
        } catch (err) {
            console.error("Failed to fetch statistics", err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [refreshKey]);

    if (!stats) return (
        <div className="grid grid-cols-2 gap-5 md:gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="glass h-32 animate-pulse bg-white/5" />)}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-5 md:gap-6">
                <StatCard
                    label="Pipeline"
                    value={stats.total_tickets}
                    icon={<Layers className="w-5 h-5" />}
                    sub="Total Entries"
                    color="text-primary"
                />
                <StatCard
                    label="Processing"
                    value={stats.open_tickets}
                    icon={<Activity className="w-5 h-5" />}
                    sub="Live Tickets"
                    color="text-warning"
                />
                <StatCard
                    label="Rate"
                    value={stats.avg_tickets_per_day}
                    icon={<TrendingUp className="w-5 h-5" />}
                    sub="Tickets / Day"
                    color="text-info"
                />
                <StatCard
                    label="Clusters"
                    value={Object.keys(stats.category_breakdown).length}
                    icon={<Grid className="w-5 h-5" />}
                    sub="Route Classes"
                    color="text-success"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted opacity-80 border-b border-border/30 pb-3">Priority Distribution</h4>
                    <div className="space-y-3">
                        {Object.entries(stats.priority_breakdown).map(([priority, count]) => (
                            <div key={priority} className="flex items-center justify-between">
                                <span className={`text-[10px] font-black uppercase tracking-wider badge-${priority} px-2 py-0.5 rounded-md`}>{priority}</span>
                                <span className="text-xl font-bold text-white">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass p-6 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted opacity-80 border-b border-border/30 pb-3">Category Classification</h4>
                    <div className="space-y-3">
                        {Object.entries(stats.category_breakdown).map(([category, count]) => (
                            <div key={category} className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-wider text-text-muted">{category}</span>
                                <div className="flex-1 mx-4 h-px bg-border/20"></div>
                                <span className="text-xl font-bold text-white">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, sub, color }) => (
    <div className="glass p-6 border-l-4 border-l-transparent hover:border-l-primary transition-all flex flex-col gap-3 group shadow-xl">
        <div className="flex items-center justify-between text-text-muted">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-primary transition-colors">{label}</span>
            <div className={`${color} bg-white/5 p-2 rounded-xl group-hover:bg-primary/20 transition-all`}>{icon}</div>
        </div>
        <div className="flex flex-col gap-1.5">
            <div className="text-4xl font-black tracking-tighter text-white leading-none">{value}</div>
            <div className="text-[10px] font-black text-text-muted/60 uppercase tracking-[0.1em]">{sub}</div>
        </div>
    </div>
);

export default StatsDashboard;
