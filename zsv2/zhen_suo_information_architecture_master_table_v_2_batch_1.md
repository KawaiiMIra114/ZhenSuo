# 《镇锁》Information Architecture Master Table v2
## Batch 1：第一幕 + 第二幕主线页面冻结稿

> 本文档是《镇锁》重构后的第一批信息架构总表。  
> 它不是页面文案，不是剧情脚本，也不是程序实现说明。  
> 它的职责是：把页面、对象、关键词、入口、门锁、回流关系、玩家获得的认知变化全部数据库化。  
> 本批次只覆盖：**第一幕《她最后留下了什么》** 与 **第二幕《这家诊所在藏什么》** 的主线必要页面与少量关键支撑页。

---

# 一、字段标准（本批次统一使用）

## 1.1 字段定义
- **Page ID**：内部唯一编号，不直接暴露给玩家。
- **Visible Label**：玩家侧拟真编号/标题。
- **Act**：所属幕次。
- **Layer**：桌面 / 官网 / 半公开结果页 等。
- **Content Type**：页面 / 对话 / 邮件 / 图片 / 查询结果 / 索引页。
- **Canon Function**：它在世界里真实承担的作用。
- **Player Function**：它对玩家推进的作用。
- **Must Learn**：玩家必须从这一页带走的结论。
- **Trigger Terms**：本记录可被哪些词直接或间接命中。
- **Echo Terms**：本记录用于回响、互证或延迟点亮的词；如无则写“无”。
- **Output Terms**：本记录读完后应推动玩家继续搜索、组合或追踪的新词/对象。
- **Prerequisite Action**：来到这里之前必须完成的动作；可为“无”。
- **Entry Paths**：进入本页的合法路径，不一定只有一条。
- **Gate Type**：无门 / 软门 / 硬门。
- **Gate Logic**：若存在门，其现实语义是什么。
- **Cross Links**：最关键的对照页。
- **Redundant Path**：备用发现路径，防止单点熄火。
- **Emotional Beat**：情绪职责。
- **Mainline Weight**：主线必要 / 主线半必要 / 支撑必要 / 扩张。
- **Estimated Read Time**：建议阅读耗时。

## 1.2 本批次设计红线
1. 本批次不引入 Meridian 深层结构。  
2. 本批次不要求玩家理解太岁、RH、节点矩阵等完整术语。  
3. 本批次必须稳定产出：**林晓是活人、诊所可疑、LX-044-YIN、论坛存在/值得去。**  
4. 本批次不得再把单一 hover、单一源码注释、单一热区做成唯一通路。  
5. 所有页面必须符合 Canon Bible 与 Experience Bible 的既定口径：**南郊市 / 南郊区、林德坤、Project Delta Phase III、DNR 外壳真实存在。**

---

# 二、第一幕《她最后留下了什么》

---

## IA-01
### Page ID
DSK-WX-01

### Visible Label
微信 · 会话列表

### Act
第一幕

### Layer
桌面

### Content Type
应用首页 / 会话索引页

### Canon Function
林浩日常沟通残留界面。它真实反映了妹妹、父亲、诊所前台、文件传输助手等对象都仍处于“生活世界”中，而不是纯线索工具箱。

### Player Function
第一时间用熟悉的社交界面，把“失联”从抽象剧情变成可立即感知的现实状态。

### Must Learn
- 林晓不是抽象患者，是玩家生活里的亲人。  
- 有人持续找不到她。  
- “诊所前台”是一个具体对象，不只是机构名。  
- 会话列表本身已经透露：事情拖了很久，没有回复。

### Trigger Terms
无（第一幕起点页，不承担搜索入口功能）

### Echo Terms
无

### Output Terms
- 林晓  
- 诊所前台  
- 爸爸  
- 文件传输助手  
- 3月19日 / 未读 / 已送达等时间感关键词

### Prerequisite Action
无

### Entry Paths
- 游戏默认已打开窗口  
- 玩家点击桌面微信图标重新呼出

### Gate Type
无门

### Gate Logic
无

### Cross Links
- DSK-WX-LX-01  
- DSK-WX-CLINIC-01  
- DSK-MAIL-02  
- DSK-PHT-01

### Redundant Path
无；本页本身是起始主界面

### Emotional Beat
把玩家拉进“这是我的聊天软件，不是谜题面板”的错觉里；建立生活感与焦虑感。

### Mainline Weight
主线必要

### Estimated Read Time
1-2 分钟

---

## IA-02
### Page ID
DSK-WX-LX-01

### Visible Label
微信 · 林晓

### Act
第一幕

### Layer
桌面

### Content Type
具体对话页

### Canon Function
林晓与林浩真实通信残留。时间分布必须符合 Canon Bible：林晓最后一条有效回复在入院前夜，之后只剩林浩的已送达未读消息。

### Player Function
让林晓先成为“会说话的人”，再成为消失对象；这是全作情感抓手的第一锚点。

### Must Learn
- 林晓最后一次回复是入院前夜。  
- 她当时仍在尽量安抚哥哥。  
- 林浩后续的消息都没有被读。  
- 失联不是一时失联，而是沿着明确时间轴发生的。

### Trigger Terms
无

### Echo Terms
无

### Output Terms
- 明天去了  
- 到了记得报平安  
- 已送达未读  
- 1月9日 / 3月19日

### Prerequisite Action
从 DSK-WX-01 点击进入

### Entry Paths
- 会话列表点击  
- 后期通知回流打开

### Gate Type
无门

### Gate Logic
无

### Cross Links
- DSK-PHT-06（最后消息截图）  
- DSK-MAIL-02（诊所模板邮件）  
- DSK-CLM-01（门诊单）

