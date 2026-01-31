"use client";

import { useState } from "react";
import { useSidebar } from "./SidebarContext";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState(0);
  const { toggle } = useSidebar();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 rounded-2xl shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Toggle and Theme Buttons */}
          <div className="flex items-center gap-2">
            {/* Toggle Button */}
            <button
              onClick={toggle}
              className="p-3 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
              aria-label="Toggle sidebar"
            >
              <span className="text-2xl">☰</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle inline />
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-light-purple dark:focus:ring-dark-purple focus:bg-white dark:focus:bg-zinc-900 transition-all text-gray-800 dark:text-gray-200"
              />
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {/* Notifications Button */}
            <button
              className="relative p-3 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all group"
              aria-label="Notificaciones"
            >
              <span className="text-2xl">🔔</span>
              {notifications > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications > 9 ? "9+" : notifications}
                </span>
              )}
            </button>

            {/* Profile/Menu Button */}
            <button
              className="p-3 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all"
              aria-label="Menú de usuario"
            >
              <span className="text-2xl">📚</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}



