// JavaScript function to set background
document.addEventListener("DOMContentLoaded", function() {
    var body = document.body;
    var blurBg = document.createElement("div");
    blurBg.classList.add("blur-bg");
    var overlay = document.createElement("div");
    overlay.classList.add("overlay");
    
    body.appendChild(blurBg);
    body.appendChild(overlay);
});
