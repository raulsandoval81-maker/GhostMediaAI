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
const approveBtn = document.getElementById("approveBtn");

function renderSlide() {
  slideCounter.textContent = `${current + 1} / ${slides.length}`;

  carouselSlide.innerHTML = `
    <div class="slide-preview ${payload.image ? "has-media" : ""}" id="activeSlide"
      ${payload.image ? `style="background-image:linear-gradient(rgba(0,0,0,.48),rgba(0,0,0,.72)),url('${payload.image}')"` : ""}>
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

  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === slides.length - 1;
}

function approveForReview() {
  try {
    gmQueueCreativeAsset({
    title: payload.slide1 || "Queued Carousel",
    type: "carousel",
    format: payload.format || "carousel",
    source: payload.source || "carousel",
    sourceId: payload.sourceId || payload.ideaId || null,
    product: payload.product || payload.page || "",
    category: payload.category || payload.page || "",
    topic: payload.topic || "General",
    hook: payload.slide1 || "",
    caption: payload.caption || "",
    cta: payload.cta || "",
    platform: payload.platform || "",
    image: payload.image || "",
    payload,
    slides,
    createdAt: new Date().toISOString()
    });
    window.location.assign("/dashboard/queue.html?from=carousel");
  } catch (error) {
    alert(error.message || "Could not send this carousel to Review.");
  }
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
  }
});

exportBtn?.addEventListener("click", exportSlides);
approveBtn?.addEventListener("click", approveForReview);

renderSlide();
