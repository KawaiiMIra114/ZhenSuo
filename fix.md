# V4 漏洞修复手册 (GDD 合规审查)

为确保游戏代码完全契合 V4 Game Design Document (GDD) 及世界观圣经，以下是本次全量审查中发现的 7 个核心差异项及其标准修复指导手册。

---

## 1. Forum: `admin_unlocked` Fact 缺失
* **要修什么**：GDD 规定管理员登录成功后，必须系统级标记玩家已具有管理员身份。当前代码在 [Forum.tsx](file:///tmp/Forum.tsx) 中验证通过后未触发此 Fact，导致 [Clinic.tsx](file:///d:/axm/ds3/V4C/src/pages/Clinic.tsx) 的防穿越逻辑（查询 `nj0313`）判断失效。
* **怎么修复**：
  在 [Forum.tsx](file:///tmp/Forum.tsx) 的 [handleAdminLogin](file:///tmp/Forum.tsx#234-248) 函数中，当凭证校验成功且包含前置条件时，在状态更新代码块内添加 `addFact('admin_unlocked');`。
* **参考什么**：GDD §5.6（黑客与提权：管理员通讯模块） 以及 GDD §4.2（档案查询表：`nj0313` 响应条件）。
* **怎么验收**：
  1. 在论坛页面使用 `bbs_admin` / `nj0313` 登录管理员后台。
  2. 切换到官网 (Clinic) 档案查询界面。
  3. 输入 `nj0313` 进行查询，若提示 **“您已登录管理员会话，无需通过此入口。”**（而非“无效输入”），则代表修复成功。

---

## 2. Forum: `shadow_archive_path_found` Fact 缺失
* **要修什么**：GDD 规范提及，玩家在获得影子档案的绝对路径时，应当生成一个追踪记录（Fact）。当前代码完全漏掉了此 Fact 的生成。
* **怎么修复**：
  在 [Forum.tsx](file:///tmp/Forum.tsx) 管理员视图（`activeTab === 'admin'`）中，提示了影子档案备份路径（`/srv/bbs_backup/zq_mirror_20240101/`）的组件位置。可以利用 `useEffect` 在该视图渲染时，或者封装一层组件触发 `addFact('shadow_archive_path_found');`。
* **参考什么**：GDD §5.6（内网环境跳转链：影子档案位置发现）。
* **怎么验收**：
  进入论坛管理员后台标签页，打开浏览器控制台/状态监测工具，确认 Fact 库中成功注入 `shadow_archive_path_found` 键值。

---

## 3. OA: `password_instructions_found` Fact 缺失
* **要修什么**：GDD 要求在系统备注中看到赵启关于“密码在实体本子上”的留言时，必须留下线索标记，引导玩家继续探索。
* **怎么修复**：
  在 [OA.tsx](file:///d:/axm/ds3/ZhenSuo/src/pages/OA.tsx) 修改对应的视图切换逻辑。当玩家在 OA 系统主页点击进入模块六（“系统备注” / `notebook`）的 [DashCard](file:///d:/axm/ds3/ZhenSuo/src/pages/OA.tsx#369-384) 时，在其 `onClick` 事件中追加 `addFact('password_instructions_found');`。
* **参考什么**：GDD §6.3（核心信息节点分布：模块六 系统备注）。
* **怎么验收**：
  在内网 OA 主界面，点击“系统备注”卡片进去阅读后，确认状态管理器中新增了此 Fact。

---

## 4. OA: `disappearance_evidence_found` Fact 缺失
* **要修什么**：玩家在查阅 0019 异常离职档案时，GDD 要求生成一个消失证据的认知 Fact。当前由于赶工遗漏了此设定。
* **怎么修复**：
  同样在 [OA.tsx](file:///d:/axm/ds3/ZhenSuo/src/pages/OA.tsx)，当玩家点击进入模块四（“人事档案” / `hr`）阅读异常记录时，在对应的 [DashCard](file:///d:/axm/ds3/ZhenSuo/src/pages/OA.tsx#369-384) 的 `onClick` 回调中调用 `addFact('disappearance_evidence_found');`。
* **参考什么**：GDD §6.3（核心信息节点分布：模块四 人事档案）。
* **怎么验收**：
  在 OA 首页点击“人事档案”卡片，确认系统记录了玩家已查阅到消失证据。

---

## 5. Clinic: `meridian_suspicious` Fact 缺失
* **要修什么**：官网的资金方 / 投资者关联网页中提到了境外医疗资本 “Meridian Medical”。GDD 认为这是世界观扩充的关键背景，应标记其可疑性。
* **怎么修复**：
  在 [Clinic.tsx](file:///d:/axm/ds3/V4C/src/pages/Clinic.tsx) 或者相关新闻内容页，找到提及 "Meridian Medical" 的外部链接或锚点文本。为其增加 `onClick` 事件回调执行 `addFact('meridian_suspicious');`（或者使用现有的 `onReadComplete` 机制）。
* **参考什么**：GDD §4.2（外部视觉感知层：关于我们/投资者页面描述）。
* **怎么验收**：
  在诊所内嵌的新闻或介绍页中，点击 Meridian 资本相关字眼，核查内存数据是否生成了资本怀疑标识。

---

## 6. Clinic: `forum_url_discovered` Fact 缺失
* **要修什么**：作为发现互助论坛的重要线索点，玩家在官网阅读 FAQ 遇到论坛链接时，理应触发此记录。由于早期测试中直接写死了论坛路由，导致此依赖被遗忘。
* **怎么修复**：
  在 [Clinic.tsx](file:///d:/axm/ds3/V4C/src/pages/Clinic.tsx) 中渲染患者 FAQ 内容的地方（如果是在文章 D 列或者静态问答区），添加 `addFact('forum_url_discovered');`，建议使用 `onReadComplete` 或元素可见性钩子进行精准监听。
* **参考什么**：GDD §5.2（触发逻辑：如何进入患者论坛）。
* **怎么验收**：
  通读官网 FAQ 区提示的社区地址，确认玩家资料夹（Facts）中成功点亮了 `forum_url_discovered`。

---

## 7. Desktop: `AMBIENT_HINTS` 变量位置优化
* **要修什么**：目前幽灵文字数组被定义在 [Desktop.tsx](file:///d:/axm/ds3/V4C/src/pages/Desktop.tsx) 的函数组件内部。每次桌面重新渲染，都会在内存中重建长达16项的数组对象，触发不必要的垃圾回收并可能引起副作用重算。
* **怎么修复**：
  把 `const AMBIENT_HINTS = [ ... ];` 从 `export function Desktop() { ... }` 内部剪切，移动到文件头部的 `import` 语句下方。
* **参考什么**：React 性能优化准则（静态常量应置于组件外部）、GDD §10.2（被动环境暗示机制）。
* **怎么验收**：
  检阅 [Desktop.tsx](file:///d:/axm/ds3/V4C/src/pages/Desktop.tsx) 的代码结构。并确保在游戏运行时控制台无 Error，且挂机触发时的右下角乱码闪烁功能依然能准确随机抓取词条。
