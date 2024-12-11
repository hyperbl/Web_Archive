// manageProfile.js -- 管理个人资料页面的js文件
// 该文件包含了管理个人资料页面的所有js函数
// 此处只做了形式上功能的实现，并没有与后端进行交互

const modifyBtn = document.getElementById("modify-btn");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

const inputTexts = document.querySelector("#input-texts")

modifyBtn.addEventListener("click", () => {
    const inputs = inputTexts.querySelectorAll("input");
    inputs.forEach(input => {
        input.readOnly = false;
    });
    saveBtn.style.display = "block";
    cancelBtn.style.display = "block";
    modifyBtn.style.display = "none";
});

let changes = {};

saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const inputs = inputTexts.querySelectorAll("input");
    inputs.forEach(input => {
        input.readOnly = true;
        changes[input.name] = input.value;
    });
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
    modifyBtn.style.display = "block";
});

cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const inputs = inputTexts.querySelectorAll("input");
    inputs.forEach(input => {
        input.value = changes[input.name];
        if (input.value === 'undefined') {
            input.value = '';
        }
        input.readOnly = true;
    });
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
    modifyBtn.style.display = "block";
});