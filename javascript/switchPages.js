// switchPages.js -- 实现不同页面的切换
let newlinks=[];
let newscripts=[];
let newstyles=[];

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
      var doc = parser.parseFromString(html, "text/html");
      dst.querySelector("div.loadArea").innerHTML = doc.body.innerHTML;

      // remove the css, js, and style from the previous-loaded page
      newlinks.forEach(function (link) {
        link.remove();
      });
      newstyles.forEach(function (style) {
        style.remove();
      });
      newscripts.forEach(function (script) {
        script.remove();
      });

      // change the title of the index.html to the title of the loaded page
      document.title = doc.title;

      // copy the css, js, and style from the loaded page to the current page
      doc.head.querySelectorAll("link").forEach(function (link) {
        newlinks.push(link);
        document.head.appendChild(link);
      });

      doc.head.querySelectorAll("script").forEach(function (script) {
        // document.head.appendChild(script);
        // eval(script.innerHTML);
        // loadJs(script.src, false);
        loadJs(script.src, script.type === "module");
      });

      doc.head.querySelectorAll("style").forEach(function (style) {
        newstyles.push(style);
        document.head.appendChild(style);
      }); 



      // no callback right now.
      if (callback) {
        callback();
      }
    })
    .catch(function (err) {
      console.warn("Something went wrong.", err);
    });
}

// load javascript file from loaded pages
function loadJs0(file, callback) {
  fetch(file)
    .then(function (response) {
      return response.text();
    })
    .then(function (js) {
      eval(js);
      if (callback) {
        callback();
      }
    })
    .catch(function (err) {
      console.warn("Something went wrong.", err);
    });
}

function loadJs(file, isModule = false, callback) {
  const script = document.createElement("script");
  // 添加随机时间戳，防止缓存
  const timestamp = new Date().getTime();
  script.src = `${file}?t=${timestamp}`;
  script.type = isModule ? "module" : "text/javascript";
  script.defer = true;
  script.onload = () => {
    if (callback) callback();
  };
  script.onerror = (err) => {
    console.warn("Failed to load script:", file, err);
  };
  newscripts.push(script);
  document.head.appendChild(script);
}
