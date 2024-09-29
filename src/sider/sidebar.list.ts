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
        title: "Document",
        name: "document",
        keymap: "",
        icon: "document-list",
        iconActive: "document-list-active",
        component: () => import("@/sider/components/Document.vue")
    }
];

export default sidebarList;