### Redundant Path
照片页中必须至少有一张对话截图回流支持，以免玩家只扫会话列表不细读正文。

### Emotional Beat
失联感真正落地。让“妹妹失联”先于“诊所可疑”成立。

### Mainline Weight
主线必要

### Estimated Read Time
2-3 分钟

---

## IA-03
### Page ID
DSK-WX-CLINIC-01

### Visible Label
微信 · 诊所前台

### Act
第一幕

### Layer
桌面

### Content Type
具体对话页

### Canon Function
诊所服务端模板式应答的生活痕迹。它体现了诊所不是神秘组织入口，而是一个拥有客服外壳的真实机构。

### Player Function
给出第一层“官方冷感”：诊所不失态，不露破绽，但它的回复方式令人不舒服。

### Must Learn
- 林浩曾主动联系诊所。  
- 诊所用“康复关键期，暂不探视”这类措辞隔绝家属。  
- 这种冷静与模板感与林浩的焦虑形成反差。

### Trigger Terms
无

### Echo Terms
无

### Output Terms
- 康复关键期  
- 暂不探视  
- 患者服务 / 官方渠道

### Prerequisite Action
从 DSK-WX-01 点击进入

### Entry Paths
会话列表点击

### Gate Type
无门

### Gate Logic
无

### Cross Links
- DSK-MAIL-02  
- CL-HOME-01  
- CL-ARCH-01

### Redundant Path
诊所官网邮件与门诊单都要形成对“官方且冷”的语义回声。

### Emotional Beat
把“不安”从亲情层转向机构层。

### Mainline Weight
支撑必要

### Estimated Read Time
1 分钟

---

## IA-04
### Page ID
DSK-MAIL-01

### Visible Label
邮件 · 收件箱

### Act
第一幕

### Layer
桌面

### Content Type
邮件客户端首页

### Canon Function
林浩日常收件箱与诊所沟通残留。它保留“正常世界的书面化痕迹”。

### Player Function
把微信里的生活焦虑转换成“正式文书式”的异样；让玩家看到“诊所是个真实机构，它会发正式邮件”。

### Must Learn
- 诊所对家属发过更新邮件。  
- 邮件不是只有一封，至少形成过持续沟通。  
- 某封邮件被当前打开，成为玩家最自然的外链入口。

### Trigger Terms
无

### Echo Terms
无

### Output Terms
- 安宁深眠  
- service@tranquil-sleep.com  
- 患者诊疗进度更新

### Prerequisite Action
无

### Entry Paths
- 游戏默认已打开窗口之一  
- 点击桌面邮件图标

### Gate Type
无门

### Gate Logic
无

### Cross Links
- DSK-MAIL-02  
- CL-HOME-01

### Redundant Path
桌面官网图标也可通往官网，但邮件链接仍应是最自然主路径。

### Emotional Beat
把日常焦虑转成“冷冰冰的正式系统在回应你”。

### Mainline Weight
主线必要

### Estimated Read Time
1 分钟

---

## IA-05
### Page ID
DSK-MAIL-02

### Visible Label
邮件 · 关于患者林晓的诊疗进度更新

### Act
第一幕

### Layer
桌面

### Content Type
具体邮件页

### Canon Function
由诊所自动系统在深夜定时发出的安抚模板邮件。内容在表面上完全合规，但时间与语气共同制造不适。

### Player Function
作为游戏官网的第一自然跳转入口；同时给出“凌晨 02:47 发送的模板化安抚”这一异常质感。

### Must Learn
- 诊所确实在“主动汇报”。  
- 报告措辞非常干净、非常无效。  
- 这封邮件的发送时间不对劲。  
- 邮件内网址值得点开。

### Trigger Terms
- 林晓  
- 安宁深眠  
- tranquil-sleep  
- 24小时服务热线

### Echo Terms
无

### Output Terms
- www.tranquil-sleep.com  
- 深度康复阶段  
- 患者服务中心  
- 南郊医疗研究中心

### Prerequisite Action
从 DSK-MAIL-01 进入，或默认打开

### Entry Paths
- 点击当前打开邮件  
- 收件箱点入  
- 后期邮件列表复看

### Gate Type
无门

### Gate Logic
无

### Cross Links
- CL-HOME-01  
- DSK-WX-CLINIC-01  
- DSK-CLM-01

### Redundant Path
桌面官网图标与门诊单也能将玩家带到官网，但邮件链接必须是最不费脑的主入口。

### Emotional Beat
“这封邮件越正常越不对。”

### Mainline Weight
主线必要

### Estimated Read Time
1-2 分钟

---

## IA-06
### Page ID
DSK-PHT-01

### Visible Label
晓的照片 · 文件夹

### Act
第一幕

### Layer
桌面

### Content Type
图片索引页

### Canon Function
林浩私人照片文件夹。其存在证明林晓在进入诊所前的日常生活、情绪状态与家庭关系都是真实存在的。

### Player Function
把林晓从“失联对象”转成“具体的人”；同时为后续诊所、凌晨、最后消息等对象提供视觉支撑。

### Must Learn
- 林晓长期状态不好，但仍在正常生活。  
- 她亲自看过诊所宣传内容。  
- 她和哥哥之间的互动是真实的，不是纯功能对话。  
- 最后一张图会与微信对话形成回响。

### Trigger Terms
无

### Echo Terms
无

### Output Terms
- 诊所宣传页  
- 凌晨 03:47  
- 我来接你 / 到了记得报平安等截图对象

### Prerequisite Action
无

### Entry Paths
- 游戏默认已打开窗口之一  
- 点击桌面照片图标

### Gate Type
无门

### Gate Logic
无

