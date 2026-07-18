const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });
}

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
  });
});

// Blog admin password protection
const ADMIN_PASSWORD = "cba2026";

// Blog page
const postsGrid = document.getElementById("postsGrid");
const postFormWrap = document.getElementById("postFormWrap");
const openPostFormBtn = document.getElementById("openPostFormBtn");
const closePostFormBtn = document.getElementById("closePostFormBtn");
const postForm = document.getElementById("postForm");
const unlockBtn = document.getElementById("unlockBtn");
const adminPassword = document.getElementById("adminPassword");
const adminStatus = document.getElementById("adminStatus");

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

function isBlogPage() {
  return !!postsGrid;
}

function isGalleryPage() {
  return !!document.getElementById("galleryGrid");
}

function isAdminUnlocked() {
  return localStorage.getItem("cba_admin_unlocked") === "true";
}

function setAdminState(unlocked) {
  localStorage.setItem("cba_admin_unlocked", unlocked ? "true" : "false");
  if (postFormWrap && openPostFormBtn) {
    openPostFormBtn.style.display = unlocked ? "inline-flex" : "none";
  }
  if (galleryFormWrap && openGalleryFormBtn) {
    openGalleryFormBtn.style.display = unlocked ? "inline-flex" : "none";
  }
  if (adminStatus) {
    adminStatus.textContent = unlocked ? "Admin access granted." : "Admin access required to add posts.";
  }
  if (galleryAdminStatus) {
    galleryAdminStatus.textContent = unlocked ? "Admin access granted." : "Admin access required to upload gallery photos.";
  }
}

function renderPosts(posts) {
  if (!postsGrid) return;

  postsGrid.innerHTML = posts.map((post, index) => `
    <article class="post-card">
      <img src="${post.image || 'IMG-20260717-WA0004.jpg'}" alt="${post.title}">
      <div class="post-meta">
        <span>${post.category}</span>
        <span>Post ${index + 1}</span>
      </div>
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      ${isAdminUnlocked() ? `<button class="btn btn-secondary remove-btn" data-index="${index}" style="margin-top:14px;">Delete</button>` : ""}
    </article>
  `).join("");

  if (isAdminUnlocked()) {
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const posts = JSON.parse(localStorage.getItem("churchPosts")) || defaultPosts;
        const index = Number(btn.dataset.index);
        posts.splice(index, 1);
        localStorage.setItem("churchPosts", JSON.stringify(posts));
        renderPosts(posts);
      });
    });
  }
}

// Gallery page
const galleryGrid = document.getElementById("galleryGrid");
const galleryFormWrap = document.getElementById("galleryFormWrap");
const openGalleryFormBtn = document.getElementById("openGalleryFormBtn");
const closeGalleryFormBtn = document.getElementById("closeGalleryFormBtn");
const galleryForm = document.getElementById("galleryForm");
const unlockGalleryBtn = document.getElementById("unlockGalleryBtn");
const galleryAdminPassword = document.getElementById("galleryAdminPassword");
const galleryAdminStatus = document.getElementById("galleryAdminStatus");

const defaultGallery = [
  {
    image: "IMG-20260717-WA0004.jpg",
    title: "Sunday Service",
    description: "A blessed time of worship and the Word."
  },
  {
    image: "IMG-20260717-WA0004.jpg",
    title: "Church Fellowship",
    description: "Joyful moments with the church family."
  },
  {
    image: "IMG-20260717-WA0004.jpg",
    title: "Prayer Meeting",
    description: "Intercession and spiritual refreshment."
  }
];

function renderGallery(items) {
  if (!galleryGrid) return;

  galleryGrid.innerHTML = items.map((item, index) => `
    <article class="gallery-card">
      <img src="${item.image || 'IMG-20260717-WA0004.jpg'}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p>${item.description || ""}</p>
      ${isAdminUnlocked() ? `<button class="btn btn-secondary delete-gallery-btn" data-index="${index}" style="margin-top:14px;">Delete</button>` : ""}
    </article>
  `).join("");

  if (isAdminUnlocked()) {
    document.querySelectorAll(".delete-gallery-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const items = JSON.parse(localStorage.getItem("churchGallery")) || defaultGallery;
        const index = Number(btn.dataset.index);
        items.splice(index, 1);
        localStorage.setItem("churchGallery", JSON.stringify(items));
        renderGallery(items);
      });
    });
  }
}

if (isBlogPage() || isGalleryPage()) {
  setAdminState(isAdminUnlocked());
}

