# 韦乐衍 · Leyan —— weileyan.com

一个给 7 岁小男孩的手写风个人小站。纯静态，无构建步骤，直接托管在 GitHub Pages。

- 线上地址：<https://weileyan.com>
- 设计：蜡笔冒险图鉴（暖纸底 + 手绘线条 + 贴纸卡片）
- 字体：站酷快乐体 / Ma Shan Zheng / Baloo 2 / Noto Sans SC（Google Fonts，加载失败时自动回退到系统字体）

## 文件结构

```
.
├── index.html          # 全部内容都在这一个文件里，改文案直接编辑它
├── assets/
│   ├── styles.css      # 配色、字体、动画；顶部 :root 里是全部设计变量
│   ├── main.js         # 年龄计算、生日倒计时、滚动入场、生日彩带、留言板开关（TWIKOO_ENV）
│   ├── favicon.svg     # 浏览器标签小图标（篮球）
│   ├── born.jpg        # 出生写真（成长路）
│   ├── one-year.jpg    # 周岁写真
│   ├── xiaoban.jpg     # 小班证件照（成长路）
│   ├── zhongban.jpg    # 中班证件照
│   ├── daban.jpg       # 大班证件照
│   ├── yinianji.jpg    # 一年级证件照
│   └── photos/         # 照片墙，按年龄分组
│       ├── newborn-1..5.jpg     # 新生儿写真（2019）
│       ├── one-year-01..19.jpg  # 周岁写真（2020）
│       ├── christmas-1..4.jpg   # 五岁 · 圣诞写真
│       └── rugby-1..5.jpg       # 五岁 · 橄榄球写真
├── CNAME               # 自定义域名，GitHub 靠这个文件绑定站点
└── .nojekyll           # 告诉 GitHub 不要用 Jekyll 处理文件
```

> 图片文件名用拼音（`xiaoban.jpg` 等）而不是中文，避免部分网络环境下 URL 编码出岔子。
> 新照片先压小再上传（成长路的图只显示 140px 宽，640px 足够清晰）：
>
> ```bash
> node -e 'require("sharp")("assets/出生.jpg").rotate().resize({width:640}).jpeg({quality:78}).toFile("assets/born.jpg")'
> ```
>
> `.gitignore` 已经排除了 `出生.jpg`、`周岁.jpg` 这两张原始大图，不会被提交。

## 本地预览

```bash
# 在本目录下执行，任选一种
python -m http.server 4173     # 然后打开 http://localhost:4173
npx serve .                    # 然后打开 http://localhost:3000
```

直接双击 `index.html` 用 `file://` 打开也能看，只是字体和动画偶发受限。

## 部署到 GitHub Pages

### 1. 建仓库

GitHub 上新建一个仓库，名字随意（例如 `weileyan`），选 **Public**。
> 如果建成 `<你的用户名>.github.io`，站点在未绑定域名时也能在根路径访问；建成别的名字则是 `<用户名>.github.io/weileyan/`。本项目用的是相对路径，两种都能正常工作。

### 2. 推送代码

```bash
cd D:/Projects/weileyan
git init
git add .
git commit -m "init: Leyan personal site"
git branch -M main
git remote add origin git@github.com:<你的用户名>/weileyan.git   # 用 HTTPS 就把这段换成仓库的 https 地址
git push -u origin main
```

### 3. 开启 Pages

仓库 **Settings → Pages**：
1. Source 选 **Deploy from a branch**，Branch 选 `main` / `/ (root)`，保存。
2. 等十几秒，页面会显示站点地址 `https://<你的用户名>.github.io/weileyan/`。
3. 同一页下方的 Custom domain 一般会因为仓库里的 `CNAME` 文件自动填好 `weileyan.com`；没有的话手动填入并 **Save**。
4. 勾选 **Enforce HTTPS**（要等 DNS 生效后证书签发完成，通常几分钟到半小时）。

### 4. 域名解析（在域名注册商的控制台操作）

登录你买 `weileyan.com` 的平台（阿里云 / DNSPod / Cloudflare 等），添加下面这几条记录：

| 记录类型 | 主机记录 | 记录值 | 说明 |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | 根域指向 GitHub Pages |
| A | `@` | `185.199.109.153` | 同上，四条一起加 |
| A | `@` | `185.199.110.153` | 同上 |
| A | `@` | `185.199.111.153` | 同上 |
| CNAME | `www` | `<你的用户名>.github.io` | 让 `www.weileyan.com` 也能访问 |

> 主机记录 `@` 表示不带前缀的 `weileyan.com` 本身，有些平台要写成「留空」或「主域名」。
> IP 以 GitHub 官方文档为准，偶尔会调整：<https://docs.github.com/zh/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site>

验证是否生效：

```bash
ping weileyan.com           # 应返回 185.199.1xx.153 中的一个
nslookup www.weileyan.com   # 应返回 <你的用户名>.github.io
```

国内解析一般几分钟到几小时，全球生效最多等 24 小时。

### 5. 之后怎么更新

改完文件就推送，站点会自动重新发布：

```bash
git add .
git commit -m "更新：加了新照片"
git push
```

## 常用修改点

