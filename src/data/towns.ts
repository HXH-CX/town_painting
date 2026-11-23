import type { Town } from './types'

export const TOWNS: Town[] = [
  {
    slug: 'zhenhe',
    name: '枕河镇',
    tagline: '河道穿过镇子的年月',
    dossier: '先有河,后有桥,再后来,才有了在桥上停留的人。',
    palette: ['#2b3a42', '#8a6d3b'],
    audio: 'audio/zhenhe.mp3',
    cover: {
      slug: 'overview',
      name: '枕河镇全景',
      hotspots: [
        { id: 'to-bridge', label: '石桥码头', x: 0.17, y: 0.48, to: 'bridge' },
        { id: 'to-lane', label: '茶馆老巷', x: 0.8, y: 0.42, to: 'lane' },
      ],
    },
    streets: [
      {
        slug: 'bridge',
        name: '石桥码头',
        hotspots: [
          { id: 'bridge-moon', label: '桥拱', x: 0.3, y: 0.4, story: { title: '桥拱月色', body: '桥拱把月色分成两半——一半给河,一半给赶路的人。' } },
          { id: 'bridge-boat', label: '乌篷船', x: 0.42, y: 0.72, story: { title: '乌篷船', body: '船娘的橹声很轻,轻得像怕吵醒水里的倒影。' } },
          { id: 'bridge-steps', label: '码头石阶', x: 0.78, y: 0.62, story: { title: '码头石阶', body: '石阶被脚步磨圆了棱角,却还记得每一场涨水。' } },
        ],
      },
      {
        slug: 'lane',
        name: '茶馆老巷',
        hotspots: [
          { id: 'lane-tea', label: '茶馆', x: 0.82, y: 0.5, story: { title: '凉茶三巡', body: '茶凉了三次,话题才从今年的雨,讲到三十年前。' } },
          { id: 'lane-lantern', label: '檐下灯笼', x: 0.86, y: 0.16, story: { title: '檐下灯笼', body: '灯笼亮起来的时候,整条巷子都往暖处靠了靠。' } },
        ],
      },
    ],
  },
  {
    slug: 'shiomi',
    name: '汐见町',
    tagline: '坡尽头的海',
    dossier: '坡道一阶阶走完,海就在眼前铺开。',
    palette: ['#1f3a5f', '#e08a4c'],
    audio: 'audio/shiomi.mp3',
    cover: {
      slug: 'overview',
      name: '汐见町全景',
      hotspots: [
        { id: 'to-slope', label: '坂道商店街', x: 0.47, y: 0.62, to: 'slope' },
        { id: 'to-seawall', label: '海堤电车路', x: 0.84, y: 0.4, to: 'seawall' },
      ],
    },
    streets: [
      {
        slug: 'slope',
        name: '坂道商店街',
        hotspots: [
          { id: 'slope-chime', label: '风铃', x: 0.33, y: 0.14, story: { title: '风铃与收摊', body: '傍晚六点,风铃和收摊的木板声一起响。' } },
          { id: 'slope-vending', label: '坡顶的灯', x: 0.7, y: 0.55, story: { title: '坡顶的灯', body: '自动贩卖机亮着,是这条坡道上最晚熄的星。' } },
          { id: 'slope-cat', label: '第七级台阶', x: 0.34, y: 0.68, story: { title: '猫与台阶', body: '猫占住了第七级台阶,那是全镇看海最好的位置。' } },
        ],
      },
      {
        slug: 'seawall',
        name: '海堤电车路',
        hotspots: [
          { id: 'seawall-sunset', label: '海面', x: 0.78, y: 0.6, story: { title: '最后一格夕阳', body: '电车驶过时,海面刚好装下最后一格夕阳。' } },
          { id: 'seawall-rod', label: '防波堤', x: 0.84, y: 0.78, story: { title: '防波堤的钓竿', body: '钓竿弯成一个问号,答案要等潮水来写。' } },
        ],
      },
    ],
  },
  {
    slug: 'zhongya',
    name: '钟崖堡',
    tagline: '建在石头上的城',
    dossier: '钟声比人先醒,石阶比路更老。',
    palette: ['#4a4a45', '#c9b48a'],
    audio: 'audio/zhongya.mp3',
    cover: {
      slug: 'overview',
      name: '钟崖堡全景',
      hotspots: [
        { id: 'to-plaza', label: '钟楼石阶广场', x: 0.45, y: 0.65, to: 'plaza' },
        { id: 'to-riverside', label: '河岸旧城巷', x: 0.2, y: 0.78, to: 'riverside' },
      ],
    },
    streets: [
      {
        slug: 'plaza',
        name: '钟楼石阶广场',
        hotspots: [
          { id: 'plaza-bell', label: '钟楼', x: 0.22, y: 0.25, story: { title: '鸽子与钟声', body: '钟声落下之前,鸽子先绕着石阶飞了一圈。' } },
          { id: 'plaza-steps', label: '石阶', x: 0.45, y: 0.85, story: { title: '石阶的凹痕', body: '每一级凹陷,都是几百年脚步的签名。' } },
          { id: 'plaza-fountain', label: '喷泉', x: 0.57, y: 0.62, story: { title: '喷泉', body: '喷泉把阳光揉碎,再一枚枚还给广场。' } },
        ],
      },
      {
        slug: 'riverside',
        name: '河岸旧城巷',
        hotspots: [
          { id: 'riverside-laundry', label: '晾衣绳', x: 0.6, y: 0.25, story: { title: '晾衣绳', body: '白衬衫在风里鼓掌,为对岸某扇窗的打开。' } },
          { id: 'riverside-books', label: '旧书摊', x: 0.3, y: 0.8, story: { title: '旧书摊', body: '摊主说,书里的海比河宽,价钱却一样。' } },
        ],
      },
    ],
  },
]

export function getTown(slug: string): Town | undefined {
  return TOWNS.find((t) => t.slug === slug)
}