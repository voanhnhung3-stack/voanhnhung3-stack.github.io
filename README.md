# EliWung Blog

基于 [Jekyll](https://jekyllrb.com/) + [Hux Blog](https://github.com/Huxpro/huxblog-boilerplate) 主题的个人博客，
托管在 GitHub Pages 上。目标站点：**https://voanhnhung3-stack.github.io**

---

## 〇、先搞清楚「用户名」和「显示名」

GitHub 账号上有两个不同的东西，很容易混：

| | 值 | 作用 |
| --- | --- | --- |
| **用户名（登录名 / @handle）** | `voanhnhung3-stack` | 决定**网址**和**仓库名** |
| **显示名（Name）** | `EliWung` | 只显示在个人主页上，不参与网址 |

所以：博客**名字**叫「EliWung Blog」，但**网址**是 `voanhnhung3-stack.github.io`，两者互不影响。

> 别再改成 `EliWung.github.io` —— GitHub 上不存在叫 `EliWung` 的用户，用这个名字建仓库无法开通用户站点。
> 如果以后想要 `eliwung.github.io` 这种短网址，只能重新注册一个用户名为 `EliWung` 的 GitHub 账号，
> 或者买一个自己的域名绑定过来。

---

## 一、目录结构

```
.
├── _config.yml          ← 全站配置（标题、社交账号、侧边栏…最先改这里）
├── _posts/              ← 文章都在这里，文件名必须是 YYYY-MM-DD-标题.md
├── _layouts/            ← 页面骨架（default / page / post）
├── _includes/           ← 公共片段（head / nav / footer）
├── index.html           ← 首页（文章列表 + 分页）
├── about.html           ← 关于页
├── archive.html         ← 归档页（标签云 + 按标签分组）
├── resume.html          ← 简历页（占位模板）
├── 404.html             ← 404 页
├── css/ js/ fonts/ img/ ← 静态资源
├── tools/preview.js     ← 本地预览构建器（不影响线上部署）
└── Gemfile              ← 本地跑 Jekyll 时需要
```

---

## 二、部署到 GitHub Pages

### 1. 建仓库

新建一个 **public** 仓库，名字必须**完全等于**：

```
voanhnhung3-stack.github.io
```

### 2. 推代码

```bash
cd voanhnhung3-stack.github.io
git add .
git commit -m "init blog"
git remote add origin https://github.com/voanhnhung3-stack/voanhnhung3-stack.github.io.git
git push -u origin main
```

### 3. 开启 Pages

仓库 → **Settings** → **Pages** → Source 选 `Deploy from a branch`，
Branch 选 `main` / `root`，保存。等 1～10 分钟，访问：

```
https://voanhnhung3-stack.github.io
```

之后每次写完文章，`git push` 就会自动重新构建，不需要任何其他操作。

---

## 三、本地预览

本机没有装 Ruby 也能看效果 —— 项目自带一个迷你构建器：

```bash
node tools/preview.js
```

生成结果在 `_site_preview/site/`，用浏览器打开其中的 `index.html` 即可。

如果想用官方 Jekyll（效果与线上完全一致）：

```bash
gem install bundler
bundle install
bundle exec jekyll serve
# 打开 http://127.0.0.1:4000
```

---

## 四、日常修改

### 改站点信息

打开 `_config.yml`：

| 配置项 | 说明 |
| --- | --- |
| `title` / `SEOTitle` | 左上角站名 / 浏览器标题（现在是 EliWung Blog） |
| `description` / `keyword` | SEO 描述与关键词 |
| `url` | 站点地址，必须是 `https://voanhnhung3-stack.github.io` |
| `baseurl` | 用户主页仓库必须留空；若改用项目仓库则写 `/仓库名` |
| `sidebar-about-description` | 侧边栏「ABOUT ME」的一句话简介 |
| `sidebar-avatar` | 头像路径，换成你自己的照片 |
| `github_username` | GitHub 图标指向的账号 |
| `friends` | 友链 |
| `busuanzi` | 是否显示访问量统计 |

### 写一篇新文章

在 `_posts/` 下新建 `2026-10-20-my-post.md`：

```markdown
---
layout:     post
title:      "文章标题"
subtitle:   "副标题（可省略）"
date:       2026-10-20 12:00:00
author:     "EliWung"
header-img: "img/post-bg-2015.jpg"   # 顶部大图
tags:
    - 技术
    - Notes
---

正文用 Markdown 写。支持表格、代码高亮，以及 $E=mc^2$ / $$...$$ 数学公式。
```

`tags` 里的标签会自动汇总到归档页和侧边栏「FEATURED TAGS」。

### 换主题色

主题强调色是 `#0085a1`，全局替换 `css/hux-blog.css`、`css/hux-blog.min.css`
以及 `_includes/footer.html` 里 tagcloud 的色值即可。

---

## 五、常见问题

**页面全是裸文字、没有样式？**
`_config.yml` 里的 `baseurl` 没留空。用户主页仓库必须是 `baseurl: ""`。

**访问量一直显示 `-`？**
不蒜子（busuanzi）偶有不稳定，不影响正文。也可以在 `_config.yml` 里设 `busuanzi: false` 关掉。

**想加评论？**
推荐 [giscus](https://giscus.app/)（基于 GitHub Discussions，免费无广告）。
在 `_layouts/post.html` 里把 `{% if site.disqus_username %}` 那段替换成 giscus 的脚本即可。

**想绑自己的域名？**
买好域名后，在仓库根目录新建一个内容为域名的 `CNAME` 文件，再去域名商处把 DNS
指向 GitHub Pages，最后在 Settings → Pages 里填上域名。
（现在项目里**没有** CNAME 文件是对的，用默认的 `*.github.io` 网址不需要它。）

---

## 六、致谢与许可

主题来自 [Hux Blog](https://github.com/Huxpro/huxblog-boilerplate)，遵循 Apache License 2.0，
原版权归 [Hux](https://huxpro.github.io) 所有。本仓库在其基础上做了配置与内容的自定义。
