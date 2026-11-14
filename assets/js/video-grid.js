/* Product video grid: click a card to play its video inline.
   A card's trigger button carries either data-youtube-id or data-video-src (local MP4).
   Only one video plays at a time; starting another puts the previous card back to its thumbnail. */
(function () {
  var playing = null; // { media, trigger }

  function restore() {
    if (!playing) return;
    playing.media.innerHTML = "";
    playing.media.appendChild(playing.trigger);
    playing = null;
  }

  function play(trigger) {
    var media = trigger.parentNode;
    var title = trigger.getAttribute("data-video-title") || "Axiostat video";
    var youtubeId = trigger.getAttribute("data-youtube-id");
    var videoSrc = trigger.getAttribute("data-video-src");
    var player;

    if (youtubeId) {
      player = document.createElement("iframe");
      player.src =
        "https://www.youtube.com/embed/" +
        encodeURIComponent(youtubeId) +
        "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
      player.title = title;
      player.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      player.allowFullscreen = true;
    } else if (videoSrc) {
      player = document.createElement("video");
      player.src = videoSrc;
      player.controls = true;
      player.autoplay = true;
      player.playsInline = true;
      player.setAttribute("aria-label", title);
    } else {
      return;
    }

    restore();
    media.removeChild(trigger);
    media.appendChild(player);
    playing = { media: media, trigger: trigger };
    if (player.focus) player.focus();
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest && e.target.closest(".axio-video-card__trigger");
    if (trigger) play(trigger);
  });
})();
