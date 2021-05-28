<!--
 * @Author: 张淦
 * @Date: 2020-02-29 18:45:33
 * @LastEditors: zhanggan
 * @Description: 发票系统
 * @FilePath: /gpay-ops-static/src/pages/invoice/iframePDF.vue
 -->
<template>
  <div class="invoice-pdf">
    <div v-if="PDFurl !== 'null'">
      <canvas id="pdf-canvas" />
      <el-button type="primary" @click="handleTarget"> 下载PDF文件 </el-button>
    </div>
    <div v-else>没有获取到发票地址</div>
  </div>
</template>

<script>
import PDFJS from "pdfjs-dist";
PDFJS.GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.js";
export default {
  data() {
    return {
      PDFurl: "",
    };
  },
  mounted() {
    this.PDFurl = decodeURIComponent(this.$route.params.PDFurl);
    if (location.href.indexOf("guahao.cn") > -1) {
      this.pdfToImg(
        decodeURIComponent(this.$route.params.PDFurl).replace(
          /^http:/,
          "https:"
        )
      );
    } else {
      this.pdfToImg(decodeURIComponent(this.$route.params.PDFurl));
    }
  },
  methods: {
    pdfToImg(url) {
      const loadingTask = PDFJS.getDocument({
        url: url,
        cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.2.228/cmaps/",
        cMapPacked: true,
      });
      loadingTask.promise.then(function (pdf) {
        pdf.getPage(1).then(function (page) {
          const canvas = document.getElementById("pdf-canvas");
          var scale = 1;
          const viewport = page.getViewport(scale);

          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          var renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          page.render(renderContext);
        });
      });
    },
    handleTarget() {
      window.location.href = this.PDFurl;
    },
  },
};
</script>
<style lang="less" scoped>
.invoice-pdf {
  margin: 20px;
  #pdf-canvas {
    display: block;
    width: 70%;
  }
}
</style>
