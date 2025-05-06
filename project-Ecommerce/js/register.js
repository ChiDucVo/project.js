localStorage.removeItem("isLoggedIn");

document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const lastname = document.getElementById("lastname").value.trim();
    const firstname = document.getElementById("firstname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const termsChecked = document.getElementById("terms-checkbox").checked;

    document.getElementById("lastname-error").style.display = "none";
    document.getElementById("firstname-error").style.display = "none";
    document.getElementById("email-error").style.display = "none";
    document.getElementById("password-error").style.display = "none";
    document.getElementById("confirm-password-error").style.display = "none";
    document.getElementById("terms-error").style.display = "none";

    let isValid = true;

    if (lastname === "") {
        document.getElementById("lastname-error").textContent = "Vui lòng nhập họ và tên đệm.";
        document.getElementById("lastname-error").style.display = "block";
        isValid = false;
    }

    if (firstname === "") {
        document.getElementById("firstname-error").textContent = "Vui lòng nhập tên.";
        document.getElementById("firstname-error").style.display = "block";
        isValid = false;
    }

    if (email === "") {
        document.getElementById("email-error").textContent = "Vui lòng nhập email.";
        document.getElementById("email-error").style.display = "block";
        isValid = false;
    } else if (!validateEmail(email)) {
        document.getElementById("email-error").textContent = "Email không hợp lệ.";
        document.getElementById("email-error").style.display = "block";
        isValid = false;
    }

    if (password.length < 8) {
        document.getElementById("password-error").textContent = "Mật khẩu phải có ít nhất 8 ký tự.";
        document.getElementById("password-error").style.display = "block";
        isValid = false;
    }

    if (confirmPassword !== password) {
        document.getElementById("confirm-password-error").textContent = "Mật khẩu xác nhận không khớp.";
        document.getElementById("confirm-password-error").style.display = "block";
        isValid = false;
    }

    if (!termsChecked) {
        document.getElementById("terms-error").textContent = "Bạn cần đồng ý với chính sách và điều khoản.";
        document.getElementById("terms-error").style.display = "block";
        isValid = false;
    }

    // lá cờ check
    if (!isValid) return;

    // Lưu dữ liệu
    const userData = {
        lastname,
        firstname,
        email,
        password
    };

    localStorage.setItem("user", JSON.stringify(userData));

    Swal.fire({
        title: "Đăng ký thành công!",
        text: "Chuyển hướng sau vài giây...",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => {
            window.location.href = "/login.html";
        }
    });
});

function validateEmail(email) {
    if (!email.includes("@")) return false;

    const lowerEmail = email.toLowerCase();
    return lowerEmail.endsWith(".com") || lowerEmail.endsWith(".vn");
}

