const url = `https://api.github.com/search/`;

let inputRep = document.querySelector(".search__input");
let expandMenu = document.querySelector(".search__expandMenu");
let search_results = document.querySelector(".search-results");
let expandMenuUl = document.createElement("ul");
expandMenuUl.classList.add("menuUl");

let inputValue;
let repositories;

//fetch
const searchFetch = (inputValue) => {
  fetch(`${url}repositories?q=${inputValue}&per_page=5`, {
    method: "GET",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28", // Добавление токена для аутентификации (если нужно)
    },
  })
    .then((response) => response.json()) // Парсим ответ в формате JSON
    .then((data) => {
      console.log("repositories: ", data);
      return data.items;
    })
    // изменение выпадающего списка
    .then((data) => {
      let liCollection = document.querySelectorAll("li");
      if (liCollection.length !== 0) {
        for (i = 0; i < liCollection.length; i++) {
          liCollection[i].remove();
        }
      }
      data.forEach((item) => {
        createExpandElement(item.name, item);
      });
      expandMenu.classList.remove("search__expandMenu-display--none");
      if (inputRep.value == "") {
        expandMenu.classList.add("search__expandMenu-display--none");
      }
    })
    .catch((error) => {
      console.error("Ошибка при получении данных:", error);
    });
};

// функция задержки
const debounce = (fn, debounceTime) => {
  console.log("debounce");
  let timer;
  console.log(debounceTime);
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
};

// функция создания меню
// creating expand menu elemrnts
function createExpandElement(name, repo) {
  let expandMenuUlLi = document.createElement("li");
  expandMenuUlLi.classList.add("expandMenuUlLi");
  expandMenuUlLi.textContent = name;
  expandMenu.appendChild(expandMenuUl);
  expandMenuUl.appendChild(expandMenuUlLi);
  // добавление элемента в results
  expandMenuUlLi.addEventListener("click", function () {
    console.log("click");

    let results_element = document.createElement("div");
    let element_wraper = document.createElement("div");
    let element_left = document.createElement("div");
    let element_right = document.createElement("div");
    let element_h = document.createElement("h3");
    let element_owener = document.createElement("div");
    let element_stars = document.createElement("div");
    let element_button = document.createElement("button");
    results_element.classList.add("results_element");
    element_wraper.classList.add("element_wraper");
    element_button.classList.add("element_button");
    element_right.classList.add("element_right");
    element_button.textContent = "x";
    element_h.textContent = `${expandMenuUlLi.textContent}`;
    element_owener.textContent = `author: ${repo.owner.login}`;
    element_stars.textContent = `stars: ${repo.stargazers_count};`;
    // results_element
    search_results.appendChild(results_element);
    results_element.appendChild(element_wraper);
    element_wraper.appendChild(element_left);
    element_wraper.appendChild(element_right);
    element_left.appendChild(element_h);
    element_left.appendChild(element_owener);
    element_left.appendChild(element_stars);
    element_right.appendChild(element_button);
    element_button.addEventListener("click", () => {
      results_element.remove();
    });
    expandMenu.classList.add("search__expandMenu-display--none");
    inputRep.value = "";
  });
}

// функция для eventlistener
function onKeyDown() {
  inputValue = inputRep.value;
  console.log(inputValue);

  searchFetch(inputValue);
}

inputRep.addEventListener("input", debounce(onKeyDown, 500));
