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
const articleModal = document.querySelector("#article-modal");
const articleCategory = document.querySelector("#article-category");
const articleTitle = document.querySelector("#article-title");
const articleIntro = document.querySelector("#article-intro");
const articleCopy = document.querySelector("#article-copy");
const form = document.querySelector("#query-form");
const serviceSelect = document.querySelector("#query-service");
const routeForm = document.querySelector("#service-route");
const routeService = document.querySelector("#route-service");
const routeOrigin = document.querySelector("#route-origin");
const routeDestination = document.querySelector("#route-destination");
const nav = document.querySelector(".site-nav");
const toggle = document.querySelector(".nav-toggle");
let filter = "all";

const articles = {
  package: {
    category: "Planning guide · 5 min read",
    title: "How to choose the right holiday package",
    intro: "A good package should make your trip easier, not squeeze you into someone else's schedule.",
    copy: "<p>Start with the feeling you want from the trip: a relaxed beach break, a packed sightseeing holiday, or a slower cultural escape. Then compare the number of nights, hotel location, transfers and meals instead of looking only at the headline price.</p><p>Check what is included and what is not, especially airport transfers, activities, local transport and cancellation terms. Share your dates, budget and preferred pace with our team and we can shortlist options that fit the way you actually want to travel.</p>"
  },
  flight: {
    category: "Flight tips · 4 min read",
    title: "Simple ways to make flight booking smoother",
    intro: "A few details checked before payment can save time, money and stress later.",
    copy: "<p>Keep a little flexibility around your departure date if possible. Comparing nearby airports, one-stop routes and different departure times can reveal better combinations without changing the destination.</p><p>Before confirming, check baggage allowance, airport terminals, layover duration, name spelling and change rules. Send us your origin, destination and preferred dates and we will compare practical options for you.</p>"
  },
  domestic: {
    category: "Destination ideas · 6 min read",
    title: "Domestic escapes worth planning this season",
    intro: "India has an escape for every kind of break, from cool hills to slow coastal mornings.",
    copy: "<p>For a short reset, choose a destination with simple connections and keep the itinerary focused on one region. Hill stays in Kashmir, Ooty or Darjeeling work well for scenic days, while Goa and Andaman suit travellers looking for sun and water.</p><p>Leave room for local food, weather changes and unplanned stops. Tell us how many days you have and whether you prefer nature, beaches, culture or family-friendly activities, and we will help shape the route.</p>"
  }
};

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

function openArticle(articleId) {
  const article = articles[articleId];
  if (!article || !articleModal) return;
  articleCategory.textContent = article.category;
  articleTitle.textContent = article.title;
  articleIntro.textContent = article.intro;
  articleCopy.innerHTML = article.copy;
  articleModal.classList.add("is-open");
  articleModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  articleModal.querySelector(".article-close").focus();
}

function closeArticle() {
  if (!articleModal) return;
  articleModal.classList.remove("is-open");
  articleModal.setAttribute("aria-hidden", "true");
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
document.querySelectorAll("[data-article]").forEach(button => button.addEventListener("click", () => openArticle(button.dataset.article)));
document.querySelectorAll("[data-close-article]").forEach(button => button.addEventListener("click", closeArticle));
document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  if (articleModal?.classList.contains("is-open")) closeArticle();
  else closeModal();
});

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
    if (fig.getAttribute('aria-hidden') === 'true' || fig.querySelector('.overlay-layers')) return; // decorative copies stay out of the accessibility tree
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

// Ali provides quick answers from the site's travel services and hands detailed requests to WhatsApp.
const aliChat = document.querySelector('#ali-chat');
const aliPanel = document.querySelector('#ali-panel');
const aliLauncher = document.querySelector('.ali-launcher');
const aliClose = document.querySelector('.ali-close');
const aliMessages = document.querySelector('#ali-messages');
const aliForm = document.querySelector('#ali-form');
const aliInput = document.querySelector('#ali-input');
const aliReplies = [
  { terms: ['service', 'offer', 'provide', 'help'], answer: 'We can help with flights, railway and bus tickets, hotels, holiday packages and visa assistance. Tell me your route and dates, and I can point you to the right next step.' },
  { terms: ['book', 'booking', 'quote', 'enquiry'], answer: 'To get a quote, share your origin, destination, dates and traveller count. You can also use the enquiry form or continue with a travel expert on WhatsApp.' },
  { terms: ['budget', 'cost', 'price', 'cheap'], answer: 'Yes, we can plan around your budget. Share an approximate amount, dates and the kind of trip you prefer, and the team can compare suitable options.' },
  { terms: ['destination', 'suggest', 'where', 'trip'], answer: 'For beaches, consider Goa, Andaman or the Maldives. For hills, Kashmir, Ooty and Darjeeling are lovely. Tell me your travel month and I can narrow it down.' },
  { terms: ['visa', 'passport'], answer: 'We provide visa assistance for international travel. Requirements depend on your passport and destination, so a travel expert should confirm the current checklist.' },
  { terms: ['change', 'cancel', 'refund'], answer: 'Change and cancellation rules depend on the provider. Contact the team as soon as plans change so they can explain the options for your booking.' }
];

function toggleAli(open) {
  const isOpen = open ?? !aliPanel.classList.contains('is-open');
  aliPanel.classList.toggle('is-open', isOpen);
  aliPanel.setAttribute('aria-hidden', String(!isOpen));
  aliLauncher.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) aliInput.focus();
}

function addAliMessage(text, type) {
  const message = document.createElement('div');
  message.className = `ali-message ali-message--${type}`;
  message.textContent = text;
  aliMessages.appendChild(message);
  aliMessages.scrollTop = aliMessages.scrollHeight;
}

function askAli(text) {
  const message = text.trim();
  if (!message) return;
  addAliMessage(message, 'user');
  aliInput.value = '';
  const normalized = message.toLowerCase();
  const match = aliReplies.find(item => item.terms.some(term => normalized.includes(term)));
  window.setTimeout(() => addAliMessage(match?.answer || 'I can help with services, destinations, budgets and booking questions. For a personalised answer, share your origin, destination and travel dates, or continue with our travel expert on WhatsApp.', 'bot'), 280);
}

if (aliChat) {
  aliLauncher.addEventListener('click', () => toggleAli());
  aliClose.addEventListener('click', () => toggleAli(false));
  aliForm.addEventListener('submit', event => { event.preventDefault(); askAli(aliInput.value); });
  aliChat.querySelectorAll('[data-ali-prompt]').forEach(button => button.addEventListener('click', () => askAli(button.dataset.aliPrompt)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') toggleAli(false); });
}
