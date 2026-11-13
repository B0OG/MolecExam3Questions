/* Question-to-slide mapping. Assets are public on GitHub Pages; sign-in gates only the viewer UI. */
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

const imageFiles=Object.freeze({
 5:"a_41b2cbb1488f9efc64.webp",
 6:"a_c0694492470e46ac3e.webp",
 7:"a_b45334e2d3652fb1e9.webp",
 8:"a_88cf9c4db522fa63b6.webp",
 9:"a_1b16cdd4a9f81a017c.webp",
 10:"a_d15f5543afab543d88.webp",
 11:"a_cb657ae56f596bfa7c.webp",
 12:"a_9b5a9afaeee901159b.webp",
 14:"a_7ba2fa1a7e5787bfcb.webp"
});
const imageRoot="./assets/ui/v2/";
const style=document.createElement("style");
style.textContent=[
"#quiz .lecture-slide-details{margin:13px 0 0;border-top:1px solid var(--chrome-border);padding-top:10px}",
"#quiz .lecture-slide-details>summary{font-weight:650;color:var(--accent);padding:4px 0;cursor:pointer}",
"#quiz .lecture-slide-body{padding:8px 0 2px;min-width:0}",
"#quiz .lecture-slide-figure{margin:12px 0 16px}",
"#quiz .lecture-slide-caption{display:block;font-weight:650;margin-bottom:7px}",
"#quiz .lecture-slide-fit{font-size:.76rem;padding:5px 8px;margin:0 0 6px}",
"#quiz .lecture-slide-scroller{max-width:100%;overflow-x:auto;border:1px solid var(--chrome-border);border-radius:6px;background:#fff;overscroll-behavior-x:contain}",
"#quiz .lecture-slide-scroller img{display:block;width:1200px;max-width:none;height:auto}",
"#quiz .lecture-slide-scroller.fit img{width:100%;min-width:0}",
"#quiz .lecture-slide-help{font-size:.78rem;color:var(--muted);margin:6px 0}"
].join("\n");
document.head.append(style);

function append(q,feedback,isSignedIn){
 if(q.lecture!=="Gluconeogenesis"||typeof isSignedIn!=="function"||!isSignedIn())return;
 const numbers=slidesByQuestion[q.id];
 if(!numbers||!numbers.length)return;
 const details=document.createElement("details");
 details.className="lecture-slide-details";
 const summary=document.createElement("summary");
 summary.textContent="View Relevant Lecture Slides";
 const body=document.createElement("div");
 body.className="lecture-slide-body";
 details.append(summary,body);
 let rendered=false;
 details.addEventListener("toggle",()=>{
  if(!details.open||rendered)return;
  if(!isSignedIn()){body.textContent="Sign in to view lecture slides.";return;}
  rendered=true;
  const hint=document.createElement("p");
  hint.className="lecture-slide-help";
  hint.textContent="These original lecture slides open automatically. On mobile, scroll sideways to read or select Fit to screen.";
  body.replaceChildren(hint);
  for(const number of numbers){
   const filename=imageFiles[number];
   if(!filename)continue;
   const figure=document.createElement("figure");
   figure.className="lecture-slide-figure";
   const caption=document.createElement("figcaption");
   caption.className="lecture-slide-caption";
   caption.textContent="Original lecture slide "+number;
   const fitButton=document.createElement("button");
   fitButton.type="button";
   fitButton.className="lecture-slide-fit";
   fitButton.textContent="Fit to screen";
   const scroller=document.createElement("div");
   scroller.className="lecture-slide-scroller";
   const img=document.createElement("img");
   img.alt="Original Gluconeogenesis lecture slide "+number;
   img.loading="lazy";
   img.decoding="async";
   img.src=imageRoot+filename;
   img.addEventListener("error",()=>{
    const error=document.createElement("p");
    error.className="lecture-slide-help";
    error.textContent="Slide "+number+" could not load. Try refreshing the page.";
    scroller.replaceChildren(error);
   });
   fitButton.onclick=()=>{
    const fit=scroller.classList.toggle("fit");
    fitButton.textContent=fit?"Read full size":"Fit to screen";
   };
   scroller.append(img);
   figure.append(caption,fitButton,scroller);
   body.append(figure);
  }
 });
 feedback.append(details);
}
window.GlucoSlides=Object.freeze({append});
})();
