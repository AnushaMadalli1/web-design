// ─── THEME ───────────────────────────────────────────
var themeBtn = document.getElementById('themeBtn');
var savedTheme = localStorage.getItem('theme') || 'light';

if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeBtn.textContent = '☀️';
}

themeBtn.addEventListener('click', function () {
  document.body.classList.toggle('dark');
  var isDark = document.body.classList.contains('dark');
  themeBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ─── NAVBAR SCROLL SHADOW ────────────────────────────
var navbar = document.getElementById('navbar');

window.addEventListener('scroll', function () {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ─── HAMBURGER ───────────────────────────────────────
var ham = document.getElementById('ham');
var mobMenu = document.getElementById('mobMenu');

ham.addEventListener('click', function () {
  ham.classList.toggle('open');
  mobMenu.classList.toggle('open');
});

mobMenu.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    ham.classList.remove('open');
    mobMenu.classList.remove('open');
  });
});

// ─── BILLING TOGGLE (pricing page) ──────────────────
var billingSwitch = document.getElementById('billingSwitch');

if (billingSwitch) {
  var togMonthly = document.getElementById('togMonthly');
  var togYearly = document.getElementById('togYearly');
  var amounts = document.querySelectorAll('.plan-amount');

  // set monthly label active by default
  togMonthly.classList.add('on');

  billingSwitch.addEventListener('change', function () {
    var isYearly = billingSwitch.checked;

    togMonthly.classList.toggle('on', !isYearly);
    togYearly.classList.toggle('on', isYearly);

    amounts.forEach(function (el) {
      el.style.opacity = '0';
      setTimeout(function () {
        el.textContent = isYearly ? el.getAttribute('data-y') : el.getAttribute('data-m');
        el.style.opacity = '1';
      }, 150);
    });
  });
}

// ─── PLAN SELECTION + localStorage (pricing page) ────
function pickPlan(name, btn) {
  // save to localStorage
  localStorage.setItem('selectedPlan', name);

  // show modal
  var overlay = document.getElementById('modalOverlay');
  document.getElementById('modal-heading').textContent = name + ' plan selected!';
  document.getElementById('modal-body').textContent =
    'Your ' + name + ' plan has been saved. Click below to go to the contact form and complete your enquiry.';
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function clearPlan() {
  localStorage.removeItem('selectedPlan');
  var notice = document.getElementById('planNotice');
  if (notice) notice.style.display = 'none';
}

// Close modal
var modalX = document.getElementById('modalX');
var modalOverlay = document.getElementById('modalOverlay');

if (modalX) {
  modalX.addEventListener('click', function () {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = '';
  });
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('show');
      document.body.style.overflow = '';
    }
  });
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && modalOverlay) {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }
});

// Show saved plan notice on pricing page
var planNotice = document.getElementById('planNotice');
if (planNotice) {
  var saved = localStorage.getItem('selectedPlan');
  if (saved) {
    document.getElementById('noticePlanName').textContent = saved;
    planNotice.style.display = 'inline-flex';
  }
}

// ─── FAQ ACCORDION ────────────────────────────────────
var faqRows = document.querySelectorAll('.faq-row');

faqRows.forEach(function (row) {
  var btn = row.querySelector('.faq-q');
  btn.addEventListener('click', function () {
    var isOpen = row.classList.contains('open');
    // close all
    faqRows.forEach(function (r) { r.classList.remove('open'); });
    // open clicked one if it was closed
    if (!isOpen) {
      row.classList.add('open');
    }
  });
});

// ─── CONTACT: show saved plan ─────────────────────────
var savedPlanBox = document.getElementById('savedPlanBox');
if (savedPlanBox) {
  var planInStorage = localStorage.getItem('selectedPlan');
  if (planInStorage) {
    document.getElementById('savedPlanValue').textContent = planInStorage;
    savedPlanBox.style.display = 'block';
  }
}

// ─── CONTACT FORM VALIDATION + FETCH ─────────────────
var contactForm = document.getElementById('contactForm');

if (contactForm) {

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var isValid = validateForm();
    if (!isValid) return;

    var submitBtn = document.getElementById('submitBtn');
    var feedback = document.getElementById('form-feedback');

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    feedback.textContent = '';
    feedback.className = 'form-feedback';

    // fetch call to JSONPlaceholder (public fake API)
    var formData = {
      name: document.getElementById('fname').value + ' ' + document.getElementById('lname').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      service: document.getElementById('service').value,
      message: document.getElementById('message').value
    };

    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then(function (data) {
        // success
        feedback.textContent = '✅ Message sent! We\'ll get back to you within one business day.';
        feedback.classList.add('ok');
        contactForm.reset();
        // clear input states
        contactForm.querySelectorAll('input, textarea').forEach(function (el) {
          el.classList.remove('good', 'bad');
        });
        // clear saved plan after submission
        localStorage.removeItem('selectedPlan');
        if (savedPlanBox) savedPlanBox.style.display = 'none';
      })
      .catch(function () {
        feedback.textContent = '❌ Something went wrong. Please try again or email us directly.';
        feedback.classList.add('fail');
      })
      .finally(function () {
        submitBtn.textContent = 'Send message';
        submitBtn.disabled = false;
      });
  });

  // live validation on blur
  ['fname', 'lname', 'email', 'phone', 'message'].forEach(function (id) {
    var input = document.getElementById(id);
    input.addEventListener('blur', function () {
      checkField(id);
    });
    input.addEventListener('input', function () {
      if (input.classList.contains('bad')) checkField(id);
    });
  });
}

function validateForm() {
  var ok = true;
  var fields = ['fname', 'lname', 'email', 'phone', 'message'];
  fields.forEach(function (id) {
    if (!checkField(id)) ok = false;
  });

  // checkbox
  var consent = document.getElementById('consent');
  var consentErr = document.getElementById('err-consent');
  if (!consent.checked) {
    consentErr.textContent = 'Please agree to the privacy policy to continue.';
    ok = false;
  } else {
    consentErr.textContent = '';
  }

  return ok;
}

function checkField(id) {
  var input = document.getElementById(id);
  var err = document.getElementById('err-' + id);
  var val = input.value.trim();
  var msg = '';

  if (id === 'fname' || id === 'lname') {
    if (val === '') {
      msg = 'This field is required.';
    } else if (val.length < 2) {
      msg = 'Please enter at least 2 characters.';
    }
  }

  if (id === 'email') {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val === '') {
      msg = 'Email address is required.';
    } else if (!emailPattern.test(val)) {
      msg = 'Please enter a valid email address.';
    }
  }

  if (id === 'phone') {
    var phonePattern = /^[+0-9\s\-]{7,15}$/;
    if (val === '') {
      msg = 'Phone number is required.';
    } else if (!phonePattern.test(val)) {
      msg = 'Please enter a valid phone number.';
    }
  }

  if (id === 'message') {
    if (val === '') {
      msg = 'Please write a message before submitting.';
    } else if (val.length < 15) {
      msg = 'Your message is too short — tell us a bit more.';
    }
  }

  if (err) {
    err.textContent = msg;
  }

  if (msg) {
    input.classList.add('bad');
    input.classList.remove('good');
    return false;
  } else {
    input.classList.remove('bad');
    if (val !== '') input.classList.add('good');
    return true;
  }
}
