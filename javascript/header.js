// 导航栏处用到的js

// 退出按钮
const logoutBtn = document.querySelector("#logout-btn");

logoutBtn.addEventListener("click", () => {
    alert("退出成功！");
    window.location.href = "../html/login.html";
    localStorage.clear();
});

window.addEventListener("load", () => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    if (username && password) {
        const uDiv = document.querySelector(".user-info");
        const uSpan = uDiv.querySelector("span");
        uSpan.textContent = `欢迎，${username}`;
    } else {
        window.location.href = "../html/login.html";
    }
});