### Cross Links
- DSK-PHT-03  
- DSK-PHT-06  
- DSK-WX-LX-01  
- DSK-CLM-01

### Redundant Path
微信与门诊单可支撑基础信息，但照片是“让林晓活起来”的核心冗余，不可删。

### Emotional Beat
让玩家愿意继续查，不是因为谜题，而是因为人。

### Mainline Weight
主线必要

### Estimated Read Time
3-5 分钟

---

## IA-07
### Page ID
DSK-PHT-03

### Visible Label
照片 03/06 · 诊所宣传页

### Act
第一幕

### Layer
桌面

### Content Type
单张图片详情

### Canon Function
林晓主动将诊所视为“可能的希望”，不是被骗到场，而是主动走进去。

### Player Function
建立诊所与林晓之间的主动关系，避免故事变成“纯外部加害者绑架了一个完全被动的人”。

### Must Learn
- 林晓自己认真考虑过这家诊所。  
- 她对治疗抱有期待。  
- 诊所的宣传页在视觉上足够专业可信。

### Trigger Terms
无

### Echo Terms
无

### Output Terms
- 安宁深眠  
- 我想试试  
- DNR / 诊所宣传关键词（仅弱提示）

### Prerequisite Action
从 DSK-PHT-01 打开

### Entry Paths
图片索引点击

### Gate Type
无门

### Gate Logic
无

### Cross Links
- CL-HOME-01  
- DSK-MAIL-02

### Redundant Path
官网首页会回响宣传物的视觉风格，形成“她确实来到了同一个地方”的确认。

### Emotional Beat
希望感。它越真实，后面坍塌才越痛。

### Mainline Weight
支撑必要

### Estimated Read Time
30-45 秒

---

## IA-08
### Page ID
DSK-PHT-06

### Visible Label
照片 06/06 · 最后一条消息

### Act
第一幕

### Layer
桌面

### Content Type
单张图片详情

### Canon Function
林浩最后试图接她、等她、找她的视觉定格。

### Player Function
把“最后一次联系”固定成一个玩家会反复记住的视觉锚点，为结局回响做铺垫。

### Must Learn
- 最后消息带着行动意图，而不是单纯问候。  
- 这条消息与未读状态一起，说明失联已久。  
- 这是哥哥视角下最无法结束的一帧。

### Trigger Terms
无

### Echo Terms
无

### Output Terms
- 我来接你 / 到了记得报平安（具体采用哪条以统一版文档为准）  
- 已送达未读

### Prerequisite Action
从 DSK-PHT-01 打开

### Entry Paths
图片索引点击

### Gate Type
无门

### Gate Logic
无

### Cross Links
- DSK-WX-LX-01  
- 结局 A / C 终局回响文本

### Redundant Path
微信正文与这张截图必须双向印证，不得出现版本冲突。

### Emotional Beat
为全作埋下最重要的一句私人情绪回声。

### Mainline Weight
支撑必要

### Estimated Read Time
30-45 秒

---

## IA-09
### Page ID
DSK-CLM-01

### Visible Label
门诊单 · 正反面

### Act
第一幕

### Layer
桌面

### Content Type
可翻面文档对象

### Canon Function
真实就诊单据，包含患者名、就诊信息、主治医师、档案编号。它是现实世界里最典型的“可查抓手”。

### Player Function
提供第一幕最关键的主线推进器：**LX-044-YIN**。

### Must Learn
- 林晓确实入院。  
- 主治医师是林德坤。  
- 诊所不是传闻。  
- 背面编号值得被拿去查。

### Trigger Terms
- 林晓  
- 林德坤  
- LX-044-YIN

### Echo Terms
无

### Output Terms
- LX-044-YIN  
- 林德坤  
- 就诊日期  
- 顽固性失眠症

### Prerequisite Action
无

### Entry Paths
点击桌面门诊单图标

### Gate Type
无门

### Gate Logic
无

### Cross Links
- CL-ARCH-01  
- CL-TEAM-LD-01  
- DSK-MAIL-02

### Redundant Path
若玩家忽略门诊单，照片或微信中也应有“诊所已正式接诊”的回声，但**LX-044-YIN 本体仍应以门诊单为最稳定主来源。**

### Emotional Beat
把调查从“担心”转成“有东西可查”。

### Mainline Weight
主线必要

### Estimated Read Time
1 分钟

---

## IA-10
### Page ID
DSK-DESKTOP-01

### Visible Label
桌面 · 入口视图

### Act
第一幕

### Layer
桌面

### Content Type
系统壳层 / 入口场景

### Canon Function
林浩的电脑，不是调查板。其作用是承载“真实生活的残骸”而非“任务面板”。

### Player Function
给玩家一个“我可以先自己看看”的低压空间；但同时，已打开的窗口与顺序暗示出最自然的调查方向。

### Must Learn
- 这里不是线性任务界面  
- 但已经有几扇门是半开的  
- 我只是在某个夜里开始翻东西

### Trigger Terms
无

### Echo Terms
无

### Output Terms
无直接关键词；只产出行为方向

### Prerequisite Action
无

### Entry Paths
游戏启动默认进入

### Gate Type
无门

### Gate Logic
无

### Cross Links
全第一幕页面

### Redundant Path
无

### Emotional Beat
“事情已经发生过一阵子了，我现在才开始翻。”

### Mainline Weight
主线必要

### Estimated Read Time
不定

---

# 三、第二幕《这家诊所在藏什么》

---

## IA-11
### Page ID
CL-HOME-01

### Visible Label
官网 · 首页

### Act
第二幕

### Layer
官网

### Content Type
站点首页

### Canon Function
安宁深眠的外部合法门面。它必须足够专业可信，才能解释为什么林晓会来，为什么普通人会信。

