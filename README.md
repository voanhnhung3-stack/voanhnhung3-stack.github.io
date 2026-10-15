# EliWung Blog

基于 [Jekyll](https://jekyllrb.com/) + [Hux Blog](https://github.com/Huxpro/huxblog-boilerplate) 主题的个人博客，
托管在 GitHub Pages 上。目标站点：**https://voanhnhung3-stack.github.io**

---

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



---

## 致谢与许可

主题来自 [Hux Blog](https://github.com/Huxpro/huxblog-boilerplate)，遵循 Apache License 2.0，
原版权归 [Hux](https://huxpro.github.io) 所有。本仓库在其基础上做了配置与内容的自定义。
