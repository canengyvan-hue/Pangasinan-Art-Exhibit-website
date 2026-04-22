const artworkData = {
  edades: {
    title: "Portrait of Victorio Edades",
    artist: "Danilo Santiago",
    image: "images/portrait-of-victorio-edades.jpg",
    medium: "Acrylic on Canvas",
    location: "Banaan Pangasinan Provincial Museum",
    subject: "Portrait of Victorio Edades",
    content: "Represents pride in local identity.",
    context: "Introduced modern art in the Philippines.",
    interpretation: "Symbol of Pangasinan's contribution to national art."
  },
  urduja: {
    title: "Princess Urduja",
    artist: "Margaret Estelle Blas",
    image: "images/princess-urduja.jpg",
    medium: "Local placeholder image",
    location: "Pangasinan folklore",
    subject: "Legendary warrior princess.",
    content: "Female empowerment.",
    context: "Pangasinan folklore, pre-colonial society.",
    interpretation: "Symbol of strength and independence."
  },
  bolinao: {
    title: "Bolinao Skull",
    artist: "Unknown",
    image: "images/bolinao-skull.jpg",
    medium: "Archaeological artifact",
    location: "Pre-colonial Philippines",
    subject: "Human skull with gold teeth.",
    content: "Social status and craftsmanship.",
    context: "14th-15th century pre-colonial Philippines.",
    interpretation: "Evidence of advanced early Filipino society."
  },
  kalukor: {
    title: "Kalukor",
    artist: "Mark Delos Santos",
    image: "images/kalukor.jpg",
    medium: "Local placeholder image",
    location: "Traditional fishing communities of Pangasinan",
    subject: "Fishermen pulling a net.",
    content: "Cooperation and resilience.",
    context: "Traditional fishing in Pangasinan.",
    interpretation: "Represents bayanihan."
  },
  mermaid: {
    title: "The Mermaid of San Juan River",
    artist: "Prince Logan",
    image: "images/the-mermaid-of-san-juan-river.jpg",
    medium: "Local placeholder image",
    location: "San Juan River legend",
    subject: "Mermaid on submerged church bell.",
    content: "Folklore and mystery.",
    context: "Legend after Palaris Revolt.",
    interpretation: "Blend of history and myth."
  }
};

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const modal = document.getElementById("artModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalImage = document.getElementById("modalImage");
const modalArtist = document.getElementById("modalArtist");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");
const modalSubject = document.getElementById("modalSubject");
const modalContent = document.getElementById("modalContent");
const modalContext = document.getElementById("modalContext");
const modalInterpretation = document.getElementById("modalInterpretation");
const modalImageFrame = modalImage?.closest(".modal-image-frame");

const viewer = {
  scale: 1,
  minScale: 1,
  maxScale: 3,
  x: 0,
  y: 0,
  dragging: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  originX: 0,
  originY: 0
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getViewerBounds() {
  if (!modalImageFrame) return { maxX: 0, maxY: 0 };

  const frameRect = modalImageFrame.getBoundingClientRect();
  const maxX = Math.max(0, (frameRect.width * viewer.scale - frameRect.width) / 2);
  const maxY = Math.max(0, (frameRect.height * viewer.scale - frameRect.height) / 2);

  return { maxX, maxY };
}

function applyImageTransform() {
  if (!modalImage) return;

  const { maxX, maxY } = getViewerBounds();
  viewer.x = clamp(viewer.x, -maxX, maxX);
  viewer.y = clamp(viewer.y, -maxY, maxY);

  modalImage.style.transform = `translate(${viewer.x}px, ${viewer.y}px) scale(${viewer.scale})`;
  modalImageFrame?.classList.toggle("is-zoomed", viewer.scale > 1);
}

function resetImageViewer() {
  viewer.scale = 1;
  viewer.x = 0;
  viewer.y = 0;
  viewer.dragging = false;
  viewer.pointerId = null;
  applyImageTransform();
  modalImageFrame?.classList.remove("is-dragging");
}

function setImageFallback(image) {
  if (!image) return;

  const frame = image.closest(".art-image-frame");
  if (!frame) return;

  function showPlaceholder() {
    frame.classList.add("is-placeholder");
    image.classList.add("is-missing");
  }

  image.addEventListener("error", showPlaceholder);

  if (image.complete && image.naturalWidth === 0) {
    showPlaceholder();
  }
}

function openModal(artKey) {
  const artwork = artworkData[artKey];
  if (!artwork || !modal) return;

  modalTitle.textContent = artwork.title;
  modalArtist.textContent = artwork.artist;
  modalMeta.textContent = `Medium: ${artwork.medium} | Location/Context: ${artwork.location}`;
  modalSubject.textContent = artwork.subject;
  modalContent.textContent = artwork.content;
  modalContext.textContent = artwork.context;
  modalInterpretation.textContent = artwork.interpretation;
  modalImage.src = artwork.image;
  modalImage.alt = artwork.title;
  modalImage.classList.remove("is-missing");
  modalImage.closest(".art-image-frame")?.classList.remove("is-placeholder");

  resetImageViewer();

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  if (!modal) return;

  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  resetImageViewer();
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("open");
  });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".art-card").forEach((card) => {
  const artKey = card.dataset.artwork;

  card.addEventListener("click", () => openModal(artKey));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openModal(artKey);
    }
  });
});

modalOverlay?.addEventListener("click", closeModal);
modalClose?.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("active")) {
    closeModal();
  }
});

modalImage?.addEventListener("click", () => {
  viewer.scale = viewer.scale === 1 ? 1.8 : 1;
  viewer.x = 0;
  viewer.y = 0;
  applyImageTransform();
});

modalImageFrame?.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();

    const delta = event.deltaY < 0 ? 0.2 : -0.2;
    viewer.scale = clamp(Number((viewer.scale + delta).toFixed(2)), viewer.minScale, viewer.maxScale);

    if (viewer.scale === 1) {
      viewer.x = 0;
      viewer.y = 0;
    }

    applyImageTransform();
  },
  { passive: false }
);

modalImage?.addEventListener("pointerdown", (event) => {
  if (viewer.scale === 1) return;

  viewer.dragging = true;
  viewer.pointerId = event.pointerId;
  viewer.startX = event.clientX;
  viewer.startY = event.clientY;
  viewer.originX = viewer.x;
  viewer.originY = viewer.y;

  modalImageFrame?.classList.add("is-dragging");
  modalImage.setPointerCapture(event.pointerId);
});

modalImage?.addEventListener("pointermove", (event) => {
  if (!viewer.dragging || viewer.pointerId !== event.pointerId) return;

  viewer.x = viewer.originX + (event.clientX - viewer.startX);
  viewer.y = viewer.originY + (event.clientY - viewer.startY);
  applyImageTransform();
});

function stopDragging(event) {
  if (viewer.pointerId !== event.pointerId) return;

  viewer.dragging = false;
  viewer.pointerId = null;
  modalImageFrame?.classList.remove("is-dragging");

  if (modalImage?.hasPointerCapture(event.pointerId)) {
    modalImage.releasePointerCapture(event.pointerId);
  }
}

modalImage?.addEventListener("pointerup", stopDragging);
modalImage?.addEventListener("pointercancel", stopDragging);
modalImage?.addEventListener("lostpointercapture", () => {
  viewer.dragging = false;
  viewer.pointerId = null;
  modalImageFrame?.classList.remove("is-dragging");
});

window.addEventListener("resize", applyImageTransform);

document.querySelectorAll(".art-image").forEach(setImageFallback);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll(".fade-in").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".fade-in").forEach((element) => element.classList.add("visible"));
}
