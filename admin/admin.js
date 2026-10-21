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
  const TOKEN_KEY = "bz_admin_key";
  // Keys saved under the old name were kept on the device by default. Drop them
  // once, so a shared computer doesn't stay signed in.
  const OLD_TOKEN_KEY = "bz_admin_token";
  // Uploads are resized so their longest side is at most this many pixels.
  const GALLERY_MAX_PX = 1600;
  const PORTRAIT_MAX_PX = 1200; // headshots and news covers

  /* ---------- Section definitions ---------- */
  const SECTIONS = {
    members: {
      file: "data/members.json",
      arrayKey: "members",
      title: "Exec Board & Bios",
      hint: "These cards appear on the Meet the Officers page, and the first four also show on the home page. Keep bios to two or three sentences. The Recruitment page lists the recruitment chairman's name and phone number separately; ask the webmaster to change those.",
      itemName: (it) => it.name || "New member",
      newItem: { name: "", role: "", major: "", hometown: "", photo: "", bio: "", email: "", phone: "" },
      fields: [
        { key: "name", label: "Name", required: true },
        { key: "role", label: "Position / Role", required: true },
        { key: "major", label: "Major" },
        { key: "hometown", label: "Hometown" },
        { key: "photo", label: "Photo", type: "image", maxPx: PORTRAIT_MAX_PX },
        { key: "bio", label: "Bio", type: "textarea", full: true },
        { key: "email", label: "Email (optional)", type: "email" },
        { key: "phone", label: "Phone (optional)", type: "tel" }
      ]
    },
    gallery: {
      file: "data/gallery.json",
      arrayKey: "photos",
      title: "Photo Gallery",
      hint: "Photos tagged 'brotherhood' show on the Brotherhood page. The other categories aren't shown on any page right now. The caption is also the photo's description for screen readers.",
      itemName: (it) => it.caption || "New photo",
      newItem: { src: "", caption: "", category: "brotherhood" },
      fields: [
        { key: "src", label: "Photo", type: "image", full: true, required: true, maxPx: GALLERY_MAX_PX },
        { key: "caption", label: "Caption", required: true },
        { key: "category", label: "Category", type: "select", options: ["brotherhood", "service", "house", "other"] }
      ]
    },
    journal: {
      file: "data/journal.json",
      arrayKey: "posts",
      title: "Journal Posts",
      hint: "Posts show on the Social page, newest date first. The three newest also appear on the home page. Posts the webmaster marks as alumni events also show on the Alumni page.",
      itemName: (it) => it.title || "New post",
      newItem: { title: "", date: new Date().toISOString().slice(0, 10), cover: "", excerpt: "", link: "" },
      fields: [
        { key: "title", label: "Title", required: true },
        { key: "date", label: "Date", type: "date", required: true },
        { key: "cover", label: "Cover photo", type: "image", full: true, maxPx: PORTRAIT_MAX_PX },
        { key: "excerpt", label: "Summary", type: "textarea", full: true },
        { key: "link", label: "Link for 'Read more' (optional)" }
      ]
    },
    alumni: {
      file: "data/alumni.json",
      arrayKey: "alumni",
      title: "Notable Alumni",
      hint: "Shown on the Alumni page, under Notable Alumni.",
      itemName: (it) => it.name || "New alumnus",
      newItem: { name: "", role: "", photo: "", bio: "", link: "", linkLabel: "" },
      fields: [
        { key: "name", label: "Name", required: true },
        { key: "role", label: "Title / Distinction", required: true },
        { key: "photo", label: "Photo", type: "image", full: true, maxPx: PORTRAIT_MAX_PX },
        { key: "bio", label: "Bio", type: "textarea", full: true },
        { key: "link", label: "Link (optional)" },
        { key: "linkLabel", label: "Link label (optional)" }
      ]
    },
    chapter: {
      file: "data/chapter.json",
      title: "Chapter Info",
      hint: "Stats shown on the home page. The contact fields below aren't shown anywhere on the site yet; contact details are changed in the pages themselves (ask the webmaster).",
      objectFields: [
        { key: "address", label: "House address" },
        { key: "email", label: "Chapter email" },
        { key: "instagram", label: "Instagram URL" },
        { key: "facebook", label: "Facebook URL" },
        { key: "stats.founded", label: "Founded (year)", type: "number", required: true },
        { key: "stats.yearsAtAuburn", label: "Years at Auburn", type: "number", required: true },
        { key: "stats.activeBrothers", label: "Active brothers", type: "number", required: true },
        { key: "stats.serviceHours", label: "Service hours / year", type: "number", required: true }
      ]
    }
  };

  /* ---------- State ---------- */
  let token = "";
  let currentSection = "members";
  const cache = {}; // sectionId -> { data, sha } (this browser tab's working copy)
  const loads = {}; // sectionId -> pending load, so a double click doesn't load twice
  const dirty = new Set(); // sections with unsaved changes
  const edits = {}; // sectionId -> number of edits, so a save only clears edits made before it
  const uploadItems = new Map(); // uploads in progress: upload id -> { id: section, item, key }
  let uploadSeq = 0;
  let leaving = false; // set when the user already agreed to lose changes

  /* ---------- DOM ---------- */
  const $ = (sel) => document.querySelector(sel);
  const loginView = $("#login-view");
  const editorView = $("#editor-view");
  const sectionBody = $("#section-body");
  const toastEl = $("#toast");
  const loginStatus = $("#login-status");
  const saveStatus = $("#save-status");

  /* ---------- Utilities ---------- */
  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  // Thumbnail CSS; characters that could end the url('...') are dropped.
  const cssUrl = (s) => String(s == null ? "" : s).replace(/["'\\()]/g, "");
  const thumbStyle = (path) =>
    path ? `background-image:url('${cssUrl(/^https?:\/\//.test(path) ? path : `../${path}`)}')` : "";
  const fieldId = (name) => `fld-${String(name).replace(/[^a-zA-Z0-9]+/g, "-")}`;
  const plainLabel = (label) => label.replace(/\s*\(optional\)/i, "");

  function toast(msg, type = "") {
    toastEl.textContent = msg;
    toastEl.className = `toast show ${type}`;
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => (toastEl.className = "toast"), 4000);
  }

  // Messages that stay on screen until the next action (errors, problems to fix).
  function showStatus(el, type, html) {
    el.innerHTML = html ? `<div class="form-status ${type}">${html}</div>` : "";
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

  /* ---------- Saved key ---------- */
  // Kept for this tab only (sessionStorage) unless "Keep me signed in" is ticked.
  const savedKey = () => sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || "";
  function storeKey(t, remember) {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, t);
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, t);
      localStorage.removeItem(TOKEN_KEY);
    }
  }
  function forgetKey() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    token = "";
  }

  /* ---------- GitHub API ---------- */
  async function gh(path, opts = {}) {
    let res;
    try {
      res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}${path}`, {
        cache: "no-store", // always the current version, never the browser's copy
        ...opts,
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
          ...(opts.headers || {})
        }
      });
    } catch (e) {
      const err = new Error("Could not reach GitHub");
      err.status = 0;
      throw err;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const err = new Error(body.message || `GitHub error ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  const getFile = (path) => gh(`/contents/${encodeURI(path)}?ref=${BRANCH}`);

  const putFile = (path, base64Content, message, sha) =>
    gh(`/contents/${encodeURI(path)}`, {
      method: "PUT",
      body: JSON.stringify({ message, content: base64Content, branch: BRANCH, ...(sha ? { sha } : {}) })
    });

  const isRateLimit = (err) => err.status === 429 || (err.status === 403 && /rate limit/i.test(err.message));
  const isConflict = (err) => err.status === 409 || (err.status === 422 && /sha/i.test(err.message));
  const githubSaid = (err) => (err.message && err.status ? ` <span class="status-detail">GitHub said: ${esc(err.message)}</span>` : "");

  // Plain-English explanation for a failed save or upload. (401 is handled separately.)
  function explainError(err) {
    if (err.status === 0) return "Couldn't reach GitHub. Check your internet connection and try again. Nothing was saved.";
    if (isRateLimit(err)) return "GitHub is limiting requests for a few minutes. Wait a little, then try again. Nothing was saved.";
    if (err.status === 403 || err.status === 404)
      return `GitHub didn't let this key save. Check that the key's Resource owner is BZATX (not your own account), that <code>${REPO}</code> is selected, that its Contents permission is set to Read and write, and that a BZATX owner has approved it.${githubSaid(err)}`;
    return `Nothing was saved.${githubSaid(err)}`;
  }

  /* ---------- Login ---------- */
  // Checks that the key works and that its account is allowed to save to the site.
  async function checkKey(t) {
    token = t;
    const repo = await gh("");
    if (!repo.permissions || !repo.permissions.push) {
      const err = new Error("no write access");
      err.code = "no-write";
      throw err;
    }
  }

  function loginErrorMessage(err, usingSavedKey) {
    if (err.code === "no-write")
      return `This key works, but its GitHub account isn't allowed to save changes to the site. Ask a BZATX owner to add you to the BZATX organization with Write access to <code>${REPO}</code>, then try again.`;
    if (err.status === 401)
      return usingSavedKey
        ? "GitHub no longer accepts your saved key. It may have expired or been deleted. Make a new one (steps below) and paste it here."
        : "GitHub didn't accept this key. It may be mistyped, expired or deleted. Check it, or make a new one (steps below).";
    if (err.status === 0)
      return `Couldn't reach GitHub. Check your internet connection${usingSavedKey ? ", then click Connect to try your saved key again" : " and try again"}.`;
    if (isRateLimit(err)) return "GitHub is limiting requests for a few minutes. Wait a little, then try again.";
    if (err.status === 403 || err.status === 404)
      return `This key can't open the site's files. Check that its Resource owner is BZATX and that <code>${REPO}</code> is selected. If you made it recently, a BZATX owner may still need to approve it.${githubSaid(err)}`;
    return `Couldn't connect.${githubSaid(err)}`;
  }

  function showEditor() {
    loginView.hidden = true;
    editorView.hidden = false;
    $("#logout-btn").hidden = false;
    $("#token-input").value = "";
    showStatus(loginStatus, "", "");
    openSection(currentSection);
  }

  async function connect(t, { remember, fromStorage }) {
    const btn = $("#login-btn");
    btn.disabled = true;
    btn.textContent = "Checking…";
    try {
      await checkKey(t);
      if (!fromStorage) storeKey(t, remember);
      showEditor();
    } catch (err) {
      token = "";
      // Forget a saved key only when GitHub actually rejects it.
      if (err.status === 401) forgetKey();
      loginView.hidden = false;
      editorView.hidden = true;
      $("#logout-btn").hidden = true;
      showStatus(loginStatus, "error", loginErrorMessage(err, fromStorage));
    } finally {
      btn.disabled = false;
      btn.textContent = "Connect";
    }
  }

  $("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const typed = $("#token-input").value.trim();
    const stored = savedKey();
    if (!typed && !stored) {
      showStatus(loginStatus, "error", "Paste your token first.");
      $("#token-input").focus();
      return;
    }
    showStatus(loginStatus, "", "");
    if (typed) connect(typed, { remember: $("#remember-token").checked, fromStorage: false });
    else connect(stored, { fromStorage: true });
  });

  // GitHub rejected the key mid-session: ask for a new one without losing unsaved work.
  function keyRejected() {
    forgetKey();
    editorView.hidden = true;
    $("#logout-btn").hidden = true;
    loginView.hidden = false;
    showStatus(
      loginStatus,
      "error",
      "GitHub stopped accepting your key. It may have expired or been deleted. Paste a new key to carry on. Your unsaved changes are kept as long as you don't close or reload this page."
    );
    $("#token-input").focus();
  }

  const unsavedNames = () => [...dirty].map((id) => SECTIONS[id].title);

  $("#logout-btn").addEventListener("click", () => {
    if (dirty.size || uploadItems.size) {
      const what = dirty.size ? `unsaved changes on: ${unsavedNames().join(", ")}` : "a photo still uploading";
      if (!confirm(`You have ${what}. Log out anyway and lose ${dirty.size ? "them" : "it"}?`)) return;
    }
    forgetKey();
    leaving = true;
    location.reload();
  });

  window.addEventListener("beforeunload", (e) => {
    if (leaving || (!dirty.size && !uploadItems.size)) return;
    e.preventDefault();
    e.returnValue = "";
  });

  /* ---------- Unsaved-changes marks ---------- */
  function updateDirtyMarks() {
    document.querySelectorAll(".admin-tab").forEach((tab) => {
      tab.querySelector(".dirty-mark").hidden = !dirty.has(tab.dataset.section);
    });
    const note = $("#unsaved-note");
    const others = [...dirty].filter((id) => id !== currentSection).map((id) => SECTIONS[id].title);
    let text = "";
    if (dirty.has(currentSection)) {
      text = "This tab has unsaved changes. Click Save & Publish to put them on the site.";
      if (others.length) text += ` Also unsaved: ${others.join(", ")}. Each tab is saved on its own.`;
    } else if (others.length) {
      text = `Unsaved changes on: ${others.join(", ")}. Open that tab and click Save & Publish.`;
    }
    note.textContent = text;
    note.hidden = !text;
  }
  function markDirty(id) {
    edits[id] = (edits[id] || 0) + 1;
    dirty.add(id);
    updateDirtyMarks();
  }
  function markClean(id) {
    dirty.delete(id);
    updateDirtyMarks();
  }

  /* ---------- Section rendering ---------- */
  const isUploading = (id, item, key) =>
    [...uploadItems.values()].some((u) => u.id === id && u.item === item && u.key === key);

  function fieldControl(field, value, name, uploadingNow) {
    const v = esc(value);
    const id = fieldId(name);
    const req = field.required ? ' aria-required="true"' : "";
    if (field.type === "textarea")
      return `<textarea class="form-control" id="${id}" data-field="${name}" rows="3"${req}>${v}</textarea>`;
    if (field.type === "select")
      return `<select class="form-control" id="${id}" data-field="${name}"${req}>
        ${field.options.map((o) => `<option value="${esc(o)}"${o === value ? " selected" : ""}>${esc(o)}</option>`).join("")}
      </select>`;
    if (field.type === "image")
      return `<div class="image-field">
        <div class="image-thumb" style="${esc(thumbStyle(value))}"></div>
        <div class="image-field-controls">
          <input type="text" class="form-control" id="${id}" data-field="${name}" value="${v}" placeholder="assets/images/uploads/…"${req}>
          <div>
            <button type="button" class="btn btn-glass btn-sm upload-btn" data-target="${name}"${uploadingNow ? " disabled" : ""}>${uploadingNow ? "Uploading…" : "Upload photo"}</button>
            <input type="file" accept="image/*" data-upload-for="${name}" hidden>
          </div>
        </div>
      </div>`;
    const type = { number: "number", date: "date", email: "email", tel: "tel" }[field.type] || "text";
    const extra = type === "number" ? ' inputmode="numeric" step="1"' : type === "email" || type === "tel" ? ' autocomplete="off"' : "";
    return `<input type="${type}" class="form-control" id="${id}" data-field="${name}" value="${v}"${extra}${req}>`;
  }

  const fieldLabel = (f, name) =>
    `<label for="${fieldId(name)}">${esc(f.label)}${f.required ? '<span class="req" aria-hidden="true">*</span>' : ""}</label>`;

  function renderSection(id) {
    const cfg = SECTIONS[id];
    const { data } = cache[id];

    if (cfg.objectFields) {
      sectionBody.innerHTML = `<div class="admin-item"><div class="admin-fields">
        ${cfg.objectFields
          .map(
            (f) => `<div class="form-group${f.full ? " full" : ""}">
              ${fieldLabel(f, f.key)}
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
            (item, idx) => `<div class="admin-item" data-idx="${idx}" role="group" aria-labelledby="item-title-${idx}">
        <div class="admin-item-head">
          <span class="admin-item-title" id="item-title-${idx}">${esc(cfg.itemName(item))}</span>
          <div class="admin-item-tools">
            <button type="button" class="icon-btn" data-act="up" data-idx="${idx}" title="Move up" aria-label="Move up">↑</button>
            <button type="button" class="icon-btn" data-act="down" data-idx="${idx}" title="Move down" aria-label="Move down">↓</button>
            <button type="button" class="icon-btn danger" data-act="del" data-idx="${idx}" title="Delete" aria-label="Delete">✕</button>
          </div>
        </div>
        <div class="admin-fields">
          ${cfg.fields
            .map((f) => {
              const name = `${idx}.${f.key}`;
              return `<div class="form-group${f.full || f.type === "textarea" ? " full" : ""}">
                ${fieldLabel(f, name)}
                ${fieldControl(f, item[f.key], name, f.type === "image" && isUploading(id, item, f.key))}
              </div>`;
            })
            .join("")}
        </div>
      </div>`
          )
          .join("")
      : `<p class="admin-empty">Nothing here yet. Click “+ Add”.</p>`;
  }

  async function loadSection(id) {
    if (!loads[id])
      loads[id] = getFile(SECTIONS[id].file)
        .then((file) => {
          cache[id] = { data: JSON.parse(b64decodeText(file.content)), sha: file.sha };
        })
        .finally(() => delete loads[id]);
    return loads[id];
  }

  async function openSection(id) {
    const cfg = SECTIONS[id];
    currentSection = id;
    document.querySelectorAll(".admin-tab").forEach((t) => {
      const on = t.dataset.section === id;
      t.classList.toggle("active", on);
      t.setAttribute("aria-pressed", on ? "true" : "false");
    });
    $("#section-title").textContent = cfg.title;
    $("#section-hint").textContent = cfg.hint;
    $("#add-item-btn").hidden = !cfg.arrayKey;
    showStatus(saveStatus, "", "");
    updateDirtyMarks();
    if (!cache[id]) {
      sectionBody.innerHTML = `<p class="admin-empty">Loading…</p>`;
      try {
        await loadSection(id);
      } catch (err) {
        if (err.status === 401) return keyRejected();
        if (currentSection === id)
          sectionBody.innerHTML = `<div class="form-status error">Couldn't load ${esc(cfg.file)}. ${
            err.status === 0 ? "Check your internet connection, then click the tab again." : esc(err.message)
          }</div>`;
        return;
      }
      if (currentSection !== id) return; // another tab was opened while this one loaded
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
    let value = e.target.value;
    // An emptied number box stays empty (and is caught before saving) instead of becoming 0.
    if (e.target.type === "number") value = value.trim() === "" ? null : Number(value);
    e.target.removeAttribute("aria-invalid");

    if (cfg.objectFields) {
      setPath(data, name, value);
    } else {
      const dot = name.indexOf(".");
      const idx = Number(name.slice(0, dot));
      const key = name.slice(dot + 1);
      const item = data[cfg.arrayKey][idx];
      item[key] = value;
      // refresh image thumb and card title live
      const thumb = e.target.closest(".image-field")?.querySelector(".image-thumb");
      if (thumb) thumb.setAttribute("style", thumbStyle(value));
      const title = document.getElementById(`item-title-${idx}`);
      if (title) title.textContent = cfg.itemName(item);
    }
    markDirty(currentSection);
  });

  sectionBody.addEventListener("click", (e) => {
    const cfg = SECTIONS[currentSection];

    const uploadBtn = e.target.closest(".upload-btn");
    if (uploadBtn) {
      sectionBody.querySelector(`input[data-upload-for="${uploadBtn.dataset.target}"]`).click();
      return;
    }

    const actBtn = e.target.closest("[data-act]");
    if (!actBtn || !cfg.arrayKey) return;
    const act = actBtn.dataset.act;
    const idx = Number(actBtn.dataset.idx);
    const arr = cache[currentSection].data[cfg.arrayKey];
    let focusAfter = null;
    if (act === "del") {
      if (!confirm(`Delete “${cfg.itemName(arr[idx])}”? (It isn't removed from the site until you click Save & Publish.)`)) return;
      arr.splice(idx, 1);
      focusAfter = "#add-item-btn";
    } else if (act === "up" && idx > 0) {
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      focusAfter = `[data-act="up"][data-idx="${idx - 1}"]`;
    } else if (act === "down" && idx < arr.length - 1) {
      [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
      focusAfter = `[data-act="down"][data-idx="${idx + 1}"]`;
    } else {
      return;
    }
    markDirty(currentSection);
    clearProblems();
    renderSection(currentSection);
    if (focusAfter) document.querySelector(focusAfter)?.focus();
  });

  $("#add-item-btn").addEventListener("click", () => {
    const cfg = SECTIONS[currentSection];
    if (!cfg.arrayKey || !cache[currentSection]) return;
    cache[currentSection].data[cfg.arrayKey].unshift({ ...cfg.newItem });
    markDirty(currentSection);
    clearProblems();
    renderSection(currentSection);
    sectionBody.querySelector(".admin-item [data-field]")?.focus();
  });

  /* ---------- Photo upload ---------- */
  // Each upload remembers the card it was started for, so adding, deleting or
  // moving cards (or switching tabs) while it runs can't attach it to someone else.
  function refreshUploadButton(id, item, key) {
    if (currentSection !== id || !cache[id]) return;
    const idx = cache[id].data[SECTIONS[id].arrayKey].indexOf(item);
    if (idx < 0) return;
    const name = `${idx}.${key}`;
    const btn = sectionBody.querySelector(`.upload-btn[data-target="${CSS.escape(name)}"]`);
    if (btn) {
      const busy = isUploading(id, item, key);
      btn.disabled = busy;
      btn.textContent = busy ? "Uploading…" : "Upload photo";
    }
    const input = sectionBody.querySelector(`[data-field="${CSS.escape(name)}"]`);
    if (input && input.value !== (item[key] || "")) {
      input.value = item[key] || "";
      input.removeAttribute("aria-invalid");
      input.closest(".image-field")?.querySelector(".image-thumb")?.setAttribute("style", thumbStyle(item[key]));
    }
  }

  sectionBody.addEventListener("change", async (e) => {
    const target = e.target.dataset.uploadFor;
    if (!target || !e.target.files?.length) return;
    const file = e.target.files[0];
    e.target.value = "";
    const id = currentSection;
    const cfg = SECTIONS[id];
    const dot = target.indexOf(".");
    const key = target.slice(dot + 1);
    const item = cache[id].data[cfg.arrayKey][Number(target.slice(0, dot))];
    const field = cfg.fields.find((f) => f.key === key);
    const uploadId = ++uploadSeq;
    uploadItems.set(uploadId, { id, item, key });
    refreshUploadButton(id, item, key);
    try {
      toast("Uploading photo…");
      const base64 = await resizeToBase64(file, field.maxPx || GALLERY_MAX_PX);
      const safeName =
        file.name.toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "photo";
      const path = `assets/images/uploads/${Date.now()}-${safeName}.jpg`;
      await putFile(path, base64, `Upload photo ${safeName} via chapter admin`);
      const stillThere = cache[id] && cache[id].data[cfg.arrayKey].includes(item);
      if (stillThere) {
        item[key] = path;
        markDirty(id);
        toast(`Photo uploaded for “${cfg.itemName(item)}”. Click Save & Publish on that tab to use it.`, "success");
      } else {
        uploadProblem(
          `The photo finished uploading, but its card (“${esc(cfg.itemName(item))}”) was deleted or the tab was reloaded since, so the photo wasn't added. Upload it again on the right card.`
        );
      }
    } catch (err) {
      if (err.status === 401) keyRejected();
      else uploadProblem(`The photo upload failed. ${err.status === undefined ? esc(err.message) : explainError(err)}`);
    } finally {
      uploadItems.delete(uploadId);
      refreshUploadButton(id, item, key);
    }
  });

  // An upload problem replaces the "Uploading photo…" note and scrolls the
  // message (above the cards) into view, since the visitor may be far below it.
  function uploadProblem(html) {
    toast("The photo wasn't added. See the message above the cards.", "error");
    showStatus(saveStatus, "error", html);
    saveStatus.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  // Downscale to a JPEG no larger than maxPx on its longest side, on a white
  // background (JPEG has no transparency, so see-through logos would turn black).
  function resizeToBase64(file, maxPx) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85).split(",")[1]);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("That file couldn't be read as an image. Try a JPEG or PNG."));
      };
      img.src = url;
    });
  }

  /* ---------- Checks before saving ---------- */
  function fieldProblem(f, value) {
    const text = value == null ? "" : String(value).trim();
    if (f.type === "number") {
      if (typeof value !== "number" || !Number.isFinite(value)) return `${f.label} needs a number.`;
      if (!Number.isInteger(value) || value < 0) return `${f.label} needs a whole number, 0 or more.`;
      return "";
    }
    if (f.required && !text) return `${plainLabel(f.label)} is empty.`;
    if (f.type === "email" && text && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text))
      return `${plainLabel(f.label)} doesn't look like an email address.`;
    if (f.type === "tel" && text && text.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "").length !== 10)
      return `${plainLabel(f.label)} needs a 10-digit number, like (334) 555-0100.`;
    return "";
  }

  function findProblems(id) {
    const cfg = SECTIONS[id];
    const { data } = cache[id];
    const problems = [];
    if (cfg.objectFields) {
      cfg.objectFields.forEach((f) => {
        const msg = fieldProblem(f, getPath(data, f.key));
        if (msg) problems.push({ name: f.key, msg });
      });
      return problems;
    }
    (data[cfg.arrayKey] || []).forEach((item, idx) => {
      cfg.fields.forEach((f) => {
        const msg = fieldProblem(f, item[f.key]);
        if (msg) problems.push({ name: `${idx}.${f.key}`, msg: `“${cfg.itemName(item)}” (card ${idx + 1}): ${msg}` });
      });
    });
    return problems;
  }

  // Adding, deleting or moving a card renumbers the cards, so an old "fix
  // these first" list would point at the wrong ones. Clear it; Save checks again.
  function clearProblems() {
    if (saveStatus.querySelector("[data-focus]")) showStatus(saveStatus, "", "");
  }

  function showProblems(problems) {
    sectionBody.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    problems.forEach((p) => document.getElementById(fieldId(p.name))?.setAttribute("aria-invalid", "true"));
    showStatus(
      saveStatus,
      "error",
      `Not published yet. Fix ${problems.length === 1 ? "this" : "these"} first:
      <ul>${problems.map((p) => `<li><a href="#${fieldId(p.name)}" data-focus="${fieldId(p.name)}">${esc(p.msg)}</a></li>`).join("")}</ul>`
    );
    document.getElementById(fieldId(problems[0].name))?.focus();
  }

  /* ---------- Save ---------- */
  async function reloadSection(id) {
    if (dirty.has(id) && !confirm("Load the latest version? Your unsaved changes on this tab will be lost.")) return;
    delete cache[id];
    markClean(id);
    await openSection(id);
  }

  saveStatus.addEventListener("click", (e) => {
    const link = e.target.closest("[data-focus]");
    if (link) {
      e.preventDefault();
      document.getElementById(link.dataset.focus)?.focus();
      return;
    }
    if (e.target.closest("#reload-section-btn")) reloadSection(currentSection);
  });

  $("#save-btn").addEventListener("click", async () => {
    const id = currentSection;
    const cfg = SECTIONS[id];
    const entry = cache[id];
    if (!entry) return;
    if ([...uploadItems.values()].some((u) => u.id === id)) {
      showStatus(saveStatus, "error", "A photo is still uploading on this tab. Wait for it to finish, then click Save & Publish.");
      return;
    }
    const problems = findProblems(id);
    if (problems.length) {
      showProblems(problems);
      return;
    }
    showStatus(saveStatus, "", "");
    const btn = $("#save-btn");
    btn.disabled = true;
    btn.textContent = "Saving…";
    const editsAtSave = edits[id];
    try {
      const json = JSON.stringify(entry.data, null, 2) + "\n";
      const res = await putFile(cfg.file, b64encodeText(json), `Update ${cfg.title.toLowerCase()} via chapter admin`, entry.sha);
      entry.sha = res.content.sha;
      if (edits[id] === editsAtSave) markClean(id); // anything typed during the save stays marked
      toast("Saved! The live site updates in a minute or two.", "success");
    } catch (err) {
      if (err.status === 401) keyRejected();
      else if (isConflict(err))
        showStatus(
          saveStatus,
          "error",
          `Not saved: someone else changed this tab on the site after you opened it, and saving now would wipe out their changes. Your edits are still on this page. Copy anything you typed, click <strong>Load latest version</strong>, then make your changes again and save.
          <div><button type="button" id="reload-section-btn" class="btn btn-glass btn-sm">Load latest version</button></div>`
        );
      else showStatus(saveStatus, "error", explainError(err));
    } finally {
      btn.disabled = false;
      btn.textContent = "Save & Publish";
    }
  });

  /* ---------- Boot ---------- */
  localStorage.removeItem(OLD_TOKEN_KEY);
  sessionStorage.removeItem(OLD_TOKEN_KEY);
  const stored = savedKey();
  if (stored) connect(stored, { fromStorage: true });
})();