### Player Function
让玩家体验“表面太正常”；并开始布下措辞裂缝、数字裂缝、气质裂缝。

### Must Learn
- 诊所在公开层面非常像真机构。  
- 这种专业感不是廉价伪造。  
- 正因为它足够真，细小裂缝才值得警惕。  
- 官网还不是答案，但绝不是空壳。

### Trigger Terms
- 安宁深眠  
- tranquil-sleep  
- 睡眠重建  
- 南郊医疗研究中心

### Echo Terms
无

### Output Terms
- 关于我们  
- 专家团队  
- DNR 疗法  
- 患者评价  
- 新闻动态  
- 专家专栏  
- 档案查询  
- FAQ

### Prerequisite Action
由邮件链接或桌面图标进入

### Entry Paths
- DSK-MAIL-02 链接  
- 桌面官网图标  
- 后续地址栏访问

### Gate Type
无门

### Gate Logic
无

### Cross Links
第二幕全部页面

### Redundant Path
任何子页面都应可返回首页，首页作为“官方总索引”必须始终稳定存在。

### Emotional Beat
“这地方太像真的了。”

### Mainline Weight
主线必要

### Estimated Read Time
2-3 分钟

---

## IA-12
### Page ID
CL-TEAM-INDEX-01

### Visible Label
专家团队 · 索引页

### Act
第二幕

### Layer
官网

### Content Type
索引页

### Canon Function
把钟长明与林德坤纳入可信医疗机构叙事，同时为后续的裂缝页（学术记录、专栏）提供入口。

### Player Function
让玩家从“机构”过渡到“人”；并把“林德坤是谁”与“钟长明是谁”放入可继续查询的状态。

### Must Learn
- 诊所有明确的人物面孔与学术背书。  
- 林德坤不是随机名字，而是主治医生。  
- 钟长明不是空壳院长。

### Trigger Terms
- 钟长明  
- 林德坤

### Echo Terms
无

### Output Terms
- 学术成果  
- 专栏文章  
- 神经内科主任  
- 学术继承人

### Prerequisite Action
从 CL-HOME-01 点击进入

### Entry Paths
官网导航

### Gate Type
无门

### Gate Logic
无

### Cross Links
- CL-TEAM-ZH-01  
- CL-TEAM-LD-01  
- DSK-CLM-01

### Redundant Path
团队页中的人物名字也应在站内搜索 / 页面结构中有回声，避免只靠导航进入。

### Emotional Beat
“这不是匿名黑站，这里的人都像真的。”

### Mainline Weight
主线半必要

### Estimated Read Time
1-2 分钟

---

## IA-13
### Page ID
CL-TEAM-ZH-01

### Visible Label
专家团队 · 钟长明

### Act
第二幕

### Layer
官网

### Content Type
人物页

### Canon Function
钟长明的公开学术人格。必须让玩家相信：他是真权威，而不是民科壳子。

### Player Function
为后续“这么真的人为什么会做出这样的系统”埋下基础；同时通过学术成果入口埋入第一层裂缝。

### Must Learn
- 钟长明确实有真学术地位。  
- 他的权威性本身是真实构成的一部分。  
- 真问题不是“他有没有本事”，而是“他拿本事做了什么”。

### Trigger Terms
- 钟长明  
- 学术成果  
- 睡眠神经科学

### Echo Terms
无

### Output Terms
- 学术数据库  
- 已撤稿记录（通过跳页产出）

### Prerequisite Action
从 CL-TEAM-INDEX-01 进入

### Entry Paths
人物卡点击

### Gate Type
无门

### Gate Logic
无

### Cross Links
- CL-ACAD-01（学术成果页，后续批次补写）

### Redundant Path
主页或新闻页中也可再次提到钟长明，形成公信力回响。

### Emotional Beat
建立“真正危险的人往往不是假专家”的质感。

### Mainline Weight
支撑必要

### Estimated Read Time
1-2 分钟

---

## IA-14
### Page ID
CL-TEAM-LD-01

### Visible Label
专家团队 · 林德坤

### Act
第二幕

### Layer
官网

### Content Type
人物页

### Canon Function
林德坤的公开职业外壳与专栏入口页。它必须和门诊单信息严格一致。

### Player Function
把门诊单上的医生名转成可继续追踪的人物；同时把玩家导向专栏区。

### Must Learn
- 林德坤确实存在于这家机构的正式结构中。  
- 门诊单与官网能对上。  
- 专栏是一个值得进入的次级信息层。

### Trigger Terms
- 林德坤  
- 专栏  
- 神经内科主任

### Echo Terms
无

### Output Terms
- 专家专栏  
- 文章 01-04

### Prerequisite Action
从 CL-TEAM-INDEX-01 进入，或从门诊单对人名产生兴趣后主动寻找

### Entry Paths
- 团队页点击  
- 站内导航  
- 站内搜索（后续若做）

### Gate Type
无门

### Gate Logic
无

### Cross Links
- DSK-CLM-01  
- CL-ART-INDEX-01

### Redundant Path
专栏区首页必须能反向看见林德坤名字，形成互证。

### Emotional Beat
“这个名字终于不是纸面上的一个签名了。”

### Mainline Weight
主线半必要

### Estimated Read Time
1-2 分钟

---

## IA-15
### Page ID
CL-REV-INDEX-01

### Visible Label
患者评价 · 列表页

### Act
第二幕

### Layer
官网

### Content Type
列表页

### Canon Function
20% 真康复者口碑 + 精心维护过的评价体系。它是真实与谎言混合后最有杀伤力的公共层。

### Player Function
让玩家第一次系统性感受到：这里不是简单“有问题”，而是“有一整套口碑表面”。

