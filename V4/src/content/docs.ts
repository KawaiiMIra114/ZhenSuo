import gddRaw from '../../docs/GDD_ZhenSuo_Master.md?raw';
import worldRaw from '../../docs/ZhenSuo_WorldBible_Final.md?raw';

export type DocId = 'gdd' | 'world';

interface HeadingNode {
  level: number;
  title: string;
  line: number;
}

export interface DocSection {
  title: string;
  level: number;
  content: string;
}

function parseHeadings(raw: string): HeadingNode[] {
  const lines = raw.split(/\r?\n/);
  const nodes: HeadingNode[] = [];
  for (let i = 0; i < lines.length; i += 1) {
    const m = lines[i].match(/^(#{1,6})\s+(.*)$/);
    if (!m) continue;
    nodes.push({
      level: m[1].length,
      title: m[2].trim(),
      line: i
    });
  }
  return nodes;
}

function extractSection(raw: string, headingTitle: string): DocSection | null {
  const lines = raw.split(/\r?\n/);
  const headings = parseHeadings(raw);
  const idx = headings.findIndex((h) => h.title === headingTitle);
  if (idx < 0) return null;
  const current = headings[idx];

  let endLine = lines.length;
  for (let i = idx + 1; i < headings.length; i += 1) {
    if (headings[i].level <= current.level) {
      endLine = headings[i].line;
      break;
    }
  }

  const content = lines.slice(current.line + 1, endLine).join('\n').trim();
  return {
    title: current.title,
    level: current.level,
    content
  };
}

export function getDocRaw(doc: DocId): string {
  return doc === 'gdd' ? gddRaw : worldRaw;
}

export function getDocSection(doc: DocId, title: string): DocSection | null {
  return extractSection(getDocRaw(doc), title);
}

export function listDocHeadings(doc: DocId): HeadingNode[] {
  return parseHeadings(getDocRaw(doc));
}

export function getDocSections(doc: DocId, titles: string[]): DocSection[] {
  return titles
    .map((title) => getDocSection(doc, title))
    .filter((x): x is DocSection => x !== null);
}

export interface RouteCanonMapping {
  gdd?: string[];
  world?: string[];
}

export function getRouteCanon(pathname: string): RouteCanonMapping {
  const map: Array<{ match: (p: string) => boolean; data: RouteCanonMapping }> = [
    {
      match: (p) => p === '/',
      data: {
        gdd: ['3.2 桌面：三个已打开的窗口', '3.3 入口触发点'],
        world: ['4.5 林浩——玩家']
      }
    },
    {
      match: (p) => p.startsWith('/clinic'),
      data: {
        gdd: [
          '4.1 官网的整体设计原则',
          '4.2 官网完整内容清单',
          '4.3 官网的HTML源码（关键线索）',
          '4.4 官网Logo的秘密',
          '4.5 林医生专栏四篇文章'
        ],
        world: ['八、四篇文章的完整设计', '十二、世界运转的几个细节']
      }
    },
    {
      match: (p) => p.startsWith('/forum'),
      data: {
        gdd: [
          '5.1 论坛的整体感觉',
          '5.3 论坛第零层：公开内容',
          '5.4 论坛第一层：折叠内容',
          '5.5 论坛第二层：会员专区',
          '5.6 论坛第三层：管理员面板',
          '5.7 论坛第四层：影子档案'
        ],
        world: ['七、每一条内容住在哪里，为什么']
      }
    },
    {
      match: (p) => p.startsWith('/oa'),
      data: {
        gdd: ['6.1 如何知道OA系统存在', '6.2 如何获得OA登录凭据', '6.3 OA系统完整内容'],
        world: ['第五层：OA系统（内部日常运营）']
      }
    },
    {
      match: (p) => p.startsWith('/ending'),
      data: {
        gdd: ['8.1 终局入口', '8.2 终局选择界面', '8.3 结局A：烈火洗城', '8.4 结局B：上行替代', '8.5 结局C：七星破阵（仅碎片全齐时可见）'],
        world: ['十、三个选项，三种代价', '十三、三条不可逾越的底线']
      }
    },
    {
      match: (p) => p.startsWith('/world'),
      data: {
        gdd: ['9.1 这一层的存在意义', '9.2 外部世界内容清单'],
        world: ['十一、那些与诊所没有直接关联的人留下的痕迹']
      }
    }
  ];

  for (const item of map) {
    if (item.match(pathname)) return item.data;
  }
  return {};
}
