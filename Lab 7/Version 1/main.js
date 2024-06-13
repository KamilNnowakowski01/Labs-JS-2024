import BubbleManager from "./BubbleManager.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const numBubblesInput = document.getElementById('numBubbles');

let animationFrameId;
const bubbleManager = new BubbleManager(ctx, canvas);

startBtn.addEventListener('click', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId); // Cancel the existing animation frame
    }
    bubbleManager.reset();  // Reset the bubbles before creating them again
    bubbleManager.createBubbles(parseInt(numBubblesInput.value));
    animate(); // Start the new animation
});

resetBtn.addEventListener('click', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId); // Cancel the existing animation frame
    }
    bubbleManager.reset();
});

// Animation function
function animate() {
    bubbleManager.animate();
    animationFrameId = requestAnimationFrame(animate);
}
