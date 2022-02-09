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
      let listItemRealImg = document.createElement("img");
      let imgOverlay = document.createElement("div");
      let downloadButton = document.createElement("span");

      listItem.classList.add("post-item");
      listItemA.setAttribute('href', item.url);
      listItemContent.classList.add("post-item-content");
      imgOverlay.classList.add("img-overlay");
      downloadButton.classList.add("download-img");

      if (item.external_file) {
        //listItemContent.style.backgroundImage = "url('" + item.external_file + "')";
        listItemImg.setAttribute('src', item.external_file);
        listItemImg.classList.add("masonry-content");
        listItemRealImg.setAttribute('data-gifffer', item.external_file);
        listItemRealImg.classList.add("masonry-image");
        downloadButton.setAttribute("data-link", item.external_file);
        imgOverlay.innerHTML = `
            <span class="link-url">${item.external_file}</span>
            <span class="share-link" data-link="${item.external_file}">
              <svg width="15px" height="15px" viewBox="0 0 15 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="Without-upload" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="White-Details" transform="translate(-796.000000, -510.000000)" fill="#000000" fill-rule="nonzero">
                    <g id="Group-2" transform="translate(735.000000, 374.000000)">
                      <g id="Group-5" transform="translate(38.000000, 127.000000)">
                        <g id="noun-link-3015975" transform="translate(23.000000, 9.000000)">
                          <path d="M6.97943338,10.9679149 C7.20262861,10.7404371 7.56421925,10.741046 7.78680792,10.9689313 C8.00960558,11.1968151 8.00900922,11.5657932 7.78581241,11.7930577 C6.96253504,12.6315995 6.50736745,13.0954958 6.42117614,13.1835497 L5.60345456,14.0184486 C4.32164554,15.3271838 2.2431658,15.3271838 0.96135677,14.0184486 C-0.320452257,12.7095053 -0.320452257,10.5875725 0.96135677,9.27862923 L4.19060008,5.98155135 C5.47261299,4.67281622 7.55088885,4.67281622 8.83290176,5.98155135 C9.05569941,6.20923213 9.05569941,6.57820509 8.83290176,6.80588587 C8.60990532,7.03336369 8.24852366,7.03336369 8.02552722,6.80588587 C7.18950719,5.95230413 5.83399465,5.95230413 4.99797463,6.80588587 L1.76873131,10.1029638 C0.932711284,10.9565455 0.932711284,12.3405324 1.76873131,13.1941141 C2.60475134,14.0476959 3.96026387,14.0476959 4.7962839,13.1941141 L5.6138016,12.3592152 C5.70060965,12.2707866 6.15556826,11.807317 6.97945728,10.9679425 L6.97943338,10.9679149 Z" id="Path"></path>
                          <path d="M8.02047831,4.03208509 C7.79728678,4.25935994 7.43590601,4.25895402 7.21311714,4.03106867 C6.99052196,3.80318493 6.99091952,3.43420676 7.21411268,3.20673415 C8.03737642,2.36819234 8.49274035,1.90450418 8.57893023,1.8162421 L9.39643438,0.981551352 C10.6784261,-0.327183784 12.7566675,-0.327183784 14.0386592,0.981551352 C15.3204469,2.29028649 15.3204469,4.41242747 14.0386592,5.7211626 L10.8092655,9.01844865 C9.52747766,10.3271838 7.44903235,10.3271838 6.16724456,9.01844865 C5.94425181,8.79076787 5.94425181,8.42179491 6.16724456,8.19411413 C6.39023731,7.96643335 6.75161298,7.96643335 6.97460573,8.19411413 C7.81061191,9.04769587 9.16589811,9.04769587 10.0019553,8.19411413 L13.231349,4.89703625 C14.0673551,4.0434545 14.0673551,2.65946762 13.231349,1.80588587 C12.3953428,0.952304129 11.0398527,0.952304129 10.2038465,1.80588587 L9.38634237,2.64057662 C9.29953575,2.72920819 8.84458467,3.19268299 8.02050542,4.03205745 L8.02047831,4.03208509 Z" id="Path"></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </span>`;
      } else {
        listItemImg.setAttribute('src', item.local_file);
        listItemImg.classList.add("masonry-content");
        listItemRealImg.setAttribute('data-gifffer', item.local_file);
        listItemRealImg.classList.add("masonry-image");
        //listItemContent.style.backgroundImage = "url('" + item.local_file + "')";
        downloadButton.setAttribute("data-link", item.local_file);
        imgOverlay.innerHTML = `
            <span class="link-url">${window.document.location.origin + item.url}</span>
            <span class="share-link" data-link="${window.document.location.origin + item.url}">
              <svg width="15px" height="15px" viewBox="0 0 15 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="Without-upload" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="White-Details" transform="translate(-796.000000, -510.000000)" fill="#000000" fill-rule="nonzero">
                    <g id="Group-2" transform="translate(735.000000, 374.000000)">
                      <g id="Group-5" transform="translate(38.000000, 127.000000)">
                        <g id="noun-link-3015975" transform="translate(23.000000, 9.000000)">
                          <path d="M6.97943338,10.9679149 C7.20262861,10.7404371 7.56421925,10.741046 7.78680792,10.9689313 C8.00960558,11.1968151 8.00900922,11.5657932 7.78581241,11.7930577 C6.96253504,12.6315995 6.50736745,13.0954958 6.42117614,13.1835497 L5.60345456,14.0184486 C4.32164554,15.3271838 2.2431658,15.3271838 0.96135677,14.0184486 C-0.320452257,12.7095053 -0.320452257,10.5875725 0.96135677,9.27862923 L4.19060008,5.98155135 C5.47261299,4.67281622 7.55088885,4.67281622 8.83290176,5.98155135 C9.05569941,6.20923213 9.05569941,6.57820509 8.83290176,6.80588587 C8.60990532,7.03336369 8.24852366,7.03336369 8.02552722,6.80588587 C7.18950719,5.95230413 5.83399465,5.95230413 4.99797463,6.80588587 L1.76873131,10.1029638 C0.932711284,10.9565455 0.932711284,12.3405324 1.76873131,13.1941141 C2.60475134,14.0476959 3.96026387,14.0476959 4.7962839,13.1941141 L5.6138016,12.3592152 C5.70060965,12.2707866 6.15556826,11.807317 6.97945728,10.9679425 L6.97943338,10.9679149 Z" id="Path"></path>
                          <path d="M8.02047831,4.03208509 C7.79728678,4.25935994 7.43590601,4.25895402 7.21311714,4.03106867 C6.99052196,3.80318493 6.99091952,3.43420676 7.21411268,3.20673415 C8.03737642,2.36819234 8.49274035,1.90450418 8.57893023,1.8162421 L9.39643438,0.981551352 C10.6784261,-0.327183784 12.7566675,-0.327183784 14.0386592,0.981551352 C15.3204469,2.29028649 15.3204469,4.41242747 14.0386592,5.7211626 L10.8092655,9.01844865 C9.52747766,10.3271838 7.44903235,10.3271838 6.16724456,9.01844865 C5.94425181,8.79076787 5.94425181,8.42179491 6.16724456,8.19411413 C6.39023731,7.96643335 6.75161298,7.96643335 6.97460573,8.19411413 C7.81061191,9.04769587 9.16589811,9.04769587 10.0019553,8.19411413 L13.231349,4.89703625 C14.0673551,4.0434545 14.0673551,2.65946762 13.231349,1.80588587 C12.3953428,0.952304129 11.0398527,0.952304129 10.2038465,1.80588587 L9.38634237,2.64057662 C9.29953575,2.72920819 8.84458467,3.19268299 8.02050542,4.03205745 L8.02047831,4.03208509 Z" id="Path"></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </span>`;
      }

      downloadButton.innerHTML = `
        <svg width="14px" height="14px" viewBox="0 0 466 464" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Download-Icon" transform="translate(0.541910, 0.000000)" fill="#000000" fill-rule="nonzero">
                  <path d="M444.6397,322.978 L444.6397,421.4 C444.6397,423.3609 444.35622,425.1812 443.93825,426.8609 C441.97735,436.5211 433.43825,443.8019 423.36025,443.8019 L21.14025,443.797994 C10.35925,443.797994 1.40225,435.536294 0.28125,425.035994 C0,423.774294 0,422.657094 0,421.254794 L0,322.832794 C0,311.211794 9.5195,301.832794 21,301.832794 C26.7383,301.832794 32.059,304.211694 35.84,307.992994 C39.621,311.774294 42.0002,317.094594 42.0002,322.832994 L42.0002,401.652994 L402.7802,401.652994 L402.7802,322.832994 C402.7802,311.211994 412.2997,301.832794 423.7802,301.832794 C429.5185,301.832794 434.8392,304.211894 438.6202,307.993194 C442.2608,311.918994 444.6397,317.239294 444.6397,322.977194 L444.6397,322.978 Z" id="Path"></path>
                  <path d="M343.41747,224.418 L240.23747,327.598 C240.09685,327.87925 239.81559,328.01988 239.67888,328.15659 C235.89768,331.93779 230.99918,334.31679 226.10088,335.01599 C225.679,335.01599 225.26104,335.15661 224.83918,335.15661 C223.99934,335.29724 223.15948,335.29724 222.31968,335.29724 L219.94078,335.15661 C219.5189,335.15661 219.10094,335.01599 218.67908,335.01599 C213.63998,334.31677 208.87828,331.93789 205.10108,328.15659 C204.96046,328.01597 204.6792,327.73472 204.54249,327.598 L101.36249,224.418 C96.60079,219.6563 94.22189,213.359 94.22189,207.059 C94.22189,200.7582 96.60079,194.457 101.36249,189.7 C110.88199,180.1805 126.42149,180.1805 136.08149,189.7 L198.10149,251.72 L198.097584,24.5 C198.097584,11.059 209.156584,-2.84217094e-14 222.597584,-2.84217094e-14 C229.316384,-2.84217094e-14 235.476584,2.8008 239.956584,7.1406 C244.437084,11.6211 247.097184,17.6406 247.097184,24.4996 L247.097184,251.7196 L309.117184,189.6996 C318.636684,180.1801 334.176184,180.1801 343.836184,189.6996 C352.937784,199.3598 352.937784,214.8986 343.418214,224.4186 L343.41747,224.418 Z" id="Path"></path>
              </g>
          </g>
        </svg>
      `;

      listItemContent.append(downloadButton);
      listItemContent.append(listItemImg);
      listItemContent.append(listItemRealImg);
      listItemContent.append(imgOverlay);
      listItemA.append(listItemContent)
      listItem.append(listItemA);
      postsContainer.append(listItem);

      msnry.appended( listItem );
      imagesLoaded( '.post-list', () => {
        msnry.layout();

        Gifffer();
      });
    });

    const shareLinkButtons = document.querySelectorAll('span.share-link');
    if (shareLinkButtons) {
      Array.from(shareLinkButtons).forEach(function(element) {
        element.removeEventListener('click', onShareButtonClicked);
        element.addEventListener('click', onShareButtonClicked);
      });
    }

    const downloadButtons = document.querySelectorAll('span.download-img');
    if (downloadButtons) {
      Array.from(downloadButtons).forEach(function(element) {
        element.removeEventListener('click', onDownloadButtonClicked);
        element.addEventListener('click', onDownloadButtonClicked);
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
