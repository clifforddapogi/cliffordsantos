import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import Logo from "../components/Logo";
import { LogOut, Save, Plus, Trash2, Mail, Briefcase, Sparkles, GraduationCap, Layers, FileText, Inbox } from "lucide-react";

const TABS = [
  { id: "site", label: "Site Content", icon: FileText },
  { id: "projects", label: "Projects", icon: Layers },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "messages", label: "Messages", icon: Inbox },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("site");
  const [me, setMe] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    api.get("/auth/me").then((r) => setMe(r.data)).catch(() => nav("/admin"));
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    }
    nav("/admin");
  };

  if (!me) return <div className="min-h-screen flex items-center justify-center bg-cream font-display text-2xl text-navy">Loading…</div>;

  return (
    <div className="min-h-screen bg-cream" data-testid="admin-dashboard">
      <header className="border-b border-navy/10 bg-white sticky top-0 z-30">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <div className="leading-tight">
              <div className="font-display font-bold text-navy text-sm">Admin</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-ink/55 font-bold">{me.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="text-xs uppercase tracking-[0.18em] font-bold text-ink/60 hover:text-cyan_brand px-3" data-testid="admin-view-site">View site ↗</a>
            <button onClick={logout} className="inline-flex items-center gap-2 bg-navy text-cream rounded-full px-4 py-2 text-sm hover:bg-cyan_brand transition-colors" data-testid="admin-logout">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-8 grid grid-cols-12 gap-8">
        <aside className="col-span-12 lg:col-span-3">
          <nav className="space-y-1 bg-white rounded-2xl border border-navy/10 p-2 sticky top-24" data-testid="admin-tabs">
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    tab === t.id ? "bg-navy text-cream" : "hover:bg-bone text-ink/70"
                  }`}
                  data-testid={`admin-tab-${t.id}`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="col-span-12 lg:col-span-9">
          {tab === "site" && <SiteEditor />}
          {tab === "projects" && <ProjectsEditor />}
          {tab === "experience" && <ExperienceEditor />}
          {tab === "education" && <EducationEditor />}
          {tab === "skills" && <SkillsEditor />}
          {tab === "messages" && <MessagesPanel />}
        </main>
      </div>
    </div>
  );
}

function Card({ children, title, action }) {
  return (
    <section className="bg-white rounded-2xl border border-navy/10 p-6 lg:p-8 mb-6">
      {(title || action) && (
        <div className="flex items-center justify-between mb-6">
          {title && <h2 className="font-display font-bold text-navy text-2xl tracking-tight">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function Field({ label, value, onChange, type = "text", testid }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.22em] text-ink/55 font-bold">{label}</span>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-navy/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan_brand"
        data-testid={testid}
      />
    </label>
  );
}

function FieldArea({ label, value, onChange, rows = 3, testid }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.22em] text-ink/55 font-bold">{label}</span>
      <textarea
        rows={rows}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-navy/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan_brand resize-y"
        data-testid={testid}
      />
    </label>
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  return <div className="fixed bottom-6 right-6 bg-navy text-cream px-5 py-3 rounded-full text-sm shadow-lg z-50" data-testid="toast">{msg}</div>;
}

// ---------- SITE EDITOR ----------
function HeroSection({ data, set }) {
  return (
    <Card title="Hero">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Eyebrow" value={data.hero_eyebrow} onChange={(v) => set("hero_eyebrow", v)} testid="site-hero-eyebrow" />
        <Field label="Name" value={data.hero_name} onChange={(v) => set("hero_name", v)} testid="site-hero-name" />
        <Field label="Title" value={data.hero_title} onChange={(v) => set("hero_title", v)} testid="site-hero-title" />
        <Field label="Location" value={data.location} onChange={(v) => set("location", v)} testid="site-location" />
      </div>
      <div className="mt-4">
        <FieldArea label="Tagline" value={data.hero_tagline} onChange={(v) => set("hero_tagline", v)} testid="site-hero-tagline" />
      </div>
    </Card>
  );
}

function AboutSection({ data, set, setPara, addPara, removePara }) {
  return (
    <Card title="About">
      <Field label="Heading" value={data.about_heading} onChange={(v) => set("about_heading", v)} testid="site-about-heading" />
      <div className="mt-3">
        <Field label="Headshot URL" value={data.headshot_url} onChange={(v) => set("headshot_url", v)} testid="site-headshot-url" />
      </div>
      <div className="mt-4 space-y-3">
        <div className="text-[10px] uppercase tracking-[0.22em] text-ink/55 font-bold">Paragraphs</div>
        {(data.about_paragraphs || []).map((p, i) => (
          <div key={`para-${i}`} className="flex gap-2 items-start">
            <textarea rows={3} value={p} onChange={(e) => setPara(i, e.target.value)} className="flex-1 border border-navy/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan_brand resize-y" data-testid={`site-paragraph-${i}`} />
            <button onClick={() => removePara(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" data-testid={`site-paragraph-remove-${i}`}><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button onClick={addPara} className="inline-flex items-center gap-2 text-sm text-cyan_brand hover:underline" data-testid="site-add-paragraph"><Plus className="w-4 h-4" /> Add paragraph</button>
      </div>
    </Card>
  );
}

function ContactInfoSection({ data, set }) {
  return (
    <Card title="Contact info">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email" value={data.email} onChange={(v) => set("email", v)} testid="site-email" />
        <Field label="Phone" value={data.phone} onChange={(v) => set("phone", v)} testid="site-phone" />
        <Field label="Resume URL" value={data.resume_url} onChange={(v) => set("resume_url", v)} testid="site-resume-url" />
        <Field label="Footer CTA" value={data.footer_cta} onChange={(v) => set("footer_cta", v)} testid="site-footer-cta" />
      </div>
    </Card>
  );
}

function SocialsSection({ data, setSocial }) {
  return (
    <Card title="Social links">
      <div className="grid grid-cols-2 gap-4">
        {["linkedin", "facebook", "twitter", "instagram", "deviantart"].map((k) => (
          <Field key={k} label={k} value={data.socials?.[k]} onChange={(v) => setSocial(k, v)} testid={`site-social-${k}`} />
        ))}
      </div>
    </Card>
  );
}

function SaveButton({ onClick, label = "Save site content", testid }) {
  return (
    <div className="sticky bottom-4 flex justify-end">
      <button onClick={onClick} className="inline-flex items-center gap-2 bg-cyan_brand text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-navy transition-colors shadow-xl" data-testid={testid}>
        <Save className="w-4 h-4" /> {label}
      </button>
    </div>
  );
}

function SiteEditor() {
  const [data, setData] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    api.get("/site").then((r) => setData(r.data)).catch((err) => console.error("site load failed:", err));
  }, []);
  if (!data) return null;

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const setSocial = (k, v) => setData((d) => ({ ...d, socials: { ...d.socials, [k]: v } }));
  const setPara = (i, v) => setData((d) => {
    const arr = [...(d.about_paragraphs || [])]; arr[i] = v;
    return { ...d, about_paragraphs: arr };
  });
  const addPara = () => setData((d) => ({ ...d, about_paragraphs: [...(d.about_paragraphs || []), ""] }));
  const removePara = (i) => setData((d) => ({ ...d, about_paragraphs: d.about_paragraphs.filter((_, x) => x !== i) }));

  const save = async () => {
    await api.put("/admin/site", data);
    setToast("Saved"); setTimeout(() => setToast(""), 2000);
  };

  return (
    <>
      <HeroSection data={data} set={set} />
      <AboutSection data={data} set={set} setPara={setPara} addPara={addPara} removePara={removePara} />
      <ContactInfoSection data={data} set={set} />
      <SocialsSection data={data} setSocial={setSocial} />
      <SaveButton onClick={save} testid="site-save" />
      <Toast msg={toast} />
    </>
  );
}

// ---------- PROJECTS EDITOR ----------
function ProjectsEditor() {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");

  const load = useCallback(
    () => api.get("/projects").then((r) => setList(r.data)).catch((err) => console.error("projects load failed:", err)),
    []
  );
  useEffect(() => { load(); }, [load]);

  const blank = { title: "", category: "Logo & Identity", description: "", image_url: "", year: "", role: "", tools: [], featured: false, order: list.length + 1 };

  const save = async (p) => {
    if (p.id) await api.put(`/admin/projects/${p.id}`, p);
    else await api.post("/admin/projects", p);
    setEditing(null); setToast("Saved"); setTimeout(() => setToast(""), 1500); load();
  };
  const del = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await api.delete(`/admin/projects/${id}`); load();
  };

  if (editing) return <ProjectForm initial={editing} onSave={save} onCancel={() => setEditing(null)} />;

  return (
    <>
      <Card
        title="Projects"
        action={
          <button onClick={() => setEditing(blank)} className="inline-flex items-center gap-2 bg-navy text-cream rounded-full px-4 py-2 text-sm hover:bg-cyan_brand" data-testid="project-add">
            <Plus className="w-4 h-4" /> New project
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {list.map((p) => (
            <div key={p.id} className="flex items-center gap-3 border border-navy/15 rounded-xl p-3 hover:bg-bone" data-testid={`project-row-${p.id}`}>
              <div className="w-14 h-14 rounded-lg bg-bone overflow-hidden flex-shrink-0 flex items-center justify-center">
                {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-full object-contain p-1" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-navy truncate">{p.title}</div>
                <div className="text-xs text-ink/55 truncate">{p.category} · {p.year}</div>
              </div>
              <button onClick={() => setEditing(p)} className="text-xs px-3 py-1.5 rounded-full border border-navy/20 hover:bg-navy hover:text-cream" data-testid={`project-edit-${p.id}`}>Edit</button>
              <button onClick={() => del(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" data-testid={`project-delete-${p.id}`}><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </Card>
      <Toast msg={toast} />
    </>
  );
}

function ProjectForm({ initial, onSave, onCancel }) {
  const [p, setP] = useState({ ...initial, tools: initial.tools || [] });
  const [toolsStr, setToolsStr] = useState((initial.tools || []).join(", "));
  const set = (k, v) => setP((x) => ({ ...x, [k]: v }));

  const submit = () => {
    const finalP = { ...p, tools: toolsStr.split(",").map((s) => s.trim()).filter(Boolean), order: Number(p.order) || 0 };
    onSave(finalP);
  };

  return (
    <Card title={p.id ? "Edit project" : "New project"} action={
      <div className="flex gap-2">
        <button onClick={onCancel} className="text-sm px-4 py-2 rounded-full border border-navy/20" data-testid="project-form-cancel">Cancel</button>
        <button onClick={submit} className="bg-cyan_brand text-white rounded-full px-5 py-2 text-sm hover:bg-navy" data-testid="project-form-save">Save</button>
      </div>
    }>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Title" value={p.title} onChange={(v) => set("title", v)} testid="pf-title" />
        <Field label="Category" value={p.category} onChange={(v) => set("category", v)} testid="pf-category" />
        <Field label="Year" value={p.year} onChange={(v) => set("year", v)} testid="pf-year" />
        <Field label="Role" value={p.role} onChange={(v) => set("role", v)} testid="pf-role" />
        <Field label="Image URL" value={p.image_url} onChange={(v) => set("image_url", v)} testid="pf-image" />
        <Field label="Order" value={p.order} onChange={(v) => set("order", v)} type="number" testid="pf-order" />
        <Field label="Tools (comma separated)" value={toolsStr} onChange={setToolsStr} testid="pf-tools" />
        <label className="flex items-center gap-2 mt-7">
          <input type="checkbox" checked={!!p.featured} onChange={(e) => set("featured", e.target.checked)} data-testid="pf-featured" />
          <span className="text-sm">Featured</span>
        </label>
      </div>
      <div className="mt-4">
        <FieldArea label="Description" value={p.description} onChange={(v) => set("description", v)} rows={4} testid="pf-description" />
      </div>
      {p.image_url && (
        <div className="mt-4 p-4 bg-bone rounded-xl flex items-center justify-center">
          <img src={p.image_url} alt="preview" className="max-h-48 object-contain" />
        </div>
      )}
    </Card>
  );
}

// ---------- EXPERIENCE EDITOR ----------
function ExperienceEditor() {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");

  const load = useCallback(
    () => api.get("/experience").then((r) => setList(r.data)).catch((err) => console.error("experience load failed:", err)),
    []
  );
  useEffect(() => { load(); }, [load]);

  const blank = { company: "", title: "", location: "", start_date: "", end_date: "", bullets: [""], order: list.length + 1 };

  const save = async (e) => {
    if (e.id) await api.put(`/admin/experience/${e.id}`, e);
    else await api.post("/admin/experience", e);
    setEditing(null); setToast("Saved"); setTimeout(() => setToast(""), 1500); load();
  };
  const del = async (id) => {
    if (!window.confirm("Delete?")) return;
    await api.delete(`/admin/experience/${id}`); load();
  };

  if (editing) return <ExperienceForm initial={editing} onSave={save} onCancel={() => setEditing(null)} />;

  return (
    <>
      <Card title="Experience" action={
        <button onClick={() => setEditing(blank)} className="inline-flex items-center gap-2 bg-navy text-cream rounded-full px-4 py-2 text-sm hover:bg-cyan_brand" data-testid="exp-add">
          <Plus className="w-4 h-4" /> New
        </button>
      }>
        <div className="space-y-2">
          {list.map((e) => (
            <div key={e.id} className="flex items-center gap-3 border border-navy/15 rounded-xl p-4 hover:bg-bone" data-testid={`exp-row-${e.id}`}>
              <div className="flex-1">
                <div className="font-display font-bold text-navy">{e.company}</div>
                <div className="text-sm text-cyan_brand">{e.title}</div>
                <div className="text-xs text-ink/55">{e.start_date} — {e.end_date} · {e.location}</div>
              </div>
              <button onClick={() => setEditing(e)} className="text-xs px-3 py-1.5 rounded-full border border-navy/20 hover:bg-navy hover:text-cream" data-testid={`exp-edit-${e.id}`}>Edit</button>
              <button onClick={() => del(e.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" data-testid={`exp-delete-${e.id}`}><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </Card>
      <Toast msg={toast} />
    </>
  );
}

function ExperienceForm({ initial, onSave, onCancel }) {
  const [e, setE] = useState({ ...initial, bullets: initial.bullets || [] });
  const set = (k, v) => setE((x) => ({ ...x, [k]: v }));
  const setB = (i, v) => setE((x) => { const b = [...x.bullets]; b[i] = v; return { ...x, bullets: b }; });
  const addB = () => setE((x) => ({ ...x, bullets: [...x.bullets, ""] }));
  const remB = (i) => setE((x) => ({ ...x, bullets: x.bullets.filter((_, n) => n !== i) }));

  return (
    <Card title={e.id ? "Edit experience" : "New experience"} action={
      <div className="flex gap-2">
        <button onClick={onCancel} className="text-sm px-4 py-2 rounded-full border border-navy/20" data-testid="exp-form-cancel">Cancel</button>
        <button onClick={() => onSave({ ...e, order: Number(e.order) || 0 })} className="bg-cyan_brand text-white rounded-full px-5 py-2 text-sm hover:bg-navy" data-testid="exp-form-save">Save</button>
      </div>
    }>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Company" value={e.company} onChange={(v) => set("company", v)} testid="ef-company" />
        <Field label="Title" value={e.title} onChange={(v) => set("title", v)} testid="ef-title" />
        <Field label="Start" value={e.start_date} onChange={(v) => set("start_date", v)} testid="ef-start" />
        <Field label="End" value={e.end_date} onChange={(v) => set("end_date", v)} testid="ef-end" />
        <Field label="Location" value={e.location} onChange={(v) => set("location", v)} testid="ef-location" />
        <Field label="Order" value={e.order} onChange={(v) => set("order", v)} type="number" testid="ef-order" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="text-[10px] uppercase tracking-[0.22em] text-ink/55 font-bold">Bullets</div>
        {e.bullets.map((b, i) => (
          <div key={`bullet-${i}`} className="flex gap-2">
            <textarea rows={2} value={b} onChange={(ev) => setB(i, ev.target.value)} className="flex-1 border border-navy/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan_brand" data-testid={`ef-bullet-${i}`} />
            <button onClick={() => remB(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" data-testid={`ef-bullet-remove-${i}`}><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button onClick={addB} className="inline-flex items-center gap-1 text-sm text-cyan_brand" data-testid="ef-bullet-add"><Plus className="w-4 h-4" /> Add bullet</button>
      </div>
    </Card>
  );
}

// ---------- EDUCATION EDITOR ----------
function EducationEditor() {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");

  const load = useCallback(
    () => api.get("/education").then((r) => setList(r.data)).catch((err) => console.error("education load failed:", err)),
    []
  );
  useEffect(() => { load(); }, [load]);

  const blank = { institution: "", degree: "", location: "", dates: "", order: list.length + 1 };

  const save = async (e) => {
    if (e.id) await api.put(`/admin/education/${e.id}`, e);
    else await api.post("/admin/education", e);
    setEditing(null); setToast("Saved"); setTimeout(() => setToast(""), 1500); load();
  };
  const del = async (id) => {
    if (!window.confirm("Delete?")) return;
    await api.delete(`/admin/education/${id}`); load();
  };

  if (editing) {
    return (
      <Card title={editing.id ? "Edit education" : "New education"} action={
        <div className="flex gap-2">
          <button onClick={() => setEditing(null)} className="text-sm px-4 py-2 rounded-full border border-navy/20" data-testid="edu-form-cancel">Cancel</button>
          <button onClick={() => save({ ...editing, order: Number(editing.order) || 0 })} className="bg-cyan_brand text-white rounded-full px-5 py-2 text-sm hover:bg-navy" data-testid="edu-form-save">Save</button>
        </div>
      }>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Institution" value={editing.institution} onChange={(v) => setEditing({ ...editing, institution: v })} testid="edu-institution" />
          <Field label="Degree" value={editing.degree} onChange={(v) => setEditing({ ...editing, degree: v })} testid="edu-degree" />
          <Field label="Location" value={editing.location} onChange={(v) => setEditing({ ...editing, location: v })} testid="edu-location" />
          <Field label="Dates" value={editing.dates} onChange={(v) => setEditing({ ...editing, dates: v })} testid="edu-dates" />
          <Field label="Order" value={editing.order} onChange={(v) => setEditing({ ...editing, order: v })} type="number" testid="edu-order" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card title="Education" action={
        <button onClick={() => setEditing(blank)} className="inline-flex items-center gap-2 bg-navy text-cream rounded-full px-4 py-2 text-sm hover:bg-cyan_brand" data-testid="edu-add">
          <Plus className="w-4 h-4" /> New
        </button>
      }>
        <div className="space-y-2">
          {list.map((e) => (
            <div key={e.id} className="flex items-center gap-3 border border-navy/15 rounded-xl p-4" data-testid={`edu-row-${e.id}`}>
              <div className="flex-1">
                <div className="font-display font-bold text-navy">{e.institution}</div>
                <div className="text-sm text-ink/70">{e.degree}</div>
                <div className="text-xs text-ink/55">{e.dates} · {e.location}</div>
              </div>
              <button onClick={() => setEditing(e)} className="text-xs px-3 py-1.5 rounded-full border border-navy/20 hover:bg-navy hover:text-cream" data-testid={`edu-edit-${e.id}`}>Edit</button>
              <button onClick={() => del(e.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" data-testid={`edu-delete-${e.id}`}><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </Card>
      <Toast msg={toast} />
    </>
  );
}

// ---------- SKILLS EDITOR ----------
function SkillsEditor() {
  const [data, setData] = useState({ groups: [] });
  const [toast, setToast] = useState("");
  useEffect(() => { api.get("/skills").then((r) => setData(r.data)).catch((err) => console.error("skills load failed:", err)); }, []);

  const setG = (i, k, v) => setData((d) => { const g = [...d.groups]; g[i] = { ...g[i], [k]: v }; return { groups: g }; });
  const addG = () => setData((d) => ({ groups: [...d.groups, { name: "New group", items: [] }] }));
  const remG = (i) => setData((d) => ({ groups: d.groups.filter((_, n) => n !== i) }));

  const save = async () => {
    const cleaned = { groups: data.groups.map((g) => ({ name: g.name, items: typeof g.items === "string" ? g.items.split(",").map((s) => s.trim()).filter(Boolean) : g.items })) };
    await api.put("/admin/skills", cleaned);
    setToast("Saved"); setTimeout(() => setToast(""), 1500);
  };

  return (
    <>
      <Card title="Skills" action={
        <button onClick={addG} className="inline-flex items-center gap-2 bg-navy text-cream rounded-full px-4 py-2 text-sm hover:bg-cyan_brand" data-testid="skills-add-group">
          <Plus className="w-4 h-4" /> Add group
        </button>
      }>
        <div className="space-y-4">
          {data.groups.map((g, i) => (
            <div key={`group-${i}`} className="border border-navy/15 rounded-xl p-4" data-testid={`skill-group-row-${i}`}>
              <div className="flex items-center gap-3 mb-3">
                <Field label="Group name" value={g.name} onChange={(v) => setG(i, "name", v)} testid={`sk-group-name-${i}`} />
                <button onClick={() => remG(i)} className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg" data-testid={`sk-group-remove-${i}`}><Trash2 className="w-4 h-4" /></button>
              </div>
              <FieldArea
                label="Items (comma-separated)"
                value={Array.isArray(g.items) ? g.items.join(", ") : g.items}
                onChange={(v) => setG(i, "items", v)}
                rows={2}
                testid={`sk-group-items-${i}`}
              />
            </div>
          ))}
        </div>
      </Card>
      <div className="sticky bottom-4 flex justify-end">
        <button onClick={save} className="inline-flex items-center gap-2 bg-cyan_brand text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-navy shadow-xl" data-testid="skills-save">
          <Save className="w-4 h-4" /> Save
        </button>
      </div>
      <Toast msg={toast} />
    </>
  );
}

// ---------- MESSAGES PANEL ----------
function MessagesPanel() {
  const [list, setList] = useState([]);
  const load = useCallback(
    () => api.get("/admin/messages").then((r) => setList(r.data)).catch((err) => console.error("messages load failed:", err)),
    []
  );
  useEffect(() => { load(); }, [load]);
  const del = async (id) => { await api.delete(`/admin/messages/${id}`); load(); };
  const read = async (id) => { await api.put(`/admin/messages/${id}/read`); load(); };

  return (
    <Card title={`Messages (${list.length})`}>
      {list.length === 0 && <div className="text-sm text-ink/55 py-8 text-center" data-testid="messages-empty">No messages yet.</div>}
      <div className="space-y-3">
        {list.map((m) => (
          <div key={m.id} className={`border rounded-xl p-5 ${m.read ? "border-navy/10 bg-bone/40" : "border-cyan_brand/40 bg-cyan_brand/5"}`} data-testid={`message-${m.id}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="w-4 h-4 text-cyan_brand" />
                  <span className="font-display font-bold text-navy">{m.name}</span>
                  {!m.read && <span className="text-[9px] uppercase tracking-[0.18em] bg-cyan_brand text-white rounded-full px-2 py-0.5 font-bold">New</span>}
                </div>
                <a href={`mailto:${m.email}`} className="text-sm text-cyan_brand kinetic-link">{m.email}</a>
                {m.phone && <span className="text-sm text-ink/55"> · {m.phone}</span>}
                <p className="mt-2 text-sm text-ink/80 whitespace-pre-wrap">{m.message}</p>
                <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-ink/45 font-bold">{new Date(m.created_at).toLocaleString()}</div>
              </div>
              <div className="flex flex-col gap-2">
                {!m.read && <button onClick={() => read(m.id)} className="text-xs px-3 py-1.5 rounded-full border border-navy/20 hover:bg-navy hover:text-cream" data-testid={`message-read-${m.id}`}>Mark read</button>}
                <button onClick={() => del(m.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg self-end" data-testid={`message-delete-${m.id}`}><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
