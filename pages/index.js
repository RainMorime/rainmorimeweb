import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import CustomCursor from '../components/CustomCursor';
import HomeLoadingScreen from '../components/HomeLoadingScreen';
import ShinyText from '../components/ShinyText';
import VerticalShinyText from '../components/VerticalShinyText';
import RainMorimeEffect from '../components/RainMorimeEffect';
import styles from '../styles/Home.module.scss';
import React from 'react';
import ProjectCard from '../components/ProjectCard';
import Noise from '../components/Noise';
import TesseractExperience from '../components/TesseractExperience';
import ActivationLever from '../components/ActivationLever';
import MusicPlayer from '../components/MusicPlayer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import SimpleImageCard from '../components/SimpleImageCard';
import LifeDetailView from '../components/LifeDetailView';
import WorkDetailView from '../components/WorkDetailView';
import ExperienceDetailView from '../components/ExperienceDetailView';
import BlogView from '../components/BlogView';
import BlogDetailView from '../components/BlogDetailView';

// --- ADD Import for favicon --- 
import favicon from '../assets/RM.jpg'; 

gsap.registerPlugin(ScrollTrigger);

// --- Split Projects Data ---
const learnProjects = [
  {
    id: 1,
    title: '小狐狸/Robby复刻',
    description: 'Unity3D C# 平台跳跃',
    tech: ['Unity3D', 'C#', '平台跳跃'],
    link: '#',
    imageUrl: '/images/projects/robby/RB0.png', // <-- Update cover image
    galleryImages: [ 
      { src: '/images/projects/robby/RB0.png' }, // <-- Add new cover to gallery start
      { src: '/images/projects/fox/fox1.png' },
      { src: '/images/projects/fox/fox2.png' },
      { src: '/images/projects/fox/fox3.png' },
      { src: '/images/projects/fox/fox4.png' },
      { src: '/images/projects/robby/RB1.png' },
      { src: '/images/projects/robby/RB2.png' }
    ],
    // --- FIX and ADD articleContent using template literal ---
    articleContent: `
这两个小Demo是我大一学习 M_Studio老师的课程制作的 [M_Studio老师的空间](https://space.bilibili.com/370283072)

还有两份笔记（写的零碎见谅）
    `
    // --- END FIX and ADD ---
  },
  {
    id: 2,
    title: 'FreeCodeCamp前端作品集',
    description: 'HTML/CSS',
    tech: ['HTML', 'CSS', '前端'],
    link: '#',
    imageUrl: '/images/projects/freecode/freecode.png', // <-- UPDATE imageUrl
    // --- ADD articleContent --- 
    articleContent: '[你可以在这里看到我的练习作品集](https://www.freecodecamp.org/certification/RainMorime/responsive-web-design)\n\n我从这里学到了一些前端知识。',
    // --- END ADD --- 
    galleryImages: [ // <-- ADD galleryImages
       { src: '/images/projects/freecode/freecode.png' }
    ]
  },
  {
    id: 3,
    title: '2024Unity3D开发大赛',
    description: 'Unity3D 卡牌',
    tech: ['Unity3D', '卡牌', '游戏开发'],
    link: '#',
    imageUrl: '/images/projects/2024unity/gm2.png', // <-- UPDATE imageUrl
    // --- ADD galleryImages --- 
    galleryImages: [
      { src: '/images/projects/2024unity/gm1.png' },
      { src: '/images/projects/2024unity/gm2.png' },
      { src: '/images/projects/2024unity/gm3.png' }
    ],
    // --- END ADD ---
    // --- ADD articleContent --- 
    articleContent: `
GameJam主题: It Never Ends

一名复赌的赌徒，这一次为了满足自己的无穷无尽的贪欲，抛弃了过往，家庭，梦想，肉体以及灵魂，踏入了没有终局的赌局

这是我第一次参加gamejam独立制作的一款游戏，玩法很简单，对于我来说也是一种尝试吧，中途有很多不成熟的地方，其实一开始是想做俯视2D类幸存者的，不过总感觉难切题，快结束的时候推翻重来了。

如果你感兴趣，可也看我的视频 [赌徒](https://www.bilibili.com/video/BV1NJCHYQEW6)
    `
    // --- END ADD ---
  },
  {
    id: 4,
    title: '塔罗寻途 清深AI agent 开发比赛',
    description: 'Unity3D AI',
    tech: ['Unity3D', 'AI', '游戏开发'],
    link: '#',
    imageUrl: '/images/projects/aiagent/AG1.jpg',
    // --- ADD galleryImages --- 
    galleryImages: [
      { src: '/images/projects/aiagent/AG1.jpg' },
      { src: '/images/projects/aiagent/AG2.png' },
      { src: '/images/projects/aiagent/AG3.png' }
    ],
    // --- END ADD ---
    // --- ADD articleContent --- 
    articleContent: `
"迷路的旅人徘徊在未知的岔路口，恍惚间，一位神秘的占卜师现身，为旅人抽取命运的塔罗牌。通过占卜师的指引和谜题的解密，旅人逐步拼凑出回家的方向。在塔罗牌的指示中，旅人用智慧与直觉寻找正确的路径，直至命运的终点，终于找到了回家的路。"

玩家需要通过上下左右四个方向按钮破解随机生成的密码。

每局游戏都会生成一组由四个方向组成的答案，例如"上 上 左 右"。

玩家需要按照顺序点击按钮输入答案，并点击提交按钮验证。如果答案正确，便可成回到家中。

一个利用AI制作游戏的开发比赛，在这里我学习了如何将Agent融入游戏的方法，你可以用AI设定游戏规则，也可以作为一个NPC，还可以从模型中藏入通关的线索。对我未来的游戏注入更多的可能。
    `
    // --- END ADD ---
  },
];

const workProjects = [
  {
    id: 5,
    title: '营火MC服务器',
    description: '策划',
    tech: ['Minecraft', '服务器', '策划'],
    link: '#',
    imageUrl: '/images/projects/campfire/yh0.jpg', // <-- UPDATE imageUrl
    // --- ADD articleContent --- 
    articleContent: `
我在这个服务器中参与了武器和怪物的策划。

也在这里结识了很多有趣又厉害的人，是Minecraft十多年的生涯中的重大的节点。

也欢迎你来到服务器，版本1.20.1，地址：play.foacraft.com，原版也可以进入，当然你也可以加入QQ群：481423636，使用我们的整合包，这里有很多友好的朋友，他们会带你上手服务器。

玩法有点像剑与魔法的搜打撤，在群岛之间和玩家组队挑战BOSS，有自由的锻造装备，自定义属性成长曲线，可以打包票的说玩法是非常创意有新颖的，希望你玩得愉快。
    `,
    // --- END ADD ---
    // --- ADD galleryImages --- 
    galleryImages: [
      { src: '/images/projects/campfire/yh0.jpg' }, // <-- ADD yh0
      { src: '/images/projects/campfire/yh.jpg' },  // <-- ADD yh.jpg
      { src: '/images/projects/campfire/yh1.jpg' }
    ]
    // --- END ADD ---
  },
  {
    id: 6,
    title: 'Koishi机器人插件',
    description: 'TypeScript/JavaScript',
    tech: ['TypeScript', 'JavaScript', 'Koishi', '插件开发'],
    link: '#',
    imageUrl: '/images/koishi/koishi.png', // <-- UPDATE imageUrl
    // --- ADD articleContent and galleryImages ---
    articleContent: `
我通过koishi框架使用TypeScript制作了两个插件
\n我还搭建了自己的腾讯官方Bot

一个是[高度自定义抽奖插件](https://github.com/RainMorime/customdraws)（带有哈希算法，加权，自定义时段，人物，物品）\n\n一个是[营火服务器插件](https://github.com/RainMorime/campfire)（包括图鉴，自由组合装备，烹饪，抽卡，模拟上岛小游戏，文字小游戏等等等等）
    `,
    galleryImages: [
      { src: '/images/koishi/koishi.png' }
    ]
    // --- END ADD ---
  },
  {
    id: 7,
    title: '个人网站',
    description: 'Next.js, React, SCSS',
    tech: ['Next.js', 'React', 'SCSS'], // <-- REMOVE 'Vercel'
    link: '#',
    imageUrl: '/images/projects/web/wb1.png', 
    // --- ADD galleryImages --- 
    galleryImages: [
      { src: '/images/projects/web/wb0.jpg' }, // <-- ADD wb0.jpg to the beginning
      { src: '/images/projects/web/wb1.png' },
      { src: '/images/projects/web/wb2.png' },
      { src: '/images/projects/web/wb3.png' },
      { src: '/images/projects/web/wb4.png' },
      { src: '/images/projects/web/wb5.png' },
      { src: '/images/projects/web/wb6.png' }
    ],
    // --- END ADD ---
    // --- ADD articleContent --- 
    articleContent: `
对于我来说，个人网站就像自己的秘密基地吧，所以也是花费了一个多月的时间把他搭建了起来，在这里无论怎么诉说自己的辛酸还是喜悦都不会感到羞耻，就如我的签名一样，你来到了这里，我们的命运就与此刻相会纠缠。

我曾经也用WordPress搭建过自己的网站，不过时间还有技术上的原因没有沿用下来。后来系统学习了前端知识，也是下定决心做一个自己的网站。

这个网站项目使用了 HTML/SCSS 还有GSAP动画库、Three.js3D引擎

我还为网站设计了一个世界观，一个小彩蛋，或许晚点可以把它做成游戏，不过是后话了。

一些网站旧设
    `
    // --- END ADD ---
  }
];


