# AGENTS.md — 镇在画中

> 给 AI 编码代理的项目指令。分工:用户是产品负责人(概念/设计/验收),代码由你实现。全程中文交流。

## 0. 开工前必读

- [docs/RESEARCH.md](./docs/RESEARCH.md):范围与取舍
- [docs/PRD.md](./docs/PRD.md):行为与验收标准
- [docs/TECH_DESIGN.md](./docs/TECH_DESIGN.md):架构、性能预算、里程碑

冲突时以 PRD 为准;要改需求或范围,先问用户,批准后再同步文档。
硬截止:2026-11-30 18:00 天池提交;11/26 素材冻结。

## 1. 铁律

1. **依赖白名单**:dependencies 仅 `react`、`react-dom`;devDependencies 仅 `vite`、`@vitejs/plugin-react`、`typescript`、`vitest`、`sharp`、`@types/*`。新增依赖必须先获用户批准。
2. **动效只用 transform / opacity / filter**(CSS 或 Web Animations API);禁止动画库,禁止 WebGL/3D。
3. **URL 是唯一事实源**:hash 路由;页面跳转 pushState,画风切换 replaceState。
4. **画面数据驱动**:场景/热点/文案全部来自 `src/data/towns.ts` + `manifest.json`,禁止在组件里硬编码场景列表。
5. **性能预算**:JS+CSS ≤ 150KB gzip;首屏 ≤ 2MB;单图 AVIF ≤ 300KB@1600w;CLS ≈ 0。
6. 尊重 `prefers-reduced-motion`、`saveData`、低端设备检测与 `?lite=1`。
7. UI 文案中文;标识符英文;默认不写注释,只在"为什么"不明显处写一行;提交信息中文。

## 2. 工作流程(每个任务)

1. 从 PRD / TECH_DESIGN 找到对应条目,先复述范围与验收标准;
2. 小步实现,一次一个功能,不顺手重构无关代码,不加计划外功能;
3. `npm run dev` + 浏览器实测(browser-use MCP):UI 变更必须真点过;需要截图而浏览器面板未开时,请用户打开面板;
4. `npm run test` 与 `npm run build` 通过;
5. `git commit`:一功能一提交,中文信息;不 `--no-verify`、不 amend、不强推;
6. 汇报:做了什么、如何验证的、下一步。

**禁止**:代码写完未实测就报完成;为赶进度砍掉 PRD 验收项而不告知用户。

## 3. 模型协作

- 默认 Qwen4-Max(0.4×)。
- 遇到复杂多文件重构、动画疑难、性能调优:**先通知用户**"本任务建议切换 Kimi-K3.1-Pro(1.0×)",等用户手动切换后再继续;不要默默硬啃。
- Flash 系模型只用于琐碎修改,不用于核心交互。

## 4. 素材规则

- 母版与派生原图:`assets-src/{town}/{scene}.{style}.png`(≥1920×1080,16:9)。
- `public/img/**` 与 `src/data/generated/manifest.json` 一律由 `scripts/build-assets.mjs` 生成,**禁止手改**。
- 素材增删后必须重跑管线;热点坐标用 `?debug=1` 点击标注,三画风共用一套坐标。
- 音效放 `public/audio/`,页脚注明来源与许可;默认静音。
- 不引外部图片/字体 CDN,全部本地资源。

## 5. 环境注意(Windows)

- git bash;npm registry 已配 npmmirror;shell 非管理员,避免全局安装与系统级改动。
- `curl` 访问 HTTPS 会因代理 TLS 失败,查网页用 WebFetch;git https 报吊销错误时,用仓库级 `http.sslBackend schannel` + `http.schannelCheckRevoke false`。
- 应用内浏览器面板可能隐藏:截图失败时改用 `take_snapshot` / `evaluate_script`,或请用户打开面板。
- 提交材料阶段:论坛编辑器只能贴文字、图片逐张上传——输出按上传顺序编号的图片清单。

## 6. 里程碑

见 TECH_DESIGN §12。当前阶段的具体任务用任务列表跟踪,不写入本文档。