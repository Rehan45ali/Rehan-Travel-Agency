const destinations = [
  { name: "Kashmir", type: "domestic", about: "Srinagar, Gulmarg & Pahalgam", image: "assets/kashmir-photo.jpg" },
  { name: "Goa", type: "domestic", about: "Beaches, stays & coastal food", image: "assets/goa-photo.jpg" },
  { name: "Kerala", type: "domestic", about: "Backwaters, tea hills & beaches", image: "assets/kerala-photo.jpg" },
  { name: "Darjeeling", type: "domestic", about: "Tea gardens & Himalayan views", image: "assets/darjeeling-photo.jpg" },
  { name: "Dubai", type: "international", about: "City stays, desert & shopping", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80" },
  { name: "Bali", type: "international", about: "Beaches, temples & island stays", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80" },
  { name: "Singapore", type: "international", about: "City breaks & family trips", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=80" },
  { name: "Paris", type: "international", about: "Culture, cafés & city sights", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80" }
];

const whatsAppNumber = "918178054327";
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
const routeDate = document.querySelector("#route-date");
const routeTravellers = document.querySelector("#route-travellers");
const nav = document.querySelector(".site-nav");
const toggle = document.querySelector(".nav-toggle");
let filter = "all";

function openWhatsApp(lines) {
  window.open(`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
}

function render() {
  const query = search.value.trim().toLowerCase();
  const items = destinations.filter(item => (filter === "all" || item.type === filter) && `${item.name} ${item.about}`.toLowerCase().includes(query));
  count.textContent = `${items.length} destination${items.length === 1 ? "" : "s"} found`;
  grid.innerHTML = items.length ? items.map(item => `<article class="destination-card"><img src="${item.image}" alt="${item.name}" loading="lazy"><div class="destination-body"><span class="destination-type">${item.type}</span><h3>${item.name}</h3><p>${item.about}</p><button data-book="${item.name}">Book now →</button></div></article>`).join("") : "<p>No destination found. Please send us a custom enquiry.</p>";
}

function openModal(service = "Holiday package") {
  serviceSelect.value = service;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  window.setTimeout(() => form.elements.name.focus(), 50);
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

routeForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!routeForm.reportValidity()) return;
  openWhatsApp(["Hello Rehan Travel Agency, I would like a travel quote.", "", `Service: ${routeService.value}`, `From: ${routeOrigin.value}`, `To: ${routeDestination.value}`, `Departure: ${routeDate.value || "Not decided"}`, `Travellers: ${routeTravellers.value}`]);
});

document.querySelectorAll("[data-route-service]").forEach(button => button.addEventListener("click", () => {
  routeService.value = button.dataset.routeService;
  document.querySelectorAll("[data-route-service]").forEach(item => item.classList.toggle("is-active", item === button));
}));

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
  openWhatsApp(["Hello Rehan Travel Agency, I would like to book a trip.", "", `Destination: ${destination.name}`, `Package type: ${destination.type}`, `Interested in: ${destination.about}`]);
});

document.querySelectorAll("[data-open-query]").forEach(button => button.addEventListener("click", () => openModal()));
document.querySelectorAll("[data-service]").forEach(button => button.addEventListener("click", () => openModal(button.dataset.service)));
document.querySelectorAll("[data-close-query]").forEach(button => button.addEventListener("click", closeModal));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });

form.addEventListener("submit", event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  openWhatsApp(["Hello Rehan Travel Agency, I would like a booking quote.", "", `Name: ${data.get("name")}`, `Phone: ${data.get("phone")}`, `Service: ${data.get("service")}`, `From: ${data.get("origin") || "Not decided"}`, `To: ${data.get("destination") || "Not decided"}`, `Travellers: ${data.get("travellers")}`, `Message: ${data.get("message") || "None"}`]);
  closeModal();
});

toggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});
nav.querySelectorAll("a,button").forEach(item => item.addEventListener("click", () => nav.classList.remove("is-open")));

render();
