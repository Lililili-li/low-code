export type PanelSettingType = {
  thick: number,
  width: number,
  height: number,
  paddingRatio: number,
  showRuler: boolean,
  gridRatio: number,
  showShadowText: boolean,
  selfHandle: boolean,
  palette: PaletteType,
  isShowReferLine: boolean,
  panzoomOption: PanzoomOptionType,
  autoCenter: boolean,
  startX: number,
  startY: number,
}

export type PanzoomOptionType = {
  animate: boolean,
  disableZoom: boolean,
  maxScale: number,
  minScale: number,
  duration: number,
  step: number,
  canvas?: boolean,
  startX: number,
  startY: number,
}
type PaletteType = {
  bgColor: string;
  longfgColor: string;
  shortfgColor: string;
  fontColor: string;
  shadowColor: string;
  lineColor: string;
  borderColor: string;
  cornerActiveColor: string;
}
export type panelScaleConfType = {
  scale: number,
  disableZoom: boolean,
}

export type MoveStateType = {
  startX: number,
  startY: number,
  moveX: number,
  moveY: number,
  isMoving: boolean,
  isResize: boolean,
}
export type DirectionLabelType = {
  style: CSSProperties,
  direction: number,
  name: string,
  moveFunc?: (moveX: number, moveY: number, moveState: MoveStateType) => void,
}
export type AxisHelperType = {
  style: CSSProperties,
  name: string,
  distance: number,
  direction: string,
  visible: boolean,
  label: number,
}

export type AttributeType = {
  label: string,
  key: string,
}
