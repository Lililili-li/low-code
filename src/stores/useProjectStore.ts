import type { IStateType } from "@/types/variable";
import axios from "axios";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { useVariableStore } from "./useVariableStore";

export const useProjectStore = defineStore('project', () => {
  const projectConf = reactive({
    id: 1,
    name: '',
  })
  const schema = ref({
    state: {} as IStateType,
    methods: {},
  })

  const setState = (state: IStateType) => {
    schema.value.state = state
  }
  const setStateMethod = (method: any) => {
    schema.value.methods = method
  }
  const getProjectData = async () => {
    const variableStore = useVariableStore()
    const { data: res } = await axios.get("/project/1");
    if (res.code === 200) {
      projectConf.id = res.data.id
      projectConf.name = res.data.name
      schema.value = res.data.schema ? JSON.parse(res.data.schema) : { state: {}, methods: {} }
      variableStore.setVariableList(schema.value.state, 'global')
    }
  };

  return {
    projectConf,
    setState,
    setStateMethod,
    getProjectData,
    schema
  }
})
