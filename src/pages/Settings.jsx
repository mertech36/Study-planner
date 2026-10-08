import { useState } from "react";
import { deleteUser } from "firebase/auth";
import { auth } from "../firebase";
import {
  FiEdit2,
  FiCheck,
  FiLogOut,
  FiMoon,
  FiSun,
  FiBell,
  FiShield,
  FiTrash2,
  FiChevronRight,
  FiAlertTriangle,
} from "react-icons/fi";

const THEME_COLORS = [
  { id: "blue", bg: "bg-blue-500", ring: "ring-blue-400", from: "from-blue-500", to: "to-indigo-600" },
  { id: "purple", bg: "bg-purple-500", ring: "ring-purple-400", from: "from-purple-500", to: "to-fuchsia-600" },
  { id: "emerald", bg: "bg-emerald-500", ring: "ring-emerald-400", from: "from-emerald-500", to: "to-teal-600" },
  { id: "orange", bg: "bg-orange-500", ring: "ring-orange-400", from: "from-orange-500", to: "to-red-500" },
  { id: "pink", bg: "bg-pink-500", ring: "ring-pink-400", from: "from-pink-500", to: "to-rose-500" }
];

function Toggle({ value, onChange, darkMode }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      aria-pressed={value}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 flex-shrink-0 ${
        value ? "bg-blue-500" : darkMode ? "bg-white/15" : "bg-slate-200"
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
          value ? "translate-x-7" : ""
        }`}
      />
    </button>
  );
}

function Settings({ darkMode, setDarkMode, settingsProps }) {
  const {
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    themeColor,
    setThemeColor,
    notifExams,
    setNotifExams,
    notifTasks,
    setNotifTasks,
    notifFocus,
    setNotifFocus,
    onSignOut,
  } = settingsProps;

  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const card = darkMode
    ? "bg-white/5 border border-white/10"
    : "bg-white border border-slate-100 shadow-sm";

  const textMain = darkMode ? "text-white" : "text-slate-900";
  const textSub = darkMode ? "text-slate-400" : "text-slate-500";

  const inputBg = darkMode
    ? "bg-white/5 border-white/10"
    : "bg-slate-50 border-slate-200";

  const activeTheme =
    THEME_COLORS.find((c) => c.id === themeColor) || THEME_COLORS[0];

  const initials =
    userName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const saveChanges = () => {
    setEditingName(false);
    setEditingEmail(false);
    setSaving(true);

    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 900);
  };

  const signOut = async () => {
    await onSignOut();
    setLogoutModal(false);
  };

  const deleteAccount = async () => {
    setDeleting(true);
    setDeleteError("");

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Kullanıcı bulunamadı.");
      await deleteUser(currentUser);
    } catch (err) {
      setDeleteError(
        err.code === "auth/requires-recent-login"
          ? "Güvenlik için önce çıkış yapıp tekrar giriş yap, sonra tekrar dene."
          : "Bir hata oluştu: " + err.message
      );
      setDeleting(false);
    }
  };

  const fields = [
    ["Full Name", userName, editingName, setEditingName, setUserName, "text"],
    ["Email", userEmail, editingEmail, setEditingEmail, setUserEmail, "email"],
  ];

  const notifications = [
    ["Exam Reminders", "Get notified 2 days before upcoming exams", notifExams, setNotifExams],
    ["Task Deadlines", "Alerts for tasks that are due soon", notifTasks, setNotifTasks],
    ["Focus Session Complete", "Notify when a Pomodoro session ends", notifFocus, setNotifFocus],
  ];

  const privacyOptions = [
    "Change Password",
    "Two-Factor Authentication",
    "Download My Data",
  ];

  const modalClass = `w-full max-w-sm p-8 rounded-[28px] shadow-2xl border ${
    darkMode
      ? "bg-[#1a1f35] border-white/10 text-white"
      : "bg-white border-slate-100 text-slate-900"
  }`;

  const cancelClass = `flex-1 py-3 font-bold rounded-2xl text-sm ${
    darkMode
      ? "bg-white/10 text-slate-300 hover:bg-white/20"
      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
  }`;

  return (
    <>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className={`text-4xl font-black ${textMain}`}>Settings</h1>
          <p className={`mt-1 ${textSub}`}>
            Manage your account and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-5">
            <div className={`${card} rounded-[28px] p-6`}>
              <h2 className={`text-base font-black mb-5 ${textMain}`}>
                Profile
              </h2>

              <div className="flex flex-col items-center mb-6">
                <div
                  className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${activeTheme.from} ${activeTheme.to} flex items-center justify-center text-white text-2xl font-black shadow-xl mb-3`}
                >
                  {initials}
                </div>
                <p className={`text-xs ${textSub}`}>Student</p>
              </div>

              <div className="space-y-3">
                {fields.map(
                  ([label, value, editing, setEditing, onChange, type]) => (
                    <div key={label}>
                      <label
                        className={`text-xs font-bold uppercase tracking-widest ${textSub}`}
                      >
                        {label}
                      </label>

                      <div
                        className={`mt-1.5 w-full px-4 py-3 rounded-2xl border flex justify-between items-center gap-3 ${inputBg}`}
                      >
                        {editing ? (
                          <input
                            type={type}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            autoFocus
                            className={`bg-transparent outline-none w-full text-sm font-medium ${textMain}`}
                          />
                        ) : (
                          <span
                            className={`text-sm font-medium truncate ${textMain}`}
                          >
                            {value}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => setEditing(!editing)}
                          className="text-blue-500 flex-shrink-0"
                        >
                          {editing ? (
                            <FiCheck size={16} />
                          ) : (
                            <FiEdit2 size={15} />
                          )}
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={saveChanges}
                disabled={saving}
                className={`mt-5 w-full py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${
                  saved
                    ? "bg-green-500 text-white"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                }`}
              >
                {saved ? (
                  <>
                    <FiCheck size={16} /> Saved!
                  </>
                ) : saving ? (
                  <span className="animate-pulse">Saving...</span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>

            <div className={`${card} rounded-[28px] p-6`}>
              <h2 className="text-base font-black text-red-500 mb-4">
                Danger Zone
              </h2>

              <div className="space-y-2">
                {[
                  [FiLogOut, "Sign Out", () => setLogoutModal(true)],
                  [FiTrash2, "Delete Account", () => setDeleteModal(true)],
                ].map(([Icon, label, action]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={action}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                      darkMode
                        ? "hover:bg-red-500/10"
                        : "hover:bg-red-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                        <Icon className="text-red-500" size={15} />
                      </div>
                      <span className="text-sm font-semibold text-red-500">
                        {label}
                      </span>
                    </div>

                    <FiChevronRight
                      className="text-red-400"
                      size={16}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className={`${card} rounded-[28px] p-6`}>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                    darkMode ? "bg-white/10" : "bg-slate-100"
                  }`}
                >
                  {darkMode ? (
                    <FiMoon className={textSub} size={17} />
                  ) : (
                    <FiSun className={textSub} size={17} />
                  )}
                </div>

                <h2 className={`text-base font-black ${textMain}`}>
                  Appearance
                </h2>
              </div>

              <div
                className={`flex items-center justify-between p-4 rounded-2xl mb-4 ${
                  darkMode ? "bg-white/5" : "bg-slate-50"
                }`}
              >
                <div>
                  <p className={`font-bold text-sm ${textMain}`}>
                    Dark Mode
                  </p>
                  <p className={`text-xs mt-0.5 ${textSub}`}>
                    Reduce eye strain in low light
                  </p>
                </div>

                <Toggle
                  value={darkMode}
                  onChange={setDarkMode}
                  darkMode={darkMode}
                />
              </div>

              <p className={`text-sm font-bold mb-3 ${textMain}`}>
                Accent Color
              </p>

              <div className="flex gap-3">
                {THEME_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setThemeColor(c.id)}
                    aria-label={`Select ${c.id} theme`}
                    className={`w-10 h-10 rounded-2xl ${c.bg} transition-all duration-200 ${
                      themeColor === c.id
                        ? `ring-4 ring-offset-2 ${c.ring} scale-110 ${
                            darkMode
                              ? "ring-offset-[#0f172a]"
                              : "ring-offset-white"
                          }`
                        : "opacity-50 hover:opacity-80 hover:scale-105"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className={`${card} rounded-[28px] p-6`}>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                    darkMode ? "bg-white/10" : "bg-slate-100"
                  }`}
                >
                  <FiBell className={textSub} size={17} />
                </div>

                <h2 className={`text-base font-black ${textMain}`}>
                  Notifications
                </h2>
              </div>

              {notifications.map(
                ([label, desc, value, onChange], i) => (
                  <div key={label}>
                    <div className="flex items-center justify-between py-4 px-1">
                      <div>
                        <p className={`font-bold text-sm ${textMain}`}>
                          {label}
                        </p>
                        <p className={`text-xs mt-0.5 ${textSub}`}>
                          {desc}
                        </p>
                      </div>

                      <Toggle
                        value={value}
                        onChange={onChange}
                        darkMode={darkMode}
                      />
                    </div>

                    {i < notifications.length - 1 && (
                      <div
                        className={`h-px ${
                          darkMode
                            ? "bg-white/5"
                            : "bg-slate-100"
                        }`}
                      />
                    )}
                  </div>
                )
              )}
            </div>

            <div className={`${card} rounded-[28px] p-6`}>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                    darkMode ? "bg-white/10" : "bg-slate-100"
                  }`}
                >
                  <FiShield className={textSub} size={17} />
                </div>

                <h2 className={`text-base font-black ${textMain}`}>
                  Privacy & Security
                </h2>
              </div>

              {privacyOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                    darkMode
                      ? "hover:bg-white/5"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <span className={`text-sm font-semibold ${textMain}`}>
                    {item}
                  </span>
                  <FiChevronRight className={textSub} size={16} />
                </button>
              ))}
            </div>

            <div
              className={`${card} rounded-[28px] p-5 flex items-center justify-between`}
            >
              <div>
                <p className={`text-sm font-bold ${textMain}`}>
                  StudyPlanner
                </p>
                <p className={`text-xs ${textSub}`}>
                  Version 1.0.0 · Built with React + Tailwind
                </p>
              </div>

              <div
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold ${
                  darkMode
                    ? "bg-white/10 text-slate-400"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                Up to date
              </div>
            </div>
          </div>
        </div>
      </div>

      {logoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={modalClass}>
            <div className="w-14 h-14 rounded-3xl bg-red-100 flex items-center justify-center mb-5">
              <FiLogOut className="text-red-500" size={24} />
            </div>

            <h3 className="text-2xl font-black mb-2">Sign Out</h3>

            <p className={`mb-7 text-sm ${textSub}`}>
              Are you sure you want to sign out of your account?
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setLogoutModal(false)}
                className={cancelClass}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={signOut}
                className="flex-1 py-3 font-bold rounded-2xl text-sm bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all hover:scale-[1.02]"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={modalClass}>
            <div className="w-14 h-14 rounded-3xl bg-red-100 flex items-center justify-center mb-5">
              <FiAlertTriangle className="text-red-500" size={24} />
            </div>

            <h3 className="text-2xl font-black mb-2">
              Delete Account
            </h3>

            <p className={`mb-4 text-sm ${textSub}`}>
              This action is permanent and cannot be undone. All your data
              will be lost.
            </p>

            {deleteError && (
              <p className="mb-4 text-xs text-red-400 bg-red-500/10 px-4 py-3 rounded-2xl">
                {deleteError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteModal(false);
                  setDeleteError("");
                }}
                disabled={deleting}
                className={cancelClass}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteAccount}
                disabled={deleting}
                className="flex-1 py-3 font-bold rounded-2xl text-sm bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Settings;