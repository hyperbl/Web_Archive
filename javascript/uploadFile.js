// upload-file.js -- 处理文件上传
import {EasyDB} from "../javascript/easyDB.js";

// 创建数据库对象并连接
const db = new EasyDB();
db.connect();


// 获取元素
const uploadForm = document.querySelector("#upload-form");

uploadForm.addEventListener("submit", async (e) => {
    // 阻止表单默认提交行为
    e.preventDefault();

    // 获取表单数据
    const formData = new FormData(uploadForm);

    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    await fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then((res) => res.json())
    .then((result) => {
        if (result.success) {
            alert("文件上传成功!");
            console.log(result.files);
            for (const resultFile of result.files) {
                const fileInfo = {
                    academicYear: "2024-2025",
                    courseName: formData.get("course-name"),
                    courseID: formData.get("course-id"),
                    fileName: resultFile.originalFilename,
                    fileKind: formData.get("file-kind"),
                    uploadTime: new Date().toLocaleString(),
                    fileSize: resultFile.size,
                    fileUrl: resultFile.filepath
                };
                db.insert(fileInfo);
            }
        } else {
            alert("文件上传失败, 请重试!");
        }
    })
    .catch((e) => {
        console.log("Error uploading file:", e);
    });

    // 弹窗
    // alert("文件上传成功!");

    uploadForm.reset();
});
