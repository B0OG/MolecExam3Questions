/* Gluconeogenesis slide references. Original slides remain on the student's device. */
(function(){
"use strict";
const slidesByQuestion=Object.freeze({
"GN-USMLE-20261111-001":[5,8],"GN-USMLE-20261111-002":[7,14],
"GN-USMLE-20261111-003":[8,9],"GN-USMLE-20261111-004":[10,11],
"GN-USMLE-20261111-005":[6,12],"GN-USMLE-20261111-006":[6,14],
"GN-USMLE-20261111-007":[5,11],
"GN-INTRO-20261111-001":[5,8],"GN-INTRO-20261111-002":[5,9],
"GN-INTRO-20261111-003":[5,11],"GN-INTRO-20261111-004":[5,11],
"GN-INTRO-20261111-005":[6],"GN-INTRO-20261111-006":[7],
"GN-INTRO-20261111-007":[7],"GN-INTRO-20261111-008":[7],
"GN-INTRO-20261111-009":[7],"GN-INTRO-20261111-010":[8],
"GN-INTRO-20261111-011":[9],"GN-INTRO-20261111-012":[10],
"GN-INTRO-20261111-013":[10],"GN-INTRO-20261111-014":[10,11],
"GN-INTRO-20261111-015":[10],"GN-INTRO-20261111-016":[6,12],
"GN-INTRO-20261111-017":[12],"GN-INTRO-20261111-018":[14],
"GN-INTRO-20261111-019":[14],"GN-INTRO-20261111-020":[14],
"GN-EXAM-20261111-001":[5,11],"GN-EXAM-20261111-002":[5,11],
"GN-EXAM-20261111-003":[6,14],"GN-EXAM-20261111-004":[7],
"GN-EXAM-20261111-005":[7],"GN-EXAM-20261111-006":[8,9],
"GN-EXAM-20261111-007":[10],"GN-EXAM-20261111-008":[10,11],
"GN-EXAM-20261111-009":[10],"GN-EXAM-20261111-010":[6,12],
"GN-EXAM-20261111-011":[12],"GN-EXAM-20261111-012":[14],
"GN-EXAM-20261111-013":[14],"GN-EXAM-20261111-014":[14]
});
let lecturePdf=null,pdfJsPromise=null;
const style=document.createElement("style");
style.textContent=[
"#quiz .lecture-slide-details{margin:13px 0 0;border-top:1px solid var(--chrome-border);padding-top:10px}",
"#quiz .lecture-slide-details>summary{font-weight:650;color:var(--accent);padding:4px 0;cursor:pointer}",
"#quiz .lecture-slide-body{padding:8px 0 2px;min-width:0}",
"#quiz .lecture-slide-picker{display:flex;flex-direction:column;align-items:flex-start;gap:8px}",
"#quiz .lecture-slide-picker input{max-width:100%;font-size:.85rem}",
"#quiz .lecture-slide-figure{margin:12px 0 16px}",
"#quiz .lecture-slide-caption{display:block;font-weight:650;margin-bottom:7px}",
"#quiz .lecture-slide-fit{font-size:.76rem;padding:5px 8px;margin:0 0 6px}",
"#quiz .lecture-slide-scroller{max-width:100%;overflow-x:auto;border:1px solid var(--chrome-border);border-radius:6px;background:#fff;overscroll-behavior-x:contain}",
"#quiz .lecture-slide-scroller canvas{display:block;max-width:none;height:auto}",
"#quiz .lecture-slide-scroller.fit canvas{width:100%!important;min-width:0!important}",
"#quiz .lecture-slide-help{font-size:.78rem;color:var(--muted);margin:6px 0}"
].join("\n");
document.head.append(style);
function loadPdfJs(){
 if(window.pdfjsLib)return Promise.resolve(window.pdfjsLib);
 if(!pdfJsPromise)pdfJsPromise=new Promise((resolve,reject)=>{
  const s=document.createElement("script");
  s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  s.async=true;
  s.onload=()=>window.pdfjsLib?resolve(window.pdfjsLib):reject(Error("PDF.js did not initialize"));
  s.onerror=()=>reject(Error("PDF viewer library unavailable"));
  document.head.append(s);
 }).then(lib=>{
  lib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  return lib;
 }).catch(err=>{pdfJsPromise=null;throw err});
 return pdfJsPromise;
}
async function choosePdf(file){
 if(!file||!(/\.pdf$/i.test(file.name)||file.type==="application/pdf"))throw Error("Choose the original lecture PDF");
 const lib=await loadPdfJs();
 const pdf=await lib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;
 const text=(await (await pdf.getPage(1)).getTextContent()).items.map(item=>item.str).join(" ");
 if(pdf.numPages!==15||!/gluconeogenesis/i.test(text)){
  await pdf.destroy();
  throw Error("Expected the original 15-slide Gluconeogenesis lecture PDF");
 }
 if(lecturePdf)await lecturePdf.destroy();
 lecturePdf=pdf;
}
async function renderPages(details,numbers){
 const body=details.querySelector(".lecture-slide-body");body.replaceChildren();
 const hint=document.createElement("p");hint.className="lecture-slide-help";
 hint.textContent="The PDF stays on your device. On mobile, scroll sideways for readable text or select Fit to screen.";
 body.append(hint);
 for(const number of numbers){
  if(!details.isConnected||!details.open)return;
  const page=await lecturePdf.getPage(number);
  const figure=document.createElement("figure");figure.className="lecture-slide-figure";
  const caption=document.createElement("figcaption");caption.className="lecture-slide-caption";
  caption.textContent="Original lecture slide "+number;
  const button=document.createElement("button");button.type="button";button.className="lecture-slide-fit";
  button.textContent="Fit to screen";
  const scroll=document.createElement("div");scroll.className="lecture-slide-scroller";
  const canvas=document.createElement("canvas");
  canvas.setAttribute("role","img");canvas.setAttribute("aria-label","Gluconeogenesis slide "+number);
  button.onclick=()=>{const fit=scroll.classList.toggle("fit");button.textContent=fit?"Read full size":"Fit to screen"};
  scroll.append(canvas);figure.append(caption,button,scroll);body.append(figure);
  const base=page.getViewport({scale:1});
  const width=Math.max(680,Math.min(1100,body.clientWidth||900));
  const viewport=page.getViewport({scale:width*Math.min(2,window.devicePixelRatio||1)/base.width});
  canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
  canvas.style.width=width+"px";
  await page.render({canvasContext:canvas.getContext("2d"),viewport}).promise;
 }
}
function append(q,feedback){
 if(q.lecture!=="Gluconeogenesis")return;
 const numbers=slidesByQuestion[q.id];
 if(!numbers||!numbers.length)return;
 const details=document.createElement("details");details.className="lecture-slide-details";
 const summary=document.createElement("summary");summary.textContent="View Relevant Lecture Slides";
 const body=document.createElement("div");body.className="lecture-slide-body";
 details.append(summary,body);
 details.addEventListener("toggle",async()=>{
  if(!details.open)return;
  if(lecturePdf){
   try{await renderPages(details,numbers)}catch(err){body.textContent="Could not display slides: "+err.message}
   return;
  }
  body.replaceChildren();
  const picker=document.createElement("label");picker.className="lecture-slide-picker";
  const label=document.createElement("span");
  label.textContent="Select the original 15-slide Gluconeogenesis PDF (never uploaded):";
  const input=document.createElement("input");input.type="file";input.accept=".pdf,application/pdf";
  const status=document.createElement("small");status.className="muted";
  status.textContent="Select once per browser session.";
  picker.append(label,input,status);body.append(picker);
  input.addEventListener("change",async()=>{
   const file=input.files&&input.files[0];if(!file)return;
   input.disabled=true;status.textContent="Opening the PDF locally…";
   try{
    await choosePdf(file);
    if(details.open&&details.isConnected)await renderPages(details,numbers);
   }catch(err){status.textContent="Could not open slides: "+err.message;input.disabled=false;input.value=""}
  });
 });
 feedback.append(details);
}
window.GlucoSlides=Object.freeze({append});
})();