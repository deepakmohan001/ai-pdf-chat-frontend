
import { Bell, Search, Menu } from "lucide-react";

function Navbar({ onMenuClick }) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-[#0B1020] px-4 sm:px-8">

      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white md:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-base font-semibold text-white sm:text-lg">
            Welcome Back!
          </h2>

          <p className="hidden text-sm text-gray-400 sm:block">
            Manage your documents and AI conversations.
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-5">
        <button className="rounded-xl p-2 text-gray-400 transition hover:bg-white/5 hover:text-white">
          <Search size={20} />
        </button>

        <button className="relative rounded-xl p-2 text-gray-400 transition hover:bg-white/5 hover:text-white">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-purple-500" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white sm:h-10 sm:w-10">
          AI
        </div>
      </div>
    </header>
  );
}

export default Navbar;
