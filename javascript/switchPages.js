// switchPages.js -- 实现不同页面的切换

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

      // change the title of the index.html to the title of the loaded page
      document.title = doc.title;

      // copy the css, js, and style from the loaded page to the current page
      doc.head.querySelectorAll("link").forEach(function (link) {
        document.head.appendChild(link);
      });

      doc.head.querySelectorAll("script").forEach(function (script) {
        // document.head.appendChild(script);
        // eval(script.innerHTML);
        loadJs(script.src, false);
      });

      doc.head.querySelectorAll("style").forEach(function (style) {
        document.head.appendChild(style);
      }); 

      // change the url of the page to the url of the loaded page
      // window.history.pushState({}, doc.title, file);

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
function loadJs(file, callback) {
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