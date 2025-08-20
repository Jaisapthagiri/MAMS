import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const name = localStorage.getItem("name") || "User";
  const role = localStorage.getItem("role") || "Guest";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/purchases", label: "Purchases" },
    { to: "/transfers", label: "Transfers" },
    { to: "/assignments", label: "Assignments & Expenditures" },
  ];

  return (
    <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-lg tracking-wide">
            ⚔ Military Assets
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative group transition ${
                location.pathname === link.to
                  ? "text-yellow-300"
                  : "text-gray-100"
              }`}
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all"></span>
            </Link>
          ))}
        </nav>

        {/* User Info + Logout */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 text-black font-bold">
              {initials}
            </div>
            <div className="text-sm">
              <div className="font-medium">{name}</div>
              <div className="text-xs text-gray-200">{role}</div>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/10"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-lg transition ${
                location.pathname === link.to
                  ? "bg-white/20 text-yellow-300"
                  : "hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-red-500/90 hover:bg-red-600 text-white transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};
