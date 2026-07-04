const payload = JSON.parse(
  localStorage.getItem("ghost-carousel-payload") || "{}"
);

const slides = [
  payload.slide1 || "Slide 1",
  payload.slide2 || "Slide 2",
  payload.slide3 || "Slide 3",
  payload.slide4 || "Slide 4",
  payload.slide5 || "Slide 5"
];

let current = 0;

const slideCounter = document.getElementById("slideCounter");
const carouselSlide = document.getElementById("carouselSlide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const exportBtn = document.getElementById("exportBtn");

function renderSlide() {
  slideCounter.textContent = `${current + 1} / ${slides.length}`;

  carouselSlide.innerHTML = `
    <div class="slide-preview" id="activeSlide">
      <div class="slide-badge">${current + 1}/5</div>

      <div class="slide-main">
        <h1>${slides[current]}</h1>
      </div>

      <div class="slide-footer">
        <div class="ghost">👻</div>
        <strong>GHOST LOOP HQ</strong>
      </div>
    </div>
  `;

  nextBtn.textContent =
    current === slides.length - 1
      ? "📦 Send To Queue"
      : "Next ▶";
}

function sendToQueue() {
  const queue =
    JSON.parse(
      localStorage.getItem("ghost-queue") || "[]"
    );

  queue.unshift({
    id: crypto.randomUUID(),
    title: payload.slide1 || "Queued Carousel",
    type: "carousel",
    payload,
    slides,
    status: "QUEUED",
    queuedAt: new Date().toISOString()
  });

  localStorage.setItem(
    "ghost-queue",
    JSON.stringify(queue)
  );
  window.location.assign("/dashboard/queue.html?from=carousel");
}

async function exportSlides() {
  const originalIndex = current;

  for (let i = 0; i < slides.length; i++) {
    current = i;
    renderSlide();

    await new Promise(resolve =>
      setTimeout(resolve, 150)
    );

    const slide =
      document.getElementById("activeSlide");

    const canvas =
      await html2canvas(slide, {
        backgroundColor: "#050505",
        scale: 2
      });

    const link =
      document.createElement("a");

    link.download =
      `ghost-carousel-slide-${i + 1}.png`;

    link.href =
      canvas.toDataURL("image/png");

    link.click();
  }

  current = originalIndex;
  renderSlide();
}

prevBtn.addEventListener("click", () => {
  if (current > 0) current--;
  renderSlide();
});

nextBtn.addEventListener("click", () => {
  if (current < slides.length - 1) {
    current++;
    renderSlide();
    return;
  }

  sendToQueue();
});

exportBtn?.addEventListener("click", exportSlides);

renderSlide();