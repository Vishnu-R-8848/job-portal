import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Building2,
  Trash2,
  Ban,
  CheckCircle,
  Briefcase,
  Loader2,
  ShieldAlert,
} from "lucide-react";

// Fallback data if the backend isn't ready
const defaultHRs = [
  {
    id: "hr1",
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@techcorp.com",
    company: "TechCorp",
    status: "Active",
    jobsCount: 12,
  },
  {
    id: "hr2",
    firstName: "Bob",
    lastName: "Jones",
    email: "bob@innovatellc.com",
    company: "InnovateLLC",
    status: "Active",
    jobsCount: 5,
  },
  {
    id: "hr3",
    firstName: "Charlie",
    lastName: "Brown",
    email: "charlie@startupx.com",
    company: "StartupX",
    status: "Suspended",
    jobsCount: 0,
  },
  {
    id: "hr4",
    firstName: "Diana",
    lastName: "Prince",
    email: "diana@amazon.com",
    company: "Amazon",
    status: "Active",
    jobsCount: 45,
  },
  {
    id: "hr5",
    firstName: "Evan",
    lastName: "Wright",
    email: "evan@tesla.com",
    company: "Tesla",
    status: "Active",
    jobsCount: 8,
  },
  {
    id: "hr6",
    firstName: "Fiona",
    lastName: "Gallagher",
    email: "fiona@global.com",
    company: "Global Inc",
    status: "Active",
    jobsCount: 2,
  },
];

const AdminProfile = () => {
  const [hrList, setHrList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchHRs = async () => {
      try {
        // Attempt to fetch from your real backend
        const res = await axios.get("http://localhost:3000/api/admin/hrs");

        if (res.data && res.data.length > 0) {
          setHrList(res.data);
        } else {
          setHrList(defaultHRs);
        }
      } catch {
        console.log("Backend not ready, using fallback HR data.");
        toast("Using local test data", { icon: "🔧" });
        setHrList(defaultHRs); // Fallback to the 6 default HRs
      } finally {
        setIsLoading(false);
      }
    };

    fetchHRs();
  }, []);

  // --- 2. CRUD OPERATIONS ---

  // Delete HR
  const handleDeleteHR = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${name} and all their posted jobs?`,
      )
    ) {
      try {
        // UNCOMMENT THIS WHEN BACKEND IS READY:
        // await axios.delete(`http://localhost:3000/api/admin/hrs/${id}`);

        // Update local UI state
        setHrList((prev) => prev.filter((hr) => hr.id !== id));
        toast.success(`${name} has been deleted.`);
      } catch {
        toast.error("Failed to delete HR.");
      }
    }
  };

  // Suspend or Activate HR (Force Logout / Block)
  const handleToggleStatus = async (id, currentStatus, name) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";

    try {
      // UNCOMMENT THIS WHEN BACKEND IS READY:
      // await axios.put(`http://localhost:3000/api/admin/hrs/${id}/status`, { status: newStatus });

      // Update local UI state
      setHrList((prev) =>
        prev.map((hr) => (hr.id === id ? { ...hr, status: newStatus } : hr)),
      );

      if (newStatus === "Suspended") {
        toast.error(`${name}'s account is now suspended.`);
      } else {
        toast.success(`${name}'s account has been reactivated.`);
      }
    } catch {
      toast.error("Failed to update status.");
    }
  };

  // View HR Jobs (Placeholder for expanding/routing)
  const handleManageJobs = (company) => {
    toast(`Opening job manager for ${company}...`, { icon: "💼" });
    // In the future, you could open a modal or navigate: navigate(`/admin/jobs?company=${company}`)
  };

  // --- 3. RENDER UI ---
  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm mt-8">
      <div className="px-6 py-5 border-b border-border bg-muted/20 flex justify-between items-center">
        <h2 className="text-xl font-black text-foreground flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-destructive" /> HR Management
          Console
        </h2>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Total HRs: {hrList.length}
        </span>
      </div>

      <div className="p-0 overflow-x-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-primary">
            <Loader2 className="animate-spin w-8 h-8 mb-2" />
            <span className="font-bold">Fetching secure data...</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-bold">
              <tr>
                <th className="px-6 py-4">HR Profile</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4 text-center">Active Jobs</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {hrList.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-muted-foreground italic font-medium"
                  >
                    No HR accounts found in the database.
                  </td>
                </tr>
              ) : (
                hrList.map((hr) => (
                  <tr
                    key={hr.id}
                    className={`transition-colors group ${hr.status === "Suspended" ? "bg-destructive/5" : "hover:bg-muted/20"}`}
                  >
                    {/* HR Info */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground">
                        {hr.firstName} {hr.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {hr.email}
                      </p>
                    </td>

                    {/* Company */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 font-bold text-sm bg-secondary px-3 py-1.5 rounded-lg border border-border/50">
                        <Building2 className="w-3.5 h-3.5 text-primary" />{" "}
                        {hr.company}
                      </span>
                    </td>

                    {/* Jobs Count */}
                    <td className="px-6 py-4 text-center">
                      <span className="font-black text-lg text-foreground">
                        {hr.jobsCount}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      {hr.status === "Active" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full uppercase">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-destructive bg-destructive/10 border border-destructive/20 px-2.5 py-1 rounded-full uppercase">
                          <Ban className="w-3 h-3" /> Suspended
                        </span>
                      )}
                    </td>

                    {/* CRUD Actions */}
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleManageJobs(hr.company)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                        title="Manage Company Jobs"
                      >
                        <Briefcase className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          handleToggleStatus(hr.id, hr.status, hr.firstName)
                        }
                        className={`p-2 transition-colors rounded-lg ${hr.status === "Active" ? "text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10" : "text-orange-500 bg-orange-500/10 hover:bg-orange-500/20"}`}
                        title={
                          hr.status === "Active"
                            ? "Suspend HR"
                            : "Reactivate HR"
                        }
                      >
                        <Ban className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteHR(hr.id, hr.firstName)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                        title="Delete HR"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
