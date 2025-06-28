import { User } from "@/types/user";
import { Bell, Palette, Settings, Shield, UserIcon, X } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useAuthStore } from "@/stores/useAuthStore";

interface SettingsModalProps {
  onComplete: () => void;
  isOpen: boolean;
  currentUser: User;
}
type SettingSection = "general" | "account" | "security" | "notifications";

export function SettingsModal() {
  const [activeSection, setActiveSection] = useState<SettingSection>("general");
  const {isOpen, setIsOpen} = useSettingsStore();
  const {user} = useAuthStore();

  const [animateIn, setAnimateIn] = useState(false);
  const closeRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (closeRef.current && !closeRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);


  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  const onComplete = () => {
    setAnimateIn(false);
    setTimeout(() => setIsOpen(false), 150);
  };

  if (!user) {
    return null; 
  }
  if (!isOpen) return null;
  
  return (
    <section 
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-100 ease-in-out
        ${animateIn ? 'bg-black/50 opacity-100' : 'bg-black/0 opacity-0'}
      `}
    > 
      <div 
        ref={closeRef}
        className={`
          bg-card rounded-lg w-full max-w-4xl h-[600px] flex overflow-hidden
          transition-transform duration-150 ease-out
          ${animateIn ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}
        `}
      >
        <SettingSidebar
          onComplete={onComplete}
          activeSection={activeSection}
          OnSectionChange={setActiveSection}
        />
        <div className="flex-1 flex flex-col">
          <SettingHeader activeSection={activeSection} />
          <div className="flex-1 overflow-y-auto p-6">
            <SettingContent activeSection={activeSection} user={user} />
          </div>
          <SettingFooter />
        </div>
      </div>
    </section>
  );
}

function SettingHeader({ activeSection }: { activeSection: SettingSection }) {
  const sectionTitles: Record<SettingSection, string> = {
    general: "Configuración General",
    account: "Cuenta",
    security: "Seguridad",
    notifications: "Notificaciones",
  };

  const sectionSubtitles: Record<SettingSection, string> = {
    general: "Ajusta las preferencias generales de la aplicación.",
    account: "Gestiona la información de tu cuenta.",
    security: "Configura la seguridad de tu cuenta.",
    notifications: "Personaliza tus notificaciones.",
  };

  return (
    <header className="flex items-center justify-between mb-4 border-b pb-2">
      <div>
        <h1 className="text-2xl font-bold">{sectionTitles[activeSection]}</h1>
        <p className="text-gray-500 text-sm">{sectionSubtitles[activeSection]}</p>
      </div>
      {/* Botón de guardar eliminado del header */}
    </header>
  );
}
function SettingSidebar({
  activeSection,
  OnSectionChange,
  onComplete,
}: {
  activeSection: SettingSection;
  OnSectionChange: (section: SettingSection) => void;
  onComplete: () => void;
}) {
  const sections = [
    { id: "general" as const, label: "General", icon: Settings },
    { id: "account" as const, label: "Account", icon: UserIcon },
    { id: "security" as const, label: "Security", icon: Shield },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  return (
    <aside className="w-32 min-w-[175px] h-auto rounded-lg mr-6 bg-gray-50 flex-shrink-0">
      <div className="flex justify-start p-3  border-b border-gray-200">
        <button
          className="p-1.5 rounded-full hover:bg-gray-200 transition-all duration-200 group"
          onClick={onComplete}
        >
          <X className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
        </button>
      </div>

      <nav className="flex flex-col gap-1 p-3 w-fit overflow-y-auto ">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              className="w-full text-left group  "
              onClick={() => OnSectionChange(section.id)}
            >
              <div
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-colors duration-200 ease-out min-h-10
                  ${
                    isActive
                      ? "bg-gray-200 text-black"
                      : "text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                <Icon
                  className={`
                                 size-3 shrink-0 transition-colors duration-200
                                 ${isActive ? "text-black" : "text-gray-500 hover:text-gray-700"}
                               `}
                />
                <span className="text-sm font-medium whitespace-nowrap">
                  {section.label}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export function SettingContent({
  activeSection,
  user,
}: {
  activeSection: SettingSection;
  user: User;
}) {
  switch (activeSection) {
    case "general":
      return <GeneralSettings />;
    case "account":
      return <AccountSettings user={user} />;
    case "security":
      return <SecuritySettings />;
    case "notifications":
      return <NotificationSettings />;
    default:
      return null;
  }
}
function GeneralSettings() {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("es");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  return (
    <div>
      <h2 className="text-lg font-semibold">General Settings</h2>
      <p className="mb-4">Here you can adjust general settings for the application.</p>

      {/* Cambiar tema */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Tema</label>
        <select
          className="border rounded px-2 py-1"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="light">Claro</option>
          <option value="dark">Oscuro</option>
        </select>
      </div>

      {/* Cambiar idioma */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Idioma</label>
        <select
          className="border rounded px-2 py-1"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="es">Español</option>
          <option value="en">Inglés</option>
        </select>
      </div>

      {/* Cambiar formato de fecha */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Formato de fecha</label>
        <select
          className="border rounded px-2 py-1"
          value={dateFormat}
          onChange={(e) => setDateFormat(e.target.value)}
        >
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>
    </div>
  );
}

function AccountSettings({ user }: { user: User }) {
  // Estados locales para edición simple
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user.avatar_url || ""} alt={user.username} />
          <AvatarFallback>
            {user.username?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold">{user.username}</p>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre de usuario</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-white text-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-white text-gray-700"
          />
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div>
      <h2 className="text-lg font-semibold">Security Settings</h2>
      <p>Here you can manage your security settings.</p>
      {/* Add more security settings options here */}
    </div>
  );
}


function NotificationSettings() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Notificaciones</h2>
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={emailNotif}
            onChange={() => setEmailNotif(!emailNotif)}
            className="accent-blue-600"
          />
          Recibir notificaciones por correo electrónico
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={pushNotif}
            onChange={() => setPushNotif(!pushNotif)}
            className="accent-blue-600"
          />
          Recibir notificaciones push
        </label>
      </div>
    </div>
  );
}

export function SettingFooter() {
  return (
    <div className="w-full flex justify-end items-center gap-2 p-4 border-t">
      <button
        className="bg-[#673ab7]  hover:bg-[#592E83] text-white px-4 py-1.5 rounded  transition"
  
        // onClick={handleSave} // Aquí puedes conectar la lógica de guardado
      >
        Guardar cambios
      </button>
    </div>
  );
}