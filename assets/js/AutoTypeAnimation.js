var i = 0;
var txt = 'Welcome to the Authentication System'; /* The text */
var speed = 50; /* The speed/duration of the effect in milliseconds */

(function typeWriter() {
  if (i < txt.length) {
    document.getElementById("main-heading").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
})();

console.log("Script running");