/* ============================================================
   Chapter Admin — edits data/*.json and uploads photos by
   committing directly to the GitHub repository via the
   Contents API. Works on any static host; the host's GitHub
   integration redeploys the site automatically after a save.
   ============================================================ */
(() => {
  const OWNER = "BZATX";
  const REPO = "theta-xi-auburn-website";
  const BRANCH = "main";
  const TOKEN_KEY = "bz_admin_token";

  /* ---------- Section definitions ---------- */
  const SECTIONS = {
    members: {
      file: "data/members.json",
      arrayKey: "members",
      title: "Exec Board & Bios",
      hint: "These cards appear on the Members page and the home page. Keep bios to 2–3 sentences.",
      itemName: (it) => it.name || "New member",
      newItem: { name: "", role: "", major: "", hometown: "", photo: "", bio: "", email: "" },
      fields: [
        { key: "name", label: "Name" },
        { key: "role", label: "Position / Role" },
        { key: "major", label: "Major" },
        { key: "hometown", label: "Hometown" },
        { key: "photo", label: "Photo", type: "image" },
        { key: "bio", label: "Bio", type: "textarea", full: true },
        { key: "email", label: "Email (optional)" }
      ]
    },
    gallery: {
      file: "data/gallery.json",
      arrayKey: "photos",
      title: "Photo Gallery",
      hint: "Photos tagged 'brotherhood' show on the Brotherhood page, 'service' on the Service page.",
      itemName: (it) => it.caption || "New photo",
      newItem: { src: "", caption: "", category: "brotherhood" },
      fields: [
        { key: "src", label: "Photo", type: "image", full: true },
        { key: "caption", label: "Caption" },
        { key: "category", label: "Category", type: "select", options: ["brotherhood", "service", "house", "other"] }
      ]
    },
    journal: {
      file: "data/journal.json",
      arrayKey: "posts",
      title: "Journal Posts",
      hint: "Newest date shows first. The three most recent posts also appear on the home page.",
      itemName: (it) => it.title || "New post",
      newItem: { title: "", date: new Date().toISOString().slice(0, 10), cover: "", excerpt: "", link: "" },
      fields: [
        { key: "title", label: "Title" },
        { key: "date", label: "Date", type: "date" },
        { key: "cover", label: "Cover photo", type: "image", full: true },
        { key: "excerpt", label: "Summary", type: "textarea", full: true },
        { key: "link", label: "Link for 'Read more' (optional)" }
      ]
    },
    alumni: {
      file: "data/alumni.json",
      arrayKey: "alumni",
      title: "Notable Alumni",
      hint: "Shown on the Notable Alumni page.",
      itemName: (it) => it.name || "New alumnus",
      newItem: { name: "", role: "", photo: "", bio: "", link: "", linkLabel: "" },
      fields: [
        { key: "name", label: "Name" },
        { key: "role", label: "Title / Distinction" },
        { key: "photo", label: "Photo", type: "image", full: true },
        { key: "bio", label: "Bio", type: "textarea", full: true },
        { key: "link", label: "Link (optional)" },
        { key: "linkLabel", label: "Link label (optional)" }
      ]
    },
    chapter: {
      file: "data/chapter.json",
      title: "Chapter Info",
      hint: "Stats shown on the home page, plus chapter contact details.",
      objectFields: [
        { key: "address", label: "House address" },
        { key: "email", label: "Chapter email" },
        { key: "instagram", label: "Instagram URL" },
        { key: "facebook", label: "Facebook URL" },
        { key: "stats.founded", label: "Founded (year)", type: "number" },
        { key: "stats.yearsAtAuburn", label: "Years at Auburn", type: "number" },
        { key: "stats.activeBrothers", label: "Active brothers", type: "number" },
        { key: "stats.serviceHours", label: "Service hours / year", type: "number" }
      ]
    }
  };

  /* ---------- State ---------- */
  let token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";
  let currentSection = "members";
  const cache = {}; // sectionId -> { data, sha }

  /* ---------- DOM ---------- */
  const $ = (sel) => document.querySelector(sel);
  const loginView = $("#login-view");
  const editorView = $("#editor-view");
  const sectionBody = $("#section-body");
  const toastEl = $("#toast");

  /* ---------- Utilities ---------- */
  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  function toast(msg, type = "") {
    toastEl.textContent = msg;
    toastEl.className = `toast show ${type}`;
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => (toastEl.className = "toast"), 4000);
  }

  const b64encodeText = (str) => {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin);
  };
  const b64decodeText = (b64) => {
    const bin = atob(b64.replace(/\s/g, ""));
    return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
  };

  const getPath = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  const setPath = (obj, path, value) => {
    const keys = path.split(".");
    const last = keys.pop();
    const target = keys.reduce((o, k) => (o[k] = o[k] || {}), obj);
    target[last] = value;
  };

  /* ---------- GitHub API ---------- */
  async function gh(path, opts = {}) {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}${path}`, {
      ...opts,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(opts.headers || {})
      }
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || `GitHub error ${res.status}`);
    }
    return res.json();
  }

  const getFile = (path) => gh(`/contents/${encodeURI(path)}?ref=${BRANCH}`);

  const putFile = (path, base64Content, message, sha) =>
    gh(`/contents/${encodeURI(path)}`, {
      method: "PUT",
      body: JSON.stringify({ message, content: base64Content, branch: BRANCH, ...(sha ? { sha } : {}) })
    });

  /* ---------- Login ---------- */
  async function connect(t, remember) {
    token = t;
    await gh(""); // verify the token can see the repo
    if (remember) localStorage.setItem(TOKEN_KEY, t);
    else sessionStorage.setItem(TOKEN_KEY, t);
    loginView.hidden = true;
    editorView.hidden = false;
    $("#logout-btn").hidden = false;
    openSection(currentSection);
  }

  $("#login-btn").addEventListener("click", async () => {
    const t = $("#token-input").value.trim();
    const status = $("#login-status");
    if (!t) {
      status.className = "form-status error";
      status.textContent = "Paste a token first.";
      return;
    }
    status.className = "form-status";
    status.textContent = "";
    try {
      await connect(t, $("#remember-token").checked);
    } catch (err) {
      token = "";
      status.className = "form-status error";
      status.textContent = `Could not connect: ${err.message}. Check that the token has Contents read/write access to ${OWNER}/${REPO}.`;
    }
  });

  $("#logout-btn").addEventListener("click", () => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    location.reload();
  });

  /* ---------- Section rendering ---------- */
  function fieldControl(field, value, name) {
    const v = esc(value);
    if (field.type === "textarea")
      return `<textarea class="form-control" data-field="${name}" rows="3">${v}</textarea>`;
    if (field.type === "select")
      return `<select class="form-control" data-field="${name}">
        ${field.options.map((o) => `<option value="${esc(o)}"${o === value ? " selected" : ""}>${esc(o)}</option>`).join("")}
      </select>`;
    if (field.type === "image")
      return `<div class="image-field">
        <div class="image-thumb" style="background-image:url('../${v}')"></div>
        <div class="image-field-controls">
          <input type="text" class="form-control" data-field="${name}" value="${v}" placeholder="assets/images/uploads/…">
          <div>
            <button type="button" class="btn btn-glass btn-sm upload-btn" data-target="${name}">Upload photo</button>
            <input type="file" accept="image/*" data-upload-for="${name}" hidden>
          </div>
        </div>
      </div>`;
    const type = field.type === "number" ? "number" : field.type === "date" ? "date" : "text";
    return `<input type="${type}" class="form-control" data-field="${name}" value="${v}">`;
  }

  function renderSection(id) {
    const cfg = SECTIONS[id];
    const { data } = cache[id];
    $("#section-title").innerHTML = cfg.title;
    $("#section-hint").textContent = cfg.hint;
    $("#add-item-btn").hidden = !cfg.arrayKey;

    if (cfg.objectFields) {
      sectionBody.innerHTML = `<div class="admin-item"><div class="admin-fields">
        ${cfg.objectFields
          .map(
            (f) => `<div class="form-group${f.full ? " full" : ""}">
              <label>${esc(f.label)}</label>
              ${fieldControl(f, getPath(data, f.key), f.key)}
            </div>`
          )
          .join("")}
      </div></div>`;
      return;
    }

    const items = data[cfg.arrayKey] || [];
    sectionBody.innerHTML = items.length
      ? items
          .map(
            (item, idx) => `<div class="admin-item" data-idx="${idx}">
        <div class="admin-item-head">
          <span class="admin-item-title">${esc(cfg.itemName(item))}</span>
          <div class="admin-item-tools">
            <button type="button" class="icon-btn" data-act="up" data-idx="${idx}" title="Move up">↑</button>
            <button type="button" class="icon-btn" data-act="down" data-idx="${idx}" title="Move down">↓</button>
            <button type="button" class="icon-btn danger" data-act="del" data-idx="${idx}" title="Delete">✕</button>
          </div>
        </div>
        <div class="admin-fields">
          ${cfg.fields
            .map(
              (f) => `<div class="form-group${f.full || f.type === "textarea" ? " full" : ""}">
                <label>${esc(f.label)}</label>
                ${fieldControl(f, item[f.key], `${idx}.${f.key}`)}
              </div>`
            )
            .join("")}
        </div>
      </div>`
          )
          .join("")
      : `<p style="color:var(--text-low)">Nothing here yet — click “+ Add”.</p>`;
  }

  async function openSection(id) {
    currentSection = id;
    document.querySelectorAll(".admin-tab").forEach((t) => t.classList.toggle("active", t.dataset.section === id));
    if (!cache[id]) {
      sectionBody.innerHTML = `<p style="color:var(--text-low)">Loading…</p>`;
      try {
        const file = await getFile(SECTIONS[id].file);
        cache[id] = { data: JSON.parse(b64decodeText(file.content)), sha: file.sha };
      } catch (err) {
        sectionBody.innerHTML = `<p style="color:#ffb3b3">Could not load ${SECTIONS[id].file}: ${esc(err.message)}</p>`;
        return;
      }
    }
    renderSection(id);
  }

  document.querySelectorAll(".admin-tab").forEach((tab) =>
    tab.addEventListener("click", () => openSection(tab.dataset.section))
  );

  /* ---------- Editing ---------- */
  sectionBody.addEventListener("input", (e) => {
    const name = e.target.dataset.field;
    if (!name) return;
    const cfg = SECTIONS[currentSection];
    const { data } = cache[currentSection];
    let value = e.target.type === "number" ? Number(e.target.value) : e.target.value;

    if (cfg.objectFields) {
      setPath(data, name, value);
    } else {
      const dot = name.indexOf(".");
      const idx = Number(name.slice(0, dot));
      const key = name.slice(dot + 1);
      data[cfg.arrayKey][idx][key] = value;
      // refresh image thumb live
      const thumb = e.target.closest(".image-field")?.querySelector(".image-thumb");
      if (thumb) thumb.style.backgroundImage = `url('../${value}')`;
    }
  });

  sectionBody.addEventListener("click", (e) => {
    const cfg = SECTIONS[currentSection];

    const uploadBtn = e.target.closest(".upload-btn");
    if (uploadBtn) {
      sectionBody.querySelector(`input[data-upload-for="${uploadBtn.dataset.target}"]`).click();
      return;
    }

    const act = e.target.dataset.act;
    if (!act || !cfg.arrayKey) return;
    const idx = Number(e.target.dataset.idx);
    const arr = cache[currentSection].data[cfg.arrayKey];
    if (act === "del") {
      if (!confirm("Delete this entry? (It isn't published until you hit Save.)")) return;
      arr.splice(idx, 1);
    } else if (act === "up" && idx > 0) {
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    } else if (act === "down" && idx < arr.length - 1) {
      [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
    }
    renderSection(currentSection);
  });

  $("#add-item-btn").addEventListener("click", () => {
    const cfg = SECTIONS[currentSection];
    if (!cfg.arrayKey) return;
    cache[currentSection].data[cfg.arrayKey].unshift({ ...cfg.newItem });
    renderSection(currentSection);
  });

  /* ---------- Photo upload ---------- */
  sectionBody.addEventListener("change", async (e) => {
    const target = e.target.dataset.uploadFor;
    if (!target || !e.target.files?.length) return;
    const file = e.target.files[0];
    try {
      toast("Uploading photo…");
      const base64 = await resizeToBase64(file);
      const safeName = file.name.toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "-").slice(0, 40);
      const path = `assets/images/uploads/${Date.now()}-${safeName}.jpg`;
      await putFile(path, base64, `Upload photo ${safeName} via chapter admin`);
      const input = sectionBody.querySelector(`[data-field="${CSS.escape(target)}"]`);
      input.value = path;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      toast("Photo uploaded — hit Save & Publish to use it.", "success");
    } catch (err) {
      toast(`Upload failed: ${err.message}`, "error");
    } finally {
      e.target.value = "";
    }
  });

  // Downscale to max 1600px JPEG so the repo and the site stay fast.
  function resizeToBase64(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const max = 1600;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85).split(",")[1]);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Could not read that image file"));
      };
      img.src = url;
    });
  }

  /* ---------- Save ---------- */
  $("#save-btn").addEventListener("click", async () => {
    const cfg = SECTIONS[currentSection];
    const entry = cache[currentSection];
    if (!entry) return;
    const btn = $("#save-btn");
    btn.disabled = true;
    btn.textContent = "Saving…";
    try {
      const json = JSON.stringify(entry.data, null, 2) + "\n";
      const res = await putFile(cfg.file, b64encodeText(json), `Update ${cfg.title.toLowerCase()} via chapter admin`, entry.sha);
      entry.sha = res.content.sha;
      toast("Saved! The live site updates in a minute or two.", "success");
    } catch (err) {
      toast(`Save failed: ${err.message}`, "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Save & Publish";
    }
  });

  /* ---------- Boot ---------- */
  if (token) {
    connect(token, !!localStorage.getItem(TOKEN_KEY)).catch(() => {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      token = "";
    });
  }
})();
