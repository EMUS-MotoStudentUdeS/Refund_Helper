import { useEffect,useRef,useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { fieldCoordinates } from '../pdf/fieldCoordinates';

pdfjs.GlobalWorkerOptions.workerSrc=workerUrl;

function PdfPage({doc,pageNumber,debug,onCoordinate,onOpen}:{doc:PDFDocumentProxy;pageNumber:number;debug:boolean;onCoordinate:(p:{x:number;y:number})=>void;onOpen:()=>void}){
 const canvas=useRef<HTMLCanvasElement>(null);
 const[showFields,setShowFields]=useState(true);
 const[point,setPoint]=useState<{x:number;y:number}|null>(null);
 useEffect(()=>{let cancelled=false,task:ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']>|undefined;(async()=>{const page=await doc.getPage(pageNumber);const viewport=page.getViewport({scale:1.35});const c=canvas.current;if(!c||cancelled)return;c.width=viewport.width;c.height=viewport.height;c.style.width='100%';c.style.height='auto';task=page.render({canvas:c,canvasContext:c.getContext('2d')!,viewport});await task.promise})().catch(e=>{if(e?.name!=='RenderingCancelledException')console.error(e)});return()=>{cancelled=true;task?.cancel()}},[doc,pageNumber]);
 const click=(e:React.MouseEvent)=>{if(!debug||pageNumber!==1){onOpen();return}const c=canvas.current;if(!c)return;const r=c.getBoundingClientRect(),p={x:(e.clientX-r.left)*612/r.width,y:792-(e.clientY-r.top)*792/r.height};setPoint(p);onCoordinate(p);navigator.clipboard?.writeText(`x: ${p.x.toFixed(1)}, y: ${p.y.toFixed(1)}`).catch(()=>{})};
 return <div className="preview-page-shell"><div className={`canvas-wrap ${debug&&pageNumber===1?'debug':''}`} onClick={click}><canvas ref={canvas}/>{debug&&pageNumber===1&&<><div className="grid-overlay"/>{showFields&&Object.entries(fieldCoordinates).map(([name,p])=><span key={name} className="field-box" style={{left:`${p.x/612*100}%`,bottom:`${p.y/792*100}%`,width:`${('width'in p?p.width:p.size)/612*100}%`,height:`${(('height'in p&&p.height)||('size'in p&&p.size)||12)/792*100}%`}}>{name}</span>)}{point&&<span className="cross" style={{left:`${point.x/612*100}%`,bottom:`${point.y/792*100}%`}}/>}</>}</div>{debug&&pageNumber===1&&<label className="choice debug-toggle"><input type="checkbox" checked={showFields} onChange={e=>setShowFields(e.target.checked)}/>Afficher les champs</label>}<small className="page-number">Page {pageNumber}</small></div>
}

export function PdfPreview({bytes,debug=false}:{bytes?:Uint8Array;debug?:boolean}){
 const[doc,setDoc]=useState<PDFDocumentProxy>();
 const[fullscreen,setFullscreen]=useState(false);
 const[coordinate,setCoordinate]=useState<{x:number;y:number}|null>(null);
 useEffect(()=>{if(!bytes){setDoc(undefined);return}const task=pdfjs.getDocument({data:bytes.slice()});task.promise.then(setDoc).catch(console.error);return()=>{task.destroy()}},[bytes]);
 useEffect(()=>{if(!fullscreen)return;const close=(e:KeyboardEvent)=>e.key==='Escape'&&setFullscreen(false);document.addEventListener('keydown',close);document.body.classList.add('preview-open');return()=>{document.removeEventListener('keydown',close);document.body.classList.remove('preview-open')}},[fullscreen]);
 return <div className={`pdf-preview ${fullscreen?'fullscreen':''}`} aria-label="Aperçu du PDF">{fullscreen&&<div className="fullscreen-bar"><strong>Aperçu du PDF complet</strong><button type="button" onClick={()=>setFullscreen(false)}>Fermer ×</button></div>}{debug&&<div className="preview-toolbar">{coordinate?`x: ${coordinate.x.toFixed(1)}, y: ${coordinate.y.toFixed(1)} — copié`:'Cliquez sur la première page pour relever une coordonnée'}</div>}{!doc?<div className="preview-loading">Préparation de l’aperçu…</div>:<div className="preview-pages">{Array.from({length:doc.numPages},(_,i)=><PdfPage key={i+1} doc={doc} pageNumber={i+1} debug={debug} onCoordinate={setCoordinate} onOpen={()=>!debug&&setFullscreen(true)}/>)}</div>}{!fullscreen&&!debug&&doc&&<button type="button" className="fullscreen-hint" onClick={()=>setFullscreen(true)}>Agrandir l’aperçu</button>}</div>
}
