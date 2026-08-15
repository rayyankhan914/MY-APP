const videos = [
  {
    title: "Designing a calm dashboard",
    channel: "Pixel Studio",
    views: "2.4M views",
    duration: "12:08",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Fast editing tricks for creators",
    channel: "Mina Cuts",
    views: "870K views",
    duration: "08:42",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Build a cozy coding setup",
    channel: "Night Shift",
    views: "1.1M views",
    duration: "15:20",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "AI workflow that saves hours",
    channel: "Future Tools",
    views: "640K views",
    duration: "10:05",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Indie game dev diary",
    channel: "Pixel Pocket",
    views: "305K views",
    duration: "07:16",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Study with me: deep focus session",
    channel: "Quiet Hours",
    views: "980K views",
    duration: "02:13:48",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  },
];

const videoGrid = document.getElementById("videoGrid");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

function renderVideos(filter = "") {
  const query = filter.trim().toLowerCase();

  const visibleVideos = videos.filter((video) => {
    const haystack = `${video.title} ${video.channel}`.toLowerCase();
    return haystack.includes(query);
  });

  if (!visibleVideos.length) {
    videoGrid.innerHTML = '<p class="empty-state">No videos matched your search.</p>';
    return;
  }

  videoGrid.innerHTML = visibleVideos
    .map(
      (video) => `
        <article class="video-card">
          <img src="${video.image}" alt="${video.title}" />
          <div class="video-info">
            <h4>${video.title}</h4>
            <p>${video.channel}</p>
            <p>${video.views} • ${video.duration}</p>
          </div>
        </article>
      `
    )
    .join("");
}

searchButton.addEventListener("click", () => renderVideos(searchInput.value));
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    renderVideos(searchInput.value);
  }
});

renderVideos();
