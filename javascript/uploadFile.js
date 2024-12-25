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

    // 检查表单数据命名是否正确
    if (!checkCorrectness(formData)) {
        alert("请填写正确的表单信息!");
        return;
    }

    await fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then((res) => res.json())
    .then((result) => {
        if (result.success) {
            alert("文件上传成功!");
            // console.log(result.files);
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

function checkCorrectness(formData) {
    const courseName = formData.get("course-name");
    const fileKind = formData.get("file-kind");
    const fileName = formData.get("file").name;
    let reg;
    switch (fileKind) {
        case "transcript":
            return /成绩单.pdf/g.test(fileName);
        case "test-paper":
            return /空白试卷.docx/g.test(fileName);
        case "regular-grade":
            reg = new RegExp(`(\\d{4}-){2}[12]-3${courseName}-平时成绩单.docx`);
            return reg.test(fileName);
        case "teaching-calendar":
            reg = new RegExp(`北京理工大学《 *${courseName} *》课程教学日历(\\d{4}-){2}[12].doc`);
            return reg.test(fileName);
        case "analysis-statistics":
            reg = new RegExp(`(\\d{4}-){2}[12]-4${courseName}-成绩统计试卷分析.docx`);
            return reg.test(fileName);
        case "scoring-standard":
            reg = new RegExp(`(\\d{4}-){2}[12]-2${courseName}-试卷评分标准.docx`);
            return reg.test(fileName);
        case "others":
        default:
            return true;
    }
}