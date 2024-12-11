// previewFile.js -- 预览上传的文件

const previewBtn = document.querySelector("#preview-btn");
const previewArea = document.querySelector("#preview-area");
const uploadFile = document.querySelector("#file");

previewBtn.addEventListener("click", () => {
    const file = uploadFile.files[0];
    if (!file) {
        alert("Please select a file first!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        let fileKind = e.target.result.split("/")[0];
        console.log(fileKind);
        if (fileKind !== "data:image") {
            alert("目前只支持预览图片!");
            return;
        }
        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = file.name;
        img.width = 200;
        previewArea.innerHTML = "";
        previewArea.appendChild(img);
    };
    reader.readAsDataURL(file);
});
