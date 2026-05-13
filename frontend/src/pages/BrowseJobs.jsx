import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { applyForJob, addNotification, saveJob, unsaveJob } from "../features/AuthSlice";
import api from "../config/api";
import {
  MapPin,
  Briefcase,
  ExternalLink,
  Zap,
  Filter,
  Search,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Bookmark
} from "lucide-react";

const internalJobs = [
  { id: "int-1", title: "Senior Frontend Engineer", company: "TechCorp", location: "Remote", type: "Full-time", posted: "2 hours ago", salary: "$120k - $150k", description: "We are looking for an experienced Frontend Engineer to lead the development of our core web platform. You will work closely with design and product teams to build a minimalist, highly performant UI.", requirements: ["React.js", "Redux Toolkit", "Tailwind CSS", "GSAP / Framer Motion", "3+ years experience"], isInternal: true },
  { id: "int-2", title: "UI/UX Designer", company: "InnovateLLC", location: "New York, USA", type: "Contract", posted: "1 day ago", salary: "$80k - $100k", description: "Join our agency to craft brutalist and ultra-modern web experiences. You will be responsible for wireframing, prototyping, and ensuring a seamless user journey.", requirements: ["Figma", "Web Design", "Interaction Design", "Portfolio of modern designs"], isInternal: true },
  { id: "int-3", title: "Full Stack Developer", company: "StartupX", location: "Remote", type: "Full-time", posted: "4 days ago", salary: "$100k - $130k", description: "Looking for a MERN stack developer to help us scale our rapidly growing platform. You'll be building RESTful APIs and wiring up robust front-end components.", requirements: ["MongoDB", "Express.js", "React.js", "Node.js", "Git/GitHub"], isInternal: true },
  { id: "int-4", title: "Backend Developer", company: "DataSys", location: "London, UK", type: "Part-time", posted: "5 days ago", salary: "$60k - $80k", description: "Seeking a strong Backend Developer to manage and optimize our data infrastructure and API pipelines.", requirements: ["Node.js", "PostgreSQL", "Redis", "Docker", "REST API Design"], isInternal: true },
  { id: "int-5", title: "Product Manager", company: "BuildIt", location: "San Francisco, CA", type: "Full-time", posted: "1 week ago", salary: "$130k - $160k", description: "Drive the vision and execution of our main product. You will bridge the gap between engineering, design, and our users.", requirements: ["Agile/Scrum", "User Research", "Roadmapping", "Excellent Communication", "3+ years PM experience"], isInternal: true },
  { id: "int-6", title: "DevOps Engineer", company: "CloudNet", location: "Remote", type: "Full-time", posted: "1 week ago", salary: "$140k - $170k", description: "Maintain and scale our cloud infrastructure, focusing on high availability, security, and CI/CD pipelines.", requirements: ["AWS / GCP", "Kubernetes", "Terraform", "Linux", "CI/CD (GitHub Actions)"], isInternal: true },
  { id: "int-7", title: "QA Tester", company: "BugFree", location: "Austin, TX", type: "Contract", posted: "2 weeks ago", salary: "$70k - $90k", description: "Ensure the highest quality of our releases through rigorous manual and automated testing.", requirements: ["Cypress or Selenium", "Jest", "Manual Testing", "Jira", "Attention to Detail"], isInternal: true }
];

