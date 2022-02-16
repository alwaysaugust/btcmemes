(function(){
  // masonry
  let elem = document.querySelector('.post-list');
  elem.classList.add("hidden");

  msnry = new Masonry( elem, {
    // options
    itemSelector: '.post-item',
    columnWidth: '.post-sizer',
    percentPosition: true,
    stagger: 30,
    gutter: '.gutter-sizer',
    transitionDuration: 0,
  });

  imagesLoaded( elem, () => {
    elem.classList.remove("hidden");
    
    window.setTimeout(function(){ msnry.layout(); }, 1000);

    // Play gif on hover
    Gifffer();
  });

  // Copy button
  // link sharing
  const shareLinkButtons = document.querySelectorAll('span.share-link');
  if (shareLinkButtons) {
    Array.from(shareLinkButtons).forEach(function(element) {
      element.addEventListener('click', onShareButtonClicked);
    });
  }

  // download button
  const downloadButtons = document.querySelectorAll('span.download-img');
  if (downloadButtons) {
    Array.from(downloadButtons).forEach(function(element) {
      element.addEventListener('click', onDownloadButtonClicked);
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

function onDownloadButtonClicked(e) {
  e.preventDefault();
  const link = e.target.getAttribute("data-link");
  const name = link.split("/").length > 0 ? link.split("/")[link.split("/").length - 1] : 'btcmeme.gif';
  downloadURI(link, name);
}

async function downloadURI(imageSrc, name) {
  const image = await fetch(imageSrc);
  const imageBlog = await image.blob();
  const imageURL = URL.createObjectURL(imageBlog);

  const link = document.createElement('a');
  link.href = imageURL;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
