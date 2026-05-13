import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Users,
  UserPlus,
  UserCheck,
  Search,
  Building2,
  MapPin,
  Loader2,
  Briefcase,
} from "lucide-react";

// --- DEMO DATA FALLBACK ---
const demoNetworkData = [
  {
    id: "net1",
    name: "Sarah Jenkins",
    role: "Senior Tech Recruiter",
    company: "TechCorp",
    location: "San Francisco, CA",
    mutual: 12,
    isFollowing: false,
  },
  {
    id: "net2",
    name: "David Chen",
    role: "Frontend Developer",
    company: "InnovateLLC",
    location: "Remote",
    mutual: 3,
    isFollowing: true,
  },
  {
    id: "net3",
    name: "Emily Rodriguez",
    role: "Product Manager",
    company: "StartupX",
    location: "New York, NY",
    mutual: 8,
    isFollowing: false,
  },
  {
    id: "net4",
    name: "Michael Chang",
    role: "UX Researcher",
    company: "Global Inc",
    location: "London, UK",
    mutual: 1,
    isFollowing: false,
  },
  {
    id: "net5",
    name: "Jessica Taylor",
    role: "HR Director",
    company: "Amazon",
    location: "Seattle, WA",
    mutual: 45,
    isFollowing: true,
  },
  {
    id: "net6",
    name: "Robert Wilson",
    role: "Backend Engineer",
    company: "Tesla",
    location: "Austin, TX",
    mutual: 0,
    isFollowing: false,
  },
  {
    id: "net7",
    name: "Anita Patel",
    role: "Engineering Manager",
    company: "Google",
    location: "Bengaluru, India",
    mutual: 24,
    isFollowing: false,
  },
  {
    id: "net8",
    name: "Marcus Johnson",
    role: "UI/UX Designer",
    company: "Freelance",
    location: "Remote",
    mutual: 5,
    isFollowing: true,
  },
];

const NetworkPage = () => {
  const [networkUsers, setNetworkUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("discover"); // 'discover' or 'following'

  // --- 1. FETCH DATA (API OR DEMO) ---
  useEffect(() => {
    const fetchNetwork = async () => {
      setIsLoading(true);
      try {
        // UNCOMMENT THIS WHEN YOUR BACKEND IS READY:
        // const token = localStorage.getItem("accessToken");
        // const res = await axios.get("http://localhost:3000/api/network/suggestions", {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // setNetworkUsers(res.data);

        // Simulating network delay for Demo Data
        setTimeout(() => {
          setNetworkUsers(demoNetworkData);
          setIsLoading(false);
        }, 800);
      } catch {
        console.error("API failed, loading demo data...");
        setNetworkUsers(demoNetworkData);
        setIsLoading(false);
      }
    };

    fetchNetwork();
  }, []);

  // --- 2. HANDLERS ---
  const handleToggleFollow = (userId, userName, currentState) => {
    // 1. Update the local UI state instantly for a snappy feel
    setNetworkUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isFollowing: !currentState } : user,
      ),
    );

    // 2. Show the correct Toast message
    if (!currentState) {
      toast.success(`You are now following ${userName}`);
    } else {
      toast(`Unfollowed ${userName}`, { icon: "👋" });
    }

    // 3. TODO: Send the update to your backend
    // axios.post(`http://localhost:3000/api/network/follow/${userId}`);
  };

  // --- 3. FILTER LOGIC ---
  const filteredUsers = networkUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === "discover" ? true : user.isFollowing;

    return matchesSearch && matchesTab;
  });

  // --- RENDER UI ---
  return (
    <div className="min-h-screen bg-background pb-20 pt-8 px-4 sm:px-6 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* --- HEADER & SEARCH --- */}
        <div className="bg-card border-2 border-border rounded-[32px] p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left w-full lg:w-auto">
              <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2 flex items-center justify-center lg:justify-start gap-3">
                <Users className="w-8 h-8 text-primary" /> My Network
              </h1>
              <p className="text-muted-foreground font-medium">
                Connect with industry professionals and recruiters.
              </p>
            </div>

            <div className="w-full lg:w-96 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, role, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border-2 border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium"
              />
            </div>
          </div>

          {/* TABS */}
          <div className="flex border-b border-border mt-8 gap-6">
            <button
              onClick={() => setActiveTab("discover")}
              className={`pb-4 text-sm font-black tracking-wider uppercase transition-colors relative ${activeTab === "discover" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Discover
              {activeTab === "discover" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`pb-4 text-sm font-black tracking-wider uppercase transition-colors relative ${activeTab === "following" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Following ({networkUsers.filter((u) => u.isFollowing).length})
              {activeTab === "following" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>
              )}
            </button>
          </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="font-bold">Loading network...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-card border-2 border-border rounded-[24px] p-6 shadow-sm hover:border-primary/50 hover:shadow-md transition-all group flex flex-col"
              >
                {/* User Avatar & Info */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mb-4 border-4 border-background shadow-sm group-hover:scale-105 transition-transform">
                    <span className="text-2xl font-black text-primary uppercase">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-black text-lg text-foreground mb-1 leading-tight">
                    {user.name}
                  </h3>
                  <p className="text-sm font-bold text-muted-foreground line-clamp-1">
                    {user.role}
                  </p>
                </div>

                {/* Company & Location Badges */}
                <div className="flex flex-col gap-2 mb-6 mt-auto">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground bg-muted/50 px-3 py-2 rounded-xl border border-border">
                    <Building2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="truncate">{user.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-muted/20 px-3 py-2 rounded-xl border border-border">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate">{user.location}</span>
                  </div>
                </div>

                {/* Mutuals & Action Button */}
                <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-2 mt-auto">
                  <div className="text-xs font-bold text-muted-foreground">
                    {user.mutual > 0 ? (
                      <span>
                        <span className="text-foreground">{user.mutual}</span>{" "}
                        mutuals
                      </span>
                    ) : (
                      <span>New connection</span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      handleToggleFollow(user.id, user.name, user.isFollowing)
                    }
                    className={`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center shadow-sm shrink-0
                      ${
                        user.isFollowing
                          ? "bg-secondary text-secondary-foreground border-2 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    title={user.isFollowing ? "Unfollow" : "Follow"}
                  >
                    {user.isFollowing ? (
                      <UserCheck className="w-5 h-5" />
                    ) : (
                      <UserPlus className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-[32px] bg-muted/10">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-border">
              <Users className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-2">
              No users found
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {activeTab === "following"
                ? "You aren't following anyone that matches this search."
                : "Try adjusting your search terms to find professionals."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkPage;
