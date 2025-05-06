document.querySelector(".login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    localStorage.removeItem("isLoggedIn");

    // Lấy giá trị input
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");

    // Reset lỗi
    emailError.textContent = "";
    passwordError.textContent = "";

    let isValid = true;

    if (email === "") {
        emailError.textContent = "Vui lòng nhập email.";
        emailError.style.display = "block";
        isValid = false;
    }

    if (password === "") {
        passwordError.textContent = "Vui lòng nhập mật khẩu.";
        passwordError.style.display = "block";
        isValid = false;
    }

    if (!isValid) return;

    // Lấy user đã lưu trong localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || storedUser.email !== email) {
        emailError.textContent = "Email không tồn tại.";
        emailError.style.display = "block";
        return;
    }

    if (storedUser.password !== password) {
        passwordError.textContent = "Mật khẩu không đúng.";
        passwordError.style.display = "block";
        return;
    }


    localStorage.setItem("isLoggedIn", "true");

    Swal.fire({
        title: "Đăng nhập thành công!",
        text: "Chuyển hướng sau vài giây...",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
        willClose: () => {
            window.location.href = "/index.html";
        }
    });
});
