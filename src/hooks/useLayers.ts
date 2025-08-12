import { useComponentConfigStore } from "@/stores/useComponentConfigStore";
import { usePageConfigStore } from "@/stores/usePageConfigStore";
import type { IComponentType } from "@/types/component.d";
import { generateUUID, renderIcon } from "@/utils";
import message from "@/utils/message";
import { useClipboard } from "@vueuse/core";
import { computed, reactive, shallowRef, watch } from 'vue'
import {
  ArrowExportUp24Filled,
  ArrowDownload24Filled,
  ArrowSortDown24Filled,
  ArrowUp24Filled,
  CopySelect20Regular,
  Box24Regular,
  Cut24Filled,
  Document24Regular,
  Delete24Regular
} from '@vicons/fluent'
import { useLayersStore } from "@/stores/useLayersStore";
import hotkeys from 'hotkeys-js';
import { useDevice } from "./useDevice";
import { usePanelConfigStore } from "@/stores/usePanelConfigStore";
import { useWorkStore } from "@/stores/useWorkStore";
import dayjs from "dayjs";

export default function useLayers() {
  const pageConfigStore = usePageConfigStore();
  const compConfigStore = useComponentConfigStore()
  const panelConfigStore = usePanelConfigStore()
  const layersStore = useLayersStore()
  const { addHistory, undo, redo } = useWorkStore()
  const { isMac } = useDevice()
  const { text: clipboardText, isSupported, copy } = useClipboard()
  const mousePosition = reactive({
    x: 0,
    y: 0,
  })

  // 工具函数：过滤并设置 disabled
  function getOptions({
    excludeKeys = [],
    onlyKeys = [],
    disableAll = false,
    enableKeys = [],
    disableKeys = [],
  }: {
    excludeKeys?: string[],
    onlyKeys?: string[],
    disableAll?: boolean,
    enableKeys?: string[],
    disableKeys?: string[],
  }) {
    let options = dropdownOptions.value;
    if (onlyKeys.length) {
      options = options.filter(item => onlyKeys.includes(item.key));
    } else if (excludeKeys.length) {
      options = options.filter(item => !excludeKeys.includes(item.key));
    }
    return options.map(item => {
      let disabled = disableAll;
      if (enableKeys.includes(item.key)) disabled = false;
      if (disableKeys.includes(item.key)) disabled = true;
      return { ...item, disabled };
    });
  }
  const curCompId = computed(() => layersStore.layerState.curCompId)
  const dropdownOptions = shallowRef([
    {
      label: "创建区块",
      icon: renderIcon(Box24Regular),
      key: "createGroup",
      handle: () => createGroup(compConfigStore.selectIds),
    },
    {
      label: "解除区块",
      icon: renderIcon(Box24Regular),
      key: "removeGroup",
      handle: (component?: IComponentType) => unGroup(component),
    },
    {
      label: "复制",
      icon: renderIcon(CopySelect20Regular),
      key: "copy",
      handle: (component?: IComponentType) => copyComp(component),
    },
    {
      label: "粘贴",
      icon: renderIcon(Document24Regular),
      key: "paste",
      handle: () => pasteComp(),
    },
    {
      label: "剪切",
      icon: renderIcon(Cut24Filled),
      key: "cut",
      handle: (component?: IComponentType) => cutComp(component),
    },
    {
      label: "置顶",
      icon: renderIcon(ArrowExportUp24Filled),
      key: "top",
      handle: (component?: IComponentType) => topLayer(component),
    },
    {
      label: "置底",
      icon: renderIcon(ArrowDownload24Filled),
      key: "bottom",
      handle: (component?: IComponentType) => bottomLayer(component),
    },
    {
      label: "上移",
      icon: renderIcon(ArrowUp24Filled),
      key: "up",
      handle: (component?: IComponentType) => upLayer(component),
    },
    {
      label: "下移",
      icon: renderIcon(ArrowSortDown24Filled),
      key: "down",
      handle: (component?: IComponentType) => downLayer(component),
    },
    {
      label: "删除",
      icon: renderIcon(Delete24Regular),
      key: "delete",
      handle: (component?: IComponentType) => removeLayer(component?.id),
    },
  ]);

  const layerDropdownOptions = computed(() => dropdownOptions.value.filter(item => item.key !== 'createGroup' && item.key !== 'paste'));

  const panelDropdownOptions = computed(() => {
    // 没有选中组件或分组
    if (!curCompId.value) {
      if (!layersStore.getClipboardContent()) {
        // 全部禁用
        return getOptions({ excludeKeys: ['createGroup', 'removeGroup'], disableAll: true });
      }
      // 仅粘贴可用
      return getOptions({
        excludeKeys: ['createGroup', 'removeGroup'],
        disableAll: true,
        enableKeys: ['paste'],
      });
    }

    // 多选，允许分组和删除
    if (compConfigStore.selectIds.includes(curCompId.value) && compConfigStore.selectIds.length > 1) {
      return getOptions({ onlyKeys: ['createGroup', 'delete'], disableAll: false });
    }

    // 当前是分组
    const curComp = pageConfigStore.getCurrentPage()?.componentList.find(item => item.id === curCompId.value);
    if (curComp?.type === 'group') {
      if (!layersStore.getClipboardContent()) {
        // 粘贴禁用
        return getOptions({
          excludeKeys: ['createGroup'],
          disableAll: false,
          disableKeys: ['paste'],
        });
      }
      // 全部可用
      return getOptions({ excludeKeys: ['createGroup'], disableAll: false });
    }
    // 其他情况
    if (!layersStore.getClipboardContent()) {
      // 粘贴禁用
      return getOptions({
        excludeKeys: ['createGroup', 'removeGroup'],
        disableAll: false,
        disableKeys: ['paste'],
      });
    }
    // 全部可用
    return getOptions({ excludeKeys: ['createGroup', 'removeGroup'], disableAll: false });
  });
  // 创建一个分组
  const createGroup = (ids: string[]) => {
    // 获取当前页面的组件列表
    let componentList = pageConfigStore.getCurrentPage()?.componentList || [];
    // 过滤出id在ids数组中的组件
    let selectCompList = componentList.filter(item => ids.includes(item.id))
    selectCompList = selectCompList.flatMap(item => {
      if (item.type === 'group' && Array.isArray(item.children)) {
        return item.children;
      }
      return [item];
    });
    // 设置分组的样式
    const style = {
      width: 0,
      height: 0,
      left: 999900,
      top: 999999,
      zIndex: 0
    }
    let width = 0
    let height = 0
    const groupId = generateUUID();
    // 遍历选中的组件，计算分组的宽度和高度
    selectCompList?.forEach(item => {
      style.left = Math.min(style.left, item.style.left as number)
      style.top = Math.min(style.top, item.style.top as number)
      width = Math.max(width, (item.style.left as number) + (item.style.width as number))
      height = Math.max(height, (item.style.top as number) + (item.style.height as number))
      item.groupId = groupId; // 设置分组id
    })
    style.width = width - style.left
    style.height = height - style.top
    componentList = componentList.filter(item => !ids.includes(item.id))!
    const group = {
      componentName: '区块_' + groupId,
      componentConfigName: '区块',
      name: '区块_' + groupId,
      props: {
        visible: {
          value: true,
          type: 'Normal'
        },
      animationName: '',
      },
      style,
      children: selectCompList,
      id: groupId,
      type: 'group',
      componentType: 'group',
      eventConfig: []
    } as IComponentType
    componentList.push(group as any)
    compConfigStore.clearSelectGroupComponent()
    compConfigStore.selectIds.push(group.id)
    pageConfigStore.getCurrentPage()!.componentList = componentList
    layersStore.clearCurCompId()
    compConfigStore.setActiveComponent(group)
    addHistory({
      type: 'group',
      id: generateUUID(),
      label: '创建区块-' + groupId,
      componentId: [groupId],
      time: dayjs().format('MM-DD HH:mm'),
      props: group
    })
  }
  // 取消分组
  const unGroup = (componentInfo?: IComponentType) => {
    const component = pageConfigStore.getCurrentPage()?.componentList.find(item => item.id === curCompId.value)! || componentInfo
    const compConfigStore = useComponentConfigStore()
    compConfigStore.selectIds = compConfigStore.selectIds.filter(item => item !== component.id)
    component.children?.forEach(item => {
      pageConfigStore.addComponent(item)
      compConfigStore.selectIds.push(item.id)
    })
    pageConfigStore.removeComponent(component.id)
    compConfigStore.removeActiveComponent()
  }
  // 删除图层
  const removeLayer = (ids?: string) => {
    let comp: IComponentType
    if (ids) {
      ids.split(',').forEach(item => {
        comp = pageConfigStore.getCurrentPage()?.componentList.find(comp => comp.id === item)!
        addHistory({
          type: 'delete',
          id: generateUUID(),
          label: '删除-' + comp.name,
          componentId: [comp.id],
          time: dayjs().format('MM-DD HH:mm'),
          props: comp
        })
      })
    } else {
      comp = pageConfigStore.getCurrentPage()?.componentList.find(comp => comp.id === curCompId.value)!
      addHistory({
        type: 'delete',
        id: generateUUID(),
        label: '删除-' + comp.name,
        componentId: [comp.id],
        time: dayjs().format('MM-DD HH:mm'),
        props: comp
      })
    }
    pageConfigStore.removeComponent(curCompId.value! || ids!);
  }
  // 改变图层的可见性
  const changeVisible = (item: IComponentType, isVisible: boolean, isGroup: boolean = false) => {
    if (item.props.visible.type === 'JSExpression') return message.warning('JS表达式不可见性无法修改，请在代码编辑器中修改');
    if (isGroup) {
      item.children?.forEach((child: IComponentType) => {
        child.props.visible.value = isVisible;
      })
    }
    item.props.visible.value = isVisible;
  }
  // 上移一层图层
  const upLayer = (componentInfo?: IComponentType) => {
    const component = pageConfigStore.getCurrentPage()?.componentList.find(item => item.id === curCompId.value)! || componentInfo
    if (component.children && component.children.length > 0) {
      component.children.forEach(child => {
        (child.style.zIndex as number) += 1
      })
      return
    }
    component.style.zIndex = (component.style.zIndex as number) + 1;
  }
  const downLayer = (componentInfo?: IComponentType) => {
    const component = pageConfigStore.getCurrentPage()?.componentList.find(item => item.id === curCompId.value)! || componentInfo
    if (component.children && component.children.length > 0) {
      component.children.forEach(child => {
        (child.style.zIndex as number) = Math.max((child.style.zIndex as number) - 1, 0);
      })
      return
    }
    component.style.zIndex = Math.max((component.style.zIndex as number) - 1, 0);
  }
  // 置顶
  const topLayer = (componentInfo?: IComponentType) => {
    const component = pageConfigStore.getCurrentPage()?.componentList.find(item => item.id === curCompId.value)! || componentInfo
    if (component.children && component.children.length > 0) {
      component.children.forEach(child => {
        (child.style.zIndex as number) = 999999;
      })
      return
    }
    component.style.zIndex = 999999;
  }
  // 置顶
  const bottomLayer = (componentInfo?: IComponentType) => {
    const component = pageConfigStore.getCurrentPage()?.componentList.find(item => item.id === curCompId.value)! || componentInfo
    if (component.children && component.children.length > 0) {
      component.children.forEach(child => {
        (child.style.zIndex as number) = 0;
      })
      return
    }
    component.style.zIndex = 0;
  }
  // 复制
  const copyComp = (componentInfo?: IComponentType) => {
    if (!isSupported.value) return message.error('当前浏览器不支持复制功能，请使用chrome浏览器')
    layersStore.setCurCompId(componentInfo?.id || curCompId.value!)
    if (!curCompId.value) return message.warning('请先选择组件')
    const content = JSON.stringify(pageConfigStore.getCurrentPage()?.componentList.find(item => item.id === curCompId.value) || componentInfo)
    copy(content)
    layersStore.layerState.pasteType = 'copy';
    message.success('复制成功')
  }
  // 粘贴
  const pasteComp = () => {
    // 如果没有剪切内容直接返回
    if (!layersStore.getClipboardContent()) return
    if (layersStore.layerState.pasteType === 'copy') {
      const newComponent = JSON.parse(layersStore.getClipboardContent()!) as IComponentType;
      // 生成新的id
      newComponent.id = generateUUID();
      newComponent.name = newComponent.name.split('_')[0] + '_' + generateUUID();
      let { height, width, left, top } = newComponent.style;
      newComponent.style = {
        ...newComponent.style,
        left: mousePosition.x ? (mousePosition.x - (width as number) / 2) as number : (left as number) + 20,
        top: mousePosition.y ? (mousePosition.y - (height as number) / 2) as number : (top as number) + 20,
      }
      // 如果是分组，则需要处理子组件的id
      if (newComponent.type === 'group' && newComponent.children) {
        newComponent.children = newComponent.children.map(child => ({
          ...child,
          id: generateUUID(),
          style: {
            ...child.style,
            left: mousePosition.x ? (child.style.left as number) + ((mousePosition.x - (width as number) / 2) as number - (left as number)) : (child.style.left as number) + 20,
            top: mousePosition.y ? (child.style.top as number) + ((mousePosition.y - (height as number) / 2) as number - (top as number)) : (child.style.top as number) + 20,
          }
        }));
        compConfigStore.clearSelectGroupComponent();
        compConfigStore.selectIds.push(newComponent.id);
      } else {
        compConfigStore.setActiveComponent(newComponent);
      }
      // 添加到当前页面
      pageConfigStore.addComponent(newComponent);
    } else {
      const componentInfo = pageConfigStore.getCurrentPage()?.componentList.find(item => item.id === layersStore.getCutCompId())!
      let { height, width, left, top } = componentInfo.style;
      componentInfo.style = {
        ...componentInfo.style,
        left: (mousePosition.x - (width as number) / 2) as number,
        top: (mousePosition.y - (height as number) / 2) as number,
      }
      if (componentInfo.type === 'group' && componentInfo.children) {
        componentInfo.children = componentInfo.children.map(child => ({
          ...child,
          style: {
            ...child.style,
            left: (child.style.left as number) + ((mousePosition.x - (width as number) / 2) as number - (left as number)),
            top: (child.style.top as number) + ((mousePosition.y - (height as number) / 2) as number - (top as number)),
          }
        }));
      } else {
        compConfigStore.setActiveComponent(componentInfo);
      }
      layersStore.layerState.cutCompId = null
    }
    layersStore.clearCurCompId()
    layersStore.clearClipboardContent()
    copy(''); // 清空剪贴板
  }
  // 剪切
  const cutComp = (component?: IComponentType) => {
    if (!isSupported.value) return message.error('当前浏览器不支持复制功能，请使用chrome浏览器')
    const componentInfo = pageConfigStore.getCurrentPage()?.componentList.find(item => item.id === layersStore.layerState.cutCompId)! || component;
    layersStore.layerState.pasteType = 'cut';
    layersStore.setCurCompId(componentInfo?.id || curCompId.value!)
    copy(JSON.stringify(componentInfo))
    message.success('剪切成功')
  }
  watch(() => clipboardText.value, (n) => {
    layersStore.setClipboardContent(n);
  })

  const hotkeysMap = shallowRef([
    {
      window: 'ctrl+shift+c',
      mac: 'command+shift+c',
      action: copyComp,
      name: '复制'
    },
    {
      window: 'ctrl+shift+v',
      mac: 'command+shift+v',
      action: pasteComp,
      name: '粘贴'
    },
    {
      window: 'ctrl+x',
      mac: 'command+x',
      action: cutComp,
      name: '剪切'
    },
    {
      window: 'backspace',
      mac: 'backspace',
      action: removeLayer,
      name: '删除'
    },
    {
      window: 'ctrl+g',
      mac: 'command+g',
      action: () => {
        if (compConfigStore.activeComponent && compConfigStore.selectIds.includes(compConfigStore.activeComponent.id)) {
          unGroup(compConfigStore.activeComponent)
        } else {
          createGroup(compConfigStore.selectIds)
        }
      },
      name: '解除/创建 分组'
    },
    {
      window: 'l',
      mac: 'l',
      action: () => {
        panelConfigStore.panelSetting.panzoomOption.disableZoom = !panelConfigStore
          .panelSetting.panzoomOption.disableZoom;
      },
      name: '锁定'
    },
    {
      window: 'ctrl+z',
      mac: 'command+z',
      action: undo,
      name: '撤销'
    },
    {
      window: 'ctrl+Y',
      mac: 'command+Y',
      action: redo,
      name: '恢复'
    },
  ])

  const initHotKeys = () => {
    hotkeysMap.value.forEach(item => {
      hotkeys(isMac.value ? item.mac : item.window, function (event) {
        event.preventDefault(); // Prevent default behavior
        const componentInfo = compConfigStore.activeComponent || pageConfigStore.getCurrentPage()?.componentList.find(item => item.id === curCompId.value)
        if (item.name === '删除') {
          item.action(componentInfo!.id as any)
        } else {
          item.action(componentInfo as any)
        }
        // Add your custom logic here
      });
    })
  }
  // 鼠标移入高亮
  const onLayerHover = (id: string) => {
    compConfigStore.hoverIds.includes(id) ? '' : compConfigStore.hoverIds.push(id)
  }
  // 鼠标移出取消高亮
  const onLayerLeave = (id: string) => {
    compConfigStore.hoverIds.includes(id) ? compConfigStore.hoverIds.splice(compConfigStore.hoverIds.indexOf(id), 1) : ''
  }
  return {
    removeLayer,
    changeVisible,
    createGroup,
    unGroup,
    upLayer,
    downLayer,
    topLayer,
    bottomLayer,
    copyComp,
    pasteComp,
    cutComp,
    dropdownOptions,
    layerDropdownOptions,
    panelDropdownOptions,
    curCompId,
    mousePosition,
    initHotKeys,
    onLayerHover,
    onLayerLeave
  }
}
