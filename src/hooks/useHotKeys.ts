import { useWorkStore } from "@/stores/useWorkStore";
import hotkeys from "hotkeys-js";
import { useDevice } from "./useDevice";
import useLayers from "./useLayers";
import { useComponentConfigStore } from "@/stores/useComponentConfigStore";
import { usePageConfigStore } from "@/stores/usePageConfigStore";
import { usePanelConfigStore } from "@/stores/usePanelConfigStore";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useLayersStore } from "@/stores/useLayersStore";

export default function useHotKeys() {
  const { undo, redo } = useWorkStore()
  const compConfigStore = useComponentConfigStore()
  const pageConfigStore = usePageConfigStore()
  const panelConfigStore = usePanelConfigStore()
  const layersStore = useLayersStore()
  const { isMac } = useDevice()
  const { copyComp, pasteComp, cutComp, removeLayer, unGroup, createGroup, changeVisible } = useLayers()


  const curCompId = computed(() => layersStore.layerState.curCompId)
  let canvasFocus: boolean | null = false
  const mousePosition = {
    x: 0,
    y: 0,
  }
  const hotkeysMap = [
    {
      window: 'ctrl+c',
      mac: 'command+c',
      action: copyComp,
      name: '复制'
    },
    {
      window: 'ctrl+v',
      mac: 'command+v',
      action: () => pasteComp(mousePosition),
      name: '粘贴'
    },
    {
      window: 'ctrl+x',
      mac: 'command+x',
      action: cutComp,
      name: '剪切'
    },
    {
      window: 'ctrl+p',
      mac: 'command+p',
      action: (activeComponent: any) => {
        if (activeComponent && compConfigStore.selectIds.length === 0) {
          changeVisible(activeComponent, activeComponent.props.visible.value ? false : true, false)
        } else {
          compConfigStore.selectIds.forEach(id => {
            const componentInfo = pageConfigStore.getCurrentPage().componentList.find(item => item.id === id)!
            if (componentInfo?.type === 'group') {
              changeVisible(componentInfo, componentInfo.props.visible.value ? false : true, true)
            } else {
              changeVisible(componentInfo, componentInfo.props.visible.value ? false : true, false)
            }
          })
        }
      },
      name: '显示/隐藏'
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
  ]

  const initHotKeys = () => {
    hotkeysMap.forEach(item => {
      hotkeys(isMac.value ? item.mac : item.window, function (event) {
        if (!canvasFocus) return
        event.preventDefault();
        const componentInfo = compConfigStore.activeComponent || pageConfigStore.getCurrentPage()?.componentList.find(item => item.id === curCompId.value)
        if (item.name === '删除') {
          item.action(componentInfo!.id as any)
        } else if (item.name === '粘贴') {
          item.action(mousePosition as any)
        } else {
          item.action(componentInfo as any)
        }
      });
    })
  }
  const handleGetMousePosition = (event: MouseEvent) => {
    mousePosition.x = event.offsetX;
    mousePosition.y = event.offsetY;
  }
  const handleTargetElementMouseDown = (targetElement: Element, event: MouseEvent) => {
    canvasFocus = targetElement?.contains(event.target as Node)
    if (canvasFocus) {
      mousePosition.x = event.offsetX;
      mousePosition.y = event.offsetY;
    }
  }
  onMounted(() => {
    const targetElement = document.querySelector('#screens') as Element | null
    targetElement?.addEventListener('mousemove', (event) => handleGetMousePosition(event as MouseEvent));
    document.addEventListener('mousedown', (event) => handleTargetElementMouseDown(targetElement!, event as MouseEvent));
    document.addEventListener('drop', (event) => handleTargetElementMouseDown(targetElement!, event as MouseEvent))
  })
  onUnmounted(() => {
    const targetElement = document.querySelector('#screens') as Element | null
    targetElement?.removeEventListener('mousemove', (event) => handleGetMousePosition(event as MouseEvent));
    document.removeEventListener('mousedown', (event) => handleTargetElementMouseDown(targetElement!, event as MouseEvent));
    document.removeEventListener('drop', (event) => handleTargetElementMouseDown(targetElement!, event as MouseEvent))
    canvasFocus = null
  })
  return {
    initHotKeys
  }
}
