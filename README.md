# low-code 可视化大屏编辑器

预览地址: http://39.106.20.75/#/login (直接登陆即可)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

## 大致流程已完成，组件较少

### 已知bug

    1. 右侧栏图层问题未处理
    
    3. 组件间拖拽辅助线未完成，没有好的想法
    
    4. 预览功能适配存在问题

    5. 图表配置坐标轴未处理

    6. 快捷键功能会覆盖全局
