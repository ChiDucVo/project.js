if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "/login.html";
}

let categories = JSON.parse(localStorage.getItem("categories")) || [
    {
        id: 1,
        category_code: "DM001",
        category_name: "Quần áo",
        status: "active",
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        category_code: "DM002",
        category_name: "Kính mắt",
        status: "inactive",
        created_at: new Date().toISOString()
    },
    {
        id: 3,
        category_code: "DM003",
        category_name: "Giày dép",
        status: "active",
        created_at: new Date().toISOString()
    }
];

const searchInputEl = document.getElementById("search-input");
const filterStatusEl = document.getElementById("filter-status");
const paginationEl = document.getElementById("pagination");

let currentEditId = null;
let currentPage = 1;
const itemsPerPage = 5;

// ==== Filter ====
function getFilteredCategories() {
    const keyword = searchInputEl.value.toLowerCase().trim();
    const status = filterStatusEl.value;

    return categories.filter(cat => {
        const matchKeyword =
            cat.category_code.toLowerCase().includes(keyword) ||
            cat.category_name.toLowerCase().includes(keyword);
        const matchStatus = status === "all" || cat.status === status;
        return matchKeyword && matchStatus;
    });
}

// ==== Pagination ====
function renderPagination(filteredList) {
    paginationEl.innerHTML = "";
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    if (totalPages === 0) return;

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "«";
    prevBtn.classList.add("page-btn");
    if (currentPage === 1) prevBtn.disabled = true;
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPaginatedCategories();
        }
    });
    paginationEl.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.classList.add("page-btn");
        if (i === currentPage) btn.classList.add("active");

        btn.addEventListener("click", () => {
            currentPage = i;
            renderPaginatedCategories();
        });

        paginationEl.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "»";
    nextBtn.classList.add("page-btn");
    if (currentPage === totalPages) nextBtn.disabled = true;
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPaginatedCategories();
        }
    });
    paginationEl.appendChild(nextBtn);
}

const categoryListEl = document.getElementById("categories-list");
function renderCategories(list) {
    let html = "";
    list.forEach(cat => {
        const badge = cat.status === "active"
            ? `<span class="badge active">● Đang hoạt động</span>`
            : `<span class="badge inactive">● Ngừng hoạt động</span>`;
        html += `
        <tr>
          <td>${cat.category_code}</td>
          <td>${cat.category_name}</td>
          <td>${badge}</td>
          <td>
            <button class="btn-icon red" onclick="deleteCategory('${cat.id}')"><i class="fas fa-trash-alt"></i></button>
            <button class="btn-icon" onclick="openEditModal('${cat.id}')"><i class="fas fa-edit"></i></button>
          </td>
        </tr>`;
    });

    categoryListEl.innerHTML = html;
}

function renderPaginatedCategories() {
    const filtered = getFilteredCategories();
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = filtered.slice(start, end);

    renderCategories(paginated);
    renderPagination(filtered);
}

// ==== THEMM ====
const addBtn = document.querySelector(".btn-primary");
const addModal = document.getElementById("addModal");
const addCodeEl = document.getElementById("add-code");
const addNameEl = document.getElementById("add-name");
const addStatusEls = document.querySelectorAll("input[name='add-status']");
const addCodeError = document.getElementById("add-code-error");
const addNameError = document.getElementById("add-name-error");

addBtn.addEventListener("click", () => {
    addModal.style.display = "flex";
    addCodeEl.value = "";
    addNameEl.value = "";
    addStatusEls[0].checked = true;
    addCodeError.style.display = "none";
    addNameError.style.display = "none";
});

document.querySelector("#addModal .btn.primary").addEventListener("click", () => {
    const code = addCodeEl.value.trim();
    const name = addNameEl.value.trim();
    const status = [...addStatusEls].find(el => el.checked).value;

    addCodeError.style.display = "none";
    addNameError.style.display = "none";

    let isValid = true;

    if (!code) {
        addCodeError.textContent = "Mã danh mục không được để trống";
        addCodeError.style.display = "block";
        isValid = false;
    } else if (categories.some(c => c.category_code.toLowerCase() == code.toLowerCase())) {
        addCodeError.textContent = "Mã danh mục đã tồn tại";
        addCodeError.style.display = "block";
        isValid = false;
    }

    if (!name) {
        addNameError.textContent = "Tên danh mục không được để trống";
        addNameError.style.display = "block";
        isValid = false;
    } else if (categories.some(c => c.category_name.toLowerCase() == name.toLowerCase())) {
        addNameError.textContent = "Tên danh mục đã tồn tại";
        addNameError.style.display = "block";
        isValid = false;
    }

    if (!isValid) return;

    categories.push({
        id: Date.now().toString(),
        category_code: code,
        category_name: name,
        status,
        created_at: new Date().toISOString()
    });

    localStorage.setItem("categories", JSON.stringify(categories));
    currentPage = 1;
    addModal.style.display = "none";
    renderPaginatedCategories();
});