const gameData = [
  {
    id: 'mc',
    title: 'Minecraft',
    description: '我的启蒙，也愿成为我的始终。',
    tech: ['沙盒', '生存', '建造'],
    link: '#',
    imageUrl: '/pictures/Minecraft/MC2025.png',
    articleContent: '  Minecraft来来去去有了十年，从最早的 1.5.4 版本开始，就贯穿了我的游戏生涯，如今也有十多个年头了。\n \n  还记得小时候（大概是小学二三年级吧）在 XP 电脑上，为了能正常启动它费尽了功夫，还记得需要调整硬件加速之类的东西。当时花了了好几周的时间，查资料又是反复下载的，那段时间简直把互联网基础知识都学全了。\n\n  印象深刻的是一个叫"贪婪整合包"，是在我初三开始玩的，每次启动就要一个小时，每天得早早开机先加载，然后才去洗漱。为了一个mod的知识艰难查找资料（当时的mod教程很难，资源也非常少，全靠自己摸索），玩到了高考结束才把他通关，也是在那时得到了很多信息检索的经验还有提问的智慧。\n\n  一路走来，在这个世界里我总是无忧无虑，也结识了许多朋友：2016 年加入了 NiceMc 服务器，认识了很多伙伴；2023 年又加入了营火服务器，这些都是我 MC 旅程中重要的节点。\n  期间也尝试过地图和模组的开发，高二那段时间，每天晚上都捧着那本Java从入门到入土生啃，绊绊磕磕的做出了自己的一个小mod，后来高三学业繁重就停止了更新，虽然找不到原先的代码了，不过想做出新游戏开发新内容的愿景倒是深植入我心中。\n\n  愿我们初心不改，童心依旧。'
  },
  {
    id: 'wa',
    title: 'WHITE ALBUM',
    description: '广场协议后的泡沫与追忆，让我写了第一份长评',
    tech: ['视觉小说', '恋爱', '音乐'],
    link: '#',
    imageUrl: '/pictures/WHITE_ALBUM/w10.jpg',
    // Add article content for WHITE ALBUM
    articleContent: '  转眼又到了白色相簿的季节了。\n\n\n  少见地把这部作品的游戏、动漫、漫画都完整体验了一遍。总体来说，个人感受的质量排序是：动漫 > 游戏 > 漫画。漫画虽也不错，但篇幅所限，许多情节未能充分展开便匆匆结束。\n\n\n  故事背景设定在日本签订广场协议后的时代，讲述了一名普通青年藤井冬弥，在成为偶像的女友森川由绮身边所经历的奔赴与追忆。故事中弥漫着白雪般的清寒与苦涩，情感如泡沫般易碎，似幻影般迷离。冬弥与由绮在高中结为恋人，但当由绮踏上偶像之路后，两人的人生轨迹便注定渐行渐远，难以相交。与其他多数恋爱游戏不同，《WHITE ALBUM》开篇时，"恋人"就已是由绮，因此玩家选择任何其他角色的线路，都似乎伴随着一种"背离"感（甚至在由绮本线中，出轨的主体有时反而是由绮自己）。\n\n\n  在这个清冷又略带压抑的环境里，似乎每个人心中都缺失了一角，而冬弥恰好能填补这份空缺——无论是多年求而不得的学姐观月麻奈，青梅竹马且痛失亲兄的河岛遥，缺少父母关爱的泽仓美咲，还是活在哥哥阴影下的绪方理奈，甚至是倾慕由绮、带着禁断之恋寻求慰藉的制作人筱冢弥生。游戏中，无论选择哪条线路，是软弱还是释怀，由绮似乎总会原谅冬弥。即便她自己可能随时会因失去冬弥而崩溃，却仍会虔诚地祈愿冬弥的幸福。与由绮形成鲜明对比的是理奈，她愿意牺牲自己的偶像事业，只为换取与冬弥的比翼双飞。\n\n\n  或许由绮并非不重视冬弥，只是在那个连座机电话都算奢侈品的时代，距离产生的漫长疑虑和日渐稀疏的沟通，为二人的"白色相簿"蒙上了厚厚的尘埃。心意在模糊中摇摆，那份果断也变得软弱。圣诞节、情人节仅有的几句交谈，让所有想说的话都成了未竟之弦。在这道不清、辩不明的白雪映衬下，两人似乎注定渐行渐远。（恰如"音书断绝，春闺梦里，相思难解"）\n\n\n  重制版新增的小夜子线，感觉反而更契合冬弥的处境。经历了偶像事业与高考双重失利的小夜子，与同样迷失在情感迷宫中的冬弥相互依偎取暖。可惜结局稍显仓促，未能深入描绘后续发展，留下了些许遗憾（结尾甚至没有明确的表示，更像是和大家都维持了友人关系）。\n\n\n  更令人感到压抑的是，游戏中许多局面近乎无解，除非玩家扮演圣人。选择往往导向某种形式的"社会性死亡"（如与基友七濑彰决裂，或选择已分手的学姐麻奈），或是走向充满不确定性的未来（如经纪人弥生线、遥线）。错误与误会在剧情中交替上演，任何一点逃避都会催化弥漫其中的不甘与苦涩，最终伴随着经济大衰退的最后一片雪花，凝结成难以抹去的伤痕。（不过，单就结局而言，多数线路也算得上是某种形式的 Happy Ending）。\n\n\n  而动漫则将多条线路融合，使得主角藤井冬弥的行为更具争议性（甚至被戏称为"四大人渣"之一），从某种意义上说，是对一人的背离"升级"为了对多人的摇摆。动画在细节刻画和艺术表现上更为出色，无论是冬弥自圆其说的"女神论"，还是绪方英二所追求的"真物"，都探讨了更深层次的内涵，压抑的情绪也渲染得更为强烈。\n\n\n  游戏和动漫中，基友七濑彰的形象反差极大。原作中他更像个清秀的伙伴，而在动漫里，出于对学姐麻奈的爱慕（原作亦有此设定），他屡次与冬弥产生冲突。动画中甚至加入了学姐设计与冬弥（当时女友是由绮）表白接吻、冬弥事后又试图撮合学姐与基友、学姐却仍心系冬弥最终拒绝基友等更为纠结的剧情。动画增补了许多设定，例如由绮和冬弥的童年相识（尽管那段用特殊方式驱赶坏人的回忆过于羞耻以致冬弥遗忘），更深刻地描绘了一个年轻人在社会洪流中逐渐迷失本心，在形形色色的情感中沉沦的过程。\n\n\n  由于动画只有一个结局，其编排也最为精妙和富于戏剧性。冬弥思考了漫长的篇幅去确认由绮是否还爱他、是否会等他，而由绮甚至无需回答——因为别说几个月，由绮已经等待了他十年。彼时，在舞台上与冬弥相视的那一瞬，跨越时光的追忆交汇，将"白色相簿"的故事推向了真正的高潮。\n\n\n  而这份复杂的情感体验，也自然地引向了续作——《WHITE ALBUM 2》。',
    galleryImages: [
      { src: '/pictures/WHITE_ALBUM/w1.jpg' },
      { src: '/pictures/WHITE_ALBUM/w2.jpg' },
      { src: '/pictures/WHITE_ALBUM/w3.jpg' },
      { src: '/pictures/WHITE_ALBUM/w4.jpg' },
      { src: '/pictures/WHITE_ALBUM/w5.jpg' },
      { src: '/pictures/WHITE_ALBUM/w6.jpg' },
      { src: '/pictures/WHITE_ALBUM/w7.jpg' },
      { src: '/pictures/WHITE_ALBUM/w8.jpg' },
      { src: '/pictures/WHITE_ALBUM/w9.jpg' },
      { src: '/pictures/WHITE_ALBUM/w10.jpg' },
      { src: '/pictures/WHITE_ALBUM/w11.jpg' },
      { src: '/pictures/WHITE_ALBUM/w12.jpg' },
      { src: '/pictures/WHITE_ALBUM/w13.jpg' },
      { src: '/pictures/WHITE_ALBUM/w14.jpg' },
      { src: '/pictures/WHITE_ALBUM/w15.jpg' },
      { src: '/pictures/WHITE_ALBUM/w16.jpg' },
      { src: '/pictures/WHITE_ALBUM/w17.jpg' },
      { src: '/pictures/WHITE_ALBUM/w18.jpg' },
      { src: '/pictures/WHITE_ALBUM/w19.jpg' },
      { src: '/pictures/WHITE_ALBUM/w20.jpg' },
      { src: '/pictures/WHITE_ALBUM/w21.jpg' },
    ]
  },
  {
    id: 'stray',
    title: 'Stray',
    description: '在赛博朋克城市中扮演一只猫。',
    tech: ['冒险', '解谜', '猫'],
    link: '#',
    imageUrl: '/pictures/Stray/stray15.jpg',
    articleContent: '  腐败，死城，时代，地下城\n  同伴，穹顶，梦想，机器人\n  阶级的腐败弥留的饕餮怪物，若隐若现的霓虹灯光\n  亲情的重逢，自由的渴望\n\n  空无一人，却到处闪耀着人性的光辉。\n  不过咱都不在乎\n\n  "咱家是猫。名字？还没有。出生在哪儿？更搞不清楚。"\n  ——《我是猫》，夏目漱石',
    galleryImages: [
      { src: '/pictures/Stray/stray1.jpg' },
      { src: '/pictures/Stray/stray2.jpg' },
      { src: '/pictures/Stray/stray3.jpg' },
      { src: '/pictures/Stray/stray4.jpg' },
      { src: '/pictures/Stray/stray5.jpg' },
      { src: '/pictures/Stray/stray6.jpg' },
      { src: '/pictures/Stray/stray7.jpg' },
      { src: '/pictures/Stray/stray8.jpg' },
      { src: '/pictures/Stray/stray9.jpg' },
      { src: '/pictures/Stray/stray10.jpg' },
      { src: '/pictures/Stray/stray11.jpg' },
      { src: '/pictures/Stray/stray12.jpg' },
      { src: '/pictures/Stray/stray13.jpg' },
      { src: '/pictures/Stray/stray14.jpg' },
      { src: '/pictures/Stray/stray15.jpg' },
      { src: '/pictures/Stray/stray16.jpg' } // <-- ADD stray16
    ]
  },
  {
    id: 'thif',
    title: 'Touhou',
    description: '东方的同人总是令人惊叹。',
    tech: ['东方Project', '动作', '粉丝创作'],
    link: '#',
    imageUrl: '/pictures/Touhou/TH3.png',
    // --- ADD Touhou Article --- 
    articleContent: '  对于东方来说，我了解并不是很多，但优质的同人还有游戏深深吸引了我。\n\n\n  我玩过《东方冰之勇者记》《东方夜雀食堂》《东方大战争》《东方幻灵录》\n\n\n  《东方冰之勇者记》也是我第一个真正意义上的全成就，耐心无伤打完了每一个boss',
    // --- END ADD ---
    galleryImages: [
      { src: '/pictures/Touhou/CG1.png' }, // <-- Add CG1 if not present
      { src: '/pictures/Touhou/CG2.png' },
      { src: '/pictures/Touhou/CG3.png' },
      { src: '/pictures/Touhou/TH1.jpg' },
      { src: '/pictures/Touhou/TH2.jpg' },
      { src: '/pictures/Touhou/TH3.png' },
      { src: '/pictures/Touhou/TH4.jpg' },
      { src: '/pictures/Touhou/TH5.jpg' },
      { src: '/pictures/Touhou/TH6.jpg' },
    ]
  },
   {
    id: 'titanfall',
    title: 'Titanfall',
    description: '第一次酣畅淋漓的体验。',
    tech: ['FPS', '机甲'],
    link: '#',
    imageUrl: '/pictures/Titalfall/titan13.jpg',
    // --- ADD Titanfall Article --- 
    articleContent: '协议三，投掷铁驭！\n\n相信我！',
    // --- END ADD ---
    galleryImages: [
      { src: '/pictures/Titalfall/titan1.jpg' },
      { src: '/pictures/Titalfall/titan2.jpg' },
      { src: '/pictures/Titalfall/titan4.jpg' },
      { src: '/pictures/Titalfall/titan5.jpg' },
      { src: '/pictures/Titalfall/titan7.jpg' },
      { src: '/pictures/Titalfall/titan8.jpg' },
      { src: '/pictures/Titalfall/titan9.jpg' },
      { src: '/pictures/Titalfall/titan10.jpg' },
      { src: '/pictures/Titalfall/titan11.jpg' },
      { src: '/pictures/Titalfall/titan12.jpg' },
      { src: '/pictures/Titalfall/titan13.jpg' },
    ]
  },
  {
    id: 'bmwk',
    title: 'BLACK MYTH: WU KONG',
    description: '备受期待的国产3A。',
    tech: ['ARPG', '神话', '动作'],
    link: '#',
    imageUrl: '/pictures/BLACKMYTH/WK3.jpg',
    // --- ADD Wukong Article --- 
    articleContent: '  《黑神话：悟空》是我期盼许久的作品。能够第一时间体验到这部备受瞩目的国产3A大作，心情无疑是激动万分的。虽然我相对较少涉足纯粹的动作游戏领域，但那种通过磨练技巧、攻克难关最终获得的酣畅淋漓的成就感，对我有着难以抗拒的吸引力。\n\n\n  为了第一时间玩上游戏，我早上七八点就兴冲冲地赶到了网吧，却没想到还要等好长时间——网吧的机械硬盘解压游戏竟然耗费了足足一个小时。直到将近十一点，我才终于进入了游戏。\n\n\n  然而，真正的挑战才刚开始。面对第一个Boss黄风大圣，我打了快一下午。鏖战许久后我才发现，自己从头到尾根本没拿法宝纯硬扛。\n\n\n  这场艰难的战斗一直持续到凌晨三点多。本想上传录制的视频，结果网吧缓慢的上传速度又将时间拖到了四点。出门发现外面下起了大雨，没带伞的我只能一路跑回家，淋了个透湿。而且手机也早就没电关机。\n\n\n  站在家门口，面对电子锁，我发现自己还忘记了密码...在门口苦思冥想了半个多小时无果，累的不行的我直接就在门口蹲着睡了一会儿。等醒的时候，我又冒着雨四处寻找能充电的地方，最终幸运地找到一位出租车司机帮我充了会儿电。手机亮起的瞬间，密码也奇迹般地回到了脑海，这场折腾的夜晚才终于画上了句号。\n\n\n  虽然过程充满波折，但这无疑是一次极其深刻而难忘的游戏初体验。\n\n\n',
    // --- END ADD ---
    galleryImages: [
      { src: '/pictures/BLACKMYTH/WK0.jpg' },
      { src: '/pictures/BLACKMYTH/WK1.jpg' },
      { src: '/pictures/BLACKMYTH/WK2.jpg' },
      { src: '/pictures/BLACKMYTH/WK3.jpg' },
      { src: '/pictures/BLACKMYTH/WK4.jpg' },
      { src: '/pictures/BLACKMYTH/WK5.jpg' },
      { src: '/pictures/BLACKMYTH/WK6.jpg' },
      { src: '/pictures/BLACKMYTH/WK7.jpg' },
      { src: '/pictures/BLACKMYTH/WK8.jpg' },
      { src: '/pictures/BLACKMYTH/WK9.jpg' },
      { src: '/pictures/BLACKMYTH/WK10.jpg' },
    ]
  },
  {
    id: 'mh',
    title: 'Monster Hunter',
    description: '我动作游戏的引路人。',
    tech: ['动作', '狩猎', '多人'],
    link: '#',
    imageUrl: '/pictures/Monster_Hunter/MH1.jpg',
    articleContent: '  我算是一个新猎人，基本只用弓箭，只玩过《Monster Hunter: Wild》《Monster Hunter: RISE》《Monster Hunter: World》这三部作品，让我影响深刻的还是世界这一步，也算是我接触到的第一个动作类作品。\n\n\n  虽说是一个共斗游戏，但绝大多数时间我都在一个人拿着我的小弓箭滑滑戳戳。非常喜欢的就是挑战大只怪的节奏，三次猫车的机会让我没有魂游那样给我极大的挫败感，还有在拉锯战中一点一点削弱和追击巨龙的快感，庞大的世界观也让我有更多丰富的想象（一想到全团都指着我苍蓝星开荒，就抬起了我骄傲的头颅）。\n\n\n  让我印象深刻的传奇冰牙龙，为了一只怪刷了整整三天的装备，做梦都是冰牙龙一个甩尾加肘击给我干翻二里地。还有冰呪龙，优雅强大的艺术品，感觉要被开发出奇怪的属性了（）。',
    galleryImages: [
      { src: '/pictures/Monster_Hunter/MH1.jpg' },
      { src: '/pictures/Monster_Hunter/MH2.jpg' },
      { src: '/pictures/Monster_Hunter/MH3.jpg' },
      { src: '/pictures/Monster_Hunter/MH4.jpg' },
      { src: '/pictures/Monster_Hunter/MH5.jpg' },
      { src: '/pictures/Monster_Hunter/MH6.jpg' },
      { src: '/pictures/Monster_Hunter/MH7.jpg' },
      { src: '/pictures/Monster_Hunter/MH8.jpg' },
      { src: '/pictures/Monster_Hunter/MH9.jpg' },
      { src: '/pictures/Monster_Hunter/MH10.jpg' },
      { src: '/pictures/Monster_Hunter/MH11.jpg' },
      { src: '/pictures/Monster_Hunter/MH12.jpg' },
      { src: '/pictures/Monster_Hunter/MH13.jpg' },
      { src: '/pictures/Monster_Hunter/MH14.jpg' }
    ]
  },
];