if (isBlogPage()) {
  const savedPosts = JSON.parse(localStorage.getItem("churchPosts")) || defaultPosts;
  renderPosts(savedPosts);

  if (unlockBtn && adminPassword) {
    unlockBtn.addEventListener("click", () => {
      if (adminPassword.value === ADMIN_PASSWORD) {
        setAdminState(true);
        renderPosts(JSON.parse(localStorage.getItem("churchPosts")) || defaultPosts);
        if (galleryGrid) renderGallery(JSON.parse(localStorage.getItem("churchGallery")) || defaultGallery);
      } else {
        if (adminStatus) adminStatus.textContent = "Wrong password.";
      }
      adminPassword.value = "";
    });
  }

  if (openPostFormBtn && postFormWrap) {
    openPostFormBtn.addEventListener("click", () => {
      if (isAdminUnlocked()) postFormWrap.classList.remove("hidden");
    });
  }

  if (closePostFormBtn && postFormWrap) {
    closePostFormBtn.addEventListener("click", () => postFormWrap.classList.add("hidden"));
  }

  if (postForm) {
    postForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!isAdminUnlocked()) return;

      const postTitle = document.getElementById("postTitle");
      const postCategory = document.getElementById("postCategory");
      const postContent = document.getElementById("postContent");
      const postImage = document.getElementById("postImage");

      const posts = JSON.parse(localStorage.getItem("churchPosts")) || defaultPosts;

      posts.unshift({
        title: postTitle.value.trim(),
        category: postCategory.value.trim(),
        content: postContent.value.trim(),
        image: postImage.value.trim() || "IMG-20260717-WA0004.jpg"
      });

      localStorage.setItem("churchPosts", JSON.stringify(posts));
      renderPosts(posts);
      postForm.reset();
      postFormWrap.classList.add("hidden");
    });
  }
}

if (isGalleryPage()) {
  const savedGallery = JSON.parse(localStorage.getItem("churchGallery")) || defaultGallery;
  renderGallery(savedGallery);

  if (unlockGalleryBtn && galleryAdminPassword) {
    unlockGalleryBtn.addEventListener("click", () => {
      if (galleryAdminPassword.value === ADMIN_PASSWORD) {
        setAdminState(true);
        renderGallery(JSON.parse(localStorage.getItem("churchGallery")) || defaultGallery);
      } else {
        if (galleryAdminStatus) galleryAdminStatus.textContent = "Wrong password.";
      }
      galleryAdminPassword.value = "";
    });
  }

  if (openGalleryFormBtn && galleryFormWrap) {
    openGalleryFormBtn.addEventListener("click", () => {
      if (isAdminUnlocked()) galleryFormWrap.classList.remove("hidden");
    });
  }

  if (closeGalleryFormBtn && galleryFormWrap) {
    closeGalleryFormBtn.addEventListener("click", () => galleryFormWrap.classList.add("hidden"));
  }

  if (galleryForm) {
    galleryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!isAdminUnlocked()) return;

      const galleryImage = document.getElementById("galleryImage");
      const galleryTitle = document.getElementById("galleryTitle");
      const galleryDescription = document.getElementById("galleryDescription");

      const items = JSON.parse(localStorage.getItem("churchGallery")) || defaultGallery;

      items.unshift({
        image: galleryImage.value.trim() || "IMG-20260717-WA0004.jpg",
        title: galleryTitle.value.trim(),
        description: galleryDescription.value.trim()
      });

      localStorage.setItem("churchGallery", JSON.stringify(items));
      renderGallery(items);
      galleryForm.reset();
      galleryFormWrap.classList.add("hidden");
    });
  }
}












/* ===========================================
   GALLERY IMAGE UPLOAD
=========================================== */

const imageInput=document.getElementById("galleryImage");

const preview=document.getElementById("galleryPreview");

const fileName=document.getElementById("selectedFileName");

const form=document.getElementById("galleryForm");

const grid=document.getElementById("galleryGrid");

if(imageInput){

imageInput.addEventListener("change",function(){

const file=this.files[0];

if(!file)return;

fileName.textContent=file.name;

const reader=new FileReader();

reader.onload=function(e){

preview.src=e.target.result;

preview.style.display="block";

}

reader.readAsDataURL(file);

});

}

if(form){

form.addEventListener("submit",function(e){

e.preventDefault();

const file=imageInput.files[0];

if(!file){

alert("Please choose an image.");

return;

}

const reader=new FileReader();

reader.onload=function(event){

const title=document.getElementById("galleryTitle").value;

const description=document.getElementById("galleryDescription").value;

const card=document.createElement("div");

card.className="gallery-card";

card.innerHTML=`

<img src="${event.target.result}">

<h3>${title}</h3>

<p>${description}</p>

`;

grid.prepend(card);

form.reset();

preview.style.display="none";

fileName.textContent="No image selected";

}

reader.readAsDataURL(file);

});

}
