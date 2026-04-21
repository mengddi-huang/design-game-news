# Dispatch — 游戏 × 设计行业资讯

一个借鉴 [rogierdeboeve.com](https://rogierdeboeve.com) 沉浸式视觉语言的中文资讯聚合站,
覆盖三个板块:

- 游戏 · Games — GamesIndustry.biz, Game Developer, 80 Level, Polygon, Rock Paper Shotgun
- 视觉设计 · Visual — Designboom, Eye on Design (AIGA), Typewolf, Typewolf Blog, Creative Review
- 交互设计 · Interaction — Smashing Magazine, UX Collective, Nielsen Norman Group, Awwwards, A List Apart

每条资讯只保留标题、摘要、发布时间与原文链接,点击条目跳转到源站阅读,版权归原出版方所有。

## 技术栈

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- GSAP (reveal / curtain / stagger)
- Lenis (smooth scroll)
- rss-parser (可选的增量抓取脚本)

## 本地开发

```bash
npm install
npm run dev
# http://localhost:3000
```

## 构建与部署

```bash
npm run build
npm run start
```

最推荐的部署平台是 **Vercel**:根目录 push 到 GitHub,在 Vercel 新建项目选中仓库,
Framework 自动识别为 Next.js,一路点下一步即可。

## 资讯数据

- 默认数据位于 [`data/news.json`](./data/news.json),已内置 30 条近期资讯作为种子。
- 新增/更新资讯有两种方式:
  1. 直接编辑 `data/news.json`。
  2. 运行 `npm run fetch-news` 自动从各来源 RSS 拉取最新条目并合并(按 `sourceUrl` 去重)。

`scripts/fetch-feeds.ts` 支持:

```bash
npm run fetch-news              # 合并增量
npm run fetch-news -- --fresh   # 完全重建 data/news.json
```

## 每日企微推送

每天 10:30 自动推到企业微信群机器人(macOS launchd 调度):

```bash
# 手动预览(不发送)
npm run daily:dry

# 立即触发一次(会真的推 webhook)
npm run daily

# 调节时间窗和每分类条数
npx tsx scripts/daily-digest.ts --hours 48 --per-category 4
```

调度入口:[`launchd/com.dispatch.daily.plist`](./launchd/com.dispatch.daily.plist),
已复制到 `~/Library/LaunchAgents/` 并 `launchctl load -w`。

- 默认窗口 36 小时(周末覆盖周五晚间)
- 每分类最多 3 条,当天该分类无新稿则跳过 — **宁缺毋滥**
- 同时把这 9 条合并进 `data/news.json`,网站首页跟着一起新

查看运行日志:

```bash
tail -f launchd/daily.log
```

如需换 webhook,改 plist 里的命令或用环境变量 `WECHAT_WEBHOOK_URL`。

### 定时更新(可选)

在 Vercel 上创建 Cron Job 调用一个 API route,或者用 GitHub Actions 定时运行脚本并
commit 回仓库,都可以实现"永远最新"。

## 目录

```
app/
  layout.tsx              # 全局字体、颗粒、Lenis、光标、导航
  page.tsx                # 首页:Loader + Hero + 最新 + 三板块摘要
  [category]/page.tsx     # /games /visual /interaction 分类页
  news/[id]/page.tsx      # 资讯详情 + 跳转原文 CTA
  not-found.tsx
components/
  Loader.tsx              # 0-100% 开场动画 + 幕布上推
  NewsRow.tsx             # hover 跟随封面的大字条目
  Nav.tsx  Footer.tsx
  Cursor.tsx              # 自定义光标
  SmoothScroll.tsx        # Lenis 封装
  Grain.tsx               # SVG 颗粒 overlay
  Reveal.tsx              # GSAP 进入动画
data/news.json            # 种子数据
lib/news.ts               # 数据读取工具
scripts/fetch-feeds.ts    # RSS 抓取脚本
```

## 设计原则

- 暗色电影感,颗粒滤镜铺满全局
- 超大字号 + 字重 500,主色 `#e8ff4a` 作为 accent
- 标题级元素 hover 时横向位移并变色,条目右侧跟随封面小卡
- Lenis 平滑滚动,GSAP 做 hero 文字 y 位移 + 幕布过渡

## 许可与归属

- 代码:MIT
- 资讯内容:版权归各原出版方。Dispatch 仅做标题+摘要+外链的聚合展示。
- 视觉语言参考并致敬 [rogierdeboeve.com](https://rogierdeboeve.com)。
