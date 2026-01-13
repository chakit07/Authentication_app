import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  Check,
  Edit3,
  Filter,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../utils/api";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  const fetchTasks = async () => {
    try {
      setLoading(true);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/todo/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const { data } = await api.put(`/todo/${task._id}`, {
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t._id === task._id ? data.todo : t)));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (currentTask) {
        await api.put(`/todo/${currentTask._id}`, formData);
      } else {
        await api.post("/todo/new", formData);
      }
      fetchTasks();
      setIsModalOpen(false);
      setCurrentTask(null);
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "All"
        ? true
        : filterStatus === "Completed"
        ? task.completed
        : !task.completed;
    const matchesPriority =
      filterPriority === "All" ? true : task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-24"
    >
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-1">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-black tracking-tight text-slate-800 dark:text-slate-100"
          >
            All Tasks
          </motion.h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Manage your tasks efficiently
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative w-full sm:w-80"
          >
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
            />
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCurrentTask(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all"
          >
            <Plus size={20} />
            <span className="font-semibold">New Task</span>
          </motion.button>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <FilterGroup
          label="Status"
          icon={<Filter size={16} className="text-blue-600" />}
          value={filterStatus}
          onChange={setFilterStatus}
          options={["All", "Pending", "Completed"]}
        />
        <FilterGroup
          label="Priority"
          icon={<AlertCircle size={16} className="text-amber-600" />}
          value={filterPriority}
          onChange={setFilterPriority}
          options={["All", "Low", "Medium", "High"]}
        />
      </motion.div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="h-20 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-xl"
              />
            ))
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map((task, idx) => (
              <motion.div
                key={task._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className={`flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg transition-all ${
                  task.completed ? "opacity-60" : ""
                }`}
              >
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleToggleComplete(task)}
                  className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-slate-300 dark:border-slate-600 hover:border-blue-500"
                  }`}
                >
                  {task.completed && <Check size={16} strokeWidth={3} />}
                </motion.button>

                <div
                  className="flex-1 min-w-0"
                  onClick={() => {
                    setCurrentTask(task);
                    setIsModalOpen(true);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <h3
                      className={`font-semibold text-lg cursor-pointer truncate ${
                        task.completed
                          ? "line-through text-slate-400"
                          : "text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {task.title}
                    </h3>
                    <PriorityIndicator level={task.priority} />
                  </div>
                  {task.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                  {task.dueDate && (
                    <span
                      className={`text-xs flex items-center gap-1 mt-2 ${
                        new Date(task.dueDate) < new Date() && !task.completed
                          ? "text-red-500"
                          : "text-slate-400"
                      }`}
                    >
                      <Calendar size={14} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setCurrentTask(task);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Edit3 size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(task._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 text-center space-y-4 bg-slate-50 dark:bg-slate-800 rounded-2xl"
            >
              <Search size={48} className="mx-auto text-slate-400" />
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300">
                  No tasks found
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Try adjusting your filters or create a new task
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <TaskModal
            onClose={() => {
              setIsModalOpen(false);
              setCurrentTask(null);
            }}
            onSubmit={handleFormSubmit}
            task={currentTask}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TaskModal = ({ onClose, onSubmit, task }) => {
  const [formData, setFormData] = useState(
    task
      ? {
          title: task.title,
          description: task.description || "",
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        }
      : { title: "", description: "", priority: "Medium", dueDate: "" }
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700"
      >
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {task ? "Edit Task" : "New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Title
            </label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Task title..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[100px] resize-none"
              placeholder="Task description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl"
          >
            {task ? "Update Task" : "Create Task"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const FilterGroup = ({ label, icon, value, onChange, options }) => (
  <div className="flex items-center gap-3">
    <label className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
      {icon} {label}
    </label>
    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            value === opt
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-500 hover:text-blue-600"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const PriorityIndicator = ({ level }) => {
  const colors = {
    High: "bg-red-500",
    Medium: "bg-amber-500",
    Low: "bg-green-500",
  };
  return (
    <div className={`w-2 h-2 rounded-full ${colors[level]} animate-pulse`} />
  );
};

export default Tasks;
