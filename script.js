document.addEventListener('DOMContentLoaded', function () {
  // 1. Dynamic Year in Footer
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------
  // 2. INFINITE MARQUEE CLONER (Pure CSS Seamless Loop)
  // -------------------------------------------------------------
  var stackTrack = document.getElementById('stack-track');
  var stackSource = document.getElementById('stack-source');
  if (stackTrack && stackSource) {
    // Gandakan satu grup yang persis sama untuk loop seamless murni (50% translation)
    var cloneGroup = stackSource.cloneNode(true);
    cloneGroup.removeAttribute('id');
    cloneGroup.setAttribute('aria-hidden', 'true');
    stackTrack.appendChild(cloneGroup);
  }

  // -------------------------------------------------------------
  // 3. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // -------------------------------------------------------------
  var revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('active');
    });
  }

  // -------------------------------------------------------------
  // 4. SPOTLIGHT MOUSE GLOW EFFECT (Interactive hover on project cards)
  // -------------------------------------------------------------
  var pointerGlow = document.querySelector('.pointer-glow');
  if (pointerGlow) {
    window.addEventListener('pointermove', function (e) {
      pointerGlow.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px) translate(-50%, -50%)';
    });
  }

  var projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });

  // -------------------------------------------------------------
  // 5. CONTACT FORM SUBMIT (Support Vercel & Web3Forms/Mailto)
  // -------------------------------------------------------------
  var formEl = document.getElementById('contact-form');
  if (formEl) {
    formEl.addEventListener('submit', function (e) {
      e.preventDefault();

      var statusEl = document.getElementById('form-status');
      var submitBtn = formEl.querySelector('button[type="submit"]');

      var nameInput = document.getElementById('name');
      var emailInput = document.getElementById('email');
      var messageInput = document.getElementById('message');

      var name = nameInput ? nameInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var message = messageInput ? messageInput.value.trim() : '';

      if (statusEl) {
        statusEl.className = '';
        statusEl.textContent = 'Mengirim pesan...';
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim...';
      }

      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler(function (res) {
            if (statusEl) {
              statusEl.className = 'success';
              statusEl.textContent = res.message;
            }
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Kirim Pesan';
            }
            if (res.status === 'success') {
              formEl.reset();
            }
          })
          .withFailureHandler(function (err) {
            if (statusEl) {
              statusEl.className = 'error';
              statusEl.textContent = 'Gagal mengirim: ' + err.message;
            }
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Kirim Pesan';
            }
          })
          .sendContactMessage({ name: name, email: email, message: message });
      } else {
        setTimeout(function () {
          if (statusEl) {
            statusEl.className = 'success';
            statusEl.textContent = '✓ Terima kasih ' + (name || '') + '! Membuka email client kamu...';
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Terkirim ✓';
          }

          var subject = encodeURIComponent('Pesan Portofolio dari ' + name);
          var body = encodeURIComponent('Halo Ivan,\n\n' + message + '\n\n--\nDari: ' + name + ' (' + email + ')');
          window.location.href = 'mailto:ivanedsr@gmail.com?subject=' + subject + '&body=' + body;

          setTimeout(function () {
            formEl.reset();
            if (submitBtn) submitBtn.textContent = 'Kirim Pesan';
          }, 3500);
        }, 600);
      }
    });
  }

  // -------------------------------------------------------------
  // 6. SMOOTH SCROLLING WITH ACCELERATION CURVE
  // -------------------------------------------------------------
  function smoothScrollTo(targetY, duration) {
    var startY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    var distance = targetY - startY;
    if (Math.abs(distance) < 5) return;

    var startTime = null;

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      var timeElapsed = currentTime - startTime;
      var progress = Math.min(timeElapsed / duration, 1);

      var ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      var currentPos = startY + (distance * ease);
      window.scrollTo(0, currentPos);
      document.documentElement.scrollTop = currentPos;
      document.body.scrollTop = currentPos;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  var navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href) return;

      var targetY = 0;
      if (href === '#' || href === '#about') {
        targetY = 0;
      } else if (href.length > 1) {
        var targetEl = document.getElementById(href.substring(1));
        if (!targetEl) return;
        var rect = targetEl.getBoundingClientRect();
        var currentY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        targetY = currentY + rect.top - 75;
      }

      e.preventDefault();
      smoothScrollTo(targetY, 650);
    });
  });

  // -------------------------------------------------------------
  // 7. PROJECT DATA & CASE STUDY MODAL
  // -------------------------------------------------------------
  var caseStudies = {
    lifevest: {
      category: 'Web application',
      title: 'Life Vest Tracker — PT GMF AeroAsia',
      problem: 'Pencatatan manual membuat riwayat perawatan, masa berlaku, dan lokasi life vest sulit ditelusuri saat dibutuhkan.',
      solution: 'Saya membuat aplikasi Laravel dengan MySQL untuk menyimpan data unit, lokasi, riwayat inspeksi, dan tanggal kedaluwarsa dalam satu tempat.',
      features: [
        'Data unit: Nomor part, serial number, dan status setiap life vest.',
        'Lokasi: Pemetaan unit berdasarkan armada dan posisi kabin.',
        'Jadwal inspeksi: Penanda untuk unit yang mendekati masa perawatan atau kedaluwarsa.',
        'Riwayat aktivitas: Catatan inspeksi dan perubahan data oleh teknisi.',
        'Laporan: Ringkasan inventaris dan status unit.'
      ],
      tags: ['Laravel', 'PHP', 'Blade', 'MySQL', 'Relational Database', 'Asset Tracking', 'MRO System'],
      actions: [
        { label: 'Repositori GitHub &rarr;', url: 'https://github.com/ragepanz/lifevest-laravel', primary: true }
      ]
    },
    certification: {
      category: 'Web platform',
      title: 'Certification Dashboard Platform',
      problem: 'Arsip sertifikat fisik atau file terpisah menyulitkan orang lain untuk mengecek keaslian dokumen secara cepat.',
      solution: 'Saya membuat web berbasis PHP dan Vercel agar setiap sertifikat punya tautan publik yang bisa diakses langsung untuk verifikasi.',
      features: [
        'Cek sertifikat: Verifikasi dokumen menggunakan kode atau ID unik.',
        'Pencarian: Menemukan data sertifikat dengan cepat.',
        'Tampilan cetak: Format halaman yang rapi saat dicetak atau disimpan ke PDF.',
        'Hosting: Dijalankan di serverless Vercel agar cepat diakses.'
      ],
      tags: ['PHP', 'Blade', 'Vercel Serverless', 'Cloud Deployment', 'Credential Verification', 'CSS3'],
      actions: [
        { label: 'Buka Web Live &rarr;', url: 'https://certification-dashboard-nine.vercel.app', primary: true },
        { label: 'Repositori GitHub', url: 'https://github.com/ragepanz/certification-dashboard', primary: false }
      ]
    },
    ldnd: {
      category: 'Product catalog',
      title: 'LDND Carpet — Next.js & TypeScript',
      problem: 'Katalog produk butuh loading cepat dan gambar berkualitas tinggi tanpa bikin web lambat.',
      solution: 'Saya pakai Next.js dan TypeScript agar komponen terstruktur, gambar otomatis dioptimasi, dan navigasi terasa smooth.',
      features: [
        'Komponen React: Terorganisir dengan TypeScript untuk menghindari error.',
        'Gambar: Otomatis dikompress dan lazy-load dengan Next/Image.',
        'Navigasi: Pindah halaman tanpa reload penuh.',
        'Styling: Tailwind CSS untuk tampilan yang responsif.'
      ],
      tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel', 'SSR', 'Web Performance'],
      actions: [
        { label: 'Buka Web Live &rarr;', url: 'https://ldnd-carpet-next.vercel.app/', primary: true },
        { label: 'Repositori GitHub', url: 'https://github.com/ragepanz/ldnd-carpet-next', primary: false }
      ]
    },
    ticketing: {
      category: 'Internal application',
      title: 'Project Ticketing / Helpdesk System',
      problem: 'Penanganan tiket tugas antar divisi tidak terpusat sehingga status pekerjaan sulit dipantau.',
      solution: 'Saya buat aplikasi Laravel yang mengelola siklus tiket dari awal sampai selesai, dengan catatan log untuk setiap perubahan.',
      features: [
        'Status tiket: Dari open sampai closed dengan transisi yang terstruktur.',
        'Prioritas: Klasifikasi tingkat urgensi untuk menangani masalah penting lebih dulu.',
        'Log aktivitas: Riwayat update, catatan, dan lampiran file untuk setiap tiket.',
        'Dashboard: Melihat antrean dan beban kerja tim secara langsung.'
      ],
      tags: ['Laravel', 'PHP', 'Blade', 'MySQL', 'Helpdesk Workflow', 'State Management', 'RBAC'],
      actions: [
        { label: 'Repositori GitHub &rarr;', url: 'https://github.com/ragepanz/project_ticketing', primary: true }
      ]
    }
  };

  var modalOverlay = document.getElementById('case-study-modal');
  var modalCloseBtn = document.getElementById('modal-close-btn');

  function openCaseStudy(key) {
    var data = caseStudies[key];
    if (!data || !modalOverlay) return;

    document.getElementById('modal-category').textContent = data.category;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-problem').textContent = data.problem;
    document.getElementById('modal-solution').textContent = data.solution;

    var featuresList = document.getElementById('modal-features');
    featuresList.innerHTML = '';
    data.features.forEach(function (feat) {
      var li = document.createElement('li');
      var colonIdx = feat.indexOf(':');
      if (colonIdx !== -1) {
        var label = feat.substring(0, colonIdx);
        var desc = feat.substring(colonIdx + 1);
        li.innerHTML = '<strong style="color: var(--ink); font-weight: 600;">' + label + ':</strong>' + desc;
      } else {
        li.textContent = feat;
      }
      featuresList.appendChild(li);
    });

    var tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = '';
    data.tags.forEach(function (tag) {
      var span = document.createElement('span');
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });

    var footer = document.getElementById('modal-footer');
    footer.innerHTML = '';
    data.actions.forEach(function (act) {
      var a = document.createElement('a');
      a.href = act.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = act.primary ? 'btn btn-primary' : 'btn btn-outline';
      a.innerHTML = act.label;
      footer.appendChild(a);
    });

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn btn-outline';
    closeBtn.textContent = 'Tutup';
    closeBtn.addEventListener('click', closeCaseStudy);
    footer.appendChild(closeBtn);

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseStudy() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  projectCards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      var key = this.getAttribute('data-project');
      if (key) openCaseStudy(key);
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var key = this.getAttribute('data-project');
        if (key) openCaseStudy(key);
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeCaseStudy);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        closeCaseStudy();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeCaseStudy();
    }
  });
});
