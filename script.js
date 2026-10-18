// Portfolio Scripts - Cheraga Abd El Mounaim
document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('#main-nav ul');
  const yearEl = document.getElementById('year');
  
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('show');
    });

    // Close nav on click outside or on link
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // 3. Project Filter System
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Active class toggle
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 200);
          }
        });
      });
    });
  }

  // 4. Contact Form Submission (Formspree AJAX)
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Envoyer';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Envoi en cours...</span>';
      }

      formStatus.className = 'form-status';
      formStatus.style.display = 'none';

      const data = {
        name: contactForm.name ? contactForm.name.value : '',
        email: contactForm.email ? contactForm.email.value : '',
        message: contactForm.message ? contactForm.message.value : ''
      };

      try {
        const response = await fetch('https://formspree.io/f/xykkkezq', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          formStatus.textContent = 'Votre message a été envoyé avec succès ! Je vous répondrai rapidement.';
          formStatus.className = 'form-status success';
          formStatus.style.display = 'block';
          contactForm.reset();
        } else {
          const result = await response.json();
          formStatus.textContent = result?.errors?.[0]?.message || 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.';
          formStatus.className = 'form-status error';
          formStatus.style.display = 'block';
        }
      } catch (err) {
        formStatus.textContent = 'Erreur réseau. Veuillez vérifier votre connexion et réessayer.';
        formStatus.className = 'form-status error';
        formStatus.style.display = 'block';
        console.error('Contact form error:', err);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }
});
