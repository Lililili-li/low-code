import type { AxisHelperType } from "@/types/panel";
export enum AxisHelperDirectionEnum {
  VERTICAL = "vertical",
  HORIZONTAL = "horizontal",
}

export const axisHelperConfigList: AxisHelperType[] = [
  {
    name: "左中",
    distance: -100,
    style: {
      top: "50%",
      transform: "translateY( -50%)",
      width: "100px",
      height: "1px",
      left: "-100px",
    },
    direction: AxisHelperDirectionEnum.VERTICAL,
    visible: false,
    label: 1
  },
  {
    name: "左上",
    distance: 100,
    style: {
      top: "0",
      width: "100px",
      height: "1px",
      left: "-100px",
    },
    direction: AxisHelperDirectionEnum.VERTICAL,
    visible: false,
    label: 2
  },
  {
    name: "左下",
    distance: 100,
    style: {
      bottom: "0",
      width: "100px",
      height: "1px",
      left: "-100px",
    },
    direction: AxisHelperDirectionEnum.VERTICAL,
    visible: false,
    label: 3
  },
  {
    name: "右中",
    distance: 100,
    style: {
      top: "50%",
      transform: "translateY( -50%)",
      width: "100px",
      height: "1px",
      right: "-100px",
    },
    direction: AxisHelperDirectionEnum.VERTICAL,
    visible: false,
    label: 4
  },
  {
    name: "右上",
    distance: 100,
    style: {
      top: "0",
      width: "100px",
      height: "1px",
      right: "-100px",
    },
    direction: AxisHelperDirectionEnum.VERTICAL,
    visible: false,
    label: 5
  },
  {
    name: "右下",
    distance: 100,
    style: {
      bottom: "0",
      width: "100px",
      height: "1px",
      right: "-100px",
    },
    direction: AxisHelperDirectionEnum.VERTICAL,
    visible: false,
    label: 6
  },
  {
    name: "上中",
    distance: -100,
    style: {
      left: "50%",
      transform: "translateX(-50%)",
      height: "100px",
      width: "1px",
      top: "-100px",
    },
    direction: AxisHelperDirectionEnum.HORIZONTAL,
    visible: false,
    label: 7
  },
  {
    name: "上左",
    distance: 200,
    style: {
      left: "0",
      height: "200px",
      width: "1px",
      top: "-200px",
    },
    direction: AxisHelperDirectionEnum.HORIZONTAL,
    visible: false,
    label: 8
  },
  {
    name: "上右",
    distance: 100,
    style: {
      right: "0",
      height: "100px",
      width: "1px",
      top: "-100px",
    },
    direction: AxisHelperDirectionEnum.HORIZONTAL,
    visible: false,
    label: 9
  },
  {
    name: "下中",
    distance: 100,
    style: {
      left: "50%",
      transform: "translateX(-50%)",
      height: "100px",
      width: "1px",
      bottom: "-100px",
    },
    direction: AxisHelperDirectionEnum.HORIZONTAL,
    visible: false,
    label: 10
  },
  {
    name: "下左",
    distance: 100,
    style: {
      left: "0",
      height: "100px",
      width: "1px",
      bottom: "-100px",
    },
    direction: AxisHelperDirectionEnum.HORIZONTAL,
    visible: false,
    label: 11
  },
  {
    name: "下右",
    distance: 100,
    style: {
      right: "0",
      height: "100px",
      width: "1px",
      bottom: "-100px",
    },
    direction: AxisHelperDirectionEnum.HORIZONTAL,
    visible: false,
    label: 12
  },
]
