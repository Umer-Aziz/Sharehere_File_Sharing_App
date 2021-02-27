const drop=document.querySelector('.drop')

drop.addEventListener('dragover',(e)=>{
  e.preventDefault();
    if(!drop.classList.contains("dragged")){
        drop.classList.add("dragged");
    }
})

drop.addEventListener("dragleave",()=>{
    drop.classList.remove("dragged")
})
drop.addEventListener("drop",(e)=>{
    e.preventDefault();
    drop.classList.remove("dragged")
})