const BrowseJobs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // --- REDUX STATE ---
  const { user } = useSelector((state) => state.isAuth);
  const appliedJobs = user?.candidateProfile?.appliedJobs || [];
  const savedJobs = user?.candidateProfile?.savedJobs || [];

  // --- LOCAL STATE ---
  const [activeTab, setActiveTab] = useState("internal");
  const [allJobs, setAllJobs] = useState(internalJobs);
  const [isLoading, setIsLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedModes, setSelectedModes] = useState([]);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const jobTypeOptions = ["Full-time", "Part-time", "Contract", "Internship"];
  const workModeOptions = ["Remote", "On-site"];

  // --- API FETCH ---
  useEffect(() => {
    const fetchJobs = async () => {
      let backendInternalJobs = internalJobs;

      try {
        const jobsRes = await api.get("/jobs");
        const jobsData = jobsRes.data?.jobs || jobsRes.data || [];

        if (Array.isArray(jobsData) && jobsData.length > 0) {
          backendInternalJobs = jobsData.map((job) => ({
            ...job,
            id: job._id || job.id,
            company: job.company || job.companyName || "Company",
            type: job.type || job.employmentType || "Full-time",
            posted: job.posted || "Recently",
            requirements: job.requirements || [],
            isInternal: true,
          }));
          setAllJobs(backendInternalJobs);
        }
      } catch {
        backendInternalJobs = internalJobs;
      }

      const cached = localStorage.getItem("rapidApiJobs");
      if (cached) {
        setAllJobs([...backendInternalJobs, ...JSON.parse(cached)]);
      } else {
        setIsLoading(true);
        try {
          const res = await axios.get("https://jsearch.p.rapidapi.com/search-v2", {
            params: { query: 'developer jobs', num_pages: '1', country: 'us', date_posted: 'all' },
            headers: {
              'x-rapidapi-key': '26d2eb8c6fmsh6a32d9f8fe0773dp19c5a7jsnbe03df9134fc', 
              'x-rapidapi-host': 'jsearch.p.rapidapi.com',
              'Content-Type': 'application/json'
            }
          });

          if (res.data && res.data.data) {
            const formatted = res.data.data.map((job) => ({
              id: String(job.job_id),
              title: job.job_title,
              company: job.employer_name,
              location: job.job_city ? `${job.job_city}, ${job.job_state}` : "Remote",
              type: job.job_employment_type?.replace(/_/g, "-") || "Full-time",
              posted: "Recently",
              description: job.job_description || "Click apply to view full external details.",
              redirect_url: job.job_apply_link,
              isInternal: false,
            }));
            
            localStorage.setItem("rapidApiJobs", JSON.stringify(formatted));
            setAllJobs([...backendInternalJobs, ...formatted]);
          }
        } catch (err) {
          console.error("API Fetch Error:", err);
          toast.error("API limit reached. Showing internal jobs.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchJobs();
  }, []);

  // --- DEBOUNCE EFFECT ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); 
    }, 400); 
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // --- FILTER HANDLERS ---
  const handleTypeChange = (type) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    setCurrentPage(1); 
  };

  const handleModeChange = (mode) => {
    setSelectedModes(prev => prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]);
    setCurrentPage(1); 
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedModes([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  // --- ACTION HANDLERS ---
  const handleManualApply = (e, job) => {
    e.stopPropagation();
    if (window.confirm(`Apply to ${job.company}?`)) {
      dispatch(applyForJob(job.id));
      dispatch(addNotification({ message: `Applied manually to ${job.title} at ${job.company}`, type: "info" }));
      toast.success("Application sent!");
    }
  };

  const handleAutomate = (e, job) => {
    e.stopPropagation();
    const loadToast = toast.loading("AI is tailoring your resume...");
    setTimeout(() => {
      dispatch(applyForJob(job.id));
      dispatch(addNotification({ message: `AI successfully automated your application for ${job.title}`, type: "success" }));
      toast.success("Automation Complete!", { id: loadToast });
    }, 1500);
  };

  const handleToggleSave = (e, job) => {
    e.stopPropagation(); 
    if (savedJobs.includes(job.id)) {
      dispatch(unsaveJob(job.id));
      toast.success("Job removed from saved list");
    } else {
      dispatch(saveJob(job.id));
      dispatch(addNotification({ message: `Saved job: ${job.title}`, type: "success" }));
      toast.success("Job saved!");
    }
  };

  // --- FILTER & PAGINATION LOGIC ---
  const filteredJobs = allJobs.filter((job) => {
    const matchesTab = activeTab === "internal" ? job.isInternal : !job.isInternal;
    const matchesSearch = job.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || job.company.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.some(type => job.type.toLowerCase().includes(type.toLowerCase()));
    const isRemote = job.location.toLowerCase().includes("remote");
    const matchesMode = selectedModes.length === 0 || (selectedModes.includes("Remote") && isRemote) || (selectedModes.includes("On-site") && !isRemote);

    return matchesTab && matchesSearch && matchesType && matchesMode;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header & Controls */}
      <div className="bg-card border-b border-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <h1 className="text-4xl font-black tracking-tight">Browse Jobs</h1>
            
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search job titles or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setShowFiltersMobile(!showFiltersMobile)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-muted rounded-full font-bold">
                <Filter className="w-4 h-4" /> Filters
              </button>

              <div className="flex bg-muted p-1 rounded-full border border-border shrink-0">
                <button
                  onClick={() => { setActiveTab("internal"); setCurrentPage(1); }}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "internal" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                >
                  Internal
                </button>
                <button
                  onClick={() => { setActiveTab("external"); setCurrentPage(1); }}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "external" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                >
                  External
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* --- LEFT SIDEBAR: FILTERS --- */}
        <aside className={`w-full lg:w-64 flex-shrink-0 ${showFiltersMobile ? "block" : "hidden lg:block"}`}>
          <div className="bg-card border border-border rounded-3xl p-6 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><Filter className="w-5 h-5" /> Filters</h2>
              {(selectedTypes.length > 0 || selectedModes.length > 0) && (
                <button onClick={clearFilters} className="text-sm text-primary font-semibold hover:underline">Clear</button>
              )}
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider">Work Mode</h3>
              <div className="flex flex-col gap-3">
                {workModeOptions.map(mode => (
                  <label key={mode} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5 border-2 border-muted-foreground group-hover:border-primary rounded">
                      <input type="checkbox" className="peer opacity-0 absolute w-full h-full cursor-pointer" checked={selectedModes.includes(mode)} onChange={() => handleModeChange(mode)} />
                      <CheckCircle2 className="w-4 h-4 text-primary absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="font-medium text-sm">{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider">Job Type</h3>
              <div className="flex flex-col gap-3">
                {jobTypeOptions.map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5 border-2 border-muted-foreground group-hover:border-primary rounded">
                      <input type="checkbox" className="peer opacity-0 absolute w-full h-full cursor-pointer" checked={selectedTypes.includes(type)} onChange={() => handleTypeChange(type)} />
                      <CheckCircle2 className="w-4 h-4 text-primary absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="font-medium text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* --- RIGHT SIDE: JOB GRID --- */}
        <main className="flex-1 flex flex-col">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <Loader2 className="animate-spin w-10 h-10 text-primary" />
              <p className="text-muted-foreground font-medium">Fetching remote jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border">
              <h3 className="text-2xl font-bold mb-2">No jobs match your filters</h3>
              <p className="text-muted-foreground mb-6">Try removing some checkboxes or adjusting your search query.</p>
              <button onClick={clearFilters} className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-bold">Clear All Filters</button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-muted-foreground font-medium">Showing {currentJobs.length} of {filteredJobs.length} jobs</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1">
                {currentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-card border border-border rounded-3xl p-6 hover:border-primary/50 transition-all cursor-pointer flex flex-col justify-between"
                    onClick={() =>
                      job.isInternal
                        // --- CRITICAL FIX: Pass the job data in state ---
                        ? navigate(`/jobs/${job.id}`, { state: { job } })
                        : window.open(job.redirect_url, "_blank")
                    }
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center font-bold text-xl shrink-0">
                            {job.company.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-1">{job.title}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-1">{job.company}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          {appliedJobs.includes(job.id) && (
                            <span className="bg-green-500/10 text-green-600 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Applied
                            </span>
                          )}
                          <button
                            onClick={(e) => handleToggleSave(e, job)}
                            className="p-2 text-muted-foreground hover:text-primary transition-colors bg-muted/50 hover:bg-muted rounded-full"
                          >
                            <Bookmark className={`w-5 h-5 transition-all ${savedJobs.includes(job.id) ? "fill-primary text-primary" : ""}`} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground mb-6">
                        <span className="bg-secondary px-3 py-1.5 rounded-lg flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                        <span className="bg-secondary px-3 py-1.5 rounded-lg flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.type}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-border/50 mt-auto">
                      {appliedJobs.includes(job.id) ? (
                        <button disabled className="w-full py-3 bg-muted text-muted-foreground rounded-xl font-bold cursor-not-allowed">
                          Application Tracked
                        </button>
                      ) : job.isInternal ? (
                        <>
                          <button onClick={(e) => handleAutomate(e, job)} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90">
                            <Zap className="w-4 h-4" /> Automate
                          </button>
                          <button onClick={(e) => handleManualApply(e, job)} className="flex-1 py-3 bg-secondary rounded-xl font-bold hover:bg-secondary/80">
                            Apply
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(job.redirect_url, "_blank");
                            dispatch(applyForJob(job.id));
                            dispatch(addNotification({ message: `Redirected to apply for ${job.title}`, type: "info" }));
                          }}
                          className="w-full py-3 bg-foreground text-background rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90"
                        >
                          Apply Externally <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-border/50">
                  <button onClick={() => { setCurrentPage(p => Math.max(p - 1, 1)); window.scrollTo(0,0); }} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl font-semibold hover:bg-muted disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <span className="text-sm font-semibold bg-muted px-4 py-2 rounded-xl">Page {currentPage} of {totalPages}</span>
                  <button onClick={() => { setCurrentPage(p => Math.min(p + 1, totalPages)); window.scrollTo(0,0); }} disabled={currentPage === totalPages} className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl font-semibold hover:bg-muted disabled:opacity-50">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default BrowseJobs;
