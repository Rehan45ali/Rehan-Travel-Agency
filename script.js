const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
  }));
}

const DATA_SOURCES = {
  airports: "https://raw.githubusercontent.com/mwgg/Airports/master/airports.json",
  stations: "https://raw.githubusercontent.com/IamYVJ/Indian_Railway_Stations_JSON/master/railwayStationsList.json",
  places: "https://photon.komoot.io/api/",
};

const serviceDetails = {
  flight: { name: "Flight", firstLabel: "From", firstPlaceholder: "Airport, city or IATA code", firstSearch: "airport", secondLabel: "To", secondPlaceholder: "Airport, city or IATA code", secondSearch: "airport", dateLabel: "Depart", peopleLabel: "Travellers" },
  train: { name: "Train", firstLabel: "From", firstPlaceholder: "Station name or code", firstSearch: "station", secondLabel: "To", secondPlaceholder: "Station name or code", secondSearch: "station", dateLabel: "Travel date", peopleLabel: "Passengers" },
  bus: { name: "Bus", firstLabel: "From", firstPlaceholder: "Boarding city", firstSearch: "origin", secondLabel: "To", secondPlaceholder: "Arrival city", secondSearch: "destination", dateLabel: "Travel date", peopleLabel: "Passengers" },
  hotel: { name: "Hotel", firstLabel: "Destination", firstPlaceholder: "City or hotel area", firstSearch: "destination", secondLabel: "Check-out", secondPlaceholder: "Date or number of nights", dateLabel: "Check-in", peopleLabel: "Guests" },
  holiday: { name: "Holiday", firstLabel: "Origin city", firstPlaceholder: "Where will you travel from?", firstSearch: "origin", secondLabel: "Holiday destination", secondPlaceholder: "Where would you like to go?", secondSearch: "destination", dateLabel: "Start date", peopleLabel: "Travellers" },
};