### Must Learn
- 评价整体看起来过于干净。  
- 少数 ID、措辞、状态会显得格格不入。  
- 这里藏着第一条被删除的公开层残影。

### Trigger Terms
- 患者评价  
- 康复  
- DNR 体验

### Echo Terms
无

### Output Terms
- gh_0314_lx  
- 已完成疗程  
- 已注销账号回复

### Prerequisite Action
从 CL-HOME-01 进入

### Entry Paths
官网导航

### Gate Type
无门

### Gate Logic
无

### Cross Links
- CL-REV-17  
- FR-USR-gh_0314_lx（后续批次）

### Redundant Path
档案查询与论坛层也会回响 gh_0314_lx，保证它不是单点发现。

### Emotional Beat
“这里的正常反而有点吓人。”

### Mainline Weight
主线必要

### Estimated Read Time
3-5 分钟

---

## IA-16
### Page ID
CL-REV-17

### Visible Label
评价 17/24 · gh_0314_lx

### Act
第二幕

### Layer
官网

### Content Type
列表中关键条目 / 半展开详情

### Canon Function
林晓曾公开留下的痕迹之一。它既必须像普通评价，又必须在细看时显出不自然。

### Player Function
给出“这个 ID 不像普通用户 ID”的第一击；并通过已注销回复建立“有人被处理过”。

### Must Learn
- gh_0314_lx 不是普通随机 ID。  
- 这条评价与“完整疗程”状态一起，会引人不安。  
- 回复者账号已注销，说明这里发生过删除链。

### Trigger Terms
- gh_0314_lx  
- 祝你早日康复（弱）

### Echo Terms
无

### Output Terms
- gh_0314_lx  
- 已注销账号  
- 祝你早日康复  
- 论坛用户影子（通过后续设计支持）

### Prerequisite Action
打开评价列表并读到关键条目

### Entry Paths
- CL-REV-INDEX-01  
- 站内锚点跳转（若后续支持）

### Gate Type
无门（可做二段展开，但不能过度重）

### Gate Logic
若保留“展开”动作，它必须是自然阅读行为，而不是谜题机关。

### Cross Links
- FR-USR-gh_0314_lx  
- DSK-WX-LX-01  
- DSK-CLM-01

### Redundant Path
gh_0314_lx 必须在论坛层能再次被查到，确保玩家即使没在此处深挖，也会在后续认出它。

### Emotional Beat
“她来过，而且有人在她消失前后对她说过话。”

### Mainline Weight
主线必要

### Estimated Read Time
1-2 分钟

---

## IA-17
### Page ID
CL-NEWS-INDEX-01

### Visible Label
新闻动态 · 列表页

### Act
第二幕

### Layer
官网

### Content Type
新闻列表

### Canon Function
机构正面公关外层。它必须以高度正常的媒体叙事强化合法感。

### Player Function
给出“诊所在公开社会里被怎样包装”的证据，并为后续车祸新闻/资本线/作者署名异常埋点。

### Must Learn
- 诊所不只是一个小机构，而是被媒体、资本、地方结构看见的对象。  
- 正面报道本身不是安全感，反而是后续反查的材料。

### Trigger Terms
- 新闻  
- 安宁深眠  
- 资本路径  
- 荣誉认证

### Echo Terms
无

### Output Terms
- 车祸新闻条目  
- 作者名  
- 上市 / 资本路径等词

### Prerequisite Action
从 CL-HOME-01 进入

### Entry Paths
官网导航

### Gate Type
无门

### Gate Logic
无

### Cross Links
- CL-NEWS-CRASH-01  
- 后续 EXT-ARCHIVE-*（外部快照，后续批次）

### Redundant Path
车祸类线索后续必须在 OA/HR 中被重新点亮，避免新闻页单独悬空。

### Emotional Beat
让“社会承认度”成为一种反向恐惧。

### Mainline Weight
主线半必要

### Estimated Read Time
2-3 分钟

---

## IA-18
### Page ID
CL-NEWS-CRASH-01

### Visible Label
新闻 04/07 · 高新区安宁路交通事故

### Act
第二幕

### Layer
官网

### Content Type
具体新闻页

### Canon Function
对外看是短新闻，对内看是“被洗白进本地资讯流里的异常死亡背景噪音”。

### Player Function
在第二幕只承担“可疑但看不透”的作用；真正意义在第四幕 OA/HR 回流时才被点亮。

### Must Learn
- 安宁路附近曾有一起简短、冷漠、缺细节的事故报道。  
- 这则新闻值得被记住，即使现在看不懂。  
- 官网会把这种内容放在正常新闻流里，说明它没有显得格格不入。

### Trigger Terms
- 安宁路  
- 交通事故  
- 南郊市  
- 2022年11月

### Echo Terms
无

### Output Terms
- 安宁路  
- 2022-11  
- 一死一重伤（视统一口径而定）

### Prerequisite Action
从新闻列表进入

### Entry Paths
CL-NEWS-INDEX-01 点击

### Gate Type
无门

### Gate Logic
无

### Cross Links
- OA-MOD-02（HR）  
- FR-THD-* 转介/失踪线（后续批次）

### Redundant Path
后续 HR 页必须明确重新打亮这条新闻，否则它在第二幕只是噪音。

### Emotional Beat
“我现在记下它，但我还不知道它怎么拼进去。”

### Mainline Weight
支撑必要

### Estimated Read Time
1 分钟

---

## IA-19
### Page ID
CL-ART-INDEX-01

### Visible Label
专家专栏 · 列表页

### Act
第二幕

### Layer
官网

### Content Type
文章索引页

### Canon Function
林德坤对外的专业人格出口。四篇专栏必须整体看起来像真实睡眠科普，而不是谜题菜单。

