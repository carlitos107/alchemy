(function () {
  //
  //model
  //

  const getListAll = (prop) => {
    const list = [];

    alchemyOrigin.forEach((item) => {
      if (!list.includes(item[prop])) {
        list.push(item[prop]);
      }
    });

    return list.sort();
  };

  const getEffect = (effect, sort = ['ingredient', 'desc']) => {
    const res = alchemyOrigin.filter(item => item.effect === effect);

    if (sort.includes('ingredient')) {
      const sorting = (a, b) => {
        const nameA = a.ingredient;
        const nameB = b.ingredient;

        if (nameA < nameB) return -1;
        if (nameA == nameB) return 0;
        if (nameA > nameB) return 1;
      }

      if (sort.includes('desc')) return res.sort((a, b) => sorting(a, b));
      if (sort.includes('asc')) return res.sort((a, b) => sorting(b, a));
    }

    if (sort.includes('power')) {
      if (sort.includes('desc')) res.sort((a, b) => a.power - b.power)
      if (sort.includes('asc')) res.sort((a, b) => b.power - a.power)
    }

    if (sort.includes('time')) {
      if (sort.includes('desc')) res.sort((a, b) => a.time - b.time)
      if (sort.includes('asc')) res.sort((a, b) => b.time - a.time)
    }

    return res;
  };

  const getIngredient = (ingredient) => {
    const arr = alchemyOrigin.filter(item => item.ingredient === ingredient);

    const res = {
      id: arr[0].id,
      ingredient: arr[0].ingredient,
      ingredientEn: arr[0].ingredientEn,
      effects: []
    };

    arr.forEach(item => {
      res.effects.push({
        effect: item.effect,
        effectEn: item.effectEn,
        power: item.power,
        time: item.time
      })
    })

    return res;
  };

  const getSame = (type, val) => {
    return getListAll(type).filter(item => {
      return item.substring(0, val.length) === inputCapitalize(val);
    })
  }

  //
  //view
  //

  const content = document.querySelector('.content');

  const showListAll = (list, type) => {
    content.innerHTML = '';

    const ul = document.createElement('ul');
    ul.classList.add('show-all__list');
    content.appendChild(ul);

    list.forEach((element) => {
      const li = document.createElement('li');
      li.classList.add('show-all__item');
      ul.appendChild(li);

      const a = document.createElement('a');
      a.setAttribute('href', '#');
      a.dataset.type = type;
      a.innerHTML = element;
      li.appendChild(a);
    });
  };


  const showEffectList = (list, parent) => {
    parent.innerHTML = ``;

    list.forEach((item) => {
      const tr = document.createElement('tr');
      tr.classList.add('show-effect__item');

      tr.innerHTML = `
        <td><a href=# data-type="ingredient">${item.ingredient}</a></td>
        <td><span>${item.power}</span></td>
        <td><span>${item.time}</span></td>
      `;

      parent.appendChild(tr);
    });
  }

  const showEffect = list => {
    content.innerHTML = '';

    const div = document.createElement('div');
    div.classList.add('show-effect');
    div.innerHTML = `
      <h2 class="show-effect__title">${list[0].effect}</h2>
      <span class="show-effect__title-en">${list[0].effectEn}</span>
    `;
    content.appendChild(div);

    const table = document.createElement('table');
    table.classList.add('show-effect__table');
    table.innerHTML = `<thead><tr>
      <th><button type="button" class="sort-btn sort-btn--desc" data-sortby="ingredient">
        Ингредиент
      </button></th>
      <th><button type="button" class="sort-btn" data-sortby="power">
        Сила
      </button></th>
      <th><button type="button" class="sort-btn" data-sortby="time">
        Время
      </button></th>
    </tr></thead>`;
    div.appendChild(table);

    const tbody = document.createElement('tbody');
    tbody.classList.add('show-effect__list');
    table.appendChild(tbody);

    showEffectList(list, tbody);
  };

  const showIngredient = (ingredient) => {
    content.innerHTML = '';

    const div = document.createElement('div');
    div.classList.add('show-ingredient');
    content.appendChild(div);
    div.innerHTML = `
      <h2 class="show-ingredient__title">${ingredient.ingredient}</h2>
      <span class="show-ingredient__title-en">${ingredient.ingredientEn}</span>
    `;

    const ul = document.createElement('ul');
    ul.classList.add('show-ingredient__list');
    div.appendChild(ul);

    ingredient.effects.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('show-ingredient__effect');
      li.innerHTML = `
        <a href=# data-type="effect">${item.effect}</a>
        <span>Сила: ${item.power}</span>
        <span>Время: ${item.time}</span>
      `;
      ul.appendChild(li);
    });
  };

  const showTips = (list, parent) => {
    list.forEach(item => {
      const span = document.createElement('span');
      span.textContent = item;
      parent.appendChild(span);
    })
  };

  //
  //listeners
  //

  const sidebarList = document.querySelector('.sidebar__list');

  const onContentClick = (e) => {
    if (e.target.tagName === 'A' && e.target.dataset.type) {
      e.preventDefault();
      const typeOne = e.target.dataset.type;

      if (typeOne === 'effect') {
        showEffect(getEffect(e.target.textContent));
      }
      if (typeOne === 'ingredient') {
        showIngredient(getIngredient(e.target.textContent));
      }
    }

    if (e.target.tagName === 'BUTTON' && e.target.dataset.sortby) {
      e.preventDefault();


      const effect = content.querySelector('.show-effect__title').textContent;
      const listEl = content.querySelector('.show-effect__list');
      let sortdir;

      if (document.querySelector('.sort-btn--desc')) {
        document.querySelector('.sort-btn--desc').classList.remove('sort-btn--desc');
        e.target.classList.add('sort-btn--asc');
        sortdir = 'asc';
      } else if (document.querySelector('.sort-btn--asc')) {
        document.querySelector('.sort-btn--asc').classList.remove('sort-btn--asc');
        e.target.classList.add('sort-btn--desc');
        sortdir = 'desc';
      }

      const sort = [e.target.dataset.sortby, sortdir];
      const listArr = getEffect(effect, sort);

      showEffectList(listArr, listEl);
    }
  }

  const inputCapitalize = val => val[0].toUpperCase() + val.substring(1).toLowerCase();

  const textInput = document.querySelector('.search__text-input');

  textInput.addEventListener('input', () => {
    const tipField = document.querySelector('.search__input-tip');
    tipField.innerHTML = ``;

    const radio = document.querySelector('[name="search-type"]:checked').value;
    const val = textInput.value;

    if (radio && val) {
      showTips(getSame(radio, val), tipField);

      tipField.addEventListener('click', e => {
        if (e.target.tagName === 'SPAN') {
          textInput.value = e.target.textContent;
          tipField.innerHTML = ``;
        }
      })
    } else {
      tipField.innerHTML = ``;
    }
  })

  sidebarList.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && e.target.dataset.type) {
      e.preventDefault();

      const typeAll = e.target.dataset.type;
      showListAll(getListAll(typeAll), typeAll);

      content.addEventListener('click', (e) => {
        onContentClick(e);
      });
    }

    if (e.target.tagName === 'BUTTON') {
      e.preventDefault();

      const radioBtn = document.querySelector('[name="search-type"]:checked');
      const input = document.querySelector('.search__text-input');

      if (radioBtn && input.value) {
        if (radioBtn.value === 'ingredient') showIngredient(getIngredient(inputCapitalize(input.value)));
        if (radioBtn.value === 'effect') showEffect(getEffect(inputCapitalize(input.value)));

        input.value = '';
      }
    }
  });
})();
