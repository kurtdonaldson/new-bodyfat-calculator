const deleteBtn = document.querySelectorAll(".deleteButton");
const deleteTest = document.querySelectorAll(".deleteTest");
const editBtn = document.querySelectorAll(".editButton");
const updateBtn = document.querySelector(".updateButton");
const viewBtn = document.querySelectorAll(".viewButton");
const clientName = document.querySelector("#clientName");
const saveBtn = document.querySelector("#save-button");
const clientValue = document.querySelector('#clientValue');
const clientRow = document.querySelector('.clientRow');
const clientYES = document.querySelectorAll('.clientYES')
const clientTD = document.querySelectorAll('.clientTD')

for (const button of viewBtn) {
    button.addEventListener("click", (e) => {
      clientName.innerHTML = e.target.dataset.name;
      for(let i of clientYES){
         if(i.innerHTML.includes(clientName.innerHTML)){
          i.style.display = "table-cell";    
         } else{
          i.style.display = "none";
         }
      }
    });
  };

  saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    fetch("/clients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.querySelector("#clientName").innerHTML,
        classification: document.querySelector("#classification-populate")
          .innerHTML,
        leanMass: document.querySelector("#leanmass-populate").innerHTML,
        bodyfat: document.querySelector("#bodyfat-populate").innerHTML,
        date: document.querySelector("#today-date").innerHTML,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then(() => {
        window.location.reload();
      });
  });


  // no route yet
  // for (const button of deleteBtn) {
  //   button.addEventListener("click", (e) => {
  //     console.log(e.target.dataset);
  //     fetch(`/users`, {
  //       method: "delete",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         name: e.target.dataset.name,
  //       }),
  //     })
  //       .then((res) => {
  //         if (res.ok) return res.json();
  //       })
  //       .then(() => {
  //         window.location.reload();
  //       });
  //   });
  // }
  
