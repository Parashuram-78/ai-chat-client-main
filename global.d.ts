declare module 'html2pdf.js';

declare module 'rehype-raw' {
    import { Plugin } from 'unified';
    const rehypeRaw: Plugin<[], any>;
    export default rehypeRaw;
  }