const travelData = [
  {
    id: 'jilin',
    title: '吉林',
    description: '我出生的地方，我的故乡。', // Example description
    tech: ['故乡'], // Example tags
    link: '#', // Optional link
    imageUrl: '/images/travel/jilin/JL1.jpg', // Placeholder image path
    // --- ADD Jilin Article Content --- 
    articleContent: '  吉林省公主岭市，小时候是归四平市的，长大了划归给长春。我出生在这里，但在四平长大，我很小的时候，爸妈就去韩国务工，是我的姑姑照顾我长大，对我来说，她就是我的第二个母亲。\n\n\n  还有我的爷爷（准确来说，是我表姐的爷爷，我的爷爷奶奶姥姥姥爷都在我出生前或是很小的时候离世了。），苍发花眉，爱抽烟。当时我小学的时候还玩上烟卡（把烟盒的头叠成一个小卡片），爷爷就主动抽各种不同的烟让我做烟卡玩。我当时还劝爷爷少抽点烟，对身体不好，结果一语成谶，在初中时爷爷患上肺癌，仅仅几个月就夺走了他的生命。\n\n\n  回想起来，当时家人还瞒着我爷爷患病这件事，在我的追问下才说出来实情。面对注射吗啡才能缓解痛苦的爷爷，我泣不成声，第一次对死亡有了概念。\n\n\n  后来高考那年，我的姑姑因乳腺癌离世，我也遗憾落榜离开故乡，选择了遥远的西安。\n\n\n  故地新时，你随时可以回去，但已经没有人在等你了。',
    // --- END ADD ---
    // Add gallery images for Jilin
    galleryImages: [
      { src: '/images/travel/jilin/JL1.jpg' },
      { src: '/images/travel/jilin/JL2.jpg' },
      { src: '/images/travel/jilin/JL3.jpg' },
      { src: '/images/travel/jilin/JL4.jpg' },
      { src: '/images/travel/jilin/JL5.jpg' },
      { src: '/images/travel/jilin/JL6.jpg' },
      { src: '/images/travel/jilin/JL7.jpg', caption: '长春' }, 
      { src: '/images/travel/jilin/JL8.jpg' }, 
      { src: '/images/travel/jilin/JL9.jpg', caption: '四平东站' }  // <-- ADD caption
    ]
  },
  {
    id: 'shaanxi',
    title: '陕西',
    description: '我的大学生活。',
    tech: ['大学'],
    link: '#',
    imageUrl: '/images/travel/shaanxi/SX5.jpg',
    // --- ADD Shaanxi Article --- 
    articleContent: '  陕西，我大学所在的地方。说实话，我不喜欢这个地方，春秋很短，天气总是阴着的，空气也很差，吃饭也不便宜。我也很少在陕西周边旅行过，对我来说，这只是我的一个落脚处。\n\n\n  说来也好笑，当初选择西安，是因为我觉得它是一个"一线城市"，现在来看我还是了解少了，游戏行业在这里并不是很发达，活动也很少见，很难找到同好。\n\n\n  虽然如此，他依然也将会是陪伴我四年的城市，这里有独特的烟火气，碳水和古迹随处可即（西安考古博物馆甚至就在我家楼下）。还在西安里结识了许多有趣的人，在大学中与这座长安城达成了和解。',
    // --- END ADD ---
    // --- ADD Shaanxi Gallery --- 
    galleryImages: [
      { src: '/images/travel/shaanxi/SX1.jpg' }, { src: '/images/travel/shaanxi/SX2.jpg' },
      { src: '/images/travel/shaanxi/SX3.jpg' }, { src: '/images/travel/shaanxi/SX4.jpg' },
      { src: '/images/travel/shaanxi/SX5.jpg' }, { src: '/images/travel/shaanxi/SX6.jpg' },
      { src: '/images/travel/shaanxi/SX7.jpg' }, { src: '/images/travel/shaanxi/SX8.jpg' },
      { src: '/images/travel/shaanxi/SX9.jpg' }, { src: '/images/travel/shaanxi/SX10.jpg' },
      { src: '/images/travel/shaanxi/SX11.jpg' }, { src: '/images/travel/shaanxi/SX12.jpg' },
      { src: '/images/travel/shaanxi/SX13.jpg' }, { src: '/images/travel/shaanxi/SX14.jpg' },
    ]
    // --- END ADD ---
  },
  {
    id: 'chongqing',
    title: '重庆',
    description: '魔幻3D城市。', // Placeholder description
    tech: ['城市'], // Placeholder tags
    link: '#',
    imageUrl: '/images/travel/chongqing/CQ1.jpg', // <-- UPDATE imageUrl
    galleryImages: [ // <-- UPDATE galleryImages
      { src: '/images/travel/chongqing/CQ1.jpg' },
      { src: '/images/travel/chongqing/CQ2.jpg' },
      { src: '/images/travel/chongqing/CQ3.jpg' },
      { src: '/images/travel/chongqing/CQ4.jpg' },
      { src: '/images/travel/chongqing/CQ5.jpg' },
      { src: '/images/travel/chongqing/CQ6.jpg' },
    ]
  },
  {
    id: 'qinghai',
    title: '青海',
    description: '两个人拍拍脑袋就出发的冒险。',
    tech: ['高原'],
    link: '#',
    imageUrl: '/images/travel/qinghai/QH36.jpg',
    articleContent: '  青海，绝对是个难忘的旅程。23年国庆和同学一起去的，两个人拍拍脑袋也没什么计划就扎进了这片无垠高原（全靠打车），体验到春夏秋冬四个季节的感受，神奇的体验。\n\n\n  首先就是我这辈子都忘不了的坎布拉森林公园，一开始定位就定错了，我们十点多从西入口进入，信誓旦旦要靠徒步穿过去！两人三根杖就开始了漫长的徒步，这一走，就是从早上十点走到了将近半夜两点。快零点的时候，开始下雨，我们披着一次性雨衣，两个人交错打着手电筒，一步一步沿着公路漫长的徒步，山岗沉寂无声，只能听见自己的心跳，结果一点多看到我们才走到了一半的路程才能看到正式的景区。\n\n\n  雨水逐渐夹带着雪花，又转为小冰雹，我先一步撑不住，我怕真的要失温死在这里，当时真是绝望，还好我同学够冷静，在强往上走之后找到了景区求助电话，当地村民开车带我们去远处的民宿。后来的两天基本就昏在民宿里。据村民说当地还有狼出没，没遇上真是不幸中的万幸。\n\n\n  之后我们打车回到城市，老老实实地招了个司机师父带我们走。\n\n\n  又见过海天一线的青海湖，落日下的茶卡盐湖，还有暴风雪下的岗什卡雪峰（当初还行作死再爬一次山峰，可惜风雪太大不了了之了）',
    galleryImages: [
      { src: '/pictures/hard/YJ1.jpg', caption: '入手的铁三角唱片机' }, // <-- ADD caption
      { src: '/pictures/hard/YJ2.jpg' },
      { src: '/pictures/hard/YJ3.jpg' },
      { src: '/pictures/hard/YJ4.jpg', caption: '搭的一台itx服务器' }, // <-- ADD caption
      { src: '/pictures/hard/YJ5.jpg' },
      { src: '/pictures/hard/YJ6.jpg' },
      { src: '/pictures/hard/YJ11.jpg', caption: '给笔记本清灰' } // <-- ADD YJ11 with caption
    ]
  },
  {
    id: 'guizhou',
    title: '贵州',
    description: '于雾雨中，我与贵州相遇。',
    tech: ['自然'],
    link: '#',
    imageUrl: '/images/travel/guizhou/GZ20.jpg',
    galleryImages: [
      { src: '/images/travel/guizhou/GZ1.jpg' }, { src: '/images/travel/guizhou/GZ2.jpg' },
      { src: '/images/travel/guizhou/GZ3.jpg' }, { src: '/images/travel/guizhou/GZ4.jpg' },
      { src: '/images/travel/guizhou/GZ5.jpg' }, { src: '/images/travel/guizhou/GZ6.jpg' },
      { src: '/images/travel/guizhou/GZ7.jpg' }, { src: '/images/travel/guizhou/GZ8.jpg' },
      { src: '/images/travel/guizhou/GZ9.jpg' }, { src: '/images/travel/guizhou/GZ10.jpg' },
      { src: '/images/travel/guizhou/GZ11.jpg' }, { src: '/images/travel/guizhou/GZ12.jpg' },
      { src: '/images/travel/guizhou/GZ13.jpg' }, { src: '/images/travel/guizhou/GZ14.jpg' },
      { src: '/images/travel/guizhou/GZ15.jpg' }, { src: '/images/travel/guizhou/GZ16.jpg' },
      { src: '/images/travel/guizhou/GZ17.jpg' }, { src: '/images/travel/guizhou/GZ18.jpg' },
      { src: '/images/travel/guizhou/GZ19.jpg' }, { src: '/images/travel/guizhou/GZ20.jpg' },
      { src: '/images/travel/guizhou/GZ21.jpg' }, { src: '/images/travel/guizhou/GZ22.jpg' },
      { src: '/images/travel/guizhou/GZ23.jpg' }, { src: '/images/travel/guizhou/GZ24.jpg' },
    ]
  },
  {
    id: 'korea',
    title: '韩国',
    description: '我父母所居住的地方。',
    tech: ['家'],
    link: '#',
    imageUrl: '/images/travel/hanguo/HG2.jpg',
    // --- ADD Korea Article and Gallery --- 
    articleContent: '  韩国是我父母务工居住的地方，和我也有一些联系。现在偶尔看望父母就会回到这里，这里清冷疏离，陌生的面孔陌生的人，没有支付手段，在这里我像还是那尚未涉世的孩子，只能依偎着父母。\n\n\n  不过有了父母，这里就是我的家。',
    galleryImages: [
      { src: '/images/travel/hanguo/HG1.jpg' },
      { src: '/images/travel/hanguo/HG2.jpg' },
      { src: '/images/travel/hanguo/HG3.jpg' },
      { src: '/images/travel/hanguo/HG4.jpg' },
      { src: '/images/travel/hanguo/HG5.jpg' }, // <-- ADD HG5
      { src: '/images/travel/hanguo/HG6.jpg' },  // <-- ADD HG6
      { src: '/images/travel/hanguo/HG7.jpg' }, // <-- ADD HG7
      { src: '/images/travel/hanguo/HG8.jpg' }  // <-- ADD HG8
    ]
    // --- END ADD ---
  },
];

const experienceData = [
  {
    id: 'highschool',
    type: 'education', // Differentiate between education and work/volunteer
    duration: '2016 - 2022',
    title: '初中 / 高中',
    location: '吉林师范大学附属中学 / 四平市第一高级中学',
    details: [ // Use an array for details
      '吉林师范大学附属中学', 
      '四平市第一高级中学'
    ],
    alignment: 'right', // Indicate alignment for timeline styling
    // --- ADD galleryImages for highschool ---
    galleryImages: [
      { src: '/images/exp/edu/gz1.jpg' },
      { src: '/images/exp/edu/gz2.jpg' },
      { src: '/images/exp/edu/gz3.jpg' },
      { src: '/images/exp/edu/gz4.jpg' },
      { src: '/images/exp/edu/gz5.jpg' },
      { src: '/images/exp/edu/gz6.jpg' },
      { src: '/images/exp/edu/gz7.jpg', caption: '张信哲居然在这里开演唱会，还是我家楼下！' }, // <-- ADD caption

    ]
    // --- END ADD ---
  },
  {
    id: 'university',
    type: 'education',
    duration: '2022 - 至今',
    title: '大学',
    location: '西安外国语大学',
    details: [
        '西安外国语大学',
        '英语系'
    ],
    alignment: 'left',
    galleryImages: [ // <-- MODIFY University Gallery
      { src: '/images/exp/xisu/XS1.jpg', caption: '油头垢面的我' },
      { src: '/images/exp/xisu/XS2.jpg' },
      { src: '/images/exp/xisu/XS3.jpg' },
      { src: '/images/exp/xisu/XS4.jpg' },
      { src: '/images/exp/xisu/XS5.jpg' },
      { src: '/images/exp/xisu/XS6.jpg' },
      { src: '/images/exp/xisu/XS7.jpg' },
      { src: '/images/exp/xisu/XS8.jpg' },
      { src: '/images/exp/xisu/XS9.jpg' },
      { src: '/images/exp/xisu/XS10.jpg' },
      { src: '/images/exp/xisu/XS11.png' }, // png extension
      { src: '/images/exp/xisu/XS12.jpg' },
      { src: '/images/exp/xisu/XS13.jpg' },
      { src: '/images/exp/xisu/XS14.jpg' },
      { src: '/images/exp/xisu/XS15.jpg' },
      { src: '/images/exp/xisu/XS16.jpg' }
    ]
  },
  {
    id: 'internship',
    type: 'work',
    duration: '2024.07.15 - 08.16',
    title: '实习',
    location: '吉林泰斯特生物电子工程有限公司',
    details: [
      '吉林泰斯特生物电子工程有限公司',
      '国内销售部',
      '产品翻译、校对 | 市场调研'
    ],
    alignment: 'left',
    galleryImages: [ // <-- ADD Internship Gallery
      { src: '/images/exp/shixi/SX1.jpg' },
      { src: '/images/exp/shixi/SX2.jpg', caption: '猛干五千管' },
      { src: '/images/exp/shixi/SX3.jpg', caption: '然姐请我吃肯德基' },
      { src: '/images/exp/shixi/SX4.jpg' },
      { src: '/images/exp/shixi/SX5.jpg', caption: '公司周年庆' },
      { src: '/images/exp/shixi/SX6.jpg' },
    ]
  },
  {
    id: 'volunteer',
    type: 'volunteer',
    duration: '2024.11.11 - 11.17',
    title: '志愿者',
    location: '2024 中国整合肿瘤学大会',
    details: [
       '2024 中国整合肿瘤学大会',
       '试片区小组长'
    ],
    alignment: 'left',
    galleryImages: [
      { src: '/images/exp/zhiyuan/zhiyuan1.jpg' }, 
      { src: '/images/exp/zhiyuan/zhiyuan2.jpg' },
      { src: '/images/exp/zhiyuan/zhiyuan3.jpg', caption: '请大家喝橙汁' }, // <-- Add caption
      { src: '/images/exp/zhiyuan/zhiyuan4.jpg', caption: '薅来的柳叶刀杂志' }, // <-- Add caption
      { src: '/images/exp/zhiyuan/zhiyuan5.jpg' }, 
      { src: '/images/exp/zhiyuan/zhiyuan6.jpg' },
      { src: '/images/exp/zhiyuan/zhiyuan7.jpg' },
      { src: '/images/exp/zhiyuan/zhiyuan8.jpg' }, // <-- ADD zhiyuan8
      { src: '/images/exp/zhiyuan/zhiyuan9.jpg' }  // <-- ADD zhiyuan9
    ]
  },
];

