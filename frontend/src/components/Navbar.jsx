import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../features/AuthSlice";
import {
  Bell,
  LayoutDashboard,
  Briefcase,
  Building2,
  AlertTriangle,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [toggleNotification, setToggleNotification] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user } = useSelector((state) => state.isAuth);

  const navBarItems = [
    { name: "browse jobs", path: "/browse-jobs" },
    { name: "companies", path: "/companies" },
    { name: "message", path: "/messages" },
  ];

  const handleNotificationToggle = () => {
    if (!toggleNotification) {
      toast("Notifications opened", { icon: "🔔" });
    }
    setToggleNotification(!toggleNotification);
  };

  const notifications = [
    {
      id: 1,
      type: "job",
      title: "New Job Match: Senior UI Designer",
      time: "2h",
      desc: "TechFlow has a new opening that matches your profile. Competitive salary and remote options.",
      unread: true,
      primaryAction: "View",
    },
    {
      id: 2,
      type: "application",
      title: "Application Update: Lead Architect",
      time: "5h",
      desc: "Your application for Lead Architect at Vertex Solutions has moved to the final round.",
      unread: true,
      primaryAction: "Schedule",
    },
    {
      id: 3,
      type: "message",
      title: "Message from Sarah",
      time: "1d",
      desc: '"Hey! I just saw your portfolio update..."',
      unread: false,
      primaryAction: "Reply",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    },
    {
      id: 4,
      type: "alert",
      title: "Profile Action Required",
      time: "3d",
      desc: "Your identity verification document has expired. Please upload a new ID.",
      unread: false,
      primaryAction: "Update Now",
    },
  ];

  // --- FILTER LOGIC FOR TABS ---
  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "All") return true;
    // Categorize jobs and system alerts as "Automation"
    if (activeTab === "Automation")
      return ["job", "alert"].includes(notif.type);
    // Categorize messages and applications as "Manual" user activity
    if (activeTab === "Manual")
      return ["application", "message"].includes(notif.type);
    return true;
  });

  const renderIcon = (notif) => {
    if (notif.type === "message" && notif.avatar) {
      return (
        <img
          src={notif.avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
        />
      );
    }

    const iconClasses = "w-5 h-5";
    let IconComp;
    let bgClass;

    switch (notif.type) {
      case "job":
        IconComp = Briefcase;
        bgClass = "bg-primary/10 text-primary";
        break;
      case "application":
        IconComp = Building2;
        bgClass = "bg-secondary text-secondary-foreground";
        break;
      case "alert":
        IconComp = AlertTriangle;
        bgClass = "bg-destructive/10 text-destructive";
        break;
      default:
        IconComp = Bell;
        bgClass = "bg-muted text-muted-foreground";
    }

    return (
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bgClass}`}
      >
        <IconComp className={iconClasses} />
      </div>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-between relative px-4 py-3 bg-background border-b border-border z-50">
      <div
        className="logo flex gap-2 items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="bg-primary text-primary-foreground px-2 py-1 rounded-lg font-bold tracking-wider">
          JP
        </div>
        <div className="text-lg md:text-xl font-bold text-foreground">
          jobPortal
        </div>
      </div>

      <div className="nav-links hidden lg:flex items-center gap-6 lg:gap-8 capitalize text-sm font-medium">
        {navBarItems.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-foreground transition-colors"
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      <div className="search-bar w-full max-w-sm hidden lg:block mx-4 xl:mx-8">
        <input
          type="text"
          placeholder="Search jobs..."
          className="w-full bg-muted/50 border border-border rounded-full px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all"
        />
      </div>

      <div className="profile-controls  flex items-center gap-2 md:gap-4">
        {/* NOTIFICATION WRAPPER */}
        <div className="relative ">
          <button
            onClick={handleNotificationToggle}
            className={`p-2 rounded-full transition-colors relative ${toggleNotification ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
          </button>

          {/* NOTIFICATION PANEL - RESPONSIVE FIX */}
          {toggleNotification && (
            <div className="fixed top-16 left-3 right-3 sm:absolute sm:top-12 sm:left-auto sm:right-0 sm:w-[420px] bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 className="font-bold text-foreground">Notifications</h3>
                <button className="text-xs font-semibold text-primary hover:underline">
                  Mark all as read
                </button>
              </div>

              <div className="px-5 py-3">
                <div className="flex bg-muted/50 p-1 rounded-xl">
                  {["All", "Automation", "Manual"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${
                        activeTab === tab
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto flex flex-col divide-y divide-border">
                {/* RENDER FILTERED ARRAY */}
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-5 flex gap-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="relative pt-1">
                        {renderIcon(notif)}
                        {notif.unread && (
                          <span className="absolute top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card"></span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4
                            className={`text-sm font-bold ${notif.type === "alert" ? "text-destructive" : "text-foreground"}`}
                          >
                            {notif.title}
                          </h4>
                          <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap ml-2">
                            {notif.time}
                          </span>
                        </div>

                        <p
                          className={`text-xs leading-relaxed mb-3 ${notif.type === "message" ? "italic text-muted-foreground bg-muted p-2 rounded-lg mt-2" : "text-muted-foreground"}`}
                        >
                          {notif.desc}
                        </p>

                        <div className="flex gap-2">
                          {notif.type !== "alert" && (
                            <button className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
                              {notif.primaryAction}
                            </button>
                          )}
                          <button className="bg-background border border-border text-foreground text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-muted transition-colors">
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No {activeTab.toLowerCase()} notifications right now.
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-border bg-muted/20 text-center">
                <button className="text-xs font-bold text-foreground hover:text-primary transition-colors">
                  See all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <NavLink to="/dashboard">
          <button className="bg-primary/10 text-primary p-2 rounded-full hover:bg-primary/20 transition-colors hidden sm:block">
            <LayoutDashboard className="w-5 h-5" />
          </button>
        </NavLink>

        <div
          className="profile-img cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <img
            src={
              user?.image ||
              "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop"
            }
            alt="profile"
            className="w-9 h-9 rounded-full object-cover border-2 border-border hover:border-primary transition-colors"
          />
        </div>

        <button
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground ml-1 shrink-0"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-card border-b border-border shadow-lg flex flex-col items-center py-6 gap-6 z-40 lg:hidden">
          <button
            onClick={() => {
              localStorage.removeItem("accessToken");
              // localStorage.removeItem("user");

              dispatch(removeUser());

              toast.success("Logged out successfully");

              navigate("/auth/login");
            }}
            className="lg:flex hidden flex-col items-center justify-center gap-1 md:gap-1.5 w-full px-4 md:px-0 md:py-4 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-200 border-t-2 md:border-t-0 md:border-l-2 border-transparent hover:border-destructive"
          >
            <LogOut className="w-5 h-5 mb-0 md:mb-1 shrink-0" />

            <span className="text-[9px] lg:text-[10px] uppercase tracking-wider font-semibold hidden md:block text-center px-1 break-words">
              Logout
            </span>
          </button>
          <div className="w-full px-6">
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full bg-muted/50 border border-border rounded-full px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all"
            />
          </div>
          {navBarItems.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-lg font-medium capitalize transition-colors ${isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
