// Import required data from './data.js'
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

// Initialize variables
let page = 1;
let matches = books;

// Render initial book list
function createBookPreviews(matches, authors) {
  // Create a document fragment to store the book preview elements
  const starting = document.createDocumentFragment();

  // Loop through each book in the matches array, up to a certain number (BOOKS_PER_PAGE)
  for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
    // Create a button element for the book preview
    const element = document.createElement('button');
    element.classList = 'preview'; // Add the 'preview' class to the button
    element.setAttribute('data-preview', id); // Set the 'data-preview' attribute to the book's id

    // Create an image element for the book preview
    const imageElement = document.createElement('img');
    imageElement.classList = 'preview__image'; // Add the 'preview__image' class to the image
    imageElement.src = image; // Set the image source to the book's image
    element.appendChild(imageElement); // Append the image element to the button

    // Create a div element for the book info
    const infoElement = document.createElement('div');
    infoElement.classList = 'preview__info'; // Add the 'preview__info' class to the div
    element.appendChild(infoElement); // Append the info div to the button

    // Create an h3 element for the book title
    const titleElement = document.createElement('h3');
    titleElement.classList = 'preview__title'; // Add the 'preview__title' class to the h3
    titleElement.textContent = title; // Set the text content of the h3 to the book's title
    infoElement.appendChild(titleElement); // Append the title element to the info div

    // Create a div element for the author
    const authorElement = document.createElement('div');
    authorElement.classList = 'preview__author'; // Add the 'preview__author' class to the div
    authorElement.textContent = authors[author]; // Set the text content of the div to the book's author
    infoElement.appendChild(authorElement); // Append the author element to the info div

    // Append the book preview element to the starting fragment
    starting.appendChild(element);
  }

  // Return the created document fragment
  return starting;
}

// Usage:
// Call the createBookPreviews function with the matches and authors parameters
const startingFragment = createBookPreviews(matches, authors);

// Append the startingFragment to the desired container element
document.querySelector('[data-list-items]').appendChild(startingFragment);






// Generate options for search form
const generateOptions = (data, container, defaultValue, defaultLabel) => {
  const optionsHtml = document.createDocumentFragment();
  const firstOptionElement = document.createElement('option');
  firstOptionElement.value = defaultValue;
  firstOptionElement.innerText = defaultLabel;
  optionsHtml.appendChild(firstOptionElement);

  for (const [id, name] of Object.entries(data)) {
    const element = document.createElement('option');
    element.value = id;
    element.innerText = name;
    optionsHtml.appendChild(element);
  }

  document.querySelector(container).appendChild(optionsHtml);
};

// Append genre options to the search form
generateOptions(genres, '[data-search-genres]', 'any', 'All Genres');

// Append author options to the search form
generateOptions(authors, '[data-search-authors]', 'any', 'All Authors');

// Set the theme based on user's preference
const setTheme = (theme, darkColor, lightColor) => {
  document.querySelector('[data-settings-theme]').value = theme;
  document.documentElement.style.setProperty('--color-dark', darkColor);
  document.documentElement.style.setProperty('--color-light', lightColor);
};

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  setTheme('night', '255, 255, 255', '10, 10, 20');
} else {
  setTheme('day', '10, 10, 20', '255, 255, 255');
}




const setListButtonState = () => {
    const listButton = document.querySelector('[data-list-button]');
    listButton.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;
    listButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0;
  };
  
  const addEventListener = (selector, event, callback) => {
    document.querySelector(selector).addEventListener(event, callback);
  };
  
  const hideOverlay = (selector) => {
    document.querySelector(selector).open = false;
  };
  
  const showSearchOverlay = () => {
    const searchOverlay = document.querySelector('[data-search-overlay]');
    const searchTitle = document.querySelector('[data-search-title]');
    searchOverlay.open = true;
    searchTitle.focus();
  };
  
  const showSettingsOverlay = () => {
    document.querySelector('[data-settings-overlay]').open = true;
  };
  
  const handleSettingsSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);
  
    if (theme === 'night') {
      document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
      document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
      document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
      document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
  
    hideOverlay('[data-settings-overlay]');
  };
  
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];
  
    for (const book of books) {
      let genreMatch = filters.genre === 'any';
  
      for (const singleGenre of book.genres) {
        if (genreMatch) break;
        if (singleGenre === filters.genre) {
          genreMatch = true;
        }
      }
  
      if (
        (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === 'any' || book.author === filters.author) &&
        genreMatch
      ) {
        result.push(book);
      }
    }
  
    page = 1;
    matches = result;
  
    const listMessage = document.querySelector('[data-list-message]');
    const listItems = document.querySelector('[data-list-items]');
    const listButton = document.querySelector('[data-list-button]');
    const newItems = document.createDocumentFragment();
  
    if (result.length < 1) {
      listMessage.classList.add('list__message_show');
    } else {
      listMessage.classList.remove('list__message_show');
    }
  
    listItems.innerHTML = '';
  
    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
      const element = document.createElement('button');
      element.classList = 'preview';
      element.setAttribute('data-preview', id);
  
      element.innerHTML = `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
        </div>
      `;
  
      newItems.appendChild(element);
    }
  
    listItems.appendChild(newItems);
  
    listButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1;
    listButton.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `;
  
    window.scrollTo({ top: 0, behavior: 'smooth' });
  
    hideOverlay('[data-search-overlay]');
  };
  
  const handleListButtonClick = () => {
    const fragment = document.createDocumentFragment();
  
    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
      const element = document.createElement('button');
      element.classList = 'preview';
      element.setAttribute('data-preview', id);
  
      element.innerHTML = `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
        </div>
      `;
  
      fragment.appendChild(element);
    }
  
    document.querySelector('[data-list-items]').appendChild(fragment);
  
    page += 1;
  };
  
  const handleListItemsClick = (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;
  
    for (const node of pathArray) {
      if (active) break;
  
      if (node?.dataset?.preview) {
        let result = null;
  
        for (const singleBook of books) {
          if (result) break;
          if (singleBook.id === node?.dataset?.preview) result = singleBook;
        }
  
        active = result;
      }
    }
  
    if (active) {
      document.querySelector('[data-list-active]').open = true;
      document.querySelector('[data-list-blur]').src = active.image;
      document.querySelector('[data-list-image]').src = active.image;
      document.querySelector('[data-list-title]').innerText = active.title;
      document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
      document.querySelector('[data-list-description]').innerText = active.description;
    }
  };
  
  addEventListener('[data-search-cancel]', 'click', () => {
    hideOverlay('[data-search-overlay]');
  });
  
  addEventListener('[data-settings-cancel]', 'click', () => {
    hideOverlay('[data-settings-overlay]');
  });
  
  addEventListener('[data-header-search]', 'click', showSearchOverlay);
  
  addEventListener('[data-header-settings]', 'click', showSettingsOverlay);
  
  addEventListener('[data-settings-form]', 'submit', handleSettingsSubmit);
  
  addEventListener('[data-search-form]', 'submit', handleSearchSubmit);
  
  addEventListener('[data-list-button]', 'click', handleListButtonClick);
  
  addEventListener('[data-list-items]', 'click', handleListItemsClick);
  