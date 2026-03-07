# Agent 工作列表 · 2026-03-06
## 按优先级排列，全部完成后跑一次 npm run build 验证

---

## P1：阻塞流程，必须先修

### 1. Credits 改为 currentApp 状态，废弃独立路由

**问题：** `window.open('/credits', '_blank')` 在本地 Vite dev server 下无法正确渲染 Credits 组件。

**修改文件：** `App.tsx`、`Ending.tsx`、`Desktop.tsx`、`Credits.tsx`、`types.ts`

**具体改动：**
- `types.ts`：`AppState` 联合类型新增 `'credits'`
- `App.tsx`：新增 `currentApp === 'credits'` 的渲染分支，渲染 `<Credits />`
- `Ending.tsx`：`handleContinue` 里结局 B 的 `window.open('/credits', '_blank')` 改为 `setCurrentApp('credits')`
- `Desktop.tsx`：`handleShutdown` 里 `window.open('/credits', '_blank')` 相关逻辑全部删除，ShutdownSequence 结束后由 ShutdownSequence 组件自己调用 `setCurrentApp('credits')`
- `ShutdownSequence.tsx`：PROJECT DELTA 序列播完、黑屏结束后，调用 `setCurrentApp('credits')`（通过 props 传入回调）
- `Credits.tsx`：`EndingReplay` 组件里 `window.location.href = '/credits'` 改为 props 传入的 `onBack` 回调调用 `setCurrentApp('credits')`；回放按钮的 `window.location.href = '/credits?replay=...'` 改为 props 传入的 `onReplay(id)` 回调

---

### 2. 关机后回桌面不重置 openWindows

**问题：** `openWindows` 初始值硬编码为 `['wechat', 'email', 'photos']`，关机后回桌面触发组件重新挂载，窗口状态丢失。

**修改文件：** `GameContext.tsx`、`Desktop.tsx`

**具体改动：**
- `GameContext.tsx`：`SaveData` 新增 `openWindows: string[]` 字段，初始值 `['wechat', 'email', 'photos']`，纳入自动存档
- `Desktop.tsx`：`openWindows` 的 `useState` 初始值从硬编码改为从 `saved?.openWindows ?? ['wechat', 'email', 'photos']` 读取，同时在 `openWindows` 变化时写回 GameContext（通过新增的 `setOpenWindows` 方法或直接在 Desktop 内用 `useEffect` 写 localStorage）

---

### 3. erasureActive 后邮件过滤林晓相关邮件

**问题：** 第 335 行 `const allEmails = EMAILS` 没有过滤，结局后林晓相关邮件仍然可见。

**修改文件：** `Desktop.tsx`

**具体改动：**
```typescript
const allEmails = erasureActive
  ? EMAILS.filter(e => !e.from.includes('linxiao') && !e.subject.includes('林晓'))
  : EMAILS;
```
同时：`erasureActive` 为 true 时，`selectedEmail` 若指向被过滤的邮件，自动切换到 `allEmails[0]`（即爸爸相关邮件或其他保留邮件）。

---

### 4. 幽灵文字闪烁结束后在桌面显示浮动关机按钮

**问题：** 关机入口只在开始菜单里，幽灵文字阶段结束后玩家不知道要去点开始菜单找关机。

**修改文件：** `Desktop.tsx`

**具体改动：**
- 在桌面渲染层新增一个浮动关机按钮，条件：`erasureActive && ghostPhase === 'ready'`
- 样式：`position: fixed`，右下角（`bottom: 60px, right: 24px`），红色边框，白色文字，字体等宽，内容"[ 关机 ]"
- 点击触发 `handleShutdown()`
- 与开始菜单里的关机按钮逻辑完全相同，不替换，两个并存

---

### 5. 新闻动态新增车祸新闻，修正 car_crash_clue 写入时机

**问题：** n1 内容是资本路径，和车祸无关；`car_crash_clue` 写入位置错误；玩家没有新闻可以对应 OA 里的 MED-0019 离职日期线索。

**修改文件：** `Clinic.tsx`

**具体改动：**
- 新闻列表新增一条：
  ```
  id: 'n_crash'
  date: '2022-11-08'
  title: '南郊市两车相撞事故：一人当场死亡，另一人送医抢救无效'
  tag: '社会'
  ```
  插入位置：在 n4（2022-06-15）和 n5（2021-09-20）之间。