| 想改什么 | 改哪里 |
| --- | --- |
| 文案、爱好介绍、时间线 | `index.html` 里对应的 `<section>` |
| 全站篮球图形（形状/颜色） | `index.html` 顶部的 `<symbol id="ball">`，改一处全站跟着变 |
| 滚动篮球、计时器、跑马灯等动画 | `assets/styles.css` 搜索「篮球元素」一节 |
| 成长路的照片和文字 | `index.html` 里的 `<ol class="timeline">`，照片放在 `assets/` |
| 照片墙的照片和说明 | `index.html` 里的 `<div class="wall">`，照片放在 `assets/photos/` |
| 年龄 / 生日 | `assets/main.js` 顶部的 `BIRTH_DAY`、`BIRTH_MONTH`、`2019` |
| 主色（现在是篮球橙）、纸底颜色 | `assets/styles.css` 的 `:root` 变量 |
| 卡片倾斜角度、阴影厚度 | `styles.css` 里的 `--tilt`、`--pop` |

年龄和生日倒计时是按出生日期实时算的，不用每年手动改：生日当天页面会自动放彩带、文案变成「今天满 N 岁啦」。

## 加照片 / 换照片

成长路的照片就是 `assets/` 下的四个 jpg，**替换同名文件**即可，不用改代码（新照片建议压到宽 800 像素、200 KB 以内，竖版 5:7 最贴合现在的卡片）。

要在成长路上新增一段，复制下面这块到 `<ol class="timeline">` 里：

```html
<li class="reveal">
  <span class="dot"></span>
  <figure class="shot">
    <img src="./assets/er年级.jpg" alt="二年级的乐衍" loading="lazy" decoding="async">
    <figcaption>二年级</figcaption>
  </figure>
  <div class="entry">
    <p class="when">2026.09 · 7 岁</p>
    <p class="what">上二年级了</p>
    <p class="note">这里写一句这一年的小事。</p>
  </div>
</li>
```

（文件名还是建议用拼音/英文，例如 `ernianji.jpg`。）

照片墙（`#photos`）按年龄分组，一组一个 `<div class="wall">`，上面配一个 `.wall-group` 标题；加一张新照片就往对应的 `wall` 里塞一块，图放在 `assets/photos/`：

```html
<figure class="polaroid reveal">
  <img src="./assets/photos/2026-summer-1.jpg" alt="夏天的乐衍" width="1024" height="1536" loading="lazy" decoding="async">
</figure>
```

- 墙是三列瀑布流（`columns`），竖图横图都能混排，不用裁剪。
- 新的一组照片（比如六岁生日）：把一对 `wall-group` + `wall` 整体复制一份放在最前面即可。
- `width` / `height` 按图片真实像素写，可以避免加载时页面跳动。
- 拍立得的倾斜角度、顶部胶带的颜色，都在 `styles.css` 搜「照片墙」那一段。

其它位置的照片（比如爱好卡片里）同理，加一个 `<img>` 就行：

```html
<figure class="shot">
  <img src="./assets/2026-basketball.jpg" alt="乐衍在打篮球" loading="lazy">
  <figcaption>第一次投进三个球</figcaption>
</figure>
```

## 留言板（Twikoo）

留言组件用 [Twikoo](https://twikoo.js.org/)，数据存在你自己的 LeanCloud 应用里。
GitHub Pages 这边只有一个 `<div id="twikoo">`，脚本要滚到页面底部附近才会加载，不拖慢首屏。

### 开通（一次性）

1. 按 [Twikoo 快速开始](https://twikoo.js.org/quick-start.html) 注册 LeanCloud、创建应用、初始化数据库，拿到「环境 id」，形如 `https://xxx.lcintl.com/2020/10/xxxxxxxx`。
2. 填进 `assets/main.js` 顶部那一行：

   ```js
   const TWIKOO_ENV = 'https://xxx.lcintl.com/2020/10/xxxxxxxx';
   ```

3. 提交推送：`git add assets/main.js && git commit -m "guestbook: connect twikoo" && git push`

`TWIKOO_ENV` 是空字符串时，留言板整块（连同导航里的「留言板」）会自动隐藏，访客看不到半成品。

### 先审后写（记得开）

浏览器打开 `你的环境id/admin/index.html` 进管理面板：

- 设置里把「评论需要审核」设为**总是**，新留言要你点「通过」才会出现在页面上。
- 面板里可以删除、标记垃圾、导出留言。
- 顺手配 SMTP 邮箱通知，有人留言会来信，不用天天盯。

### 想关掉

把 `TWIKOO_ENV` 改回 `''` 就隐藏；要彻底移除，删掉 `index.html` 的 `#guestbook` 区块和导航那一行，再删 `main.js` 末尾「留言板」那段与 `styles.css` 里搜「留言板」的那一节。

## 隐私说明

这个站点是公开可访问的，所以：

- **没有**放手机号、住址、常去的场所等联系方式，也不建议以后加。
- 学校、班级这类信息请自行斟酌，如需隐藏只要删掉 `index.html` 里对应的 `<div class="fact">` 一行即可。
- 访客照片等如需私密，考虑放到需要登录的相册服务，而不是这个公开站点。
- 留言板会存下访客自己填的昵称和留言内容，存在你的 LeanCloud 应用里（邮箱是选填，默认不要求）。开启「先审后写」之前别公开宣传这个入口。
