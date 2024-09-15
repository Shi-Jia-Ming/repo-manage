<script setup lang="ts">
import {onMounted, ref, Ref, watch} from "vue";
import {ArrowLeft, ArrowRight} from "@element-plus/icons-vue";
import {PdfDisplay} from "@/utils/pdf.display.ts";
import {ElScrollbar} from "element-plus";

const pdfUrl: Ref<string> = ref('/micromodelicaspec1.pdf');

const pdfContainer: Ref<HTMLElement | null> = ref(null);
const pdfPreviewer: Ref<HTMLElement | null> = ref(null);

const pdfScrollbar = ref<InstanceType<typeof ElScrollbar>>();

const pageNumber: Ref<number> = ref(1);

const renderScale = ref(1.1);

const display = new PdfDisplay();

// is the pdf sider visible
const isPdfSiderVisible: Ref<boolean> = ref(true);

onMounted(() => {
  display.displayPdf(pdfUrl.value, pdfContainer.value!, true, 4, 'page', renderScale.value, true, false, () => {});
  display.displayPdf(pdfUrl.value, pdfPreviewer.value!, true, 4, 'page', 0.25, false, true, (page: number) => {
    pageNumber.value = page;
    scrollToPage();
  });
})

watch(pageNumber, (value) => {
  if (value < 1) {
    pageNumber.value = 1;
  } else if (value > display.maxPageNumber) {
    pageNumber.value = display.maxPageNumber;
  }
});

const handleNextPage = () => {
  pageNumber.value++;
  scrollToPage();
};

const handlePreviousPage = () => {
  pageNumber.value--;
  scrollToPage();
};

const scrollToPage = () => {
  pdfScrollbar.value!.setScrollTop(display.canvasHeight * (pageNumber.value - 1));
};

const scroll = ({ scrollTop }: {scrollTop: number}) => {
  pageNumber.value = Math.round(scrollTop / display.canvasHeight) + 1;
};

const handleZoomIn = () => {
  renderScale.value += 0.1;
  display.displayPdf(pdfUrl.value, pdfContainer.value!, true, 4, 'page', renderScale.value, true, false, () => {});
};

const handleZoomOut = () => {
  renderScale.value -= 0.1;
  display.displayPdf(pdfUrl.value, pdfContainer.value!, true, 4, 'page', renderScale.value, true, false, () => {});
};

const handlePdfSiderCollapse = () => {
  isPdfSiderVisible.value = !isPdfSiderVisible.value;
};
</script>

<template>
  <div class="pdf-view">
    <div class="pdf-toolbar">
      <el-button type="text" icon="el-icon-upload2" @click="handlePdfSiderCollapse">Sidebar</el-button>

      <div class="resizing">
        <el-button type="text" @click="handleZoomIn">Zoom In</el-button>
        <el-button type="text" @click="handleZoomOut">Zoom Out</el-button>
      </div>

      <div class="page-group">
        <el-button type="text" @click="handlePreviousPage">
          <el-icon class="el-icon--left">
            <arrow-left/>
          </el-icon>
          Previous
        </el-button>
        <el-input v-model="pageNumber" type="number" size="small" style="width: 50px;"/>
        <el-button type="text" @click="handleNextPage">
          Next
          <el-icon class="el-icon--right">
            <arrow-right/>
          </el-icon>
        </el-button>
      </div>
    </div>
    <div class="pdf-main">
      <div class="pdf-sider" v-show="isPdfSiderVisible">
        <el-scrollbar>
          <div class="pdf-preview" ref="pdfPreviewer"/>
        </el-scrollbar>
      </div>
      <el-scrollbar
          class="pdf-scrollbar-container"
          ref="pdfScrollbar"
          @scroll="scroll">
        <div class="pdf-container" ref="pdfContainer"/>
      </el-scrollbar>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pdf-view {
  height: 100%;
  background-color: #ffffff;
}

.pdf-main {
  display: flex;
  flex-direction: row;
  height: 100%;

  .pdf-sider {
    width: 250px;
    background-color: #f0f0f0;
  }
}

.pdf-toolbar {
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  background-color: #f0f0f0;

  .page-group {
    //width: 100%;
  }
}

.pdf-scrollbar-container {
  width: 100%;
  justify-content: center;
}
</style>