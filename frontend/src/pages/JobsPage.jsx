import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Briefcase, Building2, MapPin, MoreVertical, Clock, BookmarkMinus, ExternalLink } from "lucide-react";
import { unsaveJob, addNotification } from "../features/AuthSlice";
import toast from "react-hot-toast";

// --- MOCK INTERNAL DATA ---
const internalJobs = [
  { id: "int-1", title: "Senior Frontend Engineer", company: "TechCorp", location: "Remote", type: "Full-time", isInternal: true },
  { id: "int-2", title: "UI/UX Designer", company: "InnovateLLC", location: "New York, USA", type: "Contract", isInternal: true },
  { id: "int-3", title: "Full Stack Developer", company: "StartupX", location: "Remote", type: "Full-time", isInternal: true },
  { id: "int-4", title: "Backend Developer", company: "DataSys", location: "London, UK", type: "Part-time", isInternal: true },
  { id: "int-5", title: "Product Manager", company: "BuildIt", location: "San Francisco, CA", type: "Full-time", isInternal: true },
  { id: "int-6", title: "DevOps Engineer", company: "CloudNet", location: "Remote", type: "Full-time", isInternal: true },
  { id: "int-7", title: "QA Tester", company: "BugFree", location: "Austin, TX", type: "Contract", isInternal: true }
];

const JobsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("applied");

  // 1. GET IDS FROM REDUX
  const { user } = useSelector((state) => state.isAuth);
  const appliedJobIds = user?.candidateProfile?.appliedJobs || [];
  const savedJobIds = user?.candidateProfile?.savedJobs || []; // NEW: Get Saved IDs

  // 2. GET MASTER JOB LIST
  const [allAvailableJobs, setAllAvailableJobs] = useState(internalJobs);

  useEffect(() => {
    // Pull the external jobs we saved in BrowseJobs
    const cachedJobs = localStorage.getItem("rapidApiJobs"); // Matched to BrowseJobs localstorage key
    if (cachedJobs) {
      setAllAvailableJobs([...internalJobs, ...JSON.parse(cachedJobs)]);
    }
  }, []);

  // 3. THE 2 DUMMY CARDS (Always at the top for applied)
  const dummyJobs = [
    { id: "dummy-1", title: "Frontend Developer", company: "TechCorp", status: "In Review", appliedDate: "2 days ago", location: "Bangalore, India" },
    { id: "dummy-2", title: "UI/UX Designer", company: "InnovateLLC", status: "Interview", appliedDate: "1 week ago", location: "Remote" },
  ];

  // 4. MAP REDUX IDS TO REAL JOB DATA
  const dynamicAppliedJobs = allAvailableJobs
    .filter((job) => appliedJobIds.includes(job.id))
    .map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      status: "Submitted",     
      appliedDate: "Just now", 
    }));

  // NEW: MAP SAVED JOBS
  const dynamicSavedJobs = allAvailableJobs.filter((job) => savedJobIds.includes(job.id));

  // 5. MERGE APPLIED JOBS
  const combinedJobs = [...dummyJobs, ...dynamicAppliedJobs];

  // --- HANDLERS ---
  const handleRemoveSavedJob = (e, jobId, jobTitle) => {
    e.stopPropagation();
    dispatch(unsaveJob(jobId));
    dispatch(addNotification({ message: `Removed ${jobTitle} from saved jobs`, type: "info" }));
    toast.success("Job removed");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 pb-24">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">My Jobs</h1>
        <p className="text-muted-foreground mt-2 text-lg">Track your job applications and saved opportunities.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border mb-8">
        <button
          onClick={() => setActiveTab("applied")}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === "applied" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Applied Jobs ({combinedJobs.length})
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === "saved" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Saved Jobs ({dynamicSavedJobs.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === "applied" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {combinedJobs.map((job) => (
            <div 
              key={job.id} 
              className="group bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{job.company}</p>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-border/50 text-xs font-semibold text-muted-foreground">
                <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> {job.location}
                </span>
                <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Applied {job.appliedDate}
                </span>
                
                <span className={`ml-auto px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                  job.status === "Interview" ? "bg-green-500/10 text-green-600 border border-green-500/20" :
                  job.status === "In Review" ? "bg-blue-500/10 text-blue-600 border border-blue-500/20" :
                  "bg-primary/10 text-primary border border-primary/20" 
                }`}>
                  {job.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* SAVED JOBS TAB */
        dynamicSavedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dynamicSavedJobs.map((job) => (
              <div 
                key={job.id} 
                className="group bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => job.isInternal ? navigate(`/jobs/${job.id}`) : window.open(job.redirect_url, "_blank")}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
                        <p className="text-sm font-medium text-muted-foreground line-clamp-1">{job.company}</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleRemoveSavedJob(e, job.id, job.title)}
                      className="text-muted-foreground hover:text-destructive bg-muted/50 hover:bg-destructive/10 transition-colors p-2 rounded-full"
                      title="Remove from saved"
                    >
                      <BookmarkMinus className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-semibold text-muted-foreground">
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> {job.location}
                    </span>
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3" /> {job.type}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border/50">
                  <span className="flex items-center gap-2 text-primary font-bold text-sm">
                    View & Apply {job.isInternal ? "Internal" : "External"} <ExternalLink className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-card border border-border rounded-[24px] p-12 text-center shadow-sm">
            <Briefcase className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">No saved jobs</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">You haven't saved any opportunities yet. Keep browsing and bookmarking roles that interest you.</p>
            <button 
              onClick={() => navigate("/browse-jobs")}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-sm"
            >
              Explore Jobs
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default JobsPage;