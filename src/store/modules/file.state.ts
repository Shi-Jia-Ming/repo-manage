import {Module} from "vuex";
import {DataInterface} from "@/store";

export interface FileInterface extends DataInterface{
    id: number;
    index?: number;
    fileName: string;
    fileContent: File;
    active: boolean;
}

export interface FileStateInterface {
    /**
     * the list of files that are currently open
     */
    fileList: Array<FileInterface>;
    /**
     * the name of the files that should be kept alive
     */
    keepAliveList: Array<string>;
}

export const fileStore: Module<any, DataInterface> = {
    namespaced: true,
    state: {
        fileList: new Array<FileInterface>(),
        keepAliveList: new Array<string>()
    },
    mutations: {
        /**
         * add a file to fileList. If the file instance exists, switch the file instead
         *
         * @param state current state
         * @param file file instance to add
         */
        add(state: FileStateInterface, file: FileInterface) {
            console.log("file.add");
            // find if there is an existing file        TODO judge if the file is already exist through the file name
            const index: number = state.fileList.findIndex((item: FileInterface) => item.fileName === file.fileName);
            // if there isn't an existing file, create a new one
            if (index === -1) {
                state.keepAliveList.push(file.fileName);
                // deactivate other file instance
                state.fileList.map((fileInstance: FileInterface) => {
                    fileInstance.active = false;
                });
                state.fileList.push(file);
                file.active = true;
                // start from 0
                file.index = state.fileList.length - 1;
            } else {
                // if there is an existing file, switch to it
                state.fileList.map((fileInstance: FileInterface) => {
                    fileInstance.active = false;
                });
                state.fileList[index].active = true;
                state.fileList[index].index = index;
            }
        },
    }
}