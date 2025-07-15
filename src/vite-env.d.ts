/// <reference types="vite/client" />
declare module "*.vue" {
  import { Component } from "vue";
  const component: Component;
  const ExposedMethods: {validateSyntax: () => boolean;}
  export default component;
}
