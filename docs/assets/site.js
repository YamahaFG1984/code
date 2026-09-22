/* ================================================================
   有效软件测试教程 · 共享脚本：侧边栏、目录、代码高亮、主题
   ================================================================ */
(function () {
  'use strict';

  var CHAPTERS = [
    { n: 1,  f: 'ch01.html', t: '高效而系统的软件测试', d: '为什么要测试、测试为什么难，以及测试金字塔', part: '第一部分 · 测试思维' },
    { n: 2,  f: 'ch02.html', t: '基于规格说明的测试',   d: '从需求出发：划分等价类、分析边界、设计用例', part: '第二部分 · 设计测试用例' },
    { n: 3,  f: 'ch03.html', t: '结构化测试与代码覆盖率', d: '行、分支、条件、MC/DC 覆盖，以及变异测试' },
    { n: 4,  f: 'ch04.html', t: '契约式设计',           d: '前置条件、后置条件、不变式与里氏替换' },
    { n: 5,  f: 'ch05.html', t: '基于属性的测试',       d: '让框架替你生成上百个输入：jqwik 实战' },
    { n: 6,  f: 'ch06.html', t: '测试替身与 Mock',      d: 'Dummy、Fake、Stub、Mock、Spy 与 Mockito', part: '第三部分 · 测试与设计' },
    { n: 7,  f: 'ch07.html', t: '为可测试性而设计',     d: '分离领域与基础设施、依赖注入、六边形架构' },
    { n: 8,  f: 'ch08.html', t: '测试驱动开发',         d: '红-绿-重构：用罗马数字转换器走一遍 TDD' },
    { n: 9,  f: 'ch09.html', t: '编写更大的测试',       d: '组件测试、SQL 集成测试、Selenium 系统测试', part: '第四部分 · 走向真实项目' },
    { n: 10, f: 'ch10.html', t: '测试代码质量',         d: '好测试的特征、测试异味与 Test Data Builder' },
    { n: 11, f: 'ch11.html', t: '全书总结',             d: '把所有技术串起来，以及接下来学什么' },
    { n: 'A', f: 'appendix.html', t: 'JUnit 5 入门',   d: '第一个测试、@BeforeEach 与参数化测试', part: '附录' }
  ];

  var curKey = document.body.dataset.chapter || '0';
  var curIdx = -1;
  CHAPTERS.forEach(function (c, i) { if (String(c.n) === curKey) curIdx = i; });

  function label(c) { return c.n === 'A' ? '附录 A' : '第 ' + c.n + ' 章'; }

  /* ---------- 侧边栏 ---------- */
  var side = document.getElementById('sidebar');
  if (side) {
    var html = '<a class="brand" href="index.html"><span class="flame">&#10004;</span>' +
      '<span>有效软件测试<small>写给开发者的系统化测试指南</small></span></a>';
    CHAPTERS.forEach(function (c, i) {
      if (c.part) html += '<div class="part">' + c.part + '</div>';
      html += '<a class="ch' + (i === curIdx ? ' active' : '') + '" href="' + c.f +
        '"><span class="n">' + c.n + '</span><span>' + c.t + '</span></a>';
    });
    side.innerHTML = html;
    var active = side.querySelector('a.ch.active');
    if (active) setTimeout(function () {
      active.scrollIntoView({ block: 'center' });
    }, 0);
  }

  /* ---------- 移动端菜单 ---------- */
  var btn = document.createElement('button');
  btn.id = 'menu-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', '目录');
  btn.innerHTML = '&#9776;';
  btn.onclick = function () { document.body.classList.toggle('nav-open'); };
  document.body.appendChild(btn);
  document.addEventListener('click', function (e) {
    if (document.body.classList.contains('nav-open') &&
        side && !side.contains(e.target) && e.target !== btn) {
      document.body.classList.remove('nav-open');
    }
  });

  /* ---------- 主题切换 ---------- */
  var tbtn = document.createElement('button');
  tbtn.id = 'theme-btn';
  tbtn.type = 'button';
  tbtn.setAttribute('aria-label', '切换深浅色');
  tbtn.innerHTML = '&#9789;';
  tbtn.onclick = function () {
    var root = document.documentElement;
    var now = root.getAttribute('data-theme');
    var dark = now ? now === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', dark ? 'light' : 'dark');
    try { localStorage.setItem('est-doc-theme', dark ? 'light' : 'dark'); } catch (e) {}
  };
  document.body.appendChild(tbtn);
  try {
    var saved = localStorage.getItem('est-doc-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  } catch (e) {}

  /* ---------- 箭头 marker（全局一次） ---------- */
  var defs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  defs.setAttribute('width', '0'); defs.setAttribute('height', '0');
  defs.setAttribute('style', 'position:absolute');
  // SVG marker 的内容不会从引用它的元素继承 color，所以直接用 CSS 变量填色。
  function mk(id, color) {
    return '<marker id="' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path d="M0,0 L10,5 L0,10 z" fill="var(' + color + ')"/></marker>';
  }
  defs.innerHTML = '<defs>' + mk('ar', '--fg-faint') + mk('ar-a', '--accent') + mk('ar-b', '--blue') +
    mk('ar-g', '--green') + mk('ar-r', '--red') + mk('ar-p', '--purple') + '</defs>';
  document.body.appendChild(defs);

  /* ---------- 章节内目录 ---------- */
  var main = document.querySelector('main');
  var slot = document.getElementById('chapter-toc');
  if (slot && main) {
    var hs = main.querySelectorAll('h2');
    if (hs.length > 2) {
      var t = '<div class="h">本章目录</div><ol>';
      hs.forEach(function (h, i) {
        if (!h.id) h.id = 'sec-' + (i + 1);
        t += '<li><a href="#' + h.id + '">' + h.textContent + '</a></li>';
      });
      slot.className = 'toc';
      slot.innerHTML = t + '</ol>';
    }
  }

  /* ---------- 代码块：语言标签 + 复制 + 高亮 ---------- */
  var KW = ('public|private|protected|class|interface|enum|record|extends|implements|static|final|abstract|' +
    'void|int|long|double|float|boolean|char|byte|short|var|return|if|else|for|while|do|switch|case|' +
    'default|break|continue|new|throw|throws|try|catch|finally|import|package|instanceof|this|super|' +
    'null|true|false|assert|synchronized').split('|');

  var RE_JAVA = new RegExp(
    '(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)' +                                    // 1 注释
    '|("(?:\\\\[\\s\\S]|[^\\\\"\\n])*"|\'(?:\\\\[\\s\\S]|[^\\\\\'\\n])*\')' +     // 2 字符串
    '|(@[A-Za-z]\\w*)' +                                                            // 3 注解
    '|\\b(' + KW.join('|') + ')\\b' +                                              // 4 关键字
    '|\\b([A-Z][A-Za-z0-9_]*)\\b' +                                                // 5 类型
    '|\\b(\\d+(?:\\.\\d+)?[LlDdFf]?)\\b' +                                          // 6 数字
    '|\\b([a-zA-Z_$][\\w$]*)(?=\\()',                                              // 7 方法调用
    'g');

  var KW_PY = ('def|class|return|if|elif|else|for|while|in|not|and|or|is|import|from|as|with|try|except|' +
    'finally|raise|assert|lambda|yield|pass|break|continue|None|True|False|self|global|nonlocal|async|await').split('|');
  var RE_PY = new RegExp(
    /(#[^\n]*)/.source +                                                            // 1 注释
    /|("""[\s\S]*?"""|'''[\s\S]*?'''|[fbr]?"(?:\\.|[^\\"\n])*"|[fbr]?'(?:\\.|[^\\'\n])*')/.source + // 2 字符串
    /|(@[A-Za-z_][\w.]*)/.source +                                                  // 3 装饰器
    '|\\b(' + KW_PY.join('|') + ')\\b' +                                            // 4 关键字
    /|\b([A-Z][A-Za-z0-9_]*)\b/.source +                                            // 5 类名
    /|\b(\d+(?:\.\d+)?)\b/.source +                                                 // 6 数字
    /|\b([a-zA-Z_]\w*)(?=\()/.source,                                               // 7 函数调用
    'g');

  var KW_TS = ('const|let|var|function|return|if|else|await|async|import|from|export|default|new|class|' +
    'extends|implements|for|while|of|in|do|try|catch|finally|throw|switch|case|break|continue|' +
    'type|interface|enum|as|typeof|instanceof|void|public|private|readonly|' +
    'null|undefined|true|false|this|super|static|number|string|boolean').split('|');
  var RE_TS = new RegExp(
    /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)/.source +
    /|(`(?:\\[\s\S]|[^\\`])*`|'(?:\\[\s\S]|[^\\'\n])*'|"(?:\\[\s\S]|[^\\"\n])*")/.source +
    /|(@[A-Za-z]\w*)/.source +
    '|\\b(' + KW_TS.join('|') + ')\\b' +
    /|\b([A-Z][A-Za-z0-9_]*)\b/.source +
    /|\b(\d+(?:\.\d+)?)\b/.source +
    /|\b([a-zA-Z_$][\w$]*)(?=\()/.source,
    'g');

  var RE_SH = /(#[^\n]*)|('(?:\\[\s\S]|[^\\'])*'|"(?:\\[\s\S]|[^\\"])*")|\b(mvn|java|git|cd|mkdir|curl|export|docker|chmod)\b/g;
  var RE_XML = /(<!--[\s\S]*?-->)|("[^"\n]*")|(<\/?[\w.:-]+|\/?>)/g;
  var RE_SQL = /(--[^\n]*)|('(?:[^'])*')|\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|AND|OR|NOT|NULL|ORDER|BY|GROUP|PRIMARY|KEY|DROP|IF|EXISTS|LIKE|AS|select|from|where|insert|into|values|delete|create|table|and|or|not|null|order|by|like|as)\b|\b(\d+(?:\.\d+)?)\b/g;

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function paint(src, re, classes) {
    var out = '', last = 0, m;
    re.lastIndex = 0;
    while ((m = re.exec(src)) !== null) {
      out += esc(src.slice(last, m.index));
      for (var g = 1; g < m.length; g++) {
        if (m[g] !== undefined) { out += '<span class="' + classes[g - 1] + '">' + esc(m[g]) + '</span>'; break; }
      }
      last = m.index + m[0].length;
      if (m[0].length === 0) re.lastIndex++;
    }
    return out + esc(src.slice(last));
  }

  document.querySelectorAll('.code').forEach(function (box) {
    var pre = box.querySelector('pre');
    if (!pre) return;
    var lang = box.dataset.lang || 'java';
    var file = box.dataset.file || '';
    var bar = document.createElement('div');
    bar.className = 'bar';
    bar.innerHTML = '<span class="tag">' + esc(file || lang) + '</span>';
    var cp = document.createElement('button');
    cp.className = 'copy'; cp.type = 'button'; cp.textContent = '复制';
    cp.onclick = function () {
      var txt = pre.textContent;
      if (navigator.clipboard) navigator.clipboard.writeText(txt);
      cp.textContent = '已复制'; setTimeout(function () { cp.textContent = '复制'; }, 1400);
    };
    bar.appendChild(cp);
    box.insertBefore(bar, pre);

    var code = pre.textContent.replace(/^\n/, '').replace(/\s+$/, '');
    if (lang === 'bash' || lang === 'sh' || lang === 'shell' || lang === 'text') {
      pre.innerHTML = paint(code, RE_SH, ['tk-cm', 'tk-st', 'tk-kw']);
    } else if (lang === 'xml') {
      pre.innerHTML = paint(code, RE_XML, ['tk-cm', 'tk-st', 'tk-kw']);
    } else if (lang === 'sql') {
      pre.innerHTML = paint(code, RE_SQL, ['tk-cm', 'tk-st', 'tk-kw', 'tk-nm']);
    } else if (lang === 'python' || lang === 'py') {
      pre.innerHTML = paint(code, RE_PY, ['tk-cm', 'tk-st', 'tk-an', 'tk-kw', 'tk-tp', 'tk-nm', 'tk-fn']);
    } else if (lang === 'ts' || lang === 'typescript' || lang === 'js') {
      pre.innerHTML = paint(code, RE_TS, ['tk-cm', 'tk-st', 'tk-an', 'tk-kw', 'tk-tp', 'tk-nm', 'tk-fn']);
    } else if (lang === 'plain') {
      pre.innerHTML = esc(code);
    } else {
      pre.innerHTML = paint(code, RE_JAVA, ['tk-cm', 'tk-st', 'tk-an', 'tk-kw', 'tk-tp', 'tk-nm', 'tk-fn']);
    }
  });

  /* ---------- 多语言标签页：Java / Python / TypeScript ----------
     写法：<div class="langs">
             <div class="code" data-lang="java" data-file="…"><pre>…</pre></div>
             <div class="code" data-lang="python" …>…</div>
             <div class="code" data-lang="ts" …>…</div>
           </div>
     切换任意一组，全页所有组同步切换，并记住选择。 */
  var LANG_NAME = { java: 'Java', python: 'Python', ts: 'TypeScript', js: 'JavaScript' };
  function norm(l) { return l === 'py' ? 'python' : (l === 'typescript' ? 'ts' : l); }
  var groups = document.querySelectorAll('.langs');
  function pickLang(l) {
    groups.forEach(function (g) {
      var boxes = g.querySelectorAll(':scope > .code');
      var want = norm(boxes[0].dataset.lang);
      boxes.forEach(function (b) { if (norm(b.dataset.lang) === l) want = l; });
      boxes.forEach(function (b) { b.hidden = norm(b.dataset.lang) !== want; });
      g.querySelectorAll('.lang-tabs button').forEach(function (t) {
        t.classList.toggle('on', t.dataset.l === want);
        t.setAttribute('aria-selected', t.dataset.l === want ? 'true' : 'false');
      });
    });
  }
  groups.forEach(function (g) {
    var tabs = document.createElement('div');
    tabs.className = 'lang-tabs';
    tabs.setAttribute('role', 'tablist');
    g.querySelectorAll(':scope > .code').forEach(function (b) {
      var l = norm(b.dataset.lang);
      var t = document.createElement('button');
      t.type = 'button'; t.dataset.l = l; t.setAttribute('role', 'tab');
      t.textContent = LANG_NAME[l] || l;
      t.onclick = function () {
        var y = tabs.getBoundingClientRect().top;
        pickLang(l);
        window.scrollBy(0, tabs.getBoundingClientRect().top - y);   // 切换后保持当前位置不跳动
        try { localStorage.setItem('est-doc-lang', l); } catch (e) {}
      };
      tabs.appendChild(t);
    });
    g.insertBefore(tabs, g.firstChild);
  });
  if (groups.length) {
    var savedLang = 'java';
    try { savedLang = localStorage.getItem('est-doc-lang') || 'java'; } catch (e) {}
    pickLang(savedLang);
  }

  /* ---------- 上一章 / 下一章 ---------- */
  var pager = document.getElementById('pager');
  if (pager && curIdx >= 0) {
    var prev = CHAPTERS[curIdx - 1];
    var next = CHAPTERS[curIdx + 1];
    var h = '';
    h += prev ? '<a class="prev" href="' + prev.f + '"><span>&larr; 上一章</span>' + label(prev) + ' · ' + prev.t + '</a>'
              : '<a class="prev" href="index.html"><span>&larr; 返回</span>课程首页</a>';
    h += next ? '<a class="next" href="' + next.f + '"><span>下一章 &rarr;</span>' + label(next) + ' · ' + next.t + '</a>'
              : '<a class="next" href="index.html"><span>完成 &rarr;</span>回到课程首页</a>';
    pager.className = 'pager';
    pager.innerHTML = h;
  }

  /* ---------- 首页目录 ---------- */
  var grid = document.getElementById('toc-grid');
  if (grid) {
    var g = '';
    CHAPTERS.forEach(function (c) {
      g += '<a class="toc-card" href="' + c.f + '">' +
        '<div class="n">' + label(c) + '</div>' +
        '<div class="t">' + c.t + '</div>' +
        '<div class="d">' + c.d + '</div></a>';
    });
    grid.className = 'toc-grid';
    grid.innerHTML = g;
  }
})();
