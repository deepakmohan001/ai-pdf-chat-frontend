
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Files,
  Bot,
  Sparkles,
  X,
} from "lucide-react";

function Sidebar({ isOpen, onClose }) {
  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Documents",
      path: "/documents",
      icon: Files,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-screen w-64 flex-col
          border-r border-white/10 bg-[#10172A] p-5 text-white
          transition-transform duration-300
          md:sticky md:top-0 md:h-screen md:self-start md:shrink-0 md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="mb-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-600 p-2">
              <Sparkles size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold">DocuMind AI</h2>
              <p className="text-xs text-gray-400">
                Intelligent PDF Assistant
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Menu
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2">
            <Bot size={20} className="text-purple-400" />
            <span className="text-sm font-semibold">
              AI Assistant
            </span>
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Chat with your PDF documents.
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
