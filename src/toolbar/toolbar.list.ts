/**
 * ToolbarItem interface
 */
export interface ToolbarItem {
  title: string,
  keymap: string,
  action?: Function,
  children?: ToolbarItem[],
  active: boolean
}

/**
 * Toolbar list
 */
const toolbarList: ToolbarItem[] = [
  {
    title: "File",
    keymap: "Ctrl + E",
    action: () => {
      console.log("File clicked");
    },
    children: [
      {
        title: "child1",
        keymap: "Ctrl + E",
        active: false,
      },
      {
        title: "child2",
        keymap: "Ctrl + E",
        active: false,
      },
      {
        title: "child3",
        keymap: "Ctrl + E",
        active: false,
      }
    ],
    active: false,
  },
  {
    title: "File",
    keymap: "Ctrl + E",
    action: () => {
      console.log("File clicked");
    },
    active: false,
  }
]

export default toolbarList;