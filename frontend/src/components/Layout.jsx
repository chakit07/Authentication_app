import { AnimatePresence, motion } from "framer-motion";
import {
  CheckSquare,
  LayoutGrid,
  List,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col md:flex-row">
      {/* Mobile Nav Toggle - Simplified */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="md:hidden p-4 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-700"
      >
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg"
          >
            <CheckSquare size={18} strokeWidth={3} />
          </motion.div>
          <span className="text-slate-800 dark:text-slate-100">TaskMaster</span>
        </Link>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <Menu size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* Sidebar - Simple & Clean */}
      <motion.aside
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="hidden md:flex flex-col w-20 lg:w-64 h-screen sticky top-0 p-4 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 z-40"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 px-2 mb-10 mt-2"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25"
          >
            <CheckSquare size={20} strokeWidth={3} />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="font-bold text-xl hidden lg:block tracking-tight text-slate-800 dark:text-slate-100"
          >
            TaskMaster
          </motion.span>
        </motion.div>

        {/* Nav Links */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2 flex-1"
        >
          <NavItem
            to="/"
            icon={<LayoutGrid size={22} />}
            label="Dashboard"
            active={location.pathname === "/"}
          />
          <NavItem
            to="/tasks"
            icon={<List size={22} />}
            label="All Tasks"
            active={location.pathname === "/tasks"}
          />
          <NavItem
            to="/profile"
            icon={<User size={22} />}
            label="Profile"
            active={location.pathname === "/profile"}
          />
        </motion.nav>

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="hidden lg:flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-500 text-white flex items-center justify-center text-xs font-bold">
              {user?.name?.[0] || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-slate-800 dark:text-slate-100">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Pro Member
              </p>
            </div>
          </motion.div>

          <div className="flex gap-2 justify-center px-1">
            <motion.button
              whileHover={{
                scale: 1.1,
                backgroundColor: "#ef4444",
                color: "white",
              }}
              whileTap={{ scale: 0.9 }}
              onClick={logout}
              className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <LogOut size={20} />
            </motion.button>
          </div>
        </motion.div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-6xl mx-auto space-y-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label, active }) => (
  <Link to={to} className="relative group block">
    <div
      className={`flex items-center gap-3 px-3 lg:px-4 py-3 rounded-2xl transition-all duration-300 ${
        active
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      <span className="relative z-10">{icon}</span>
      <span className="hidden lg:block font-medium relative z-10">{label}</span>
    </div>
  </Link>
);

export default Layout;