- 新闻详情（`selectedNewsId === 'n_crash'`）内容：
  ```
  南郊市两车相撞事故：一人当场死亡，另一人送医抢救无效
  2022-11-08 · 社会

  11月7日深夜，南郊市高新区安宁路附近发生一起两车碰撞事故。
  据目击者描述，一辆轿车在路口与一辆货车发生碰撞，碰撞导致轿车严重受损。
  事故造成一人当场死亡，另一人送往南郊市第一人民医院后经抢救无效死亡。
  交管部门已介入调查，事故原因尚在核实中。

  （本报讯）
  ```

- `car_crash_clue` 写入时机从 n1 改为 `selectedNewsId === 'n_crash'` 时写入：
  ```typescript
  useEffect(() => {
    if (activeTab === 'news' && selectedNewsId === 'n_crash') {
      addFact('car_crash_clue');
    }
  }, [activeTab, selectedNewsId, addFact]);
  ```
  同时删除原来 n1 触发 `car_crash_clue` 的逻辑。

---

## P2：影响体验，第二批修

### 6. 微信林晓对话改为三条出站消息

**问题：** 当前只有一条"你到底怎么了。"，感受不到浩一直发消息得不到回应的绝望递进。

**修改文件：** `Desktop.tsx`

**具体改动：**
将林晓对话区改为三条出站消息（绿色气泡，右侧对齐），均标注"已送达，未读"：

```
3月10日 22:31   你到底怎么了。           已送达，未读
3月14日 09:12   林晓你在吗。             已送达，未读
3月19日 03:47   我来接你。               已送达，未读
```

林晓的入站消息保留一条（1月9日那条"明天去了，不用担心我"），放在三条出站消息之前。

---

### 7. 微信 badge 阅读后清除

**问题：** Badge 硬编码为字符串 `'3'`，打开微信后不消失。

**修改文件：** `Desktop.tsx`

**具体改动：**
- 新增 `wechatRead` 状态：`const [wechatRead, setWechatRead] = useState(false)`
- `openWindow('wechat')` 调用时同时设置 `setWechatRead(true)`
- Badge 改为条件渲染：`badge={!erasureActive && !wechatRead ? '3' : erasureActive ? '1' : undefined}`
- `erasureActive` 触发后 badge 重置为 `'1'`（通知新消息），微信通知弹出后点击打开时清除

---

### 8. 发送失败提示只对林晓对话生效

**问题：** 发送失败提示作用于所有会话，包括爸爸和诊所前台。

**修改文件：** `Desktop.tsx`

**具体改动：**
`handleWechatSend` 里，发送失败提示只在 `wechatChat === 'linxiao'` 时触发，其他会话正常发送（或不做任何处理）。

---

### 9. 幽灵文字加位置去重，限制最大密度

**问题：** 幽灵文字随机位置导致严重重叠，视觉混乱。

**修改文件：** `Desktop.tsx`

**具体改动：**
生成新幽灵文字前检查已有文字的位置，确保新文字与现有文字的坐标差值大于 8%（x 轴）和 6%（y 轴）。若连续 5 次随机都无法找到不重叠位置，则跳过本次生成，等待下一个 interval。同时限制屏幕上最多同时存在 20 条幽灵文字，超出后移除最早添加的一条再添加新的。

---

### 10. 源码注释删除 `username: bbs_admin` 和 `identity code: mnt (maintenance)` 两行

**问题：** 直接暴露了用户名和密码代号的对应关系，破坏推理。

**修改文件：** `Clinic.tsx`

**具体改动：**
源码注释改为：
```
<!--
site maintenance contact: bbs_admin@tranquil-sleep.com
last maintained: 2024-03-19
// reminder: don't stare at the logo too long
// —z
-->
```

---

### 11. FAQ 悬浮阈值改为 1000ms

**问题：** 测试反馈 3000ms 太长，1000ms 更合适。

**修改文件：** `Clinic.tsx`

**具体改动：**
`Clinic.tsx` 第 47 行和第 69 行的 `3000` 改为 `1000`。

12. 碎片弹层标题改为 RUNE #0x 格式
修改文件： InvestigateNode.tsx
具体改动：
碎片弹层标题处新增转换函数，将 runeId（如 RUNE_01）转换为显示用的格式（如 RUNE #01）：
typescriptfunction formatRuneTitle(runeId: string): string {
  const match = runeId.match(/(\d+)$/);
  if (!match) return runeId;
  return `RUNE #${match[1].padStart(2, '0')}`;
}
弹层标题原来显示的固定文字或 runeId 原始值，改为调用 formatRuneTitle(runeId) 的结果。

---

## 构建验证

以上全部完成后：
```
npm run build
```
通过后发我构建结果，然后开始第二轮测试。
