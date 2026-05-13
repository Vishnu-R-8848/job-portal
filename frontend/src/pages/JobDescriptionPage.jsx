import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { applyForJob, addNotification, saveJob, unsaveJob } from "../features/AuthSlice";
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  Building2, 
  Zap, 
  ChevronLeft, 
  CheckCircle2, 
  Bookmark,
  ExternalLink,
  Loader2
} from "lucide-react";
import api from "../config/api";

// Fallback internal database (This will eventually live in your Express backend)
const internalJobsDatabase = [
  { id: "int-1", title: "Senior Frontend Engineer", company: "TechCorp", location: "Remote", type: "Full-time", posted: "2 hours ago", salary: "$120k - $150k", description: "We are looking for an experienced Frontend Engineer to lead the development of our core web platform.", requirements: ["React.js", "Redux Toolkit", "Tailwind CSS"], isInternal: true },
  { id: "int-2", title: "UI/UX Designer", company: "InnovateLLC", location: "New York, USA", type: "Contract", posted: "1 day ago", salary: "$80k - $100k", description: "Join our agency to craft brutalist and ultra-modern web experiences.", requirements: ["Figma", "Web Design", "Interaction Design"], isInternal: true },
  { id: "int-3", title: "Full Stack Developer", company: "StartupX", location: "Remote", type: "Full-time", posted: "4 days ago", salary: "$100k - $130k", description: "Looking for a MERN stack developer to help us scale our platform.", requirements: ["MongoDB", "Express.js", "React.js", "Node.js"], isInternal: true }
];

