export interface SidebarItem {
  title: string;
  name: string;
  keymap: string;
  icon: string;
  iconActive: string;
  component: () => Promise<any>;
}

const sidebarList: SidebarItem[] = [
  {
    title: "Repository",
    name: "repository",
    keymap: "",
    icon: "file.svg",
    iconActive: "file-active.svg",
    component: () => import("./components/Repository.vue")
  },
  {
    title: "HelloWorld",
    name: "hello-world",
    keymap: "",
    icon: "file.svg",
    iconActive: "file-active.svg",
    component: () => import("./components/HelloWorld.vue")
  }
];

export default sidebarList;