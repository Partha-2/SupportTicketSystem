import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, ArrowRight, User, Hash, MessageSquare } from 'lucide-react';
import { ticketService } from '../api/api';

const TicketList = ({ refreshKey, onStatusChange }) => {
    const [tickets, setTickets] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        priority: '',
        status: '',
        search: ''
    });
    const [loading, setLoading] = useState(true);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await ticketService.getAll(filters);
            setTickets(res.data);
        } catch (err) {
            console.error("Failed to fetch tickets", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [filters, refreshKey]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await ticketService.patch(id, { status: newStatus });
            fetchTickets();
            onStatusChange();
        } catch (err) {
            alert("Update failed");
        }
    };

    const getStatusNext = (curr) => {
        const flow = {
            'open': 'in_progress',
            'in_progress': 'resolved',
            'resolved': 'closed',
            'closed': 'open'
        };
        return flow[curr];
    };

    const getStatusLabel = (s) => s.replace('_', ' ').toUpperCase();

    return (
        <div className="space-y-6">
            <div className="glass p-5 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 shadow-lg">
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        name="search"
                        placeholder="Search system queue..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="w-full pl-11 h-11"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                    <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full pl-11 h-11">
                        <option value="">All Categories</option>
                        <option value="billing">Billing</option>
                        <option value="technical">Technical</option>
                        <option value="account">Account</option>
                        <option value="general">General</option>
                    </select>
                </div>
                <select name="priority" value={filters.priority} onChange={handleFilterChange} className="w-full h-11">
                    <option value="">All Priorities</option>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical Only</option>
                </select>
                <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full h-11">
                    <option value="">Any Status</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-5">
                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-text-muted">Accessing Database Core...</p>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="glass p-24 text-center space-y-5">
                        <MessageSquare className="w-16 h-16 mx-auto text-border opacity-50" />
                        <p className="text-text-muted font-bold tracking-widest uppercase text-xs">No matching entries found in queue.</p>
                    </div>
                ) : (
                    tickets.map((ticket, index) => (
                        <div
                            key={ticket.id}
                            className="glass p-8 flex flex-col md:flex-row gap-8 items-stretch transition-all hover:bg-white/[0.02] group"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="flex-1 flex flex-col gap-5">
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className={`badge badge-${ticket.priority}`}>{ticket.priority}</span>
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10">
                                        <Hash className="w-3 h-3 text-primary" />
                                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mt-0.5">{ticket.category}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white tracking-tight w-full md:w-auto">{ticket.title}</h3>
                                </div>
                                <p className="text-text-muted text-sm leading-relaxed line-clamp-2 pr-4">{ticket.description}</p>
                                <div className="flex items-center gap-8 border-t border-border/30 pt-4 mt-auto">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-text-muted tracking-widest uppercase">
                                        <Clock className="w-4 h-4 text-primary opacity-60" />
                                        {new Date(ticket.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-text-muted tracking-widest uppercase">
                                        <User className="w-4 h-4 text-primary opacity-60" />
                                        Operator_01
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 w-full md:w-56 flex flex-row md:flex-col justify-between items-center md:items-end gap-6 bg-white/[0.01] p-4 md:p-0 md:bg-transparent rounded-xl">
                                <div className="flex flex-col md:items-end gap-1">
                                    <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] opacity-60">Session Status</span>
                                    <span className={`text-[12px] font-black tracking-[0.1em] px-2 py-1 rounded-lg ${ticket.status === 'open' ? 'text-primary' :
                                        ticket.status === 'in_progress' ? 'text-warning' :
                                            'text-success'
                                        }`}>
                                        {getStatusLabel(ticket.status)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleStatusUpdate(ticket.id, getStatusNext(ticket.status))}
                                    className="px-6 py-3 bg-white/5 hover:bg-primary hover:text-white border border-white/10 hover:border-primary rounded-xl text-[10px] font-black tracking-widest flex items-center gap-3 transition-all active:scale-95"
                                >
                                    PIVOT STATE
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TicketList;
