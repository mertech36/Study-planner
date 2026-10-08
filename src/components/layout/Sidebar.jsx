import { useEffect, useState } from "react";
import { FiHome, FiCheckSquare, FiBookOpen, FiCalendar, FiTrendingUp, FiSettings, FiX } from "react-icons/fi";

const FONT = "Inter, sans-serif";
const ACTIVE_BG = "#C85A1A";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: FiHome },
  { id: "tasks", label: "Tasks", icon: FiCheckSquare },
  { id: "exams", label: "Exams", icon: FiCalendar },
  { id: "courses", label: "Courses", icon: FiBookOpen },
  { id: "analytics", label: "Analytics", icon: FiTrendingUp },
];

/* ─── NAV BUTTON ─── */
function NavButton({ icon: Icon, label, active, inactiveColor, hoverBg, onClick, tabIndex }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      tabIndex={tabIndex}
      aria-current={active ? "page" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 12px",
        borderRadius: 10,
        border: "none",
        background: active ? ACTIVE_BG : hovered ? hoverBg : "transparent",
        color: active ? "#FFFFFF" : inactiveColor,
        cursor: "pointer",
        fontWeight: 500,
        fontSize: 14,
        fontFamily: FONT,
        textAlign: "left",
        width: "100%",
        transition: "background 0.15s",
      }}
    >
      <Icon size={17} />
      {label}
    </button>
  );
}

/* ─── SIDEBAR ─── */
function Sidebar({ page, setPage, isOpen, setIsOpen, darkMode }) {
  const dm = darkMode;

  // Orange / cream Dodo palette — matches Dashboard & App
  const sidebarBg = dm ? "#1A110A" : "#EFE0CE";
  const hoverBg = dm ? "#2A1A0F" : "#E0CDB8";
  const textMain = dm ? "#F5E6D5" : "#2C1A0E";
  const textMuted = dm ? "#9C7B5E" : "#8C6A4A";
  const borderCol = dm ? "#2A1A0F" : "#D9C4AC";

  const close = () => setIsOpen(false);
  const handleNav = (id) => {
    setPage(id);
    close();
  };

  // Escape ile kapat
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, setIsOpen]);

  // Kapalıyken menü öğelerine Tab ile ulaşılmasın
  const tabIndex = isOpen ? 0 : -1;

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm" onClick={close} />}

      <aside
        aria-hidden={!isOpen}
        style={{
          background: sidebarBg,
          borderRight: `1px solid ${borderCol}`,
          transition: "background 0.3s, transform 0.3s",
        }}
        className={`fixed top-0 left-0 z-40 h-screen w-[220px] flex flex-col px-4 py-6 overflow-y-auto shadow-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* LOGO + CLOSE */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/icon.png" alt="Dodo Study logo" style={{ width: 38, height: 38, borderRadius: 10 }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: textMain, margin: 0, fontFamily: FONT }}>Dodo Study</p>
              <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: FONT }}>Planner</p>
            </div>
          </div>
          <button
            onClick={close}
            aria-label="Close menu"
            tabIndex={tabIndex}
            style={{
              width: 30, height: 30, borderRadius: 8,
              border: "none", background: hoverBg,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: textMuted,
            }}
          >
            <FiX size={15} />
          </button>
        </div>

        {/* NAV ITEMS */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <NavButton
              key={id}
              icon={icon}
              label={label}
              active={page === id}
              inactiveColor={textMain}
              hoverBg={hoverBg}
              onClick={() => handleNav(id)}
              tabIndex={tabIndex}
            />
          ))}
        </nav>

        {/* STAY FOCUSED CARD */}
        <div style={{ marginTop: 24, borderRadius: 16, padding: "18px 16px", background: ACTIVE_BG, color: "#FFF" }}>
          <p style={{ fontSize: 14, fontWeight: 700, margin: 0, fontFamily: FONT }}>Stay Focused</p>
          <p style={{ fontSize: 12, marginTop: 6, opacity: 0.85, lineHeight: 1.5, fontFamily: FONT }}>
            Don't go extinct.<br />Start studying.
          </p>
          <button
            onClick={() => handleNav("focus")}
            tabIndex={tabIndex}
            style={{
              marginTop: 14,
              width: "100%",
              padding: "9px 0",
              borderRadius: 10,
              border: "none",
              background: "#A0420E",
              color: "#FFF",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            Continue →
          </button>
        </div>

        {/* SETTINGS — pinned to bottom */}
        <div style={{ marginTop: "auto", paddingTop: 16 }}>
          <NavButton
            icon={FiSettings}
            label="Settings"
            active={page === "settings"}
            inactiveColor={textMuted}
            hoverBg={hoverBg}
            onClick={() => handleNav("settings")}
            tabIndex={tabIndex}
          />
        </div>
      </aside>
    </>
  );
}

export default Sidebar;