### Player Function
为后续“文章标题首字”“隐藏段落”“语气突变”建立进入路径，但在第二幕只先完成“这里有值得细读的东西”。

### Must Learn
- 林德坤写过四篇文章。  
- 文章数量有限，可遍历。  
- 这里不是纯介绍页，而是能继续挖的区块。

### Trigger Terms
- 专栏  
- 林德坤  
- 失眠科普

### Echo Terms
无

### Output Terms
- 文章 01-04  
- 文章标题首字可被未来利用（第二幕只弱感知）

### Prerequisite Action
从 CL-TEAM-LD-01 或导航进入

### Entry Paths
- 人物页进入  
- 官网导航进入

### Gate Type
无门

### Gate Logic
无

### Cross Links
- CL-ART-02  
- CL-ART-04  
- OA-MOD-05（后续 JiuKu 回流）

### Redundant Path
林德坤人物页与导航都可进入，防止单一路径。

### Emotional Beat
让玩家产生“这位医生应该会说更多”的期待。

### Mainline Weight
主线半必要

### Estimated Read Time
1 分钟

---

## IA-20
### Page ID
CL-ART-02

### Visible Label
文章 02/04 · 乙酰胆碱与睡眠调节的最新研究进展

### Act
第二幕

### Layer
官网

### Content Type
具体文章页

### Canon Function
一篇表层正常、深层埋入受限投影段落的专栏文章。它是林德坤良心裂缝的前期预埋点。

### Player Function
让玩家第一次明确感知：这家官网不是所有内容都按同一公开规则呈现；有的地方被故意压住了。

### Must Learn
- 这篇文章整体专业正常。  
- 中间有一段被系统遮罩成受限投影。  
- “系统里有被压住的信息”开始从论坛影子扩散到官网本体。

### Trigger Terms
- 乙酰胆碱  
- 睡眠调节  
- 受限内容（弱）

### Echo Terms
无

### Output Terms
- 受限投影段落  
- RH / 适度痛苦输入等概念的极弱前影（若本稿后续保留）

### Prerequisite Action
从 CL-ART-INDEX-01 进入

### Entry Paths
文章列表点击

### Gate Type
软门

### Gate Logic
内容可见结构，但正文被系统分层遮罩压住；这不是“不给玩家看”，而是“官网内部存在分级可见性”。

### Cross Links
- OA 层真实资料（后续批次）  
- 林德坤角色裂缝线

### Redundant Path
隐藏段落的存在感也应在其他文章或页面被微弱呼应，避免成为一次性奇观。

### Emotional Beat
“连官网自己的文章都在对某些内容打码。”

### Mainline Weight
主线半必要

### Estimated Read Time
2-4 分钟

---

## IA-21
### Page ID
CL-ART-04

### Visible Label
文章 04/04 · 苦于失眠的你，可能从未真正休息过

### Act
第二幕

### Layer
官网

### Content Type
具体文章页

### Canon Function
四篇专栏中最晚露出裂缝的一篇。结尾语气转折、加粗字与未来口令语义都必须符合 Canon Bible 口径。

### Player Function
在第二幕先完成“语气突然不对”的感知；完整的 TaiYi 语义在第四幕才被真正拼完。

### Must Learn
- 文章前文正常，尾段突然像在对谁说话。  
- 加粗字不是普通排版。  
- 林德坤在用学术外壳包着某种求救或转向。

### Trigger Terms
- 苦于失眠  
- 文章结尾  
- 太 / 乙 / 救 / 苦（不要求第二幕立刻全懂）

### Echo Terms
无

### Output Terms
- 太乙救苦（半成形）  
- “继续往下找”的语义  
- 林德坤裂缝感

### Prerequisite Action
从 CL-ART-INDEX-01 进入

### Entry Paths
文章列表点击

### Gate Type
无门

### Gate Logic
无

### Cross Links
- OA-MOD-05 / OA-MOD-06（后续批次）  
- CL-ART-02

### Redundant Path
系统备注、图像档案等后续必须把这一页重新点亮，否则加粗字会沦为作者谜语。

### Emotional Beat
“有人在一篇科普文章的最后，突然不想再装下去了。”

### Mainline Weight
主线必要（第二幕中为半理解，第四幕中完成回流）

### Estimated Read Time
2-4 分钟

---

## IA-22
### Page ID
CL-ARCH-01

### Visible Label
档案查询 · 输入页

### Act
第二幕

### Layer
官网

### Content Type
功能页 / 搜索入口

### Canon Function
诊所对外提供的患者档案查询系统。它是全作最关键的“搜索驱动器”之一，必须像一台真实可查询系统，而不是谜题箱。

### Player Function
把第一幕拿到的编号、名字、关键词转化成可执行调查动作。

### Must Learn
- 这里接受输入，且输入是有区别的。  
- 查“名字”和查“编号”会得到不同层级反馈。  
- 这是玩家第一次明确感到：词语可以被拿去试、拿去搜、拿去撞系统。

### Trigger Terms
输入驱动型页面，本页本身不被搜；它容纳后续查询词

### Echo Terms
无

### Output Terms
- 林晓查询响应  
- LX-044-YIN 查询响应  
- PHX-ALPHA 查询响应  
- 物料类词响应  
- TaiYiJiuKu 终局前影

### Prerequisite Action
从 CL-HOME-01 或导航进入

### Entry Paths
官网导航

### Gate Type
无门

### Gate Logic
无

### Cross Links
- CL-ARCH-RSP-LX-01  
- CL-ARCH-RSP-NAME-01  
- CL-ARCH-RSP-PHX-01  
- CL-FAQ-09

