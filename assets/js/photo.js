const photoFile = document.getElementById("photoFile");
const photoPreview = document.getElementById("photoPreview");
const photoProduct = document.getElementById("photoProduct");
const photoTopic = document.getElementById("photoTopic");
const photoEvent = document.getElementById("photoEvent");
const photoSubject = document.getElementById("photoSubject");
const photoMessage = document.getElementById("photoMessage");
const photoHook = document.getElementById("photoHook");
const photoCaption = document.getElementById("photoCaption");
const photoCta = document.getElementById("photoCta");

let photoData = "";
let photoMetadata = null;

photoFile.addEventListener("change", async () => {
  const file = photoFile.files?.[0];
  if (!file) return;

  try {
    photoData = await gmCompressImageFile(file, { maxDimension: 1600, quality: 0.82 });
    photoMetadata = { name: file.name, type: file.type, originalSize: file.size };
    photoPreview.innerHTML = `<img src="${photoData}" alt="Selected photo preview" class="generated-image">`;
  } catch (error) {
    alert(error.message || "Could not prepare that photo.");
  }
});

function getPhotoStrategy() {
  return gmBuildCreativeStrategy({
    title: photoHook.value.trim(),
    product: photoProduct.value.trim(),
    category: photoProduct.value.trim(),
    topic: photoTopic.value.trim(),
    whatHappened: photoEvent.value.trim(),
    subject: photoSubject.value.trim(),
    message: photoMessage.value.trim(),
    caption: photoCaption.value.trim(),
    cta: photoCta.value.trim()
  });
}

document.getElementById("photoGenerateBtn").addEventListener("click", () => {
  const strategy = getPhotoStrategy();
  photoHook.value = strategy.hook;
  photoCaption.value = strategy.caption;
  photoCta.value = strategy.cta;
});

document.getElementById("photoReviewBtn").addEventListener("click", () => {
  if (!photoData) {
    alert("Choose a photo first.");
    return;
  }

  const strategy = getPhotoStrategy();
  try {
    gmQueueCreativeAsset({
      ...strategy,
      title: strategy.hook || photoSubject.value.trim() || "Real Photo Post",
      type: "real-photo",
      format: "single-image",
      source: "device-photo",
      image: photoData,
      file: photoMetadata,
      whatHappened: photoEvent.value.trim(),
      subject: photoSubject.value.trim(),
      message: photoMessage.value.trim()
    });
    window.location.assign("/dashboard/queue.html?from=photo");
  } catch (error) {
    alert(error.message || "Could not send this photo to Review.");
  }
});

document.getElementById("photoCarouselBtn").addEventListener("click", () => {
  if (!photoData) {
    alert("Choose a photo first.");
    return;
  }

  const strategy = getPhotoStrategy();
  const subject = photoSubject.value.trim() || strategy.topic || "This Moment";
  localStorage.setItem("ghost-carousel-payload", JSON.stringify({
    slide1: strategy.hook,
    slide2: photoEvent.value.trim() || `What happened with ${subject}`,
    slide3: photoMessage.value.trim() || `Why ${subject} matters`,
    slide4: `The lesson from ${subject}`,
    slide5: strategy.cta,
    image: photoData,
    caption: strategy.caption,
    cta: strategy.cta,
    product: strategy.product,
    category: strategy.category,
    topic: strategy.topic,
    source: "device-photo",
    sourceType: "real-photo",
    format: "photo-carousel",
    file: photoMetadata,
    createdAt: new Date().toISOString()
  }));

  window.location.assign("/carousel/?from=photo");
});
