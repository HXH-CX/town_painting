# 镇在画中 · 技术设计(v0.1)

> 状态:待确认 · 更新:2026-11-23 · 上游:[PRD](./PRD.md)

## 0. 目标与约束

- 性能优先:中端手机 60fps;首屏 < 2MB;首屏可交互 < 3s(4G)。
- 零重型依赖:不引动画/UI/路由库;依赖白名单见 §1。
- 静态托管:Qoder Sites;hash 路由,无需服务器 rewrite。
- 7 天单人交付:先跑通链路,再打磨。

## 1. 技术选型

| 层 | 选择 | 说明 |
|---|---|---|
| 应用框架 | React 19 + TypeScript + Vite | 组件化、构建快 |
| 路由 | 自研 hash router(≈60 行) | 只有 6 个路由状态,消除依赖不确定性 |
| 动效 | CSS transition/animation + Web Animations API | 仅 transform/opacity/filter,GPU 合成 |
| 图片 | `<picture>` AVIF/WebP + JPG 兜底;480/960/1600 三档宽 | LQIP 内联占位 |
| 资产管线 | Node 脚本 + sharp(dev) | 失败回退 @jsquash(WASM) |
| 音频 | HTMLAudioElement + 音量渐变 | 3 条 loop,首播前不下载 |
| 测试 | Vitest(路由、数据完整性)+ 手测清单 | |
| 字体 | 系统字体栈(宋体标题 + 系统无衬线 UI) | 不引中文字体包 |
| 部署 | Qoder Sites 静态构建 | 输出 dist |

**依赖白名单**:

- dependencies:`react`、`react-dom`
- devDependencies:`vite`、`@vitejs/plugin-react`、`typescript`、`vitest`、`sharp`
- 白名单外依赖需明确批准后加入。

## 2. 目录结构

```
assets-src/                  母版原图(不入构建):{town}/{scene}.{style}.png ≥1920×1080
public/
  img/{town}/{scene}-{style}-{w}.{avif,webp}   管线产物
  audio/{town}.mp3
  og.jpg
scripts/build-assets.mjs     图片管线:尺寸/格式/LQIP/manifest
src/
  main.tsx  App.tsx  router.ts
  data/types.ts  towns.ts  styles.ts
  data/generated/manifest.json
  components/…
  hooks/useReducedMotion.ts  useSaveData.ts  usePreload.ts  useAudio.ts
  styles/tokens.css  global.css
tests/router.test.ts  data.test.ts
docs/  AGENTS.md  package.json  vite.config.ts  tsconfig.json
```

## 3. 应用架构

- **URL 是唯一事实源**:`town + street + style` 全部从 hash 解析,组件不维护重复状态。
- **App 状态机**:`idle | pushing-in | pushing-out | style-switching`;过渡期间锁交互,结束后回 `idle`。
- **TransitionStage**:全屏覆盖层,承载"旧画面"动画副本;新画面在下层淡入,结束后清理覆盖层。
- 三视图:`Home`(镇卡片墙)、`TownView`(全景)、`StreetView`(街道),共用 `SceneView` 渲染器。

| 组件 | 职责 |
|---|---|
| TownCard | 首页卡片,悬停视差 |
| SceneView | 场景图 + Ken Burns + 热点层 + LQIP |
| Hotspot | 热点按钮(≥44px,悬停光晕 + 标签) |
| StyleSwitcher | 三档画风切换(全局固定) |
| StoryCard | 故事卡(桌面浮卡/移动底部抽屉,ESC 关闭) |
| Dossier | 镇档案浮现条 |
| SoundToggle | 声音开关 |
| Breadcrumb / StreetJumper | 面包屑、街道互跳 |
| ShareButton | 复制深链接 |

## 4. 关键动效实现

### 4.1 画风切换(350–450ms)

- 进入场景即预载三画风;切换时新旧两层 `<picture>` 叠放。
- 新层 `opacity 0→1`(400ms)+ `scale 1.02→1`;快速连点以最后一次为准(序号守卫)。
- `history.replaceState` 更新 `?style=`,不产生历史记录。

