export const MAX_FILES=20, MAX_FILE_BYTES=50*1024*1024, MAX_TOTAL_BYTES=150*1024*1024;
export const formatBytes=(n:number)=>n<1024?`${n} o`:n<1048576?`${(n/1024).toFixed(1)} Ko`:`${(n/1048576).toFixed(1)} Mo`;
export const getFileKind=(file:File):'pdf'|'image'|'docx'|null=>{ const ext=file.name.split('.').pop()?.toLowerCase(); if(ext==='pdf')return'pdf'; if(['jpg','jpeg','png','webp'].includes(ext||''))return'image'; if(ext==='docx')return'docx'; return null; };
export const imageFit=(w:number,h:number,maxW:number,maxH:number)=>{const scale=Math.min(maxW/w,maxH/h);return{width:w*scale,height:h*scale,scale};};
export const loadImage=(file:Blob)=>new Promise<HTMLImageElement>((resolve,reject)=>{const url=URL.createObjectURL(file);const img=new Image();img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Image illisible'))};img.src=url;});
