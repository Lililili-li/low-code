/**
 * 管理所有组件
 */
import VerticalBar from './chart/vertical-bar/index.ts'
import Image from './media/image/index.ts'
import Video from './media/video/index.ts'

export const componentMap = {
  'vertical-bar': VerticalBar.VerticalBarComponent,
  'image': Image.ImageComponent,
  'video': Video.VideoComponent,
}
export const componentConfigMap = {
  'vertical-bar-config': VerticalBar.VerticalBarConfigComponent,
  'image-config': Image.ImageConfigComponent,
  'video-config': Video.VideoConfigComponent,
}
export const componentList = {
  'vertical-bar-config': VerticalBar.VerticalBarConfig,
  'image-config': Image.ImageConfig,
  'video-config': Video.VideoConfig,
}


