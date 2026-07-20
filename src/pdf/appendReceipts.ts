import { PDFDocument,StandardFonts,rgb,degrees } from 'pdf-lib';
import html2canvas from 'html2canvas';
import mammoth from 'mammoth/mammoth.browser';
import type { ReceiptItem } from '../types/reimbursement';
import { fitPdfPageToLetter,imageFit,loadImage } from '../utils/fileUtils';

const PAGE:[number,number]=[612,792];

const toPng=async(file:File,rotation:number)=>{const img=await loadImage(file);const rad=((rotation%360)+360)%360;const swap=rad===90||rad===270;const canvas=document.createElement('canvas');canvas.width=swap?img.height:img.width;canvas.height=swap?img.width:img.height;const c=canvas.getContext('2d')!;c.translate(canvas.width/2,canvas.height/2);c.rotate(rad*Math.PI/180);c.drawImage(img,-img.width/2,-img.height/2);return new Promise<Blob>((ok,no)=>canvas.toBlob(b=>b?ok(b):no(new Error('Conversion image impossible')),'image/png'))};

const appendPdf=async(out:PDFDocument,file:File,userRotation:number)=>{
 const src=await PDFDocument.load(await file.arrayBuffer());
 for(const sourcePage of src.getPages()){
  const embedded=await out.embedPage(sourcePage);
  const {width,height}=sourcePage.getSize();
  const rotation=(sourcePage.getRotation().angle+userRotation)%360;
  const fit=fitPdfPageToLetter(width,height,rotation);
  const target=out.addPage(PAGE);
  target.drawPage(embedded,{x:fit.x,y:fit.y,xScale:fit.scale,yScale:fit.scale,rotate:degrees(fit.rotation)});
 }
};

const appendImage=async(out:PDFDocument,file:File,rotation:number,label:string)=>{const blob=await toPng(file,rotation);const bytes=await blob.arrayBuffer();const image=await out.embedPng(bytes);const page=out.addPage(PAGE);const font=await out.embedFont(StandardFonts.Helvetica);page.drawText(label,{x:24,y:765,size:8,font,color:rgb(.25,.25,.25),maxWidth:564});const fit=imageFit(image.width,image.height,564,720);page.drawImage(image,{x:(612-fit.width)/2,y:24+(720-fit.height)/2,width:fit.width,height:fit.height});};

const appendDocx=async(out:PDFDocument,file:File,index:number)=>{const result=await mammoth.convertToHtml({arrayBuffer:await file.arrayBuffer()});const host=document.createElement('div');Object.assign(host.style,{position:'fixed',left:'-10000px',top:'0',width:'760px',padding:'40px',background:'white',color:'black',fontFamily:'Arial'});host.innerHTML=result.value;document.body.appendChild(host);try{const canvas=await html2canvas(host,{backgroundColor:'#fff',scale:1.5});const slicePx=Math.floor(canvas.width*720/564);for(let top=0;top<canvas.height;top+=slicePx){const part=document.createElement('canvas');part.width=canvas.width;part.height=Math.min(slicePx,canvas.height-top);part.getContext('2d')!.drawImage(canvas,0,top,canvas.width,part.height,0,0,canvas.width,part.height);const blob=await new Promise<Blob>((ok,no)=>part.toBlob(b=>b?ok(b):no(new Error('DOCX illisible')),'image/png'));const img=await out.embedPng(await blob.arrayBuffer());const page=out.addPage(PAGE);const fit=imageFit(img.width,img.height,564,720);page.drawText(`Facture ${index} — ${file.name} (conversion Word approximative)`,{x:24,y:765,size:8});page.drawImage(img,{x:(612-fit.width)/2,y:24+(720-fit.height)/2,width:fit.width,height:fit.height});}}finally{host.remove()}};

export const appendReceipts=async(out:PDFDocument,items:ReceiptItem[])=>{for(let i=0;i<items.length;i++){const item=items[i];if(item.kind==='pdf')await appendPdf(out,item.file,item.rotation);else if(item.kind==='image')await appendImage(out,item.file,item.rotation,`Facture ${i+1} — ${item.file.name}`);else await appendDocx(out,item.file,i+1);}};
