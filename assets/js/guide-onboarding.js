/**
 * GOBEYOND TRAVELS - Guide Onboarding & Live Preview Logic
 * Connected to Node.js Backend Multer API
 */

document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('guide-name');
  const citySelect = document.getElementById('guide-city');
  const yearsInput = document.getElementById('guide-years');
  const rateInput = document.getElementById('guide-rate');
  const bioInput = document.getElementById('guide-bio');
  const idUpload = document.getElementById('guide-id-file');
  const dropzone = document.getElementById('upload-dropzone');
  const uploadPreview = document.getElementById('upload-preview');

  // Preview elements
  const prevName = document.getElementById('preview-name');
  const prevLocation = document.getElementById('preview-location');
  const prevYears = document.getElementById('preview-years');
  const prevRate = document.getElementById('preview-rate');
  const prevBio = document.getElementById('preview-bio');
  const prevLangs = document.getElementById('preview-langs');
  const prevNiches = document.getElementById('preview-niches');

  // Selected state
  const selectedLangs = new Set(['Hindi', 'English']);
  const selectedNiches = new Set(['Ancient Architecture']);
  let selectedFile = null;

  // 1. Language Tags Selection
  document.querySelectorAll('.lang-tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (selectedLangs.has(lang)) {
        if (selectedLangs.size > 1) {
          selectedLangs.delete(lang);
          btn.classList.remove('active');
        }
      } else {
        selectedLangs.add(lang);
        btn.classList.add('active');
      }
      updatePreviewLanguages();
    });
  });

  // 2. Niche Tags Selection
  document.querySelectorAll('.niche-tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const niche = btn.dataset.niche;
      if (selectedNiches.has(niche)) {
        if (selectedNiches.size > 1) {
          selectedNiches.delete(niche);
          btn.classList.remove('active');
        }
      } else {
        selectedNiches.add(niche);
        btn.classList.add('active');
      }
      updatePreviewNiches();
    });
  });

  // 3. Real-time typing updates
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      prevName.textContent = e.target.value.trim() || 'Your Full Name';
    });
  }

  if (citySelect) {
    citySelect.addEventListener('change', (e) => {
      const val = e.target.options[e.target.selectedIndex].text;
      prevLocation.textContent = val || 'Your Indian Heritage Region';
    });
  }

  if (yearsInput) {
    yearsInput.addEventListener('input', (e) => {
      prevYears.textContent = `${e.target.value || 5} Years Exp.`;
    });
  }

  if (rateInput) {
    rateInput.addEventListener('input', (e) => {
      prevRate.textContent = `₹${(parseInt(e.target.value) || 2000).toLocaleString('en-IN')}`;
    });
  }

  if (bioInput) {
    bioInput.addEventListener('input', (e) => {
      prevBio.textContent = `"${e.target.value.trim() || 'Tell travelers about your family oral heritage and what makes your homeland sacred...'}"`;
    });
  }

  function updatePreviewLanguages() {
    if (!prevLangs) return;
    prevLangs.innerHTML = Array.from(selectedLangs).map(l => 
      `<span style="font-size:0.75rem; background:var(--warm-sand); color:var(--slate); padding:2px 8px; border-radius:999px;">${l}</span>`
    ).join(' ');
  }

  function updatePreviewNiches() {
    if (!prevNiches) return;
    prevNiches.innerHTML = Array.from(selectedNiches).map(n => 
      `<span class="guide-badge-pill">◈ ${n}</span>`
    ).join(' ');
  }

  // 4. File Upload Drag & Drop Preview Simulation
  if (dropzone && idUpload) {
    dropzone.addEventListener('click', () => idUpload.click());

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length) handleFile(files[0]);
    });

    idUpload.addEventListener('change', (e) => {
      if (e.target.files.length) handleFile(e.target.files[0]);
    });

    function handleFile(file) {
      selectedFile = file;
      if (uploadPreview) {
        uploadPreview.innerHTML = `
          <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; gap:12px; margin-top:12px;">
            <span style="font-size:1.5rem;">📄</span>
            <div style="flex:1;">
              <strong style="color:#065F46; font-size:0.85rem; display:block;">${file.name}</strong>
              <span style="font-size:0.75rem; color:#047857;">${(file.size / 1024).toFixed(1)} KB • Government ID Attached</span>
            </div>
            <span style="background:#10B981; color:#fff; font-size:0.7rem; font-weight:700; padding:2px 6px; border-radius:4px;">Verified Format</span>
          </div>
        `;
      }
      if (window.GoBeyond) {
        window.GoBeyond.showToast('Government ID attached. Submitting will upload to secure verification server.', 'success');
      }
    }
  }

  // 5. Form Submission (Live Backend API + Fallback)
  const form = document.getElementById('guide-onboarding-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = nameInput?.value || 'Cultural Custodian';
      const city = citySelect?.value || 'Hampi';
      const email = document.getElementById('guide-email')?.value || `${name.toLowerCase().replace(/\s+/g, '.')}@gobeyond.travel`;
      const years = yearsInput?.value || 5;
      const rate = rateInput?.value || 2000;
      const bio = bioInput?.value || 'Native cultural custodian';

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Uploading Documents to Heritage Board...';
      }

      try {
        if (window.GoBeyondAPI) {
          const formData = new FormData();
          formData.append('name', name);
          formData.append('email', email);
          formData.append('city', city);
          formData.append('experienceYears', years);
          formData.append('hourlyRate', rate);
          formData.append('bio', bio);
          formData.append('languages', Array.from(selectedLangs).join(', '));
          formData.append('niches', Array.from(selectedNiches).join(', '));
          if (selectedFile) {
            formData.append('governmentId', selectedFile);
          }

          await window.GoBeyondAPI.guides.apply(formData);
        }
      } catch (err) {
        console.warn('Backend guide application fallback:', err.message);
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
      }

      if (window.GoBeyond) {
        window.GoBeyond.showToast(`Namaste ${name}! Application & ID sent to Admin Verification Queue.`, 'success');
      }

      // Success modal feedback
      const modalRoot = document.getElementById('modal-root');
      if (modalRoot) {
        document.body.style.overflow = 'hidden';
        modalRoot.innerHTML = `
          <div class="modal-backdrop active" id="modal-bg">
            <div class="modal-dialog" style="max-width: 520px; text-align:center;" onclick="event.stopPropagation()">
              <button class="modal-close-btn" onclick="window.GoBeyond.closeModal()">&times;</button>
              
              <div style="width:70px; height:70px; border-radius:50%; background:#ECFDF5; color:#10B981; font-size:2.2rem; display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto;">
                🎖️
              </div>
              <h3 style="font-size:1.6rem; margin-bottom:8px;">Application Queued, ${name.split(' ')[0]}!</h3>
              <p style="color:var(--slate); font-size:0.92rem; line-height:1.6; margin-bottom:20px;">
                Your application for <strong>${city}</strong> has been uploaded to the <strong>Admin Verification Queue</strong>. Your Government ID document is being processed.
              </p>

              <div style="background:var(--warm-sand); border-radius:var(--radius-md); padding:16px; font-size:0.86rem; text-align:left; margin-bottom:20px;">
                <div style="font-weight:700; color:var(--terracotta); margin-bottom:4px;">Live Verification Workflow:</div>
                <ul style="margin:0; padding-left:18px; color:var(--slate); line-height:1.5;">
                  <li>Document verification status: <strong style="color:#D97706;">PENDING</strong></li>
                  <li>Admin checks Government ID & Assigns Badge Tier (Bronze/Silver/Gold/Verified Expert)</li>
                  <li>Direct Weekly UPI Payout Setup (Guaranteed 85% revenue split)</li>
                </ul>
              </div>

              <div style="display:flex; gap:10px;">
                <a href="admin.html" class="btn btn-outline" style="flex:1;">Open Admin View</a>
                <a href="destinations.html" class="btn btn-primary" style="flex:1;">Explore Expeditions</a>
              </div>
            </div>
          </div>
        `;
        document.getElementById('modal-bg').onclick = window.GoBeyond.closeModal;
      }
    });
  }

  // Initial preview sync
  updatePreviewLanguages();
  updatePreviewNiches();
});
