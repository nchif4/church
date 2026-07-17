// Mobile menu
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

// Close menu after clicking a link
document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
  });
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// Demo blog posts
const defaultPosts = [
  {
    title: "Sunday Worship Highlights",
    category: "Service",
    content: "A joyful time in God's presence with worship, teaching, and powerful prayers.",
    image: "IMG-20260717-WA0004.jpg"
  },
  {
    title: "Youth Fellowship Announcement",
    category: "Ministry",
    content: "All youths are invited to a special fellowship this Saturday at 4:00 PM.",
    image: "IMG-20260717-WA0004.jpg"
  },
  {
    title: "Prayer Night Update",
    category: "Prayer",
    content: "Join us every Friday for an intensive night of prayer and intercession.",
    image: "IMG-20260717-WA0004.jpg"
  }
];

// Load saved posts or default posts
let posts = JSON.parse(localStorage.getItem("churchPosts")) || defaultPosts;

const postsGrid = document.getElementById("postsGrid");
const postFormWrap = document.getElementById("postFormWrap");
const openPostFormBtn = document.getElementById("openPostFormBtn");
const closePostFormBtn = document.getElementById("closePostFormBtn");
const postForm = document.getElementById("postForm");
const postTitle = document.getElementById("postTitle");
const postCategory = document.getElementById("postCategory");
const postContent = document.getElementById("postContent");
const postImage = document.getElementById("postImage");

// Render posts
function renderPosts() {
  postsGrid.innerHTML = posts.map((post, index) => `
    <article class="post-card">
      <img src="${post.image || 'IMG-20260717-WA0004.jpg'}" alt="${post.title}">
      <div class="post-meta">
        <span>${post.category}</span>
        <span>Post ${index + 1}</span>
      </div>
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <button class="btn btn-secondary remove-btn" data-index="${index}" style="margin-top:14px;">Delete</button>
    </article>
  `).join("");

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      posts.splice(index, 1);
      localStorage.setItem("churchPosts", JSON.stringify(posts));
      renderPosts();
    });
  });
}

// Toggle post form
openPostFormBtn.addEventListener("click", () => {
  postFormWrap.classList.remove("hidden");
});

closePostFormBtn.addEventListener("click", () => {
  postFormWrap.classList.add("hidden");
});

// Add new post
postForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newPost = {
    title: postTitle.value.trim(),
    category: postCategory.value.trim(),
    content: postContent.value.trim(),
    image: postImage.value.trim() || "IMG-20260717-WA0004.jpg"
  };

  posts.unshift(newPost);
  localStorage.setItem("churchPosts", JSON.stringify(posts));
  renderPosts();
  postForm.reset();
  postFormWrap.classList.add("hidden");
});

// Initial render
renderPosts();