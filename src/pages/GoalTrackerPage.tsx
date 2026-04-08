import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  AlertCircle, 
  Target, 
  TrendingUp, 
  ChevronRight,
  Filter,
  Sparkles,
  Clock
} from "lucide-react";
import { supabaseClient } from "../lib/supabase";

interface Goal {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
}

const GoalTrackerPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  // Form state
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    priority: "medium" as 'low' | 'medium' | 'high',
    due_date: ""
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e: FormEvent) => {
    e.preventDefault();
    if (!newGoal.title) return;

    try {
      const { data, error } = await supabaseClient
        .from('goals')
        .insert([{
          ...newGoal,
          status: 'pending',
          due_date: newGoal.due_date || null
        }])
        .select();

      if (error) throw error;
      
      setGoals([data[0], ...goals]);
      setShowAddModal(false);
      setNewGoal({ title: "", description: "", priority: "medium", due_date: "" });
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const toggleGoalStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      const { error } = await supabaseClient
        .from('goals')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setGoals(goals.map(g => g.id === id ? { ...g, status: newStatus as any } : g));
    } catch (error) {
      console.error("Error updating goal status:", error);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabaseClient
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setGoals(goals.filter(g => g.id !== id));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const filteredGoals = goals.filter(g => {
    if (filter === 'all') return true;
    return g.status === filter;
  });

  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.status === 'completed').length,
    pending: goals.filter(g => g.status !== 'completed').length,
    completionRate: goals.length > 0 ? Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100) : 0
  };

  return (
    <div className="min-h-screen bg-bg pt-40 pb-20 px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-green/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-blue/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
            >
              Goal Mastery Dashboard
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold tracking-tighter leading-none"
            >
              My <span className="text-gradient italic">Goal.</span>
            </motion.h1>
          </div>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-8 py-4 bg-brand-green text-black rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center gap-3 shadow-[0_15px_40px_rgba(0,255,148,0.2)] hover:bg-white transition-all duration-500"
          >
            <Plus className="w-5 h-5" /> New Strategic Goal
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 perspective-1000">
          {[
            { label: "Total Goals", value: stats.total, icon: Target, color: "brand-blue" },
            { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "brand-green" },
            { label: "In Progress", value: stats.pending, icon: Clock, color: "brand-orange" },
            { label: "Completion Rate", value: `${stats.completionRate}%`, icon: TrendingUp, color: "white" }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group hover-3d preserve-3d"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:scale-150 transition-transform duration-700`} />
              <stat.icon className={`w-8 h-8 text-${stat.color} mb-4`} />
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-4xl font-display font-bold">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Filters & List */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex gap-8">
              {['all', 'pending', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`text-xs font-bold uppercase tracking-widest transition-all relative py-2 ${
                    filter === f ? 'text-brand-green' : 'text-white/30 hover:text-white'
                  }`}
                >
                  {f}
                  {filter === f && (
                    <motion.div 
                      layoutId="activeFilter"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-green"
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em]">
              {filteredGoals.length} Goals Found
            </div>
          </div>

          <div className="grid gap-6 perspective-1000">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="py-20 text-center text-white/20 font-display text-2xl italic">Initializing neural pathways...</div>
              ) : filteredGoals.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-32 text-center glass rounded-[3rem] border-white/5"
                >
                  <Sparkles className="w-12 h-12 text-white/10 mx-auto mb-6" />
                  <p className="text-white/30 text-xl font-light italic">No goals found in this sector. Start your evolution.</p>
                </motion.div>
              ) : (
                filteredGoals.map((goal) => (
                  <motion.div
                    key={goal.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`glass p-8 rounded-[2.5rem] border-white/5 flex flex-col md:flex-row items-start md:items-center gap-8 group hover:border-white/10 transition-all duration-500 hover-3d preserve-3d ${
                      goal.status === 'completed' ? 'opacity-60' : ''
                    }`}
                  >
                    <button 
                      onClick={() => toggleGoalStatus(goal.id, goal.status)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        goal.status === 'completed' 
                          ? 'bg-brand-green text-black' 
                          : 'bg-white/5 text-white/20 hover:bg-white/10 hover:text-brand-green border border-white/5'
                      }`}
                    >
                      {goal.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                          goal.priority === 'high' ? 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange' :
                          goal.priority === 'medium' ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue' :
                          'bg-white/5 border-white/10 text-white/40'
                        }`}>
                          {goal.priority} Priority
                        </span>
                        {goal.due_date && (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" /> {new Date(goal.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <h3 className={`text-2xl font-display font-bold mb-2 tracking-tight ${goal.status === 'completed' ? 'line-through text-white/30' : ''}`}>
                        {goal.title}
                      </h3>
                      <p className="text-white/40 text-sm font-light leading-relaxed line-clamp-2">
                        {goal.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => deleteGoal(goal.id)}
                        className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 hover:bg-brand-orange/20 hover:text-brand-orange transition-all duration-500"
                        aria-label="Delete goal"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl glass-dark p-12 rounded-[3.5rem] border border-white/10 overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-green/10 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="mb-10">
                <h2 className="text-4xl font-display font-bold mb-3 tracking-tight">Define your <span className="text-gradient">Trajectory.</span></h2>
                <p className="text-white/40 text-lg font-light">What's the next milestone in your evolution?</p>
              </div>

              <form onSubmit={handleAddGoal} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30 ml-1">Goal Title</label>
                  <input 
                    required
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    placeholder="e.g., Master Neural Integration"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-7 py-5 focus:outline-none focus:border-brand-green transition-all text-lg font-medium"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30 ml-1">Description (Optional)</label>
                  <textarea 
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    placeholder="Describe the hurdles and the vision..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-7 py-5 focus:outline-none focus:border-brand-green transition-all text-sm resize-none font-light"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30 ml-1">Priority Level</label>
                    <select 
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({...newGoal, priority: e.target.value as any})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-7 py-5 focus:outline-none focus:border-brand-green transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="low" className="bg-bg">Low Priority</option>
                      <option value="medium" className="bg-bg">Medium Priority</option>
                      <option value="high" className="bg-bg">High Priority</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30 ml-1">Target Date</label>
                    <input 
                      type="date"
                      value={newGoal.due_date}
                      onChange={(e) => setNewGoal({...newGoal, due_date: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-7 py-5 focus:outline-none focus:border-brand-green transition-all text-sm cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-5 rounded-2xl border border-white/10 text-white/40 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-5 bg-brand-green text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all duration-500 shadow-[0_15px_40px_rgba(0,255,148,0.2)]"
                  >
                    Initialize Goal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoalTrackerPage;
