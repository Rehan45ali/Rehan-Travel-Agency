const destinations = [
  { name: "Kerala", type: "domestic", about: "Backwaters, hill stations & calm coastal escapes", image: "assets/kerala-photo.jpg" },
  { name: "Kashmir", type: "domestic", about: "Snowy peaks, shikara rides & scenic valleys", image: "assets/kashmir-photo.jpg" },
  { name: "North East", type: "domestic", about: "Lush mountains, waterfalls & rich local culture", image: "assets/north-east-photo.jpg" },
  { name: "Goa", type: "domestic", about: "Beaches, nightlife & relaxed holiday vibes", image: "assets/goa-photo.jpg" },
  { name: "Ooty", type: "domestic", about: "Tea gardens, cool weather & scenic hill drives", image: "assets/ooty-photo.jpg" },
  { name: "Andaman", type: "domestic", about: "Blue waters, island hopping & beach escapes", image: "assets/andaman-photo.jpg" },
  { name: "Darjeeling", type: "domestic", about: "Toy train charm, tea estates & Himalayan views", image: "assets/darjeeling-photo.jpg" },
  { name: "Paris", type: "international", about: "Romantic streets, icons & luxury stays", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85" },
  { name: "Dubai", type: "international", about: "Skyline, desert escapes & premium shopping", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85" },
  { name: "Santorini", type: "international", about: "Clifftop sunsets, whitewashed views & calm seas", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=85" },
  { name: "Maldives", type: "international", about: "Overwater villas, turquoise water & resort escapes", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=85" },
  { name: "Tokyo", type: "international", about: "Modern energy, culture & exceptional dining", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=85" },
  { name: "Singapore", type: "international", about: "Clean city breaks, family fun & skyline views", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85" },
  { name: "Bali", type: "international", about: "Beach villas, temples & tropical retreats", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85" },
  { name: "London", type: "international", about: "Classic city icons, shopping & culture", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=85" }
];

const grid = document.querySelector("#destination-grid");
const search = document.querySelector("#destination-search");
const count = document.querySelector("#destination-count");
const modal = document.querySelector("#query-modal");
const form = document.querySelector("#query-form");
const serviceSelect = document.querySelector("#query-service");
const routeForm = document.querySelector("#service-route");
const routeService = document.querySelector("#route-service");
const routeOrigin = document.querySelector("#route-origin");
const routeDestination = document.querySelector("#route-destination");
const nav = document.querySelector(".site-nav");
const toggle = document.querySelector(".nav-toggle");
let filter = "all";

function scheduleIdle(callback) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout: 3000 });
  } else {
    window.addEventListener('load', () => setTimeout(callback, 1000), { once: true });
  }
}

function render() {
  const query = search.value.trim().toLowerCase();
  const items = destinations.filter(destination => (filter === "all" || destination.type === filter) && `${destination.name} ${destination.about}`.toLowerCase().includes(query));
  count.textContent = `${items.length} popular destination${items.length === 1 ? "" : "s"}`;
  grid.innerHTML = items.length ? items.map(destination => `<article class="destination-card"><img src="${destination.image}" alt="${destination.name}" width="600" height="400" loading="lazy" style="aspect-ratio: 3 / 2; width: 100%; height: auto;" onerror="this.onerror=null;this.src='assets/travel-services-hero.webp'"><div class="destination-body"><span class="destination-type">${destination.type}</span><h3>${destination.name}</h3><p>${destination.about}</p><button data-book="${destination.name}">Book Now ↗</button></div></article>`).join("") : "<p>No destination found. Send us a custom request on WhatsApp.</p>";
}

function openModal(service = "Holiday package") {
  serviceSelect.value = service;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setTimeout(() => form.elements.name.focus(), 100);
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

if (routeForm) {
  routeForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!routeForm.reportValidity()) return;
    const text = ["Hello Rehan Travel Agency, I would like a route quote.", "", `Service: ${routeService.value}`, `From: ${routeOrigin.value}`, `To: ${routeDestination.value}`].join("\n");
    window.open(`https://wa.me/918178054327?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });
}

search.addEventListener("input", render);
document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
  filter = button.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach(item => item.classList.toggle("is-active", item === button));
  render();
}));

grid.addEventListener("click", event => {
  const button = event.target.closest("[data-book]");
  if (!button) return;
  const destination = destinations.find(item => item.name === button.dataset.book);
  const text = ["Hello Rehan Travel Agency, I would like to book a trip.", "", `Destination: ${destination.name}`, `Type: ${destination.type}`, `Interested in: ${destination.about}`].join("\n");
  window.open(`https://wa.me/918178054327?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
});

document.querySelectorAll("[data-open-query]").forEach(button => button.addEventListener("click", () => openModal()));
document.querySelectorAll("[data-service]").forEach(button => button.addEventListener("click", () => openModal(button.dataset.service)));
document.querySelectorAll("[data-close-query]").forEach(button => button.addEventListener("click", closeModal));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });

form.addEventListener("submit", event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const text = ["Hello Rehan Travel Agency, I would like a booking quote.", "", `Name: ${data.get("name")}`, `Phone: ${data.get("phone")}`, `Service: ${data.get("service")}`, `Origin: ${data.get("origin") || "Not decided"}`, `Destination: ${data.get("destination") || "Not decided"}`, `Travellers: ${data.get("travellers")}`, `Message: ${data.get("message") || "None"}`].join("\n");
  window.open(`https://wa.me/918178054327?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  closeModal();
});

if (toggle) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  nav.querySelectorAll("a,button").forEach(item => item.addEventListener("click", () => nav.classList.remove("is-open")));
}

scheduleIdle(render);

/* 3D parallax & tilt enhancements */
scheduleIdle(() => (function(){
  const heroContent = document.querySelector('.hero-content');
  const gallery = document.querySelector('.gallery-track');
  let mouseX = 0, mouseY = 0, framePending = false;

  function onMove(e){
    const cx = (e.clientX ?? (e.touches && e.touches[0].clientX)) - window.innerWidth/2;
    const cy = (e.clientY ?? (e.touches && e.touches[0].clientY)) - window.innerHeight/2;
    mouseX = cx; mouseY = cy;
    if (!framePending) {
      framePending = true;
      requestAnimationFrame(update);
    }
  }

  function update(){
    framePending = false;
    const ry = (mouseX / window.innerWidth) * 12; // rotateY
    const rx = (mouseY / window.innerHeight) * -8; // rotateX
    if (heroContent) heroContent.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    if (gallery) gallery.style.transform = `translateX(${-(mouseX/60)}px) translateY(${-(mouseY/120)}px) rotateY(${ry/3}deg)`;
    if (routeForm) routeForm.style.transform = `rotateX(${rx/3}deg) rotateY(${ry/3}deg)`;
  }

  window.addEventListener('pointermove', onMove, {passive:true});
})());

// Handle Book Now overlay clicks in the service gallery
document.addEventListener('click', (e) => {
  if (!(e.target instanceof Element)) return;
  const btn = e.target.closest('.book-now-overlay');
  if (!btn) return;
  const service = btn.dataset.service || 'Service booking';
  const text = [`Hello Rehan Travel Agency, I would like to book a service.`, ``, `Service: ${service}`].join('\n');
  window.open(`https://wa.me/918178054327?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
});

// Defer non-critical visitor tracking until the initial render is idle.
function updateVisitorCount() {
  fetch('https://counterapi.dev/v1/rehan-travel-agency/site-visitors/up')
    .then(res => res.json())
    .then(data => {
      const el = document.getElementById('visitor-count');
      if (el) el.textContent = data.count.toLocaleString();
    })
    .catch(() => {
      const el = document.getElementById('visitor-count');
      if (el) el.textContent = '1,000+';
    });
}

scheduleIdle(updateVisitorCount);

// Inject overlay layers + Book Now button into all gallery figures (if not already present)
scheduleIdle(() => {
  const figures = document.querySelectorAll('.gallery-track > figure');
  figures.forEach(fig => {
    if (fig.querySelector('.overlay-layers')) return; // already injected
    const img = fig.querySelector('img');
    const caption = fig.querySelector('figcaption')?.textContent?.trim() || img?.alt || 'Service';
    const overlay = document.createElement('div');
    overlay.className = 'overlay-layers';
    overlay.setAttribute('aria-hidden', 'false');
    overlay.innerHTML = `
      <div class="layer layer-back"></div>
      <div class="layer layer-front"></div>
      <button class="book-now-overlay" type="button" data-service="${caption}">Book Now</button>
    `;
    fig.appendChild(overlay);
  });
});
