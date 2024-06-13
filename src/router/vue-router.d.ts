import 'vue-router'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    icon?: string;
    iconActive?: string;
  }
}