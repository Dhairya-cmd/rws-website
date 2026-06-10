import React, { useState, useEffect, useRef, useCallback } from "react";
import "./AdminDashboard.css";

const API = "/api/admin";

const NAV = [
  { key: "home", label: "Home", icon: "🏠" },
  { key: "about", label: "About", icon: "ℹ️" },
  {
    key: "services",
    label: "Services",
    icon: "⚙️",
    subs: ["All Services", "Add / Edit"],
  },
  { key: "whyus", label: "Why Us", icon: "⭐" },
  {
    key: "industries",
    label: "Industries",
    icon: "🏭",
    subs: ["All Industries", "Add / Edit"],
  },
  {
    key: "gallery",
    label: "Gallery",
    icon: "🖼️",
    subs: ["Uploaded", "Upload New"],
  },
];

const CATS = [
  "Robotic Welding",
  "Manual Welding",
  "CNC Machining",
  "Metal Fabrication",
  "Fixture & Tooling",
  "Sub-Assembly",
];

const emptyPages = {
  home: {
    hero: {
      title: "",
      subtitle: "",
      text: "",
      primaryBtn: "",
      secondaryBtn: "",
    },
    heroVideo: "",
  },
  about: { title: "", subtitle: "", text: "", points: [] },
  whyus: { title: "", subtitle: "", cards: [] },
  industries: { title: "", items: [] },
};

function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="adm-toast">
      <span className={type === "ok" ? "adm-toast-ok" : "adm-toast-err"}>
        {type === "ok" ? "✓" : "✕"}
      </span>
      {msg}
    </div>
  );
}