### Redundant Path
编号查询是第一幕主抓手的最佳落点，必须保证路径极稳。

### Emotional Beat
“我终于能把手里的东西拿去试了。”

### Mainline Weight
主线必要

### Estimated Read Time
不定（交互型）

---

## IA-23
### Page ID
CL-ARCH-RSP-NAME-01

### Visible Label
档案结果 · 林晓

### Act
第二幕

### Layer
官网 / 查询结果页

### Content Type
搜索结果页

### Canon Function
系统承认“有这个人”，但拒绝给出实质内容；这符合诊所对已入院特殊患者的对外遮罩逻辑。

### Player Function
让玩家确认：名字有效，但系统在挡。

### Must Learn
- 林晓不是真的“查无此人”。  
- 系统用“档案迁移处理中”这种行政说法挡住了她。  
- 我手里那个编号会更重要。

### Trigger Terms
- 林晓

### Echo Terms
无

### Output Terms
- 档案迁移处理中  
- 联系服务热线（若保留）

### Prerequisite Action
在 CL-ARCH-01 输入“林晓”

### Entry Paths
查询结果跳转

### Gate Type
软门

### Gate Logic
系统承认记录存在，但以流程性理由拒绝展示详情。

### Cross Links
- DSK-MAIL-02  
- DSK-CLM-01  
- CL-ARCH-RSP-LX-01

### Redundant Path
名字查得到但不给看，正是把玩家推向编号查询的软引导。

### Emotional Beat
“她在系统里，但你碰不到她。”

### Mainline Weight
主线必要

### Estimated Read Time
30 秒

---

## IA-24
### Page ID
CL-ARCH-RSP-LX-01

### Visible Label
档案结果 · LX-044-YIN

### Act
第二幕

### Layer
官网 / 查询结果页

### Content Type
错误结果页 / 异常页

### Canon Function
林晓档案的特殊处理与异常结构在外层系统中的第一次可见崩口。错误页不是单纯报错，而是渲染层承受不了这个对象的部分外溢。

### Player Function
这是第二幕最关键的“深层异常证据”之一。它告诉玩家：这个编号不是普通档案。

### Must Learn
- LX-044-YIN 触发的不是普通查询结果。  
- 系统内部有异常层。  
- 这个对象的特殊性远超“普通患者记录被隐藏”。

### Trigger Terms
- LX-044-YIN

### Echo Terms
无

### Output Terms
- debug 注释  
- signal overflow / anchor node 等技术残语（最终版本以统一口径为准）  
- render layer 异常

### Prerequisite Action
在 CL-ARCH-01 输入 LX-044-YIN

### Entry Paths
查询结果跳转

### Gate Type
软门

### Gate Logic
系统并非简单拒绝，而是对这个对象的处理溢出了表层渲染规则。

### Cross Links
- CL-REV-17  
- 后续 OA / 节点概念页  
- 林晓信号强度系统

### Redundant Path
论坛层与系统残影层必须后续再度证实这个编号异常，避免本页显得像纯猎奇错误页。

### Emotional Beat
“这个编号碰到系统时，系统自己先抖了一下。”

### Mainline Weight
主线必要

### Estimated Read Time
30-60 秒

---

## IA-25
### Page ID
CL-ARCH-RSP-PHX-01

### Visible Label
档案结果 · PHX-ALPHA

### Act
第二幕

### Layer
官网 / 查询结果页

### Content Type
受限投影记录页

### Canon Function
PHX-ALPHA 是诊所内部特殊处理序列标记，外层系统对这个词的处理更接近“踩到不该问的东西”。

### Player Function
给玩家一个极重要的“可带走的新词”，用于后续论坛/OA/系统层回流。

### Must Learn
- PHX-ALPHA 不是无效词，而是内部标签词（受限投影）。
- 我刚刚不是随便乱试到了一个彩蛋，而是试到了系统不想让我问的标签。
- 反馈应为查询不足或受限投影，不确认对象存在。

### Trigger Terms
- PHX-ALPHA

### Echo Terms
无

### Output Terms
- 受限投影记录
- 需补充语境提示
- PHX-ALPHA（强化为主线对象）

### Prerequisite Action
玩家先在其他页看到此词，或通过扩张调查获得后再来输入

### Entry Paths
查询结果跳转

### Gate Type
软门

### Gate Logic
外层系统识别该标签，但不允许解释，只留下“你碰到了内部标记”的痕迹。

### Cross Links
- CL-ARCH-RSP-LX-01  
- 后续论坛 / OA 特殊处理线

### Redundant Path
PHX-ALPHA 必须在别处至少再出现一次，不能只存在于输入框异响。

### Emotional Beat
“我刚刚踩中了系统的内部词汇。”

### Mainline Weight
主线半必要

### Estimated Read Time
30 秒

---

## IA-26
### Page ID
CL-FAQ-09

### Visible Label
常见问题 09/09 · 有没有患者交流渠道？

### Act
第二幕

### Layer
官网

### Content Type
FAQ 条目页 / 列表关键项

### Canon Function
诊所半承认患者社区存在，但不主动将其作为显眼公开入口。这符合其“需要口碑、又不想完全失控”的结构。

### Player Function
论坛入口的一个主路径，但不能再是唯一主路径。

### Must Learn
- 诊所有患者互助社区。  
- 这个社区不是站在首页中央的大按钮。  
- 官方在提，但提得很克制，像不太想让你真去。

### Trigger Terms
- 患者互助社区  
- 交流渠道  
- 论坛

### Echo Terms
无

### Output Terms
- forum.tranquil-sleep.com/bbs（或等价论坛域）

### Prerequisite Action
阅读 FAQ 页，停留到相关条目

