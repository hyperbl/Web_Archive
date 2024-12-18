// 处理登录相关逻辑

const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = loginForm.querySelector("input[name=username]").value;
    const password = loginForm.querySelector("input[name=password]").value;
    
    console.log(`Logging in with ${username}:${password}`);

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    alert(`欢迎！, ${username}`);

    window.location.href = "/";
});