function CustomDropdown({
  label,
  value,
  options,
  onChange,
  disabled,
  placeholder,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setFocusIdx(-1);
      }
    };
    const onKeyDown = (e) => {
      if (!open) return;
      if (e.key === "Escape") {
        setOpen(false);
        setFocusIdx(-1);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusIdx((prev) => (prev + 1) % options.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIdx((prev) => (prev <= 0 ? options.length - 1 : prev - 1));
      }
      if (e.key === "Enter" && focusIdx >= 0) {
        e.preventDefault();
        onChange(options[focusIdx]);
        setOpen(false);
        setFocusIdx(-1);
      }
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, focusIdx, options, onChange]);

  const selectedLabel = value || placeholder || "Select";

  return (
    <div className={`adm-custom-select ${className}`} ref={wrapRef}>
      {label && <label className="adm-label">{label}</label>}
      <button
        type="button"
        className={`adm-custom-select__control ${open ? "open" : ""} ${value ? "has-value" : ""}`}
        onClick={() => {
          if (!disabled) {
            setOpen((v) => !v);
            setFocusIdx(value ? Math.max(0, options.indexOf(value)) : 0);
          }
        }}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="adm-custom-select__value">{selectedLabel}</span>
        <span className="adm-custom-select__chev">⌄</span>
      </button>

      {open && !disabled && (
        <div className="adm-custom-select__menu" role="listbox">
          {options.map((opt, idx) => {
            const active = value === opt;
            const focused = focusIdx === idx;
            return (
              <button
                key={opt}
                type="button"
                className={`adm-custom-select__option ${active ? "active" : ""} ${focused ? "focused" : ""}`}
                onMouseEnter={() => setFocusIdx(idx)}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                  setFocusIdx(-1);
                }}
                role="option"
                aria-selected={active}
              >
                <span>{opt}</span>
                {active && <span className="adm-custom-select__check">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PreviewCard({ title, summary, fields, onEdit }) {
  return (
    <div className="adm-page-card">
      <div className="adm-page-card__head">
        <div>
          <div className="adm-page-card__title">{title}</div>
          {summary && <div className="adm-page-card__summary">{summary}</div>}
        </div>
        <button
          type="button"
          className="adm-btn adm-btn--ghost adm-btn--sm"
          onClick={onEdit}
        >
          Edit
        </button>
      </div>

      <div className="adm-page-card__body">
        {fields.map((f, i) => (
          <div key={i} className="adm-page-field">
            <span className="adm-page-field__label">{f.label}</span>
            <div className="adm-page-field__value">
              {Array.isArray(f.value) ? (
                <ul className="adm-page-list">
                  {f.value.length ? (
                    f.value.map((x, idx) => <li key={idx}>{x}</li>)
                  ) : (
                    <li>—</li>
                  )}
                </ul>
              ) : (
                <span>{f.value || "—"}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageEditor({ pageKey, data, onClose, onSave, onToast }) {
  const [form, setForm] = useState(data);
  const [busy, setBusy] = useState(false);
  const [newIndustry, setNewIndustry] = useState("");
  const fileRef = useRef(null);

  useEffect(() => setForm(data), [data]);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const setNested = (group, k, v) =>
    setForm((p) => ({ ...p, [group]: { ...(p[group] || {}), [k]: v } }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(`${API}/pages/${pageKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      await onSave();
      onToast("Content updated!", "ok");
      onClose();
    } catch (err) {
      onToast(err.message || "Save failed", "err");
    } finally {
      setBusy(false);
    }
  };

  const uploadHomeVideo = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("video", file);
      const res = await fetch(`${API}/pages/home/media`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const d = await res.json();
      setField("heroVideo", d.url || form.heroVideo);
      await onSave();
      onToast("Homepage video updated!", "ok");
    } catch (err) {
      onToast(err.message || "Upload failed", "err");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const addIndustry = async () => {
    const val = newIndustry.trim();
    if (!val) return;
    setBusy(true);
    try {
      const res = await fetch(`${API}/pages/industries/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: val }),
      });
      if (!res.ok) throw new Error("Add failed");
      setNewIndustry("");
      await onSave();
      onToast("Industry added!", "ok");
      onClose();
    } catch (err) {
      onToast(err.message || "Add failed", "err");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-page-editor">
      <div className="adm-card">
        <div className="adm-card-title">Editing: {pageKey}</div>

        <form onSubmit={submit}>
          {pageKey === "home" && (
            <div className="adm-fields-grid">
              <div className="adm-group">
                <label className="adm-label">Headline Title</label>
                <input
                  className="adm-input"
                  value={form.hero?.title || ""}
                  onChange={(e) => setNested("hero", "title", e.target.value)}
                />
              </div>
              <div className="adm-group">
                <label className="adm-label">Headline Subtitle</label>
                <input
                  className="adm-input"
                  value={form.hero?.subtitle || ""}
                  onChange={(e) =>
                    setNested("hero", "subtitle", e.target.value)
                  }
                />
              </div>
              <div className="adm-group adm-field-full">
                <label className="adm-label">Supporting Text</label>
                <textarea
                  className="adm-textarea"
                  rows={3}
                  value={form.hero?.text || ""}
                  onChange={(e) => setNested("hero", "text", e.target.value)}
                />
              </div>
              <div className="adm-group">
                <label className="adm-label">Primary Button Text</label>
                <input
                  className="adm-input"
                  value={form.hero?.primaryBtn || ""}
                  onChange={(e) =>
                    setNested("hero", "primaryBtn", e.target.value)
                  }
                />
              </div>
              <div className="adm-group">
                <label className="adm-label">Secondary Button Text</label>
                <input
                  className="adm-input"
                  value={form.hero?.secondaryBtn || ""}
                  onChange={(e) =>
                    setNested("hero", "secondaryBtn", e.target.value)
                  }
                />
              </div>
              <div className="adm-group adm-field-full">
                <label className="adm-label">Background Video</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="video/*"
                  className="adm-file-input"
                  onChange={(e) => uploadHomeVideo(e.target.files?.[0])}
                />
                <button
                  type="button"
                  className="adm-btn adm-btn--ghost"
                  onClick={() => fileRef.current?.click()}
                  disabled={busy}
                >
                  Choose Video
                </button>
                <div className="adm-hint">
                  Current: {form.heroVideo || "No video set"}
                </div>
              </div>
            </div>
          )}

          {pageKey === "about" && (
            <div className="adm-fields-grid">
              <div className="adm-group">
                <label className="adm-label">Title</label>
                <input
                  className="adm-input"
                  value={form.title || ""}
                  onChange={(e) => setField("title", e.target.value)}
                />
              </div>
              <div className="adm-group">
                <label className="adm-label">Tag Line</label>
                <input
                  className="adm-input"
                  value={form.subtitle || ""}
                  onChange={(e) => setField("subtitle", e.target.value)}
                />
              </div>
              <div className="adm-group adm-field-full">
                <label className="adm-label">Description</label>
                <textarea
                  className="adm-textarea"
                  rows={4}
                  value={form.text || ""}
                  onChange={(e) => setField("text", e.target.value)}
                />
              </div>
              <div className="adm-group adm-field-full">
                <label className="adm-label">Points</label>
                <textarea
                  className="adm-textarea"
                  rows={4}
                  value={(form.points || []).join("\n")}
                  onChange={(e) =>
                    setField(
                      "points",
                      e.target.value.split("\n").filter(Boolean),
                    )
                  }
                />
                <div className="adm-hint">One point per line</div>
              </div>
            </div>
          )}

          {pageKey === "whyus" && (
            <div className="adm-fields-grid">
              <div className="adm-group">
                <label className="adm-label">Title</label>
                <input
                  className="adm-input"
                  value={form.title || ""}
                  onChange={(e) => setField("title", e.target.value)}
                />
              </div>
              <div className="adm-group">
                <label className="adm-label">Subtitle</label>
                <input
                  className="adm-input"
                  value={form.subtitle || ""}
                  onChange={(e) => setField("subtitle", e.target.value)}
                />
              </div>
              <div className="adm-group adm-field-full">
                <label className="adm-label">Cards</label>
                <textarea
                  className="adm-textarea"
                  rows={7}
                  value={(form.cards || [])
                    .map((c) => `${c.title}|${c.text}`)
                    .join("\n")}
                  onChange={(e) => {
                    const cards = e.target.value
                      .split("\n")
                      .filter(Boolean)
                      .map((line) => {
                        const [title, text] = line.split("|");
                        return {
                          title: title?.trim() || "",
                          text: text?.trim() || "",
                        };
                      });
                    setField("cards", cards);
                  }}
                />
                <div className="adm-hint">
                  One card per line in the format: title|text
                </div>
              </div>
            </div>
          )}

          {pageKey === "industries" && (
            <div className="adm-fields-grid">
              <div className="adm-group adm-field-full">
                <label className="adm-label">Title</label>
                <input
                  className="adm-input"
                  value={form.title || ""}
                  onChange={(e) => setField("title", e.target.value)}
                />
              </div>

              <div className="adm-group adm-field-full">
                <label className="adm-label">Industries List</label>
                <textarea
                  className="adm-textarea"
                  rows={7}
                  value={(form.items || []).join("\n")}
                  onChange={(e) =>
                    setField(
                      "items",
                      e.target.value.split("\n").filter(Boolean),
                    )
                  }
                />
                <div className="adm-hint">One industry per line</div>
              </div>

              <div className="adm-group adm-field-full">
                <label className="adm-label">Add New Industry</label>
                <div className="adm-inline-row">
                  <input
                    className="adm-input"
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    placeholder="e.g. Aerospace Fabrication"
                  />
                  <button
                    type="button"
                    className="adm-btn"
                    onClick={addIndustry}
                    disabled={busy}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="adm-btn-row">
            <button type="submit" className="adm-btn" disabled={busy}>
              {busy ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              className="adm-btn adm-btn--ghost"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ServicesManager({ services, sub, onSave, onToast }) {
  const [form, setForm] = useState({ title: "", desc: "", detail: "" });
  const [editing, setEditing] = useState(null);
  const formRef = useRef(null);

  const handle = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const body = editing ? { ...form, id: editing._id } : form;
    await fetch(`${API}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setForm({ title: "", desc: "", detail: "" });
    setEditing(null);
    await onSave();
    onToast(editing ? "Service updated!" : "Service added!", "ok");
  };

  const del = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    await fetch(`${API}/services/${id}`, { method: "DELETE" });
    await onSave();
    onToast("Service deleted", "ok");
  };

  const edit = (s) => {
    setEditing(s);
    setForm({ title: s.title, desc: s.desc || "", detail: s.detail || "" });
    setTimeout(
      () =>
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50,
    );
  };

  const cancel = () => {
    setEditing(null);
    setForm({ title: "", desc: "", detail: "", order: 0 });
  };

  if (sub === "Add / Edit") {
    return (
      <div className="adm-card" ref={formRef}>
        <div className="adm-card-title">
          {editing ? "Editing: " + editing.title : "Add New Service"}
        </div>
        <form onSubmit={submit}>
          <div className="adm-fields-grid">
            <div className="adm-group adm-field-full">
              <label className="adm-label">Title</label>
              <input
                className="adm-input"
                name="title"
                value={form.title}
                onChange={handle}
                placeholder="e.g. Robotic MIG Welding"
                required
              />
            </div>

            <div className="adm-group adm-field-full">
              <label className="adm-label">
                Short Description (card preview)
              </label>
              <textarea
                className="adm-textarea"
                name="desc"
                value={form.desc}
                onChange={handle}
                rows={2}
                placeholder="One-sentence summary shown on service card"
                required
              />
            </div>
            <div className="adm-group adm-field-full">
              <label className="adm-label">Full Detail (expanded view)</label>
              <textarea
                className="adm-textarea"
                name="detail"
                value={form.detail}
                onChange={handle}
                rows={3}
                placeholder="Full description shown when user clicks Learn More"
              />
            </div>
          </div>
          <div className="adm-btn-row">
            <button type="submit" className="adm-btn">
              {editing ? "Update Service" : "Add Service"}
            </button>
            {editing && (
              <button
                type="button"
                className="adm-btn adm-btn--ghost"
                onClick={cancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      {editing && (
        <div className="adm-card adm-edit-inline" ref={formRef}>
          <div className="adm-card-title">Editing: {editing.title}</div>
          <form onSubmit={submit}>
            <div className="adm-fields-grid">
              <div className="adm-group">
                <label className="adm-label">Title</label>
                <input
                  className="adm-input"
                  name="title"
                  value={form.title}
                  onChange={handle}
                  required
                />
              </div>
              <div className="adm-group">
                <label className="adm-label">Display Order</label>
                <input
                  className="adm-input"
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={handle}
                />
              </div>
              <div className="adm-group adm-field-full">
                <label className="adm-label">Short Description</label>
                <textarea
                  className="adm-textarea"
                  name="desc"
                  value={form.desc}
                  onChange={handle}
                  rows={2}
                  required
                />
              </div>
              <div className="adm-group adm-field-full">
                <label className="adm-label">Full Detail</label>
                <textarea
                  className="adm-textarea"
                  name="detail"
                  value={form.detail}
                  onChange={handle}
                  rows={3}
                />
              </div>
            </div>
            <div className="adm-btn-row">
              <button type="submit" className="adm-btn">
                Update Service
              </button>
              <button
                type="button"
                className="adm-btn adm-btn--ghost"
                onClick={cancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="adm-card">
        <div className="adm-card-title">All Services ({services.length})</div>
        {services.length === 0 ? (
          <div className="adm-empty">
            No services yet. Switch to "Add / Edit" to create your first
            service.
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...services]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((s, i) => (
                  <tr
                    key={s._id}
                    style={
                      editing?._id === s._id
                        ? { background: "rgba(200,16,46,.04)" }
                        : {}
                    }
                  >
                    <td>
                      <span className="adm-table-num">0{i + 1}</span>
                    </td>
                    <td>
                      <span className="adm-table-title">{s.title}</span>
                    </td>
                    <td style={{ maxWidth: 320, color: "#64748b" }}>
                      {s.desc}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: ".5rem" }}>
                        <button
                          type="button"
                          className="adm-btn adm-btn--ghost adm-btn--sm"
                          onClick={() => edit(s)}
                        >
                          {editing?._id === s._id ? "Editing…" : "Edit"}
                        </button>
                        <button
                          type="button"
                          className="adm-btn adm-btn--danger adm-btn--sm"
                          onClick={() => del(s._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function IndustriesManager({ industries, sub, onSave, onToast }) {
  const [form, setForm] = useState({ title: "", order: 0 });
  const [editing, setEditing] = useState(null);
  const formRef = useRef(null);

  const handle = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const body = editing ? { ...form, id: editing._id } : form;
    await fetch(`${API}/industries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setForm({ title: "", order: 0 });
    setEditing(null);
    await onSave();
    onToast(editing ? "Industry updated!" : "Industry added!", "ok");
  };

  const del = async (id) => {
    if (!window.confirm("Delete this industry?")) return;
    await fetch(`${API}/industries/${id}`, { method: "DELETE" });
    await onSave();
    onToast("Industry deleted", "ok");
  };

  const edit = (item) => {
    setEditing(item);
    setForm({ title: item.title, order: item.order || 0 });
    setTimeout(
      () =>
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50,
    );
  };

  const cancel = () => {
    setEditing(null);
    setForm({ title: "", order: 0 });
  };

  if (sub === "Add / Edit") {
    return (
      <div className="adm-card" ref={formRef}>
        <div className="adm-card-title">
          {editing ? "Editing: " + editing.title : "Add New Industry"}
        </div>
        <form onSubmit={submit}>
          <div className="adm-fields-grid">
            <div className="adm-group">
              <label className="adm-label">Title</label>
              <input
                className="adm-input"
                name="title"
                value={form.title}
                onChange={handle}
                placeholder="e.g. Aerospace Fabrication"
                required
              />
            </div>
            <div className="adm-group">
              <label className="adm-label">Display Order</label>
              <input
                className="adm-input"
                type="number"
                name="order"
                value={form.order}
                onChange={handle}
              />
            </div>
          </div>
          <div className="adm-btn-row">
            <button type="submit" className="adm-btn">
              {editing ? "Update Industry" : "Add Industry"}
            </button>
            {editing && (
              <button
                type="button"
                className="adm-btn adm-btn--ghost"
                onClick={cancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="adm-card">
      <div className="adm-card-title">All Industries ({industries.length})</div>
      {industries.length === 0 ? (
        <div className="adm-empty">
          No industries yet. Use "Add / Edit" to create your first industry.
        </div>
      ) : (
        <table className="adm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...industries]
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((item, i) => (
                <tr
                  key={item._id}
                  style={
                    editing?._id === item._id
                      ? { background: "rgba(200,16,46,.04)" }
                      : {}
                  }
                >
                  <td>
                    <span className="adm-table-num">0{i + 1}</span>
                  </td>
                  <td>
                    <span className="adm-table-title">{item.title}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: ".5rem" }}>
                      <button
                        type="button"
                        className="adm-btn adm-btn--ghost adm-btn--sm"
                        onClick={() => edit(item)}
                      >
                        {editing?._id === item._id ? "Editing…" : "Edit"}
                      </button>
                      <button
                        type="button"
                        className="adm-btn adm-btn--danger adm-btn--sm"
                        onClick={() => del(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function GalleryManager({ gallery, sub, onSave, onToast }) {
  const [cat, setCat] = useState(CATS[0]);
  const [mtype, setMtype] = useState("image");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const token = localStorage.getItem("adminToken");
  const auth = { Authorization: `Bearer ${token}` };

  const upload = async (e) => {
    e.preventDefault();
    if (!files.length) return;
    setUploading(true);
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    fd.append("category", cat);
    fd.append("mediaType", mtype);
    await fetch(`${API}/gallery`, { method: "POST", body: fd, headers: auth });
    setFiles([]);
    if (fileRef.current) fileRef.current.value = "";
    await onSave();
    setUploading(false);
    onToast("Media uploaded successfully!", "ok");
  };

  const del = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await fetch(`${API}/gallery/${id}`, { method: "DELETE", headers: auth });
    await onSave();
    onToast("Item deleted", "ok");
  };

  const clearFiles = () => {
    setFiles([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  if (sub === "Upload New") {
    const images = gallery.filter(i => i.type === 'image');
const videos = gallery.filter(i => i.type === 'video');

const GalleryGrid = ({ items }) => (
  <div className="adm-gallery-grid">
    {items.map((item) => (
      <div key={item._id} className="adm-gallery-item">
        {item.type === 'image' ? (
          <img src={item.mediaUrl} alt={item.category} loading="lazy" />
        ) : (
          <video
            src={item.mediaUrl}
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={e => { e.target.currentTime = 1; }}
          />
        )}
        <div className="adm-gallery-overlay">
          <span>{item.category}</span>
          <button type="button" className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => del(item._id)}>
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
);

return (
  <div>
    {gallery.length === 0 ? (
      <div className="adm-card">
        <div className="adm-empty">No media uploaded yet. Use "Upload New" to add photos and videos.</div>
      </div>
    ) : (
      <>
        <div className="adm-card">
          <div className="adm-card-title">Photos ({images.length})</div>
          {images.length === 0
            ? <div className="adm-empty">No photos uploaded yet.</div>
            : <GalleryGrid items={images} />
          }
        </div>
        <div className="adm-card">
          <div className="adm-card-title">Videos ({videos.length})</div>
          {videos.length === 0
            ? <div className="adm-empty">No videos uploaded yet.</div>
            : <GalleryGrid items={videos} />
          }
        </div>
      </>
    )}
  </div>
);
  }

  return (
    <div className="adm-card">
      <div className="adm-card-title">Gallery ({gallery.length} items)</div>
      {gallery.length === 0 ? (
        <div className="adm-empty">
          No media uploaded yet. Use "Upload New" to add photos and videos.
        </div>
      ) : (
        <div className="adm-gallery-grid">
          {gallery.map((item) => (
            <div key={item._id} className="adm-gallery-item">
              {item.type === 'image' ? (
  <img src={item.mediaUrl} alt={item.category} loading="lazy" />
) : (
  <video
    src={item.mediaUrl}
    muted
    playsInline
    preload="metadata"
    onLoadedMetadata={e => { e.target.currentTime = 1; }}
  />
)}
              <div className="adm-gallery-overlay">
                <span>{item.category}</span>
                <button
                  type="button"
                  className="adm-btn adm-btn--danger adm-btn--sm"
                  onClick={() => del(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ComingSoon() {
  return (
    <div className="adm-coming-soon">
      <div className="adm-coming-soon__card">
        <div className="adm-coming-soon__badge">Coming Soon</div>
        <div className="adm-coming-soon__title">
          This section is coming soon
        </div>
        <div className="adm-coming-soon__text">
          This page is not ready yet. For now, only Services and Gallery are
          active.
        </div>
        <div className="adm-coming-soon__note">
          Add / Edit actions are also disabled for these pages until they are
          built.
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [activeSub, setActiveSub] = useState("");
  const [allData, setAllData] = useState({
    services: [],
    gallery: [],
    industries: [],
    pages: emptyPages,
  });
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`${API}/all-content`);
      const d = await r.json();
      setAllData({
        services: d.services || [],
        gallery: d.gallery || [],
        industries: d.industries || [],
        pages: {
          ...emptyPages,
          ...(d.pages || {}),
        },
      });
    } catch {}
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const showToast = (msg, type = "ok") => setToast({ msg, type });
  const goTo = (key, sub = "") => {
    setActivePage(key);
    setActiveSub(sub);
  };

  const activeItem = NAV.find((n) => n.key === activePage);
  const topbarTitle = activeItem
    ? `${activeItem.label}${activeSub ? ` — ${activeSub}` : ""}`
    : "";

  const renderBody = () => {
    if (activePage === "services")
      return (
        <ServicesManager
          services={allData.services}
          sub={activeSub || "All Services"}
          onSave={load}
          onToast={showToast}
        />
      );
    if (activePage === "gallery")
      return (
        <GalleryManager
          gallery={allData.gallery}
          sub={activeSub || "Uploaded"}
          onSave={load}
          onToast={showToast}
        />
      );
    return <ComingSoon />;
  };

  return (
    <div className={`adm${collapsed ? " adm--collapsed" : ""}`}>
      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}

      <aside
  className="adm-side"
  onMouseEnter={() => setCollapsed(false)}
  onMouseLeave={() => setCollapsed(true)}
>
        <div className="adm-side-top">
          <span className="adm-logo">
  {collapsed ? (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 3L4 9v9c0 7.5 5.8 14.5 14 16.5C26.2 32.5 32 25.5 32 18V9L18 3z"
        fill="rgba(200,16,46,.18)" stroke="rgba(200,16,46,.7)" strokeWidth="1.5" strokeLinejoin="round"/>
      <text x="18" y="22" textAnchor="middle" fill="#FF4D63"
        style={{fontSize:'9px',fontFamily:'Space Grotesk, sans-serif',fontWeight:700,letterSpacing:'1px'}}>
        RWS
      </text>
    </svg>
  ) : (
    <>
      <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
        <path d="M18 3L4 9v9c0 7.5 5.8 14.5 14 16.5C26.2 32.5 32 25.5 32 18V9L18 3z"
          fill="rgba(200,16,46,.18)" stroke="rgba(200,16,46,.7)" strokeWidth="1.5" strokeLinejoin="round"/>
        <text x="18" y="22" textAnchor="middle" fill="#FF4D63"
          style={{fontSize:'9px',fontFamily:'Space Grotesk, sans-serif',fontWeight:700,letterSpacing:'1px'}}>
          RWS
        </text>
      </svg>
      RWS ADMIN
    </>
  )}
</span>
          
        </div>

        <nav className="adm-nav">
          {NAV.map((item) => {
            const isActive = activePage === item.key;
            return (
              <div key={item.key}>
                <button
                  type="button"
                  className={`adm-nav-item${isActive ? " active" : ""}`}
                  onClick={() => goTo(item.key, item.subs?.[0] || "")}
                  title={item.label}
                >
                  <span className="adm-nav-icon">{item.icon}</span>
                  <span className="adm-nav-label">{item.label}</span>
                </button>
                {isActive && !collapsed && item.subs?.length > 0 && (
                  <div className="adm-subtabs">
                    {item.subs.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`adm-subtab${activeSub === s ? " active" : ""}`}
                        onClick={() => setActiveSub(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="adm-side-footer">
          <button
            className="adm-logout-btn"
            type="button"
            onClick={onLogout}
            title="Close Admin Panel"
          >
            <span>✕</span>
            <span className="adm-logout-label">Close Panel</span>
          </button>
        </div>
      </aside>

      <main className="adm-main">
        <div className="adm-topbar">
          <div className="adm-topbar-left">
            <h1>{topbarTitle}</h1>
            <p>Changes save instantly and reflect live on the website</p>
          </div>
        </div>

        <div className="adm-body">{renderBody()}</div>
      </main>
    </div>
  );
}
