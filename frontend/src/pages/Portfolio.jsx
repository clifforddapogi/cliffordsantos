import React, { useEffect, useState } from "react";
import api from "../lib/api";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import About from "../components/About";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Cursor from "../components/Cursor";
import useLenis from "../hooks/useLenis";

export default function Portfolio() {
  useLenis();
  const [site, setSite] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState({ groups: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/site"),
      api.get("/projects"),
      api.get("/experience"),
      api.get("/education"),
      api.get("/skills"),
    ])
      .then(([s, p, e, ed, sk]) => {
        setSite(s.data);
        setProjects(p.data);
        setExperience(e.data);
        setEducation(ed.data);
        setSkills(sk.data);
      })
      .catch((err) => console.error("portfolio load failed:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream" data-testid="loading-state">
        <div className="font-display text-3xl text-navy tracking-tightest animate-pulse">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="portfolio-root">
      <Cursor />
      <Nav resumeUrl={site.resume_url} />
      <main>
        <Hero site={site} />
        <About site={site} />
        <Experience items={experience} />
        <Projects items={projects} />
        <Skills data={skills} education={education} />
        <Contact site={site} />
      </main>
      <Footer site={site} />
    </div>
  );
}
