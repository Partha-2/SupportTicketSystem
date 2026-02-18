import React, { useState } from 'react';
import { Sparkles, Send, Tag, AlertCircle, LifeBuoy, Zap } from 'lucide-react';
import { ticketService } from '../api/api';

const TicketForm = ({ onTicketCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium',
    });
    const [loading, setLoading] = useState(false);
    const [classifying, setClassifying] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDescriptionBlur = async () => {
        if (formData.description.length < 20) return;

        setClassifying(true);
        try {
            const res = await ticketService.classify(formData.description);
            setFormData(prev => ({
                ...prev,
                category: res.data.suggested_category,
                priority: res.data.suggested_priority
            }));
        } catch (err) {
            console.error("Classification failed", err);
        } finally {
            setClassifying(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ticketService.create(formData);
            setFormData({ title: '', description: '', category: 'general', priority: 'medium' });
            onTicketCreated();
        } catch (err) {
            alert("Failed to create entry");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass p-8 md:p-10 space-y-8 shadow-xl">
            <div className="space-y-3">
                <label className="flex items-center gap-2.5">
                    <Send className="w-3.5 h-3.5 text-primary" />
                    Problem Summary
                </label>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength="200"
                    required
                    className="w-full h-12"
                    placeholder="Briefly summarize the ticket objective..."
                />
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center h-5">
                    <label className="flex items-center gap-2.5 m-0">
                        <Tag className="w-3.5 h-3.5 text-primary" />
                        Comprehensive Data
                    </label>
                    {classifying && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 animate-pulse">
                            <Zap className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.1em] mt-0.5">Neural Matcher</span>
                        </div>
                    )}
                </div>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={handleDescriptionBlur}
                    required
                    className="w-full h-40 resize-none pt-4"
                    placeholder="Provide deep technical context. Our engine will analyze the metadata and suggest optimal routing parameters automatically."
                />
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="opacity-80">Routing Class</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full h-12">
                        <option value="billing">Billing Ops</option>
                        <option value="technical">Tech Infrastructure</option>
                        <option value="account">Account Access</option>
                        <option value="general">Generic System</option>
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="opacity-80">Priority Index</label>
                    <select name="priority" value={formData.priority} onChange={handleChange} className="w-full h-12">
                        <option value="low">Low Level</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Velocity</option>
                        <option value="critical">Critical Mission</option>
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary h-14 rounded-2xl font-black text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 group transition-all"
            >
                {loading ? (
                    <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <LifeBuoy className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                        INITIALIZE STREAM
                    </>
                )}
            </button>

            <div className="pt-2 flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0 opacity-70" />
                <p className="text-[10px] font-bold text-text-muted leading-relaxed uppercase tracking-wider opacity-80">
                    Engineered suggestions are predictive. User overrides take precedence in the final routing table.
                </p>
            </div>
        </form>
    );
};

export default TicketForm;
