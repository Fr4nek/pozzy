// Pobieranie danych
let newsData = [];
let currentCardIndex = 0;
let deferredPrompt;

// Załaduj wiadomości
async function loadNews() {
  const response = await fetch('news.json');
  newsData = await response.json();
  renderCards();
  setupDots();
  updateDots();
}

// Render kart
function renderCards() {
  const slider = document.getElementById('cardSlider');
  slider.innerHTML = '';

  newsData.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <h2>${item.title}</h2>
    `;
    card.addEventListener('click', () => openModal(index));
    slider.appendChild(card);
  });
}

// Obsługa modalu
function openModal(index) {
  const modal = document.getElementById('newsModal');
  const data = newsData[index];
  document.getElementById('modalImage').src = data.image;
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalBody').textContent = data.body;
  modal.style.display = 'flex';
}

document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('newsModal').style.display = 'none';
});

window.addEventListener('click', (e) => {
  const modal = document.getElementById('newsModal');
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Przewijanie kart
const slider = document.getElementById('cardSlider');
let isDragging = false;
let startX, currentX;
let currentIndex = 0;

function updateSlider() {
    slider.style.transition = 'transform 0.5s ease';
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  }

slider.addEventListener('mousedown', startDrag);
slider.addEventListener('touchstart', startDrag);

function startDrag(e) {
  isDragging = true;
  startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  slider.style.transition = 'none';
}

document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag);

function drag(e) {
  if (!isDragging) return;
  e.preventDefault();
  currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
  const diff = currentX - startX;
  slider.style.transform = `translateX(${Math.max(Math.min(diff - currentIndex * 100, 0), -400)}%)`;
}

document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag);

function endDrag() {
  if (!isDragging) return;
  isDragging = false;
  slider.style.transition = 'transform 0.5s ease';

  const diff = currentX - startX;
  if (diff < -50 && currentIndex < newsData.length - 1) {
    currentIndex++;
  } else if (diff > 50 && currentIndex > 0) {
    currentIndex--;
  }
  updateSlider();
}

// Strzałki
document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });
  
  document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentIndex < newsData.length - 1) {
      currentIndex++;
      updateSlider();
    }
  });

// Kropki
function setupDots() {
  const dotsContainer = document.getElementById('dotsContainer');
  dotsContainer.innerHTML = '';
  newsData.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = i === 0 ? 'dot active' : 'dot';
    dot.addEventListener('click', () => {
      currentIndex = i;
      updateSlider();
    });
    dotsContainer.appendChild(dot);
  });
}

function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

// Instalacja PWA
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBtn').style.display = 'block';
});

document.getElementById('installBtn').addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('Użytkownik zainstalował aplikację');
    }
    deferredPrompt = null;
    document.getElementById('installBtn').style.display = 'none';
  }
});

// Inicjalizacja
loadNews();