(function(){
  // social media sharing - https://dmitryrogozhny.com/blog/adding-social-networks-buttons-to-jekyll
  function openWindowPopup(url, width, height) {
    var left = (screen.width / 2) - (width / 2),
      top = (screen.height / 2) - (height / 2);

    window.open(
      url,
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left
    );
  }

  function addPopupOnClick(cssClass, width, height) {
    var links = document.querySelectorAll(cssClass);

    if (links) {
      for (var i = 0; i < links.length; i++) {
        var link = links[i];

        link.addEventListener("click", function (e) {
          e.preventDefault();
          openWindowPopup(this.href, width, height);
        });
      }
    }
  }

  addPopupOnClick(".js-social-buttons", 750, 500);

  // link sharing
  const shareLinkButton = document.querySelector('button.share-link');
  if (shareLinkButton) {
    shareLinkButton.addEventListener('click', function(e) {
      navigator.clipboard.writeText(window.location.href).then(function() {
        e.target.innerText = 'Copied!';
      }, function(err) {
        // 
      });
    });
  }
})();
