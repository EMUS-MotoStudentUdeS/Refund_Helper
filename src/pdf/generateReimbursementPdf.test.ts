import { describe,expect,it,vi } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import type { ReceiptItem,ReimbursementData } from '../types/reimbursement';
import { generatePdf } from './generateReimbursementPdf';

const data:ReimbursementData={
 groupName:'EMUS',
 groupType:'technical',
 reimburseTo:'Test',
 refundMethod:'accesd',
 contact:'Test',
 phone:'',
 email:'test@usherbrooke.ca',
 amount:'10,00',
 purchaseTypes:['noRevenue'],
 otherDate:'',
 equipment:false,
 computerEquipment:false,
 itemOver2000:false,
 itemOver1500:false,
 equipmentLife:'',
 computerLife:'',
 project:'Projet',
 description:'Description',
 president:'Président',
 treasurer:'Trésorier',
 submittedDate:'2026-07-23',
 remember:false,
};

const pdfFile=async(name:string,pageSizes:[number,number][])=>{
 const document=await PDFDocument.create();
 pageSizes.forEach((size,index)=>document.addPage(size).drawText(`Page ${index+1}`));
 const bytes=new Uint8Array(await document.save());
 const buffer=bytes.buffer;
 return {
  name,
  type:'application/pdf',
  size:bytes.byteLength,
  arrayBuffer:async()=>buffer.slice(0),
 } as File;
};

describe('generatePdf avec un modèle téléversé',()=>{
 it('conserve toutes les pages du modèle avant les pages des factures',async()=>{
  const template=await pdfFile('modele.pdf',[[612,792],[500,700],[400,600]]);
  const invoice=await pdfFile('facture.pdf',[[300,400],[800,500]]);
  const receipts:ReceiptItem[]=[{
   id:'invoice-1',
   file:invoice,
   kind:'pdf',
   rotation:0,
   pages:2,
  }];
  const fetchSpy=vi.spyOn(globalThis,'fetch');

  try{
   const bytes=await generatePdf(data,receipts,false,{},template);
   const result=await PDFDocument.load(bytes);
   const sizes=result.getPages().map(page=>page.getSize());

   expect(fetchSpy).not.toHaveBeenCalled();
   expect(result.getPageCount()).toBe(5);
   expect(sizes).toEqual([
    {width:612,height:792},
    {width:500,height:700},
    {width:400,height:600},
    {width:612,height:792},
    {width:612,height:792},
   ]);
  }finally{
   fetchSpy.mockRestore();
  }
 });
});