// ==== SUA ====
const editModal = document.getElementById("editModal");
const editCodeEl = document.getElementById("edit-code");
const editNameEl = document.getElementById("edit-name");
const editStatusEls = document.querySelectorAll("input[name='edit-status']");
const editCodeError = document.getElementById("edit-code-error");
const editNameError = document.getElementById("edit-name-error");

function openEditModal(id) {
    const cat = categories.find(c => c.id == id);
    if (!cat) return;

    currentEditId = id;
    editCodeEl.value = cat.category_code;
    editNameEl.value = cat.category_name;
    [...editStatusEls].find(el => el.value === cat.status).checked = true;

    editCodeError.style.display = "none";
    editNameError.style.display = "none";
    editModal.style.display = "flex";
}

document.querySelector("#editModal .btn.primary").addEventListener("click", () => {
    const code = editCodeEl.value.trim();
    const name = editNameEl.value.trim();
    const status = [...editStatusEls].find(el => el.checked).value;

    editCodeError.style.display = "none";
    editNameError.style.display = "none";

    let isValid = true;

    if (!code) {
        editCodeError.textContent = "Mã danh mục không được để trống";
        editCodeError.style.display = "block";
        isValid = false;
    } else if (categories.some(c => c.id != currentEditId && c.category_code.toLowerCase() === code.toLowerCase())) {
        editCodeError.textContent = "Mã danh mục đã tồn tại";
        editCodeError.style.display = "block";
        isValid = false;
    }

    if (!name) {
        editNameError.textContent = "Tên danh mục không được để trống";
        editNameError.style.display = "block";
        isValid = false;
    } else if (categories.some(c => c.id != currentEditId && c.category_name.toLowerCase() === name.toLowerCase())) {
        editNameError.textContent = "Tên danh mục đã tồn tại";
        editNameError.style.display = "block";
        isValid = false;
    }

    if (!isValid) return;

    const index = categories.findIndex(c => c.id == currentEditId);
    if (index !== -1) {
        categories[index] = { ...categories[index], category_code: code, category_name: name, status };
        localStorage.setItem("categories", JSON.stringify(categories));
        renderPaginatedCategories();
        editModal.style.display = "none";
    }
});

// ==== XOA ====
function deleteCategory(id) {
    const cat = categories.find(c => c.id == id);
    if (!cat) return;

    Swal.fire({
        title: `Xóa danh mục`,
        text: `Bạn có chắc muốn xóa danh mục "${cat.category_name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            categories = categories.filter(c => c.id != id);
            localStorage.setItem("categories", JSON.stringify(categories));
            renderPaginatedCategories();

            Swal.fire({
                title: 'Đã xóa!',
                text: `Danh mục "${cat.category_name}" đã được xóa.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

let modalAdd = document.getElementById("addModal");
let modalEdit = document.getElementById("editModal");

document.getElementById("closeAdd").addEventListener("click", () => {
    modalAdd.style.display = "none";
});

document.getElementById("closeEdit").addEventListener("click", () => {
    modalEdit.style.display = "none";
});
document.getElementById("cancelAdd").addEventListener("click", () => {
    modalAdd.style.display = "none";
});

document.getElementById("cancelEdit").addEventListener("click", () => {
    modalEdit.style.display = "none";
});

window.addEventListener("click", (e) => {
    document.querySelectorAll(".modal").forEach(modal => {
        if (e.target === modal) modal.style.display = "none";
    });
});

searchInputEl.addEventListener("input", () => {
    currentPage = 1;
    renderPaginatedCategories();
});

filterStatusEl.addEventListener("change", () => {
    currentPage = 1;
    renderPaginatedCategories();
});

renderPaginatedCategories();
