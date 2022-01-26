var $grid, msnry;
(function(){
  // theme switch
  const toggles = document.querySelectorAll('.theme-toggle input');
  if (toggles.length) {
    toggles.forEach(function(toggle) {
      toggle.addEventListener('change', function(e) {
        document.querySelector('body').classList.toggle('dark');
        localStorage.setItem('theme', this.checked ? 'dark' : 'light');
      });
    });
  }

  // default theme
  if (document.querySelector('body').classList.contains("dark")) {
    toggles.forEach(function(toggle) {
      toggle.checked = true;
    });
  }

  // scroll
  const postListHeader = document.querySelector('.post-list-header');
  if (postListHeader) {
    document.addEventListener('scroll', function() {
      if (window.scrollY >= 100) {
        postListHeader.classList.add('scroll');
      }
      else {
        postListHeader.classList.remove('scroll'); 
      }
    }, {passive: true});
  }

  // mobile
  const menuToggle = document.querySelector('.hamburger'),
    mobileMenu = document.querySelector('header.header .right'),
    searchToggle = document.querySelector('.bottom-header .toggle'),
    searchMenu = document.querySelector('.bottom-header .form');
  menuToggle.addEventListener('click', function(e) {
    e.preventDefault();
    menuToggle.classList.toggle('is-active');
    mobileMenu.classList.toggle('open');
  });

  searchToggle.addEventListener('click', function(e) {
    e.preventDefault();
    searchToggle.classList.toggle('open');
    searchMenu.classList.toggle('open');
  });

  // share modal
  const shareModal = document.querySelector('#share-modal'),
    shareModalButton = document.querySelector('header.header .btn.share'),
    shareModalCopyButton = shareModal.querySelector('.btn.btn-primary');
  shareModalButton.addEventListener('click', function(e) {
    e.preventDefault();
    shareModal.classList.add('open');
  });

  shareModalCopyButton.addEventListener('click', function(e) {
    e.preventDefault();
    navigator.clipboard.writeText(shareModal.querySelector('input[type="text"]').value).then(function() {
      e.target.innerText = 'Copied!';
    }, function(err) {
      // 
    });
  });

  // submit story modal
  const submitModal = document.querySelector('#submit-modal'),
    submitModalButton = document.querySelector('header.header .btn.submit-story'),
    submitStoryForm = submitModal.querySelector('form'),
    formResponse = submitModal.querySelector('.response'),
    submitStoryFormButton = submitModal.querySelector('.btn.btn-primary');
  submitModalButton.addEventListener('click', function(e) {
    e.preventDefault();
    submitModal.classList.add('open');
  });

  submitStoryForm.addEventListener('submit', function(e) {
    e.preventDefault();
    submitStoryFormButton.setAttribute('disabled', 'disabled');
    let data = new FormData(submitStoryForm);
    fetch(event.target.action, {
      method: "post",
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      submitStoryFormButton.removeAttribute('disabled');
      formResponse.innerHTML = "Thanks for your submission!";
      submitStoryForm.reset();
    }).catch(error => {
      submitStoryFormButton.removeAttribute('disabled');
      formResponse.innerHTML = "Sorry, there was an error. Please try again later.";
    });
  });

  // modals
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  modalOverlays.forEach(function(overlay) {
    overlay.addEventListener('click', closeModal);
    overlay.querySelector('.modal .btn-close').addEventListener('click', closeModal);
    overlay.querySelector('.modal').addEventListener('click', function(e) { e.stopPropagation(); });
  });

  function closeModal(e) {
    e.preventDefault();
    document.querySelector('.modal-overlay.open').classList.remove('open');
  }

})();
