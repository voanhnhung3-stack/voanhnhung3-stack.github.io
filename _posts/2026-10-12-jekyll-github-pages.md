---
layout:     post
title:      "用 GitHub Pages + Jekyll 搭一个自己的博客"
subtitle:   "\"零成本、零服务器\""
date:       2026-10-12 20:00:00
author:     "EliWung"
header-img: "img/post-bg-unix-linux.jpg"
tags:
    - Jekyll
    - Blog
---

## 为什么是 GitHub Pages + Jekyll

搭博客的方案有很多，WordPress、Hexo、Hugo、Notion……
但如果你只是想安静地写点技术文章，**GitHub Pages + Jekyll** 大概是性价比最高的选择：

| 优点 | 说明 |
| --- | --- |
| 完全免费 | GitHub 提供域名和无限空间，不需要买服务器 |
| 写作体验好 | 全程 Markdown，`git push` 即发布 |
| 无需构建 | GitHub Pages 原生支持 Jekyll，推上去自动编译 |
| 可定制 | 就是一个模板引擎，想改哪儿改哪儿 |

## 三步搞定

### 1. 建仓库

新建一个名为 `<你的用户名>.github.io` 的仓库。

> 这里的「用户名」指的是 **GitHub 登录名（@handle）**，不是个人主页上那个显示名（Name），
> 两者经常被搞混。比如登录名是 `voanhnhung3-stack`、显示名是 `EliWung`，那仓库就得叫
> `voanhnhung3-stack.github.io`，网址也是 `voanhnhung3-stack.github.io`。

### 2. 放上代码

把 Jekyll 站点的文件推到仓库的 `main` 分支：

```bash
git clone https://github.com/voanhnhung3-stack/voanhnhung3-stack.github.io.git
cd voanhnhung3-stack.github.io
git add .
git commit -m "init blog"
git push origin main
```

### 3. 等一分钟

去 `https://voanhnhung3-stack.github.io` 看看，站点应该已经跑起来了。

## 几个关键配置

`_config.yml` 里最重要的三项：

```yaml
url: "https://voanhnhung3-stack.github.io"
baseurl: ""          # 用户名仓库留空；项目仓库写 "/仓库名"
permalink: pretty    # 生成的链接形如 /2026/10/15/hello-world/
```

> ⚠️ `baseurl` 是最容易踩的坑。用户主页仓库（`用户名.github.io`）必须留空，
> 否则所有 CSS 和图片都会 404，页面会变成一堆没有样式的裸文字。

## 怎么写新文章

在 `_posts/` 目录下新建文件，命名必须是 `YYYY-MM-DD-标题.md`：

```markdown
---
layout:     post
title:      "文章标题"
subtitle:   "副标题"
date:       2026-10-15 12:00:00
author:     "EliWung"
header-img: "img/post-bg-2015.jpg"
tags:
    - 技术
---

正文用 Markdown 写就好。
```

文件头的 `---` 之间叫 Front Matter，用来声明元信息；`tags` 里的标签会自动汇总到归档页。

## 小结

整个搭建过程大概半小时，之后维护成本几乎为零。
对一个想长期写点东西的人来说，这个投入非常划算。

--- 

*本文是这个博客的第一篇技术文章，也是搭站流程的备忘。*
