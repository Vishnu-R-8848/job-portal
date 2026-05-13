import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { 
  Briefcase, 
  PlusCircle, 
  Users, 
  Calendar, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  X,
  FileText,
  MapPin,
  DollarSign
} from "lucide-react";
import api from "../config/api";

// Fallback data if backend is not ready
const defaultJobs = [
  { id: "JOB-101", title: "Senior React Developer", location: "Remote", type: "Full-time", applicants: 24, status: "Active", posted: "2d ago" },
  { id: "JOB-102", title: "UX/UI Designer", location: "New York, NY", type: "Hybrid", applicants: 12, status: "Active", posted: "5d ago" },
  { id: "JOB-103", title: "Backend Node.js Engineer", location: "Remote", type: "Full-time", applicants: 0, status: "Draft", posted: "-" },
];

const recentApplicants = [
  { id: "app1", name: "Alice Smith", role: "Senior React Developer", status: "In Review", time: "2 hours ago" },
  { id: "app2", name: "David Chen", role: "UX/UI Designer", status: "Interview", time: "5 hours ago" },
  { id: "app3", name: "Sarah Johnson", role: "Senior React Developer", status: "Applied", time: "1 day ago" },
];

const HRProfile = () => {
  const navigate = useNavigate();
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [jobsList, setJobsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getJobId = (job) => job._id || job.id;

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchHRData = async () => {
      try {
        const res = await api.get("/jobs/my-jobs");
        setJobsList(res.data?.jobs || res.data || []);
      } catch {
        setJobsList(defaultJobs);
        toast.error("Showing demo HR jobs until backend jobs API is ready");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHRData();
  }, []);

  // --- 2. HANDLERS ---
  const handleJobSubmit = (e) => {
    e.preventDefault();
    
    // Grab data from form (In real app, use controlled state or FormData)
    const title = e.target.title.value;
    
    // Fake job creation for UI
    const newJob = {
      id: `JOB-${Math.floor(Math.random() * 1000)}`,
      title: title,
      location: e.target.location.value,
      type: e.target.type.value,
      applicants: 0,
      status: "Active",
      posted: "Just now"
    };

    setJobsList([newJob, ...jobsList]);
    toast.success(`"${title}" has been published!`);
    setIsPostingJob(false);
  };

  const handleCloseJob = async (id, title) => {
    if(window.confirm(`Are you sure you want to close the listing for ${title}?`)) {
      try {
        await api.patch(`/jobs/${id}/status`, { status: "Closed" });
        setJobsList(prev => prev.map(job => getJobId(job) === id ? { ...job, status: "Closed" } : job));
        toast(`${title} is now closed.`);
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not close job");
      }
    }
  };

  const handleDeleteJob = async (id, title) => {
    if (window.confirm(`Delete ${title}? This cannot be undone.`)) {
      try {
        await api.delete(`/jobs/${id}`);
        setJobsList((prev) => prev.filter((job) => getJobId(job) !== id));
        toast.success("Job deleted");
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not delete job");
      }
    }
  };

  return (
    <div className="mt-8 space-y-6">
      
      {/* --- QUICK STATS ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-black">{jobsList.filter(j => j.status === 'Active').length}</p>
            <p className="text-sm font-bold text-muted-foreground">Active Listings</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-black">36</p>
            <p className="text-sm font-bold text-muted-foreground">Total Applicants</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-black">4</p>
            <p className="text-sm font-bold text-muted-foreground">Interviews Scheduled</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- MAIN COLUMN: JOB POSTINGS --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header & Post Button */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Recruitment Pipeline</h2>
              <p className="text-sm text-muted-foreground">Manage your open roles and listings</p>
            </div>
            {!isPostingJob && (
              <button onClick={() => navigate("/hr/jobs/new")} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
                <PlusCircle className="w-5 h-5" /> Post New Job
              </button>
            )}
          </div>

          {/* Posting Form */}
          {isPostingJob ? (
            <div className="bg-card border-2 border-primary/50 rounded-2xl p-6 shadow-md relative animate-in fade-in slide-in-from-top-4 duration-300">
              <button onClick={() => setIsPostingJob(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground bg-muted/50 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Create Job Listing
              </h2>
              
              <form onSubmit={handleJobSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Job Title</label>
                    <input name="title" type="text" required placeholder="e.g. Senior Frontend Engineer" className="w-full px-4 py-2.5 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input name="location" type="text" required placeholder="City, State or Remote" className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Employment Type</label>
                    <select name="type" className="w-full px-4 py-2.5 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary outline-none transition-all appearance-none cursor-pointer">
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Salary Range (Optional)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input name="salary" type="text" placeholder="e.g. $80k - $100k" className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1 pt-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Job Description</label>
                  <textarea required rows="4" placeholder="Describe the responsibilities and requirements..." className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary outline-none transition-all resize-none"></textarea>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-border/50">
                  <button type="button" onClick={() => setIsPostingJob(false)} className="px-6 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">Publish to Job Board</button>
                </div>
              </form>
            </div>
          ) : (
            
            /* Active Jobs List */
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground font-medium">Loading jobs...</div>
                ) : jobsList.length > 0 ? (
                  jobsList.map((job) => (
                    <div key={getJobId(job)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-border rounded-xl bg-muted/10 hover:bg-muted/30 transition-colors group">
                      
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${job.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.posted || "Recently"}</span>
                            <span className="font-medium text-foreground">{job.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t sm:border-t-0 border-border/50 pt-4 sm:pt-0">
                        <div className="text-center">
                          <p className="text-2xl font-black text-foreground">{job.applicants}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Applicants</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigate(`/jobs/${getJobId(job)}`)} className="text-sm font-bold bg-background border border-border px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                            View
                          </button>
                          <button onClick={() => navigate(`/hr/jobs/${getJobId(job)}/edit`)} className="text-sm font-bold bg-background border border-border px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                            Edit
                          </button>
                          {job.status === "Active" && (
                            <button onClick={() => handleCloseJob(getJobId(job), job.title)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Close Listing">
                              <X className="w-5 h-5" />
                            </button>
                          )}
                          <button onClick={() => handleDeleteJob(getJobId(job), job.title)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Delete Listing">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-bold text-foreground">No active listings</p>
                    <p className="text-muted-foreground mb-4">You haven't posted any jobs yet.</p>
                    <button onClick={() => navigate("/hr/jobs/new")} className="text-primary font-bold hover:underline">Create your first job post</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN: RECENT APPLICANTS --- */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Recent Applicants
            </h3>
            
            <div className="space-y-4">
              {recentApplicants.map((app) => (
                <div key={app.id} className="flex gap-3 items-start pb-4 border-b border-border/50 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground shrink-0 border border-border">
                    {app.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground truncate">{app.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{app.role}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        app.status === 'In Review' ? 'bg-orange-500/10 text-orange-600' :
                        app.status === 'Interview' ? 'bg-green-500/10 text-green-600' :
                        'bg-secondary text-secondary-foreground'
                      }`}>
                        {app.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{app.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-2.5 bg-muted/50 text-sm font-bold text-foreground rounded-xl hover:bg-muted transition-colors border border-border">
              View All Candidates
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HRProfile;
