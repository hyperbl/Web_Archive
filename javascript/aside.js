// aside.js -- 处理侧边栏的点击事件
const main = document.querySelector("main");
const sideBarItems = document.querySelectorAll("aside a.item");
const folders = document.querySelectorAll("aside a.folder");

// match each item with a specific page
for (const item of sideBarItems) {
  item.addEventListener("click", function (event) {
    event.preventDefault();
    let pageToLoad = event.target.href;
    loadHtml(main, pageToLoad, false);
  })
}

// toggle a folder (fold/unfold)
for (const folder of folders) {
  folder.addEventListener("click", function (event) {
    event.preventDefault();
    let folderToUnfold = event.target.nextElementSibling;
    if (folderToUnfold.style.display === "block") {
      folderToUnfold.style.display = "none";
    } else {
      folderToUnfold.style.display = "block";
    }
  })
}