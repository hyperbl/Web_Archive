// switchPages.js -- 处理侧边栏相关逻辑

// load pages from another html file
// this function is used to load pages from another html file
// and replace the content of the current container(dst) with the loaded content
function loadHtml(dst, file, callback) {
  fetch(file)
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      dst.innerHTML = doc.body.innerHTML;

      // change the title of the index.html to the title of the loaded page
      document.title = doc.title;

      // change the url of the page to the url of the loaded page
      // window.history.pushState({}, doc.title, file);

      // no callback right now.
      if (callback) {
        callback();
      }
    })
    .catch(function (err) {
      console.warn('Something went wrong.', err);
    });
}

const main = document.querySelector("main");
const sideBarMenus = document.querySelectorAll("aside a");

// match each menu with a specific page
for (const menu of sideBarMenus) {
  menu.addEventListener("click", function (event) {
    event.preventDefault();
    let pageToLoad = event.target.href;
    loadHtml(main, pageToLoad, false);
  })
}