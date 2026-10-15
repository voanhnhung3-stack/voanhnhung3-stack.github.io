#!/usr/bin/env node
/**
 * preview.js —— 迷你 Jekyll 本地预览构建器
 *
 * 作用：在没有安装 Ruby/Jekyll 的机器上，把站点源码渲染成静态 HTML，
 *       放到 _site_preview/ 里，用于本地预览和模板语法校验。
 *       它不参与 GitHub Pages 的线上构建（线上由 GitHub 原生的 Jekyll 构建）。
 *
 * 用法：node tools/preview.js
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');
const { Liquid } = require('liquidjs');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '_site_preview');
const SITE_ROOT = path.join(OUT, 'site');

const md = new MarkdownIt({ html: true, linkify: true });

const engine = new Liquid({
  root: [path.join(ROOT, '_includes'), path.join(ROOT, '_layouts')],
  extname: '.html',
  cache: false,
  dynamicPartials: false,
  locale: 'en-US',
});

// liquidjs 未内置、但 Jekyll 有的过滤器
engine.registerFilter('xml_escape', (v) =>
  String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
);
engine.registerFilter('date_to_rfc822', (v) => new Date(v).toUTCString());

// ---------------------------------------------------------------- config
const config = yaml.load(fs.readFileSync(path.join(ROOT, '_config.yml'), 'utf8'));
const COND = String(config['featured-condition-size']);

/** 主题里写了 {% if x > {{site.featured-condition-size}} %}，这里把内层输出替换掉 */
function fixConditionSize(text) {
  return text.replace(/\{\{\s*site\.featured-condition-size\s*\}\}/g, COND);
}

/** YAML 会把 `2026-10-12 20:00:00` 当成 UTC，这里还原成本地时刻，避免日期多出一天 */
function localize(d) {
  return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
}

// ---------------------------------------------------------------- posts
function loadPosts() {
  const dir = path.join(ROOT, '_posts');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(md|markdown|html)$/i.test(f))
    .map((f) => {
      const gm = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
      const m = f.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.(md|markdown|html)$/i);
      if (!m) return null;
      const [, y, mo, d, slug, ext] = m;
      const date = gm.data.date
        ? localize(new Date(gm.data.date))
        : new Date(`${y}-${mo}-${d}T00:00:00`);
      return {
        kind: 'post',
        file: f,
        slug,
        date,
        url: `/${y}/${mo}/${d}/${slug}/`,
        layout: gm.data.layout || 'post',
        isMarkdown: ext.toLowerCase() !== '.html',
        data: gm.data,
        body: gm.content,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.date - a.date);
}

// ---------------------------------------------------------------- pages
const PAGE_FILES = ['about.html', 'archive.html', 'resume.html', '404.html'];

function pageUrlFor(file, data) {
  if (data.permalink) return data.permalink;
  const base = file.replace(/\.html?$/i, '');
  return `/${base}/`;
}

function loadPages() {
  const pages = [];
  for (const f of PAGE_FILES) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) continue;
    const gm = matter(fs.readFileSync(p, 'utf8'));
    pages.push({
      kind: 'page',
      file: f,
      url: pageUrlFor(f, gm.data),
      layout: gm.data.layout || 'default',
      isMarkdown: false,
      data: gm.data,
      body: gm.content,
    });
  }
  return pages;
}

// pages 在导航里按这个顺序出现
const NAV_ORDER = ['about.html', 'archive.html', 'resume.html'];
const pages = loadPages().sort(
  (a, b) => NAV_ORDER.indexOf(a.file) - NAV_ORDER.indexOf(b.file)
);

const posts = loadPosts();

// ---------------------------------------------------------------- site
/** 把内部对象摊平成 Liquid 能直接取值的结构（post.title / page.url ...） */
function flatten(p) {
  return Object.assign({}, p.data, {
    url: p.url,
    layout: p.layout,
    date: p.date,
    content: p.content || '',
  });
}

const site = Object.assign({}, config, {
  baseurl: config.baseurl || '',
  time: new Date(),
  posts: [],
  pages: pages.filter((p) => p.data.title).map(flatten),
  tags: {},
  categories: {},
  related_posts: [],
});

// ---------------------------------------------------------------- render
function pageContext(p) {
  return Object.assign({}, p.data, {
    url: p.url,
    layout: p.layout,
    date: p.date,
    content: p.content || '',
  });
}

async function renderLiquid(text, page) {
  const ctx = { site, page, content: page.content || '' };
  return engine.parseAndRender(fixConditionSize(text), ctx);
}

