<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

export interface ExposedMethods {
  validateSyntax: () => boolean;
}
// 定义 props
const props = withDefaults(
  defineProps<{
    modelValue: string | number | undefined
    language?: string
    theme?: string
    options?: monaco.editor.IStandaloneEditorConstructionOptions
  }>(),
  {
    language: 'javascript',
    theme: 'vs-dark',
    options: () => ({}),
  },
)

// 定义 emits
const emit = defineEmits(['update:modelValue', 'change'])

const editorContainer = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let completionProvider: monaco.IDisposable | null = null // 用于存储自定义提示的 disposable

// 示例：自定义代码提示 (JavaScript)
const setupCustomCompletions = () => {
  if (props.language === 'javascript') {
    // 如果已存在，先 dispose 掉旧的
    if (completionProvider) {
      completionProvider.dispose()
    }
    completionProvider = monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (model, position) => {
        // 获取当前行文本直到光标位置
        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        })

        const suggestions: monaco.languages.CompletionItem[] = []

        // 示例：如果输入 'myLogger.' 则提示 'log'
        if (textUntilPosition.endsWith('myLogger.')) {
          suggestions.push({
            label: 'log',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'log(message: string)',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Logs a message to the console.',
            range: monaco.Range.fromPositions(position), // 确保替换范围正确
          })
        }

        // 更多自定义提示规则...

        return {
          suggestions: suggestions,
        }
      },
    })
  }
}

onMounted(() => {
  if (editorContainer.value) {
    self.MonacoEnvironment = {
      getWorker(_, label) {
        if (label === 'json') {
          return new jsonWorker()
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
          return new cssWorker()
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
          return new htmlWorker()
        }
        if (label === 'typescript' || label === 'javascript') {
          return new tsWorker()
        }
        return new editorWorker()
      },
    }
    editor = monaco.editor.create(editorContainer.value, {
      value: (props.modelValue as string),
      language: props.language,
      theme: props.theme,
      automaticLayout: true,
      minimap: { enabled: false },
      readOnly: false,
      // 确保 'quickSuggestions' 和 'suggestOnTriggerCharacters' 等相关配置是开启的 (通常默认开启)
      quickSuggestions: {
        other: true, // 默认开启
        comments: true,
        strings: true,
      },
      tabSize: 2,
      suggestOnTriggerCharacters: true, // 默认开启
      tabCompletion: 'on', // 'on', 'off', 'onlySnippets'
      fontSize: 14,
      lineNumbersMinChars: 4, // 设置行号最小字符数为3（默认是5）
      lineDecorationsWidth: 5, // 设置行号区域宽度（默认是10）
      ...props.options,
    })

    editor.onDidChangeModelContent(() => {
      const value = editor?.getValue()
      if (value !== undefined) {
        emit('update:modelValue', value)
        emit('change', value)
      }
    })
    // 设置自定义代码提示
    setupCustomCompletions()
  }
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (editor && newValue !== editor.getValue() && newValue) {
      editor.setValue(newValue as string)
    }
  },
)

watch(
  () => props.language,
  (newLanguage, oldLanguage) => {
    if (editor && editor.getModel()) {
      monaco.editor.setModelLanguage(editor.getModel()!, newLanguage)
      // 语言改变后，重新设置自定义提示
      // 如果旧语言有自定义提示，可能需要先 dispose
      if (completionProvider && oldLanguage === 'javascript' && newLanguage !== 'javascript') {
        completionProvider.dispose()
        completionProvider = null
      }
      setupCustomCompletions()
    }
  },
)

watch(
  () => props.theme,
  (newTheme) => {
    if (editor) {
      monaco.editor.setTheme(newTheme)
    }
  },
)

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
    editor = null
  }
  // Dispose 自定义提示
  if (completionProvider) {
    completionProvider.dispose()
    completionProvider = null
  }
})

const validateSyntax = () => {
  return monaco.editor.getModelMarkers({}).length === 0
}
defineExpose<ExposedMethods>({ validateSyntax })
</script>

<template>
  <div ref="editorContainer" class="monaco-editor-container"></div>
</template>

<style lang="less" scoped>
.monaco-editor-container {
  width: 100%;
  height: 100%;
  min-height: 200px;
  border: 1px solid #666 !important;
  border-radius: 5px;
  overflow: hidden;
}

</style>
