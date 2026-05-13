import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { unsaveJob } from "../features/AuthSlice";
import {
  Briefcase,
  Bookmark,
  CheckCircle2,
  Clock,
  FileText,
  ChevronRight,
  Trash2,
  Building2,
  MapPin,
  TrendingUp,
} from "lucide-react";

// Fallback Mock Database:
// In a real app, you would fetch these details from your backend using the IDs in Redux.
const mockJobDetails = {
  "int-1": {
    title: "Senior Frontend Engineer",
    company: "TechCorp",
    location: "Remote",
    status: "In Review",
  },
  "int-2": {
    title: "UI/UX Designer",
    company: "InnovateLLC",
    location: "New York, USA",
    status: "Interviewing",
  },
  "int-3": {
    title: "Full Stack Developer",
    company: "StartupX",
    location: "Remote",
    status: "Applied",
  },
  "ext-1": {
    title: "Software Engineer",
    company: "Google",
    location: "Bengaluru, India",
    status: "Applied",
  },
};

const CandidateProfile = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Safely grab the arrays from Redux state
  const appliedJobsIds = user?.candidateProfile?.appliedJobs || [];
  const savedJobsIds = user?.candidateProfile?.savedJobs || [];

  const handleUnsave = (id, title) => {
    dispatch(unsaveJob(id));
    toast.success(`${title} removed from saved jobs.`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Interviewing":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "In Review":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  return (
    <div className="mt-8 space-y-6 animate-in fade-in duration-500">
      {/* --- QUICK STATS ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-black">{appliedJobsIds.length}</p>
            <p className="text-sm font-bold text-muted-foreground">
              Total Applications
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-secondary-foreground">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-black">{savedJobsIds.length}</p>
            <p className="text-sm font-bold text-muted-foreground">
              Saved Jobs
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="w-full pr-4">
            <p className="text-lg font-black mb-1">Profile Strength</p>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-[85%]"></div>
            </div>
            <p className="text-xs font-bold text-muted-foreground mt-1 text-right">
              85% Complete
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- MAIN COLUMN: APPLICATIONS --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="text-primary w-5 h-5" /> Application
                  History
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Track the status of your recent job applications
                </p>
              </div>
              <button
                onClick={() => navigate("/browse-jobs")}
                className="text-sm font-bold text-primary hover:underline hidden sm:block"
              >
                Find more jobs
              </button>
            </div>

            <div className="space-y-4">
              {appliedJobsIds.length > 0 ? (
                appliedJobsIds.map((jobId) => {
                  // Fallback to generic text if ID isn't in our mock DB
                  const job = mockJobDetails[jobId] || {
                    title: `Job Reference #${jobId}`,
                    company: "Unknown Company",
                    location: "N/A",
                    status: "Applied",
                  };

                  return (
                    <div
                      key={jobId}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-border rounded-xl bg-background hover:border-primary/50 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center shrink-0 font-black text-xl text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {job.company.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1 font-medium text-foreground">
                              <Building2 className="w-3.5 h-3.5" />{" "}
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> {job.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-border/50">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(job.status)}`}
                        >
                          {job.status}
                        </span>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/10">
                  <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-border">
                    <Briefcase className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    No applications yet
                  </p>
                  <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                    Your application history will appear here once you start
                    applying for roles.
                  </p>
                  <button
                    onClick={() => navigate("/browse-jobs")}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Browse Jobs
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: SAVED JOBS & RESUME --- */}
        <div className="space-y-6">
          {/* Saved Jobs Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Bookmark className="text-secondary-foreground w-5 h-5" /> Saved
              Jobs
            </h2>

            <div className="space-y-3">
              {savedJobsIds.length > 0 ? (
                savedJobsIds.map((jobId) => {
                  const job = mockJobDetails[jobId] || {
                    title: `Job #${jobId}`,
                    company: "Unknown",
                  };
                  return (
                    <div
                      key={jobId}
                      className="flex items-center justify-between gap-3 p-3 border border-border rounded-xl hover:bg-muted/30 transition-colors group"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-foreground truncate">
                          {job.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {job.company}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/jobs/${jobId}`)}
                          className="p-1.5 text-muted-foreground hover:text-primary bg-background rounded-md border border-border shadow-sm"
                          title="View Job"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUnsave(jobId, job.title)}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 bg-background rounded-md border border-border shadow-sm transition-colors"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-sm italic text-center py-6 bg-muted/20 rounded-xl border border-border border-dashed">
                  You haven't saved any jobs yet.
                </p>
              )}
            </div>
          </div>

          {/* Resume / Documents Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="text-primary w-5 h-5" /> My Resume
            </h2>
            <div className="border border-border rounded-xl p-4 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm">Vishnu_Resume_2026.pdf</p>
                  <p className="text-xs text-muted-foreground">
                    Updated 2 days ago
                  </p>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2 border border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors text-sm">
              Update Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
