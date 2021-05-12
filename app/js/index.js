const BASE_URL = "http://localhost:3000";

const cache = {};
let activePage = 1;
let isModalOpen = false;
let lastFocusedElement = null;

document.addEventListener("keydown", event => {
  const isTabPressed = event.key === 'Tab' || event.keyCode === 9;
  if (!isTabPressed) return;

  if (isModalOpen) {
    lastFocusedElement = document.activeElement;
    const focusableElements = "button";
    const modal = document.getElementById("modal");
    const firstFocusableElement = modal.querySelector(focusableElements);
    if (firstFocusableElement) {
      event.preventDefault();
      firstFocusableElement.focus();
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");
  searchForm.addEventListener("submit", handleSubmit);

  const imagesContainer = document.getElementById("images");
  imagesContainer.addEventListener("click", event => {
    if (!event.target.dataset.index) {
      return;
    }

    isModalOpen = true;
    const requestedImage = cache[activePage][event.target.dataset.index];
    const header = document.getElementById("header")
    const searchSection = searchForm.parentElement
    header.setAttribute("aria-hidden", true);
    searchSection.setAttribute("aria-hidden", true);

    const modal = document.createElement("div");
    const content = document.createElement("div");
    const underlay = document.createElement("div");
    const closeBtn = document.createElement("button");
    const figure = document.createElement("figure");
    const figcaption = document.createElement("figcaption");
    const img = document.createElement("img");
    const picture = document.createElement("picture");
    const source2x = document.createElement("source");
    const source3x = document.createElement("source");
    const source4x = document.createElement("source");
    const screenReaderDesc = document.createElement("div");
    const srBtnDesc = document.createElement("div");

    closeBtn.addEventListener("click", event => {
      isModalOpen = false;
      document.body.style.overflowY = "auto";
      event.target.parentElement.parentElement.remove();
      header.setAttribute("aria-hidden", false);
      searchSection.setAttribute("aria-hidden", false);
      if (lastFocusedElement) lastFocusedElement.focus();
    });
    underlay.addEventListener("click", event => {
      isModalOpen = false;
      document.body.style.overflowY = "auto";
      event.target.parentElement.remove();
      header.setAttribute("aria-hidden", false);
      searchSection.setAttribute("aria-hidden", false);
      if (lastFocusedElement) lastFocusedElement.focus();
    });

    closeBtn.innerText = "X";
    closeBtn.setAttribute("aria-describedby", "btnDesc");
    closeBtn.classList.add("modal__close-btn");
    content.classList.add("modal__content");
    img.src = `${requestedImage.urls.small}`;
    img.onload = function () {
      this.style.background = "none";
    }
    img.onerror = function () {
      this.parentElement.parentElement.innerHTML = `
      <h2>
        Oops, looks like something went wrong.
      <h2>
      <p>
        Please try again. It could be the internet connection too. If it persists, please contact us at <a href="mailto:help@shashin.com">help@shashin.com</a>.
      </p>
      `;
    }
    figcaption.innerText = `${requestedImage.description || ""}\nby ${requestedImage.user.username}`;
    modal.id = "modal";
    modal.setAttribute("aria-describedby", "modalDesc");
    modal.tabIndex = "1";
    modal.classList.add("modal");
    screenReaderDesc.id = "modalDesc";
    screenReaderDesc.classList.add("sr-only");
    screenReaderDesc.innerText = "This is a dialog window which overlays the main content of the page. It displays a larger and better quality version of the requested image, along with its description and author.";
    source2x.srcset = requestedImage.urls.regular;
    source2x.media = "(min-width: 400px)";
    source3x.srcset = requestedImage.urls.full;
    source3x.media = "(min-width: 1080px)";
    srBtnDesc.id = "btnDesc";
    srBtnDesc.innerText = "Modal's close button";
    srBtnDesc.classList.add("sr-only");
    underlay.classList.add("modal__underlay");

    picture.appendChild(source4x);
    picture.appendChild(source3x);
    picture.appendChild(source2x);
    picture.appendChild(img);
    figure.appendChild(picture);
    figure.appendChild(figcaption);
    closeBtn.appendChild(srBtnDesc);
    content.appendChild(closeBtn);
    content.appendChild(figure);
    modal.appendChild(screenReaderDesc);
    modal.appendChild(underlay);
    modal.appendChild(content);

    document.body.style.overflowY = "hidden";
    document.body.appendChild(modal);
  });
});

function handleSubmit(event) {
  event.preventDefault();
  const searchInput = document.getElementById("searchInput");
  const imagesContainer = document.getElementById("images");
  const query = searchInput.value;

  fetch(`${BASE_URL}/search/${encodeURI(query)}`)
    .then(r => r.json())
    .then(r => {
      // r = { photos: [], numOfPages: n }
      console.debug(r);

      if (!r.photos) {
        imagesContainer.innerHTML = `<h2 style="text-align: center;">Sorry, we couldn't find any pictures for ${query}.</h2>`;
        return;
      }

      cache[1] = r.photos;
      imagesContainer.innerHTML = "";
      imagesContainer.classList.add("images");

      for (let i = 0; i < r.photos.length; i++) {
        const photo = r.photos[i];
        imagesContainer.innerHTML += `
          <button class="image__container" data-index="${i}">
            <img 
              class="image" 
              srcset="${photo.urls.thumb}, ${photo.urls.small} 2x" src="${photo.urls.thumb}" 
              width="200" 
              height="200" 
              alt="${photo.description}${photo.user.username.length ? `by ${photo.user.username}` : ""}" 
              data-index="${i}"
            />
            </button>
          `;
      }
    })
    .catch(console.error);
}