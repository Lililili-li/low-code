import type { IComponentType } from "@/types/component";
import { ERenderData } from '../../shared/index'

export default {
  id: '5',
  componentName: 'video',
  componentConfigName: 'video-config',
  componentType: 'video',
  name: '视频',
  props: {
    visible: {
      value: true,
      type: ERenderData.Normal,
    },
    url: 'http://qbi-resource.oss-cn-hangzhou.aliyuncs.com/%E8%A7%86%E9%A2%91%E7%B4%A0%E6%9D%90/10%E6%89%80%E5%A4%A7%E5%B1%8F%E8%83%8C%E6%99%AF%E8%A7%86%E9%A2%91.mp4',
    animationName: '',
    fit: 'cover',
    poster: '',
    autoPlay: true,
    loop: false,
    muted: true,
    controls: false,
  },
  eventConfig: [
    {
      // 事件绑定
      type: ERenderData.JSFunction,
      id: 'onClick',
      name: '点击事件',
      value: "function onClick(state, global, dataSource, methods) {\n\n}",
    },
  ],
  style: {
    left: 100,
    top: 100,
    width: 300,
    height: 200,
    scaleWidth: 300,
    scaleHeight: 200,
    zIndex: 1,
  },
} as IComponentType