const fallbackAirports = [
  { name: "Indira Gandhi International Airport", city: "Delhi", country: "India", iata: "DEL" },
  { name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", country: "India", iata: "BOM" },
  { name: "Kempegowda International Airport", city: "Bengaluru", country: "India", iata: "BLR" },
  { name: "Dubai International Airport", city: "Dubai", country: "United Arab Emirates", iata: "DXB" },
  { name: "Singapore Changi Airport", city: "Singapore", country: "Singapore", iata: "SIN" },
  { name: "London Heathrow Airport", city: "London", country: "United Kingdom", iata: "LHR" },
];

const fallbackStations = [
  { stnName: "New Delhi", stnCode: "NDLS", stnCity: "Delhi" },
  { stnName: "Mumbai Central", stnCode: "MMCT", stnCity: "Mumbai" },
  { stnName: "Chhatrapati Shivaji Maharaj Terminus", stnCode: "CSMT", stnCity: "Mumbai" },
  { stnName: "Howrah Junction", stnCode: "HWH", stnCity: "Kolkata" },
  { stnName: "KSR Bengaluru", stnCode: "SBC", stnCity: "Bengaluru" },
  { stnName: "Chennai Central", stnCode: "MAS", stnCity: "Chennai" },
];

const routeGuide = [
  { stations: ["NDLS", "MMCT"], trains: [{ number: "12952", name: "Mumbai Rajdhani Express" }, { number: "22210", name: "New Delhi–Mumbai Central AC Duronto" }] },
  { stations: ["NDLS", "HWH"], trains: [{ number: "12302", name: "Kolkata Rajdhani Express" }, { number: "12306", name: "Kolkata Rajdhani Express" }] },
  { stations: ["NDLS", "SBC"], trains: [{ number: "22692", name: "KSR Bengaluru Rajdhani Express" }] },
  { stations: ["CSMT", "MAO"], trains: [{ number: "22119", name: "Mumbai CSMT–Madgaon Tejas Express" }] },
  { stations: ["MAS", "SBC"], trains: [{ number: "12028", name: "Chennai–Bengaluru Shatabdi Express" }] },
  { stations: ["NDLS", "BCT"], trains: [{ number: "12952", name: "Mumbai Rajdhani Express" }] },
];

const holidayPackages = [
  { id: "kashmir", type: "domestic", title: "Kashmir valley escape", destination: "Srinagar, Gulmarg & Pahalgam, India", detail: "Lakes, meadows and mountain stays planned around your pace.", duration: "5–7 nights", season: [3, 4, 5, 6, 7, 8] },
  { id: "kerala", type: "domestic", title: "Kerala slow travel", destination: "Kochi, Munnar & Alleppey, India", detail: "Tea hills, backwaters and handpicked stays in one relaxed route.", duration: "5–7 nights", season: [7, 8, 9, 10, 11, 0, 1] },
  { id: "rajasthan", type: "domestic", title: "Rajasthan heritage trail", destination: "Jaipur, Jodhpur & Udaipur, India", detail: "Forts, old cities and desert colour with flexible hotel choices.", duration: "6–8 nights", season: [9, 10, 11, 0, 1, 2] },
  { id: "goa", type: "domestic", title: "Goa beach break", destination: "Goa, India", detail: "A quick coastal holiday with stays suited to your vibe and budget.", duration: "3–5 nights", season: [9, 10, 11, 0, 1, 2] },
  { id: "himachal", type: "domestic", title: "Himachal mountain loop", destination: "Shimla & Manali, Himachal Pradesh, India", detail: "Cool-weather road journeys, views and cosy mountain stays.", duration: "5–7 nights", season: [3, 4, 5, 6, 7, 8] },
  { id: "andaman", type: "domestic", title: "Andaman island time", destination: "Port Blair & Havelock, India", detail: "Island transfers, beach resorts and clear-water days made simple.", duration: "4–6 nights", season: [9, 10, 11, 0, 1, 2, 3] },
  { id: "dubai", type: "international", title: "Dubai city & desert", destination: "Dubai, United Arab Emirates", detail: "Skyline, shopping and desert experiences with flights and stays together.", duration: "4–5 nights", season: [9, 10, 11, 0, 1, 2, 3] },
  { id: "bali", type: "international", title: "Bali at your pace", destination: "Bali, Indonesia", detail: "Beach clubs, temples and lush interiors with a personalised itinerary.", duration: "5–7 nights", season: [3, 4, 5, 6, 7, 8, 9] },
  { id: "thailand", type: "international", title: "Thailand twin escape", destination: "Bangkok & Phuket, Thailand", detail: "City energy followed by beach time, designed around your travel dates.", duration: "5–7 nights", season: [10, 11, 0, 1, 2, 3] },
  { id: "maldives", type: "international", title: "Maldives reset", destination: "Maldives", detail: "Resort-island stays and seamless transfers for a special short break.", duration: "4–6 nights", season: [9, 10, 11, 0, 1, 2, 3] },
  { id: "vietnam", type: "international", title: "Vietnam discovery", destination: "Hanoi, Ha Long Bay & Da Nang, Vietnam", detail: "Food, culture and coastline on a route built for first-time visitors.", duration: "6–8 nights", season: [8, 9, 10, 11, 0, 1, 2, 3] },
  { id: "srilanka", type: "international", title: "Sri Lanka coastal route", destination: "Colombo, Kandy & Bentota, Sri Lanka", detail: "Tea country, heritage and relaxed beaches just a short flight away.", duration: "5–7 nights", season: [10, 11, 0, 1, 2, 3] },
];

const tabs = document.querySelectorAll(".booking-tab");
const firstField = document.querySelector("#first-field");
const secondField = document.querySelector("#second-field");
const dateField = document.querySelector("#date-field");
const peopleField = document.querySelector("#people-field");
const serviceType = document.querySelector("#service-type");
const originOptions = document.querySelector("#origin-options");
const destinationOptions = document.querySelector("#destination-options");
const airportOptions = document.querySelector("#airport-options");
const stationOptions = document.querySelector("#station-options");
const placeSearchStatus = document.querySelector("#place-search-status");
const trainAssist = document.querySelector("#train-assist");
const trainSuggestions = document.querySelector("#train-suggestions");
const packageGrid = document.querySelector("#package-grid");
const placeSearchCache = new Map();
let placeSearchTimer;
let activePlaceRequest;
let activeService = "flight";
let airportDirectory;
let stationDirectory;
let airportDirectoryPromise;
let stationDirectoryPromise;
let packageFilter = "all";

function setStatus(message) {
  if (placeSearchStatus) placeSearchStatus.textContent = message;
}

function setInputSearchMode(field, mode) {
  field.dataset.placeSearch = mode || "";
  const listByMode = { origin: "origin-options", destination: "destination-options", airport: "airport-options", station: "station-options" };
  if (listByMode[mode]) field.setAttribute("list", listByMode[mode]);
  else field.removeAttribute("list");
}

function updatePlaceOptions(list, values) {
  if (!list) return;
  list.replaceChildren(...values.map((value) => {
    const option = document.createElement("option");
    option.value = value;
    return option;
  }));
}

function formatAirport(airport) {
  const code = airport.iata || airport.icao || "Airport";
  const place = [airport.city, airport.country].filter(Boolean).join(", ");
  return `${airport.name || "Airport"} (${code})${place ? ` — ${place}` : ""}`;
}

function formatStation(station) {
  return `${station.stnName || station.name} (${station.stnCode || station.code}) — ${station.stnCity || station.city || "India"}`;
}

async function loadAirportDirectory() {
  if (airportDirectory) return airportDirectory;
  if (airportDirectoryPromise) return airportDirectoryPromise;

  airportDirectoryPromise = fetch(DATA_SOURCES.airports)
    .then((response) => {
      if (!response.ok) throw new Error("Airport directory unavailable");
      return response.json();
    })
    .then((data) => Object.values(data)
      .filter((airport) => airport && airport.name && (airport.iata || airport.icao))
      .map((airport) => ({ ...airport, searchText: `${airport.name} ${airport.city || ""} ${airport.country || ""} ${airport.iata || ""} ${airport.icao || ""}`.toLowerCase() })))
    .catch(() => fallbackAirports.map((airport) => ({ ...airport, searchText: formatAirport(airport).toLowerCase() })))
    .then((directory) => {
      airportDirectory = directory;
      return directory;
    });

  return airportDirectoryPromise;
}

async function loadStationDirectory() {
  if (stationDirectory) return stationDirectory;
  if (stationDirectoryPromise) return stationDirectoryPromise;

  stationDirectoryPromise = fetch(DATA_SOURCES.stations)
    .then((response) => {
      if (!response.ok) throw new Error("Station directory unavailable");
      return response.json();
    })
    .then((data) => (Array.isArray(data) ? data : data.stations || data.data || []))
    .then((stations) => stations
      .filter((station) => (station.stnName || station.name) && (station.stnCode || station.code))
      .map((station) => ({ ...station, searchText: `${station.stnName || station.name} ${station.stnCode || station.code} ${station.stnCity || station.city || ""}`.toLowerCase() })))
    .catch(() => fallbackStations.map((station) => ({ ...station, searchText: formatStation(station).toLowerCase() })))
    .then((directory) => {
      stationDirectory = directory;
      return directory;
    });

  return stationDirectoryPromise;
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
    setStatus("Suggestions updated from your recent searches.");
    return;
  }

  if (activePlaceRequest) activePlaceRequest.abort();
  activePlaceRequest = new AbortController();
  const searchQuery = mode === "origin" ? `${query}, India` : query;
  const endpoint = `${DATA_SOURCES.places}?q=${encodeURIComponent(searchQuery)}&limit=8&lang=en`;
  setStatus(mode === "origin" ? "Searching Indian cities…" : "Searching cities and attractions worldwide…");

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
      setStatus(`${results.length} matching place suggestions available.`);
    } else {
      setStatus("No exact match yet — try a city, landmark, or country name.");
    }
  } catch (error) {
    if (error.name !== "AbortError") setStatus("Live place search is unavailable right now. You can still enter any location.");
  }
}

