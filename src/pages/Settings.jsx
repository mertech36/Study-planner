import { useState } from "react";
import {
  FiEdit2, FiCheck, FiLogOut,
  FiMoon, FiSun, FiBell, FiShield, FiTrash2,
  FiChevronRight, FiAlertTriangle,
} from "react-icons/fi";

function Settings({ darkMode, setDarkMode, settingsProps }) {
  const {
    userName, setUserName,
    userEmail, setUserEmail,
    themeColor, setThemeColor,
    notifExams, setNotifExams,
    notifTasks, setNotifTasks,
    notifFocus, setNotifFocus,
  } = settingsProps;

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dm = darkMode;
  const card = dm ? "bg-white/5 border border-white/10" : "bg-white border border-slate-100 shadow-sm";
  const textMain = dm ? "text-white" : "text-slate-900";
  const textSub = dm ? "text-slate-400" : "text-slate-500";
  const inputBg = dm ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200";

  const themeColors = [
    { id: "blue",    bg: "bg-blue-500",    ring: "ring-blue-400",    from: "from-blue-500",    to: "to-indigo-600" },
    { id: "purple",  bg: "bg-purple-500",  ring: "ring-purple-400",  from: "from-purple-500",  to: "to-fuchsia-600" },
    { id: "emerald", bg: "bg-emerald-500", ring: "ring-emerald-400", from: "from-emerald-500", to: "to-teal-600" },
    { id: "orange",  bg: "bg-orange-500",  ring: "ring-orange-400",  from: "from-orange-500",  to: "to-red-500" },
    { id: "pink",    bg: "bg-pink-500",    ring: "ring-pink-400",    from: "from-pink-500",    to: "to-rose-500" },
  ];

  const activeTheme = themeColors.find((c) => c.id === themeColor) || themeColors[0];
  const initials = userName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "U";

  const handleSave = () => {
    setIsEditingName(false);
    setIsEditingEmail(false);
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }, 900);
  };

  const Toggle = ({ value, onChange }) => (
    <button onClick={() => onChange(!value)}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 flex-shrink-0 ${value ? "bg-blue-500" : dm ? "bg-white/15" : "bg-slate-200"}`}>
      <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${value ? "translate-x-7" : "translate-x-0"}`} />
    </button>
  );

  return (
    <>
      <div className="space-y-8 max-w-5xl mx-auto">

        {/* HEADER */}
        <div>
          <h1 className={`text-4xl font-black ${textMain}`}>Settings</h1>
          <p className={`mt-1 ${textSub}`}>Manage your account and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="space-y-5">

            {/* PROFILE */}
            <div className={`${card} rounded-[28px] p-6`}>
              <h2 className={`text-base font-black mb-5 ${textMain}`}>Profile</h2>

              {/* AVATAR */}
              <div className="flex flex-col items-center mb-6">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${activeTheme.from} ${activeTheme.to} flex items-center justify-center text-white text-2xl font-black shadow-xl mb-3`}>
                  {initials}
                </div>
                <p className={`text-xs ${textSub}`}>Student</p>
              </div>

              {/* NAME */}
              <div className="space-y-3">
                <div>
                  <label className={`text-xs font-bold uppercase tracking-widest ${textSub}`}>Full Name</label>
                  <div className={`mt-1.5 w-full px-4 py-3 rounded-2xl border flex justify-between items-center gap-3 ${inputBg}`}>
                    {isEditingName ? (
                      <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)}
                        autoFocus className={`bg-transparent outline-none w-full text-sm font-medium ${textMain}`} />
                    ) : (
                      <span className={`text-sm font-medium truncate ${textMain}`}>{userName}</span>
                    )}
                    <button onClick={() => setIsEditingName(!isEditingName)} className="text-blue-500 flex-shrink-0">
                      {isEditingName ? <FiCheck size={16} /> : <FiEdit2 size={15} />}
                    </button>
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className={`text-xs font-bold uppercase tracking-widest ${textSub}`}>Email</label>
                  <div className={`mt-1.5 w-full px-4 py-3 rounded-2xl border flex justify-between items-center gap-3 ${inputBg}`}>
                    {isEditingEmail ? (
                      <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}
                        autoFocus className={`bg-transparent outline-none w-full text-sm font-medium ${textMain}`} />
                    ) : (
                      <span className={`text-sm font-medium truncate ${textMain}`}>{userEmail}</span>
                    )}
                    <button onClick={() => setIsEditingEmail(!isEditingEmail)} className="text-blue-500 flex-shrink-0">
                      {isEditingEmail ? <FiCheck size={16} /> : <FiEdit2 size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* SAVE */}
              <button onClick={handleSave} disabled={isSaving}
                className={`mt-5 w-full py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${
                  savedSuccess ? "bg-green-500 text-white" : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                }`}>
                {savedSuccess ? <><FiCheck size={16} /> Saved!</> : isSaving ? <span className="animate-pulse">Saving...</span> : "Save Changes"}
              </button>
            </div>

            {/* DANGER ZONE */}
            <div className={`${card} rounded-[28px] p-6`}>
              <h2 className="text-base font-black text-red-500 mb-4">Danger Zone</h2>
              <div className="space-y-2">
                <button onClick={() => setShowLogoutModal(true)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${dm ? "hover:bg-red-500/10" : "hover:bg-red-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                      <FiLogOut className="text-red-500" size={15} />
                    </div>
                    <span className="text-sm font-semibold text-red-500">Sign Out</span>
                  </div>
                  <FiChevronRight className="text-red-400" size={16} />
                </button>

                <button onClick={() => setShowDeleteModal(true)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${dm ? "hover:bg-red-500/10" : "hover:bg-red-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                      <FiTrash2 className="text-red-500" size={15} />
                    </div>
                    <span className="text-sm font-semibold text-red-500">Delete Account</span>
                  </div>
                  <FiChevronRight className="text-red-400" size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-2 space-y-5">

            {/* APPEARANCE */}
            <div className={`${card} rounded-[28px] p-6`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${dm ? "bg-white/10" : "bg-slate-100"}`}>
                  {dm ? <FiMoon className={textSub} size={17} /> : <FiSun className={textSub} size={17} />}
                </div>
                <h2 className={`text-base font-black ${textMain}`}>Appearance</h2>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-2xl mb-4 ${dm ? "bg-white/5" : "bg-slate-50"}`}>
                <div>
                  <p className={`font-bold text-sm ${textMain}`}>Dark Mode</p>
                  <p className={`text-xs mt-0.5 ${textSub}`}>Reduce eye strain in low light</p>
                </div>
                <Toggle value={dm} onChange={setDarkMode} />
              </div>

              <div>
                <p className={`text-sm font-bold mb-3 ${textMain}`}>Accent Color</p>
                <div className="flex gap-3">
                  {themeColors.map((c) => (
                    <button key={c.id} onClick={() => setThemeColor(c.id)}
                      className={`w-10 h-10 rounded-2xl ${c.bg} transition-all duration-200 ${
                        themeColor === c.id
                          ? `ring-4 ring-offset-2 ${c.ring} scale-110 ${dm ? "ring-offset-[#0f172a]" : "ring-offset-white"}`
                          : "opacity-50 hover:opacity-80 hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* NOTIFICATIONS */}
            <div className={`${card} rounded-[28px] p-6`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${dm ? "bg-white/10" : "bg-slate-100"}`}>
                  <FiBell className={textSub} size={17} />
                </div>
                <h2 className={`text-base font-black ${textMain}`}>Notifications</h2>
              </div>

              <div className="space-y-1">
                {[
                  { label: "Exam Reminders", desc: "Get notified 2 days before upcoming exams", value: notifExams, onChange: setNotifExams },
                  { label: "Task Deadlines", desc: "Alerts for tasks that are due soon", value: notifTasks, onChange: setNotifTasks },
                  { label: "Focus Session Complete", desc: "Notify when a Pomodoro session ends", value: notifFocus, onChange: setNotifFocus },
                ].map((item, i, arr) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between py-4 px-1">
                      <div>
                        <p className={`font-bold text-sm ${textMain}`}>{item.label}</p>
                        <p className={`text-xs mt-0.5 ${textSub}`}>{item.desc}</p>
                      </div>
                      <Toggle value={item.value} onChange={item.onChange} />
                    </div>
                    {i < arr.length - 1 && <div className={`h-px ${dm ? "bg-white/5" : "bg-slate-100"}`} />}
                  </div>
                ))}
              </div>
            </div>

            {/* PRIVACY */}
            <div className={`${card} rounded-[28px] p-6`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${dm ? "bg-white/10" : "bg-slate-100"}`}>
                  <FiShield className={textSub} size={17} />
                </div>
                <h2 className={`text-base font-black ${textMain}`}>Privacy & Security</h2>
              </div>
              <div className="space-y-1">
                {["Change Password", "Two-Factor Authentication", "Download My Data"].map((item) => (
                  <button key={item}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${dm ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                    <span className={`text-sm font-semibold ${textMain}`}>{item}</span>
                    <FiChevronRight className={textSub} size={16} />
                  </button>
                ))}
              </div>
            </div>

            {/* APP INFO */}
            <div className={`${card} rounded-[28px] p-5 flex items-center justify-between`}>
              <div>
                <p className={`text-sm font-bold ${textMain}`}>StudyPlanner</p>
                <p className={`text-xs ${textSub}`}>Version 1.0.0 · Built with React + Tailwind</p>
              </div>
              <div className={`text-xs px-3 py-1.5 rounded-xl font-semibold ${dm ? "bg-white/10 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                Up to date
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SIGN OUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-sm p-8 rounded-[28px] shadow-2xl border ${dm ? "bg-[#1a1f35] border-white/10 text-white" : "bg-white border-slate-100 text-slate-900"}`}>
            <div className="w-14 h-14 rounded-3xl bg-red-100 flex items-center justify-center mb-5">
              <FiLogOut className="text-red-500" size={24} />
            </div>
            <h3 className="text-2xl font-black mb-2">Sign Out</h3>
            <p className={`mb-7 text-sm ${textSub}`}>Are you sure you want to sign out of your account?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)}
                className={`flex-1 py-3 font-bold rounded-2xl text-sm ${dm ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                Cancel
              </button>
              <button onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 font-bold rounded-2xl text-sm bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all hover:scale-[1.02]">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-sm p-8 rounded-[28px] shadow-2xl border ${dm ? "bg-[#1a1f35] border-white/10 text-white" : "bg-white border-slate-100 text-slate-900"}`}>
            <div className="w-14 h-14 rounded-3xl bg-red-100 flex items-center justify-center mb-5">
              <FiAlertTriangle className="text-red-500" size={24} />
            </div>
            <h3 className="text-2xl font-black mb-2">Delete Account</h3>
            <p className={`mb-7 text-sm ${textSub}`}>This action is permanent and cannot be undone. All your data will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)}
                className={`flex-1 py-3 font-bold rounded-2xl text-sm ${dm ? "bg-white/10 text-slate-300 hover:bg-white/20" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                Cancel
              </button>
              <button onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 font-bold rounded-2xl text-sm bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all hover:scale-[1.02]">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Settings;
