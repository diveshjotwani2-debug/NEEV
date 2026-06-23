// ==========================================================================
// NEEV - SERVERLESS CLIENT CONTROLLER & SPA ROUTER
// ==========================================================================

class NeevApp {
  constructor() {
    this.token = localStorage.getItem('cf_token') || null;
    this.user = null;
    this.activeEnrollment = null;
    this.careers = [];
    this.specializations = [];
    this.currentView = 'home';
    this.routeParams = {};
    
    // Task Checklist editing state
    this.isEditingTasks = false;
    this.localTasks = [];
    
    // Bind methods
    this.handleRoute = this.handleRoute.bind(this);
    
    // Initialize
    window.addEventListener('hashchange', this.handleRoute);
    window.addEventListener('load', async () => {
      this.initSession();
      this.handleRoute();
      this.setupMobileMenu();
      
      // Initialize Apple/Luxury 3D systems
      this.initCustomCursor();
      this.initThreeJS();
      this.initTilt();
    });
  }

  // Session Management (Client-Side LocalStorage Mock)
  initSession() {
    if (this.token) {
      const usersRaw = localStorage.getItem('neev_users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const user = users.find(u => u.id === this.token);
      
      if (user) {
        this.user = user;
        this.updateNavState();
      } else {
        this.logout();
      }
    } else {
      this.updateNavState();
    }
  }

  updateNavState() {
    const navDashboard = document.getElementById('nav-dashboard');
    const navLogin = document.getElementById('nav-login');
    const navRegister = document.getElementById('nav-register');
    const navProfileMenu = document.getElementById('nav-profile-menu');
    const userDisplayName = document.getElementById('user-display-name');

    if (this.user) {
      navDashboard.style.display = 'inline-block';
      navLogin.style.display = 'none';
      navRegister.style.display = 'none';
      navProfileMenu.style.display = 'flex';
      userDisplayName.textContent = this.user.name.split(' ')[0];
    } else {
      navDashboard.style.display = 'none';
      navLogin.style.display = 'inline-block';
      navRegister.style.display = 'inline-block';
      navProfileMenu.style.display = 'none';
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    this.activeEnrollment = null;
    localStorage.removeItem('cf_token');
    this.updateNavState();
    this.showToast('Logged out successfully.', 'info');
    location.hash = '#home';
  }

  // Routing System
  handleRoute() {
    const hash = location.hash || '#home';
    const cleanHash = hash.replace(/^#/, '');
    
    let view = cleanHash;
    let params = {};

    if (cleanHash.includes('?')) {
      const parts = cleanHash.split('?');
      view = parts[0];
      const qParams = new URLSearchParams(parts[1]);
      for (const [key, value] of qParams.entries()) {
        params[key] = value;
      }
    } else if (cleanHash.startsWith('career/')) {
      view = 'career-details';
      params.id = cleanHash.replace('career/', '');
    }

    this.currentView = view;
    this.routeParams = params;

    // Reset task editing state when leaving dashboard
    if (view !== 'dashboard') {
      this.isEditingTasks = false;
      this.localTasks = [];
    }

    // Highlight active link in header
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkHash = link.getAttribute('href');
      if (linkHash === `#${view}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    this.renderView();
  }

  setupMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('main-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.top = '70px';
        nav.style.left = '0';
        nav.style.width = '100%';
        nav.style.background = 'var(--bg-secondary)';
        nav.style.padding = '20px';
        nav.style.borderBottom = '1px solid var(--border-color)';
      });
    }
  }

  // Render Views
  renderView() {
    const viewContainer = document.getElementById('app-view');
    viewContainer.innerHTML = `
      <div class="loading-spinner-wrapper">
        <div class="spinner"></div>
        <p>Loading Neev...</p>
      </div>
    `;

    try {
      switch (this.currentView) {
        case 'home':
          viewContainer.innerHTML = this.getHomeHtml();
          break;
        case 'explorer':
          this.loadCareersData();
          viewContainer.innerHTML = this.getExplorerHtml();
          this.setupExplorerEvents();
          break;
        case 'career-details':
          this.loadCareerDetails(this.routeParams.id);
          break;
        case 'dashboard':
          if (!this.user) {
            this.showToast('Please sign in to view your dashboard.', 'warning');
            location.hash = '#login';
            return;
          }
          this.loadDashboardData();
          break;
        case 'login':
          if (this.user) { location.hash = '#dashboard'; return; }
          viewContainer.innerHTML = this.getLoginHtml();
          this.setupLoginEvents();
          break;
        case 'register':
          if (this.user) { location.hash = '#dashboard'; return; }
          viewContainer.innerHTML = this.getRegisterHtml();
          this.setupRegisterEvents();
          break;
        default:
          viewContainer.innerHTML = `
            <div class="container text-center" style="padding: 60px 0;">
              <h2>404 Page Not Found</h2>
              <p style="color: var(--text-muted); margin-bottom: 20px;">The requested pathway does not exist.</p>
              <a href="#home" class="btn btn-primary">Return Home</a>
            </div>
          `;
      }
    } catch (err) {
      console.error('Error rendering view:', err);
      viewContainer.innerHTML = `
        <div class="container text-center" style="padding: 60px 0;">
          <h2>Error Loading Page</h2>
          <p style="color: var(--text-muted); margin-bottom: 20px;">Check your connection and try again.</p>
          <button class="btn btn-outline" onclick="location.reload()">Retry</button>
        </div>
      `;
    }
  }

  // Toast System
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Local Database Helpers
  loadCareersData() {
    // Read directly from the globally imported CAREER_DATABASE object
    this.careers = CAREER_DATABASE.careers;
    this.specializations = CAREER_DATABASE.specializations;
  }

  loadCareerDetails(id) {
    const viewContainer = document.getElementById('app-view');
    const spec = CAREER_DATABASE.specializations.find(s => s.id === id);
    
    if (!spec) {
      this.showToast('Specialization details not found.', 'error');
      location.hash = '#explorer';
      return;
    }

    // Match timeline and curriculum from static database
    const timeline = CAREER_DATABASE.timeline.filter(t => t.specializationId === id).sort((a,b) => a.year - b.year);
    const curriculum = CAREER_DATABASE.curriculum.filter(c => c.specializationId === id).sort((a,b) => a.year - b.year);
    const salary = CAREER_DATABASE.salaries.find(s => s.specializationId === id) || {
      year1: 350000, year3: 700000, year5: 1200000,
      trajectory: 'Entry Level -> Mid Specialist -> Lead Practitioner'
    };
    const recruiters = spec.recruiters || ['Top National Tech Labs', 'Major Corporate Hubs'];

    const detailedSpec = {
      ...spec,
      timeline: timeline.length > 0 ? timeline : [
        { year: 1, focus: 'Foundations', milestoneDescription: 'Read 3 introductory textbooks and master terminology.' },
        { year: 2, focus: 'Skill Labs', milestoneDescription: 'Complete 2 practical mini-projects.' },
        { year: 3, focus: 'Specialization', milestoneDescription: 'Complete 1 professional level specialization certificate.' },
        { year: 4, focus: 'Field Transition', milestoneDescription: 'Complete a 3-month field internship.' }
      ],
      curriculum: curriculum.length > 0 ? curriculum : [
        { year: 1, subjects: 'Foundation Principles; Introduction to Field; Mathematical Basics', skillsGained: 'Domain literacy, terminology' },
        { year: 2, subjects: 'Intermediate Theories; Case Studies & Experiments; Practical Labs', skillsGained: 'Hands-on practice, methodologies' },
        { year: 3, subjects: 'Specialized Electives; Advanced Tools; Industry Standards', skillsGained: 'System design, tool optimization' },
        { year: 4, subjects: 'Professional Ethics; Internship / Field Work; Final Project', skillsGained: 'Real-world deployment, operations' }
      ],
      salary,
      recruiters
    };

    viewContainer.innerHTML = this.getCareerDetailsHtml(detailedSpec);
    
    setTimeout(() => {
      document.querySelectorAll('.salary-bar-fill').forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width;
      });
    }, 100);
  }

  loadDashboardData() {
    const viewContainer = document.getElementById('app-view');
    const enrollmentKey = `neev_enrollment_${this.user.id}`;
    const enrollmentRaw = localStorage.getItem(enrollmentKey);

    if (enrollmentRaw) {
      const enrollment = JSON.parse(enrollmentRaw);
      this.activeEnrollment = enrollment;

      // Extract YouTube guides
      const youtubeVideos = CAREER_DATABASE.youtubeVideos[enrollment.specializationId] || [
        { id: 'ukLnPbIffxE', title: 'How to Study Effectively for Exams (Active Recall)', channel: 'Ali Abdaal', description: 'Science-backed techniques like spaced repetition and practice testing to learn 2x faster.', url: 'https://www.youtube.com/watch?v=ukLnPbIffxE' },
        { id: 'CqHjOig0v3s', title: 'My Study Method - How I Memorize Complex Concepts', channel: 'Anuj Pachhel', description: 'Practical roadmap of notes, schedules, and active recall used by a top medical student.', url: 'https://www.youtube.com/watch?v=CqHjOig0v3s' }
      ];

      // Local notifications
      const notifications = [
        { id: 'n1', text: 'Welcome to your career journey! Keep up Phase 1 progress.', date: new Date(enrollment.enrolledAt).toLocaleDateString() }
      ];

      if (enrollment.progressPercent >= 50) {
        notifications.unshift({ id: 'n2', text: 'Milestone Alert! You have finished 50% of your checklist. Keep it up!', date: 'Just now' });
      }

      viewContainer.innerHTML = this.getDashboardHtml({
        enrollment,
        youtubeVideos,
        notifications
      });
      this.animateDashboardProgress();
      this.setupDashboardEvents();
    } else {
      viewContainer.innerHTML = this.getDashboardUnenrolledHtml();
    }
  }

  animateDashboardProgress() {
    const offset = 251.2 - (251.2 * this.activeEnrollment.progressPercent) / 100;
    const circle = document.getElementById('progress-circle-fill');
    if (circle) {
      circle.style.strokeDashoffset = offset;
    }
  }

  // HTML Templates
  getHomeHtml() {
    return `
      <section class="container hero">
        <span class="hero-tag">A Free Career Guidance & Planning Platform</span>
        <h1 class="hero-title">Find the Exact Roadmap to Your <span class="hero-gradient">Ideal Career</span></h1>
        <p class="hero-subtitle">Honest cost breakdowns, year-by-year curriculums, and real YouTube course guides. Exclusively designed for Tier-2 Indian students.</p>
        <div class="hero-buttons">
          <a href="#explorer" class="btn btn-primary btn-lg">Explore Career Streams</a>
          ${this.user ? `<a href="#dashboard" class="btn btn-outline btn-lg">Go to My Dashboard</a>` : `<a href="#register" class="btn btn-outline btn-lg">Sign Up Free</a>`}
        </div>
      </section>

      <section class="container stats-bar">
        <div class="stat-item">
          <div class="stat-num">3</div>
          <div class="stat-label">Main Streams (Sci/Com/Art)</div>
        </div>
        <div class="stat-item">
          <div class="stat-num">30+</div>
          <div class="stat-label">Careers Mapped</div>
        </div>
        <div class="stat-item">
          <div class="stat-num">50+</div>
          <div class="stat-label">Specializations</div>
        </div>
        <div class="stat-item">
          <div class="stat-num">₹0</div>
          <div class="stat-label">Cost - 100% Free</div>
        </div>
      </section>

      <section class="container features-section">
        <div class="section-header">
          <h2 class="section-title">Why Neev is Different</h2>
          <p class="section-subtitle">We don't just list titles. We map the entire journey so you make decisions with absolute clarity.</p>
        </div>
        <div class="grid-3">
          <div class="glass-card feature-card">
            <div class="feature-icon-wrapper">
              <svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/></svg>
            </div>
            <h3 class="feature-title">Detailed Specializations</h3>
            <p class="feature-desc">Instead of generic "Engineering", discover the exact differences in fees, syllabus, and timelines between Software Dev, AI/ML, and DevOps.</p>
          </div>
          <div class="glass-card feature-card">
            <div class="feature-icon-wrapper">
              <svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h-2v2h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06z" stroke="currentColor" stroke-width="2" fill="none"/></svg>
            </div>
            <h3 class="feature-title">Real Financial Data</h3>
            <p class="feature-desc">See exact costs per year for course materials, college tuition, certifications, and tools. Plan your budget or educational loan accurately.</p>
          </div>
          <div class="glass-card feature-card">
            <div class="feature-icon-wrapper">
              <svg class="icon-svg" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 10v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" fill="none"/></svg>
            </div>
            <h3 class="feature-title">Self-Paced Learning Guides</h3>
            <p class="feature-desc">Direct access to real YouTube video courses from verified creators. Organize your study goals on your own schedule.</p>
          </div>
        </div>
      </section>
    `;
  }

  getExplorerHtml() {
    const streams = ['Science', 'Commerce', 'Arts'];
    let html = `
      <div class="container">
        <div class="explorer-header">
          <h2 class="section-title">Career Pathway Explorer</h2>
          <p class="section-subtitle">Search or filter by stream to find your direction.</p>
        </div>
        
        <div class="explorer-controls">
          <div class="stream-filter-bar">
            <button class="filter-btn active" data-stream="all">All Streams</button>
            ${streams.map(s => `<button class="filter-btn" data-stream="${s}">${s}</button>`).join('')}
          </div>
          <div class="search-bar-wrapper">
            <svg class="icon-svg search-icon" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>
            <input type="text" class="search-input" id="search-careers" placeholder="Search careers (e.g. Computer Science, Dental, Corporate Law)...">
          </div>
        </div>

        <div id="explorer-groups-container">
          ${streams.map(stream => this.getStreamGroupHtml(stream)).join('')}
        </div>
      </div>
    `;
    return html;
  }

  getStreamGroupHtml(streamName) {
    const filteredCareers = this.careers.filter(c => c.stream === streamName);
    if (filteredCareers.length === 0) return '';

    const dotClass = `dot-${streamName.toLowerCase()}`;

    return `
      <div class="stream-group" id="stream-group-${streamName}">
        <h3 class="stream-group-title">
          <span class="stream-dot ${dotClass}"></span>
          ${streamName} Stream
        </h3>
        <div class="careers-grid">
          ${filteredCareers.map(career => {
            const specList = this.specializations.filter(s => s.careerId === career.id);
            return `
              <div class="glass-card career-card" onclick="app.toggleCareerSpecs('${career.id}')">
                <h4 class="career-card-title">${career.name}</h4>
                <p class="career-card-desc">${career.description}</p>
                <div class="spec-count-tag">
                  <svg viewBox="0 0 24 24" class="icon-svg" style="width:16px;height:16px;"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
                  ${specList.length} Specializations Mapped
                </div>
              </div>
              <div class="specializations-drawer" id="specs-drawer-${career.id}" style="display: none; grid-column: 1 / -1;">
                <h5 style="margin-bottom: 12px; font-weight:600; color: var(--text-medium);">Available Pathways under ${career.name}:</h5>
                <div class="spec-list-grid">
                  ${specList.map(spec => `
                    <div class="spec-item-card" onclick="event.stopPropagation(); location.hash = '#career/${spec.id}'">
                      <h6 class="spec-item-title">${spec.name}</h6>
                      <p class="spec-item-desc">${spec.description}</p>
                      <div class="spec-meta-flex">
                        <span>Duration: ${spec.duration}</span>
                        <span>Total Cost: ₹${spec.totalCost.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  toggleCareerSpecs(careerId) {
    const drawer = document.getElementById(`specs-drawer-${careerId}`);
    if (drawer) {
      const isHidden = drawer.style.display === 'none';
      drawer.style.display = isHidden ? 'grid' : 'none';
    }
  }

  setupExplorerEvents() {
    const search = document.getElementById('search-careers');
    const filters = document.querySelectorAll('.filter-btn');

    const runFilters = () => {
      const query = search.value.toLowerCase().trim();
      const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-stream');

      document.querySelectorAll('.stream-group').forEach(group => {
        const stream = group.id.replace('stream-group-', '');
        let streamMatches = (activeFilter === 'all' || stream === activeFilter);
        
        let matchingCards = 0;
        group.querySelectorAll('.career-card').forEach(card => {
          const title = card.querySelector('.career-card-title').textContent.toLowerCase();
          const desc = card.querySelector('.career-card-desc').textContent.toLowerCase();
          const matchesSearch = title.includes(query) || desc.includes(query);

          if (streamMatches && matchesSearch) {
            card.style.display = 'flex';
            matchingCards++;
          } else {
            card.style.display = 'none';
            const nextDrawer = card.nextElementSibling;
            if (nextDrawer && nextDrawer.classList.contains('specializations-drawer')) {
              nextDrawer.style.display = 'none';
            }
          }
        });

        if (streamMatches && (query === '' || matchingCards > 0)) {
          group.style.display = 'block';
        } else {
          group.style.display = 'none';
        }
      });
    };

    if (search) search.addEventListener('input', runFilters);
    filters.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filters.forEach(f => f.classList.remove('active'));
        e.target.classList.add('active');
        runFilters();
      });
    });
    
    if (this.routeParams.stream) {
      const activeFilterBtn = Array.from(filters).find(f => f.getAttribute('data-stream') === this.routeParams.stream);
      if (activeFilterBtn) {
        activeFilterBtn.click();
      }
    }
  }

  getCareerDetailsHtml(spec) {
    const starFilled = `<span style="color:var(--color-warning);">★</span>`;
    const starEmpty = `<span style="color:var(--text-muted);">☆</span>`;
    const stars = starFilled.repeat(Math.floor(spec.difficulty)) + starEmpty.repeat(5 - Math.floor(spec.difficulty));

    const tuitionCost = Math.round(spec.totalCost * 0.75);
    const resourcesCost = spec.totalCost - tuitionCost;

    const maxSalary = Math.max(spec.salary.year1, spec.salary.year3, spec.salary.year5);
    const yr1Pct = Math.round((spec.salary.year1 / maxSalary) * 100);
    const yr3Pct = Math.round((spec.salary.year3 / maxSalary) * 100);
    const yr5Pct = Math.round((spec.salary.year5 / maxSalary) * 100);

    return `
      <div class="container">
        <div class="breadcrumb">
          <a href="#explorer">Explorer</a> &gt; <span>${spec.name}</span>
        </div>

        <div class="career-detail-layout">
          <!-- Main Content -->
          <div>
            <div class="detail-main-header">
              <h1 class="detail-title">${spec.name}</h1>
              <p class="detail-desc">${spec.description}</p>
            </div>

            <!-- Fact Sheet Grid -->
            <div class="fact-sheet-grid">
              <div class="fact-card">
                <div class="fact-val">${spec.duration}</div>
                <div class="fact-lbl">Duration</div>
              </div>
              <div class="fact-card">
                <div class="fact-val">₹${spec.totalCost.toLocaleString('en-IN')}</div>
                <div class="fact-lbl">Est. Total Cost</div>
              </div>
              <div class="fact-card">
                <div class="fact-val" style="letter-spacing:1.5px;">${stars}</div>
                <div class="fact-lbl">Difficulty (1-5)</div>
              </div>
            </div>

            <!-- Financial Breakdown -->
            <div class="glass-card finances-card">
              <h3 style="font-family:var(--font-title); font-size:1.3rem; margin-bottom:16px;">Financial Breakdown</h3>
              <div class="cost-row">
                <span>Tuition Fees (Avg. India Colleges)</span>
                <span>₹${tuitionCost.toLocaleString('en-IN')}</span>
              </div>
              <div class="cost-row">
                <span>Materials, Tools, Cloud & Books</span>
                <span>₹${resourcesCost.toLocaleString('en-IN')}</span>
              </div>
              <div class="cost-bar-wrapper">
                <div class="cost-bar-fill" style="width: 75%;"></div>
              </div>
              <ul class="inclusion-list">
                <li>Estimated tuition is computed from public Indian government and private colleges averages.</li>
                <li>What costs cover: Course books, lab equipment, developer tools, certifications, and cloud sandbox credits where applicable.</li>
              </ul>
              <div class="cost-row cost-total-row">
                <span>Total Est. Investment</span>
                <span>₹${spec.totalCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <!-- Salary Progression -->
            <h3 class="detail-section-title">
              <svg viewBox="0 0 24 24" class="icon-svg" style="color:var(--color-success);"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>
              Salary Progression Trajectory
            </h3>
            <div class="salary-chart">
              <div class="salary-bar-group">
                <div class="salary-bar-lbl">
                  <span>Year 1 (Entry Level)</span>
                  <strong>₹${spec.salary.year1.toLocaleString('en-IN')} / Year</strong>
                </div>
                <div class="salary-bar-container">
                  <div class="salary-bar-fill" data-width="${yr1Pct}%" style="width: 0%;">₹${(spec.salary.year1 / 100000).toFixed(1)} Lakhs</div>
                </div>
              </div>
              <div class="salary-bar-group">
                <div class="salary-bar-lbl">
                  <span>Year 3 (Experienced)</span>
                  <strong>₹${spec.salary.year3.toLocaleString('en-IN')} / Year</strong>
                </div>
                <div class="salary-bar-container">
                  <div class="salary-bar-fill" data-width="${yr3Pct}%" style="width: 0%;">₹${(spec.salary.year3 / 100000).toFixed(1)} Lakhs</div>
                </div>
              </div>
              <div class="salary-bar-group">
                <div class="salary-bar-lbl">
                  <span>Year 5 (Senior Specialist)</span>
                  <strong>₹${spec.salary.year5.toLocaleString('en-IN')} / Year</strong>
                </div>
                <div class="salary-bar-container">
                  <div class="salary-bar-fill" data-width="${yr5Pct}%" style="width: 0%;">₹${(spec.salary.year5 / 100000).toFixed(1)} Lakhs</div>
                </div>
              </div>
              <p class="salary-trajectory-note">
                <strong>Growth Pathway:</strong> ${spec.salary.trajectory}
              </p>
            </div>

            <!-- Timeline / Curriculum -->
            <h3 class="detail-section-title">
              <svg viewBox="0 0 24 24" class="icon-svg" style="color:var(--color-primary);"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>
              Year-by-Year Career Roadmap
            </h3>
            <div class="timeline-list">
              ${spec.timeline.map((time, idx) => {
                const cur = spec.curriculum.find(c => c.year === time.year) || { subjects: 'Elective studies', skillsGained: 'Varies' };
                return `
                  <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-year">Year ${time.year}</div>
                    <h4 class="timeline-focus">${time.focus}</h4>
                    <p class="timeline-desc">${time.milestoneDescription}</p>
                    <div class="timeline-curriculum-panel">
                      <div class="curriculum-subjects"><strong>Subjects:</strong> ${cur.subjects}</div>
                      <div class="curriculum-skills"><strong>Key Skills Mastered:</strong> ${cur.skillsGained}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Prerequisites & Alternative paths -->
            <h3 class="detail-section-title">Prerequisites & Alternative PIVOT Paths</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:40px; text-align:left;">
              <div class="glass-card" style="padding:20px; border-left:4px solid var(--color-primary);">
                <h5 style="margin-bottom:8px; font-weight:700;">Prerequisites</h5>
                <p style="font-size:0.9rem; color:var(--text-muted);">${spec.prerequisites}</p>
              </div>
              <div class="glass-card" style="padding:20px; border-left:4px solid var(--color-accent);">
                <h5 style="margin-bottom:8px; font-weight:700;">Alternative Pivot Paths</h5>
                <p style="font-size:0.9rem; color:var(--text-muted);">${spec.alternatives}</p>
              </div>
            </div>
          </div>

          <!-- Sidebar Enrollment Actions -->
          <div class="sidebar-panel">
            <div class="glass-card" style="padding:24px;">
              <h3 class="sidebar-heading">
                <svg viewBox="0 0 24 24" class="icon-svg" style="color:var(--color-primary);"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>
                Enroll in Path
              </h3>
              <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:20px;">
                Lock in this specialization to track your checklist milestones, receive notifications, and access study guide videos.
              </p>
              <button class="btn btn-primary" style="width:100%; margin-bottom:20px;" onclick="app.enrollInPath('${spec.id}')">Start Learning Pathway</button>
              
              <ul class="sidebar-list">
                <li>
                  <svg viewBox="0 0 24 24" class="icon-svg" style="width:18px;height:18px;"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>
                  Get direct 4-phase checklists
                </li>
                <li>
                  <svg viewBox="0 0 24 24" class="icon-svg" style="width:18px;height:18px;"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>
                  Study on your own schedule
                </li>
                <li>
                  <svg viewBox="0 0 24 24" class="icon-svg" style="width:18px;height:18px;"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>
                  Apply to Top recruiters listed: ${spec.recruiters.slice(0, 3).join(', ')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  enrollInPath(specId) {
    if (!this.user) {
      this.showToast('Please sign in to enroll in a career path.', 'warning');
      location.hash = '#login';
      return;
    }

    const spec = CAREER_DATABASE.specializations.find(s => s.id === specId);
    if (!spec) return;

    const enrollmentKey = `neev_enrollment_${this.user.id}`;
    
    const defaultTasks = [
      { id: 't1', text: 'Review syllabus and curriculum overview', completed: false, category: 'Phase 1' },
      { id: 't2', text: 'Set study schedule in profile settings', completed: false, category: 'Phase 1' },
      { id: 't3', text: 'Read the prerequisite material list', completed: false, category: 'Phase 1' },
      { id: 't4', text: 'Join Discord student study group', completed: false, category: 'Phase 2' },
      { id: 't5', text: 'Complete first online fundamentals course module', completed: false, category: 'Phase 2' },
      { id: 't6', text: 'Build 1 basic mini-project for your portfolio', completed: false, category: 'Phase 2' },
      { id: 't7', text: 'Master core concepts using recommended video course', completed: false, category: 'Phase 3' },
      { id: 't8', text: 'Apply for internship positions on platform', completed: false, category: 'Phase 4' }
    ];

    const newEnrollment = {
      userId: this.user.id,
      specializationId: specId,
      enrolledAt: new Date().toISOString(),
      progressPercent: 0,
      currentPhase: 'Phase 1: Foundation',
      tasks: defaultTasks,
      specializationName: spec.name,
      careerName: spec.careerId === 'eng' ? 'Engineering' : spec.careerId === 'med' ? 'Medicine' : spec.careerId === 'ca' ? 'Chartered Accountancy' : spec.careerId,
      duration: spec.duration,
      cost: spec.totalCost
    };

    localStorage.setItem(enrollmentKey, JSON.stringify(newEnrollment));
    this.activeEnrollment = newEnrollment;
    
    this.showToast(`Enrolled successfully in ${spec.name}!`, 'success');
    location.hash = '#dashboard';
  }

  // Dashboard Views templates
  getDashboardUnenrolledHtml() {
    return `
      <div class="container text-center" style="padding: 60px 0;">
        <h2 style="font-family:var(--font-title); font-size:2.2rem; margin-bottom:12px;">Welcome to Neev, ${this.user.name}!</h2>
        <p style="color: var(--text-muted); margin-bottom:32px; max-width:550px; margin-left:auto; margin-right:auto;">
          You haven't enrolled in a career path yet. Explore our mapped careers under Science, Commerce, and Arts, pick a specialization, and click "Start Learning Pathway" to populate your dashboard checklist.
        </p>
        <a href="#explorer" class="btn btn-primary btn-lg">Explore Career Specializations</a>
      </div>
    `;
  }

  getDashboardHtml(data) {
    const { enrollment, youtubeVideos, notifications } = data;
    const tasks = this.isEditingTasks ? this.localTasks : enrollment.tasks;

    return `
      <div class="container">
        
        <!-- Header -->
        <div class="dash-header-section">
          <div class="dash-student-info">
            <h2>Welcome Back, ${this.user.name.split(' ')[0]}</h2>
            <p>School: ${this.user.school || 'Not specified'} | Stream: ${this.user.stream}</p>
          </div>
          <div>
            <span class="active-path-badge">${enrollment.specializationName} Pathway</span>
          </div>
        </div>

        <!-- Progress Metrics Card -->
        <div class="glass-card progress-card">
          <div class="progress-radial-wrapper">
            <svg class="progress-circle-svg">
              <circle class="circle-bg" cx="50" cy="50" r="40"></circle>
              <circle class="circle-fill" id="progress-circle-fill" cx="50" cy="50" r="40"></circle>
            </svg>
            <div class="radial-percentage">${enrollment.progressPercent}%</div>
          </div>
          <div class="progress-info">
            <div class="progress-heading">PATH PROGRESS REPORT (Self-Paced)</div>
            <div class="progress-current-phase">${enrollment.currentPhase}</div>
            <p style="color:var(--text-muted); font-size:0.9rem; margin-top:8px;">
              ${this.isEditingTasks ? 'You are currently customizing your tasks list. Click Save to apply changes.' : `Complete tasks below to level up. Next milestone is unlocked at ${enrollment.progressPercent >= 75 ? '100% (Completed)' : enrollment.progressPercent >= 50 ? '75% (Phase 4)' : enrollment.progressPercent >= 25 ? '50% (Phase 3)' : '25% (Phase 2)'}.`}
            </p>
          </div>
          <div>
            <a href="#explorer" class="btn btn-sm btn-outline">Change Path</a>
          </div>
        </div>

        <!-- Main Dashboard Split -->
        <div class="dashboard-grid">
          
          <!-- Left: Tasks Checklist -->
          <div>
            <div class="glass-card checklist-card">
              <div class="checklist-title-bar">
                <h3 class="checklist-title">My Learning Tasks</h3>
                <div class="checklist-action-buttons">
                  ${this.isEditingTasks ? `
                    <button class="btn btn-sm btn-primary" onclick="app.saveTasksUpdated()">Save Changes</button>
                    <button class="btn btn-sm btn-outline" onclick="app.toggleTaskEditMode()">Cancel</button>
                  ` : `
                    <button class="btn btn-sm btn-outline" onclick="app.toggleTaskEditMode()">Edit Checklist</button>
                    <span class="badge badge-info" id="checklist-counter">${tasks.filter(t => t.completed).length} / ${tasks.length} Completed</span>
                  `}
                </div>
              </div>
              
              <div class="task-list">
                ${this.isEditingTasks ? 
                  tasks.map(task => `
                    <div class="task-item" style="cursor: default; display: flex; align-items: center; gap: 10px;">
                      <div class="task-edit-row">
                        <input type="text" class="task-edit-input" data-id="${task.id}" value="${task.text}" placeholder="Add task details...">
                        <button class="task-delete-btn" onclick="app.deleteTaskLocal('${task.id}')" title="Delete Task">×</button>
                      </div>
                    </div>
                  `).join('') + `<button class="task-add-btn" onclick="app.addTaskLocal()">+ Add Custom Study Task</button>`
                :
                  tasks.map(task => `
                    <div class="task-item ${task.completed ? 'completed' : ''}" onclick="app.toggleTask('${task.id}')">
                      <div class="task-checkbox-wrapper">
                        <svg viewBox="0 0 24 24" class="check-icon"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/></svg>
                      </div>
                      <div class="task-content">
                        <span class="task-text">${task.text}</span>
                        <br>
                        <span class="task-phase-tag">${task.category}</span>
                      </div>
                    </div>
                  `).join('')
                }
              </div>
            </div>

            <!-- Profile Settings Panel -->
            <div class="glass-card">
              <h3 class="checklist-title" style="margin-bottom:20px;">Pathway Plan Settings</h3>
              <form class="settings-form" id="settings-form">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                  <div class="form-group">
                    <label class="form-label">Preferred Daily Study Time</label>
                    <input type="time" class="form-input" name="preferredStudyTime" value="${this.user.settings.preferredStudyTime || '14:00'}">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Goal Completion Date</label>
                    <input type="date" class="form-input" name="goalDate" value="${this.user.settings.goalDate || ''}">
                  </div>
                </div>
                <div class="form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" name="emailNotifications" ${this.user.settings.emailNotifications ? 'checked' : ''}>
                    Receive weekly email progress summary
                  </label>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="checkbox-label">
                    <input type="checkbox" name="weeklySummary" ${this.user.settings.weeklySummary ? 'checked' : ''}>
                    Enable SMS reminder notifications
                  </label>
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Save Pathway Settings</button>
              </form>
            </div>
          </div>

          <!-- Right Sidebar: YouTube & Notification board -->
          <div>
            <!-- Video Guides -->
            <div class="glass-card" style="margin-bottom:32px;">
              <h3 class="sidebar-heading" style="margin-bottom:16px;">
                <svg viewBox="0 0 24 24" class="icon-svg" style="color:var(--color-danger);"><path d="M23 12a11 11 0 11-22 0 11 11 0 0122 0z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 8.5l6 3.5-6 3.5v-7z" fill="currentColor"/></svg>
                Study Video Guides
              </h3>
              <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px;">Real courses & lectures related to your study topic.</p>
              
              <div class="youtube-list">
                ${youtubeVideos.map(video => `
                  <div class="youtube-card" onclick="window.open('${video.url}', '_blank')">
                    <div class="video-thumbnail-wrapper">
                      <img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" alt="${video.title}" class="video-thumbnail">
                      <div class="play-icon-overlay">
                        <svg viewBox="0 0 24 24" style="width:20px;height:20px;" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                    <div class="video-info">
                      <span class="video-channel">${video.channel}</span>
                      <h4 class="video-title">${video.title}</h4>
                      <p class="video-desc">${video.description}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Notifications Center -->
            <div class="glass-card">
              <h3 class="sidebar-heading" style="margin-bottom:16px;">Updates & Inbox</h3>
              <div>
                ${notifications.length === 0 ? `
                  <p style="font-size:0.85rem; color:var(--text-muted); text-align:center; padding:12px 0;">No new notifications.</p>
                ` : notifications.map(notif => `
                  <div class="notification-item">
                    <div class="notification-text">${notif.text}</div>
                    <div class="notification-date">${notif.date}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // Task list editing controls
  toggleTaskEditMode() {
    this.isEditingTasks = !this.isEditingTasks;
    if (this.isEditingTasks) {
      this.localTasks = JSON.parse(JSON.stringify(this.activeEnrollment.tasks));
    }
    this.renderView();
  }

  addTaskLocal() {
    this.syncLocalChecklistInputs();
    this.localTasks.push({
      id: 't_new_' + Date.now() + '_' + Math.floor(Math.random() * 100),
      text: '',
      completed: false,
      category: this.activeEnrollment.currentPhase
    });
    this.renderView();
  }

  deleteTaskLocal(taskId) {
    this.syncLocalChecklistInputs();
    this.localTasks = this.localTasks.filter(t => t.id !== taskId);
    this.renderView();
  }

  syncLocalChecklistInputs() {
    const inputs = document.querySelectorAll('.task-edit-input');
    inputs.forEach(input => {
      const id = input.getAttribute('data-id');
      const task = this.localTasks.find(t => t.id === id);
      if (task) {
        task.text = input.value.trim();
      }
    });
  }

  saveTasksUpdated() {
    this.syncLocalChecklistInputs();
    const finalTasks = this.localTasks.filter(t => t.text !== '');

    this.activeEnrollment.tasks = finalTasks;

    // Recalculate progress
    const total = finalTasks.length;
    const completed = finalTasks.filter(t => t.completed).length;
    this.activeEnrollment.progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Update phase
    if (this.activeEnrollment.progressPercent <= 25) {
      this.activeEnrollment.currentPhase = 'Phase 1: Foundation';
    } else if (this.activeEnrollment.progressPercent <= 50) {
      this.activeEnrollment.currentPhase = 'Phase 2: Core Concepts';
    } else if (this.activeEnrollment.progressPercent <= 75) {
      this.activeEnrollment.currentPhase = 'Phase 3: Specialization Niche';
    } else {
      this.activeEnrollment.currentPhase = 'Phase 4: Internship & Capstone';
    }

    const enrollmentKey = `neev_enrollment_${this.user.id}`;
    localStorage.setItem(enrollmentKey, JSON.stringify(this.activeEnrollment));

    this.isEditingTasks = false;
    this.showToast('Checklist updated successfully!', 'success');
    this.renderView();
  }

  toggleTask(taskId) {
    if (!this.activeEnrollment) return;
    
    const updatedTasks = this.activeEnrollment.tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });

    this.activeEnrollment.tasks = updatedTasks;

    // Recalculate progress
    const total = updatedTasks.length;
    const completed = updatedTasks.filter(t => t.completed).length;
    this.activeEnrollment.progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Update phase
    if (this.activeEnrollment.progressPercent <= 25) {
      this.activeEnrollment.currentPhase = 'Phase 1: Foundation';
    } else if (this.activeEnrollment.progressPercent <= 50) {
      this.activeEnrollment.currentPhase = 'Phase 2: Core Concepts';
    } else if (this.activeEnrollment.progressPercent <= 75) {
      this.activeEnrollment.currentPhase = 'Phase 3: Specialization Niche';
    } else {
      this.activeEnrollment.currentPhase = 'Phase 4: Internship & Capstone';
    }

    const enrollmentKey = `neev_enrollment_${this.user.id}`;
    localStorage.setItem(enrollmentKey, JSON.stringify(this.activeEnrollment));

    this.renderView();
  }

  setupDashboardEvents() {
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(settingsForm);
        
        // Update user settings
        this.user.settings = {
          preferredStudyTime: formData.get('preferredStudyTime') || this.user.settings.preferredStudyTime,
          goalDate: formData.get('goalDate') || this.user.settings.goalDate,
          emailNotifications: settingsForm.querySelector('[name="emailNotifications"]').checked,
          weeklySummary: settingsForm.querySelector('[name="weeklySummary"]').checked
        };

        // Save back to local storage list
        const usersRaw = localStorage.getItem('neev_users');
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        const index = users.findIndex(u => u.id === this.user.id);
        
        if (index !== -1) {
          users[index] = this.user;
          localStorage.setItem('neev_users', JSON.stringify(users));
        }

        this.showToast('Settings saved successfully.', 'success');
        this.loadDashboardData();
      });
    }
  }

  // Apple Luxury visual additions
  initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const circle = document.getElementById('cursor-circle');
    if (!dot || !circle) return;

    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;
    let dotX = 0, dotY = 0;
    let cursorActive = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursorActive) {
        dot.style.display = 'block';
        circle.style.display = 'block';
        cursorActive = true;
      }
    });

    const tick = () => {
      circleX += (mouseX - circleX) * 0.15;
      circleY += (mouseY - circleY) * 0.15;
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;

      circle.style.left = `${circleX}px`;
      circle.style.top = `${circleY}px`;
      dot.style.left = `${dotX}px`;
      dot.style.top = `${dotY}px`;

      requestAnimationFrame(tick);
    };
    tick();

    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a, button, select, input, textarea, .btn, .career-card, .spec-item-card, .logo-area, .task-item');
      if (target) {
        circle.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('a, button, select, input, textarea, .btn, .career-card, .spec-item-card, .logo-area, .task-item');
      if (target) {
        circle.classList.remove('cursor-hover');
      }
    });
  }

  initThreeJS() {
    const container = document.getElementById('three-bg');
    if (!container || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 32;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Particle constellation
    const particlesCount = 280;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const colorPalette = [
      new THREE.Color('#4f46e5'), // Indigo
      new THREE.Color('#7c3aed'), // Violet
      new THREE.Color('#0891b2')  // Teal-cyan
    ];

    for (let i = 0; i < particlesCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 18 + Math.random() * 24;

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
      return new THREE.CanvasTexture(canvas);
    };

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.9,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      map: createCircleTexture(),
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    const icoGeometry = new THREE.IcosahedronGeometry(7, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: 0x4f46e5,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
    });
    const centralMesh = new THREE.Mesh(icoGeometry, icoMaterial);
    scene.add(centralMesh);

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) / 80;
      targetMouseY = (e.clientY - window.innerHeight / 2) / 80;
    });

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      particleSystem.rotation.y = elapsedTime * 0.02;
      particleSystem.rotation.x = elapsedTime * 0.01;

      centralMesh.rotation.y = -elapsedTime * 0.04;
      centralMesh.rotation.z = elapsedTime * 0.015;

      const scaleVal = 1 + Math.sin(elapsedTime * 1.2) * 0.05;
      centralMesh.scale.set(scaleVal, scaleVal, scaleVal);

      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      camera.position.x = currentMouseX;
      camera.position.y = -currentMouseY;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  initTilt() {
    const cardsSelector = '.career-card, .spec-item-card, .youtube-card, .feature-card';
    
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest(cardsSelector);
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const midX = rect.width / 2;
      const midY = rect.height / 2;

      const rotateY = ((x - midX) / midX) * 12;
      const rotateX = -((y - midY) / midY) * 12;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });

    document.addEventListener('mouseout', (e) => {
      const card = e.target.closest(cardsSelector);
      if (!card) return;
      
      const nextTarget = e.relatedTarget;
      if (!nextTarget || !card.contains(nextTarget)) {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      }
    });
  }

  // Auth Forms Logic (Local Storage)
  getLoginHtml() {
    return `
      <div class="container auth-page-container">
        <div class="glass-card auth-card">
          <div class="auth-header">
            <h2 class="auth-title">Welcome Back</h2>
            <p class="auth-subtitle">Sign in to track your career roadmap progress.</p>
          </div>
          <form id="login-form">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" name="email" required placeholder="name@school.com">
            </div>
            <div class="form-group" style="margin-bottom: 24px;">
              <label class="form-label">Password</label>
              <input type="password" class="form-input" name="password" required placeholder="••••••••">
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px;">Sign In</button>
          </form>
          <div class="auth-footer-text">
            Don't have an account? <a href="#register">Get Started Free</a>
          </div>
        </div>
      </div>
    `;
  }

  getRegisterHtml() {
    return `
      <div class="container auth-page-container">
        <div class="glass-card auth-card">
          <div class="auth-header">
            <h2 class="auth-title">Create Free Account</h2>
            <p class="auth-subtitle">Get custom checklists, timelines, and study planners.</p>
          </div>
          <form id="register-form">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-input" name="fullname" required placeholder="Rahul Kumar">
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" name="email" required placeholder="name@school.com">
            </div>
            <div class="form-group">
              <label class="form-label">Mobile Phone Number</label>
              <input type="tel" class="form-input" name="phone" placeholder="9876543210">
            </div>
            <div class="form-group">
              <label class="form-label">School / Boarding Center</label>
              <input type="text" class="form-input" name="school" placeholder="e.g. St. Pauls, Belgaum">
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">12th Stream</label>
                <select class="form-input" name="stream" required>
                  <option value="Science">Science (PCM/PCB)</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Arts & Humanities</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" class="form-input" name="password" required placeholder="Min 6 characters">
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; margin-top: 10px;">Sign Up</button>
          </form>
          <div class="auth-footer-text">
            Already have an account? <a href="#login">Sign In</a>
          </div>
        </div>
      </div>
    `;
  }

  setupLoginEvents() {
    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.email.value.trim().toLowerCase();
        const password = form.password.value;

        const usersRaw = localStorage.getItem('neev_users');
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        const user = users.find(u => u.email.toLowerCase() === email && u.password === password);

        if (user) {
          this.token = user.id;
          this.user = user;
          localStorage.setItem('cf_token', user.id);
          this.updateNavState();
          this.showToast('Logged in successfully!', 'success');
          location.hash = '#dashboard';
        } else {
          this.showToast('Invalid email or password.', 'error');
        }
      });
    }
  }

  setupRegisterEvents() {
    const form = document.getElementById('register-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.fullname.value.trim();
        const email = form.email.value.trim().toLowerCase();
        const phone = form.phone.value.trim();
        const school = form.school.value.trim();
        const stream = form.stream.value;
        const password = form.password.value;

        const usersRaw = localStorage.getItem('neev_users');
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        const existing = users.find(u => u.email.toLowerCase() === email);

        if (existing) {
          this.showToast('An account with this email already exists.', 'error');
          return;
        }

        const newUser = {
          id: 'user_' + Date.now() + '_' + Math.floor(Math.random() * 100),
          name,
          email,
          phone,
          school,
          stream,
          password, // Stored locally for mock verification
          createdAt: new Date().toISOString(),
          settings: {
            emailNotifications: true,
            weeklySummary: true,
            preferredStudyTime: '14:00',
            goalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        };

        users.push(newUser);
        localStorage.setItem('neev_users', JSON.stringify(users));

        this.token = newUser.id;
        this.user = newUser;
        localStorage.setItem('cf_token', newUser.id);
        
        this.updateNavState();
        this.showToast('Account created successfully!', 'success');
        location.hash = '#dashboard';
      });
    }
  }
}

// Global App Instance
const app = new NeevApp();
