const form = document.getElementById("studentForm");
const nameInput = document.getElementById("sName");
const idInput = document.getElementById("sId");
const emailInput = document.getElementById("sEmail");
const contactInput = document.getElementById("sContact");
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const resetBtn = document.getElementById("resetBtn");
const submitBtn = document.getElementById("submitBtn");
const tableContainer = document.getElementById("tableContainer");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;

function validateInputs() {
  let valid = true;
  const name = nameInput.value.trim();
  const id = idInput.value.trim();
  const email = emailInput.value.trim();
  const contact = contactInput.value.trim();

  const nameErr = document.getElementById("errName");
  const idErr = document.getElementById("errId");
  const emailErr = document.getElementById("errEmail");
  const contactErr = document.getElementById("errContact");

  nameErr.textContent = idErr.textContent = emailErr.textContent = contactErr.textContent = "";

  if (!/^[A-Za-z\s]+$/.test(name)) {
    nameErr.textContent = "Name must contain only letters.";
    valid = false;
  }
  if (!/^[0-9]+$/.test(id)) {
    idErr.textContent = "Student ID must be numeric.";
    valid = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailErr.textContent = "Invalid email format.";
    valid = false;
  }
  if (!/^[0-9]{10,}$/.test(contact)) {
    contactErr.textContent = "Contact must have at least 10 digits.";
    valid = false;
  }

  return valid;
}

function renderTable(filter = "") {
  tableBody.innerHTML = "";
  let filtered = students.filter(
    s =>
      s.name.toLowerCase().includes(filter.toLowerCase()) ||
      s.id.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No records found</td></tr>`;
  } else {
    filtered.forEach((s, i) => {
      let row = document.createElement("tr");
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${s.name}</td>
        <td>${s.id}</td>
        <td>${s.email}</td>
        <td>${s.contact}</td>
        <td class="actions">
          <button class="btn-edit" onclick="editStudent(${i})">Edit</button>
          <button class="btn-delete" onclick="deleteStudent(${i})">Delete</button>
        </td>`;
      tableBody.appendChild(row);
    });
  }

  tableContainer.style.overflowY = students.length > 6 ? "auto" : "hidden";
}

form.addEventListener("submit", e => {
  e.preventDefault();
  if (!validateInputs()) return;

  const student = {
    name: nameInput.value.trim(),
    id: idInput.value.trim(),
    email: emailInput.value.trim(),
    contact: contactInput.value.trim(),
  };

  if (editIndex === -1) {
    students.push(student);
  } else {
    students[editIndex] = student;
    editIndex = -1;
    submitBtn.textContent = "Add Student";
  }

  localStorage.setItem("students", JSON.stringify(students));
  renderTable();
  form.reset();
});

function editStudent(index) {
  const s = students[index];
  nameInput.value = s.name;
  idInput.value = s.id;
  emailInput.value = s.email;
  contactInput.value = s.contact;
  editIndex = index;
  submitBtn.textContent = "Update Student";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteStudent(index) {
  if (confirm(`Delete record of ${students[index].name}?`)) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    renderTable();
  }
}

resetBtn.addEventListener("click", () => {
  form.reset();
  editIndex = -1;
  submitBtn.textContent = "Add Student";
});

searchInput.addEventListener("input", e => {
  renderTable(e.target.value);
});

renderTable();
