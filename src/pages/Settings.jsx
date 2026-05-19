import React, { useState } from "react";
import { 
  FiUser, 
  FiMail, 
  FiLogOut, 
  FiMoon, 
  FiSun, 
  FiBell, 
  FiCalendar, 
  FiCheckSquare,
  FiEdit2,
  FiCheck,
  FiClock,
  FiVolume2,
  FiPlayCircle
} from "react-icons/fi";

function Settings({ darkMode, setDarkMode }) {
  // --- TABS STATE ---
  const [activeTab, setActiveTab] = useState("account"); // "account" oder "focus"

  // --- USER PROFILE STATES ---
  const [fullName, setFullName] = useState("Ahmet Yilmaz");
  const [email, setEmail] = useState("ahmet@example.com");
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // --- THEME STATES ---
  const [selectedTheme, setSelectedTheme] = useState("blue");
  const themeColors = [
    { name: "blue", color: "bg-blue-500", ring: "ring-blue-500/40" },
    { name: "purple", color: "bg-purple-500", ring: "ring-purple-500/40" },
    { name: "orange", color: "bg-orange-500", ring: "ring-orange-500/40" },
    { name: "yellow", color: "bg-yellow-500", ring: "ring-yellow-500/40" },
  ];

  // --- NOTIFICATION & SOUND STATES ---
  const [notifExams, setNotifExams] = useState(true); 
  const [notifTasks, setNotifTasks] = useState(false); 
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // --- FOCUS / POMODORO STATES ---
  const [studyDuration, setStudyDuration] = useState("25");
  const [breakDuration, setBreakDuration] = useState("5");
  const [longBreakDuration, setLongBreakDuration] = useState("15");
  const [autoStartBreak, setAutoStartBreak] = useState(false);
  const [autoStartSession, setAutoStartSession] = useState(false);

  // --- UI EFFECTS & MODALS ---
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // --- FUNCTIONS ---
  const handleSaveDetails = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleLogOut = () => {
    setShowLogoutModal(false);
  };

  // Hilfsfunktion für die Toggle-Schalter
  const ToggleSwitch = ({ checked, onChange }) => (
    <button 
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 shadow-inner flex-shrink-0 ${
        checked ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
      }`}
    >
      <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-md ${
        checked ? "translate-x-6" : "translate-x-0"
      }`}></div>
    </button>
  );

  return (
    <>
      <div className={`p-2 md:p-6 w-full max-w-6xl mx-auto transition-colors duration-500 ${darkMode ? "text-white" : "text-slate-900"}`}>
        
        {/* HEADER & TABS */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">Settings</h2>
          <p className={`text-sm mt-1 mb-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Manage your account, theme, and focus preferences.</p>
          
          <div className={`flex gap-6 border-b ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
            <button 
              onClick={() => setActiveTab("account")}
              className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "account" 
                ? "border-blue-500 text-blue-500" 
                : `border-transparent ${darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`
              }`}
            >
              <FiUser /> Account & Theme
            </button>
            <button 
              onClick={() => setActiveTab("focus")}
              className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "focus" 
                ? "border-blue-500 text-blue-500" 
                : `border-transparent ${darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`
              }`}
            >
              <FiClock /> Focus & Notifications
            </button>
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ================= ACCOUNT TAB ================= */}
          {activeTab === "account" && (
            <>
              {/* LEFT COLUMN: Profile Details */}
              <div className={`p-8 rounded-3xl border transition-colors duration-500 ${
                darkMode ? "bg-[#1e293b]/50 border-white/10" : "bg-white border-slate-100 shadow-xl shadow-slate-200/40"
              }`}>
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <FiUser className="text-blue-500" /> Account Details
                </h3>
                
                <div className="flex flex-col items-center mb-10">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-4 transition-all
                    ${selectedTheme === "purple" ? "bg-gradient-to-tr from-purple-500 to-fuchsia-600 shadow-purple-500/30" : ""}
                    ${selectedTheme === "blue" ? "bg-gradient-to-tr from-blue-500 to-cyan-600 shadow-blue-500/30" : ""}
                    ${selectedTheme === "yellow" ? "bg-gradient-to-tr from-yellow-400 to-orange-500 shadow-yellow-500/30" : ""}
                    ${selectedTheme === "orange" ? "bg-gradient-to-tr from-orange-500 to-red-600 shadow-orange-500/30" : ""}
                  `}>
                    {fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "US"}
                  </div>
                  <h4 className="text-2xl font-bold">Hello, {fullName.split(" ")[0]}!</h4>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                      <FiUser size={14} /> Full Name
                    </label>
                    <div className={`mt-2 w-full px-5 py-4 rounded-2xl border flex justify-between items-center transition-colors ${
                      darkMode ? "bg-[#0f172a]/50 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}>
                      {isEditingName ? (
                        <input 
                          type="text" 
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)}
                          className={`bg-transparent outline-none w-full font-medium ${darkMode ? "text-white" : "text-slate-900"}`}
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium">{fullName}</span>
                      )}
                      <button onClick={() => setIsEditingName(!isEditingName)} className="text-blue-500 text-sm font-semibold hover:text-blue-600 transition-colors ml-4 whitespace-nowrap flex items-center gap-1">
                        {isEditingName ? <><FiCheck /> Save</> : <><FiEdit2 /> Edit</>}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                      <FiMail size={14} /> Email Address
                    </label>
                    <div className={`mt-2 w-full px-5 py-4 rounded-2xl border flex justify-between items-center transition-colors ${
                      darkMode ? "bg-[#0f172a]/50 border-slate-700" : "bg-slate-50 border-slate-200"
                    }`}>
                      {isEditingEmail ? (
                        <input 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)}
                          className={`bg-transparent outline-none w-full font-medium ${darkMode ? "text-white" : "text-slate-900"}`}
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium">{email}</span>
                      )}
                      <button onClick={() => setIsEditingEmail(!isEditingEmail)} className="text-blue-500 text-sm font-semibold hover:text-blue-600 transition-colors ml-4 whitespace-nowrap flex items-center gap-1">
                        {isEditingEmail ? <><FiCheck /> Save</> : <><FiEdit2 /> Edit</>}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button onClick={handleSaveDetails} disabled={isSaving} className="flex-1 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 flex justify-center items-center gap-2">
                    {isSaving ? <span className="animate-pulse">Saving...</span> : "Save Details"}
                  </button>
                  <button onClick={() => setShowLogoutModal(true)} className={`px-6 py-3.5 font-bold rounded-2xl border transition-all hover:-translate-y-0.5 flex items-center gap-2 ${darkMode ? "border-red-500/30 text-red-400 hover:bg-red-500/10" : "border-red-200 text-red-500 hover:bg-red-50"}`}>
                    <FiLogOut /> Log Out
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Appearance */}
              <div className={`p-8 rounded-3xl border transition-colors duration-500 h-fit ${
                darkMode ? "bg-[#1e293b]/50 border-white/10" : "bg-white border-slate-100 shadow-xl shadow-slate-200/40"
              }`}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FiSun className="text-orange-500" /> Appearance
                </h3>
                
                <div className="flex items-center justify-between mb-8 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div>
                    <p className="font-bold text-base flex items-center gap-2">
                      {darkMode ? <FiMoon className="text-blue-400"/> : <FiSun className="text-orange-400"/>} Dark Mode
                    </p>
                    <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Reduce eye strain in low light.</p>
                  </div>
                  <ToggleSwitch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                </div>

                <div className="px-4">
                  <p className="font-bold text-sm mb-4">Theme Color</p>
                  <div className="flex gap-5">
                    {themeColors.map((theme) => (
                      <button 
                        key={theme.name}
                        onClick={() => setSelectedTheme(theme.name)} 
                        className={`w-10 h-10 rounded-full ${theme.color} transition-all ${selectedTheme === theme.name ? `ring-4 ring-offset-4 ring-offset-transparent shadow-lg scale-110 ${theme.ring}` : 'opacity-50 hover:opacity-100 hover:scale-105'}`}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ================= FOCUS TAB ================= */}
          {activeTab === "focus" && (
            <>
              {/* LEFT COLUMN: Pomodoro Settings */}
              <div className={`p-8 rounded-3xl border transition-colors duration-500 ${
                darkMode ? "bg-[#1e293b]/50 border-white/10" : "bg-white border-slate-100 shadow-xl shadow-slate-200/40"
              }`}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FiClock className="text-blue-500" /> Timer Settings
                </h3>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-sm">Study Duration (min)</label>
                    <input 
                      type="number" 
                      value={studyDuration} 
                      onChange={(e) => setStudyDuration(e.target.value)}
                      className={`w-20 px-3 py-2 rounded-xl border text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                      }`} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-sm">Short Break (min)</label>
                    <input 
                      type="number" 
                      value={breakDuration} 
                      onChange={(e) => setBreakDuration(e.target.value)}
                      className={`w-20 px-3 py-2 rounded-xl border text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                      }`} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-sm">Long Break (min)</label>
                    <input 
                      type="number" 
                      value={longBreakDuration} 
                      onChange={(e) => setLongBreakDuration(e.target.value)}
                      className={`w-20 px-3 py-2 rounded-xl border text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                      }`} 
                    />
                  </div>
                </div>

                <div className={`h-px w-full my-6 ${darkMode ? "bg-white/5" : "bg-slate-100"}`}></div>

                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FiPlayCircle className="text-blue-500" /> Automation
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <p className="font-bold text-sm">Auto-start Breaks</p>
                      <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Start break automatically when study ends.</p>
                    </div>
                    <ToggleSwitch checked={autoStartBreak} onChange={() => setAutoStartBreak(!autoStartBreak)} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <p className="font-bold text-sm">Auto-start Sessions</p>
                      <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Start study automatically when break ends.</p>
                    </div>
                    <ToggleSwitch checked={autoStartSession} onChange={() => setAutoStartSession(!autoStartSession)} />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Notifications & Sound */}
              <div className={`p-8 rounded-3xl border transition-colors duration-500 h-fit ${
                darkMode ? "bg-[#1e293b]/50 border-white/10" : "bg-white border-slate-100 shadow-xl shadow-slate-200/40"
              }`}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FiBell className="text-red-500" /> Notifications & Sound
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <p className="font-bold text-sm flex items-center gap-2"><FiCalendar /> Exam Reminders</p>
                      <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Get notified 2 days before exams.</p>
                    </div>
                    <ToggleSwitch checked={notifExams} onChange={() => setNotifExams(!notifExams)} />
                  </div>

                  <div className={`h-px w-full my-2 ${darkMode ? "bg-white/5" : "bg-slate-100"}`}></div>

                  <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <p className="font-bold text-sm flex items-center gap-2"><FiCheckSquare /> Task Alerts</p>
                      <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Reminders for approaching deadlines.</p>
                    </div>
                    <ToggleSwitch checked={notifTasks} onChange={() => setNotifTasks(!notifTasks)} />
                  </div>

                  <div className={`h-px w-full my-2 ${darkMode ? "bg-white/5" : "bg-slate-100"}`}></div>

                  <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <p className="font-bold text-sm flex items-center gap-2"><FiVolume2 /> Timer Sound</p>
                      <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Play sound when timer finishes.</p>
                    </div>
                    <ToggleSwitch checked={soundEnabled} onChange={() => setSoundEnabled(!soundEnabled)} />
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all">
          <div className={`w-full max-w-sm p-8 rounded-3xl shadow-2xl transform scale-100 animate-in fade-in zoom-in-95 duration-200 ${
            darkMode ? "bg-slate-800 border border-slate-700 text-white" : "bg-white border border-slate-100 text-slate-900"
          }`}>
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 text-red-500 flex items-center justify-center mb-6 mx-auto">
              <FiLogOut size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-center">Log Out</h3>
            <p className={`mb-8 text-center text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Are you sure you want to log out?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className={`flex-1 py-3 font-bold rounded-xl transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-200" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}>
                Cancel
              </button>
              <button onClick={handleLogOut} className="flex-1 py-3 font-bold rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-colors">
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Settings;