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
            <td>${value.courseID}</td>
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

// 为搜索框添加事件
const searchBtn = document.querySelector("#search-btn");
const searchName = document.querySelector("#choose-course #course-name");
const searchID = document.querySelector("#choose-course #course-id");
searchBtn.addEventListener("click", () => {
    tbody.innerHTML = "";
    db.getAll().then(data => {
        data.forEach(value => {
            if (value.courseName.includes(searchName.value)) {
                if (value.courseID.includes(searchID.value)) {
                    tbody.innerHTML += createTableRow(value);
                }
            }
        });
    });
});

// 获取下载按钮对应文件名
function getFileName(btn) {
    return btn.parentElement.parentElement
            .children[2].textContent;
}

// 为下载按钮添加事件
tbody.addEventListener("click", e => {
    if (e.target.classList.contains("download-btn")) {
        const btn = e.target;
        const fileName = getFileName(btn);
        db.selectAsync({fileName: fileName}).then(data => {
            // 调用下载接口
            fetch(`/download?fileUrl=${data[0].fileUrl}`)
            .then(res => {
                if (res.ok) {
                    return res.blob();
                } else {
                    throw new Error("Network response was not ok." + res.statusText);
                }
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            })
            .catch(err => {
                console.error("Error occurred when downloading data: ", err);
            });
        }).catch(err =>{
            console.error("Error occurred when selecting data: ", err);
        });
    }
});

// 为删除按钮添加事件
tbody.addEventListener("click", e => {
    if (e.target.classList.contains("delete-btn")) {
        const btn = e.target;
        const fileName = getFileName(btn);
        db.deleteAsync({fileName: fileName}).then((data) => {

            // 调用删除接口
            fetch("/delete", {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({fileUrl: data[0].fileUrl})
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error("Network response was not ok." + res.statusText);
                }
            })
            .then(data => {
                if (data.error) {
                    console.error("Error occurred when deleting data: ", data.error);
                } else {
                    console.log("Delete data successfully: ", data.message);
                    alert("删除成功！");
                    btn.parentElement.parentElement.remove();
                }
            })
            .catch(err => {
                console.error("Error occurred when deleting data: ", err);
            });
            btn.parentElement.parentElement.remove();
        }).catch(err => {
            console.error("Error occurred when deleting data: ", err);
        });
    }
});