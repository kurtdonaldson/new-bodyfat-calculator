const deleteBtn = document.querySelectorAll(".deleteButton");
const deleteTest = document.querySelectorAll(".deleteTest");
const editBtn = document.querySelectorAll(".editButton");
const updateBtn = document.querySelector(".updateButton");
const viewBtn = document.querySelectorAll(".viewButton");
const clientName = document.querySelector("#clientName");
const saveBtn = document.querySelector("#save-button");
const clientValue = document.querySelector("#clientValue");
const clientRow = document.querySelector(".clientRow");
const clientYES = document.querySelectorAll(".clientYES");
const clientTD = document.querySelectorAll(".clientTD");

for (const button of viewBtn) {
  button.addEventListener("click", (e) => {
    viewBtn.forEach((btn) => (btn.disabled = false));
    clientName.innerHTML = e.target.dataset.name.bold();
    for (let i of clientYES) {
      if (i.innerText.includes(clientName.innerText)) {
        i.style.display = "table-cell";
        button.disabled = true;
      } else {
        i.style.display = "none";
      }
    }
  });
}

for (const button of deleteBtn) {
  button.addEventListener("click", (e) => {
    console.log(e.target.dataset);
    const confirmation = confirm(
      `Are you sure you want to delete ${e.target.dataset.name}`
    );

    if (confirmation) {
      fetch(`/clients`, {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: e.target.dataset.name,
        }),
      })
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then(() => {
          window.location.reload();
        });
    }
  });
}

saveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  fetch("/clients", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.querySelector("#clientName").innerText,
      date: document.querySelector("#today-date").innerText,
      bodyfat: document.querySelector("#bodyfat-populate").innerText,
      weight: document.querySelector("#weight-populate").innerText,
      leanMass: document.querySelector("#leanmass-populate").innerText,
      classification: document.querySelector("#classification-populate")
        .innerText,
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then(() => {
      window.location.reload();
    });
});
