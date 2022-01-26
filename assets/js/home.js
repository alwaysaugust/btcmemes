(function(){
  // masonry
  let elem = document.querySelector('.post-list');
  msnry = new Masonry( elem, {
    // options
    itemSelector: '.post-item',
    columnWidth: '.post-sizer',
    percentPosition: true,
    horizontalOrder: true,
    gutter: '.gutter-sizer'
  });

  imagesLoaded( elem, () => {
    msnry.layout();
  });

  // Copy button
  // link sharing
  const shareLinkButtons = document.querySelectorAll('span.share-link');
  if (shareLinkButtons) {
    Array.from(shareLinkButtons).forEach(function(element) {
      element.addEventListener('click', onShareButtonClicked);
    });
  }
})();

function onShareButtonClicked(e) {
  e.preventDefault();
  navigator.clipboard.writeText(e.target.getAttribute("data-link")).then(function () {
    const alertCopied = document.querySelector('.alert-copied');
    alertCopied.classList.remove('hidden');
    setTimeout(function () {
      alertCopied.classList.add('hidden');
    }, 3000);
  }, function (err) {
    //
  });
}
