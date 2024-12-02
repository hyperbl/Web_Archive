// aside.js -- 处理侧边栏相关逻辑

const aside = document.querySelector('aside');

const asideUl = aside.querySelector('ul');

const asideUlLis = asideUl.querySelectorAll('li');

for (const li of asideUlLis) {
    li.addEventListener('click', function(e) {
        e.stopPropagation();
        alert('hello');
    })
}