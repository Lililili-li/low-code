import zhCN from "/public/sheet/locale/zh-cn.js";

export default function useSheetPlugin() {
  let sheetInstance: any
  const options = {
    showToolbar: false, // 顶部工具栏
    showBottomBar: false, // 底部工具栏,用CDN引入是没生效
    view: {
      height: () => 500,
      width: () => 800
    },
    col: {
      len: 12,//表格列数
      width: 100,
      indexWidth: 60,
      minWidth: 60
    },
    row: {
      len: 100,
      height: 30
    },
    style: {
      align: "center",
      bgcolor: "#333", //有文字的单元格背景
      color: "#fff", //单元格文字颜色
    }
  }
  const setLanguage = () => {
    (window as any).x_spreadsheet.locale("zh-cn", zhCN);
  }
  const initSheetInstance = (id:string, other: Record<string, never> = {}, data: Record<string, unknown>) => {
    setLanguage()
    sheetInstance = (window as any).x_spreadsheet(`#${id}`, {...options, ...other}).loadData(data) // load data
  }

  const getRowData = () => {
    return sheetInstance?.getData()[0].rows
  }
  return {
    initSheetInstance,
    getRowData,
    sheetInstance
  }
}