### 4.2 首页卡片 → 全景(≈1s,FLIP)

1. 记录卡片 `getBoundingClientRect()`;
2. 覆盖层放卡片图副本,`position: fixed` 定位到卡片矩形;
3. WAAPI 过渡到全屏(900ms,`cubic-bezier(.22,.61,.36,1)`);
4. 结束前交叉溶解到全景(300ms),触发 Dossier 浮现(2s 后淡出),清理覆盖层。

### 4.3 全景 → 街道(推镜,≈700ms)

- 覆盖层放全景副本,`transform-origin` 设为热点坐标 `(x%, y%)`;
- `scale 1 → 2.2`(700ms 缓动),末尾 250ms 叠加 `blur 0→8px`;
- 街道图在下层 `opacity 0→1`(400ms,与推镜后半段重叠)。
- 返回时反向(`scale 2.2→1`,先清晰后缩小)。

### 4.4 浏览器前进/后退

- 监听 `hashchange`;按 URL 直接渲染目标状态(200ms 溶解,可关)。
- 首屏进入不额外 `pushState`。

### 4.5 待机氛围

- Ken Burns:24s 交替缓动,`scale 1→1.06` + 平移 ±1.5%,只作用于图片层。
- 粒子:≤12 个 DOM 元素(灯笼光晕/炊烟),`position:fixed; pointer-events:none`,纯 CSS 动画。

### 4.6 降级

- `prefers-reduced-motion: reduce` → 全部改 200ms 溶解,停 Ken Burns 与粒子;
- `saveData` 或 2G/3G → 只加载 960w,不预取;
- 低端设备(`hardwareConcurrency ≤ 4` 或 `deviceMemory ≤ 4`)→ 关粒子与视差;
- 手动降级:`?lite=1`(演示兜底)。

## 5. 图片管线(scripts/build-assets.mjs)

- 输入:`assets-src/{town}/{scene}.{style}.png`(母版 ≥1920×1080,16:9)。
- 输出:480/960/1600 三档宽 × AVIF/WebP,JPG 仅 960 兜底;LQIP 32px WebP base64。
- 生成 `src/data/generated/manifest.json`:尺寸、LQIP、文件路径。
- 预加载策略:
  - 进入场景:当前画风 1600w 高优先级;另两画风 960w 低优先级;LQIP 内联立即可见。
  - `requestIdleCallback`:预取相邻街道(当前画风 960w)、其余镇封面(960w)。
- 体积预算:单图 AVIF ≤ 300KB @1600w;全部产物 ≤ 12MB。
- Windows 提示:npm 走 npmmirror,sharp 预编译包通常可用;安装失败回退 `@jsquash/webp`(WASM),再不行用外部工具导出。

## 6. 数据模型(src/data/towns.ts)

```ts
type StyleId = 'cinematic' | 'watercolor' | 'pixel';

interface StoryCard { title: string; body: string; }

interface Hotspot {
  id: string;
  label: string;
  x: number; y: number;       // 归一化 0–1,三画风同构图共用
  to?: string;                // 全景热点 → 街道 slug
  story?: StoryCard;          // 街道热点 → 故事卡
}

interface Scene { slug: string; name: string; hotspots: Hotspot[]; }

interface Town {
  slug: string; name: string; tagline: string;
  dossier: string;
  audio: string;
  cover: Scene;               // 全景(含 2 个街道热点)
  streets: Scene[];           // 2 条街(各 2–3 个故事热点)
}
```

数据完整性由 `tests/data.test.ts` 校验:slug 唯一、热点坐标 0–1、每场景三画风图片均在 manifest、街道热点必有 story。

**热点坐标标注**:开发模式 `?debug=1` 下在场景图上点击即打印百分比坐标,复制进 towns.ts。

## 7. 路由与状态

- `#/`、`#/zhenhe`、`#/zhenhe/bridge?style=watercolor`
- `style` ∈ {cinematic, watercolor, pixel},默认 cinematic;优先级:URL > localStorage > 默认。
- 非法 town/street slug → 回落 `#/` 并控制台告警。
- 声音偏好仅存 localStorage,不进 URL。
- 页面跳转 `pushState`;画风切换 `replaceState`。

