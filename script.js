const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const serviceDetails = {
  flight: { name: "Flight", firstLabel: "From", firstPlaceholder: "Departure city", firstSearch: "origin", secondLabel: "To", secondPlaceholder: "Arrival city", secondSearch: "destination", dateLabel: "Depart", peopleLabel: "Travellers" },
  train: { name: "Train", firstLabel: "From", firstPlaceholder: "Boarding station", firstSearch: "origin", secondLabel: "To", secondPlaceholder: "Arrival station", secondSearch: "destination", dateLabel: "Travel date", peopleLabel: "Passengers" },
  bus: { name: "Bus", firstLabel: "From", firstPlaceholder: "Boarding city", firstSearch: "origin", secondLabel: "To", secondPlaceholder: "Arrival city", secondSearch: "destination", dateLabel: "Travel date", peopleLabel: "Passengers" },
  hotel: { name: "Hotel", firstLabel: "Destination", firstPlaceholder: "City or hotel area", firstSearch: "destination", secondLabel: "Check-out", secondPlaceholder: "Date or number of nights", dateLabel: "Check-in", peopleLabel: "Guests" },
  holiday: { name: "Holiday", firstLabel: "Origin city", firstPlaceholder: "Where will you travel from?", firstSearch: "origin", secondLabel: "Holiday destination", secondPlaceholder: "Where would you like to go?", secondSearch: "destination", dateLabel: "Start date", peopleLabel: "Travellers" },
};

const tabs = document.querySelectorAll(".booking-tab");
const firstField = document.querySelector("#first-field");
const secondField = document.querySelector("#second-field");
const dateField = document.querySelector("#date-field");
const peopleField = document.querySelector("#people-field");
const serviceType = document.querySelector("#service-type");
const originOptions = document.querySelector("#origin-options");
const destinationOptions = document.querySelector("#destination-options");
const placeSearchStatus = document.querySelector("#place-search-status");
const placeSearchCache = new Map();
let placeSearchTimer;
let activePlaceRequest;

function setInputSearchMode(field, mode) {
  field.dataset.placeSearch = mode || "";
  if (mode === "origin") field.setAttribute("list", "origin-options");
  else if (mode === "destination") field.setAttribute("list", "destination-options");
  else field.removeAttribute("list");
}

