document.addEventListener('DOMContentLoaded', function () {
  // 1. Dynamic Year in Footer
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------
  // 2. INFINITE MARQUEE CLONER (Smooth Seamless Loop)
  // -------------------------------------------------------------
  var stackTrack = document.getElementById('stack-track');
  var stackSource = document.getElementById('stack-source');
  if (stackTrack && stackSource) {
    stackSource.innerHTML += stackSource.innerHTML;
    for (var i = 0; i < 2; i++) {
      var cloneGroup = stackSource.cloneNode(true);
      cloneGroup.removeAttribute('id');
      cloneGroup.setAttribute('aria-hidden', 'true');
      stackTrack.appendChild(cloneGroup);
    }
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
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(function (el) {
      el.classList.add('active');
    });
  }

  // -------------------------------------------------------------
  // 4. SPOTLIGHT MOUSE GLOW EFFECT (Interactive hover on project cards)
  // -------------------------------------------------------------
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
  // 5. CONTACT FORM SUBMIT (Support Vercel & Web3Forms/Formspree/Mailto)
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

      // Check if running on Google Apps Script environment
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
        // Fallback for Vercel deployment: opens mailto direct compose or handles client-side form response
        setTimeout(function () {
          if (statusEl) {
            statusEl.className = 'success';
            statusEl.textContent = '✓ Terima kasih ' + (name || '') + '! Membuka email client kamu...';
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Terkirim ✓';
          }

          // Open prefilled email client
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

      // EaseInOutCubic curve
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
      category: 'Enterprise Asset Management & Maintenance',
      title: 'Life Vest Tracker — PT GMF AeroAsia',
      problem: 'Dalam industri Maintenance, Repair, and Overhaul (MRO) aviasi, pelampung keselamatan (life vest) wajib mematuhi standar kelaikan udara (airworthiness) dengan jadwal inspeksi berkala yang ketat. Proses pencatatan manual berbasis spreadsheet memiliki risiko human error yang tinggi, potensi terlewatnya batas masa berlaku (expiry date), serta sulitnya penelusuran histori pemeliharaan saat proses audit kelaikan terbang.',
      solution: 'Mengembangkan sistem informasi pelacakan siklus hidup komponen keselamatan terpusat berbasis web menggunakan Laravel MVC dan database relasional MySQL. Arsitektur data dirancang untuk memetakan hierarki armada (Aircraft Tail Number), nomor part & serial number, lokasi rak/kabin pesawat, serta otomasi kalkulasi tanggal kedaluwarsa dan verifikasi teknisi.',
      features: [
        'Lifecycle & Expiry Tracking: Kalkulasi otomatis sisa masa pakai (life limit) komponen pelampung dengan sistem indikator status kelaikan.',
        'Aircraft Cabin Mapping: Pemetaan lokasi fisik unit per armada pesawat (tail number & baris kursi kabin) untuk efisiensi rotasi dan penggantian komponen.',
        'Preventative Inspection Alert: Sistem peringatan otomatis sebelum unit life vest mendekati ambang batas masa inspeksi rutin (overhaul).',
        'Audit Trail & Verification: Pencatatan rekam jejak digital mencakup teknisi penanggung jawab, tanggal servis, nomor sertifikasi, dan log inspeksi untuk kebutuhan audit regulasi aviasi.',
        'Reporting Engine: Pembuatan rekap laporan status inventaris dan kelaikan armada secara real-time untuk tim operasional dan quality assurance.'
      ],
      tags: ['Laravel', 'PHP', 'Blade', 'MySQL', 'Relational Database', 'Asset Tracking', 'MRO System'],
      actions: [
        { label: 'Repositori GitHub &rarr;', url: 'https://github.com/ragepanz/lifevest-laravel', primary: true }
      ]
    },
    certification: {
      category: 'Digital Credential & Verification Engine',
      title: 'Certification Dashboard Platform',
      problem: 'Pengelolaan arsip sertifikat kompetensi dan lisensi dalam format dokumen terpisah menyulitkan proses validasi keaslian dokumen oleh pihak ketiga, rentan manipulasi data, dan tidak memiliki direktori pencarian publik yang cepat serta terverifikasi.',
      solution: 'Merancang arsitektur platform arsip dan verifikasi sertifikat digital terpusat. Menggunakan mekanisme validasi berbasis ID lisensi unik dengan frontend berbasis PHP/Blade yang dioptimasi untuk deployment serverless di cloud infrastructure Vercel, memastikan waktu muat halaman mendekati instan dan tanpa latency.',
      features: [
        'Public Certificate Verification: Mesin pencarian dan validasi keabsahan dokumen publik menggunakan kode identitas / UUID sertifikat unik.',
        'Centralized Search & Filter Index: Dashboard pengindeksan data sertifikat dengan performa penelusuran cepat berdasarkan nama, bidang sertifikasi, atau tanggal penerbitan.',
        'Responsive Print-Ready Output: Antarmuka pratinjau sertifikat digital yang adaptif dan terstandarisasi untuk kebutuhan cetak maupun ekspor berkas.',
        'Serverless Cloud Architecture: Deployment teroptimasi di Vercel dengan manajemen rute modern untuk menjamin ketersediaan tinggi (high availability).'
      ],
      tags: ['PHP', 'Blade', 'Vercel Serverless', 'Cloud Deployment', 'Credential Verification', 'CSS3'],
      actions: [
        { label: 'Buka Web Live &rarr;', url: 'https://certification-dashboard-nine.vercel.app', primary: true },
        { label: 'Repositori GitHub', url: 'https://github.com/ragepanz/certification-dashboard', primary: false }
      ]
    },
    ldnd: {
      category: 'Modern Web Architecture & E-Commerce Catalog',
      title: 'LDND Carpet — Next.js & TypeScript',
      problem: 'Katalog produk modern membutuhkan penyajian visual aset beresolusi tinggi dengan interaksi pengguna yang mulus, namun sering kali terkendala waktu muat halaman yang lambat, bundle size yang berat, dan struktur data yang rawan error pada aplikasi berskala besar.',
      solution: 'Membangun aplikasi web berperforma tinggi menggunakan framework Next.js (App Router) berbasis TypeScript untuk menjamin type-safety. Memanfaatkan fitur Server-Side Rendering (SSR) dan Incremental Static Regeneration (ISR) guna menghasilkan performa loading optimal dan indeks SEO yang kuat.',
      features: [
        'Type-Safe Component Architecture: Struktur komponen UI React modular dan scalable dengan pengetikan ketat TypeScript.',
        'Image Optimization Pipeline: Pemanfaatan Next/Image untuk lazy-loading otomatis, kompresi format WebP/AVIF modern, dan pencegahan Cumulative Layout Shift (CLS).',
        'Instant Page Transition: Navigasi katalog produk tanpa refresh halaman penuh (Single Page Experience) dengan prefetching rute bawaan Next.js.',
        'Tailwind CSS Design Tokens: Sistem styling berbasis atomic CSS yang terorganisir, responsif di segala ukuran layar, dan bersih dari CSS bloat.'
      ],
      tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel', 'SSR', 'Web Performance'],
      actions: [
        { label: 'Buka Web Live &rarr;', url: 'https://ldnd-carpet-next.vercel.app/', primary: true },
        { label: 'Repositori GitHub', url: 'https://github.com/ragepanz/ldnd-carpet-next', primary: false }
      ]
    },
    ticketing: {
      category: 'Internal Operations & Helpdesk Workflow',
      title: 'Project Ticketing / Helpdesk System',
      problem: 'Penanganan insiden teknis dan tiket operasional antar divisi yang berjalan tanpa sistem terpusat sering menimbulkan tumpang tindih penugasan, hilangnya visibilitas status penyelesaian, dan tidak adanya metrik Service Level Agreement (SLA) yang terukur.',
      solution: 'Mengembangkan aplikasi helpdesk workflow management menggunakan framework Laravel. Sistem mengimplementasikan Finite State Machine untuk transisi status tiket yang ketat, matriks prioritas berdasarkan urgensi masalah, serta sistem pencatatan log aktivitas terperinci pada setiap pembaruan tiket.',
      features: [
        'Role & Workflow State Machine: Manajemen siklus hidup tiket terstruktur mulai dari Open, Triage, In Progress, Resolved, hingga Closed.',
        'Priority & Categorization Matrix: Klasifikasi tiket berdasarkan tingkat urgensi insiden untuk memprioritaskan penyelesaian issue kritis terlebih dahulu.',
        'Activity Timeline & Threaded Notes: Rekam jejak kronologis setiap perubahan status, lampiran teknis, dan catatan komunikasi teknisi dalam satu tampilan terpadu.',
        'Operational Dashboard: Visualisasi jumlah antrean tiket dan performa penyelesaian tugas untuk monitoring beban kerja tim.'
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