const JobDescriptionPage = () => {
  const { jobId } = useParams();
  const id = jobId;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Redux integration for Candidate tracking
  const { user } = useSelector((state) => state.isAuth);
  const appliedJobs = user?.candidateProfile?.appliedJobs || [];
  const hasApplied = appliedJobs.includes(id);

  const savedJobs = user?.candidateProfile?.savedJobs || [];
  const isSaved = savedJobs.includes(id);

  // --- DYNAMIC DATA FETCHING ---
  useEffect(() => {
    setIsLoading(true);
    window.scrollTo(0, 0);

    if (location.state?.job) {
      setJob(location.state.job);
      setIsLoading(false);
      return;
    }

    const fetchBackendJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        const backendJob = res.data?.job || res.data;

        setJob({
          ...backendJob,
          id: backendJob._id || backendJob.id,
          posted: backendJob.posted || "Recently",
          requirements: backendJob.requirements || [],
          isInternal: true,
        });
      } catch {
        // Local fallback below keeps the page usable while backend routes are being built.
      } finally {
        setIsLoading(false);
      }
    };

    // 1. Check Internal Database first
    const internalMatch = internalJobsDatabase.find((j) => j.id === id);
    if (internalMatch) {
      setJob(internalMatch);
      setIsLoading(false);
      return;
    }

    // 2. Check Cached External Jobs (from RapidAPI)
    const cachedJobs = localStorage.getItem("rapidApiJobs");
    if (cachedJobs) {
      const externalJobs = JSON.parse(cachedJobs);
      const externalMatch = externalJobs.find((j) => String(j.id) === String(id));
      
      if (externalMatch) {
        setJob({
          id: externalMatch.id,
          title: externalMatch.title,
          company: externalMatch.company,
          location: externalMatch.location,
          type: externalMatch.type,
          posted: externalMatch.posted || "Recently",
          description: externalMatch.description || "This is an external job. Please click apply to view the full details and description on the employer's website.",
          requirements: ["View external link for full requirements"],
          redirect_url: externalMatch.redirect_url,
          isInternal: false
        });
        setIsLoading(false);
        return;
      }
    }

    fetchBackendJob();
  }, [id, location.state]);

  // --- INTERACTION HANDLERS ---
  const handleApply = () => {
    if (job.isInternal) {
      if (window.confirm(`Are you ready to apply for the ${job.title} role?`)) {
        dispatch(applyForJob(job.id));
        dispatch(addNotification({ message: `Applied manually to ${job.title} at ${job.company}`, type: "info" }));
        toast.success("Application successfully submitted!");
      }
    } else {
      window.open(job.redirect_url, "_blank");
      dispatch(applyForJob(job.id));
      dispatch(addNotification({ message: `Redirected to apply for ${job.title} at ${job.company}`, type: "info" }));
    }
  };

  const handleAutomate = () => {
    const loadToast = toast.loading("AI is tailoring your resume...");
    setTimeout(() => {
      dispatch(applyForJob(job.id));
      dispatch(addNotification({ message: `AI successfully automated your application for ${job.title}`, type: "success" }));
      toast.success("Automation Complete!", { id: loadToast });
    }, 1500);
  };

  const handleToggleSave = () => {
    if (isSaved) {
      dispatch(unsaveJob(job.id));
      toast.success("Job removed from saved list");
    } else {
      dispatch(saveJob(job.id));
      dispatch(addNotification({ message: `Saved job: ${job.title} at ${job.company}`, type: "success" }));
      toast.success("Job saved!");
    }
  };

  // --- RENDER STATES ---
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-bold">Fetching job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <h2 className="text-3xl font-black text-foreground">Job Not Found</h2>
        <p className="font-medium">The position you are looking for does not exist or has expired.</p>
        <button onClick={() => navigate("/browse-jobs")} className="mt-4 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-sm hover:bg-primary/90 transition-colors">
          Back to Browse
        </button>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-background pb-20 pt-8 px-4 sm:px-6 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Jobs
        </button>

        {/* --- HEADER --- */}
        <div className="bg-card border-2 border-border rounded-[32px] p-8 sm:p-12 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-24 h-24 bg-primary rounded-[24px] flex items-center justify-center shrink-0 border-4 border-background shadow-xl">
                <span className="text-primary-foreground font-black text-5xl uppercase">{job.company.charAt(0)}</span>
              </div>
              
              <div className="mt-2">
                <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-3 leading-none tracking-tight">
                  {job.title}
                </h1>
                <p className="text-2xl font-bold text-muted-foreground flex items-center gap-2 mb-6">
                  <Building2 className="w-6 h-6" /> {job.company}
                </p>
                
                <div className="flex flex-wrap gap-3 text-sm font-bold text-muted-foreground">
                  <span className="bg-secondary px-4 py-2.5 rounded-xl flex items-center gap-2 border border-border/50"><MapPin className="w-4 h-4" /> {job.location}</span>
                  <span className="bg-secondary px-4 py-2.5 rounded-xl flex items-center gap-2 border border-border/50"><Briefcase className="w-4 h-4" /> {job.type}</span>
                  <span className="bg-secondary px-4 py-2.5 rounded-xl flex items-center gap-2 border border-border/50"><Clock className="w-4 h-4" /> Posted {job.posted}</span>
                </div>
              </div>
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div className="flex flex-col gap-3 w-full lg:w-auto shrink-0 lg:min-w-[240px]">
              {hasApplied ? (
                <button disabled className="w-full py-4 bg-green-500/10 text-green-600 border border-green-500/20 rounded-2xl font-black uppercase tracking-wider flex justify-center items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" /> Applied
                </button>
              ) : job.isInternal ? (
                <>
                  <button onClick={handleAutomate} className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-xl shadow-primary/20">
                    <Zap className="w-5 h-5 fill-current" /> Automate Apply
                  </button>
                  <button onClick={handleApply} className="w-full py-3 bg-card text-foreground rounded-2xl font-bold hover:bg-secondary transition-colors border-2 border-border">
                    Apply Manually
                  </button>
                </>
              ) : (
                <button onClick={handleApply} className="w-full py-4 bg-foreground text-background rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  Apply Externally <ExternalLink className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* --- DETAILS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-card border-2 border-border rounded-[32px] p-8 sm:p-10 shadow-sm">
              <h2 className="text-3xl font-black mb-6 tracking-tight">About the Role</h2>
              <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                {job.description}
              </p>
            </section>

            <section className="bg-card border-2 border-border rounded-[32px] p-8 sm:p-10 shadow-sm">
              <h2 className="text-3xl font-black mb-8 tracking-tight">Requirements</h2>
              <ul className="space-y-5">
                {job.requirements?.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground font-bold text-xl">{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* --- SIDEBAR --- */}
          <div className="space-y-6">
            <div className="bg-card border-2 border-border rounded-[32px] p-8 shadow-sm">
              <h3 className="font-black text-2xl mb-6 tracking-tight">Overview</h3>
              <div className="space-y-6">
                <div className="pb-4 border-b border-border/50">
                  <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Role</p>
                  <p className="font-black text-lg">{job.title}</p>
                </div>
                <div className="pb-4 border-b border-border/50">
                  <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Company</p>
                  <p className="font-black text-lg">{job.company}</p>
                </div>
                <div className="pb-4 border-b border-border/50">
                  <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Location</p>
                  <p className="font-black text-lg">{job.location}</p>
                </div>
                {job.salary && (
                  <div>
                    <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1">Salary</p>
                    <p className="font-black text-lg text-green-600">{job.salary}</p>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleToggleSave}
              className={`w-full py-4 border-2 rounded-[24px] font-black transition-all flex items-center justify-center gap-2 shadow-sm
                ${isSaved 
                  ? "bg-primary/10 border-primary/20 text-primary" 
                  : "bg-card border-border text-foreground hover:border-primary hover:text-primary"
                }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} /> 
              {isSaved ? "Saved" : "Save Job"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionPage;
