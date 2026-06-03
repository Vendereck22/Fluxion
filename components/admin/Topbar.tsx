"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LuChevronRight, LuUser, LuLogOut, LuBell, LuMail, LuUserPlus } from "react-icons/lu";
import { useEffect, useState } from "react";
import { logout } from "@/app/actions/auth";
import { getTopbarNotifications, markNotificationsAsReadAction, type NotificationItem } from "@/app/actions/notifications";
import EditProfileModal from "./EditProfileModal";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROUTE_NAMES: Record<string, string> = {
  admin: "Dashboard",
  audit: "Audit des actions",
  team: "Équipe",
  services: "Services",
  partners: "Partenaires",
  inbox: "Boîte de réception",
  archives: "Archives",
  config: "Configuration",
  security: "Sécurité",
  newsletter: "Newsletter",
  products: "Produits",
  projects: "Projets",
};

export default function Topbar() {
  const pathname = usePathname() || "/admin";
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("admin@fluxion.cd");
  const [userName, setUserName] = useState("Super Administrateur");
  const [userAvatar, setUserAvatar] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userMiddleName, setUserMiddleName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return null;
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[2]) : null;
    };
    const email = getCookie("fluxion_user_email");
    const name = getCookie("fluxion_user_name");
    const avatar = getCookie("fluxion_user_avatar");
    const fName = getCookie("fluxion_user_firstname");
    const mName = getCookie("fluxion_user_middlename");
    const lName = getCookie("fluxion_user_lastname");
    setTimeout(() => {
      if (email) setUserEmail(email);
      if (name) setUserName(name);
      if (avatar) setUserAvatar(avatar);
      if (fName) setUserFirstName(fName);
      if (mName) setUserMiddleName(mName);
      if (lName) setUserLastName(lName);
    }, 0);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getTopbarNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => n.unread).length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotifications();
    }, 0);
    const interval = setInterval(fetchNotifications, 15000); // refresh every 15s
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markNotificationsAsReadAction();
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
      setUnreadCount(0);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    setNotificationsOpen(false);
    if (notification.type === "lead") {
      router.push("/admin/inbox");
    } else {
      router.push("/admin/newsletter");
    }
  };

  const formatNotificationTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("fr-FR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return "";
    }
  };

  const segments = pathname.split("/").filter(Boolean);
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 z-20 sticky top-0 select-none">

      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link
          href="/admin/login"
          className="hover:text-slate-900 transition-colors duration-200"
        >
          FLUXION
        </Link>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const name = ROUTE_NAMES[segment] || segment;
          const isLast = index === segments.length - 1;

          return (
            <div key={href} className="flex items-center gap-2">
              <LuChevronRight size={12} className="text-slate-400" />
              {isLast ? (
                <span className="text-slate-900 font-semibold">{name}</span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-slate-900 transition-colors duration-200"
                >
                  {name}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon-lg"
              className="relative rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              aria-label="Notifications"
            >
              <LuBell size={18} />
              <span className="sr-only">Notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-fluxion-pink-neon text-[8px] font-black text-white ring-2 ring-white animate-in zoom-in duration-300">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-80 max-h-[480px] rounded-xl border-slate-200 bg-white p-2 text-slate-950 shadow-xl sm:w-96"
          >
              <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between select-none">
                <span className="text-xs font-bold text-slate-900 font-inter uppercase tracking-wider">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={handleMarkAllAsRead}
                    className="h-auto px-2 py-1 text-[10px] font-bold text-fluxion-pink-neon hover:text-[#D10066]"
                  >
                    Tout marquer comme lu
                  </Button>
                )}
              </div>

              <div className="overflow-y-auto flex-1 divide-y divide-slate-100 select-text">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 font-inter select-none">
                    Aucune notification pour le moment.
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const isLead = notification.type === "lead";
                    return (
                      <DropdownMenuItem
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`cursor-pointer gap-3 rounded-lg p-3 text-left focus:bg-slate-50/80 ${
                          notification.unread ? "bg-slate-50/40 font-semibold" : ""
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isLead
                            ? "bg-pink-50 text-fluxion-pink-neon border border-pink-100"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}>
                          {isLead ? <LuMail size={14} /> : <LuUserPlus size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[11px] font-bold text-slate-900 truncate">
                              {notification.title}
                            </p>
                            <span className="text-[9px] text-slate-400 font-inter whitespace-nowrap flex-shrink-0">
                              {formatNotificationTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-[9px] text-slate-400 font-mono mt-1 truncate">
                            {notification.email}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="w-1.5 h-1.5 rounded-full bg-fluxion-pink-neon self-center flex-shrink-0" />
                        )}
                      </DropdownMenuItem>
                    );
                  })
                )}
              </div>

              <div className="p-1 border-t border-slate-100 bg-slate-50/50 rounded-b-lg select-none">
                <Link
                  href="/admin/inbox"
                  onClick={() => setNotificationsOpen(false)}
                  className="block w-full py-2 text-center text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors font-inter uppercase tracking-wider"
                >
                  Voir toute la boîte de réception
                </Link>
              </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon-lg"
              className="overflow-hidden rounded-full bg-slate-100 p-0 hover:bg-slate-200"
              aria-label="Profil administrateur"
            >
              <Avatar className="size-9">
                <AvatarImage src={userAvatar} alt="Avatar administrateur" />
                <AvatarFallback className="text-xs font-bold">
                  {initials || <LuUser size={18} />}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Profil administrateur</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-60 rounded-xl border-slate-200 bg-white p-2 text-slate-950 shadow-xl"
          >
              <DropdownMenuLabel className="px-3 py-2.5">
                <p className="text-xs font-bold text-slate-900">{userName}</p>
                <p className="mt-0.5 text-[10px] font-normal text-slate-500">{userEmail}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem
                onClick={() => {
                  setProfileModalOpen(true);
                }}
                className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 focus:bg-slate-50 focus:text-slate-900"
              >
                <LuUser size={14} className="text-slate-400" />
                <span>Modifier mon profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                variant="destructive"
                className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-xs font-medium"
              >
                <LuLogOut size={14} className="text-slate-400" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

      <EditProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        currentName={userName}
        currentEmail={userEmail}
        currentAvatarUrl={userAvatar}
        currentFirstName={userFirstName}
        currentMiddleName={userMiddleName}
        currentLastName={userLastName}
        onSuccess={(newName, newAvatarUrl, newEmail, newFirstName, newMiddleName, newLastName) => {
          setUserName(newName);
          setUserAvatar(newAvatarUrl);
          if (newEmail) setUserEmail(newEmail);
          if (newFirstName !== undefined) setUserFirstName(newFirstName);
          if (newMiddleName !== undefined) setUserMiddleName(newMiddleName);
          if (newLastName !== undefined) setUserLastName(newLastName);
        }}
      />
    </>
  );
}
