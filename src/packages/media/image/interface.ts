import type { IComponentType } from "@/types/component";
import { ERenderData } from '../../shared/index'

export default {
  id: '1',
  componentName: 'image',
  componentConfigName: 'image-config',
  componentType: 'image',
  name: '图片',
  props: {
    visible: {
      value: true,
      type: ERenderData.Normal,
    },
    url: '',
    animationName: '',
    openAnimation: false,
    fit: 'cover',
    animation: {
      name: '',
      duration: 3,
      number: -1,
    }
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
