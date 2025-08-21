/**
 * 管理左侧组件书列表
 */
import logoList from '@/assets/images/component-list/index.js'
import { componentList } from '@/packages/index.js'

export default [
  {
    name: '柱状图',
    type: 'Chart',
    children: [
      {
        name: '渐变色柱状图',
        logo: logoList.bar,
        config: componentList['vertical-bar-config']
      }
    ]
  },
  {
    name: '媒体',
    type: 'Media',
    children: [
      {
        name: '图片',
        logo: logoList.image,
        config: componentList['image-config']
      },
      {
        name: '视频',
        logo: logoList.video,
        config: componentList['video-config']
      }
    ]
  },
]
