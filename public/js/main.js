const drop = document.querySelector(".drop");
const file_type = document.querySelector("#file_type");
const btn_browse = document.querySelector("#btn-browse");
const bg_progress = document.querySelector(".bg_progress");
const progressbar = document.querySelector(".progressbar");
const progress = document.querySelector(".progress");
const percent = document.getElementById("percent");
const File_url = document.getElementById("File_url");
const copy_btn = document.getElementById("copy_btn");
const form = document.getElementById("form");
const logo = document.getElementById("logo");
const link_share = document.querySelector(".link_share");
const noty = document.querySelector(".noty");
const email_noty = document.querySelector(".email_noty");

const host = "https://innshare.herokuapp.com/";
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

const MaxUpload=100 * 1024 * 1024;

drop.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!drop.classList.contains("dragged")) {
    drop.classList.add("dragged");
  }
});

drop.addEventListener("dragleave", () => {
  drop.classList.remove("dragged");
});
drop.addEventListener("drop", (e) => {
  e.preventDefault();
  drop.classList.remove("dragged");
  const files = e.dataTransfer.files;
  if (files.length) {
    file_type.files = files;
    uploadFile();
  }
});
file_type.addEventListener("change", () => {
  uploadFile();
});

btn_browse.addEventListener("click", () => {
  file_type.click();
});

copy_btn.addEventListener("click", () => {
  File_url.select();
  document.execCommand("copy");
  ShowNoty("Copy to Clipboard!");
  
});

const uploadFile = () => {

  if(file_type.files.length > 1){
    file_type.value="";
    ShowNoty("Upload one file at a time!");
    return
  }
  const files = file_type.files[0];

if( files.size > MaxUpload){
  ShowNoty("Can't upload more than 100MB");
  file_type.value="";
  return;
}

  progress.style.display = "block";
  const formData = new FormData();
  formData.append("myfile", files);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
      showLink(JSON.parse(xhr.response));
    }
  };
  xhr.upload.onprogress = UpdateP;
 File_url.value="";
  xhr.upload.onerror=()=>{
    ShowNoty(`Error in Upload:${xhr.statusText}`)
  }

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

const UpdateP = (e) => {
  const percentage = Math.round((e.loaded / e.total) * 100);
  bg_progress.style.width = `${percentage}%`;
  percent.innerText = percentage;
  progressbar.style.transform = `scaleX(${percentage / 100})`;
};
const showLink = ({ file: url }) => {
  
  File_url.value="";
  form[2].removeAttribute("disabled", "true");
  progress.style.display = "none";
  link_share.style.display = "block";
  File_url.value = url;
};
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = File_url.value;
  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: form.elements["your_email"].value,
    emailFrom: form.elements["re_email"].value,
  };
  form[2].setAttribute("disabled", "true");
  console.table(formData);

  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((success) => {
      if(success){
        link_share.style.display="none";
        ShowNoty("Email Sent Successfully!")
      }
    });
});

let emailNoty;
const ShowNoty=(msg) =>{
  email_noty.innerText=msg;
  email_noty.style.transform="translate(10%)";
  
  clearTimeout(emailNoty);
emailNoty=setTimeout(() => {
  email_noty.style.transform="translateX(-290%)";
  

}, 2000);
}
