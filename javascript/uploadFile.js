// upload-file.js -- 处理文件上传


// 获取元素
const uploadForm = document.querySelector("#upload-form");
const uploadResult = document.querySelector("#upload-result");
const uploadHistory = document.querySelector("#upload-history");

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
    const uploadMessage = `
        文件上传成功!
        --------------------
        文件名: ${formData.get("file").name}
        文件类型: ${formData.get("file").type}
        文件大小: ${formData.get("file").size} bytes
        文件上次修改时间: ${new Date(formData.get("file").lastModified).toLocaleString()}
        --------------------
    `;
    // uploadResult.style.display = "block";
    // uploadResult.innerHTML = uploadMessage;

    // uploadResult.innerHTML = `
    //     <br><p>文件上传成功!</p>
    //     <p>--------------------</p>
    //     <p>课程名称: ${formData.get("course-name")}</p>
    //     <p>课程编号: ${formData.get("course-id")}</p>
    //     <p>文件名: ${formData.get("file").name}</p>
    //     <p>文件类型: ${formData.get("file").type}</p>
    //     <p>文件大小: ${formData.get("file").size} bytes</p>
    //     <p>文件上次修改时间: ${new Date(formData.get("file").lastModified).toLocaleString()}</p>
    //     <p>--------------------</p>
    // `;

    // 弹窗
    // alert(uploadMessage); 
    alert("文件上传成功!");
    
    addUploadHistory(formData);

    uploadForm.reset();
});

// 预览、下载和删除文件
const previewDowloadAndDeleteBtns = `
    <button class="btn btn-primary preview-btn">预览</button>
    <button class="btn btn-success download-btn">下载</button>
    <button class="btn btn-danger delete-btn">删除</button>
    `; 

// 添加上传历史记录到表格中
function addUploadHistory(formData) {
    const tbody = uploadHistory.querySelector("tbody");
    const tr = document.createElement("tr");
    const uploadHistoryRow = `
            <td>${formData.get("course-name")}</td>
            <td>${formData.get("course-id")}</td>
            <td>${formData.get("file").name}</td>
            <td>${formData.get("file").type.split('/')[1]}</td>
            <td>${new Date().toLocaleString()}</td>
            <td>${formData.get("file").size} bytes</td>
            <td>${previewDowloadAndDeleteBtns}</td>
    `;
    tr.innerHTML += uploadHistoryRow;
    tbody.appendChild(tr);

    const previewBtn = tr.querySelector(".preview-btn");
    const downloadBtn = tr.querySelector(".download-btn");
    const deleteBtn = tr.querySelector(".delete-btn");

    const file = formData.get("file");
    previewBtn.addEventListener("click", () => {
        previewFile(previewBtn, file);
    });
    downloadBtn.addEventListener("click", () => {
        downloadFile(downloadBtn, file);
    });
    deleteBtn.addEventListener("click", () => {
        deleteFile(deleteBtn, file);
    });
}


// 预览文件
function previewFile(previewBtn, file) {

    // const previewBtn = document.querySelector(".preview-btn");
    const previewArea = document.querySelector("#preview-area");
    // const uploadFile = document.querySelector("#file");

    // previewBtn.addEventListener("click", () => {
        // const file = uploadFile.files[0];
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
    // });
}

// 下载文件
function downloadFile(downloadBtn, file) {
    // downloadBtn.addEventListener("click", () => {
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.type = "download";
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
    // });
}

// 删除文件
function deleteFile(deleteBtn, file) {
    // deleteBtn.addEventListener("click", () => {
        const row = deleteBtn.parentElement.parentElement;
        row.remove();
    // });
}