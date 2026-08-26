const videoFile = document.getElementById("videoFile");
const videoPreview = document.getElementById("videoPreview");
const videoTitle = document.getElementById("videoTitle");
const videoProduct = document.getElementById("videoProduct");
const videoTopic = document.getElementById("videoTopic");
const videoStart = document.getElementById("videoStart");
const videoEnd = document.getElementById("videoEnd");
const videoMoment = document.getElementById("videoMoment");
const videoHook = document.getElementById("videoHook");
const videoCaption = document.getElementById("videoCaption");
const videoCta = document.getElementById("videoCta");

const VIDEO_INLINE_LIMIT = 1.5 * 1024 * 1024;
let videoSource = "";
let videoMetadata = null;

videoFile.addEventListener("change", async () => {
  const file = videoFile.files?.[0];
  if (!file) return;

  const previewUrl = URL.createObjectURL(file);
  videoPreview.innerHTML = `<video controls playsinline src="${previewUrl}"></video>`;
  videoMetadata = {
    name: file.name,
    type: file.type,
    size: file.size,
    persistence: file.size <= VIDEO_INLINE_LIMIT ? "browser-inline" : "device-reference"
  };

  videoSource = file.size <= VIDEO_INLINE_LIMIT
    ? await gmReadFileAsDataUrl(file)
    : "";

  if (!videoSource) {
    videoPreview.insertAdjacentHTML("beforeend", "<p class='faded'>Large video: Ghost will save the clip plan and file reference, not a durable copy of the video.</p>");
  }
});

function getClipStrategy() {
  return gmBuildCreativeStrategy({
    title: videoHook.value.trim() || videoTitle.value.trim(),
    product: videoProduct.value.trim(),
    category: videoProduct.value.trim(),
    topic: videoTopic.value.trim(),
    subject: videoTitle.value.trim() || videoTopic.value.trim(),
    message: videoMoment.value.trim(),
    caption: videoCaption.value.trim(),
    cta: videoCta.value.trim()
  });
}

document.getElementById("videoGenerateBtn").addEventListener("click", () => {
  const strategy = getClipStrategy();
  videoHook.value = strategy.hook;
  videoCaption.value = strategy.caption;
  videoCta.value = strategy.cta;
});

document.getElementById("videoReviewBtn").addEventListener("click", () => {
  if (!videoMetadata) {
    alert("Choose a source video first.");
    return;
  }

  const startTime = Math.max(0, Number(videoStart.value || 0));
  const endTime = Math.max(0, Number(videoEnd.value || 0));

  if (endTime <= startTime) {
    alert("End time must be after start time.");
    return;
  }

  const strategy = getClipStrategy();
  try {
    gmQueueCreativeAsset({
      ...strategy,
      title: videoTitle.value.trim() || strategy.hook || "Short Clip Concept",
      type: "short-clip",
      format: "short-video",
      source: "device-video",
      sourceVideo: videoSource,
      sourceFile: videoMetadata,
      hook: videoHook.value.trim() || strategy.hook,
      startTime,
      endTime,
      moment: videoMoment.value.trim(),
      caption: videoCaption.value.trim() || strategy.caption,
      cta: videoCta.value.trim() || strategy.cta,
      createdAt: new Date().toISOString()
    });
    window.location.assign("/dashboard/queue.html?from=video");
  } catch (error) {
    alert(error.message || "Could not send this clip concept to Review.");
  }
});
