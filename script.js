const destinations = [
  { name: "Kashmir", type: "domestic", about: "Srinagar, Gulmarg & Pahalgam", image: "assets/kashmir-hero.png" },
  { name: "Goa", type: "domestic", about: "Beaches, cafés & coastal stays", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80" },
  { name: "Kerala", type: "domestic", about: "Backwaters, tea hills & beaches", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80" },
  { name: "Rajasthan", type: "domestic", about: "Jaipur, Udaipur & desert trails", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80" },
  { name: "Dubai", type: "international", about: "Skyline, desert & luxury breaks", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80" },
  { name: "Bali", type: "international", about: "Beaches, temples & island stays", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80" },
  { name: "Singapore", type: "international", about: "City lights & family fun", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=80" },
  { name: "Paris", type: "international", about: "Culture, cafés & iconic sights", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80" }
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

function render() {
  const query = search.value.trim().toLowerCase();
  const items = destinations.filter(destination => (filter === "all" || destination.type === filter) && `${destination.name} ${destination.about}`.toLowerCase().includes(query));
  count.textContent = `${items.length} popular destination${items.length === 1 ? "" : "s"}`;
  grid.innerHTML = items.length ? items.map(destination => `<article class="destination-card"><img src="${destination.image}" alt="${destination.name}" loading="lazy"><div class="destination-body"><span class="destination-type">${destination.type}</span><h3>${destination.name}</h3><p>${destination.about}</p><button data-book="${destination.name}">Book Now ↗</button></div></article>`).join("") : "<p>No destination found. Send us a custom request on WhatsApp.</p>";
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

routeForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!routeForm.reportValidity()) return;
  const text = ["Hello Rehan Travel Agency, I would like a route quote.", "", `Service: ${routeService.value}`, `From: ${routeOrigin.value}`, `To: ${routeDestination.value}`].join("\n");
  window.open(`https://wa.me/918178054327?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
});

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

render();
