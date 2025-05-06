if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "/login.html";
}

let modalLogout = document.getElementById("userDropdown");
let checkModalLogout = false;
document.getElementById("infoUser").addEventListener("click", () => {
    checkModalLogout = !checkModalLogout;
    if (checkModalLogout) {
        modalLogout.style.display = "flex";
    }
    else modalLogout.style.display = "none";
})

// ==== ĐĂNG XUẤT ====
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = '/login.html';
});

// ==== BANNER SLIDER ====
const bannerImages = document.querySelectorAll('.banner-images img');
let currentBanner = 0;

setInterval(() => {
    bannerImages[currentBanner].classList.remove('active');
    currentBanner = (currentBanner + 1) % bannerImages.length;
    bannerImages[currentBanner].classList.add('active');
}, 4000);


function renderCategoryButtons() {
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    const categoryListEl = document.getElementById("categoryList");

    if (!categoryListEl) return;

    categoryListEl.innerHTML = ""; // Xóa cũ

    categories
        .filter(cat => cat.status === "active") // Chỉ lấy danh mục đang hoạt động
        .forEach(cat => {
            const btn = document.createElement("button");
            btn.textContent = cat.category_name;
            categoryListEl.appendChild(btn);
        });
}

let currentSlide = 0;

function updateCategoryCarousel() {
    const categoryList = document.getElementById("categoryList");
    const itemWidth = categoryList.querySelector("button")?.offsetWidth || 0;
    const totalItems = categoryList.children.length;
    const maxSlide = totalItems - 6; // hiển thị 6 item

    // Giới hạn trượt
    if (currentSlide < 0) currentSlide = 0;
    if (currentSlide > maxSlide) currentSlide = maxSlide;

    const offset = -currentSlide * (itemWidth + 12); // 12 là gap
    categoryList.style.transform = `translateX(${offset}px)`;
}

document.getElementById("scrollLeft").addEventListener("click", () => {
    currentSlide--;
    updateCategoryCarousel();
});

document.getElementById("scrollRight").addEventListener("click", () => {
    currentSlide++;
    updateCategoryCarousel();
});

renderCategoryButtons();
updateCategoryCarousel();

