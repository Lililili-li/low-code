/**
 * 管理左侧组件书列表
 */
import logoList from '@/assets/images/component-list/index.js'
import { componentList } from '@/components'

export default [
  {
    name: '纵向柱状图',
    logo: logoList.bar,
    type: 'Chart',
    config: componentList['vertical-bar-config']
  }
]
