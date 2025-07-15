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

]
