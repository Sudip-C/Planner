const input = document.getElementById("input-box");
const button = document.getElementById("add-button");
const tags = document.querySelectorAll(".items");
const planList = document.getElementById("plans-container");

let selectedTag = null;

const plans = JSON.parse(localStorage.getItem("plans")) || [];
renderPlans(plans);

function addPlan() {
  let plan = {
    title: input.value,
    status: false,
    tag: selectedTag,
  };
  plans.push(plan);
  localStorage.setItem("plans", JSON.stringify(plans));
  renderPlans(plans);
}



function renderPlans(plans) {
  planList.innerHTML = ""; // clear existing items

  plans.forEach((plan, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox"  class="complete-checkbox" ${
        plan.status ? "checked" : ""
      } data-index="${index}">
      <span style="text-decoration: ${plan.status ? "line-through" : "none"}">${
      plan.title
    }</span>
      <span style="margin-left: 10px; font-size: 0.8em; color: gray;">[${
        plan.tag
      }]</span>
      <button data-index="${index}" class="delete-btn">❌</button>
    `;
    planList.appendChild(li);
  });

  const checkboxes = document.querySelectorAll('.complete-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const index = e.target.getAttribute('data-index');
      plans[index].status = e.target.checked;
      localStorage.setItem('plans', JSON.stringify(plans));
      renderPlans(plans); // re-render to apply strikethrough
    });
  });

  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      plans.splice(index, 1); // Remove task from array
      localStorage.setItem('plans', JSON.stringify(plans));
      renderPlans(plans); // Re-render updated list
    });
  });
}

tags.forEach((tag) => {
  tag.addEventListener("click", (e) => {
    selectedTag = e.target.getAttribute("value");

    tags.forEach((t) => t.classList.remove("selected"));
    e.target.classList.add("selected");
  });
});

button.addEventListener("click", (e) => {
  e.preventDefault();
  if (!input.value.trim()) return alert("Please enter a task.");
  addPlan();
  input.value = "";
  selectedTag = null;
  tags.forEach((t) => t.classList.remove("selected"));
});
