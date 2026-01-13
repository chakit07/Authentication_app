import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/todo/me");
      setTasks(data.todos);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    overdue: tasks.filter(
      (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
    ).length,
  };

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-1">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-black tracking-tight text-slate-100"
          >
            Welcome back, {user?.name.split(" ")[0]}! 👋
          </motion.h1>
          <p className="text-slate-400 font-medium">
            You have{" "}
            <span className="text-blue-400 font-bold">
              {stats.pending} tasks
            </span>{" "}
            waiting for you.
          </p>
        </div>
      </motion.header>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          label="Total Tasks"
          value={stats.total}
          icon={<Calendar className="text-blue-600" />}
          color="blue"
          delay={0.1}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={<CheckCircle2 className="text-green-600" />}
          color="green"
          subtitle={`${completionRate}% Done`}
          delay={0.2}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={<Clock className="text-amber-600" />}
          color="amber"
          delay={0.3}
        />
        <StatCard
          label="Overdue"
          value={stats.overdue}
          icon={<AlertCircle className="text-red-600" />}
          color="red"
          delay={0.4}
        />
      </motion.div>

      {/* Progress Visualizer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h3 className="font-bold text-xl text-slate-100">Your Progress</h3>
            <p className="text-sm text-slate-400">Track your productivity</p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
            className="text-2xl font-bold text-blue-600 bg-blue-900/20 px-4 py-2 rounded-xl"
          >
            {completionRate}%
          </motion.div>
        </div>

        <div className="space-y-4">
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative"
            >
              <motion.div
                animate={{ x: ["0%", "100%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-white/30 rounded-full"
              />
            </motion.div>
          </div>
          <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </motion.div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">Recent Tasks</h2>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-800 transition-colors"
            >
              <Search size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Filter size={20} />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="h-24 bg-slate-700 animate-pulse rounded-xl"
              />
            ))
          ) : tasks.length > 0 ? (
            tasks
              .slice(0, 4)
              .map((task, idx) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onUpdate={fetchTasks}
                  index={idx}
                />
              ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full py-12 text-center space-y-4 bg-slate-800 rounded-2xl"
            >
              <Calendar size={48} className="mx-auto text-slate-400" />
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-300">
                  No tasks yet
                </h3>
                <p className="text-slate-400">
                  Create your first task to get started!
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const StatCard = ({ label, value, icon, color, subtitle, delay }) => {
  const colors = {
    blue: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30",
    green:
      "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
    amber:
      "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30",
    red: "from-rose-500/20 to-pink-500/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30",
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`p-6 rounded-2xl border bg-gradient-to-br ${colors[color]} space-y-4 shadow-lg shadow-none backdrop-blur-sm group transition-all`}
    >
      <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
        {icon}
      </div>
      <div>
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold tabular-nums"
        >
          {value}
        </motion.div>
        <div className="text-xs font-semibold uppercase tracking-wider opacity-70 mt-1">
          {label}
        </div>
        {subtitle && (
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mt-2 bg-black/20 px-2 py-1 rounded-lg w-fit">
            {subtitle}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const TaskItem = ({ task, onUpdate, index }) => {
  const toggleComplete = async () => {
    try {
      await api.put(`/todo/${task._id}`, { completed: !task.completed });
      onUpdate();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const priorityColors = {
    High: "text-rose-600 bg-rose-900/30 border-rose-900/30",
    Medium: "text-amber-600 bg-amber-900/30 border-amber-900/30",
    Low: "text-emerald-600 bg-emerald-900/30 border-emerald-900/30",
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, x: 10 }}
      className={`flex items-center gap-5 p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl shadow-none hover:shadow-primary-500/10 transition-all ${
        task.completed ? "opacity-50" : ""
      }`}
    >
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={toggleComplete}
        className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
          task.completed
            ? "bg-emerald-500 border-emerald-500 text-white rotate-0"
            : "border-slate-200 dark:border-slate-700 hover:border-primary-500 rotate-0"
        }`}
      >
        {task.completed && <CheckCircle2 size={18} fill="currentColor" />}
      </motion.button>

      <div className="flex-1 min-w-0">
        <h4
          className={`font-black text-lg truncate ${
            task.completed ? "line-through text-slate-400" : ""
          }`}
        >
          {task.title}
        </h4>
        <div className="flex items-center gap-4 mt-2">
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
          {task.dueDate && (
            <span
              className={`text-[10px] font-bold flex items-center gap-1.5 ${
                new Date(task.dueDate) < new Date() && !task.completed
                  ? "text-rose-500"
                  : "text-slate-400"
              }`}
            >
              <Calendar size={12} />
              {new Date(task.dueDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      <div className="h-10 w-1 bg-slate-800 rounded-full" />
    </motion.div>
  );
};

export default Dashboard;
