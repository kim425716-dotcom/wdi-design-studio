/* =====================================================
   WDI DESIGN STUDIO — SHARED JAVASCRIPT
   ===================================================== */

(function () {
  'use strict';

  /* ─── NAV: scroll behaviour ─────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── NAV: mobile hamburger ──────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      // Animate bars
      const spans = hamburger.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
      // Prevent body scroll
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── SCROLL REVEAL ──────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.02, rootMargin: '60px 0px 60px 0px' });
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      } else {
        io.observe(el);
      }
    });
  }

  /* ─── COUNTER ANIMATION ──────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          let start = 0;
          const duration = 1600;
          const step = timestamp => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            el.textContent = Math.floor(easeOut(progress) * target) + '+';
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          cio.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /* ─── DESKTOP: Products & Services dropdown toggle ─── */
  const dropdownLi = document.getElementById('nav-services-dropdown');
  const dropdownBtn = document.getElementById('nav-products-toggle');
  const dropdownPanel = dropdownLi ? dropdownLi.querySelector('.nav__dropdown-panel') : null;

  if (dropdownBtn && dropdownLi) {
    // Click toggle button to open / close
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdownLi.classList.toggle('open');
      dropdownBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!dropdownLi.contains(e.target)) {
        dropdownLi.classList.remove('open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdownLi.classList.contains('open')) {
        dropdownLi.classList.remove('open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
        dropdownBtn.focus();
      }
    });

    // Close dropdown when any item or link inside is clicked
    if (dropdownPanel) {
      dropdownPanel.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          dropdownLi.classList.remove('open');
          dropdownBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Kitchen Gallery format: Category tabs hover/click switching
    const catItems = dropdownLi.querySelectorAll('.nav__cat-item');
    const subPanels = dropdownLi.querySelectorAll('.nav__sub-panel');
    if (catItems.length && subPanels.length) {
      const activateCategory = (targetId) => {
        catItems.forEach(item => {
          item.classList.toggle('active', item.dataset.target === targetId);
        });
        subPanels.forEach(panel => {
          panel.classList.toggle('active', panel.id === targetId);
        });
      };

      catItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
          const targetId = item.dataset.target;
          if (targetId) activateCategory(targetId);
        });
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetId = item.dataset.target;
          if (targetId) activateCategory(targetId);
        });
      });
    }
  }

  /* ─── MOBILE: Products & Services accordion ─────── */
  const mobileServicesToggle = document.getElementById('mobile-services-toggle');
  const mobileServicesSub = document.getElementById('mobile-services-sub');
  if (mobileServicesToggle && mobileServicesSub) {
    const hasActiveSub = !!mobileServicesSub.querySelector('.active');
    if (hasActiveSub) {
      mobileServicesToggle.classList.add('open');
      mobileServicesSub.style.display = 'flex';
    } else {
      mobileServicesSub.style.display = 'none';
    }

    mobileServicesToggle.addEventListener('click', () => {
      const isOpen = mobileServicesToggle.classList.toggle('open');
      mobileServicesSub.style.display = isOpen ? 'flex' : 'none';
    });

    // Mobile nested category accordion toggle
    mobileServicesSub.querySelectorAll('.nav__mobile-cat-header').forEach(header => {
      header.addEventListener('click', (e) => {
        e.stopPropagation();
        const body = header.nextElementSibling;
        if (body && body.classList.contains('nav__mobile-cat-body')) {
          const isOpen = header.classList.toggle('open');
          body.classList.toggle('open', isOpen);
        }
      });
    });

    // Close mobile nav when clicking any sub-link
    mobileServicesSub.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburger = document.getElementById('hamburger');
        if (mobileMenu) mobileMenu.classList.remove('open');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        const spans = hamburger ? hamburger.querySelectorAll('span') : [];
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── ACTIVE NAV LINK & DROPDOWN DETECTION ───────── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav__link:not(.nav__cta)');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === page);
  });

  const servicePages = ['cabinetry.html', 'renovations.html'];
  const dropdownToggle = document.getElementById('nav-products-toggle');
  if (dropdownToggle && servicePages.some(p => page.startsWith(p.split('#')[0]))) {
    dropdownToggle.classList.add('active');
  }

  /* ─── SMOOTH SCROLL FOR HASH LINKS ───────────────── */
  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href) return;
      const [path, hash] = href.split('#');
      const isCurrentPage = !path || path === page || window.location.pathname.endsWith('/' + path);
      if (isCurrentPage && hash) {
        const target = document.getElementById(hash);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          history.pushState(null, '', '#' + hash);
        }
      }
    });
  });

  /* ─── PORTFOLIO URL FILTER SYNC ──────────────────── */
  const pfParam = new URLSearchParams(window.location.search).get('filter') || (window.location.hash ? window.location.hash.replace('#', '') : null);
  if (pfParam) {
    const matchingBtn = document.querySelector(`.filter-btn[data-filter="${pfParam}"]`);
    if (matchingBtn) {
      setTimeout(() => matchingBtn.click(), 50);
    }
  }

  /* ─── INTELLIGENT ENQUIRY FORM PARAMETER HANDLER ─── */
  const enquiryForm = document.getElementById('enquiry-form');
  if (enquiryForm) {
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('service');
    const bandParam = params.get('band');
    const stageParam = params.get('stage');
    const projectParam = params.get('project');
    const detailsParam = params.get('details');
    const locationParam = params.get('location');
    const colorParam = params.get('color');

    let hasPresets = false;
    let presetSummary = [];

    // 1. Service Mapping & Auto-Checking
    if (serviceParam) {
      const serviceAliases = {
        'kitchen': 'cabinetry',
        'kitchens': 'cabinetry',
        'wardrobe': 'cabinetry',
        'wardrobes': 'cabinetry',
        'closet': 'cabinetry',
        'closets': 'cabinetry',
        'cabinetry': 'cabinetry',
        'renovation': 'renovation',
        'renovations': 'renovation',
        'turnkey': 'renovation',
        'fitout': 'renovation',
        'painting': 'renovation',
        'bathroom': 'bathroom',
        'bathrooms': 'bathroom',
        'vanity': 'bathroom',
        'vanities': 'bathroom',
        'flooring': 'flooring',
        'tiling': 'flooring',
        'tiles': 'flooring',
        'solid-wood': 'solid-wood',
        'hardwood': 'solid-wood',
        'timber': 'solid-wood',
        'wood': 'solid-wood',
        'office': 'other',
        'commercial': 'other',
        'desks': 'other',
        'boardroom': 'other',
        'other': 'other'
      };

      const requestedServices = serviceParam.split(',').map(s => s.trim().toLowerCase());
      requestedServices.forEach(s => {
        const canonical = serviceAliases[s] || s;
        const cb = document.querySelector(`input[name="service"][value="${canonical}"]`);
        if (cb) {
          cb.checked = true;
          cb.dispatchEvent(new Event('change', { bubbles: true }));
          hasPresets = true;
          const labelSpan = cb.closest('label')?.querySelector('span');
          if (labelSpan) presetSummary.push(labelSpan.textContent.trim());
        }
      });
    } else if (bandParam || projectParam) {
      // Default to Kitchen Cabinetry or Solid Wood if band or project is indicated
      const defaultSvc = (bandParam && (bandParam === '5' || bandParam === 'band-5')) ? 'solid-wood' : 'cabinetry';
      const cb = document.querySelector(`input[name="service"][value="${defaultSvc}"]`);
      if (cb) {
        cb.checked = true;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
        hasPresets = true;
        const labelSpan = cb.closest('label')?.querySelector('span');
        if (labelSpan) presetSummary.push(labelSpan.textContent.trim());
      }
    }

    // 2. Band Auto-Selection (Guaranteed Cabinetry Band selection)
    let targetBand = bandParam ? bandParam.replace(/^(band-?r?|band\s*0?)/i, '').trim().toLowerCase() : null;
    
    // If band was not in URL, intelligently derive from project name or service
    if (!targetBand && projectParam) {
      const pLower = projectParam.toLowerCase();
      if (pLower.includes('solid wood') || pLower.includes('hardwood') || pLower.includes('mvule') || pLower.includes('mahogany') || pLower.includes('karen villa')) {
        targetBand = '5';
      } else if (pLower.includes('shaker') || pLower.includes('kerarapon') || pLower.includes('mushroom') || pLower.includes('hussein') || pLower.includes('bogani') || pLower.includes('bella')) {
        targetBand = '3';
      } else if (pLower.includes('uv') || pLower.includes('gloss') || pLower.includes('ali') || pLower.includes('runda')) {
        targetBand = '2';
      } else if (pLower.includes('raised mdf')) {
        targetBand = '4';
      } else if (pLower.includes('melamine') || pLower.includes('siddy') || pLower.includes('tigoni')) {
        targetBand = '1';
      }
    }

    // If service is cabinetry / kitchen / wardrobe and no band was chosen yet, select 'guidance'
    const isCabinetryActive = document.querySelector('input[name="service"][value="cabinetry"]')?.checked ||
                              document.querySelector('input[name="service"][value="solid-wood"]')?.checked ||
                              (serviceParam && (serviceParam.includes('cabinetry') || serviceParam.includes('kitchen') || serviceParam.includes('wardrobe')));
    if (!targetBand && isCabinetryActive) {
      targetBand = 'guidance';
    }

    if (targetBand) {
      const radio = document.querySelector(`input[name="band"][value="${targetBand}"]`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        hasPresets = true;
        const radioSpan = radio.closest('label')?.querySelector('span');
        if (radioSpan) presetSummary.push(radioSpan.textContent.trim());
      }
    }

    // Synchronize visual selected styling on all checkbox & radio labels
    function syncVisualLabels() {
      document.querySelectorAll('.checkbox-label').forEach(lbl => {
        const inp = lbl.querySelector('input');
        lbl.classList.toggle('selected', !!(inp && inp.checked));
      });
      document.querySelectorAll('.radio-label').forEach(lbl => {
        const inp = lbl.querySelector('input');
        lbl.classList.toggle('selected', !!(inp && inp.checked));
      });
    }

    document.querySelectorAll('.checkbox-label input, .radio-label input').forEach(inp => {
      inp.addEventListener('change', syncVisualLabels);
    });
    syncVisualLabels();

    // 3. Project Stage Auto-Selection
    if (stageParam) {
      const stageSelect = document.getElementById('field-stage');
      if (stageSelect) {
        const matchingOption = Array.from(stageSelect.options).find(opt => opt.value === stageParam.toLowerCase());
        if (matchingOption) {
          stageSelect.value = matchingOption.value;
          hasPresets = true;
          presetSummary.push(`Stage: ${matchingOption.text}`);
        }
      }
    }

    // 4. Location Auto-Fill
    const locationInput = document.getElementById('field-location');
    if (locationInput) {
      if (locationParam) {
        locationInput.value = locationParam;
        hasPresets = true;
      } else if (projectParam) {
        const estateMatches = ['Karen', 'Westlands', 'Runda', 'Muthaiga', 'Lavington', 'Kilimani', 'Kitisuru', 'Spring Valley', 'Nyari', 'Rosslyn', 'Kerarapon'];
        const found = estateMatches.find(e => new RegExp(`\\b${e}\\b`, 'i').test(projectParam));
        if (found && !locationInput.value) {
          locationInput.value = `${found}, Nairobi`;
          hasPresets = true;
        }
      }
    }

    // 5. Details Pre-Population
    const detailsInput = document.getElementById('field-details');
    if (detailsInput && !detailsInput.value) {
      if (detailsParam) {
        detailsInput.value = detailsParam;
        hasPresets = true;
      } else if (projectParam) {
        detailsInput.value = `I am inquiring about commissioning a bespoke build inspired by the "${projectParam}" project featured in your portfolio. Please advise on design consultation, timelines, and preliminary cost bands.`;
        hasPresets = true;
        presetSummary.push(`Project: ${projectParam}`);
      } else if (colorParam) {
        detailsInput.value = `Interested in cabinetry crafted in the "${colorParam}" finish tone shown in your material atelier.`;
        hasPresets = true;
        presetSummary.push(`Tone: ${colorParam}`);
      } else if (bandParam) {
        detailsInput.value = `Requesting tailored finish samples and a private consultation for Band 0${bandParam} cabinetry specifications.`;
        hasPresets = true;
      }
    }

    // 6. Visual Preset Notification & Smooth Scroll
    if (hasPresets) {
      const formWrap = document.getElementById('form-wrap');
      if (formWrap) {
        const noticeDiv = document.createElement('div');
        noticeDiv.className = 'form-preset-notice';
        const summaryText = presetSummary.length ? presetSummary.join(' · ') : 'Your project inquiry details';
        noticeDiv.innerHTML = `
          <span>Pre-filled for: <strong>${summaryText}</strong></span>
          <button type="button" class="form-preset-clear" id="preset-clear-btn" title="Reset all prefilled fields">Clear &amp; Start Fresh</button>
        `;
        formWrap.insertBefore(noticeDiv, formWrap.querySelector('.form-card__title').nextElementSibling);

        document.getElementById('preset-clear-btn')?.addEventListener('click', () => {
          enquiryForm.reset();
          noticeDiv.remove();
          history.replaceState(null, '', window.location.pathname);
        });
      }

      // Smooth scroll to form card after DOM paint
      setTimeout(() => {
        const formCard = document.getElementById('form-card') || enquiryForm;
        formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        formCard.classList.add('form-field-highlight');
      }, 200);
    }

    // 7. Form Submit → Send directly to WDI Studio WhatsApp
    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name    = document.getElementById('field-name')?.value.trim()     || '';
      const phone   = document.getElementById('field-phone')?.value.trim()    || '';
      const email   = document.getElementById('field-email')?.value.trim()    || '';
      const loc     = document.getElementById('field-location')?.value.trim() || '';
      const details = document.getElementById('field-details')?.value.trim()  || '';
      const stage   = document.getElementById('field-stage')?.value           || '';

      const checkedServices = Array.from(document.querySelectorAll('input[name="service"]:checked'))
        .map(cb => cb.closest('label')?.textContent.trim() || cb.value);
      const checkedBand = document.querySelector('input[name="band"]:checked')
        ?.closest('label')?.textContent.trim() || '';

      if (!name || !phone || !loc) {
        ['field-name', 'field-phone', 'field-location'].forEach(id => {
          const el = document.getElementById(id);
          if (el && !el.value.trim()) {
            el.style.borderColor = 'var(--c-gold)';
            setTimeout(() => { el.style.borderColor = ''; }, 2500);
          }
        });
        alert('Please fill in all required fields: Name, Phone/WhatsApp, and Project Location.');
        return;
      }

      const stageLabels = {
        'planning': 'Planning / design stage',
        'construction': 'Under construction',
        'underway': 'Renovation already underway',
        'complete': 'Space complete — adding cabinetry'
      };

      // Build the WhatsApp message
      const waLines = [
        '*New Enquiry — WDI Design Studio*',
        '',
        `*Client:* ${name}`,
        `*Phone:* ${phone}`,
        email    ? `*Email:* ${email}` : '',
        `*Location:* ${loc}`,
        checkedServices.length ? `*Service(s):* ${checkedServices.join(', ')}` : '',
        checkedBand ? `*Finish Band:* ${checkedBand}` : '',
        stage ? `*Project Stage:* ${stageLabels[stage] || stage}` : '',
        details ? `\n*Project Details:*\n${details}` : ''
      ].filter(Boolean).join('\n');

      const waUrl = `https://wa.me/254718923740?text=${encodeURIComponent(waLines)}`;

      // Open WhatsApp immediately in new tab
      window.open(waUrl, '_blank', 'noopener');

      // Show success state
      const formWrap    = document.getElementById('form-wrap');
      const formSuccess = document.getElementById('form-success');
      if (formWrap)    formWrap.style.display = 'none';
      if (formSuccess) {
        formSuccess.style.cssText = 'display:flex;flex-direction:column;align-items:center;';

        const titleEl = formSuccess.querySelector('.form-success__title');
        if (titleEl) titleEl.textContent = 'Enquiry sent to WhatsApp!';
        const descEl = formSuccess.querySelector('p.t-body');
        if (descEl) descEl.textContent = 'Your enquiry has been sent directly to the WDI Design Studio WhatsApp. The team will be in touch shortly.';

        // Fallback button in case browser blocked the popup
        let waBtn = document.getElementById('success-whatsapp-btn');
        if (!waBtn) {
          waBtn = document.createElement('a');
          waBtn.id        = 'success-whatsapp-btn';
          waBtn.className = 'btn btn-primary';
          waBtn.style.cssText = 'margin-top:16px;display:inline-flex;align-items:center;gap:8px;';
          waBtn.target    = '_blank';
          waBtn.rel       = 'noopener';
          waBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23z"/></svg> Open WhatsApp`;
          const backHome = formSuccess.querySelector('a.btn');
          if (backHome) backHome.parentElement.insertBefore(waBtn, backHome);
          else formSuccess.appendChild(waBtn);
        }
        waBtn.href = waUrl;
      }
    });
  }

  /* ─── INTERACTIVE PALETTE CHIPS TO ENQUIRY ────────── */
  document.querySelectorAll('.palette-chip').forEach(chip => {
    const name = chip.querySelector('.palette-chip__name')?.textContent.trim() || '';
    if (name) {
      chip.title = `Click to inquire with ${name} finish`;
      chip.addEventListener('click', () => {
        window.location.href = `contact.html?service=cabinetry&color=${encodeURIComponent(name)}&details=${encodeURIComponent('Inquiring about cabinetry in ' + name + ' finish tone.')}`;
      });
    }
  });

  /* ─── LEGAL MODAL (PRIVACY POLICY & TERMS OF USE) ─── */
  function openLegalModal(type) {
    let backdrop = document.getElementById('legal-modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'legal-modal-backdrop';
      backdrop.className = 'legal-modal-backdrop';
      backdrop.innerHTML = `
        <div class="legal-modal" role="dialog" aria-modal="true" aria-labelledby="legal-modal-title">
          <div class="legal-modal__header">
            <h3 class="legal-modal__title" id="legal-modal-title"></h3>
            <button class="legal-modal__close" id="legal-modal-close" aria-label="Close dialog">&times;</button>
          </div>
          <div class="legal-modal__body" id="legal-modal-body"></div>
        </div>
      `;
      document.body.appendChild(backdrop);

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeLegalModal();
      });
      document.getElementById('legal-modal-close')?.addEventListener('click', closeLegalModal);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && backdrop.classList.contains('active')) closeLegalModal();
      });
    }

    const titleEl = document.getElementById('legal-modal-title');
    const bodyEl = document.getElementById('legal-modal-body');

    if (type === 'privacy') {
      titleEl.textContent = 'Privacy Policy';
      bodyEl.innerHTML = `
        <p><strong>WDI Design Studio</strong> is committed to safeguarding the privacy and confidentiality of our clients, architectural partners, and website visitors across Kenya and internationally.</p>
        <h4>1. Information Collection & Usage</h4>
        <p>We collect project-related information (such as name, phone/WhatsApp, email, architectural drawings, and estate location) solely to provide bespoke consultations, tailored quotations, workshop fabrication, and on-site fit-out coordination.</p>
        <h4>2. Non-Disclosure & Security</h4>
        <p>Your residential floor plans, interior measurements, and personal contact details are strictly confidential. We never sell, lease, or distribute client information to third parties.</p>
        <h4>3. Direct Communication</h4>
        <p>By submitting an enquiry form or connecting via WhatsApp, you authorize our design atelier to contact you regarding your designated project scope.</p>
        <p style="font-size:0.8rem;color:var(--c-gold);margin-top:12px;">WDI Design Studio · Karen / Westlands, Nairobi · Tel: +254 718 923 740</p>
      `;
    } else {
      titleEl.textContent = 'Terms of Engagement';
      bodyEl.innerHTML = `
        <p>These terms govern design consultations, workshop fabrication, and turnkey installation services provided by <strong>WDI Design Studio</strong>.</p>
        <h4>1. Consultations & Quotations</h4>
        <p>Initial consultations and preliminary finish assessments carry no obligation. Formal project quotations are provided following physical site measurement and material band selection.</p>
        <h4>2. Hardware & Craftsmanship Guarantee</h4>
        <p>All cabinetry installations utilize authentic certified Blum® hinges and drawer runners backed by a lifetime mechanical warranty. Timber works are produced using kiln-dried regional hardwoods (Mvule, Meru Oak, Mahogany) treated against moisture.</p>
        <h4>3. Project Timelines & Variations</h4>
        <p>Fabrication begins upon formal sign-off of shop drawings and deposit confirmation. Any client-requested alterations in finish bands or layout during fabrication are documented via formal revision notices.</p>
        <p style="font-size:0.8rem;color:var(--c-gold);margin-top:12px;">WDI Design Studio · Architectural Joinery & Turnkey Fit-Outs</p>
      `;
    }

    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLegalModal() {
    const backdrop = document.getElementById('legal-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Bind all legal links across footers
  document.querySelectorAll('a[href="#"]').forEach(link => {
    const txt = link.textContent.trim().toLowerCase();
    if (txt.includes('privacy')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openLegalModal('privacy');
      });
    } else if (txt.includes('terms')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openLegalModal('terms');
      });
    }
  });

  /* ─── SMOOTH HOVER PARALLAX ON HERO ─────────────── */
  const heroBg = document.querySelector('.hero__bg img');
  if (heroBg) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      heroBg.style.transform = `scale(1.08) translate(${x}px, ${y}px)`;
    });
  }

})();