// --- ADD otherData --- 
const otherData = [
  {
    id: 'physical-games',
    title: '实体游戏收藏',
    description: '收集一些喜欢的游戏实体版。',
    imageUrl: '/pictures/collection/SC8.jpg', // <-- Updated cover
    tech: ['游戏'],
    // --- ADD articleContent --- 
    articleContent: `
看得见摸得着的实体游戏总会给我一种安全感，这些大部分都是GalGame的实体还有一部分的唱片和众筹谷子。

我第一款周边其实是这个Minecraft黑胶，当时花了一千多...结果转头就有第二批新货瞬间价格就降到了三百块...

后来逐渐接触到Galgame，经朋友的安利下买了实体《樱之诗》
    `,
    // --- END ADD ---
    galleryImages: [
      { src: '/pictures/collection/SC1.jpg' },
      { src: '/pictures/collection/SC2.jpg' },
      { src: '/pictures/collection/SC3.jpg' },
      { src: '/pictures/collection/SC4.jpg' },
      { src: '/pictures/collection/SC5.jpg' },
      { src: '/pictures/collection/SC6.jpg' },
      { src: '/pictures/collection/SC7.jpg' },
      { src: '/pictures/collection/SC8.jpg' },
      { src: '/pictures/collection/SC9.jpg' },
      { src: '/pictures/collection/SC10.jpg' },
      { src: '/pictures/collection/SC11.jpg' },
      { src: '/pictures/collection/SC12.jpg' },
      { src: '/pictures/collection/SC13.jpg' },
      { src: '/pictures/collection/SC14.jpg' },
      { src: '/pictures/collection/SC15.jpg' },
      { src: '/pictures/collection/SC16.jpg' },
      { src: '/pictures/collection/SC17.jpg' },
      { src: '/pictures/collection/SC18.jpg' },
      { src: '/pictures/collection/SC19.jpg' },
      { src: '/pictures/collection/SC20.jpg' }
    ]
  },
  {
    id: 'tarot-cards',
    title: '塔罗牌',
    description: '偶尔用来探索潜意识或作为思考工具。',
    imageUrl: '/pictures/TR/TR3.jpg', // <-- Updated cover
    tech: [],
    // --- ADD articleContent --- 
    articleContent: `
有段时间我还沉迷八字，塔罗牌这种神秘学，现在看来或许是对未来的焦虑，让我花费精力投入这里吧。

不过即使从现在来看，也依然是很有意思的，牌面的解读，故事的发展，各种明线暗线交织不断，构成了一个个精彩的人生。
    `,
    // --- END ADD --- 
    galleryImages: [
      { src: '/pictures/TR/TR1.jpg', caption: '朋友给我的塔罗牌' }, // <-- ADD caption
      { src: '/pictures/TR/TR2.jpg' },
      { src: '/pictures/TR/TR3.jpg', caption: '朋友给我的塔罗牌' } // <-- ADD caption
    ]
  },
  // --- ADD New Items ---
  {
    id: 'desk-setup', // Unique ID
    title: '桌搭',
    description: '我的床桌进化史~最后搬出来了。', // <-- UPDATE description
    imageUrl: '/pictures/zhuoda/ZD11.jpg', // <-- UPDATE imageUrl
    tech: [], // Empty tags for now
    galleryImages: [ // <-- UPDATE galleryImages
      { src: '/pictures/zhuoda/ZD1.jpg' },
      { src: '/pictures/zhuoda/ZD2.jpg' },
      { src: '/pictures/zhuoda/ZD3.jpg' },
      { src: '/pictures/zhuoda/ZD4.jpg' },
      { src: '/pictures/zhuoda/ZD5.jpg' },
      { src: '/pictures/zhuoda/ZD6.jpg' },
      { src: '/pictures/zhuoda/ZD7.jpg' },
      { src: '/pictures/zhuoda/ZD8.jpg' },
      { src: '/pictures/zhuoda/ZD9.jpg' },
      { src: '/pictures/zhuoda/ZD10.jpg' },
      { src: '/pictures/zhuoda/ZD11.jpg' },
    ]
  },
  {
    id: 'hardware', // Unique ID
    title: '主机/单片机',
    description: '关于硬件的尝试和探索。', // Placeholder description
    imageUrl: '/pictures/hard/YJ6.jpg', // <-- UPDATE imageUrl
    tech: [], // Empty tags for now
    // --- ADD articleContent --- 
    articleContent: '  大一的时候就对这些主机感兴趣，组了一台itx服务器，还尝试向学校申请公网ip（不过显然没成功），又考虑搭建内网穿透，还学了一些Linux的知识。\n\n\n  不过折腾了这么长时间，还是选择直接用了现成的云服务器。\n\n\n  现在组装电脑，安装系统什么的也是得心应手，偶尔还帮同学笔记本清灰（下次不敢干了）。还试着玩了单片机，做了一个小闹钟和自动开关，还有买了个树莓派（不过现在在吃灰），焊枪也用过一段时间，不过现在主要专注开发游戏，就没再继续学习了，算是一个小尝试吧。',
    // --- END ADD --- 
    galleryImages: [ // <-- MODIFY galleryImages
      { src: '/pictures/hard/YJ1.jpg', caption: '入手的铁三角唱片机' }, // <-- ADD caption
      { src: '/pictures/hard/YJ2.jpg' },
      { src: '/pictures/hard/YJ3.jpg' },
      { src: '/pictures/hard/YJ4.jpg', caption: '搭的一台itx服务器' }, // <-- ADD caption
      { src: '/pictures/hard/YJ5.jpg' },
      { src: '/pictures/hard/YJ6.jpg' }  // <-- ADD YJ6
    ]
  }
  // --- END ADD ---
];
// --- END ADD --- 

// --- ADD Skills Data --- 
const skillsData = [
  { id: 'js-ts', name: 'JavaScript/TypeScript', level: 7, relatedProjects: [6, 7], description: '开发了 Koishi 机器人插件和这个个人网站。' }, // Updated description
  { id: 'csharp', name: 'C#', level: 5, relatedProjects: [1, 3, 4], description: '我用C#进行 Unity 游戏开发，参加过两次gamejam。' }, 
  { id: 'unity', name: 'Unity3D', level: 6, relatedProjects: [1, 3, 4], description: '我学习过两年的Unity，参加过两次gamejam。' },
  { id: 'godot', name: 'Godot', level: 2, relatedProjects: [], description: '学习探索中，暂无关联项目。' }, 
  { id: 'next-react', name: 'Next.js/React', level: 8, relatedProjects: [7], description: '构建了这个个人网站。' }, 
  { id: 'html-css-scss', name: 'HTML/CSS/SCSS', level: 7, relatedProjects: [2, 7], description: '我在 FreeCodeCamp 学习了前段知识并制作了一个小作品集和这个网站的样式基础。' }, // Merged SCSS
  // { id: 'scss', name: 'SCSS', level: 7, relatedProjects: [7], description: '为这个个人网站编写了样式。' } // Removed SCSS entry
];
// --- END ADD Skills Data ---

