import {
    getDocument,
    GlobalWorkerOptions,
    type PageViewport,
    type PDFDocumentProxy,
    type PDFPageProxy
} from "pdfjs-dist";
import type {RenderParameters, TextContent} from "pdfjs-dist/types/src/display/api";
import {TextLayerBuilder} from "pdfjs-dist/web/pdf_viewer.mjs";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import "pdfjs-dist/web/pdf_viewer.css";

GlobalWorkerOptions.workerSrc = pdfWorker;

export class PdfDisplay {
    allCanvasParentNodeClassName: string = 'canvas-parent-container';

    canvasHeight: number = 0;
    maxPageNumber: number = 0;

    canvasList: Array<HTMLCanvasElement> = new Array<HTMLCanvasElement>();

    displayPdf(pdfURL: string, parentNode: HTMLElement, isAllPages: boolean, page: number, canvasClassName: string, customScale: number, needText: boolean, needClickEvent: boolean, callback: Function) {
        const children = parentNode.childNodes;
        for (let i = 0; i < children.length; i++) {
            parentNode.removeChild(children[i]);
        }
        const loadingTask = getDocument(pdfURL);
        loadingTask.promise.then(async (pdf) => {
            const pageNumber = isAllPages ? pdf._pdfInfo.numPages : page;
            this.maxPageNumber = pageNumber;

            const outputScale = window.devicePixelRatio || 1;

            const allCanvasParentNode = document.createElement('div');
            allCanvasParentNode.className = this.allCanvasParentNodeClassName;
            allCanvasParentNode.setAttribute('style', `
            width: 100%;
            height: 100%;
            overflow: hidden;
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #f1f3f5;
        `);

            parentNode.appendChild(allCanvasParentNode);

            for (let i = 1; i <= pageNumber; ++i) {
                await this.mainAreaAsyncRender(pdf, needText, i, customScale, canvasClassName, outputScale, allCanvasParentNode, needClickEvent, callback);
            }
        });
    }

    private async mainAreaAsyncRender(pdf: PDFDocumentProxy, needText: boolean, pageNumber: number, customScale: number, canvasClassName: string, outputScale: number, allCanvasParentNode: HTMLElement, needClickEvent: boolean, callback: Function) {
        const page = await pdf.getPage(pageNumber);

        const scale = customScale || 1.4;
        if (needText)
            document.documentElement.style.setProperty('--scale-factor', scale.toString());

        const viewPort = page.getViewport({scale});

        const canvasContainer = document.createElement('div');
        const canvas = document.createElement("canvas");
        canvas.className = canvasClassName || ``;
        const context = canvas.getContext('2d');

        canvas.width = Math.floor(viewPort.width * outputScale);
        canvas.height = Math.floor(viewPort.height * outputScale);

        canvas.style.width = Math.floor(viewPort.width) + "px";

        canvasContainer.setAttribute('style', `
            position: relative;
            border: 5px solid #f1f1f1;
            margin-bottom: 10px;
            width: ${Math.floor(viewPort.width)}px;
            height: ${Math.floor(viewPort.height)}px;
        `);

        canvas.setAttribute('style', `
            position: absolute;
            width: ${Math.floor(viewPort.width)}px;
            height: ${Math.floor(viewPort.height)}px;
        `);

        this.canvasHeight = Math.floor(viewPort.height) + 13 * outputScale;

        const transform = (outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined);

        const renderContext: RenderParameters = {
            canvasContext: context!,
            transform: transform,
            viewport: viewPort,
        };

        const renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
            return page.getTextContent();
        }).then((textContent) => {
            if (needText) {
                this.displayText(textContent, canvas, page, viewPort);
            }
        });

        canvasContainer.appendChild(canvas);
        this.canvasList.push(canvas);
        allCanvasParentNode.appendChild(canvasContainer);
        if (needClickEvent) {
            canvas.addEventListener('click', () => {
                callback(pageNumber);
            });
        }
    }

    private async displayText(textContent: TextContent, canvas: HTMLCanvasElement, page: PDFPageProxy, viewport: PageViewport) {
        const textLayerDiv = document.createElement("div");
        textLayerDiv.setAttribute('class', 'textLayer');

        textLayerDiv.setAttribute('style', `
            width: ${viewport.width}px;
            height: ${viewport.height}px;
            overflow: hidden;
            position: absolute;
        `);

        const pageDom = canvas.parentNode;
        pageDom!.appendChild(textLayerDiv);

        const text = new TextLayerBuilder({
            pdfPage: page
        });

        text.div = textLayerDiv;
        await text.render(viewport, textContent);
    }

    zoomIn() {
        this.canvasList.forEach((canvas) => {
            canvas.style.height = `${this.canvasHeight * 1.1}px`;
            canvas.style.width = `${canvas.width * 1.1}px`;
        });
    }
}