/** 渲染一个页面（含 layout 链） */
async function renderPage(p) {
  const page = pageContext(p);

  let html;
  if (p.kind === 'post') {
    const src = await renderLiquid(p.body, page);
    html = md.render(src);
  } else {
    html = await renderLiquid(p.body, page);
  }

  let layoutName = p.layout;
  let guard = 0;
  while (layoutName && guard++ < 12) {
    const lp = path.join(ROOT, '_layouts', `${layoutName}.html`);
    if (!fs.existsSync(lp)) {
      console.warn(`  ! 找不到 layout: ${layoutName}`);
      break;
    }
    const lgm = matter(fs.readFileSync(lp, 'utf8'));
    page.content = html;
    const ctx = { site, page, content: html };
    html = await engine.parseAndRender(fixConditionSize(lgm.content), ctx);
    layoutName = lgm.data.layout;
  }
  return html;
}

// ---------------------------------------------------------------- assets
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function writePage(url, html) {
  let rel;
  if (url.endsWith('.html')) rel = url.replace(/^\//, '');
  else rel = path.join(url.replace(/^\//, ''), 'index.html');
  const dest = path.join(SITE_ROOT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html, 'utf8');
  return rel;
}

// ---------------------------------------------------------------- build
(async function build() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(SITE_ROOT, { recursive: true });

  const built = [];
  const errors = [];

  // 1) 先渲染文章正文，让 site.posts[].content 可用
  for (const post of posts) {
    try {
      const page = pageContext(post);
      const src = await renderLiquid(post.body, page);
      post.content = md.render(src);
    } catch (e) {
      errors.push(`${post.file}: ${e.message}`);
    }
  }

  // 2) 文章页
  site.posts = posts.map(flatten);
  const tagMap = {};
  for (const post of site.posts) {
    for (const t of post.tags || []) (tagMap[t] = tagMap[t] || []).push(post);
  }
  site.tags = tagMap;

  for (const post of posts) {
    try {
      writePage(post.url, await renderPage(post));
      built.push(post.url);
    } catch (e) {
      errors.push(`${post.file}: ${e.message}`);
    }
  }

  // 3) 普通页面
  for (const p of pages) {
    try {
      writePage(p.url, await renderPage(p));
      built.push(p.url);
    } catch (e) {
      errors.push(`${p.file}: ${e.message}`);
    }
  }

  // 4) 首页（含分页）
  try {
    const gm = matter(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'));
    const per = config.paginate || 10;
    const total = Math.max(1, Math.ceil(site.posts.length / per));
    const indexPage = {
      kind: 'page',
      file: 'index.html',
      url: '/',
      layout: gm.data.layout || 'page',
      isMarkdown: false,
      data: gm.data,
      body: gm.content,
    };
    for (let i = 1; i <= total; i++) {
      const chunk = site.posts.slice((i - 1) * per, i * per);
      const isFirst = i === 1;
      const url = isFirst ? '/' : `/page${i}/`;
      const page = pageContext(indexPage);
      page.url = url;
      const ctx = {
        site,
        page,
        content: '',
        paginator: {
          posts: chunk,
          page: i,
          per_page: per,
          total_posts: site.posts.length,
          total_pages: total,
          previous_page: i > 1 ? i - 1 : null,
          next_page: i < total ? i + 1 : null,
          previous_page_path: i > 2 ? `/page${i - 1}/` : i === 2 ? '/' : null,
          next_page_path: i < total ? `/page${i + 1}/` : null,
        },
      };
      let html = await engine.parseAndRender(fixConditionSize(gm.content), ctx);
      let layoutName = indexPage.layout;
      let guard = 0;
      while (layoutName && guard++ < 12) {
        const lp = path.join(ROOT, '_layouts', `${layoutName}.html`);
        if (!fs.existsSync(lp)) break;
        const lgm = matter(fs.readFileSync(lp, 'utf8'));
        ctx.content = html;
        html = await engine.parseAndRender(fixConditionSize(lgm.content), ctx);
        layoutName = lgm.data.layout;
      }
      writePage(url, html);
      built.push(url);
    }
  } catch (e) {
    errors.push(`index.html: ${e.message}`);
  }

  // 5) 静态资源
  for (const d of ['css', 'js', 'fonts', 'img']) {
    copyDir(path.join(ROOT, d), path.join(SITE_ROOT, d));
  }

  console.log(`\n构建完成：${built.length} 个页面 → ${path.relative(ROOT, SITE_ROOT)}`);
  built.forEach((u) => console.log(`  ✓ ${u}`));
  if (errors.length) {
    console.log(`\n${errors.length} 个错误：`);
    errors.forEach((e) => console.log(`  ✗ ${e}`));
    process.exitCode = 1;
  }
})();
