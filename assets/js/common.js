/**
 * GOBEYOND TRAVELS - Global Common Controller
 * Manages Navigation, Modals (Guide, Route, Booking, Auth), Toasts, and State
 */

(function() {
  'use strict';

  // --- SVG Icons Map ---
  const ICONS = {
    compass: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    car: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`,
    plane: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
    train: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    shield: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    mapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    users: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  };

  // --- Initialize Global Containers for Modals & Toasts ---
  function ensureContainers() {
    if (!window.io && !document.getElementById('socket-io-script')) {
      const s = document.createElement('script');
      s.id = 'socket-io-script';
      s.src = 'https://cdn.socket.io/4.8.1/socket.io.min.js';
      document.head.appendChild(s);
    }
    if (!window.GoBeyondAPI && !document.getElementById('gobeyond-api-script')) {
      const s = document.createElement('script');
      s.id = 'gobeyond-api-script';
      s.src = 'assets/js/api.js';
      document.head.appendChild(s);
    }
    if (!document.getElementById('modal-root')) {
      const modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }
    if (!document.getElementById('toast-root')) {
      const toastRoot = document.createElement('div');
      toastRoot.id = 'toast-root';
      toastRoot.className = 'toast-container';
      document.body.appendChild(toastRoot);
    }
  }

  // --- Active Navigation Link & Mobile Menu ---
  function initNavigation() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('mobile-open');
      });

      document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
          navMenu.classList.remove('mobile-open');
        }
      });
    }

    updateAuthNavState();
  }

  // --- Auth State Management ---
  function getCurrentUser() {
    try {
      const user = localStorage.getItem('gobeyond_user');
      return user ? JSON.parse(user) : null;
    } catch(e) {
      return null;
    }
  }

  function setCurrentUser(user) {
    if (user) {
      const adminBadge = user.role === 'ADMIN' ? '<a href="admin.html" class="btn btn-outline btn-sm" style="margin-right:8px; border-color:var(--terracotta); color:var(--terracotta); font-weight:700;">🛡️ Admin Portal</a>' : '';
      localStorage.setItem('gobeyond_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gobeyond_user');
    }
    updateAuthNavState();
  }

  function updateAuthNavState() {
    const user = getCurrentUser();
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    const authBtn = navActions.querySelector('.nav-auth-btn');
    if (!authBtn) return;

    if (user) {
      authBtn.innerHTML = adminBadge + `
        <span style="display:inline-flex; align-items:center; gap:8px;">
          <img src="${user.avatar || 'assets/images/travelers/traveler-anita.jpg'}" style="width:26px; height:26px; border-radius:50%; object-fit:cover; border:1px solid #fff;" alt="avatar" />
          <span>${user.name.split(' ')[0]}</span>
        </span>
      `;
      authBtn.onclick = (e) => {
        e.preventDefault();
        openUserMenuModal(user);
      };
    } else {
      authBtn.textContent = 'Sign In / Sign Up';
      authBtn.onclick = (e) => {
        if (!window.location.pathname.endsWith('auth.html')) {
          e.preventDefault();
          openAuthModal();
        }
      };
    }
  }

  // --- Toast Notifications ---
  function showToast(message, type = 'info') {
    ensureContainers();
    const container = document.getElementById('toast-root');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let borderColor = 'var(--terracotta)';
    let icon = '🔔';
    if (type === 'success') {
      borderColor = '#10B981';
      icon = '✅';
    } else if (type === 'warning') {
      borderColor = '#F59E0B';
      icon = '⚠️';
    }

    toast.style.borderLeftColor = borderColor;
    toast.innerHTML = `
      <span style="font-size:1.15rem;">${icon}</span>
      <span style="flex:1;">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4200);
  }

  // --- Close Any Open Modal ---
  function closeModal() {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      modalRoot.innerHTML = '';
      document.body.style.overflow = '';
    }
  }

  // --- Quick Crowd Meter HTML Generator ---
  function renderCrowdMeterBadge(crowdLevel, crowdPercent) {
    let cls = 'crowd-peaceful';
    let pulseCls = 'pulse-dot-peaceful';
    let label = 'Quiet & Peaceful';
    let desc = 'Serene & secluded';

    if (crowdLevel === 'moderate') {
      cls = 'crowd-moderate';
      pulseCls = 'pulse-dot-moderate';
      label = 'Moderate Footfall';
      desc = 'Lively local feel';
    } else if (crowdLevel === 'congested' || crowdLevel === 'crowded') {
      cls = 'crowd-congested';
      pulseCls = 'pulse-dot-congested';
      label = 'Peak Footfall';
      desc = 'Busy heritage center';
    }

    return `
      <div class="crowd-meter-badge ${cls}" title="${desc} • ${crowdPercent || 20}% capacity">
        <span class="pulse-dot ${pulseCls}"></span>
        <span>${label} (${crowdPercent || 15}%)</span>
      </div>
    `;
  }

  // --- Modal 1: Guide Profile Modal ---
  function openGuideModal(guideId) {
    ensureContainers();
    const data = window.GoBeyondData;
    if (!data || !data.guides) return;
    const guide = data.guides.find(g => g.id === guideId) || data.guides[0];

    const modalRoot = document.getElementById('modal-root');
    document.body.style.overflow = 'hidden';

    modalRoot.innerHTML = `
      <div class="modal-backdrop active" id="modal-bg">
        <div class="modal-dialog" style="max-width: 620px;" onclick="event.stopPropagation()">
          <button class="modal-close-btn" id="modal-close-x">&times;</button>
          
          <div style="display:flex; align-items:center; gap:20px; margin-bottom:20px; flex-wrap:wrap;">
            <div style="position:relative; width:90px; height:90px; flex-shrink:0;">
              <img src="${guide.avatar}" alt="${guide.name}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; border:3px solid var(--terracotta);" />
              <span class="verified-badge" style="position:absolute; bottom:0; right:0;">✓ Verified</span>
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <h2 style="font-size:1.5rem; margin:0;">${guide.name}</h2>
              </div>
              <p style="color:var(--slate); font-size:0.9rem; margin:3px 0 6px 0;">${guide.city}, ${guide.state} • Native Cultural Guide</p>
              <div style="display:flex; align-items:center; gap:12px; font-size:0.85rem; font-weight:700;">
                <span style="color:#F59E0B; display:flex; align-items:center; gap:4px;">★ ${guide.rating} (${guide.reviewsCount} reviews)</span>
                <span style="color:var(--muted);">•</span>
                <span style="color:var(--teal);">${guide.experienceYears} Years Experience</span>
                <span style="color:var(--muted);">•</span>
                <span style="color:var(--terracotta);">${guide.toursCount} Tours Led</span>
              </div>
            </div>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:18px;">
            ${(guide.badges || []).map(b => `<span class="guide-badge-pill">🎖️ ${b}</span>`).join('')}
          </div>

          <div style="background:var(--warm-sand); border-radius:var(--radius-md); padding:16px; margin-bottom:18px; border-left:4px solid var(--terracotta);">
            <div style="font-weight:700; font-size:0.82rem; text-transform:uppercase; color:var(--terracotta); margin-bottom:4px;">Heritage Guide's Personal Voice</div>
            <p style="font-style:italic; font-size:0.92rem; color:var(--charcoal); margin:0;">"${guide.videoIntro?.quote || guide.bio}"</p>
          </div>

          <div style="margin-bottom:18px;">
            <h4 style="font-size:0.95rem; margin-bottom:8px; color:var(--charcoal);">Cultural Specialization & Lineage</h4>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${(guide.specialties || []).map(s => `<span class="highlight-pill" style="background:#EBF4F8; color:var(--teal); font-weight:600;">◈ ${s}</span>`).join('')}
            </div>
          </div>

          <div style="margin-bottom:18px;">
            <h4 style="font-size:0.95rem; margin-bottom:6px; color:var(--charcoal);">Languages Spoken</h4>
            <p style="font-size:0.9rem; color:var(--slate); margin:0;">${(guide.languages || []).join(' • ')}</p>
          </div>

          <div style="margin-bottom:24px;">
            <h4 style="font-size:0.95rem; margin-bottom:6px; color:var(--charcoal);">Community Impact Pledge</h4>
            <p style="font-size:0.88rem; color:var(--slate); line-height:1.5; margin:0;">${guide.communityImpact || 'Pledges 15% of all tour earnings to indigenous youth education and heritage restoration.'}</p>
          </div>

          <div style="display:flex; gap:12px; border-top:1px solid var(--border-light); padding-top:18px;">
            <button class="btn btn-primary" style="flex:1;" id="btn-book-with-guide">Book a Tour with ${guide.name.split(' ')[0]}</button>
            <button class="btn btn-outline" style="flex:1;" id="btn-msg-guide">💬 Message Guide</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modal-close-x').onclick = closeModal;
    document.getElementById('modal-bg').onclick = closeModal;
    document.getElementById('btn-msg-guide').onclick = () => {
      showToast(`Connected! WhatsApp concierge link sent for Guide ${guide.name}.`, 'success');
      closeModal();
    };
    document.getElementById('btn-book-with-guide').onclick = () => {
      closeModal();
      openBookingModal(null, null, guide.id);
    };
  }

  // --- Modal 2: Route Guide Modal ---
  function openRouteGuide(destinationId) {
    ensureContainers();
    const data = window.GoBeyondData;
    if (!data || !data.destinations) return;
    const dest = data.destinations.find(d => d.id === destinationId) || data.destinations[0];
    const route = dest.routeGuide || {};

    const modalRoot = document.getElementById('modal-root');
    document.body.style.overflow = 'hidden';

    modalRoot.innerHTML = `
      <div class="modal-backdrop active" id="modal-bg">
        <div class="modal-dialog" style="max-width: 720px;" onclick="event.stopPropagation()">
          <button class="modal-close-btn" id="modal-close-x">&times;</button>
          
          <div style="display:flex; align-items:flex-start; gap:16px; margin-bottom:16px;">
            <div style="flex:1;">
              <span class="section-tag" style="margin-bottom:6px;">Interactive Route Guide</span>
              <h2 style="font-size:1.6rem; margin:0 0 6px 0;">How to Reach ${dest.name}</h2>
              <p style="color:var(--slate); font-size:0.9rem; margin:0;">${dest.city}, ${dest.state} • ${renderCrowdMeterBadge(dest.crowdLevel, dest.crowdPercent)}</p>
            </div>
          </div>

          <div class="route-tabs">
            <button class="route-tab-btn active" data-tab="road">${ICONS.car} By Road (${route.road?.travelTime || 'Direct'})</button>
            <button class="route-tab-btn" data-tab="flight">${ICONS.plane} Nearest Airport</button>
            <button class="route-tab-btn" data-tab="train">${ICONS.train} Scenic Train</button>
          </div>

          <div id="route-tab-content">
            <!-- Road Content Default -->
            <div class="route-content-box">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                <span style="font-weight:700; color:var(--charcoal); font-size:1.05rem;">🛣️ Highway: ${route.road?.highway || 'National Scenic Highway'}</span>
                <span style="background:var(--terracotta-light); color:var(--terracotta-dark); font-weight:700; font-size:0.8rem; padding:4px 10px; border-radius:999px;">${route.road?.travelTime || '3-4 hrs'}</span>
              </div>
              <p style="font-size:0.92rem; color:var(--slate); margin-bottom:12px; line-height:1.6;">${route.road?.details || 'Smooth scenic highway crossing historical landscapes.'}</p>
              <div style="background:var(--white); border-radius:var(--radius-sm); padding:10px 14px; border:1px solid #E2E8F0; font-size:0.85rem; color:var(--teal);">
                <strong>Road Condition:</strong> ${route.road?.roadCondition || 'Well-paved, scenic route with regular fuel and rest stops.'}
              </div>
            </div>
          </div>

          <div style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:var(--radius-md); padding:14px; margin-bottom:20px; display:flex; gap:12px; align-items:flex-start;">
            <span style="font-size:1.4rem;">💡</span>
            <div>
              <div style="font-weight:700; font-size:0.85rem; color:#92400E; margin-bottom:2px;">Local Native Insider Route Tip</div>
              <p style="font-size:0.88rem; color:#78350F; margin:0; line-height:1.5;">${route.insiderTip || 'Travel early morning around 6:30 AM to catch tranquil mountain mist and avoid highway freight vehicles.'}</p>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; border-top:1px solid var(--border-light); padding-top:16px;">
            <div>
              <span style="font-size:0.8rem; color:var(--muted); display:block;">Starting Price</span>
              <span style="font-family:var(--font-accent); font-size:1.35rem; font-weight:800; color:var(--terracotta);">₹${(dest.startingPrice || 3500).toLocaleString('en-IN')}</span>
            </div>
            <div style="display:flex; gap:10px;">
              <button class="btn btn-outline" id="btn-route-guide-guide">Meet Local Guide</button>
              <button class="btn btn-primary" id="btn-route-book">Book Heritage Tour</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modal-close-x').onclick = closeModal;
    document.getElementById('modal-bg').onclick = closeModal;

    // Tabs switching
    const tabBtns = modalRoot.querySelectorAll('.route-tab-btn');
    const contentBox = modalRoot.querySelector('#route-tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;

        if (tab === 'road') {
          contentBox.innerHTML = `
            <div class="route-content-box">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                <span style="font-weight:700; color:var(--charcoal); font-size:1.05rem;">🛣️ Highway: ${route.road?.highway || 'Scenic National Highway'}</span>
                <span style="background:var(--terracotta-light); color:var(--terracotta-dark); font-weight:700; font-size:0.8rem; padding:4px 10px; border-radius:999px;">${route.road?.travelTime || 'Daylight Drive'}</span>
              </div>
              <p style="font-size:0.92rem; color:var(--slate); margin-bottom:12px; line-height:1.6;">${route.road?.details || 'Picturesque drive through traditional settlements and green river corridors.'}</p>
              <div style="background:var(--white); border-radius:var(--radius-sm); padding:10px 14px; border:1px solid #E2E8F0; font-size:0.85rem; color:var(--teal);">
                <strong>Road Condition:</strong> ${route.road?.roadCondition || 'Well maintained divided expressway.'}
              </div>
            </div>
          `;
        } else if (tab === 'flight') {
          contentBox.innerHTML = `
            <div class="route-content-box">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                <span style="font-weight:700; color:var(--charcoal); font-size:1.05rem;">✈️ Airport: ${route.flight?.hub || 'Regional Gateway Airport'}</span>
                <span style="background:#EBF4F8; color:var(--teal); font-weight:700; font-size:0.8rem; padding:4px 10px; border-radius:999px;">${route.flight?.distance || 'Nearest Hub'}</span>
              </div>
              <p style="font-size:0.92rem; color:var(--slate); margin-bottom:12px; line-height:1.6;">${route.flight?.details || 'Daily domestic flights from New Delhi, Mumbai, Bengaluru, and Kolkata.'}</p>
              <div style="background:var(--white); border-radius:var(--radius-sm); padding:10px 14px; border:1px solid #E2E8F0; font-size:0.85rem; color:var(--charcoal);">
                <strong>Transfer Time to Heritage Site:</strong> ${route.flight?.transferTime || '1.5 - 2 hours'} (Private GoBeyond transfer available).
              </div>
            </div>
          `;
        } else if (tab === 'train') {
          contentBox.innerHTML = `
            <div class="route-content-box">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                <span style="font-weight:700; color:var(--charcoal); font-size:1.05rem;">🚆 Railway Hub: ${route.train?.hub || 'Central Heritage Station'}</span>
                <span style="background:#ECFDF5; color:#065F46; font-weight:700; font-size:0.8rem; padding:4px 10px; border-radius:999px;">${route.train?.distance || 'Direct Rail'}</span>
              </div>
              <p style="font-size:0.92rem; color:var(--slate); margin-bottom:12px; line-height:1.6;">${route.train?.details || 'Served by comfortable superfast express and overnight heritage trains.'}</p>
              <div style="background:var(--white); border-radius:var(--radius-sm); padding:10px 14px; border:1px solid #E2E8F0; font-size:0.85rem; color:var(--charcoal);">
                <strong>Station Transfer:</strong> ${route.train?.transferTime || '20 - 30 minutes'} by local e-rickshaw or taxi.
              </div>
            </div>
          `;
        }
      });
    });

    document.getElementById('btn-route-guide-guide').onclick = () => {
      closeModal();
      openGuideModal(dest.guideId);
    };

    document.getElementById('btn-route-book').onclick = () => {
      closeModal();
      openBookingModal(null, dest.id, dest.guideId);
    };
  }

  // --- Modal 3: Booking & Checkout Modal with Dynamic Price Breakdown ---
  function openBookingModal(packageId, destinationId, guideId) {
    ensureContainers();
    const data = window.GoBeyondData;
    let pkg = null;
    let dest = null;
    let guide = null;

    if (packageId && data.packages) {
      pkg = data.packages.find(p => p.id === packageId);
    }
    if (!pkg && destinationId && data.destinations) {
      dest = data.destinations.find(d => d.id === destinationId);
    }
    if (!pkg && !dest && data.packages) {
      pkg = data.packages[0];
    }

    const title = pkg ? pkg.title : (dest ? `${dest.name} Heritage Tour` : 'Curated Indian Heritage Tour');
    const baseRate = pkg ? pkg.price : (dest ? dest.startingPrice : 3800);
    const duration = pkg ? pkg.duration : (dest ? dest.duration : '2 Days / 1 Night');
    const assignedGuideId = guideId || (pkg ? pkg.guideId : (dest ? dest.guideId : 'guide-ramesh-mandavi'));
    guide = (data.guides || []).find(g => g.id === assignedGuideId) || (data.guides || [])[0];

    const modalRoot = document.getElementById('modal-root');
    document.body.style.overflow = 'hidden';

    let travelers = 2;
    const guideFee = 1200; // Fixed guide honorarium
    
    function calcPrice(count) {
      const baseTotal = baseRate * count;
      const conservationFund = Math.round((baseTotal + guideFee) * 0.05); // 5% community fund
      const grandTotal = baseTotal + guideFee + conservationFund;
      return { baseTotal, conservationFund, grandTotal };
    }

    modalRoot.innerHTML = `
      <div class="modal-backdrop active" id="modal-bg">
        <div class="modal-dialog" style="max-width: 660px;" onclick="event.stopPropagation()">
          <button class="modal-close-btn" id="modal-close-x">&times;</button>
          
          <div class="step-indicator">
            <div class="step-item active" id="step-nav-1">
              <div class="step-circle">1</div>
              <span class="step-text">Details</span>
            </div>
            <div class="step-item" id="step-nav-2">
              <div class="step-circle">2</div>
              <span class="step-text">Payment</span>
            </div>
            <div class="step-item" id="step-nav-3">
              <div class="step-circle">3</div>
              <span class="step-text">Confirm</span>
            </div>
          </div>

          <div id="booking-step-content">
            <!-- Step 1: Details & Traveler count -->
            <div>
              <h3 style="font-size:1.35rem; margin-bottom:4px;">${title}</h3>
              <p style="color:var(--slate); font-size:0.88rem; margin-bottom:18px;">
                Duration: <strong>${duration}</strong> • Verified Native Guide: <strong>${guide ? guide.name : 'Master Cultural Host'}</strong>
              </p>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:16px;">
                <div class="form-group">
                  <label class="form-label">Preferred Travel Date</label>
                  <input type="date" class="form-control" id="book-date" value="${new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]}" />
                </div>
                <div class="form-group">
                  <label class="form-label">Traveler Count</label>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <button type="button" class="btn btn-outline btn-sm" id="btn-minus" style="padding:10px 16px; font-size:1.1rem;">-</button>
                    <input type="text" class="form-control" id="traveler-count-display" value="${travelers} Travelers" readonly style="text-align:center; font-weight:700;" />
                    <button type="button" class="btn btn-outline btn-sm" id="btn-plus" style="padding:10px 16px; font-size:1.1rem;">+</button>
                  </div>
                </div>
              </div>

              <div class="form-group" style="margin-bottom:16px;">
                <label class="form-label">Special Cultural Interests or Dietary Preferences</label>
                <input type="text" class="form-control" id="book-notes" placeholder="e.g. Vegetarian food, focus on weaving techniques, elderly traveler assistance" />
              </div>

              <!-- Real-time Price Breakdown Box -->
              <div class="price-breakdown-box" id="price-box"></div>

              <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                <button class="btn btn-primary" id="btn-proceed-pay" style="width:100%;">Proceed to Mock Payment →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    function updatePriceView() {
      const { baseTotal, conservationFund, grandTotal } = calcPrice(travelers);
      const priceBox = modalRoot.querySelector('#price-box');
      if (!priceBox) return;

      priceBox.innerHTML = `
        <div style="font-weight:700; font-size:0.82rem; text-transform:uppercase; color:var(--charcoal); margin-bottom:6px;">Transparent Fare Breakdown</div>
        <div class="price-row">
          <span>Base Heritage Tour (₹${baseRate.toLocaleString('en-IN')} × ${travelers} travelers)</span>
          <span>₹${baseTotal.toLocaleString('en-IN')}</span>
        </div>
        <div class="price-row">
          <span>Certified Native Guide Honorarium (Direct Payout)</span>
          <span>₹${guideFee.toLocaleString('en-IN')}</span>
        </div>
        <div class="price-row">
          <span>Community Heritage Fund (5% Restoration & Guilds)</span>
          <span>₹${conservationFund.toLocaleString('en-IN')}</span>
        </div>
        <div class="price-row total">
          <span>Total Payable Amount</span>
          <span style="color:var(--terracotta); font-family:var(--font-accent); font-size:1.4rem;">₹${grandTotal.toLocaleString('en-IN')}</span>
        </div>
      `;
    }

    updatePriceView();

    // Event handlers
    document.getElementById('modal-close-x').onclick = closeModal;
    document.getElementById('modal-bg').onclick = closeModal;

    const minusBtn = modalRoot.querySelector('#btn-minus');
    const plusBtn = modalRoot.querySelector('#btn-plus');
    const countDisplay = modalRoot.querySelector('#traveler-count-display');

    minusBtn.onclick = () => {
      if (travelers > 1) {
        travelers--;
        countDisplay.value = `${travelers} Traveler${travelers > 1 ? 's' : ''}`;
        updatePriceView();
      }
    };

    plusBtn.onclick = () => {
      if (travelers < 8) { // strictly capped small groups
        travelers++;
        countDisplay.value = `${travelers} Traveler${travelers > 1 ? 's' : ''}`;
        updatePriceView();
      } else {
        showToast('To protect fragile heritage sites, tours are strictly limited to 8 travelers max.', 'warning');
      }
    };

    // Proceed to Step 2: Payment Mockup
    modalRoot.querySelector('#btn-proceed-pay').onclick = () => {
      const selectedDate = modalRoot.querySelector('#book-date').value;
      const { grandTotal } = calcPrice(travelers);
      
      modalRoot.querySelector('#step-nav-1').classList.remove('active');
      modalRoot.querySelector('#step-nav-1').classList.add('completed');
      modalRoot.querySelector('#step-nav-2').classList.add('active');

      const content = modalRoot.querySelector('#booking-step-content');
      content.innerHTML = `
        <div>
          <h3 style="font-size:1.35rem; margin-bottom:4px;">Secure Mock Payment</h3>
          <p style="color:var(--slate); font-size:0.88rem; margin-bottom:14px;">
            Total to Pay: <strong style="color:var(--terracotta); font-size:1.15rem;">₹${grandTotal.toLocaleString('en-IN')}</strong> (${travelers} travelers on ${selectedDate})
          </p>

          <div class="payment-tabs">
            <button class="pay-tab-btn active" data-pay="upi">📱 UPI / QR</button>
            <button class="pay-tab-btn" data-pay="card">💳 Card</button>
            <button class="pay-tab-btn" data-pay="apple">🍏 Apple Pay</button>
            <button class="pay-tab-btn" data-pay="netbank">🏦 Net Banking</button>
          </div>

          <div id="pay-content-area" style="margin-bottom:20px;">
            <!-- UPI Mock default -->
            <div style="text-align:center; padding:16px; background:var(--warm-sand); border-radius:var(--radius-md); border:1px dashed var(--terracotta);">
              <div style="font-size:0.85rem; font-weight:700; color:var(--charcoal); margin-bottom:8px;">Scan with any UPI App (GPay / PhonePe / Paytm / BHIM)</div>
              <svg width="140" height="140" viewBox="0 0 140 140" style="margin:0 auto 10px auto; border-radius:8px; border:2px solid #fff; box-shadow:0 4px 10px rgba(0,0,0,0.1); background:#fff; display:block;">
  <!-- QR Corner Finders -->
  <rect x="10" y="10" width="35" height="35" fill="#1A202C" rx="4"/>
  <rect x="16" y="16" width="23" height="23" fill="#FFFFFF" rx="2"/>
  <rect x="21" y="21" width="13" height="13" fill="#D9534F" rx="2"/>

  <rect x="95" y="10" width="35" height="35" fill="#1A202C" rx="4"/>
  <rect x="101" y="16" width="23" height="23" fill="#FFFFFF" rx="2"/>
  <rect x="106" y="21" width="13" height="13" fill="#D9534F" rx="2"/>

  <rect x="10" y="95" width="35" height="35" fill="#1A202C" rx="4"/>
  <rect x="16" y="101" width="23" height="23" fill="#FFFFFF" rx="2"/>
  <rect x="21" y="106" width="13" height="13" fill="#D9534F" rx="2"/>

  <!-- Simulated QR Matrix Modules -->
  <rect x="52" y="12" width="6" height="6" fill="#1A202C"/>
  <rect x="62" y="18" width="8" height="6" fill="#1A202C"/>
  <rect x="76" y="12" width="8" height="8" fill="#1A202C"/>
  <rect x="52" y="28" width="12" height="6" fill="#1A202C"/>
  <rect x="72" y="24" width="8" height="12" fill="#1A202C"/>
  <rect x="18" y="52" width="14" height="6" fill="#1A202C"/>
  <rect x="36" y="62" width="8" height="8" fill="#1A202C"/>
  <rect x="52" y="50" width="36" height="36" rx="4" fill="#F0AD4E"/>
  <text x="70" y="72" font-family="sans-serif" font-size="11" font-weight="900" fill="#1A202C" text-anchor="middle">UPI</text>
  <rect x="94" y="52" width="10" height="6" fill="#1A202C"/>
  <rect x="110" y="58" width="16" height="8" fill="#1A202C"/>
  <rect x="52" y="96" width="8" height="12" fill="#1A202C"/>
  <rect x="66" y="102" width="14" height="6" fill="#1A202C"/>
  <rect x="86" y="96" width="12" height="8" fill="#1A202C"/>
  <rect x="104" y="104" width="22" height="10" fill="#1A202C"/>
  <rect x="58" y="118" width="12" height="10" fill="#1A202C"/>
  <rect x="80" y="114" width="18" height="14" fill="#1A202C"/>
</svg>
              <div style="font-size:0.8rem; color:var(--slate); margin-bottom:6px;">Or enter UPI ID:</div>
              <input type="text" class="form-control" value="conscious.traveler@okhdfcbank" style="max-width:280px; margin:0 auto; text-align:center; font-weight:600;" />
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; gap:12px;">
            <button class="btn btn-outline" id="btn-back-step1">← Back</button>
            <button class="btn btn-primary" id="btn-confirm-pay" style="flex:1;">Confirm & Pay ₹${grandTotal.toLocaleString('en-IN')}</button>
          </div>
        </div>
      `;

      // Back to step 1
      modalRoot.querySelector('#btn-back-step1').onclick = () => {
        openBookingModal(packageId, destinationId, guideId);
      };

      // Payment tabs switcher
      const payTabs = modalRoot.querySelectorAll('.pay-tab-btn');
      const payArea = modalRoot.querySelector('#pay-content-area');

      payTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          payTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const type = tab.dataset.pay;

          if (type === 'upi') {
            payArea.innerHTML = `
              <div style="text-align:center; padding:16px; background:var(--warm-sand); border-radius:var(--radius-md); border:1px dashed var(--terracotta);">
                <div style="font-size:0.85rem; font-weight:700; color:var(--charcoal); margin-bottom:8px;">Scan with any UPI App</div>
                <svg width="140" height="140" viewBox="0 0 140 140" style="margin:0 auto 10px auto; border-radius:8px; border:2px solid #fff; box-shadow:0 4px 10px rgba(0,0,0,0.1); background:#fff; display:block;">
  <!-- QR Corner Finders -->
  <rect x="10" y="10" width="35" height="35" fill="#1A202C" rx="4"/>
  <rect x="16" y="16" width="23" height="23" fill="#FFFFFF" rx="2"/>
  <rect x="21" y="21" width="13" height="13" fill="#D9534F" rx="2"/>

  <rect x="95" y="10" width="35" height="35" fill="#1A202C" rx="4"/>
  <rect x="101" y="16" width="23" height="23" fill="#FFFFFF" rx="2"/>
  <rect x="106" y="21" width="13" height="13" fill="#D9534F" rx="2"/>

  <rect x="10" y="95" width="35" height="35" fill="#1A202C" rx="4"/>
  <rect x="16" y="101" width="23" height="23" fill="#FFFFFF" rx="2"/>
  <rect x="21" y="106" width="13" height="13" fill="#D9534F" rx="2"/>

  <!-- Simulated QR Matrix Modules -->
  <rect x="52" y="12" width="6" height="6" fill="#1A202C"/>
  <rect x="62" y="18" width="8" height="6" fill="#1A202C"/>
  <rect x="76" y="12" width="8" height="8" fill="#1A202C"/>
  <rect x="52" y="28" width="12" height="6" fill="#1A202C"/>
  <rect x="72" y="24" width="8" height="12" fill="#1A202C"/>
  <rect x="18" y="52" width="14" height="6" fill="#1A202C"/>
  <rect x="36" y="62" width="8" height="8" fill="#1A202C"/>
  <rect x="52" y="50" width="36" height="36" rx="4" fill="#F0AD4E"/>
  <text x="70" y="72" font-family="sans-serif" font-size="11" font-weight="900" fill="#1A202C" text-anchor="middle">UPI</text>
  <rect x="94" y="52" width="10" height="6" fill="#1A202C"/>
  <rect x="110" y="58" width="16" height="8" fill="#1A202C"/>
  <rect x="52" y="96" width="8" height="12" fill="#1A202C"/>
  <rect x="66" y="102" width="14" height="6" fill="#1A202C"/>
  <rect x="86" y="96" width="12" height="8" fill="#1A202C"/>
  <rect x="104" y="104" width="22" height="10" fill="#1A202C"/>
  <rect x="58" y="118" width="12" height="10" fill="#1A202C"/>
  <rect x="80" y="114" width="18" height="14" fill="#1A202C"/>
</svg>
                <div style="font-size:0.8rem; color:var(--slate); margin-bottom:6px;">Or enter UPI VPA:</div>
                <input type="text" class="form-control" value="conscious.traveler@okhdfcbank" style="max-width:280px; margin:0 auto; text-align:center; font-weight:600;" />
              </div>
            `;
          } else if (type === 'card') {
            payArea.innerHTML = `
              <div style="background:var(--warm-sand); border-radius:var(--radius-md); padding:18px;">
                <div class="form-group">
                  <label class="form-label">Card Number</label>
                  <input type="text" class="form-control" value="4532 •••• •••• 8921" />
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                  <div class="form-group">
                    <label class="form-label">Expiry (MM/YY)</label>
                    <input type="text" class="form-control" value="08/28" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">CVV</label>
                    <input type="password" class="form-control" value="•••" maxlength="3" />
                  </div>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">Cardholder Name</label>
                  <input type="text" class="form-control" value="Anita Sharma" />
                </div>
              </div>
            `;
          } else if (type === 'apple') {
            payArea.innerHTML = `
              <div style="text-align:center; padding:30px; background:#000; color:#fff; border-radius:var(--radius-md);">
                <div style="font-size:1.8rem; margin-bottom:10px;">Pay</div>
                <p style="font-size:0.9rem; color:#A0AEC0; margin-bottom:14px;">Instant biometric checkout with Apple Pay</p>
                <div style="font-weight:700; font-size:1.2rem; color:#fff;">₹${grandTotal.toLocaleString('en-IN')}</div>
              </div>
            `;
          } else if (type === 'netbank') {
            payArea.innerHTML = `
              <div style="background:var(--warm-sand); border-radius:var(--radius-md); padding:18px;">
                <label class="form-label">Select Bank</label>
                <select class="form-control" style="margin-bottom:12px;">
                  <option>HDFC Bank</option>
                  <option>State Bank of India (SBI)</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
                <p style="font-size:0.8rem; color:var(--muted); margin:0;">You will be safely routed to your bank's secure netbanking portal.</p>
              </div>
            `;
          }
        });
      });

      // Confirm Payment -> Step 3: Success Confirmation Slip
      modalRoot.querySelector('#btn-confirm-pay').onclick = () => {
        const btn = modalRoot.querySelector('#btn-confirm-pay');
        btn.innerHTML = `<span style="display:inline-block; animation:spin 1s infinite linear;">⏳</span> Verifying Payment...`;
        if (window.GoBeyondAPI) {
          const destId = (item && (item.destinationId || item.id)) || 'bastar-tribal-crafts';
          window.GoBeyondAPI.bookings.create({
            destinationId: destId,
            guideId: item.guideId,
            startDate: selectedDate || new Date().toISOString(),
            guests: travelers
          }).then(res => {
            if (res && res.data) {
              window.GoBeyondAPI.payments.verify({
                bookingId: res.data.id,
                paymentMethod: 'UPI'
              }).catch(e => console.warn('Payment verify err:', e));
            }
          }).catch(e => console.warn('Booking create err:', e));
        }
        btn.disabled = true;

        setTimeout(() => {
          modalRoot.querySelector('#step-nav-2').classList.remove('active');
          modalRoot.querySelector('#step-nav-2').classList.add('completed');
          modalRoot.querySelector('#step-nav-3').classList.add('completed');

          const bookingId = 'GB-' + Math.floor(100000 + Math.random() * 900000);

          content.innerHTML = `
            <div style="text-align:center; padding:10px 0;">
              <div style="width:68px; height:68px; border-radius:50%; background:#ECFDF5; color:#10B981; display:flex; align-items:center; justify-content:center; font-size:2.2rem; margin:0 auto 16px auto;">✓</div>
              <h3 style="font-size:1.6rem; color:var(--charcoal); margin-bottom:6px;">Booking Confirmed!</h3>
              <p style="color:var(--slate); font-size:0.92rem; max-width:460px; margin:0 auto 20px auto;">
                Namaste! Your heritage expedition is booked. <strong>${guide ? guide.name : 'Your Local Guide'}</strong> has received your travel schedule.
              </p>

              <div style="background:var(--warm-sand); border-radius:var(--radius-md); padding:20px; text-align:left; border:1px solid var(--border-light); margin-bottom:20px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                  <span style="color:var(--muted); font-size:0.82rem; font-weight:700;">BOOKING REFERENCE</span>
                  <span style="font-family:var(--font-accent); font-weight:800; color:var(--terracotta);">${bookingId}</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem;">
                  <span style="color:var(--slate);">Experience:</span>
                  <strong style="color:var(--charcoal);">${title}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem;">
                  <span style="color:var(--slate);">Travel Date:</span>
                  <strong style="color:var(--charcoal);">${selectedDate}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem;">
                  <span style="color:var(--slate);">Travelers:</span>
                  <strong style="color:var(--charcoal);">${travelers} Guests</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem;">
                  <span style="color:var(--slate);">Local Guide:</span>
                  <strong style="color:var(--teal);">${guide ? guide.name : 'Master Cultural Host'} (${guide ? guide.city : 'India'})</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-top:1px dashed var(--border-light); padding-top:10px; margin-top:10px;">
                  <span style="font-weight:700; color:var(--charcoal);">Amount Paid:</span>
                  <span style="font-family:var(--font-accent); font-weight:800; color:#10B981; font-size:1.15rem;">₹${grandTotal.toLocaleString('en-IN')} (Paid)</span>
                </div>
              </div>

              <div style="display:flex; gap:12px; justify-content:center;">
                <button class="btn btn-outline" onclick="window.print()">🖨️ Print Voucher</button>
                <button class="btn btn-primary" id="btn-close-confirmed">Done</button>
              </div>
            </div>
          `;

          modalRoot.querySelector('#btn-close-confirmed').onclick = closeModal;
          showToast(`Success! Booking ${bookingId} confirmed. Confirmation sent via WhatsApp & Email.`, 'success');
        }, 850);
      };
    };
  }

  // --- Modal 4: Global Auth Modal ---
  function openAuthModal(isSignUp = false) {
    ensureContainers();
    const modalRoot = document.getElementById('modal-root');
    document.body.style.overflow = 'hidden';

    modalRoot.innerHTML = `
      <div class="modal-backdrop active" id="modal-bg">
        <div class="modal-dialog" style="max-width: 460px;" onclick="event.stopPropagation()">
          <button class="modal-close-btn" id="modal-close-x">&times;</button>
          
          <div style="text-align:center; margin-bottom:20px;">
            <div style="width:44px; height:44px; border-radius:12px; background:linear-gradient(135deg, var(--terracotta), var(--mustard)); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 10px auto; font-size:1.4rem;">
              ${ICONS.compass}
            </div>
            <h3 style="font-size:1.4rem; margin-bottom:4px;" id="auth-title">${isSignUp ? 'Join GoBeyond Community' : 'Welcome Back'}</h3>
            <p style="color:var(--slate); font-size:0.86rem; margin:0;">Connect with local guides across heritage India</p>
          </div>

          <div style="display:flex; gap:10px; margin-bottom:16px;">
            <button class="btn btn-outline" style="flex:1; font-size:0.85rem;" id="btn-social-google">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.7 0 3 .6 4 1.5l3-3C17.2 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 17.4C3.7 21.1 7.5 24 12 24z"/></svg>
              Google
            </button>
            <button class="btn btn-outline" style="flex:1; font-size:0.85rem;" id="btn-social-apple">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.7 19.5c-.8 1.2-1.7 2.4-3 2.5-1.4.1-1.8-.8-3.4-.8-1.5 0-2 .8-3.3.8-1.3-.1-2.2-1.3-3.1-2.5-1.8-2.6-3.1-7.3-1.3-10.5 1-1.7 2.7-2.7 4.5-2.7 1.4 0 2.7.9 3.5.9.8 0 2.4-1.2 4-1 1.7.1 3.2.9 4.1 2.2-3.6 2.1-3 6.7.6 8.1-.7 1.6-1.7 3.5-2.6 4.9zM15.9 5.8c.7-.9 1.2-2.1 1.1-3.3-1 .1-2.2.7-2.9 1.5-.6.7-1.2 2-1 3.1 1.2.1 2.2-.6 2.8-1.3z"/></svg>
              Apple
            </button>
          </div>

          <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
            <div style="flex:1; height:1px; background:var(--border-light);"></div>
            <span style="font-size:0.75rem; color:var(--muted); text-transform:uppercase;">or with email</span>
            <div style="flex:1; height:1px; background:var(--border-light);"></div>
          </div>

          <form id="auth-form">
            ${isSignUp ? `
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-control" id="auth-name" placeholder="Anita Sharma" required />
              </div>
            ` : ''}
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-control" id="auth-email" placeholder="conscious.traveler@example.com" value="anita.sharma@gobeyond.in" required />
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" id="auth-password" value="Heritage@2026" required />
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; margin-top:8px;" id="auth-submit-btn">
              ${isSignUp ? 'Create Traveler Account' : 'Sign In'}
            </button>
          </form>

          <div style="text-align:center; margin-top:16px; font-size:0.86rem;">
            ${isSignUp ? `
              <span style="color:var(--slate);">Already have an account?</span>
              <a href="#" style="color:var(--terracotta); font-weight:700; margin-left:4px;" id="auth-toggle-btn">Sign In</a>
            ` : `
              <span style="color:var(--slate);">New to GoBeyond Travels?</span>
              <a href="#" style="color:var(--terracotta); font-weight:700; margin-left:4px;" id="auth-toggle-btn">Create an Account</a>
            `}
          </div>

          <div style="margin-top:16px; padding:10px; background:var(--warm-sand); border-radius:var(--radius-sm); text-align:center;">
            <button type="button" class="btn btn-sm btn-outline" style="width:100%; border-color:#CBD5E1; font-size:0.78rem;" id="btn-quick-demo">
              ⚡ Quick Fill Demo Traveler Profile
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modal-close-x').onclick = closeModal;
    document.getElementById('modal-bg').onclick = closeModal;

    const toggleBtn = modalRoot.querySelector('#auth-toggle-btn');
    if (toggleBtn) {
      toggleBtn.onclick = (e) => {
        e.preventDefault();
        openAuthModal(!isSignUp);
      };
    }

    const form = modalRoot.querySelector('#auth-form');
    form.onsubmit = (e) => {
      e.preventDefault();
      const email = modalRoot.querySelector('#auth-email').value;
      const name = isSignUp ? modalRoot.querySelector('#auth-name').value : 'Anita Sharma';
      
      const user = {
        name: name || 'Anita Sharma',
        email: email,
        avatar: 'assets/images/travelers/traveler-anita.jpg',
        badge: 'Conscious Heritage Explorer'
      };

      setCurrentUser(user);
      showToast(`Welcome ${user.name}! You are now signed in.`, 'success');
      closeModal();
    };

    const demoBtn = modalRoot.querySelector('#btn-quick-demo');
    if (demoBtn) {
      demoBtn.onclick = () => {
        const user = {
          name: 'Anita Sharma',
          email: 'anita.heritage@gobeyond.in',
          avatar: 'assets/images/travelers/traveler-anita.jpg',
          badge: 'Conscious Heritage Explorer'
        };
        setCurrentUser(user);
        showToast('Logged in as Demo Traveler: Anita Sharma', 'success');
        closeModal();
      };
    }

    modalRoot.querySelector('#btn-social-google').onclick = () => {
      const user = {
        name: 'Anita Sharma (Google)',
        email: 'anita.google@gmail.com',
        avatar: 'assets/images/travelers/traveler-anita.jpg'
      };
      setCurrentUser(user);
      showToast('Signed in via Google successfully!', 'success');
      closeModal();
    };

    modalRoot.querySelector('#btn-social-apple').onclick = () => {
      const user = {
        name: 'Anita Sharma (Apple)',
        email: 'anita.apple@icloud.com',
        avatar: 'assets/images/travelers/traveler-anita.jpg'
      };
      setCurrentUser(user);
      showToast('Signed in via Apple successfully!', 'success');
      closeModal();
    };
  }

  // --- Modal 5: User Profile / Sign Out Modal ---
  function openUserMenuModal(user) {
    ensureContainers();
    const modalRoot = document.getElementById('modal-root');
    document.body.style.overflow = 'hidden';

    modalRoot.innerHTML = `
      <div class="modal-backdrop active" id="modal-bg">
        <div class="modal-dialog" style="max-width: 400px;" onclick="event.stopPropagation()">
          <button class="modal-close-btn" id="modal-close-x">&times;</button>
          
          <div style="text-align:center; margin-bottom:18px;">
            <img src="${user.avatar}" alt="${user.name}" style="width:72px; height:72px; border-radius:50%; object-fit:cover; margin:0 auto 10px auto; border:3px solid var(--terracotta);" />
            <h3 style="font-size:1.3rem; margin:0 0 4px 0;">${user.name}</h3>
            <p style="font-size:0.85rem; color:var(--slate); margin:0;">${user.email}</p>
            <span class="guide-badge-pill" style="margin-top:8px; display:inline-block;">🌿 ${user.badge || 'Verified Traveler'}</span>
          </div>

          <div style="background:var(--warm-sand); border-radius:var(--radius-md); padding:14px; margin-bottom:18px; font-size:0.85rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span style="color:var(--muted);">Expeditions Booked:</span>
              <strong>2 Tours</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--muted);">Heritage Impact Fund:</span>
              <strong style="color:var(--terracotta);">₹1,850 Contributed</strong>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px;">
            <a href="packages.html" class="btn btn-outline" style="text-align:center;">Explore Heritage Packages</a>
            <button class="btn btn-outline" style="border-color:#EF4444; color:#EF4444;" id="btn-logout">Sign Out</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modal-close-x').onclick = closeModal;
    document.getElementById('modal-bg').onclick = closeModal;

    modalRoot.querySelector('#btn-logout').onclick = () => {
      setCurrentUser(null);
      showToast('You have been signed out.', 'info');
      closeModal();
    };
  }

  // --- Initialize on DOM Loaded ---
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    ensureContainers();
    initAIAssistantWidget();
    initSocketCrowdListener();
  });

  // In-Memory Dynamic Canvas Image Generator for 100% Guaranteed Image Rendering
  function createCanvasFallbackImage(title, isAvatar) {
    try {
      const canvas = document.createElement('canvas');
      const w = isAvatar ? 200 : 800;
      const h = isAvatar ? 200 : 500;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      // Warm atmospheric gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#0A4D68');
      grad.addColorStop(0.5, '#1E293B');
      grad.addColorStop(1, '#D9534F');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (isAvatar) {
        // Avatar circle
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 86, 0, Math.PI * 2);
        ctx.strokeStyle = '#F0AD4E';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#F0AD4E';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2 - 12, 34, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(w / 2, h / 2 + 54, 46, Math.PI, Math.PI * 2);
        ctx.fill();

        // Initials
        const words = (title || 'Guide').trim().split(/\s+/);
        const initials = words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : (words[0][0] || 'G').toUpperCase();
        ctx.fillStyle = '#0A4D68';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, w / 2, h / 2 - 12);
      } else {
        // Glowing sun disc
        ctx.fillStyle = 'rgba(240, 173, 78, 0.45)';
        ctx.beginPath();
        ctx.arc(w * 0.8, h * 0.3, 110, 0, Math.PI * 2);
        ctx.fill();

        // Architectural Mountain Silhouettes
        ctx.fillStyle = 'rgba(10, 77, 104, 0.55)';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.72);
        ctx.quadraticCurveTo(w * 0.25, h * 0.58, w * 0.55, h * 0.68);
        ctx.quadraticCurveTo(w * 0.8, h * 0.62, w, h * 0.72);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();

        // Bottom dark vignette for text readability
        const darkGrad = ctx.createLinearGradient(0, h * 0.5, 0, h);
        darkGrad.addColorStop(0, 'rgba(10, 14, 20, 0)');
        darkGrad.addColorStop(1, 'rgba(10, 14, 20, 0.92)');
        ctx.fillStyle = darkGrad;
        ctx.fillRect(0, h * 0.5, w, h * 0.5);

        // Heritage Badge
        ctx.fillStyle = '#F0AD4E';
        ctx.fillRect(36, 36, 120, 30);
        ctx.fillStyle = '#1A202C';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('HERITAGE GEM', 96, 51);

        // Title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 30px Georgia, serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        const displayTitle = title && title.length > 36 ? title.substring(0, 33) + '...' : (title || 'Untold Heritage Gem');
        ctx.fillText(displayTitle, 36, h - 55);

        // Subtitle
        ctx.fillStyle = '#F0AD4E';
        ctx.font = '14px sans-serif';
        ctx.fillText('GOBEYOND TRAVELS • CULTURAL PRESERVATION', 36, h - 26);
      }

      return canvas.toDataURL('image/png');
    } catch(e) {
      return '';
    }
  }

  // Bulletproof Global Image Error Handler with Canvas Fallback
  document.addEventListener('error', (e) => {
    if (e.target && e.target.tagName === 'IMG') {
      const img = e.target;
      const isAvatar = img.classList.contains('guide-avatar') || 
                       img.classList.contains('guide-mini-avatar') || 
                       img.classList.contains('review-avatar');

      if (!img.dataset.firstFallbackTried) {
        img.dataset.firstFallbackTried = 'true';
        if (isAvatar) {
          img.src = 'assets/images/guides/guide-ramesh.jpg';
        } else {
          img.src = 'assets/images/destinations/bastar.jpg';
        }
      } else if (!img.dataset.canvasFallbackApplied) {
        img.dataset.canvasFallbackApplied = 'true';
        const dataUrl = createCanvasFallbackImage(img.alt, isAvatar);
        if (dataUrl) {
          img.src = dataUrl;
        }
      }
    }
  }, true);

  // --- Export Global Methods ---
  
  // --- AI Travel Assistant Floating Widget (Module 12) ---
  function initAIAssistantWidget() {
    if (document.getElementById('gobeyond-ai-fab')) return;

    const fab = document.createElement('div');
    fab.id = 'gobeyond-ai-fab';
    fab.innerHTML = `
      <div id="ai-fab-btn" style="position:fixed; bottom:24px; right:24px; z-index:9999; cursor:pointer; background:linear-gradient(135deg, #D9534F, #C27D38); color:#fff; padding:12px 20px; border-radius:999px; box-shadow:0 8px 24px rgba(217,83,79,0.38); display:flex; align-items:center; gap:10px; font-weight:700; font-size:0.88rem; transition:transform 0.2s; user-select:none;">
        <span style="font-size:1.3rem;">🧭</span>
        <span>AI Heritage Guide</span>
        <span style="background:rgba(255,255,255,0.25); padding:2px 8px; border-radius:999px; font-size:0.68rem; font-weight:800;">LIVE</span>
      </div>

      <div id="ai-drawer" style="display:none; position:fixed; bottom:86px; right:24px; width:390px; max-width:calc(100vw - 32px); height:540px; max-height:calc(100vh - 120px); background:#FAF9F6; border:1px solid var(--border-light); border-radius:var(--radius-lg); box-shadow:0 16px 40px rgba(0,0,0,0.22); z-index:9999; flex-direction:column; overflow:hidden;">
        
        <!-- Header -->
        <div style="background:var(--charcoal); color:#fff; padding:16px 20px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.2rem;">🧭</span>
            <div>
              <strong style="display:block; font-size:0.95rem; font-family:var(--font-accent);">GoBeyond AI Assistant</strong>
              <span style="font-size:0.72rem; color:var(--warm-sand);">Conscious Heritage Explorer Engine</span>
            </div>
          </div>
          <button id="btn-close-ai" style="background:none; border:none; color:#fff; font-size:1.3rem; cursor:pointer; line-height:1;">&times;</button>
        </div>

        <!-- Navigation Tabs -->
        <div style="display:flex; border-bottom:1px solid var(--border-light); background:#fff;">
          <button id="tab-ai-chat" class="ai-tab active" style="flex:1; padding:10px; border:none; background:none; font-weight:700; font-size:0.8rem; cursor:pointer; border-bottom:2px solid var(--terracotta); color:var(--terracotta);">💬 Ask AI</button>
          <button id="tab-ai-itin" class="ai-tab" style="flex:1; padding:10px; border:none; background:none; font-weight:700; font-size:0.8rem; cursor:pointer; color:var(--slate);">🗺️ Itinerary</button>
          <button id="tab-ai-rev" class="ai-tab" style="flex:1; padding:10px; border:none; background:none; font-weight:700; font-size:0.8rem; cursor:pointer; color:var(--slate);">📊 Reviews</button>
        </div>

        <!-- Tab 1: Chat Pane -->
        <div id="pane-ai-chat" style="flex:1; display:flex; flex-direction:column; overflow:hidden; padding:14px;">
          <div id="ai-chat-messages" style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:10px; padding-right:4px; font-size:0.86rem;">
            <div style="background:#fff; border:1px solid var(--border-light); padding:10px 14px; border-radius:12px; color:var(--charcoal); line-height:1.5;">
              Namaste! 🙏 I am your <strong>GoBeyond AI Travel Guide</strong>. Ask me for hidden heritage spots under a budget, authentic tribal crafts, or low-crowd escapes.
            </div>
          </div>

          <!-- Quick Suggestion Pills -->
          <div style="display:flex; gap:6px; overflow-x:auto; padding:8px 0; font-size:0.72rem;">
            <span class="ai-pill" style="cursor:pointer; background:var(--warm-sand); padding:4px 8px; border-radius:999px; white-space:nowrap; border:1px solid var(--border-light);">Near Delhi under ₹3000</span>
            <span class="ai-pill" style="cursor:pointer; background:var(--warm-sand); padding:4px 8px; border-radius:999px; white-space:nowrap; border:1px solid var(--border-light);">Dhokra metal craft</span>
            <span class="ai-pill" style="cursor:pointer; background:var(--warm-sand); padding:4px 8px; border-radius:999px; white-space:nowrap; border:1px solid var(--border-light);">Zero crowd spots</span>
          </div>

          <div style="display:flex; gap:8px; margin-top:6px;">
            <input type="text" id="ai-input-msg" placeholder="Ask about hidden gems, budget, guides..." style="flex:1; padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-light); font-size:0.84rem; outline:none;" />
            <button id="btn-send-ai" class="btn btn-primary btn-sm" style="padding:8px 14px;">Send</button>
          </div>
        </div>

        <!-- Tab 2: Itinerary Generator Pane -->
        <div id="pane-ai-itin" style="flex:1; display:none; flex-direction:column; overflow-y:auto; padding:16px; font-size:0.86rem;">
          <div style="margin-bottom:12px;">
            <label style="display:block; font-weight:700; font-size:0.78rem; margin-bottom:4px;">Destination</label>
            <input type="text" id="itin-dest" class="form-control" value="Bastar Tribal Heritage" style="font-size:0.85rem; padding:8px;" />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
            <div>
              <label style="display:block; font-weight:700; font-size:0.78rem; margin-bottom:4px;">Budget (₹)</label>
              <input type="number" id="itin-budget" class="form-control" value="3500" style="font-size:0.85rem; padding:8px;" />
            </div>
            <div>
              <label style="display:block; font-weight:700; font-size:0.78rem; margin-bottom:4px;">Duration</label>
              <select id="itin-duration" class="form-control" style="font-size:0.85rem; padding:8px;">
                <option value="2 Days">2 Days</option>
                <option value="3 Days" selected>3 Days</option>
                <option value="5 Days">5 Days</option>
              </select>
            </div>
          </div>
          <button id="btn-gen-itin" class="btn btn-primary btn-sm" style="width:100%; margin-bottom:12px;">✨ Generate AI Itinerary</button>
          <div id="itin-result-box" style="background:#fff; border:1px solid var(--border-light); border-radius:8px; padding:12px; font-size:0.82rem; line-height:1.5;">
            Click Generate to craft a tailored day-by-day expedition plan.
          </div>
        </div>

        <!-- Tab 3: Reviews AI Summarizer Pane -->
        <div id="pane-ai-rev" style="flex:1; display:none; flex-direction:column; overflow-y:auto; padding:16px; font-size:0.86rem;">
          <label style="display:block; font-weight:700; font-size:0.78rem; margin-bottom:4px;">Select Gem to Summarize</label>
          <select id="ai-rev-dest" class="form-control" style="font-size:0.85rem; padding:8px; margin-bottom:12px;">
            <option value="bastar-tribal-crafts">Bastar Tribal Heritage</option>
            <option value="majuli-river-satras">Majuli Island Satras</option>
            <option value="hampi-anegundi-boulders">Hampi / Anegundi Boulders</option>
            <option value="chettinad-mansions-culinary">Chettinad Heritage Mansions</option>
          </select>
          <button id="btn-summarize-rev" class="btn btn-primary btn-sm" style="width:100%; margin-bottom:12px;">📊 Summarize Reviews</button>
          <div id="ai-rev-summary-box" style="background:#fff; border:1px solid var(--border-light); border-radius:8px; padding:12px; font-size:0.82rem; line-height:1.5;">
            Click Summarize to synthesize hundreds of reviews into Pros & Cons.
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(fab);

    // Toggle drawer
    const btnFab = document.getElementById('ai-fab-btn');
    const drawer = document.getElementById('ai-drawer');
    const btnClose = document.getElementById('btn-close-ai');

    btnFab.onclick = () => drawer.style.display = drawer.style.display === 'none' ? 'flex' : 'none';
    btnClose.onclick = () => drawer.style.display = 'none';

    // Tabs switching
    const tabChat = document.getElementById('tab-ai-chat');
    const tabItin = document.getElementById('tab-ai-itin');
    const tabRev = document.getElementById('tab-ai-rev');
    const paneChat = document.getElementById('pane-ai-chat');
    const paneItin = document.getElementById('pane-ai-itin');
    const paneRev = document.getElementById('pane-ai-rev');

    function switchAiTab(tab) {
      [tabChat, tabItin, tabRev].forEach(t => {
        t.style.borderBottom = 'none';
        t.style.color = 'var(--slate)';
      });
      [paneChat, paneItin, paneRev].forEach(p => p.style.display = 'none');

      if (tab === 'chat') {
        tabChat.style.borderBottom = '2px solid var(--terracotta)';
        tabChat.style.color = 'var(--terracotta)';
        paneChat.style.display = 'flex';
      } else if (tab === 'itin') {
        tabItin.style.borderBottom = '2px solid var(--terracotta)';
        tabItin.style.color = 'var(--terracotta)';
        paneItin.style.display = 'flex';
      } else if (tab === 'rev') {
        tabRev.style.borderBottom = '2px solid var(--terracotta)';
        tabRev.style.color = 'var(--terracotta)';
        paneRev.style.display = 'flex';
      }
    }

    tabChat.onclick = () => switchAiTab('chat');
    tabItin.onclick = () => switchAiTab('itin');
    tabRev.onclick = () => switchAiTab('rev');

    // Chat functionality
    const msgBox = document.getElementById('ai-chat-messages');
    const inputMsg = document.getElementById('ai-input-msg');
    const btnSend = document.getElementById('btn-send-ai');

    async function sendChat(text) {
      const q = text || inputMsg.value.trim();
      if (!q) return;
      inputMsg.value = '';

      msgBox.innerHTML += `<div style="align-self:flex-end; background:var(--terracotta); color:#fff; padding:8px 12px; border-radius:12px; max-width:85%; word-break:break-word;">${q}</div>`;
      msgBox.scrollTop = msgBox.scrollHeight;

      const loadingDiv = document.createElement('div');
      loadingDiv.style.alignSelf = 'flex-start';
      loadingDiv.style.background = '#fff';
      loadingDiv.style.border = '1px solid var(--border-light)';
      loadingDiv.style.padding = '8px 12px';
      loadingDiv.style.borderRadius = '12px';
      loadingDiv.textContent = 'Thinking... ⏳';
      msgBox.appendChild(loadingDiv);
      msgBox.scrollTop = msgBox.scrollHeight;

      try {
        let answer = '';
        if (window.GoBeyondAPI) {
          const res = await window.GoBeyondAPI.ai.chat(q);
          answer = res.data?.answer || 'Heritage recommendation ready.';
        } else {
          answer = 'Heritage recommendation: Visit Bastar for lost-wax Dhokra artisans or Shekhawati for frescoed havelis.';
        }
        loadingDiv.innerHTML = answer.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      } catch (e) {
        loadingDiv.textContent = 'Error contacting AI: ' + e.message;
      }
      msgBox.scrollTop = msgBox.scrollHeight;
    }

    btnSend.onclick = () => sendChat();
    inputMsg.onkeydown = (e) => { if (e.key === 'Enter') sendChat(); };

    document.querySelectorAll('.ai-pill').forEach(pill => {
      pill.onclick = () => sendChat(pill.textContent);
    });

    // Itinerary generation
    document.getElementById('btn-gen-itin').onclick = async () => {
      const dest = document.getElementById('itin-dest').value;
      const budget = document.getElementById('itin-budget').value;
      const duration = document.getElementById('itin-duration').value;
      const resBox = document.getElementById('itin-result-box');
      resBox.innerHTML = 'Crafting your heritage itinerary... ⏳';

      try {
        if (window.GoBeyondAPI) {
          const res = await window.GoBeyondAPI.ai.generateItinerary({ destinationName: dest, budget, duration });
          const itin = res.data;
          resBox.innerHTML = `
            <h4 style="margin-top:0; color:var(--terracotta); font-family:var(--font-accent);">${itin.destination}</h4>
            <div style="font-size:0.75rem; color:var(--muted); margin-bottom:8px;">${itin.duration} • Budget ${itin.budgetCategory}</div>
            ${itin.days.map(d => `
              <div style="margin-bottom:8px; border-top:1px solid #eee; padding-top:6px;">
                <strong style="color:var(--charcoal); display:block;">Day ${d.day}: ${d.title}</strong>
                <p style="margin:4px 0; font-size:0.78rem;">🌅 <strong>Morning:</strong> ${d.morning}</p>
                <p style="margin:4px 0; font-size:0.78rem;">☀️ <strong>Afternoon:</strong> ${d.afternoon}</p>
                <p style="margin:4px 0; font-size:0.78rem;">🌙 <strong>Evening:</strong> ${d.evening}</p>
              </div>
            `).join('')}
          `;
        }
      } catch(e) {
        resBox.innerHTML = 'Error: ' + e.message;
      }
    };

    // Review summarization
    document.getElementById('btn-summarize-rev').onclick = async () => {
      const destId = document.getElementById('ai-rev-dest').value;
      const box = document.getElementById('ai-rev-summary-box');
      box.innerHTML = 'Synthesizing traveler reviews... ⏳';

      try {
        if (window.GoBeyondAPI) {
          const res = await window.GoBeyondAPI.ai.summarizeReviews(destId);
          const s = res.data;
          box.innerHTML = `
            <div style="margin-bottom:8px; font-weight:700; color:#059669;">✓ ${s.overallSentiment}</div>
            <strong style="color:var(--teal);">Pros:</strong>
            <ul style="margin:4px 0 8px 16px; padding:0;">
              ${s.pros.map(p => `<li>${p}</li>`).join('')}
            </ul>
            <strong style="color:var(--terracotta);">Cons:</strong>
            <ul style="margin:4px 0 0 16px; padding:0;">
              ${s.cons.map(c => `<li>${c}</li>`).join('')}
            </ul>
          `;
        }
      } catch(e) {
        box.innerHTML = 'Error: ' + e.message;
      }
    };
  }

  // --- Real-Time Socket.io Crowd Listener ---
  function initSocketCrowdListener() {
    if (window.GoBeyondAPI) {
      window.GoBeyondAPI.crowd.onUpdate((data) => {
        console.log('[Socket.io] Real-time crowd broadcast received:', data);
        if (window.GoBeyond) {
          window.GoBeyond.showToast(`📡 Live Crowd Alert: ${data.destinationId} density is now ${data.crowdPercent}% (${data.crowdLevel})`, 'info');
        }
      });
    }
  }

  window.GoBeyond = {
    openGuideModal,
    openRouteGuide,
    openBookingModal,
    openAuthModal,
    closeModal,
    showToast,
    renderCrowdMeterBadge,
    getCurrentUser,
    setCurrentUser
  };

})();