## 8. 音频

- 每镇 1 条 60–90s 循环,MP3 96kbps 单声道(≈1MB);`preload="none"`。
- 开关 400ms 淡入/淡出;切镇 600ms 交叉淡化;iOS 依赖用户手势(开关点击即手势)。
- 页脚声明音效来源与许可。

## 9. 性能预算与验证

| 指标 | 预算 | 验证方式 |
|---|---|---|
| 首屏资源 | ≤ 2MB | DevTools Network |
| LCP(4G) | ≤ 2.5s | Lighthouse mobile |
| JS+CSS 产物 | ≤ 150KB gzip | vite build 报告 |
| 转场帧率 | 中端真机 60fps(允许瞬时 50) | Performance 面板 + 真机 |
| CLS | ≈ 0 | 图片固定宽高比容器 |

兼容:Chrome/Edge/Safari/Firefox 最近两个大版本;iOS 15+;最小宽 360px。

## 10. 视觉与素材规范(Art Bible 摘要)

- 全站:16:9,机位高度统一,35mm 视角感,单主光方向;画面内不出现可读文字招牌、品牌标志、人物面部特写。
- 枕河镇:傍晚侧逆光,暖金 + 青灰;河道、石桥、灯笼、乌篷船。
- 汐见町:黄昏蓝调 + 暖窗光;坡道、小店、海堤、电车。
- 钟崖堡:午后硬光,石灰岩质感;钟楼、石阶、广场、旧城巷。
- 派生规则:
  - watercolor:纸纹、湿画法边缘晕染,保留构图与光向;
  - pixel:48 色限制、硬边像素,保留构图与光向。
- UI 基调:深炭色玻璃拟态工具栏,中文宋体标题,极简。
- 27 张 QA 清单:构图一致、光向一致、无乱码、无肢体/结构瑕疵、色板不偏。

## 11. 测试与验收映射

- Vitest:router 解析/回落、数据完整性。
- 手测清单 = PRD §9 十条,逐条记录(设备 × 浏览器矩阵)。
- 设备矩阵:Windows Chrome/Edge、iPhone Safari、Android Chrome、360/768/1440 宽。
- 演示兜底:`?lite=1`。

## 12. 里程碑(半天粒度)

| 时间 | 交付(DoD) |
|---|---|
| 11/24 上午 | 仓库初始化(Git)、脚手架、依赖白名单、tokens/global CSS;`npm run dev` 可跑 |
| 11/24 下午 | hash router + towns.ts 数据 + 占位图场景渲染三页 |
| 11/25 上午 | 热点/画风切换/故事卡/工具栏(占位图下可操作) |
| 11/25 下午 | 卡片推镜、热点推镜、返回动效、Ken Burns、Dossier |
| 11/26 上午 | 资产冻结;管线跑通,27 × 3 档产物入库 |
| 11/26 下午 | 真图替换 + 热点坐标标注 + 文案接入 |
| 11/27 | 全链路联调、深链接/分享、音频、粒子 |
| 11/28 | 性能/移动端/无障碍/降级验证 |
| 11/29 | Qoder Sites 部署 + 提交图文材料 |
| 11/30 | 缓冲修 bug,18:00 前提交 |

## 13. 风险与预案

| 风险 | 预案 |
|---|---|
| 自研路由边界 bug | 代码 ≤60 行;back/forward/深链接用例列入手测 |
| sharp 在 Windows 安装失败 | @jsquash(WASM)回退;最后可用外部工具导出 |
| 中端机掉帧 | 自动降级 + `?lite=1` |
| 首屏超预算 | 降 1440/1280w、LQIP 降质、砍预取 |
| Qoder Sites 静态资源缓存旧版 | 文件名内容 hash;部署后强刷验证 |
| 热点坐标错位 | 三画风共用坐标;debug 模式逐场景核对 |

## 14. 待确认

- Qoder Sites 构建配置(输出目录/环境变量)。
- 音效素材库与授权文本。
- 大赛对 AI 生成素材的声明要求。