async function findDirectoryEntries(query, mode) {
  const isAirport = mode === "airport";
  const directory = isAirport ? await loadAirportDirectory() : await loadStationDirectory();
  const needle = query.toLowerCase();
  const results = directory
    .filter((entry) => entry.searchText.includes(needle))
    .slice(0, 10)
    .map(isAirport ? formatAirport : formatStation);
  updatePlaceOptions(isAirport ? airportOptions : stationOptions, results);
  setStatus(results.length
    ? `${results.length} ${isAirport ? "airport" : "Indian Railway station"} matches available.`
    : `No matching ${isAirport ? "airport" : "station"} found — try the name, city or code.`);
}

function stationCode(value) {
  const bracketCode = value.match(/\(([A-Za-z0-9]{2,6})\)/);
  if (bracketCode) return bracketCode[1].toUpperCase();
  return value.trim().toUpperCase().match(/^[A-Z0-9]{2,6}$/)?.[0] || "";
}

function renderTrainSuggestions() {
  if (activeService !== "train" || !trainAssist || !trainSuggestions) return;
  const from = stationCode(firstField.value);
  const to = stationCode(secondField.value);
  if (!from || !to) {
    trainAssist.hidden = true;
    return;
  }
  const guide = routeGuide.find((route) => route.stations.includes(from) && route.stations.includes(to));
  trainAssist.hidden = false;
  const suggestions = guide?.trains || [{ number: "Route check", name: "Search official availability for this selected station pair" }];
  trainSuggestions.replaceChildren(...suggestions.map((train) => {
    const card = document.createElement("div");
    card.className = "train-suggestion";
    const title = document.createElement("strong");
    title.textContent = train.number === "Route check" ? train.name : `${train.number} · ${train.name}`;
    const note = document.createElement("span");
    note.textContent = train.number === "Route check" ? "Use the official enquiry link for trains, schedule and seats." : `${from} ↔ ${to} route guide — confirm date-wise operation and availability.`;
    card.append(title, note);
    return card;
  }));
}

