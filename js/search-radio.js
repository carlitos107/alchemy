'use strict';

(function () {
  const radioBtns = document.querySelector('.search__type-wrapper');

  radioBtns.addEventListener('click', (e) => {
    if (e.target.tagName === 'LABEL') {
      if (radioBtns.querySelector('input[name="search-type"]:checked')) {
        radioBtns
          .querySelector('.search__type-name--active')
          .classList.remove('search__type-name--active');
      }

      e.target.classList.add('search__type-name--active');
    }
  });
})();