function setService(service) {
  const details = serviceDetails[service];
  if (!details) return;

  tabs.forEach((tab) => {
    const active = tab.dataset.service === service;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  document.querySelector("#first-label").textContent = details.firstLabel;
  document.querySelector("#second-label").textContent = details.secondLabel;
  document.querySelector("#date-label").textContent = details.dateLabel;
  document.querySelector("#people-label").textContent = details.peopleLabel;
  firstField.placeholder = details.firstPlaceholder;
  secondField.placeholder = details.secondPlaceholder;
  setInputSearchMode(firstField, details.firstSearch);
  setInputSearchMode(secondField, details.secondSearch);
  serviceType.value = details.name;
  peopleField.options[0].text = service === "hotel" ? "1 Guest" : "1 " + details.peopleLabel.slice(0, -1);
  peopleField.options[1].text = "2 " + details.peopleLabel;
  peopleField.options[2].text = "3 " + details.peopleLabel;
  peopleField.options[3].text = "4 " + details.peopleLabel;
  peopleField.options[4].text = "5+ " + details.peopleLabel;
}

tabs.forEach((tab) => tab.addEventListener("click", () => setService(tab.dataset.service)));
document.querySelectorAll("[data-pick-service]").forEach((link) => link.addEventListener("click", () => setService(link.dataset.pickService)));
document.querySelectorAll("[data-route-service]").forEach((route) => route.addEventListener("click", () => {
  setService(route.dataset.routeService);
  firstField.value = route.dataset.routeFrom || "";
  secondField.value = route.dataset.routeTo || "";
}));

function updatePlaceOptions(list, values) {
  list.replaceChildren(...values.map((value) => {
    const option = document.createElement("option");
    option.value = value;
    return option;
  }));
}

function formatPlace(feature) {
  const properties = feature.properties || {};
  const name = properties.name || properties.city || properties.county || "Location";
  const parts = [name, properties.city, properties.state, properties.country]
    .filter((part, index, values) => part && values.indexOf(part) === index);
  return parts.join(", ");
}

async function findPlaces(query, mode, targetList) {
  const cacheKey = `${mode}:${query.toLowerCase()}`;
  if (placeSearchCache.has(cacheKey)) {
    updatePlaceOptions(targetList, placeSearchCache.get(cacheKey));
    if (placeSearchStatus) placeSearchStatus.textContent = "Suggestions updated from your recent searches.";
    return;
  }

  if (activePlaceRequest) activePlaceRequest.abort();
  activePlaceRequest = new AbortController();
  const searchQuery = mode === "origin" ? `${query}, India` : query;
  const endpoint = `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=8&lang=en`;

  if (placeSearchStatus) placeSearchStatus.textContent = mode === "origin" ? "Searching Indian cities…" : "Searching cities and attractions worldwide…";

  try {
    const response = await fetch(endpoint, { signal: activePlaceRequest.signal });
    if (!response.ok) throw new Error("Place search unavailable");

    const data = await response.json();
    const results = (data.features || [])
      .filter((feature) => mode !== "origin" || feature.properties?.countrycode === "IN" || feature.properties?.country === "India")
      .map(formatPlace)
      .filter((value, index, values) => value && values.indexOf(value) === index);

    if (results.length) {
      placeSearchCache.set(cacheKey, results);
      updatePlaceOptions(targetList, results);
      if (placeSearchStatus) placeSearchStatus.textContent = `${results.length} matching place suggestions available.`;
    } else if (placeSearchStatus) {
      placeSearchStatus.textContent = "No exact match yet — try a city, landmark, or country name.";
    }
  } catch (error) {
    if (error.name !== "AbortError" && placeSearchStatus) {
      placeSearchStatus.textContent = "Live search is unavailable right now. You can still enter any city or destination.";
    }
  }
}

function schedulePlaceSearch(event) {
  const field = event.currentTarget;
  const mode = field.dataset.placeSearch;
  const query = field.value.trim();
  if (!mode || query.length < 3) return;

  clearTimeout(placeSearchTimer);
  const targetList = mode === "origin" ? originOptions : destinationOptions;
  placeSearchTimer = setTimeout(() => findPlaces(query, mode, targetList), 450);
}

firstField.addEventListener("input", schedulePlaceSearch);
secondField.addEventListener("input", schedulePlaceSearch);
setService("flight");

const form = document.querySelector("#booking-form");

function formatBookingDate(value) {
  const [year, month, day] = value.split("-");
  return day && month && year ? `${day}/${month}/${year}` : value;
}

function isValidBookingDate(value) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.getFullYear() === Number(year) && date.getMonth() === Number(month) - 1 && date.getDate() === Number(day);
}

if (dateField) {
  dateField.addEventListener("input", () => {
    const digits = dateField.value.replace(/\D/g, "").slice(0, 8);
    const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
    dateField.value = parts.join("/");
    dateField.setCustomValidity(dateField.value && !isValidBookingDate(dateField.value) ? "Please enter a valid date as DD/MM/YYYY." : "");
  });
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    dateField.setCustomValidity(isValidBookingDate(dateField.value) ? "" : "Please enter a valid date as DD/MM/YYYY.");
    if (!form.reportValidity()) return;

    const message = [
      "Hello Rehan Travel Agency, I would like a booking quote.",
      "",
      `Service: ${serviceType.value}`,
      `${document.querySelector("#first-label").textContent}: ${firstField.value}`,
      `${document.querySelector("#second-label").textContent}: ${secondField.value}`,
      `${document.querySelector("#date-label").textContent}: ${formatBookingDate(dateField.value)}`,
      `${document.querySelector("#people-label").textContent}: ${peopleField.value}`,
    ].join("\n");

    window.open(`https://wa.me/918178054327?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });
}
