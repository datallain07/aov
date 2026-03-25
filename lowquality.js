document.addEventListener("DOMContentLoaded", () => {
  const qualityToggle = document.getElementById("reduceQualityToggle");

  if (localStorage.getItem("reduceQuality") === "enabled") {
    qualityToggle.checked = true;
    applyImageCompression(true);
  }
  qualityToggle.addEventListener("change", function () {
    const shouldReduce = this.checked;
    localStorage.setItem("reduceQuality", shouldReduce ? "enabled" : "disabled");
    applyImageCompression(shouldReduce);
  });
  function applyImageCompression(shouldReduce) {
    const selector = ".mod-card img, .dat2-item img.thumb, .splash-container img:not(.splash-label)";
    const images = document.querySelectorAll(selector);
    images.forEach(img => {
      if (shouldReduce) {
        if (!img.dataset.originalSrc) {
          img.dataset.originalSrc = img.src;
        }
        waitForImageLoad(img).then(loadedImg => {
          const w = loadedImg.naturalWidth;
          const h = loadedImg.naturalHeight;
          if (w <= 360 && h <= 360) return;
          const scale = 360 / Math.max(w, h);
          compressImage(loadedImg, scale, 0.3);
        });
      } else {
        if (img.dataset.originalSrc) {
          img.src = img.dataset.originalSrc;
        }
      }
    });
  }
  function waitForImageLoad(img) {
    return new Promise(resolve => {
      if (img.complete) resolve(img);
      else {
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img);
      }
    });
  }
  function compressImage(imgElement, scale = 1, quality = 0.2) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgElement.src;
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedData = canvas.toDataURL("image/webp", quality);
      imgElement.src = compressedData;
    };
  }
});