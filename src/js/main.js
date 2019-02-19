import App from './app.js';

const app = new App();

// start logic
setInterval(gameLoop, 33.3)

function gameLoop() {
  console.log("update cycle")
}
