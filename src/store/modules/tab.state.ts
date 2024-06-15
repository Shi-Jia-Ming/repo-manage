import { Module } from "vuex";
import router from "@/router";

export interface TabInterface {
  id: number,
  index?: number,
  tabName: string,
  routePath: string,
  routeName: string,
  active: boolean
}

export interface TabStateInterface {
  /**
   * the list of tabs that are currently open
   */
  tabList: Array<TabInterface>,
  /**
   * the name of the tabs that should be kept alive
   */
  keepAliveList: Array<string>
}

export const tabStore: Module<any, TabInterface> = {
  namespaced: true,
  state: {
    tabList: new Array<TabInterface>(),
    keepAliveList: new Array<string>()
  },
  mutations: {
    /**
     * add a tab to tabList. If the tab instance exists, switch the tab instead
     *
     * @param state current state
     * @param tab tab instance to add
     */
    add(state: TabStateInterface, tab: TabInterface) {
      console.log("tab.add");
      // find if there is an existing tab
      const index: number = state.tabList.findIndex((item: TabInterface) => item.routePath === tab.routePath);
      // if there isn't an existing tab, create a new one
      if (index === -1) {
        state.keepAliveList.push(tab.routeName);
        // deactivate other tab instance
        state.tabList.map((tabInstance: TabInterface) => {
          tabInstance.active = false;
        });
        state.tabList.push(tab);
        tab.active = true;
        // start from 0
        tab.index = state.tabList.length - 1;

        // push to the view
        router.push(tab.routePath)
          .then((res) => {
            console.log("router push ==> ", tab.routePath, " successful: ", res?.message);
          }).catch((err) => {
            console.log("router push ==>", tab.routePath, "failed, error: ", err?.message);
        });
      } else {
        // if there is an existing tab, switch to it
        state.tabList.map((tabInstance: TabInterface) => {
          tabInstance.active = false;
        });
        // set the tab active
        state.tabList[index].active = true;
        // push to the view
        router.push(tab.routePath)
          .then((res) => {
            console.log("router push ==> ", tab.routePath, " successful: ", res?.message);
          }).catch((err) => {
          console.log("router push ==>", tab.routePath, "failed, error: ", err?.message);
        });
      }
    },
    /**
     * remove a tab instance from tab list
     *
     * @param state current state
     * @param tab tab instance to remove
     */
    remove(state: TabStateInterface, tab: TabInterface) {
      console.log("tab/remove");
      // search if the tab exists
      const index: number = state.tabList.findIndex((item: TabInterface) => item.routePath === tab.routePath);
      const indexKeepAlive: number = state.keepAliveList.findIndex((tabName: string) => tabName === tab.routeName);

      if (index === -1) {
        // invalid tab
        console.log("invalid tab");
      } else if (state.tabList[index].active) {
        // the tab to delete is active
        if (state.tabList.length === 1) {
          // there is just one instance in tab list, jump to the default route
          state.tabList.splice(index, 1);
          if (indexKeepAlive !== -1) {
            state.keepAliveList.splice(indexKeepAlive, 1);
          }
          // push to the view
          router.push("/tab")
            .then((res) => {
              console.log("router push ==> ", "/tab", " successful: ", res?.message);
            }).catch((err) => {
            console.log("router push ==>", "/tab", "failed, error: ", err?.message);
          });
        } else {
          // there is one more instance in the tab list, jump to the last route
          state.tabList.splice(index, 1);
          if (indexKeepAlive !== -1) {
            state.keepAliveList.splice(indexKeepAlive, 1);
          }
          for (let i = tab.index!; i < state.tabList.length; i++) {
            state.tabList[i].index! -= 1;
          }
          // push to the view
          const indexToShow: number = Math.max(index - 1, 0);
          state.tabList.map((tabInstance: TabInterface) => {
            tabInstance.active = false;
          });
          state.tabList[indexToShow].active = true;
          router.push(state.tabList[indexToShow].routePath)
            .then((res) => {
              console.log("router push ==> ", state.tabList[indexToShow].routePath, " successful: ", res?.message);
            }).catch((err) => {
            console.log("router push ==>", state.tabList[indexToShow].routePath, "failed, error: ", err?.message);
          });
        }
      } else {
        // the tab to delete is inactive
        state.tabList.splice(index, 1);
        if (indexKeepAlive !== -1) {
          state.keepAliveList.splice(indexKeepAlive, 1);
        }
        for (let i = tab.index!; i < state.tabList.length; i++) {
          state.tabList[i].index! -= 1;
        }
      }
    }
  }
}