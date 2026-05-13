import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  MapPin,
  ArrowRight,
  Code2,
  LineChart,
  Landmark,
  TrendingUp,
  PenTool,
} from "lucide-react";
import HomeSearchInput from "../components/HomeSearchInput";

const initialJobData = [
  {
    id: "5697392966",
    title: "IBM Netcool Developer",
    company: "Tata Consultancy Services",
    location: "India",
    type: "Full-time",
    created: "2026-04-12T14:55:59Z",
    isNew: true,
  },
  {
    id: "5714786527",
    title: "Developer",
    company: "vidaXL",
    location: "Hyderabad, Telangana",
    type: "Full-time",
    created: "2026-05-01T00:53:03Z",
    isNew: true,
  },
  {
    id: "5716065787",
    title: "Senior ServiceNow Developer",
    company: "Tata Consultancy Services",
    location: "Hyderabad, Telangana",
    type: "Full-time",
    created: "2026-05-01T23:03:30Z",
    isNew: false,
  },
  {
    id: "5707345262",
    title: "Backend/Linux DevOps",
    company: "Sasken Technologies Limited",
    location: "Ahmedabad, Gujarat",
    type: "Contract",
    created: "2026-04-22T23:42:36Z",
    isNew: false,
  },
  {
    id: "5697210632",
    title: "PHP Developer",
    company: "CLIRNET",
    location: "Kolkata, West Bengal",
    type: "Full-time",
    created: "2026-04-12T08:36:10Z",
    isNew: false,
  },
  {
    id: "5694091601",
    title: "Flutter Developer",
    company: "SID Global Solutions",
    location: "Mumbai, Maharashtra",
    type: "Full-time",
    created: "2026-04-09T08:13:04Z",
    isNew: false,
  },
];

const formatDate = (dateString) => {
  const options = { month: "short", day: "numeric", year: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const HomePage = () => {
  let navigate = useNavigate();

  const [trendingJobs, setTrendingJobs] = useState([]);

  useEffect(() => {
    const storedJobs = localStorage.getItem("adzunaJobs");

    if (storedJobs) {
      setTrendingJobs(JSON.parse(storedJobs));
    } else {
      localStorage.setItem("adzunaJobs", JSON.stringify(initialJobData));
      setTrendingJobs(initialJobData);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-16 md:space-y-20">
      <section className="text-center max-w-4xl mx-auto space-y-6 ">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
          Elevate your career journey with precision.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect with top-tier companies and find roles that align with your
          professional goals and expertise.
        </p>
        <HomeSearchInput jobsData={initialJobData} />
      </section>

      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 sm:gap-0">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-foreground">
              Featured Categories
            </h2>
            <p className="text-muted-foreground mt-1">
              Explore high-growth sectors curated for your skill set.
            </p>
          </div>
          <div
            onClick={() => {
              navigate("/categories");
            }}
            className="text-primary font-medium flex items-center hover:underline cursor-pointer"
          >
            View all <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="sm:col-span-2 lg:col-span-1 lg:row-span-2 bg-accent/20 border border-accent/30 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Code2 className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Software Engineering
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Over 1,200 new positions for Full-Stack, Backend, and Frontend
                developers at leading tech hubs.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                High Demand
              </span>
              <span className="text-xs text-muted-foreground">
                840 Companies Hiring
              </span>
            </div>
          </div>
          {[
            {
              title: "Product Design",
              desc: "UI/UX & Visual Design",
              icon: PenTool,
            },
            {
              title: "Data Science",
              desc: "AI, Analytics & Big Data",
              icon: LineChart,
            },
            { title: "Fintech", desc: "Finance & Blockchain", icon: Landmark },
            {
              title: "Growth",
              desc: "Marketing & Operations",
              icon: TrendingUp,
            },
          ].map((cat, idx) => (
            <div
              key={idx}
              className="bg-card border border-border rounded-2xl p-6 hover:border-2 hover:border-tertiary/30 transition-shadow cursor-pointer"
            >
              <div className="bg-secondary w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                <cat.icon className="text-primary w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground">{cat.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8 text-left">
          <h2 className="text-2xl font-bold text-foreground">
            Trending Opportunities
          </h2>
          <p className="text-muted-foreground mt-1">
            Personalized recommendations based on your profile.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trendingJobs.slice(0, 4).map((job) => (
            <div
              key={job.id}
              className="bg-card border border-border rounded-2xl p-4 md:p-6 flex flex-col justify-between gap-2 hover:border-2 hover:border-tertiary/30 transition-shadow"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shrink-0 hidden sm:flex">
                  <span className="text-primary font-bold text-xl uppercase">
                    {job.company.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-foreground text-lg">
                      {job.title}
                    </h3>
                    {job.isNew && (
                      <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-primary text-sm font-medium">
                    {job.company}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full">
                      {job.location}
                    </span>
                    <span className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full">
                      {job.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 sm:mt-6 pt-4 border-t border-border gap-4 sm:gap-0">
                <span className="text-xs text-muted-foreground">
                  Posted {formatDate(job.created)}
                </span>

                <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
                  <button className="w-full sm:w-auto bg-primary text-primary-foreground text-sm font-medium px-6 py-2 rounded-full hover:bg-primary/90 transition-colors">
                    Apply Now
                  </button>
                  <button className="w-full sm:w-auto bg-secondary text-secondary-foreground text-sm font-medium px-6 py-2 rounded-full hover:bg-secondary/70 transition-colors">
                    Automate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 mt-12 flex flex-col md:flex-row flex-wrap justify-around items-center gap-8 md:gap-4 shadow-xl">
        <div className="text-center">
          <p className="text-4xl font-bold mb-2">
            100{" "}
            <sup>
              <sup>+</sup>
            </sup>{" "}
          </p>
          <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase">
            Active Jobs
          </p>
        </div>
        <div className="hidden md:block w-[1px] h-12 bg-slate-700"></div>
        <div className="text-center">
          <p className="text-4xl font-bold mb-2">
            10{" "}
            <sup>
              <sup>+</sup>
            </sup>
          </p>
          <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase">
            Top Companies
          </p>
        </div>
        <div className="hidden md:block w-[1px] h-12 bg-slate-700"></div>
        <div className="text-center">
          <p className="text-4xl font-bold mb-2">
            2{" "}
            <sup>
              <sup>+</sup>
            </sup>
          </p>
          <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase">
            Successful Hires
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