### Entry Paths
- 官网导航  
- 站内搜索（后续如支持）  
- 从别处看到“患者社区”后主动回访 FAQ

### Gate Type
软门

### Gate Logic
官方不主动大张旗鼓展示，但确实留下痕迹。若保留 hover 显示 URL，它只能作为一种自然增强，而非唯一发现机制。

### Cross Links
- FR-HOME-01（后续批次）  
- CL-SRC-01  
- CL-REV-17

### Redundant Path
论坛入口还必须至少由以下对象中的一项提供冗余：  
- 评价区用户影子  
- 源码中的 bbs_admin  
- 档案查询或页面残影中的论坛语义

### Emotional Beat
“官方嘴上说维护中，但像是故意让我知道这地方存在。”

### Mainline Weight
主线必要

### Estimated Read Time
30-60 秒

---

## IA-27
### Page ID
CL-SRC-01

### Visible Label
页面源码 · 维护注释

### Act
第二幕

### Layer
官网 / 源码视图

### Content Type
辅助视图 / 技术残留页

### Canon Function
赵启在官网维护层留下的低可见度痕迹。它是真实技术维护残留，不是第四面墙提示。

### Player Function
提供论坛管理员对象、维护日期与“有人在这里留过手”的证据，但不能再承担唯一主线入口职责。

### Must Learn
- bbs_admin 是真实存在的管理对象。  
- 2024-03-19 这个日期值得记。  
- 官网不是全封闭光滑表面，有维护者留下过痕迹。

### Trigger Terms
- bbs_admin  
- last maintained  
- 2024-03-19  
- build-tag（若统一口径保留）

### Echo Terms
无

### Output Terms
- bbs_admin  
- 维护日期  
- mnt / 维护语义  
- 赵启存在感（弱）

### Prerequisite Action
玩家主动点击“查看页面源码”类入口，或通过系统菜单呼出

### Entry Paths
- 页脚按钮  
- 浏览器右键菜单模拟  
- 开发者模式入口（若后续做拟真）

### Gate Type
软门

### Gate Logic
这是低可见技术视图，不是系统禁区；但普通玩家也不一定会第一时间看它。

### Cross Links
- FR-ADMIN-LOGIN-01（后续批次）  
- CL-FAQ-09  
- OA 维护语义线

### Redundant Path
bbs_admin 必须还有别的出现或强化方式，避免源码页再次变成唯一解。

### Emotional Beat
“这里有人在表层下面动过手，而且他不想把所有痕迹抹干净。”

### Mainline Weight
主线半必要

### Estimated Read Time
1 分钟

---

## IA-28
### Page ID
CL-HOME-FOOTER-01

### Visible Label
首页页脚 · Meridian Life Sciences

### Act
第二幕

### Layer
官网

### Content Type
页脚对象 / 边缘信息

### Canon Function
Meridian 在第一部中的最低可见度阴影。它只证明“这家诊所背后有更大的结构”，不承担本幕主推进。

### Player Function
给敏感玩家一个“这家机构不只是本地诊所”的早期阴影；但不能把注意力从论坛主出口上吸走。

### Must Learn
- 诊所背后可能有更大的资本 / 组织结构。  
- 这个名字值得记住，但现在还不是主追对象。

### Trigger Terms
- Meridian  
- Meridian Life Sciences

### Echo Terms
无

### Output Terms
- Meridian

### Prerequisite Action
浏览到页脚

### Entry Paths
首页滚动到底

### Gate Type
软门

### Gate Logic
这是公开留名但不被强调的对象。它存在，但当前不应成为单幕最强引力。

### Cross Links
- 后续 MX-HOME-01（后续批次）  
- 新闻资本线

### Redundant Path
若玩家不记下 Meridian，不影响第二幕主线闭合。

### Emotional Beat
“这地方背后可能不只是一家医院。”

### Mainline Weight
扩张必要

### Estimated Read Time
10-20 秒

---

# 四、本批次主线闭环检查

## 4.1 第一幕最低稳定闭环
玩家无论优先看微信、照片、邮件还是门诊单，最终都必须稳定走到：
1. 林晓去了诊所  
2. 她失联了  
3. 我拿到了 **LX-044-YIN**  
4. 官网值得去查

## 4.2 第二幕最低稳定闭环
玩家无论先看团队、评价、新闻、专栏、档案查询还是 FAQ，最终都必须稳定走到：
1. 诊所外壳非常真  
2. 内部有遮罩、删痕、受限提示词、异常渲染  
3. **论坛存在且值得去**  
4. 至少带走以下对象中的 2 个：
   - gh_0314_lx  
   - PHX-ALPHA  
   - bbs_admin  
   - 2024-03-19  
   - 林德坤  
   - 太乙救苦前影

## 4.3 本批次不允许出现的断点
- 玩家知道论坛存在，但不知道为什么值得去  
- 玩家知道有编号，但编号查出来只是普通错误  
- 玩家读完很多官网内容，却没有任何新词可带走  
- 玩家必须靠单一 hover 或单一源码页才能继续  
- 玩家先看到太乙救苦，却完全不知道它以后还能做什么

---

# 五、下一批次衔接说明

Batch 2 应接续覆盖：
- 论坛公开层  
- 搜索结果页  
- 折叠帖  
- gh_0314_lx 用户页  
- 会员注册  
- 家属区  
- 8023 / 福生无量天尊线  
- 管理员层入口前影

Batch 2 的目标是把第二幕出口与第三幕主问题真正接上：
**“谁在试图留下证据？”**

---

*本批次不是页面文案终稿，而是页面存在理由、连接逻辑、关键词流向、门锁结构的冻结稿。*  
*后续 Page Bible 必须从这里长出来，而不是绕开这里直接写散页。*


