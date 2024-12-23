// manageFileUploaded.js -- 管理上传的文件
import {EasyDB} from "../javascript/easyDB.js";

// 获取表格体
const tbody = document.querySelector("#data-table tbody");

// 创建数据库对象并连接
const db = new EasyDB();
db.connect();

db.forEach((key, value) => {
    tbody.innerHTML += `
        <tr>
            <td>${value.fileName}</td>
            <td>${value.fileKind}</td>
            <td>${value.uploadTime}</td>
            <td>${value.fileSize}</td>
            <td>
                <button class="download-btn">下载</button>
                <button class="delete-btn">删除</button>
            </td>
        </tr>
    `;
});
