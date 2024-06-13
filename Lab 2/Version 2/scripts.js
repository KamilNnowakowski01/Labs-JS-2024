class Slider {
  constructor(containerId, slidesData) {
    this.container = document.getElementById(containerId);
    this.slidesData = slidesData;
    this.currentIndex = 0;
    this.totalSlides = slidesData.length;
    this.intervalId = null;
    this.videoPaused = false;
    this.initSlider();
  }

  initSlider() {
    this.createSliderElements();
    this.updateSlidePosition();
    this.startAutoSlide();
    this.addEventListeners();
  }

  createSliderElements() {
    this.container.innerHTML = `
          <div class="slider">
              <div class="slides"></div>
              <div class="navigation">
                  <button class="prev">Prev</button>
                  <button class="pause">Pause</button>
                  <button class="next">Next</button>
              </div>
              <div class="indicators"></div>
          </div>
      `;

    this.slidesContainer = this.container.querySelector(".slides");
    this.indicatorsContainer = this.container.querySelector(".indicators");

    this.slidesData.forEach((slide, index) => {
      const slideElement = document.createElement("div");
      slideElement.classList.add("slide");

      if (slide.type === "image") {
        slideElement.innerHTML = `<img src="${slide.src}" alt="Slide ${
          index + 1
        }"><p>${slide.text}</p>`;
      } else if (slide.type === "video") {
        slideElement.innerHTML = `<video src="${slide.src}" autoplay muted playsinline></video><p>${slide.text}</p>`;
      }

      this.slidesContainer.appendChild(slideElement);
      const indicator = document.createElement("span");
      indicator.classList.add("indicator");
      indicator.dataset.slide = index;
      this.indicatorsContainer.appendChild(indicator);
    });

    this.slideElements = this.container.querySelectorAll(".slide");
    this.indicators = this.container.querySelectorAll(".indicator");
    this.prevButton = this.container.querySelector(".prev");
    this.nextButton = this.container.querySelector(".next");
    this.pauseButton = this.container.querySelector(".pause");
  }

  updateSlidePosition() {
    this.slidesContainer.style.transform = `translateX(-${
      this.currentIndex * 100
    }%)`;
    this.updateIndicators();
  }

  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentIndex);
    });
  }

  nextSlide() {
    this.currentIndex =
      this.currentIndex < this.totalSlides - 1 ? this.currentIndex + 1 : 0;
    this.updateSlidePosition();
    this.handleCurrentSlide();
  }

  prevSlide() {
    this.currentIndex =
      this.currentIndex > 0 ? this.currentIndex - 1 : this.totalSlides - 1;
    this.updateSlidePosition();
    this.handleCurrentSlide();
  }

  startAutoSlide() {
    this.intervalId = setTimeout(
      () => this.nextSlide(),
      this.getCurrentSlideDuration()
    );
  }

  stopAutoSlide() {
    clearTimeout(this.intervalId);
  }

  getCurrentSlideDuration() {
    const currentSlide = this.slideElements[this.currentIndex];
    const video = currentSlide.querySelector("video");
    if (video) {
      return video.duration * 1000; // duration in milliseconds
    }
    return 3000; // default duration for images
  }

  handleCurrentSlide() {
    const currentSlide = this.slideElements[this.currentIndex];
    const video = currentSlide.querySelector("video");
    if (video) {
      video.currentTime = 0; // reset video time to the start
      video.play();
      video.onended = () => this.nextSlide();
      this.stopAutoSlide();
    } else {
      this.stopAutoSlide();
      this.startAutoSlide();
    }
  }

  toggleVideoPlayback(video) {
    if (video.paused) {
      video.play();
      this.pauseButton.textContent = "Pause";
      this.videoPaused = false;
    } else {
      video.pause();
      this.pauseButton.textContent = "Play";
      this.videoPaused = true;
    }
  }

  addEventListeners() {
    this.prevButton.addEventListener("click", () => this.prevSlide());
    this.nextButton.addEventListener("click", () => this.nextSlide());

    this.pauseButton.addEventListener("click", () => {
      const currentSlide = this.slideElements[this.currentIndex];
      const video = currentSlide.querySelector("video");
      if (video) {
        this.toggleVideoPlayback(video);
      } else {
        if (this.intervalId) {
          this.stopAutoSlide();
          this.intervalId = null;
          this.pauseButton.textContent = "Play";
        } else {
          this.startAutoSlide();
          this.pauseButton.textContent = "Pause";
        }
      }
    });

    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        this.currentIndex = index;
        this.updateSlidePosition();
        this.pauseButton.textContent = "Pause";
        this.handleCurrentSlide();
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const slidesData = [
    { type: "image", src: "../IMG1.png", text: "Text for Slide 1" },
    { type: "image", src: "../IMG2.png", text: "Text for Slide 2" },
    { type: "image", src: "../IMG3.png", text: "Text for Slide 3" },
    { type: "video", src: "../VIDEO.mp4", text: "Text for Slide 4" },
  ];

  new Slider("slider-container", slidesData);
});