function setService(service) {
  const details = serviceDetails[service];
  if (!details) return;
  activeService = service;
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
  peopleField.options[0].text = service === "hotel" ? "1 Guest" : `1 ${details.peopleLabel.slice(0, -1)}`;
  peopleField.options[1].text = `2 ${details.peopleLabel}`;
  peopleField.options[2].text = `3 ${details.peopleLabel}`;
  peopleField.options[3].text = `4 ${details.peopleLabel}`;
  peopleField.options[4].text = `5+ ${details.peopleLabel}`;
  if (service === "flight") {
    setStatus("Search airports worldwide by city, airport name or IATA code.");
    loadAirportDirectory();
  } else if (service === "train") {
    setStatus("Search the Indian Railway station directory by station name or code.");
    loadStationDirectory();
    renderTrainSuggestions();
  } else {
    if (trainAssist) trainAssist.hidden = true;
    setStatus(service === "holiday" ? "Search Indian departure cities and holiday destinations worldwide." : "Search Indian cities and destinations or attractions worldwide.");
  }
}

function schedulePlaceSearch(event) {
  const field = event.currentTarget;
  const mode = field.dataset.placeSearch;
  const query = field.value.trim();
  if (mode === "station") renderTrainSuggestions();
  if (!mode || query.length < 2) return;
  clearTimeout(placeSearchTimer);
  placeSearchTimer = setTimeout(() => {
    if (mode === "airport" || mode === "station") findDirectoryEntries(query, mode);
    else findPlaces(query, mode, mode === "origin" ? originOptions : destinationOptions);
  }, 300);
}

tabs.forEach((tab) => tab.addEventListener("click", () => setService(tab.dataset.service)));
document.querySelectorAll("[data-pick-service]").forEach((link) => link.addEventListener("click", () => setService(link.dataset.pickService)));
document.querySelectorAll("[data-route-service]").forEach((route) => route.addEventListener("click", () => {
  setService(route.dataset.routeService);
  firstField.value = route.dataset.routeFrom || "";
  secondField.value = route.dataset.routeTo || "";
  renderTrainSuggestions();
}));
firstField.addEventListener("input", schedulePlaceSearch);
secondField.addEventListener("input", schedulePlaceSearch);

function renderPackages() {
  if (!packageGrid) return;
  const month = new Date().getMonth();
  const matchesFilter = holidayPackages.filter((trip) => packageFilter === "all" || trip.type === packageFilter);
  const seasonalTrips = matchesFilter.filter((trip) => trip.season.includes(month));
  const trips = [...seasonalTrips, ...matchesFilter.filter((trip) => !trip.season.includes(month))].slice(0, 8);
  packageGrid.replaceChildren(...trips.map((trip) => {
    const card = document.createElement("article");
    card.className = `package-card ${trip.type}`;
    card.innerHTML = `<span class="package-type">${trip.type === "domestic" ? "India holiday" : "International holiday"}</span><h3>${trip.title}</h3><p>${trip.detail}</p><div class="package-meta"><span>${trip.duration}</span><span>Customisable</span></div><button class="package-book" type="button" data-package-id="${trip.id}">Plan this trip <span aria-hidden="true">↗</span></button>`;
    return card;
  }));
}

document.querySelectorAll("[data-package-filter]").forEach((button) => button.addEventListener("click", () => {
  packageFilter = button.dataset.packageFilter;
  document.querySelectorAll("[data-package-filter]").forEach((filter) => filter.classList.toggle("is-active", filter === button));
  renderPackages();
}));

if (packageGrid) packageGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-package-id]");
  if (!button) return;
  const trip = holidayPackages.find((item) => item.id === button.dataset.packageId);
  if (!trip) return;
  setService("holiday");
  secondField.value = trip.destination;
  firstField.value = "";
  setStatus(`${trip.title} selected. Add your origin city to request a quote.`);
  document.querySelector("#booking").scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => firstField.focus(), 350);
});

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

if (dateField) dateField.addEventListener("input", () => {
  const digits = dateField.value.replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  dateField.value = parts.join("/");
  dateField.setCustomValidity(dateField.value && !isValidBookingDate(dateField.value) ? "Please enter a valid date as DD/MM/YYYY." : "");
});

if (form) form.addEventListener("submit", (event) => {
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

renderPackages();
setService("flight");
