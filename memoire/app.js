const openForm = document.querySelector("#add-prescription");
const closeForm = document.querySelector("#btn-form-discard");
const form = document.querySelector(".med-form");
const overlay = document.querySelector("#overlay");
let prescriptionCount = 1;

openForm.addEventListener("click", function () {
  form.classList.add("active");
  overlay.classList.add("active");

  // prescriptionCount++;
  // const label = document.createElement("label");
  // label.setAttribute("for", `prescription${prescriptionCount}`);
  // label.textContent = `Prescription ${prescriptionCount}:`;
  // const input = document.createElement("input");
  // input.setAttribute("type", "text");
  // input.setAttribute("id", `prescription${prescriptionCount}`);
  // input.setAttribute("name", `prescription${prescriptionCount}`);
  // const container = document.createElement("div");
  // container.appendChild(label);
  // container.appendChild(input);
  // const prescriptionContainer = document.getElementById(
  //   "prescription-container"
  // );
  // prescriptionContainer.appendChild(container);
});
closeForm.addEventListener("click", () => {
  form.classList.remove("active");
  overlay.classList.remove("active");
});
// ***************************************************************************
const addBtn = document.querySelector("#btn-form-add-task");
const scrollView = document.querySelector(".scroll-view");

addBtn.addEventListener("click", () => {
  const scrollContent = document.createElement("div");
  scrollContent.classList.add("scroll-content");

  const label = document.createElement("label");
  label.textContent = "Time To take Medicine";
  scrollContent.appendChild(label);

  const inputGroup = document.createElement("div");
  inputGroup.classList.add("input-group");

  const timeInput = document.createElement("input");
  timeInput.type = "time";
  inputGroup.appendChild(timeInput);

  const textarea = document.createElement("textarea");
  textarea.name = "text";
  textarea.cols = "50";
  textarea.rows = "2";
  textarea.placeholder = "Notes";
  inputGroup.appendChild(textarea);

  scrollContent.appendChild(inputGroup);
  scrollView.appendChild(scrollContent);
});


