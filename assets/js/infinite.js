(function() {
  const spinner = document.querySelector('.list-spinner'),
    postsContainer = document.querySelector('.post-list'),
    sortButton = document.querySelector('.bottom-header .sort'),
    bottomHeader = document.querySelector('.bottom-header');

  let perPage = 10,
    current = 10,
    reverse = false,
    searchStr = null;

  // get JSON of all posts
  fetch('/all-posts.json', {method: 'GET', headers: {}}).then(function (response) {
    return response.json();
  })
  .then(function (body) {
    let options = {
      rootMargin: '0px',
      threshold: 1.0
    };

    let observer = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // load posts when spinner is visible
          loadPosts(body.posts, reverse, searchStr);
        }
      });
    }, options);

    observer.observe(spinner);

    // sorting
    sortButton.addEventListener('click', function(e) {
      e.preventDefault();
      current = 0;
      reverse = !reverse;
      removeCurrentPosts();
      loadPosts(body.posts, reverse, searchStr);
      sortButton.classList.toggle('old');
    });

    // mobile filters
    const mobileSort = bottomHeader.querySelector('.mobile .sort-order');
    mobileSort.addEventListener('change', function(e) {
      reverse = this.value == "oldest";
      removeCurrentPosts();
      current = 0;
      loadPosts(body.posts, reverse, searchStr);
    });

    const mobileSearch = bottomHeader.querySelector('.mobile #mobile-search');
    let timeout;
    mobileSearch.addEventListener('keyup', function(e) {
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        searchStr = mobileSearch.value;
        removeCurrentPosts();
        current = 0;
        loadPosts(body.posts, reverse, searchStr);
      }, 500);
    });

    // desktop search
    const searchButton = bottomHeader.querySelector('.btn.search'),
      desktopSearch = bottomHeader.querySelector('#desktop-search');
    let desktopTimeout;
    searchButton.addEventListener('click', function(e) {
      e.preventDefault();
      clearTimeout(desktopTimeout);
      timeout = setTimeout(function() {
        searchStr = desktopSearch.value;
        removeCurrentPosts();
        current = 0;
        loadPosts(body.posts, reverse, searchStr);
      }, 500);
    });

  });

  function removeCurrentPosts() {
    let currentPosts = postsContainer.querySelectorAll('div > a');
    currentPosts.forEach(function(post) { post.parentNode.remove() });
  }

  function loadPosts(postsList, reverse, searchStr) {
    // sort
    if (reverse) {
      postsList = postsList.slice().reverse();
    }

    if (searchStr) {
      let fuse = new Fuse(postsList, { keys: ['tags'] });
      postsList = fuse.search(searchStr);
    }

    // show more pagination?
    if (postsList.length <= postsContainer.querySelectorAll('div > a').length) {
      spinner.style.display = 'none';
    }
    else {
      spinner.style.display = 'flex';
    }

    // show posts
    postsList.slice(current, current + perPage).forEach(function(item) {
      if (searchStr) {
        item = item.item;
      }

      // create list items
      let listItem = document.createElement("div");
      let listItemA = document.createElement("a");
      let listItemContent = document.createElement("div");
      let listItemImg = document.createElement("img");
      let imgOverlay = document.createElement("div");

      listItem.classList.add("post-item");
      listItemA.setAttribute('href', item.url);
      listItemContent.classList.add("post-item-content");
      imgOverlay.classList.add("img-overlay");

      if (item.external_file) {
        listItemContent.style.backgroundImage = "url('" + item.external_file + "')";
        listItemImg.setAttribute('src', item.external_file);
        listItemImg.classList.add("masonry-content");
        imgOverlay.innerHTML = `
            <span class="link-url">${item.external_file}</span>
            <span class="share-link" data-link="${item.external_file}">
              <img src="/assets/images/link.svg" alt="link" />
            </span>`;
      } else {
        listItemImg.setAttribute('src', item.local_file);
        listItemImg.classList.add("masonry-content");
        listItemContent.style.backgroundImage = "url('" + item.local_file + "')";
        imgOverlay.innerHTML = `
            <span class="link-url">${window.document.location.origin + item.url}</span>
            <span class="share-link" data-link="${window.document.location.origin + item.url}">
              <img src="/assets/images/link.svg" alt="link" />
            </span>`;
      }

      listItemContent.append(listItemImg);
      listItemContent.append(imgOverlay);
      listItemA.append(listItemContent)
      listItem.append(listItemA);
      postsContainer.append(listItem);

      msnry.appended( listItem );
      listItem.classList.add("hidden");
      imagesLoaded( '.post-list', () => {
        listItem.classList.remove("hidden");
        msnry.layout();
      });
    });

    const shareLinkButtons = document.querySelectorAll('span.share-link');
    if (shareLinkButtons) {
      Array.from(shareLinkButtons).forEach(function(element) {
        element.removeEventListener('click', onShareButtonClicked);
        element.addEventListener('click', onShareButtonClicked);
      });
    }

    // increment current index
    current += perPage;

    // hide spinner if reached end of posts
    if (current >= postsList.length) {
      spinner.style.display = 'none';
    }
  }
})();
