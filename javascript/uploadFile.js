// upload-file.js -- 处理文件上传

// 获取上传文件的表单
const uploadForm = document.querySelector("#upload-form");
const uploadResult = document.querySelector("#upload-result");

uploadForm.addEventListener("submit", async (e) => {
    // 阻止表单默认提交行为
    e.preventDefault();

    // 获取表单数据
    const formData = new FormData(uploadForm);

    // 使用 fetch API 发送 POST 请求，但当前服务器端没有处理该请求
    // const response = await fetch("/upload", {
    //     method: "POST",
    //     body: formData
    // })
    // .then((res) => res.json())
    // .then((data) => {
    //     if (data.success) {
    //         uploadResult.innerHTML = "File uploaded successfully!";
    //     } else {
    //         uploadResult.innerHTML = "File upload failed, please try again!";
    //     }
    // })
    // .catch((err) => {
    //     console.error("Error uploading file:", err);
    //     uploadResult.innerHTML = "An error occurred, please try again!";
    // });

    // 假装上传成功
    uploadResult.style.display = "block";
    uploadResult.innerHTML = `
        <br><p>文件上传成功!</p>
        <p>--------------------</p>
        <p>文件名: ${formData.get("file").name}</p>
        <p>文件类型: ${formData.get("file").type}</p>
        <p>文件大小: ${formData.get("file").size} bytes</p>
        <p>文件上次修改时间: ${new Date(formData.get("file").lastModified).toLocaleString()}</p>
        <p>--------------------</p>
    `;

    const previewBtn = document.querySelector("#preview-btn");
    previewBtn.style.display = "block";
});