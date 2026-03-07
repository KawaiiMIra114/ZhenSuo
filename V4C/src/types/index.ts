// ═══════════════════════════════════════════════════════
//  ZhenSuo V4 · 核心类型定义
//  基于 GDD §4.1 FactId 驱动进度 + §7 碎片系统
// ═══════════════════════════════════════════════════════

/** 全局应用视图状态 */
export type AppView =
    | 'warning'      // 首次进入警告
    | 'prologue'     // 序章引导
    | 'desktop'      // 主桌面
    | 'ending'       // 终局界面
    | 'shutdown';    // 关机动画

/** 桌面内可打开的应用/窗口 ID */
export type WindowId =
    | 'wechat'       // 微信网页版
    | 'email'        // 邮件客户端
    | 'photos'       // 照片文件夹
    | 'browser'      // 浏览器（内嵌官网/论坛/OA）
    | 'notepad'      // 调查笔记本
    | 'calendar';    // 日历

/** 浏览器内切换的「网站」 */
export type BrowserSite = 'clinic' | 'forum' | 'oa';

/** 论坛可见层级 (GDD §6.2-6.5) */
export type ForumLayer = 0 | 1 | 2 | 3 | 4;
// 0 = 公开  1 = 折叠  2 = 会员  3 = 管理员  4 = 影子档案

/** 七枚碎片 (GDD §7 碎片分布表) */
export type RuneId =
    | 'RUNE_01'  // 官网第17条评价孤悬回复（发现PHX-ALPHA）
    | 'RUNE_02'  // HTML源码注释（紫外线照符文）
    | 'RUNE_03'  // 折叠帖/影子档案（发现MED-0019）
    | 'RUNE_04'  // 林医生文章二锁定段（会议室场景）
    | 'RUNE_05'  // OA维护日志底部（进入B2层）
    | 'RUNE_06'  // Logo凝视/照片元数据（被捕前操作）
    | 'RUNE_07'; // 桌面日历 3月13日黑叉（给妈妈的话）

/** 结局类型 */
export type EndingType = 'A' | 'B' | 'C' | null;

/**
 * FactId — 事实驱动的进度标记 (GDD §4.1)
 * 每个 FactId 代表玩家「发现了某个事实」，
 * 后续内容的解锁以 FactId 为前置条件。
 */
export type FactId =
    // ─── 桌面阶段 ───
    | 'read_wechat_linxiao'         // 阅读了林晓微信对话
    | 'read_email_encrypted'        // 阅读了加密邮件
    | 'read_email_family'           // 阅读了父亲邮件
    | 'read_email_it_power'         // 阅读了B2耗电通知
    | 'read_medical_record'         // 翻看了门诊单
    | 'calendar_march13'            // 点击了日历3月13日
    // ─── 官网阶段 ───
    | 'visited_clinic_home'         // 访问了官网首页
    | 'found_review_17'             // 发现第17条孤悬回复
    | 'viewed_source_code'          // 查看了页面源代码
    | 'found_zq_comment'            // 发现赵启HTML注释
    | 'archive_query_lx044'         // 查询了LX-044-YIN档案
    | 'archive_query_taiyijiuku'    // 查询了TaiYiJiuKu
    | 'logo_stare_3s'               // LOGO凝视3秒
    | 'read_column_d1'              // 阅读林医生文章一
    | 'read_column_d2'              // 阅读林医生文章二
    | 'read_column_d3'              // 阅读林医生文章三
    | 'read_column_d4'              // 阅读林医生文章四
    | 'found_faq_forum_link'        // 在FAQ发现论坛链接
    | 'found_investor_meridian'     // 发现Meridian投资者异常
    | 'found_retracted_paper'       // 发现撤稿论文
    | 'news_8023_noticed'           // 注意到工号8023
    | 'news_password_rule'          // 阅读了密码规则第14条
    | 'news_oa_url'                 // 注意到赵启照片背景OA地址
    // ─── 论坛阶段 ───
    | 'forum_visited'               // 进入了论坛
    | 'forum_search_8023'           // 搜索了"8023"
    | 'forum_search_fswltz'         // 搜索/发现了"福生无量天尊"
    | 'employee_8023_known'         // 确认了赵启工号8023
    | 'forum_b3_expanded'           // 展开了B-3封禁帖
    | 'forum_b3_unlocked'           // 解锁了B-3帖子内容
    | 'forum_member_registered'     // 注册了论坛会员
    | 'forum_admin_logged_in'       // 登录了管理员面板
    | 'forum_found_shadow_path'     // 发现了影子档案路径
    | 'forum_shadow_accessed'       // 访问了影子档案
    // ─── OA阶段 ───
    | 'oa_logged_in'                // 登录了OA系统
    | 'oa_purchase_read'            // 阅读了采购单
    | 'oa_hr_read'                  // 阅读了人事档案
    | 'oa_maintenance_log_read'     // 阅读了维护日志
    | 'oa_b2_report_read'           // 阅读了B2运维报告
    | 'oa_photo_viewed'             // 查看了机柜照片
    | 'oa_photo_jiuku'              // 从照片发现JiuKu
    | 'oa_notebook_read'            // 阅读了赵启记事本
    // ─── 终局 ───
    | 'password_taiyi_found'        // 发现前半段密码TaiYi
    | 'password_jiuku_found'        // 发现后半段密码JiuKu
    | 'password_complete'           // 合并完整密码TaiYiJiuKu
    | 'ending_reached';             // 到达终局界面

/** 线索条目 */
export interface Clue {
    id: string;
    title: string;
    description: string;
    source: string;           // 来源描述
    discoveredAt?: number;     // 发现时间戳
}

/** 游戏存档数据 */
export interface SaveData {
    version: 4;
    currentView: AppView;
    facts: FactId[];
    clues: Clue[];
    collectedRunes: RuneId[];
    completedEndings: string[];
    forumLayer: ForumLayer;
    isOALoggedIn: boolean;
    timestamp: number;
}

/** 游戏上下文接口 */
export interface GameContextType {
    // ── 视图导航 ──
    currentView: AppView;
    setView: (view: AppView) => void;

    // ── 事实系统 ──
    facts: FactId[];
    addFact: (id: FactId) => void;
    hasFact: (id: FactId) => boolean;

    // ── 线索系统 ──
    clues: Clue[];
    addClue: (clue: Clue) => void;
    hasClue: (id: string) => boolean;

    // ── 碎片系统 ──
    collectedRunes: RuneId[];
    collectRune: (id: RuneId) => void;
    hasRune: (id: RuneId) => boolean;
    runeCount: number;
    linXiaoSignalStrength: number;

    // ── 论坛层级 ──
    forumLayer: ForumLayer;
    setForumLayer: (layer: ForumLayer) => void;

    // ── OA ──
    isOALoggedIn: boolean;
    setOALoggedIn: (v: boolean) => void;

    // ── 结局 ──
    completedEndings: string[];
    completeEnding: (id: string) => void;

    // ── 系统 ──
    resetGame: () => void;
}
