const Email = document.getElementById("email");
Email.addEventListener("input", () => emailValidate(Email));

function emailValidate(element) {
  if (element.validity.typeMismatch) {
    element.setCustomValidity("The email is not in the right format !!");
    element.reportValidity();
  } else {
    element.setCustomValidity("");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const dob = document.getElementById("dob");
  const today = new Date();
  const min_date = new Date(
    today.getFullYear() - 55,
    today.getMonth(),
    today.getDate()
  );
  const max_date = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  dob.setAttribute("min", min_date.toISOString().split("T")[0]);
  dob.setAttribute("max", max_date.toISOString().split("T")[0]);
});

let register_form = document.getElementById("register-form");
const retreive_entries = () => {
  let entries = localStorage.getItem("register-entries");
  if (entries) {
    entries = JSON.parse(entries);
  } else {
    entries = [];
  }
  return entries;
};

let register_entries = retreive_entries();
const display_entries = () => {
  const entries = retreive_entries();
  const table_entries = entries
    .map((entry) => {
      const name_cell = `<td class="border px-4 py-2">${entry.name}</td>`;
      const email_cell = `<td class="border px-4 py-2">${entry.email}</td>`;
      const password_cell = `<td class="border px-4 py-2">${entry.password}</td>`;
      const dob_cell = `<td class="border px-4 py-2">${entry.dob}</td>`;
      const accept_terms_cell = `<td class="border px-4 py-2">${entry.accept_terms}</td>`;
      const row = `<tr>${name_cell} ${email_cell} ${password_cell} ${dob_cell} ${accept_terms_cell}</tr>`;
      return row;
    })
    .join("\n");

  const table = `<table class="table-auto w-full"><tr>
        <th class="px-4 py-2">Name</th>
        <th class="px-4 py-2">Email</th>
        <th class="px-4 py-2">Password</th>
        <th class="px-4 py-2">Dob</th>
        <th class="px-4 py-2">Accepted terms?</th>
        </tr>${table_entries}</table>`;
  let details = document.getElementById("register-entries");
  details.innerHTML = table;
};

const save_register_form = (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const dob = document.getElementById("dob").value;
  const accept_terms = document.getElementById("acceptTerms").checked;

  const entry = { name, email, password, dob, accept_terms };

  register_entries.push(entry);
  localStorage.setItem("register-entries", JSON.stringify(register_entries));
  display_entries();
  register_form.reset();
};

register_form.addEventListener("submit", save_register_form);
display_entries();
