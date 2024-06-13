document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelector('.slides');
  const slideElements = document.querySelectorAll('.slide');
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');
  const indicators = document.querySelectorAll('.indicator');

  let currentIndex = 0;
  const totalSlides = slideElements.length;

  const updateSlidePosition = () => {
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateIndicators();
  };

  const updateIndicators = () => {
      indicators.forEach((indicator, index) => {
          indicator.classList.toggle('active', index === currentIndex);
      });
  };

  prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
      updateSlidePosition();
  });

  nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
      updateSlidePosition();
  });

  indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
          currentIndex = index;
          updateSlidePosition();
      });
  });

  updateSlidePosition();
});
