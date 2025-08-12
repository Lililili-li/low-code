import type { IComponentType } from "@/types/component.d";
import type { IStateType } from "./variable";
import type { IDataSource } from "./dataSource";
import type { AdaptationEnum } from "./panel";

export interface IPage {
  componentName: string;
  state: IStateType
  id: string | number
  componentList: IComponentType[]
  dataSource: IDataSource[]
  methods: any,
  props: Record<string, any>
  adaptation: AdaptationEnum
  style: {
    width: number
    height: number
    useImage: number
    backgroundUrl: string
    backgroundColor: string
  }
}


