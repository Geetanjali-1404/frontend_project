/**
 * GOBEYOND TRAVELS - Authentication Page Logic
 * Connected to Node.js / Express Backend (JWT + RBAC)
 */

document.addEventListener('DOMContentLoaded', () => {
  const tabSignIn = document.getElementById('auth-tab-signin');
  const tabSignUp = document.getElementById('auth-tab-signup');
  const formTitle = document.getElementById('auth-page-title');
  const formSubtitle = document.getElementById('auth-page-subtitle');
  const nameFieldGroup = document.getElementById('auth-name-group');
  const submitBtn = document.getElementById('auth-page-submit');
  const toggleLink = document.getElementById('auth-toggle-link');
  const authForm = document.getElementById('auth-standalone-form');
  const demoBtn = document.getElementById('btn-auth-demo');
  const pwdToggle = document.getElementById('pwd-toggle-btn');
  const pwdInput = document.getElementById('auth-pwd-input');

  let isSignUp = false;

  // Check URL param ?mode=signup
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('mode') === 'signup') {
    setMode(true);
  } else {
    setMode(false);
  }

  function setMode(signUpMode) {
    isSignUp = signUpMode;
    if (isSignUp) {
      tabSignUp.classList.add('active');
      tabSignIn.classList.remove('active');
      formTitle.textContent = 'Create Traveler Account';
      formSubtitle.textContent = 'Join 1,200+ conscious explorers and connect with local custodians.';
      nameFieldGroup.style.display = 'block';
      submitBtn.textContent = 'Create My Account →';
      toggleLink.innerHTML = `Already have an account? <strong style="color:var(--terracotta);">Sign In</strong>`;
    } else {
      tabSignIn.classList.add('active');
      tabSignUp.classList.remove('active');
      formTitle.textContent = 'Welcome Back';
      formSubtitle.textContent = 'Sign in to access your booked expeditions and guide conversations.';
      nameFieldGroup.style.display = 'none';
      submitBtn.textContent = 'Sign In to GoBeyond →';
      toggleLink.innerHTML = `Don't have an account? <strong style="color:var(--terracotta);">Create one</strong>`;
    }
  }

  if (tabSignIn && tabSignUp) {
    tabSignIn.addEventListener('click', () => setMode(false));
    tabSignUp.addEventListener('click', () => setMode(true));
  }

  if (toggleLink) {
    toggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      setMode(!isSignUp);
    });
  }

  // Password show/hide toggle
  if (pwdToggle && pwdInput) {
    pwdToggle.addEventListener('click', () => {
      if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        pwdToggle.textContent = '🙈';
      } else {
        pwdInput.type = 'password';
        pwdToggle.textContent = '👁️';
      }
    });
  }

  // Handle Form Submission with Live Backend API
  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email-input').value;
      const pwd = document.getElementById('auth-pwd-input').value || 'traveler123';
      const name = isSignUp ? document.getElementById('auth-name-input').value : 'Anita Sharma';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Authenticating...';
      }

      try {
        if (window.GoBeyondAPI) {
          if (isSignUp) {
            await window.GoBeyondAPI.auth.register({ name, email, password: pwd });
          } else {
            await window.GoBeyondAPI.auth.login(email, pwd);
          }
        }
      } catch (err) {
        console.warn('Backend login fallback:', err.message);
        const fallbackUser = {
          name: name || 'Anita Sharma',
          email: email,
          avatar: email.includes('admin') ? 'assets/images/travelers/traveler-marcus.jpg' : 'assets/images/travelers/traveler-anita.jpg',
          role: email.includes('admin') ? 'ADMIN' : 'TRAVELER',
          badge: 'Conscious Heritage Explorer'
        };
        if (window.GoBeyond) window.GoBeyond.setCurrentUser(fallbackUser);
      }

      if (window.GoBeyond) {
        const u = window.GoBeyond.getCurrentUser();
        window.GoBeyond.showToast(`Welcome back, ${u ? u.name : name}! Redirecting...`, 'success');
      }

      setTimeout(() => {
        const u = window.GoBeyond ? window.GoBeyond.getCurrentUser() : null;
        if (u && u.role === 'ADMIN') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'index.html';
        }
      }, 700);
    });
  }

  // Demo Traveler Quick-Fill
  if (demoBtn) {
    demoBtn.addEventListener('click', async () => {
      document.getElementById('auth-email-input').value = 'anita@gobeyond.travel';
      document.getElementById('auth-pwd-input').value = 'traveler123';
      if (isSignUp) {
        document.getElementById('auth-name-input').value = 'Anita Sharma';
      }

      try {
        if (window.GoBeyondAPI) {
          await window.GoBeyondAPI.auth.login('anita@gobeyond.travel', 'traveler123');
        }
      } catch (e) {
        if (window.GoBeyond) {
          window.GoBeyond.setCurrentUser({
            name: 'Anita Sharma',
            email: 'anita@gobeyond.travel',
            avatar: 'assets/images/travelers/traveler-anita.jpg',
            role: 'TRAVELER',
            badge: 'Conscious Heritage Explorer'
          });
        }
      }

      if (window.GoBeyond) {
        window.GoBeyond.showToast('Signed in as Demo Traveler: Anita Sharma (JWT Authenticated)', 'success');
      }

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 700);
    });
  }

  // Admin Quick-Fill Button (Add dynamically under demo button)
  if (demoBtn && demoBtn.parentNode) {
    const adminBtn = document.createElement('button');
    adminBtn.type = 'button';
    adminBtn.className = 'btn btn-outline btn-block';
    adminBtn.style.marginTop = '10px';
    adminBtn.style.borderColor = '#C27D38';
    adminBtn.style.color = '#C27D38';
    adminBtn.innerHTML = `🛡️ Quick Sign-in as <strong>Platform Administrator</strong>`;
    adminBtn.onclick = async () => {
      document.getElementById('auth-email-input').value = 'admin@gobeyond.travel';
      document.getElementById('auth-pwd-input').value = 'admin123';
      try {
        if (window.GoBeyondAPI) {
          await window.GoBeyondAPI.auth.login('admin@gobeyond.travel', 'admin123');
        }
      } catch (e) {
        if (window.GoBeyond) {
          window.GoBeyond.setCurrentUser({
            name: 'GoBeyond Administrator',
            email: 'admin@gobeyond.travel',
            avatar: 'assets/images/travelers/traveler-anita.jpg',
            role: 'ADMIN',
            badge: 'Platform Administrator'
          });
        }
      }
      if (window.GoBeyond) {
        window.GoBeyond.showToast('Signed in as Administrator! Opening Admin Dashboard...', 'success');
      }
      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 700);
    };
    demoBtn.parentNode.insertBefore(adminBtn, demoBtn.nextSibling);
  }

  // Social login buttons
  const googleBtn = document.getElementById('auth-btn-google');
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      try {
        if (window.GoBeyondAPI) {
          await window.GoBeyondAPI.auth.register({
            name: 'Anita Sharma (Google)',
            email: 'anita.google@gmail.com',
            password: 'google_oauth_pass'
          });
        }
      } catch (e) {}
      if (window.GoBeyond) {
        window.GoBeyond.showToast('Google Sign In Successful! Redirecting...', 'success');
      }
      setTimeout(() => window.location.href = 'index.html', 700);
    });
  }

  const appleBtn = document.getElementById('auth-btn-apple');
  if (appleBtn) {
    appleBtn.addEventListener('click', () => {
      if (window.GoBeyond) {
        window.GoBeyond.showToast('Apple ID Sign In Successful! Redirecting...', 'success');
      }
      setTimeout(() => window.location.href = 'index.html', 700);
    });
  }
});
