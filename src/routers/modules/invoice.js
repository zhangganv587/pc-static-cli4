/*
 * @Author: 张淦
 * @Date: 2020-02-09 15:58:13
 * @LastEditors: zhanggan
 * @Description: 发票系统
 * @FilePath: /pc-static-cli4/src/routers/modules/invoice.js
 */
const OrderManage = () =>
  import(
    /* webpackChunkName:'AccountMerchants'*/ "@/pages/invoice/orderManage.vue"
  );
const InvoiceAudit = () =>
  import(
    /* webpackChunkName:'AccountMerchants'*/ "@/pages/invoice/invoiceAudit.vue"
  );
// const InvoicePDF = () =>
//   import(
//     /* webpackChunkName:'AccountMerchants'*/ "@/pages/invoice/iframePDF.vue"
//   );
const InvoiceCompany = () =>
  import(
    /* webpackChunkName:'AccountMerchants'*/ "@/pages/invoice/invoiceCompany.vue"
  );
const RedInvoice = () =>
  import(
    /* webpackChunkName:'AccountMerchants'*/ "@/pages/invoice/redInvoice.vue"
  );

export default [
  // 对账管理
  {
    path: "/invoice/order",
    component: OrderManage,
    meta: {
      title: "发票订单管理",
    },
  },
  {
    path: "/invoice/audit/:order",
    component: InvoiceAudit,
    meta: {
      title: "发票审核",
    },
  },
  //   {
  //     path: "/invoice/pdf/:PDFurl",
  //     component: InvoicePDF,
  //     meta: {
  //       title: "查看发票",
  //     },
  //   },
  {
    path: "/invoice/company",
    component: InvoiceCompany,
    meta: {
      title: "开票企业管理",
    },
  },
  {
    path: "/invoice/red",
    component: RedInvoice,
    meta: {
      title: "红字发票管理",
    },
  },
];
