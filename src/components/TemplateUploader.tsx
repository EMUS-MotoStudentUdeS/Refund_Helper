import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import type { TemplatePdf } from '../types/reimbursement';
import { formatBytes,MAX_FILE_BYTES } from '../utils/fileUtils';

export function TemplateUploader({
 template,
 onChange,
 onMessage,
}:{
 template?:TemplatePdf;
 onChange:(template?:TemplatePdf)=>void;
 onMessage:(message:string)=>void;
}){
 const[checking,setChecking]=useState(false);

 const select=async(file?:File)=>{
  if(!file)return;
  if(!file.name.toLowerCase().endsWith('.pdf')){
   onMessage('Le modèle personnalisé doit être un fichier PDF.');
   return;
  }
  if(file.size>MAX_FILE_BYTES){
   onMessage(`${file.name} dépasse 50 Mo.`);
   return;
  }
  setChecking(true);
  try{
   const document=await PDFDocument.load(await file.arrayBuffer());
   const pages=document.getPageCount();
   if(!pages)throw new Error('PDF sans page');
   onChange({file,pages});
   onMessage(`Modèle personnalisé chargé : ${file.name}.`);
  }catch{
   onMessage(`PDF illisible : ${file.name}`);
  }finally{
   setChecking(false);
  }
 };

 const dropzone=useDropzone({
  multiple:false,
  accept:{'application/pdf':['.pdf']},
  onDrop:files=>select(files[0]),
  onDropRejected:()=>onMessage('Le modèle personnalisé doit être un fichier PDF de 50 Mo ou moins.'),
 });

 return <section>
  <h2>Modèle PDF</h2>
  <p className="muted">Facultatif. La première page sera remplie comme le formulaire original. Les autres pages seront conservées, puis les factures seront ajoutées à la fin.</p>
  <div {...dropzone.getRootProps({className:`dropzone template-dropzone ${dropzone.isDragActive?'active':''}`})}>
   <input {...dropzone.getInputProps()} />
   <strong>{checking?'Vérification du PDF…':'Déposez un modèle PDF ici'}</strong>
   <span>ou cliquez pour remplacer le formulaire original</span>
   <small>PDF seulement · 50 Mo maximum</small>
  </div>
  {template&&<div className="template-file">
   <span className="file-icon">PDF</span>
   <div>
    <strong>{template.file.name}</strong>
    <small>{formatBytes(template.file.size)} · {template.pages} page{template.pages>1?'s':''}</small>
   </div>
   <button type="button" className="danger" onClick={()=>{onChange(undefined);onMessage('Le modèle original sera utilisé.')}}>Utiliser le modèle original</button>
  </div>}
 </section>;
}
