const filterButtons = document.querySelectorAll('.filter-btn');
const cards = Array.from(document.querySelectorAll('.card'));
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDescription = document.getElementById('lightboxDescription');
const closeButton = document.getElementById('lightboxClose');
const prevButton = document.getElementById('prevBtn');
const nextButton = document.getElementById('nextBtn');

let visibleCards = [...cards];
let currentIndex = 0;

function updateGallery(filter) {
  visibleCards = cards.filter((card) => filter === 'all' || card.dataset.category === filter);

  cards.forEach((card) => {
    card.classList.toggle('is-hidden', !visibleCards.includes(card));
  });

  if (visibleCards.length === 0) {
    closeLightbox();
    return;
  }

  currentIndex = 0;
  closeLightbox();
}

function openLightbox(card) {
  const targetIndex = visibleCards.indexOf(card);
  if (targetIndex === -1) return;

  currentIndex = targetIndex;
  const selectedCard = visibleCards[currentIndex];

  lightboxImage.src = selectedCard.dataset.image;
  lightboxImage.alt = selectedCard.dataset.title;
  lightboxTitle.textContent = selectedCard.dataset.title;
  lightboxDescription.textContent = selectedCard.dataset.description;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

function showNext() {
  if (!visibleCards.length) return;
  currentIndex = (currentIndex + 1) % visibleCards.length;
  openLightbox(visibleCards[currentIndex]);
}

function showPrev() {
  if (!visibleCards.length) return;
  currentIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
  openLightbox(visibleCards[currentIndex]);
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    updateGallery(button.dataset.filter);
  });
});

cards.forEach((card) => {
  card.addEventListener('click', () => openLightbox(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox(card);
    }
  });
  card.setAttribute('tabindex', '0');
});

closeButton.addEventListener('click', closeLightbox);
prevButton.addEventListener('click', showPrev);
nextButton.addEventListener('click', showNext);

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('open')) return;

  if (event.key === 'Escape') {
    closeLightbox();
  } else if (event.key === 'ArrowRight') {
    showNext();
  } else if (event.key === 'ArrowLeft') {
    showPrev();
  }
});