const placeholderPosts = [
  {
    id: 'post-1',
    title: '第一篇博客文章',
    excerpt: '这里是第一篇博客文章的摘要内容...',
    // --- ADD articleContent --- 
    articleContent: '这是第一篇博客文章的完整内容。\n\n这里可以写更多段落。\n\n支持换行。'
    // --- END ADD ---
  },
  // Removed other placeholders
];

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);
  const [linesAnimated, setLinesAnimated] = useState(false);
  const [hudVisible, setHudVisible] = useState(false);
  const [leftPanelAnimated, setLeftPanelAnimated] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [animationsComplete, setAnimationsComplete] = useState(false);
  const [displayedFateText, setDisplayedFateText] = useState('');
  const [isFateTypingActive, setIsFateTypingActive] = useState(false);
  const [displayedEnvParams, setDisplayedEnvParams] = useState('');
  const [isEnvParamsTyping, setIsEnvParamsTyping] = useState(false);
  const currentTempRef = useRef(55.0);
  const currentPowerRef = useRef(53);
  const lastGeneratedParamsRef = useRef('');
  const timeRef = useRef(new Date());
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const initialRandomTexts = [
    'DATA-Ø05',
    ...Array(5).fill('DATA-Ø??')
  ]; 
  const [randomHudTexts, setRandomHudTexts] = useState(initialRandomTexts);
  const [branchText1, setBranchText1] = useState('');
  const [branchText2, setBranchText2] = useState('');
  const [branchText3, setBranchText3] = useState('');
  const [branchText4, setBranchText4] = useState('');
  const intervalRef = useRef(null);
  const branchIntervalRef = useRef(null);
  const branchUpdateCounterRef = useRef(0);
  const [pulsingNormalIndices, setPulsingNormalIndices] = useState(null);
  const [pulsingReverseIndices, setPulsingReverseIndices] = useState(null);
  const pulseAnimationDuration = 2000; 
  const [activeSection, setActiveSection] = useState('home');
  const contentWrapperRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const aboutContentRef = useRef(null);
  const [powerLevel, setPowerLevel] = useState(67);
  const [isInverted, setIsInverted] = useState(false);
  const [isTesseractActivated, setIsTesseractActivated] = useState(false);
  const [isDischarging, setIsDischarging] = useState(false);
  const dischargeIntervalRef = useRef(null);
  const [leversVisible, setLeversVisible] = useState(false);
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [activeLifeTab, setActiveLifeTab] = useState('game');
  const [selectedLifeItem, setSelectedLifeItem] = useState(null);
  const [contentScrollPosition, setContentScrollPosition] = useState(0);
  const [previousActiveLifeTab, setPreviousActiveLifeTab] = useState(null);
  const [selectedWorkItem, setSelectedWorkItem] = useState(null);
  const [selectedExperienceItem, setSelectedExperienceItem] = useState(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);
  const lifeSectionRef = useRef(null); 
  const worksSectionRef = useRef(null); 
  const experienceSectionRef = useRef(null);
  const contactSectionRef = useRef(null);
  const blogSectionRef = useRef(null);
  const [activeWorkTab, setActiveWorkTab] = useState('learn'); 
  const blogViewWrapperRef = useRef(null); // <-- ADD Ref for BlogViewWrapper
  const [blogScrollPosition, setBlogScrollPosition] = useState(0); // <-- ADD State for Blog scroll position
  const [hoveredSkillId, setHoveredSkillId] = useState(null); // <-- ADD State for hovered skill
  const backClickTimeoutRef = useRef(null); // <-- ADD Ref for back click timeout
  const [isNavigating, setIsNavigating] = useState(false); // <-- ADD isNavigating state
  const navigationTimeoutRef = useRef(null); // <-- ADD Ref for navigation timeout

  // --- ADD Refs for content areas --- 
  const lifeContentAreaRef = useRef(null);
  const workContentAreaRef = useRef(null);
  const lifeGameTabRef = useRef(null);
  const lifeTravelTabRef = useRef(null);
  const lifeArtTabRef = useRef(null);
  const lifeOtherTabRef = useRef(null);
  const workLearnTabRef = useRef(null);
  const workWorkTabRef = useRef(null);
  // --- END ADD ---

  // --- ADD Navigation Links Data --- 
  const navLinks = [
    // --- 修改顺序: 将 Blog 移到最后 ---
    // { label: 'Blog', target: 'blog-section', ref: blogSectionRef },
    { label: 'Works', target: 'works-section', ref: worksSectionRef },
    { label: 'Experience', target: 'experience-section', ref: experienceSectionRef },
    { label: 'Life', target: 'life-section', ref: lifeSectionRef }, // Added Life link
    { label: 'Contact', target: 'contact-section', ref: contactSectionRef },
    { label: 'About', target: 'about-section', ref: aboutSectionRef }, 
    { label: 'Blog', target: 'blog-section', ref: blogSectionRef }, // 移动到这里
  ];
  // --- END ADD ---

  // --- ADD useEffect for logging activeSection --- 
  /*
  useEffect(() => {
    console.log('[activeSection changed]:', activeSection);
  }, [activeSection]);
  */
  // --- END REMOVE ---

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      setMainVisible(true);
      setTimeout(() => {
        setLeftPanelAnimated(true);
        setTimeout(() => {
          setLeversVisible(true);
        }, 800);
      }, 200);
      setTimeout(() => {
        setLinesAnimated(true);
      }, 1000);
      setTimeout(() => {
        setHudVisible(true);
      }, 2200);
      setTimeout(() => {
        setTextVisible(true);
      }, 2500);
      setTimeout(() => {
        setAnimationsComplete(true);
      }, 4200);
    }, 100); // 还原延迟为 100ms
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let pulseIntervalId = null;
    let pulseTimeoutIds = [];

    if (animationsComplete) {
      const staggerDelay = 200;
      const animationDuration = 2000;

      pulseIntervalId = setInterval(() => {
        pulseTimeoutIds.forEach(clearTimeout);
        pulseTimeoutIds = [];
        setPulsingNormalIndices(null);
        setPulsingReverseIndices(null);

        const indices = [];
        while (indices.length < 3) {
          const randomIndex = Math.floor(Math.random() * 6);
          if (!indices.includes(randomIndex)) {
            indices.push(randomIndex);
          }
        }
        
        const timeoutId1 = setTimeout(() => {
          setPulsingNormalIndices([indices[0]]);
          setPulsingReverseIndices(null);
        }, 0);
        pulseTimeoutIds.push(timeoutId1);

        const timeoutId2 = setTimeout(() => {
          setPulsingNormalIndices(prev => (prev ? [...prev, indices[1]] : [indices[1]]));
        }, staggerDelay);
        pulseTimeoutIds.push(timeoutId2);
        
        const timeoutId3 = setTimeout(() => {
          setPulsingReverseIndices([indices[2]]);
        }, staggerDelay * 2);
        pulseTimeoutIds.push(timeoutId3);

        const resetTimeoutId = setTimeout(() => {
          setPulsingNormalIndices(null);
          setPulsingReverseIndices(null);
          pulseTimeoutIds = [];
        }, staggerDelay * 2 + animationDuration);
        pulseTimeoutIds.push(resetTimeoutId);

      }, 2000 + staggerDelay * 2);
    }

    return () => {
      if (pulseIntervalId) clearInterval(pulseIntervalId);
      pulseTimeoutIds.forEach(clearTimeout);
    };
  }, [animationsComplete]); 

  useEffect(() => {
    if (textVisible) {
      const englishText = "You and me, fate is entangled in this moment.";
      const chineseText = "你我命运于此刻纠缠不休，守林人。";
      const typingDelay = 80;
      const deleteDelay = 50;
      const chineseTypingDelay = 150;
      const chineseDeleteDelay = 100;
      const pauseAfterType = 1500;
      const pauseAfterDelete = 500;

      let timeouts = [];
      setIsFateTypingActive(true);

      const typeString = (str, index, delay, callback) => {
        if (index < str.length) {
          setDisplayedFateText(prev => prev + str[index]);
          const timeoutId = setTimeout(() => typeString(str, index + 1, delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
          const timeoutId = setTimeout(callback, 0);
          timeouts.push(timeoutId);
        }
      };

      const deleteString = (currentStr, delay, callback) => {
        if (currentStr.length > 0) {
          setDisplayedFateText(prev => prev.slice(0, -1));
          const timeoutId = setTimeout(() => deleteString(currentStr.slice(0, -1), delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
          const timeoutId = setTimeout(callback, 0);
          timeouts.push(timeoutId);
        }
      };

      const sequence = () => {
        typeString(englishText, 0, typingDelay, () => {
          const timeoutId1 = setTimeout(() => {
            deleteString(englishText, deleteDelay, () => {
              const timeoutId2 = setTimeout(() => {
                typeString(chineseText, 0, chineseTypingDelay, () => {
                  const timeoutId3 = setTimeout(() => {
                    deleteString(chineseText, chineseDeleteDelay, () => {
                      const timeoutId4 = setTimeout(() => {
                        sequence();
                      }, pauseAfterDelete);
                      timeouts.push(timeoutId4);
                    });
                  }, pauseAfterType);
                  timeouts.push(timeoutId3);
                });
              }, pauseAfterDelete);
              timeouts.push(timeoutId2);
            });
          }, pauseAfterType);
          timeouts.push(timeoutId1);
        });
      };

      sequence();

      return () => {
        timeouts.forEach(clearTimeout);
        setDisplayedFateText(''); 
        setIsFateTypingActive(false);
        timeouts = [];
      };
    }
  }, [textVisible]);

  useEffect(() => {
    if (textVisible) {
      const typingDelay = 35;
      const envDeleteDelay = 20;
      
      let timeouts = [];
      setIsEnvParamsTyping(true);

      const typeString = (str, index, delay, callback) => {
        if (index < str.length) {
          setDisplayedEnvParams(prev => prev + str[index]);
          const timeoutId = setTimeout(() => typeString(str, index + 1, delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
          const timeoutId = setTimeout(callback, 0);
          timeouts.push(timeoutId);
        }
      };

      const deleteEnvParamsString = (currentStr, delay, callback) => {
        if (currentStr.length > 0) {
          setDisplayedEnvParams(prev => prev.slice(0, -1));
          const timeoutId = setTimeout(() => deleteEnvParamsString(currentStr.slice(0, -1), delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
          const timeoutId = setTimeout(callback, 0); 
          timeouts.push(timeoutId);
        }
      };

      const generateNewParams = () => {
        const tempChange = (Math.random() * 3) - 1.5; 
        let newTemp = currentTempRef.current + tempChange;
        newTemp = Math.max(44, Math.min(66, newTemp)); 
        currentTempRef.current = newTemp; 
        const tempStr = newTemp.toFixed(1);
        
        const rad = Math.floor(200 + Math.random() * 300);
        const o2 = (8 + Math.random() * 2).toFixed(1); 
        
        const pollutionLevels = ["SEVERE", "CRITICAL", "UNSTABLE", "HAZARDOUS"];
        const pollution = pollutionLevels[Math.floor(Math.random() * pollutionLevels.length)];
        
        const rainStatus = ["IMMINENT", "LIKELY", "UNLIKELY", "CERTAIN"];
        const rain = rainStatus[Math.floor(Math.random() * rainStatus.length)];
                
        const warnings = [
          "ALERT: TOXIC EXPOSURE RISK",
          "CAUTION: RADIATION STORM",
          "DANGER: ACID ZONES EXPANDING",
          "URGENT: OXYGEN DEPLETION"
        ];
        const randomWarning = warnings[Math.floor(Math.random() * warnings.length)];
        const warningLine = Math.random() > 0.5 ? `\n${randomWarning}` : '';
        
        return `TEMP: ${tempStr}°C\nRAD: ${rad}mSv/h\nO2: ${o2}%\nPOLLUTION: ${pollution}\nACID RAIN: ${rain}${warningLine}`;
      };

      const generateAndType = () => {
        const newParams = generateNewParams();
        lastGeneratedParamsRef.current = newParams;
        typeString(newParams, 0, typingDelay, () => {
          const updateTime = 8000 + Math.floor(Math.random() * 7000);
          const restartTimeout = setTimeout(() => {
            startTyping();
          }, updateTime);
          timeouts.push(restartTimeout);
        });
      };

      const startTyping = () => {
        const textToDelete = lastGeneratedParamsRef.current;

        if (textToDelete.length > 0) {
          deleteEnvParamsString(textToDelete, envDeleteDelay, () => {
            generateAndType(); 
          });
        } else {
          generateAndType();
        }
      };

      const initialDelay = setTimeout(() => {
        startTyping();
      }, 1000);
      timeouts.push(initialDelay);

      return () => {
        timeouts.forEach(clearTimeout);
        setDisplayedEnvParams('');
        setIsEnvParamsTyping(false);
        lastGeneratedParamsRef.current = '';
      };
    }
  }, [textVisible]);

  useEffect(() => {
    if (!mainVisible) return;

    const intervalId = setInterval(() => {
      setPowerLevel(prevLevel => {
        if (!isDischarging && prevLevel < 100) {
          const decrease = Math.floor(Math.random() * 3) + 1;
          return Math.max(0, prevLevel - decrease);
        }
        return prevLevel;
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [mainVisible, isDischarging]);

  const chargeBattery = () => {
    setPowerLevel(prevLevel => {
      if (prevLevel >= 100) return 100;
      const newLevel = Math.min(100, prevLevel + 5);
      console.log("Charging... New Power Level:", newLevel);
      return newLevel;
    });
  };

  const handleDischargeLeverPull = () => {
    if (powerLevel === 100 && !isDischarging) {
      console.log("Discharge Lever Pulled! Starting discharge...");
      setIsDischarging(true);
    } else if (isDischarging) {
        console.log("Already discharging.");
    } else {
        console.log("Cannot discharge, power level is not 100%.");
    }
  };

  useEffect(() => {
    if (isDischarging) {
      if (dischargeIntervalRef.current) {
        clearInterval(dischargeIntervalRef.current);
      }
      dischargeIntervalRef.current = setInterval(() => {
        setPowerLevel(prevLevel => {
          if (prevLevel > 0) {
            const decreaseAmount = 1;
            return Math.max(0, prevLevel - decreaseAmount);
          } else {
            console.log("Discharge complete.");
            clearInterval(dischargeIntervalRef.current);
            dischargeIntervalRef.current = null;
            setIsDischarging(false);
            return 0;
          }
        });
      }, 80);

      return () => {
        if (dischargeIntervalRef.current) {
          console.log("Cleaning up discharge interval.");
          clearInterval(dischargeIntervalRef.current);
          dischargeIntervalRef.current = null;
        }
      };
    } else {
        if (dischargeIntervalRef.current) {
             console.log("Clearing discharge interval because isDischarging is false.");
             clearInterval(dischargeIntervalRef.current);
             dischargeIntervalRef.current = null;
        }
    }
  }, [isDischarging]);

  useEffect(() => {
    if (powerLevel === 100 && !isDischarging && !isInverted) {
      console.log("Power at 100% and not discharging! Activating inverted mode.");
      setIsInverted(true);
    }
    else if ((powerLevel < 100 || isDischarging) && isInverted) {
      console.log("Power below 100 or discharging! Deactivating inverted mode.");
      setIsInverted(false);
    }
  }, [powerLevel, isInverted, isDischarging]);

  const numberOfColumns = 6;

  const sectionNames = [
    "WORKS",
    "EXPERIENCE",
    "LIFE",
    "CONTACT",
    "ABOUT",
    "BLOG" // 添加BLOG栏目
  ];

  const updateRandomHudTexts = () => {
    const newTexts = [];
    for (let i = 0; i < 6; i++) { 
      const randomNum = Math.floor(Math.random() * 99) + 1;
      const numStr = String(randomNum).padStart(2, '0');
      newTexts.push(`DATA-Ø${numStr}`);
    }
    setRandomHudTexts(newTexts);
  };

  const generateRandomChars = (length) => { 
    let targetLength = length;
    if (typeof length === 'undefined' || length === null) {
      targetLength = Math.floor(Math.random() * 4) + 3;
    }
    
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:'\",.<>/?~`§±¥₩£¢€©®™×÷≠≤≥∞∑∫√≈≠≡";
    let result = '';
    targetLength = Math.max(0, targetLength); 
    
    for (let i = 0; i < targetLength; i++) { 
      result += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i < targetLength - 1) { 
        result += '\n';
      }
    }
    return result;
  };

  const handleColumnMouseEnter = (index) => {
    if (index === 4) {
      updateRandomHudTexts();
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(updateRandomHudTexts, 50);
    } else if (index === 1) {
      branchUpdateCounterRef.current = 0; 
      if (branchIntervalRef.current) clearInterval(branchIntervalRef.current);
      
      const getTargetLength = (effectiveCount) => {
        if (effectiveCount <= 15) {      
          return 1;
        } else if (effectiveCount <= 24) { 
          return 2;
        } else if (effectiveCount <= 36) { 
          return 3;
        } else if (effectiveCount <= 48) { 
          return 4;
        } else {                 
          return Math.floor(Math.random() * 3) + 4;
        }
      };

      const initialMainCount = 1;
      const initialLength1 = getTargetLength(initialMainCount + 45);
      const initialLength2 = getTargetLength(initialMainCount + 30);
      const initialLength3 = getTargetLength(initialMainCount + 15);
      const initialLength4 = getTargetLength(initialMainCount + 0);

      setBranchText1(generateRandomChars(initialLength1));
      setBranchText2(generateRandomChars(initialLength2));
      setBranchText3(generateRandomChars(initialLength3));
      setBranchText4(generateRandomChars(initialLength4));
      branchUpdateCounterRef.current = initialMainCount;

      branchIntervalRef.current = setInterval(() => {
        branchUpdateCounterRef.current += 1;
        const mainCount = branchUpdateCounterRef.current;
        
        const length1 = getTargetLength(mainCount + 45);
        const length2 = getTargetLength(mainCount + 30);
        const length3 = getTargetLength(mainCount + 15);
        const length4 = getTargetLength(mainCount + 0);
        
        setBranchText1(generateRandomChars(length1));
        setBranchText2(generateRandomChars(length2));
        setBranchText3(generateRandomChars(length3));
        setBranchText4(generateRandomChars(length4));

      }, 100); 
    }
  };

  const handleColumnMouseLeave = (index) => {
    if (index === 4) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else if (index === 1) {
      if (branchIntervalRef.current) {
        clearInterval(branchIntervalRef.current);
        branchIntervalRef.current = null;
      }
      setBranchText1('');
      setBranchText2('');
      setBranchText3('');
      setBranchText4('');
      branchUpdateCounterRef.current = 0; 
    }
  };

  const handleColumnClick = (columnIndex) => {
    // --- Navigation Lock (keep check, remove logs) --- 
    if (isNavigating) {
      // console.log("Navigation locked, animation in progress.");
      return;
    }
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    setIsNavigating(true);
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
      navigationTimeoutRef.current = null;
      // console.log("Navigation unlocked (column click).");
    }, 800); // Lock for 0.8 seconds
    // --- END Lock ---

    console.log(`Column ${columnIndex + 1} clicked`); // Keep basic log
    
    // 添加BLOG列的点击处理
    if (columnIndex === 5) { // BLOG列
      setActiveSection('blog'); // 设置当前区域为blog
      return;
    }
    
    const sectionIds = [
      'works-section',
      'experience-section',
      'life-section',
      'contact-section',
      'about-section'
    ];
    
    if (columnIndex < sectionIds.length) {
      const sectionId = sectionIds[columnIndex];
      setSelectedLifeItem(null);
      setSelectedWorkItem(null);
      setSelectedExperienceItem(null);
      setActiveSection('content');

      requestAnimationFrame(() => {
        const targetElement = document.getElementById(sectionId);
        const containerElement = contentWrapperRef.current;
        if (targetElement && containerElement) {
          if (sectionId === 'life-section') {
             setActiveLifeTab('game');
          }
          const offsetTop = targetElement.offsetTop;
          containerElement.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    }
  };

  const handleGoHome = () => {
    setActiveSection('home');
    setSelectedLifeItem(null);
  };

  useEffect(() => {
    if (activeSection === 'content' && aboutSectionRef.current && aboutContentRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSectionRef.current,
          scroller: contentWrapperRef.current, 
          start: 'top bottom', 
          end: 'bottom top', 
          toggleActions: 'play none none reverse', 
          markers: false, 
        }
      });

      tl.from(aboutSectionRef.current, {
        x: '100%', 
        opacity: 0,
        immediateRender: false, 
        duration: 0.8, 
        ease: 'power3.out' 
      });

      return () => {
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
        tl.kill();
      };
    } 
    else {
        ScrollTrigger.getAll().forEach(st => {
            if (st.trigger === aboutSectionRef.current) {
                st.kill();
            }
        });
    }
  }, [activeSection]); 

  const handleActivateTesseract = () => {
    if (!isTesseractActivated) {
      console.log('Activation Lever Pulled! Activating Tesseract...');
      setIsTesseractActivated(true);
    };
  };

  const handleCopyEmail = () => {
    const email = 'rainmorime@qq.com';
    navigator.clipboard.writeText(email).then(() => {
      console.log('Email copied to clipboard!');
      setIsEmailCopied(true);
      setTimeout(() => {
        setIsEmailCopied(false);
      }, 1500);
    }).catch(err => {
      console.error('Failed to copy email: ', err);
    });
  };

  const handleLifeItemClick = (item, e) => { // <-- Accept event 'e'
    // --- Navigation Lock (keep check, remove logs) --- 
    if (isNavigating) {
      // console.log("Navigation locked, animation in progress.");
      return;
    }
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    setIsNavigating(true);
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
      navigationTimeoutRef.current = null;
      // console.log("Navigation unlocked (life click).");
    }, 800); // Lock for 0.8 seconds
    // --- END Lock ---

    // --- Clear previous back click timeout (keep check, remove log) --- 
    if (backClickTimeoutRef.current) {
      clearTimeout(backClickTimeoutRef.current);
      backClickTimeoutRef.current = null;
      // console.log("Cleared pending back click state reset timeout.");
    }
    // --- END Clear ---
    // console.log("Received event in handleLifeItemClick:", e); // Remove event log
    // Try both stopPropagation and stopImmediatePropagation
    if (e) {
      e.stopPropagation(); 
      if (e.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
          e.nativeEvent.stopImmediatePropagation();
      }
    } 
    /* Remove warning block
    else {
      console.warn("handleLifeItemClick: Invalid or missing event object.");
    }
    */
    console.log("Life item clicked, switching to detail view:", item); // Keep basic log
    // console.log("Current activeSection BEFORE set:", activeSection); // Remove state log
    // Record current scroll position AND current active tab before switching
    if (contentWrapperRef.current) {
      setContentScrollPosition(contentWrapperRef.current.scrollTop);
    }
    setPreviousActiveLifeTab(activeLifeTab); // Store the current tab

    setSelectedLifeItem(item); // Set the selected life item
    setActiveSection('lifeDetail'); // Set the active section state
  };

  const handleWorkItemClick = (item, e) => { // <-- Accept event 'e'
    // --- Navigation Lock (keep check, remove logs) --- 
    if (isNavigating) {
      // console.log("Navigation locked, animation in progress.");
      return;
    }
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    setIsNavigating(true);
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
      navigationTimeoutRef.current = null;
      // console.log("Navigation unlocked (work click).");
    }, 800); // Lock for 0.8 seconds
    // --- END Lock ---

    // --- Clear previous back click timeout (keep check, remove log) --- 
    if (backClickTimeoutRef.current) {
      clearTimeout(backClickTimeoutRef.current);
      backClickTimeoutRef.current = null;
      // console.log("Cleared pending back click state reset timeout.");
    }
    // --- END Clear ---
    // console.log("Received event in handleWorkItemClick:", e); // Remove event log
    // Try both stopPropagation and stopImmediatePropagation
    if (e) {
      e.stopPropagation();
      if (e.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
          e.nativeEvent.stopImmediatePropagation();
      }
    }
    /* Remove warning block
    else {
      console.warn("handleWorkItemClick: Invalid or missing event object.");
    }
    */
    console.log("Work item clicked, switching to detail view:", item); // Keep basic log
    // console.log("Current activeSection BEFORE set:", activeSection); // Remove state log
    // Record current scroll position before switching
    if (contentWrapperRef.current) {
      setContentScrollPosition(contentWrapperRef.current.scrollTop); 
    }
    // No need to store the 'tab' for WORKS as it's a single section

    setSelectedWorkItem(item); // Set the selected work item
    setActiveSection('workDetail'); // Set the active section state
  };

  const handleExperienceItemClick = (item, e) => { // <-- Accept event 'e'
    // --- Navigation Lock (keep check, remove logs) --- 
    if (isNavigating) {
      // console.log("Navigation locked, animation in progress.");
      return;
    }
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    setIsNavigating(true);
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
      navigationTimeoutRef.current = null;
      // console.log("Navigation unlocked (exp click).");
    }, 800); // Lock for 0.8 seconds
    // --- END Lock ---

    // --- Clear previous back click timeout (keep check, remove log) --- 
    if (backClickTimeoutRef.current) {
      clearTimeout(backClickTimeoutRef.current);
      backClickTimeoutRef.current = null;
      // console.log("Cleared pending back click state reset timeout.");
    }
    // --- END Clear ---
    // console.log("Received event in handleExperienceItemClick:", e); // Remove event log
    // Try both stopPropagation and stopImmediatePropagation
    if (e) {
      e.stopPropagation();
      if (e.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
          e.nativeEvent.stopImmediatePropagation();
      }
    }
    /* Remove warning block
    else {
      console.warn("handleExperienceItemClick: Invalid or missing event object.");
    }
    */
    console.log("Experience item clicked, switching to detail view:", item); // Keep basic log
    // console.log("Current activeSection BEFORE set:", activeSection); // Remove state log
    // Record current scroll position before switching
    if (contentWrapperRef.current) {
      setContentScrollPosition(contentWrapperRef.current.scrollTop); 
    }

    setSelectedExperienceItem(item); // Set the selected experience item
    setActiveSection('experienceDetail'); // Set the active section state
  };

  // --- ADD Handler for Blog Post Click --- 
  const handleBlogPostClick = (post, e) => { // <-- Accept event 'e'
    // --- Navigation Lock (keep check, remove logs) --- 
    if (isNavigating) {
      // console.log("Navigation locked, animation in progress.");
      return;
    }
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    setIsNavigating(true);
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
      navigationTimeoutRef.current = null;
      // console.log("Navigation unlocked (blog post click).");
    }, 800); // Lock for 0.8 seconds
    // --- END Lock ---

    // --- Clear previous back click timeout (keep check, remove log) --- 
    if (backClickTimeoutRef.current) {
      clearTimeout(backClickTimeoutRef.current);
      backClickTimeoutRef.current = null;
      // console.log("Cleared pending back click state reset timeout.");
    }
    // --- END Clear ---
    // console.log("Received event in handleBlogPostClick:", e); // Remove event log
    // Try both stopPropagation and stopImmediatePropagation
    if (e) {
      e.stopPropagation();
      if (e.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
          e.nativeEvent.stopImmediatePropagation();
      }
    }
    /* Remove warning block
    else {
      console.warn("handleBlogPostClick: Invalid or missing event object.");
    }
    */
    console.log("Blog post clicked, switching to detail view:", post); // Keep basic log
    // console.log("Current activeSection BEFORE set:", activeSection); // Remove state log
    // Save scroll position of the blog view wrapper
    if (blogViewWrapperRef.current) {
      setBlogScrollPosition(blogViewWrapperRef.current.scrollTop);
    }
    setSelectedBlogPost(post);
    setActiveSection('blogDetail'); // Switch to the blog detail view
  };
  // --- END ADD ---

  // --- MODIFY Global Back Button Logic ---
  const handleGlobalBackClick = () => {
    // --- Navigation Lock (keep check, remove logs) --- 
    if (isNavigating) {
      console.log("Navigation locked, animation in progress.");
      return;
    }
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    setIsNavigating(true);
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
      navigationTimeoutRef.current = null;
      console.log("Navigation unlocked (back click).");
    }, 800); // Lock for 0.8 seconds
    // --- END ADD ---

    const animationDuration = 1700; // Set delay slightly longer than slideOutToRight (1.6s)
    console.log("Global back clicked. Current activeSection:", activeSection);

    if (activeSection === 'blogDetail') {
      console.log("Navigating back from blogDetail to blog");
      setActiveSection('blog'); 
      requestAnimationFrame(() => {
        if (blogViewWrapperRef.current) {
          blogViewWrapperRef.current.scrollTop = blogScrollPosition;
        }
      });
      setTimeout(() => {
        setSelectedBlogPost(null);
        // setBlogScrollPosition(0); // Optionally reset
      }, animationDuration); // Use defined duration
    } else if (activeSection === 'blog') {
      setActiveSection('home');
    } else if (activeSection === 'lifeDetail' || activeSection === 'workDetail' || activeSection === 'experienceDetail') {
      const targetSection = 
        activeSection === 'lifeDetail' ? 'life-section' :
        activeSection === 'workDetail' ? 'works-section' :
        activeSection === 'experienceDetail' ? 'experience-section' :
        null;
      
      const targetActiveSection = 'content'; 
      setActiveSection(targetActiveSection); 

      if (activeSection === 'lifeDetail') {
         setActiveLifeTab(previousActiveLifeTab || 'game');
      } 
        
      requestAnimationFrame(() => {
        if (contentWrapperRef.current) { 
          // --- MODIFY: Always restore scroll position, don't scroll to section top --- 
          console.log('Restoring scroll position to:', contentScrollPosition);
          contentWrapperRef.current.scrollTop = contentScrollPosition;
          /* 
          let targetRef = null;
          if (targetSection === 'life-section') targetRef = lifeSectionRef;
          else if (targetSection === 'works-section') targetRef = worksSectionRef;
          else if (targetSection === 'experience-section') targetRef = experienceSectionRef;

          if (targetRef?.current) {
             contentWrapperRef.current.scrollTo({
                 top: targetRef.current.offsetTop,
                 behavior: 'auto' 
             });
          } else {
             contentWrapperRef.current.scrollTop = contentScrollPosition;
          }
          */
          // --- END MODIFY --- 
        } 
      });
      
      // Use defined duration for all detail views
      // --- MODIFY Store timeout ID --- 
      backClickTimeoutRef.current = setTimeout(() => {
        console.log("Executing delayed state reset after back click.");
        setSelectedLifeItem(null);
        setPreviousActiveLifeTab(null); 
        setSelectedWorkItem(null);
        setSelectedExperienceItem(null);
        setContentScrollPosition(0);
        backClickTimeoutRef.current = null; // Clear ref after execution
      }, animationDuration); 
      // --- END MODIFY ---
    } else if (activeSection === 'content') {
      handleGoHome(); 
    }
  };
  // --- END MODIFY ---

  // --- ADD Handler for Life Tab Clicks --- 
  const handleLifeTabClick = (tabName) => {
    // Scroll to Life section top when a tab is clicked
    if (contentWrapperRef.current && lifeSectionRef.current) {
      const lifeSectionTop = lifeSectionRef.current.offsetTop;
      contentWrapperRef.current.scrollTo({
        top: lifeSectionTop,
        behavior: 'smooth' // Or 'auto'
      });
    }
    setActiveLifeTab(tabName);
  };
  // --- END ADD ---

  // --- ADD Handler for Work Tab Clicks --- 
  const handleWorkTabClick = (tabName) => {
    if (contentWrapperRef.current && worksSectionRef.current) {
      const worksSectionTop = worksSectionRef.current.offsetTop;
      contentWrapperRef.current.scrollTo({
        top: worksSectionTop,
        behavior: 'smooth' 
      });
    }
    setActiveWorkTab(tabName);
  };
  // --- END ADD ---

  // --- ADD Handler for Left Nav Link Clicks ---
  const handleLeftNavLinkClick = (link) => {
    // --- ADD Navigation Lock --- 
    if (isNavigating) {
      console.log("Navigation locked, animation in progress.");
      return;
    }
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    setIsNavigating(true);
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
      navigationTimeoutRef.current = null;
      console.log("Navigation unlocked (left nav click).");
    }, 200); // Lock for 0.2 seconds
    // --- END ADD ---

    // 处理Blog链接点击
    if (link.label === 'Blog') {
      setActiveSection('blog');
      return;
    }
    
      // All links now navigate within the 'content' view
      if (activeSection !== 'content') {
        setActiveSection('content');
        // Delay scrolling until content view is active
        setTimeout(() => {
          if (link.ref?.current && contentWrapperRef.current) {
            contentWrapperRef.current.scrollTo({
              top: link.ref.current.offsetTop,
              behavior: 'smooth'
            });
          }
        }, 100); 
      } else {
        // Already in content view, just scroll
        if (link.ref?.current && contentWrapperRef.current) {
          contentWrapperRef.current.scrollTo({
            top: link.ref.current.offsetTop,
            behavior: 'smooth'
          });
        }
      }
  };
  // --- END ADD ---

  // --- ADD useEffect for Dynamic Height Adjustment --- 
  useEffect(() => {
    if (activeSection !== 'content' || !contentWrapperRef.current) {
      // Reset heights when not in content view or refs aren't ready
      if (lifeContentAreaRef.current) lifeContentAreaRef.current.style.height = 'auto';
      if (workContentAreaRef.current) workContentAreaRef.current.style.height = 'auto';
      return;
    }

    // Always set content areas to auto height first
    if (lifeContentAreaRef.current) lifeContentAreaRef.current.style.height = 'auto';
    if (workContentAreaRef.current) workContentAreaRef.current.style.height = 'auto';

    // Update height after a short delay to ensure content has rendered
    const updateHeightTimer = setTimeout(() => {
      let activeTabRef = null;
      let targetContainerRef = null;

      if (activeLifeTab) { // Check which life tab is active
        targetContainerRef = lifeContentAreaRef;
        switch (activeLifeTab) {
          case 'game': activeTabRef = lifeGameTabRef; break;
          case 'travel': activeTabRef = lifeTravelTabRef; break;
          case 'art': activeTabRef = lifeArtTabRef; break;
          case 'other': activeTabRef = lifeOtherTabRef; break;
          default: break;
        }
      } else if (activeWorkTab) { // Check which work tab is active
        targetContainerRef = workContentAreaRef;
        switch (activeWorkTab) {
          case 'learn': activeTabRef = workLearnTabRef; break;
          case 'work': activeTabRef = workWorkTabRef; break;
          default: break;
        }
      }

      if (activeTabRef?.current && targetContainerRef?.current) {
        // Get the scrollHeight of the active tab's content
        const contentHeight = activeTabRef.current.scrollHeight;
        // Set the parent container's height explicitly, adding small buffer
        targetContainerRef.current.style.height = `${contentHeight}px`;
      }
    }, 50); // Short delay to ensure content is rendered

    return () => clearTimeout(updateHeightTimer);
  }, [activeSection, activeLifeTab, activeWorkTab]); 
  // --- END MODIFY ---

  return (
    <div className={`${styles.container} ${isInverted ? styles.inverted : ''}`}>
      <Head>
        <title>森雨 - RainMorime</title>
        <meta name="description" content="森雨(RainMorime)的个人网站" />
        {/* --- MODIFY: Use imported favicon --- */}
        <link rel="icon" href={favicon.src} /> 
      </Head>
      <div className={styles.leftDotMatrix}></div>
      <MusicPlayer powerLevel={powerLevel} />
      <CustomCursor />
      <RainMorimeEffect />
      <HomeLoadingScreen onComplete={handleLoadingComplete} />
      {isTesseractActivated && (
        <TesseractExperience 
          chargeBattery={chargeBattery} 
          isActivated={isTesseractActivated}
          isInverted={isInverted}
        />
      )}
      <div className={styles.gridBackground}></div>
      <div className={styles.glowEffect}></div>
      {mainVisible && (
        <>
          <div className={`${styles.hudElement} ${styles.topLeft} ${hudVisible ? styles.visible : ''}`}>
            <div>TIME: {currentTime}</div>
            <div>SYSTEM_ONLINE</div>
          </div>
          <div className={`${styles.hudElement} ${styles.topRight} ${hudVisible ? styles.visible : ''}`}>
            <div>NEURAL_NETWORK_ACTIVE</div>
            <div>SIGNAL: STABLE</div>
          </div>
          <div className={`${styles.hudElement} ${styles.bottomLeft} ${hudVisible ? styles.visible : ''}`}>
            <div>RAINMORIME</div>
            <div>NAV_SYSTEM_v2.4</div>
          </div>
          <div className={`${styles.hudElement} ${styles.bottomRight} ${hudVisible ? styles.visible : ''}`}>
            <div>TACTICAL_MODE</div>
            <div>SECURE_CONNECTION</div>
          </div>
          <div className={`${styles.leftPanel} ${leftPanelAnimated ? styles.animated : ''}`}> 
            <div className={styles.topRightDecoration}></div>
            <div className={styles.leverGroup}>
              {mainVisible && (
                <ActivationLever
                  onActivate={handleActivateTesseract}
                  isActive={isTesseractActivated}
                  iconType="discharge"
                  isAnimated={leversVisible}
                />
              )}
              {mainVisible && (
                <ActivationLever
                  onActivate={handleDischargeLeverPull}
                  isActive={isDischarging}
                  iconType="drain"
                  isAnimated={leversVisible}
                />
              )}
            </div>
            <button
              className={`${styles.globalBackButton} ${ 
                activeSection === 'content' || 
                activeSection === 'lifeDetail' || 
                activeSection === 'workDetail' || 
                activeSection === 'experienceDetail' ||
                activeSection === 'blog' || // 添加blog视图
                activeSection === 'blogDetail' 
                ? styles.visible : ''}`}
              onClick={handleGlobalBackClick}
            >
              <div className={styles.backArrow}>
                <div className={styles.arrowStem}></div>
                <div className={styles.arrowHead}></div>
              </div>
            </button>
            {/* --- ADD Left Nav Links --- */}
            <div className={`${styles.leftNavLinks} ${ 
                activeSection === 'content' || // Show nav links in content view
                activeSection === 'lifeDetail' || 
                activeSection === 'workDetail' || 
                activeSection === 'experienceDetail' ||
                activeSection === 'blog' || // <-- ADD back 'blog'
                activeSection === 'blogDetail' // <-- Keep 'blogDetail'
                ? styles.visible : ''}`}>
                {navLinks.map((link) => (
                    <button 
                        key={link.target} 
                        className={styles.leftNavLink} 
                        onClick={() => handleLeftNavLinkClick(link)}
                    >
                        {link.label}
                    </button>
                ))}
            </div>
            {/* --- END ADD --- */}
            <div className={styles.powerDisplay}>
              <div className={styles.batteryIcon}>
                {[...Array(5)].map((_, i) => {
                  const shouldBeFilled = powerLevel >= (i + 1) * 20;
                  const isFilled = (i === 4 && powerLevel === 100) || shouldBeFilled;
                  return (
                    <span 
                      key={i} 
                      className={`${styles.batteryLevelSegment} ${isFilled ? styles.filled : ''}`}>
                    </span>
                  );
                })}
              </div>
              <span className={styles.powerText}>{powerLevel}%</span>
            </div>
            <div className={styles.logoContainer}>
            </div>
            <div className={`${styles.fateTextContainer} ${isFateTypingActive ? styles.typingActive : ''}`}>
              <span className={styles.fateText}>{displayedFateText}</span>
              <div className={styles.fateLine}></div>
            </div>
            <div className={`${styles.envParamsContainer} ${isEnvParamsTyping ? styles.typingActive : ''} ${leftPanelAnimated ? styles.animated : ''}`}>
                <pre className={styles.envParamsText}>
                  {displayedEnvParams}
                </pre>
            </div>
            <div className={styles.brailleText}>⠝⠊⠕⠍⠡⠸⠬⠉⠄⠅⠢⠛⠳⠟⠧⠃⠥⠓⠳</div>
                        {/* Add the gradient line element here */}
              <div
              className={`${styles.gradientLine} ${isInverted ? styles.gradientLineInverted : styles.gradientLineDefault}`}
            ></div>
          </div>

          <main className={`${styles.mainLayout} ${activeSection === 'home' ? styles.visible : styles.hidden}`}>
            <div
              className={styles.rightPanel}
            >
              {[...Array(7)].map((_, index) => { // <-- 修改这里，从6改为7
                const lineLeftPercentage = index * 16;
                const isPulsingNormal = pulsingNormalIndices?.includes(index);
                const isPulsingReverse = pulsingReverseIndices?.includes(index);
                return (
                  <div 
                    key={`line-${index}`}
                    className={`
                      ${styles.verticalLine} 
                      ${linesAnimated ? styles.animated : ''} 
                      ${isPulsingNormal ? styles.pulsing : ''} 
                      ${isPulsingReverse ? styles.pulsingReverse : ''}
                    `}
                    style={{ left: `${lineLeftPercentage}%` }}
                  ></div>
                );
              })}
              
              {sectionNames.map((name, index) => {
                const columnPercentage = index * 16;
                const hudText = randomHudTexts[index + 1] || `DATA-Ø0${index + 1}`;
                
                const tasks = Array.from({ length: 30 }, (_, i) => {
                  const taskNumber = String(i + 1).padStart(3, '0');
                  return `TASK-${taskNumber}: Done`;
                });

                return (
                  <div 
                    key={name}
                    className={`${styles.column} ${styles['column' + index]} ${!animationsComplete ? styles.nonInteractive : ''}`} 
                    style={{ left: `${columnPercentage}%`, width: '16%' }} 
                    onClick={animationsComplete ? () => handleColumnClick(index) : null}
                    onMouseEnter={() => handleColumnMouseEnter(index)}
                    onMouseLeave={() => handleColumnMouseLeave(index)}
                  >
                    <div className={styles.verticalText}>
                      {name.split('').map((char, charIdx) => {
                        const delay = `${charIdx * 0.005}s`;
                        return (
                          <div key={charIdx} className={styles.charItem}>
                            <VerticalShinyText
                              text={char}
                              textVisible={textVisible}
                              animationDelay={delay}
                              speed={0.8}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className={styles.hudOverlay}>
                      {index === 0 && (
                        <div className={styles.taskContainer}>
                          {tasks.flatMap((task, taskIdx) => [
                            <div key={`task-${taskIdx}`} className={styles.taskItem}>
                              <span className={styles.taskSquare}></span>
                              <div className={styles.taskTextWrapper}>
                                <span className={styles.taskText}>{task}</span>
                              </div>
                            </div>,
                            taskIdx < tasks.length - 1 && <div key={`line-${taskIdx}`} className={styles.taskLine}></div>
                          ])}
                        </div>
                      )}
                      {index === 1 && (
                        <>
                          <div className={`${styles.branchContainer} ${styles.branch1} ${styles.rightBranch}`}>
                            <span className={styles.branchSquare}></span>
                            <pre className={styles.branchText}>{branchText1}</pre>
                          </div>
                          <div className={`${styles.branchContainer} ${styles.branch2} ${styles.leftBranch}`}>
                            <span className={styles.branchSquare}></span>
                            <pre className={styles.branchText}>{branchText2}</pre>
                          </div>
                          <div className={`${styles.branchContainer} ${styles.branch3} ${styles.rightBranch}`}>
                            <span className={styles.branchSquare}></span>
                            <pre className={styles.branchText}>{branchText3}</pre>
                          </div>
                          <div className={`${styles.branchContainer} ${styles.branch4} ${styles.leftBranch}`}>
                            <span className={styles.branchSquare}></span>
                            <pre className={styles.branchText}>{branchText4}</pre>
                          </div>
                        </>
                      )}
                      {index === 2 && <span className={`${styles.lifeScanlines} ${isInverted ? styles.invertedScanlines : ''}`}></span>}

                      {index === 3 && (
                          <>
                            <div className={`${styles.radarRipple} ${styles.ripple1}`}></div>
                            <div className={`${styles.radarRipple} ${styles.ripple2}`}></div>
                            <div className={`${styles.radarRipple} ${styles.ripple3}`}></div>
                          </>
                      )}
                    </div>
                    <div className={styles.cornerHudTopLeft}></div>
                    <div className={styles.cornerHudBottomRight}></div>
                    <div className={styles.imageHud}>
                      <span className={styles.imageHudSquare}></span>
                      <span className={styles.imageHudText}>
                        {index === 4 ? randomHudTexts[0] : hudText} 
                      </span>
                    </div>
                    {index === 4 && (
                      <>
                        {randomHudTexts.slice(1).map((text, randomIdx) => (
                          <div 
                            key={`random-hud-${randomIdx}`} 
                            className={`${styles.imageHud} ${styles.randomHud} ${styles[`randomHud${randomIdx + 1}`]}`}
                          >
                            <span className={styles.imageHudSquare}></span>
                            <span className={styles.imageHudText}>{text}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </main>

          <div 
            ref={contentWrapperRef} 
            className={`${styles.contentWrapper} ${activeSection === 'content' ? styles.visible : styles.hidden}`}
          >
            <div id="works-section" ref={worksSectionRef} className={`${styles.contentSection} ${styles.worksSection}`}> {/* <-- ADD Ref */} 
              <h2>WORKS</h2>
              {/* --- ADD Work Tab Buttons --- */}
              <div className={styles.workTabButtons}> {/* Use a specific class */} 
                  <button
                    className={`${styles.workTabButton} ${activeWorkTab === 'learn' ? styles.activeTab : ''}`}
                    onClick={() => handleWorkTabClick('learn')}
                  >
                    Learn
                  </button>
                  <button
                    className={`${styles.workTabButton} ${activeWorkTab === 'work' ? styles.activeTab : ''}`}
                    onClick={() => handleWorkTabClick('work')}
                  >
                    Work
                  </button>
              </div>
              {/* --- END ADD --- */}

              {/* --- ADD Work Content Area --- */}
              <div ref={workContentAreaRef} className={styles.workContentArea}> 
                {/* Learn Tab Content */}
                <div ref={workLearnTabRef} className={`${styles.workTabContent} ${activeWorkTab === 'learn' ? styles.activeWorkContent : ''}`}> 
                    <div className={styles.gameGrid}> {/* <-- Change class to gameGrid */} 
                        {learnProjects.map(project => (
                          <ProjectCard 
                            key={project.id} 
                            project={project} 
                            onClick={handleWorkItemClick} // <-- Pass handler directly
                          />
                        ))}
                    </div>
                </div>
                {/* Work Tab Content */}
                <div ref={workWorkTabRef} className={`${styles.workTabContent} ${activeWorkTab === 'work' ? styles.activeWorkContent : ''}`}> 
                    <div className={styles.gameGrid}> {/* <-- Change class to gameGrid */} 
                        {workProjects.map(project => (
                          <ProjectCard 
                            key={project.id} 
                            project={project} 
                            onClick={handleWorkItemClick} // <-- Pass handler directly
                          />
                        ))}
                    </div>
                </div>
              </div>
              {/* --- END ADD Work Content Area --- */}

              {/* --- ADD Skills Section --- */}
              <h4 className={styles.subSectionTitle}>技能熟练度 / Skills</h4>
              <div className={styles.skillGrid}> 
                {skillsData.map((skill) => (
                  <div 
                    key={skill.id} 
                    className={styles.skillCard}
                    onMouseEnter={() => setHoveredSkillId(skill.id)} 
                    onMouseLeave={() => setHoveredSkillId(null)}   
                  >
                    <div className={styles.skillCardContent}> 
                      <span className={styles.skillName}>{skill.name}</span> 
                      <div className={styles.skillProgressBar}> 
                        {/* Render block characters instead of spans */} 
                        {[...Array(10)].map((_, i) => (
                          <span 
                            key={i} 
                            className={i < skill.level ? styles.filledSegment : styles.emptySegment}
                          >
                            {i < skill.level ? '█' : '░'} {/* Output characters */} 
                          </span>
                        ))}
                      </div>
                    </div>
                    {hoveredSkillId === skill.id && skill.description && (
                      <div className={styles.skillHoverDescription}>
                        {skill.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* --- END ADD Skills Section --- */}
            </div>

            <div id="experience-section" ref={experienceSectionRef} className={`${styles.contentSection} ${styles.experienceSection}`}> {/* <-- ADD Ref */} 
              <h2>EXPERIENCE</h2>
              <div className={styles.experienceTimeline}>
                {experienceData.map(item => (
                  <div 
                    key={item.id} 
                    className={`
                      ${styles.timelineItem} 
                      ${item.alignment === 'left' ? styles.timelineItemLeft : styles.timelineItemRight} 
                      ${item.type === 'education' ? styles.educationItem : ''}
                      ${styles.clickable}
                    `}
                    // Ensure item and event are passed correctly
                    onClick={(e) => handleExperienceItemClick(item, e)} 
                  >
                  <div className={styles.timelinePoint}></div>
                  <div className={styles.timelineContent}>
                      <div className={styles.timelineYear}>
                        <span className={styles.timelineNumber}>{item.duration.split(' - ')[0]}</span> 
                        {item.duration.includes(' - ') && ' - '} 
                        <span className={styles.timelineNumber}>{item.duration.split(' - ')[1]}</span>
                  </div>
                      <h3>{item.title}</h3>
                      {item.details.map((detailLine, index) => (
                         <p key={index}>
                           {detailLine.split(/(\d{4}(?:\.\d{2})?)/g).map((part, partIndex) => 
                             /\d{4}(?:\.\d{2})?/.test(part) ? 
                             <span key={partIndex} className={styles.timelineNumber}>{part}</span> : 
                             part
                           )}
                         </p>
                      ))}
                </div>
                  </div>
                ))}
                </div>
                    </div>

            {/* --- MODIFY Add dynamic class based on activeSection --- */}
            <div 
              id="life-section" 
              ref={lifeSectionRef} 
              className={`${styles.contentSection} ${styles.lifeSection} ${activeSection === 'lifeDetail' ? styles.detailActive : ''}`}
            > 
              <h2>LIFE</h2>
              {/* --- REMOVE Conditional Rendering --- */}
              {/* {activeSection === 'content' && ( */} 
                <div className={styles.lifeTabButtons}>
                  <button
                    className={`${styles.lifeTabButton} ${activeLifeTab === 'game' ? styles.activeTab : ''}`}
                    onClick={() => handleLifeTabClick('game')} // Keep using the (now simpler) handler
                  >
                    Game
                  </button>
                  <button
                    className={`${styles.lifeTabButton} ${activeLifeTab === 'travel' ? styles.activeTab : ''}`}
                    onClick={() => handleLifeTabClick('travel')}
                  >
                    Travel
                  </button>
                  <button
                    className={`${styles.lifeTabButton} ${activeLifeTab === 'art' ? styles.activeTab : ''}`}
                    onClick={() => handleLifeTabClick('art')}
                  >
                    Art
                  </button>
                  <button
                    className={`${styles.lifeTabButton} ${activeLifeTab === 'other' ? styles.activeTab : ''}`}
                    onClick={() => handleLifeTabClick('other')}
                  >
                    Other
                  </button>
                </div>
              {/* )} */} 
              {/* --- END REMOVE --- */}

              <div ref={lifeContentAreaRef} className={styles.lifeContentArea}>
                <div ref={lifeGameTabRef} className={`${styles.lifeTabContent} ${activeLifeTab === 'game' ? styles.activeContent : ''}`}>
                  <div className={styles.gameGrid}>
                    {gameData.map(game => (
                      <ProjectCard 
                        key={game.id} 
                        project={game} 
                        onClick={handleLifeItemClick} // <-- Pass handler directly
                      />
                    ))}
                  </div>
                  {/* --- ADD Small Game Cards --- */}
                  <h4 className={styles.subSectionTitle}>还有这些也玩 / Also Play These</h4>
                  <div className={styles.smallGameGrid}>
                    {
                      [
                        'The Binding of Isaac: Rebirth',
                        'Terraria',
                        'Stardew Valley',
                        'Warframe',
                        'Deep Rock Galactic',
                        'Slay the Spire',
                        'Stellaris',
                        'RimWorld'
                      ].map((gameName) => (
                        <div key={gameName} className={styles.smallGameCard}>
                          {gameName}
                        </div>
                      ))
                    }
                  </div>
                  {/* --- END ADD --- */}
                </div>
                <div ref={lifeTravelTabRef} className={`${styles.lifeTabContent} ${activeLifeTab === 'travel' ? styles.activeContent : ''}`}>
                  <div className={styles.travelGrid}>
                    {travelData.map(place => (
                      <ProjectCard 
                        key={place.id} 
                        project={place} 
                        onClick={handleLifeItemClick} // <-- Pass handler directly
                      />
                    ))}
                  </div>
                </div>
                <div ref={lifeArtTabRef} className={`${styles.lifeTabContent} ${activeLifeTab === 'art' ? styles.activeContent : ''}`}>
                  <div className={styles.compactTextContainer}>
                  <p>艺术是个好东西，音乐、绘画、设计还是电影我都喜欢，可回想起来能做的能说的却很少，或许我可以晚点再写...</p>
              </div>
                </div>
                <div ref={lifeOtherTabRef} className={`${styles.lifeTabContent} ${activeLifeTab === 'other' ? styles.activeContent : ''} ${styles.compactTabContent}`}>
                  {/* --- ADD rendering for otherData --- */}
                  <div className={styles.gameGrid}> {/* Reuse gameGrid style */}
                    {otherData.map(item => (
                      <ProjectCard 
                        key={item.id} 
                        project={item} 
                        onClick={handleLifeItemClick} // <-- Pass handler directly
                      />
                    ))}
                  </div>
                  {/* --- END ADD --- */}
            </div>
              </div>
            </div>

            <div id="contact-section" ref={contactSectionRef} className={`${styles.contentSection} ${styles.contactSection}`}> {/* <-- ADD Ref */} 
              <h2>CONTACT</h2>
              <div className={styles.radarDisplay}>
                <div className={styles.scanner}></div>
                <div className={`${styles.radarRipple} ${styles.ripple1}`}></div>
                <div className={`${styles.radarRipple} ${styles.radarRippleSmall} ${styles.smallRipple1}`}></div>
                <div className={`${styles.radarRipple} ${styles.radarRippleSmall} ${styles.smallRipple2}`}></div>
                <div className={`${styles.radarRipple} ${styles.radarRippleSmall} ${styles.smallRipple3}`}></div>
              </div>

              <button
                type="button"
                className={`${styles.logItem} ${styles.radarContact1}`}
                onClick={handleCopyEmail}
              >
                <div className={styles.logIconContainer}>
                  <svg className={styles.logIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M3.00977 5.83789C3 5.28561 3.44772 4.83789 4 4.83789H20C20.5523 4.83789 21 5.28561 21 5.83789V17.1621C21 17.7144 20.5523 18.1621 20 18.1621H4C3.44772 18.1621 3 17.7144 3 17.1621V5.83789H3.00977ZM5.01817 6.83789L11.0535 11.4847C11.6463 11.9223 12.4249 11.9223 13.0177 11.4847L19.053 6.83789H5.01817Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className={styles.contactIconRipple}></div>
                <span className={styles.emailText}>rainmorime@qq.com</span>
                {isEmailCopied && <span className={styles.copyFeedback}>Copied!</span>}
              </button>
              <div className={`${styles.logItem} ${styles.radarContact2}`}>
                  <a href="https://github.com/RainMorime" target="_blank" rel="noopener noreferrer" className={styles.logLink}>
                    <div className={styles.logIconContainer}>
                      <svg className={styles.logIcon} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" fill="currentColor"></path>
                      </svg>
                    </div>
                    <div className={styles.contactIconRipple}></div>
                  </a>
              </div>
              <div className={`${styles.logItem} ${styles.radarContact3}`}>
                  <a href="https://space.bilibili.com/28913719" target="_blank" rel="noopener noreferrer" className={styles.logLink}>
                    <div className={styles.logIconContainer}>
                      <svg className={styles.logIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g>
                          <path fill="none" d="M0 0h24v24H0z"/>
                          <path fill="currentColor" d="M18.223 3.086a1.25 1.25 0 0 1 0 1.768L17.08 5.996h1.17A3.75 3.75 0 0 1 22 9.747v7.5a3.75 3.75 0 0 1-3.75 3.75H5.75A3.75 3.75 0 0 1 2 17.247v-7.5a3.75 3.75 0 0 1 3.75-3.75h1.166L5.775 4.855a1.25 1.25 0 1 1 1.767-1.768l2.652 2.652c.079.079.145.165.198.257h3.213c.053-.092.12-.18.199-.258l2.651-2.652a1.25 1.25 0 0 1 1.768 0zm.027 5.42H5.75a1.25 1.25 0 0 0-1.247 1.157l-.003.094v7.5c0 .659.51 1.199 1.157 1.246l.093.004h12.5a1.25 1.25 0 0 0 1.247-1.157l.003-.093v-7.5c0-.69-.56-1.25-1.25-1.25zm-10 2.5c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25zm7.5 0c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25z"/>
                        </g>
                      </svg>
                    </div>
                    <div className={styles.contactIconRipple}></div>
                  </a>
              </div>
              {/* --- ADD STEAM ICON --- */}
              <div className={`${styles.logItem} ${styles.radarContact4}`}>
                  <a href="https://steamcommunity.com/id/RainMorime/" target="_blank" rel="noopener noreferrer" className={styles.logLink}>
                    <div className={styles.logIconContainer}>
                         {/* --- Use new inline Steam SVG with currentColor --- */}
                         <svg className={styles.logIcon} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                           <path fill="currentColor" d="M15.974 0c-8.401 0-15.292 6.479-15.943 14.714l8.573 3.547c0.729-0.495 1.604-0.786 2.552-0.786 0.083 0 0.167 0.005 0.25 0.005l3.813-5.521v-0.078c0-3.328 2.703-6.031 6.031-6.031s6.036 2.708 6.036 6.036c0 3.328-2.708 6.031-6.036 6.031h-0.135l-5.438 3.88c0 0.073 0.005 0.141 0.005 0.214 0 2.5-2.021 4.526-4.521 4.526-2.177 0-4.021-1.563-4.443-3.635l-6.135-2.542c1.901 6.719 8.063 11.641 15.391 11.641 8.833 0 15.995-7.161 15.995-16s-7.161-16-15.995-16zM10.052 24.281l-1.964-0.813c0.349 0.724 0.953 1.328 1.755 1.667 1.729 0.719 3.724-0.104 4.443-1.833 0.349-0.844 0.349-1.76 0.005-2.599-0.344-0.844-1-1.495-1.839-1.844-0.828-0.349-1.719-0.333-2.5-0.042l2.026 0.839c1.276 0.536 1.88 2 1.349 3.276s-2 1.88-3.276 1.349zM25.271 11.875c0-2.214-1.802-4.021-4.016-4.021-2.224 0-4.021 1.807-4.021 4.021 0 2.219 1.797 4.021 4.021 4.021 2.214 0 4.016-1.802 4.016-4.021zM18.245 11.87c0-1.672 1.349-3.021 3.016-3.021s3.026 1.349 3.026 3.021c0 1.667-1.359 3.021-3.026 3.021s-3.016-1.354-3.016-3.021z"/>
                         </svg>
                         {/* --- End new Steam SVG --- */}
                      </div>
                      <div className={styles.contactIconRipple}></div>
                    </a>
                </div>
              {/* --- END STEAM ICON --- */}
            </div>

            <div id="about-section" ref={aboutSectionRef} className={`${styles.contentSection} ${styles.aboutSection}`}> 
              <Noise />
              <div ref={aboutContentRef}>
                <h2>ABOUT</h2>
                <div className={styles.footerInfo}>
                  <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
                    ICP备案: 陕ICP备2023011267号-1
                  </a>
                </div>
                <div className={styles.footerInfo}> 
                  © 2025 朴相霖 / RainMorime 版权所有
                </div>
              </div>
              <div className={styles.aboutImageContainer}>
                <img 
                  src="/pictures/www.rainmorime.com.png" 
                  alt="Website QR Code" 
                  className={styles.aboutImage} 
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Detail View Wrappers remain outside contentWrapper */}
      <div 
        className={`${styles.detailViewWrapper} ${activeSection === 'lifeDetail' ? styles.visible : styles.hidden}`}
      >
        {selectedLifeItem && (
          <LifeDetailView 
            item={selectedLifeItem}
          />
        )}
      </div>

      <div 
        className={`${styles.detailViewWrapper} ${activeSection === 'workDetail' ? styles.visible : styles.hidden}`}
      >
        {selectedWorkItem && (
          <WorkDetailView 
            item={selectedWorkItem}
          />
        )}
      </div>

      <div 
        className={`${styles.detailViewWrapper} ${activeSection === 'experienceDetail' ? styles.visible : styles.hidden}`}
      >
        {selectedExperienceItem && (
          <ExperienceDetailView 
            item={selectedExperienceItem}
          />
        )}
      </div>

      {/* Blog详情视图 */}
      <div 
        className={`${styles.detailViewWrapper} ${activeSection === 'blogDetail' ? styles.visible : styles.hidden}`}
      >
        {selectedBlogPost && (
          <BlogDetailView 
            item={selectedBlogPost}
          />
        )}
      </div>

      {/* 添加独立的Blog视图容器 */}
      <div 
        ref={blogViewWrapperRef} // <-- Assign the ref here
        className={`${styles.blogViewWrapper} ${activeSection === 'blog' ? styles.visible : styles.hidden}`}
      >
        <BlogView 
          onPostClick={handleBlogPostClick} 
        />
      </div>
    </div>
  );
}