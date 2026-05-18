import React, { useState } from "react";

function Settings({ darkMode, setDarkMode }) {
  // --- KULLANICI BİLGİLERİ STATE'LERİ ---
  const [name, setName] = useState("Ahmet Yılmaz");
  const [email, setEmail] = useState("ahmet.yilmaz@email.com");
  
  // --- DÜZENLEME (EDIT) STATE'LERİ ---
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // --- TEMA VE BİLDİRİM STATE'LERİ ---
  const [themeColor, setThemeColor] = useState("blue");
  const [notifExams, setNotifExams] = useState(true); // Sınav bildirimleri varsayılan açık
  const [notifTasks, setNotifTasks] = useState(false); // Görev bildirimleri varsayılan kapalı
  
  // --- EFEKTLER VE MODAL STATE'LERİ ---
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // --- FONKSİYONLAR ---
  const handleProfileUpdate = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className={`p-2 md:p-6 w-full max-w-6xl mx-auto transition-colors duration-500 ${darkMode ? "text-white" : "text-slate-900"}`}>
        <h2 className="text-3xl font-extrabold mb-8 tracking-tight">Ayar Paneli</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* SOL SÜTUN: Profil Bilgileri */}
          <div className={`p-8 rounded-3xl border transition-colors duration-500 ${
            darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-100 shadow-xl shadow-slate-200/50"
          }`}>
            <h3 className="text-xl font-bold mb-8">Profil Bilgileri</h3>
            
            <div className="flex flex-col items-center mb-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-4 transition-all
                ${themeColor === "indigo" ? "bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-indigo-500/30" : ""}
                ${themeColor === "blue" ? "bg-gradient-to-tr from-blue-500 to-cyan-600 shadow-blue-500/30" : ""}
                ${themeColor === "emerald" ? "bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-emerald-500/30" : ""}
                ${themeColor === "orange" ? "bg-gradient-to-tr from-orange-500 to-red-600 shadow-orange-500/30" : ""}
              `}>
                {name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "US"}
              </div>
              <h4 className="text-2xl font-bold">Merhaba {name.split(" ")[0]}!</h4>
              <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Öğrenci</p>
            </div>
            
            <div className="space-y-5">
              {/* İsim Düzenleme Alanı */}
              <div>
                <label className={`text-xs font-bold uppercase tracking-widest ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Tam Ad</label>
                <div className={`mt-2 w-full px-5 py-4 rounded-2xl border flex justify-between items-center transition-colors ${
                  darkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
                }`}>
                  {isEditingName ? (
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className={`bg-transparent outline-none w-full font-medium ${darkMode ? "text-white" : "text-slate-900"}`}
                      autoFocus
                    />
                  ) : (
                    <span className="font-medium">{name}</span>
                  )}
                  <button 
                    onClick={() => setIsEditingName(!isEditingName)} 
                    className="text-blue-500 text-sm font-semibold hover:underline ml-4 whitespace-nowrap"
                  >
                    {isEditingName ? "Kaydet" : "Düzenle"}
                  </button>
                </div>
              </div>
              
              {/* E-Posta Düzenleme Alanı */}
              <div>
                <label className={`text-xs font-bold uppercase tracking-widest ${darkMode ? "text-slate-500" : "text-slate-400"}`}>E-Posta</label>
                <div className={`mt-2 w-full px-5 py-4 rounded-2xl border flex justify-between items-center transition-colors ${
                  darkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
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
                  <button 
                    onClick={() => setIsEditingEmail(!isEditingEmail)} 
                    className="text-blue-500 text-sm font-semibold hover:underline ml-4 whitespace-nowrap"
                  >
                    {isEditingEmail ? "Kaydet" : "Düzenle"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button 
                onClick={handleProfileUpdate} 
                disabled={isSaving}
                className="flex-1 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/30 hover:scale-[1.02] flex justify-center items-center"
              >
                {isSaving ? <span className="animate-pulse">Kaydediliyor...</span> : "Profili Güncelle"}
              </button>
              <button 
                onClick={() => setShowLogoutModal(true)} 
                className={`px-8 py-3.5 font-bold rounded-2xl border transition-all hover:scale-[1.02] ${
                  darkMode ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-200 text-red-500 hover:bg-red-50"
                }`}
              >
                Çıkış Yap
              </button>
            </div>
          </div>

          {/* SAĞ SÜTUN: Görünüm ve Bildirim Ayarları */}
          <div className="space-y-8">
            
            {/* Görünüm ve Tema */}
            <div className={`p-8 rounded-3xl border transition-colors duration-500 ${
              darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-100 shadow-xl shadow-slate-200/50"
            }`}>
              <h3 className="text-xl font-bold mb-6">Görünüm ve Tema</h3>
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="font-bold text-lg">Karanlık Mod</p>
                  <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Göz yorgunluğunu azalt.</p>
                </div>
                
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative w-16 h-9 rounded-full transition-colors duration-300 shadow-inner ${
                    darkMode ? "bg-blue-500" : "bg-slate-300"
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-7 h-7 rounded-full bg-white transition-transform duration-300 shadow-md ${
                    darkMode ? "translate-x-7" : "translate-x-0"
                  }`}></div>
                </button>
              </div>

              <div>
                <p className="font-bold mb-4">Renk Vurgusu</p>
                <div className="flex gap-4">
                  <button onClick={() => setThemeColor("indigo")} className={`w-10 h-10 rounded-full bg-indigo-500 transition-all ${themeColor === 'indigo' ? 'ring-4 ring-offset-2 ring-indigo-500/30 ring-offset-transparent shadow-lg scale-110' : 'opacity-40 hover:opacity-100'}`}></button>
                  <button onClick={() => setThemeColor("blue")} className={`w-10 h-10 rounded-full bg-blue-500 transition-all ${themeColor === 'blue' ? 'ring-4 ring-offset-2 ring-blue-500/30 ring-offset-transparent shadow-lg scale-110' : 'opacity-40 hover:opacity-100'}`}></button>
                  <button onClick={() => setThemeColor("emerald")} className={`w-10 h-10 rounded-full bg-emerald-500 transition-all ${themeColor === 'emerald' ? 'ring-4 ring-offset-2 ring-emerald-500/30 ring-offset-transparent shadow-lg scale-110' : 'opacity-40 hover:opacity-100'}`}></button>
                  <button onClick={() => setThemeColor("orange")} className={`w-10 h-10 rounded-full bg-orange-500 transition-all ${themeColor === 'orange' ? 'ring-4 ring-offset-2 ring-orange-500/30 ring-offset-transparent shadow-lg scale-110' : 'opacity-40 hover:opacity-100'}`}></button>
                </div>
              </div>
            </div>

            {/* BİLDİRİM AYARLARI (YENİ BÖLÜM) */}
            <div className={`p-8 rounded-3xl border transition-colors duration-500 ${
              darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-100 shadow-xl shadow-slate-200/50"
            }`}>
              <h3 className="text-xl font-bold mb-6">Bildirim Tercihleri</h3>
              
              <div className="space-y-6">
                {/* Sınav Bildirimleri */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">Sınav Hatırlatıcıları</p>
                    <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Yaklaşan sınavlar için 2 gün önceden bildirim al.
                    </p>
                  </div>
                  <button 
                    onClick={() => setNotifExams(!notifExams)}
                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 shadow-inner ${
                      notifExams ? "bg-blue-500" : "bg-slate-300"
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform duration-300 shadow-md ${
                      notifExams ? "translate-x-6" : "translate-x-0"
                    }`}></div>
                  </button>
                </div>

                {/* İki ayar arasına şık bir çizgi */}
                <div className={`h-px w-full ${darkMode ? "bg-white/10" : "bg-slate-100"}`}></div>

                {/* Görev Bildirimleri */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">Görev Hatırlatıcıları</p>
                    <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Süresi dolmak üzere olan ödev ve görevler için uyarı al.
                    </p>
                  </div>
                  <button 
                    onClick={() => setNotifTasks(!notifTasks)}
                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 shadow-inner ${
                      notifTasks ? "bg-blue-500" : "bg-slate-300"
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform duration-300 shadow-md ${
                      notifTasks ? "translate-x-6" : "translate-x-0"
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ÖZEL ÇIKIŞ YAP MODALI */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm p-8 rounded-3xl shadow-2xl ${
            darkMode ? "bg-slate-800 border border-slate-700 text-white" : "bg-white border border-slate-100 text-slate-900"
          }`}>
            <h3 className="text-2xl font-bold mb-2">Çıkış Yap</h3>
            <p className={`mb-8 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Hesabından çıkış yapmak istediğine emin misin?
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowLogoutModal(false)} className={`flex-1 py-3 font-bold rounded-xl ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"}`}>
                İptal
              </button>
              <button onClick={confirmLogout} className="flex-1 py-3 font-bold rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30">
                Evet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Settings;