// manageFileUploaded.js -- 管理上传的文件
import {EasyDB} from "../javascript/easyDB.js";

// 获取表格体
const tbody = document.querySelector("#data-table tbody");

// 资料类别
const fileKind = {
    "transcript": "成绩单",
    "test-paper": "空白试卷",
    "regular-grade": "平时成绩",
    "teaching-calendar": "教学日历",
    "analysis-statistics": "试题分析和成绩统计",
    "scoring-standard": "评分标准",
    "others": "其他"
};

// 格式化文件大小
function formatFileSize(size) {
    let value = Number(size);
    if (size && !isNaN(value)) {
        let units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB"];
        let index = 0;
        while (value >= 1024) {
            value /= 1024;
            index++;
        }
        return value.toFixed(2) + " " + units[index];
    } else if (size.endsWith("B")) {
        return size;
    } else {
        return "NaN";
    }
}

// 创建表格的数据行
function createTableRow(value) {
    return `
        <tr class="data">
            <td>${value.courseName}</td>
            <td>${value.fileName}</td>
            <td>${fileKind[value.fileKind]}</td>
            <td>${value.uploadTime}</td>
            <td>${formatFileSize(value.fileSize)}</td>
            <td>
                <button class="download-btn">下载</button>
                <button class="delete-btn">删除</button>
            </td>
        </tr>
    `;
}

// 创建数据库对象并连接
const db = new EasyDB();
db.connect();

// 异步获取所有数据
db.getAll().then(data => data.forEach(value => {
    tbody.innerHTML += createTableRow(value);
}));

// 为搜索框绑定事件
const searchBtn = document.querySelector("#search-btn");
const searchName = document.querySelector("#choose-course #course-name");
const searchID = document.querySelector("#choose-course #course-id");
searchBtn.addEventListener("click", () => {
    tbody.innerHTML = "";
    db.getAll().then(data => {
        data.forEach(value => {
            if (searchName.value === "" || value.courseName === searchName.value) {
                if (searchID.value === "" || value.courseID === searchID.value) {
                    tbody.innerHTML += createTableRow(value);
                }
            }
        });
    });
});