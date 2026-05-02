import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import Logo from "../components/Logo";

function LoginHeader() {
  return (
    <div className="flex items-center gap-3 mb-10 justify-center">
      <Logo size={48} />
      <div>
        <div className="font-display font-bold text-navy text-lg">Clifford Santos</div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-ink/55 font-bold">Admin Console</div>
      </div>
    </div>
  );
}

function LoginField({ label, type, value, onChange, testid }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.22em] text-ink/55 font-bold">{label}</span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-underline"
        data-testid={testid}
      />
    </label>
  );
}

function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await api.post("/auth/login", { email, password: pw });
      onSuccess();
    } catch (ex) {
      const d = ex.response?.data?.detail;
      setErr(typeof d === "string" ? d : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 space-y-4" data-testid="admin-login-form">
      <LoginField label="Email" type="email" value={email} onChange={setEmail} testid="admin-email-input" />
      <LoginField label="Password" type="password" value={pw} onChange={setPw} testid="admin-password-input" />
      {err && <div className="text-sm text-red-600" data-testid="admin-login-error">{err}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 bg-navy text-cream rounded-full py-3.5 text-sm font-medium hover:bg-cyan_brand transition-colors disabled:opacity-60"
        data-testid="admin-login-submit"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLogin() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <LoginHeader />
        <div className="bg-white rounded-3xl border border-navy/10 p-8 lg:p-10 shadow-xl">
          <h1 className="font-display font-bold text-navy text-3xl tracking-tightest leading-none">Sign in.</h1>
          <p className="mt-2 text-sm text-ink/60">Manage your portfolio content.</p>
          <LoginForm onSuccess={() => nav("/admin/dashboard")} />
        </div>
        <div className="mt-6 text-center text-xs text-ink/50">
          <a href="/" className="kinetic-link">← Back to portfolio</a>
        </div>
      </div>
    </div>
  );
}
