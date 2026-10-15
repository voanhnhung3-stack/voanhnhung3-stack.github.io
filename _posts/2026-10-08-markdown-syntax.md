---
layout:     post
title:      "Markdown 写作速查"
subtitle:   "\"这个博客都支持哪些写法\""
date:       2026-10-08 10:30:00
author:     "EliWung"
header-img: "img/post-bg-js-version.jpg"
tags:
    - Notes
    - Markdown
---

## 标题

用 `#` 到 `######` 表示六级标题。

## 强调

*斜体*、**加粗**、***加粗斜体***、~~删除线~~。

## 列表

无序列表：

- 第一项
- 第二项
    - 嵌套项

有序列表：

1. 先这样
2. 再那样

## 链接与图片

[这是一个链接](https://github.com/voanhnhung3-stack)

## 引用

> 人生是用来体验的，不是用来演绎完美的。

## 代码

行内代码：`const answer = 42;`

代码块：

```javascript
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}
```

```python
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

## 表格

| 方法 | 时间复杂度 | 空间复杂度 |
| --- | --- | --- |
| 递归 | O(2^n) | O(n) |
| 迭代 | O(n) | O(1) |

## 数学公式

这个主题接了 KaTeX，行内公式用 `$...$`，例如 $E = mc^2$；
独立成行的公式用 `$$...$$`：

$$
\text{TFP}_{it} = \alpha + \beta \cdot \text{Policy}_{it} + \gamma X_{it} + \mu_i + \lambda_t + \varepsilon_{it}
$$

## 分隔线

---

以上就是常用的写法，剩下的边写边查就好。
