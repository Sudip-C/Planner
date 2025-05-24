import { debounce, throttle } from "./utils.js";

const input = document.getElementById("input-box");
const button = document.getElementById("add-button");
const tags = document.querySelectorAll(".items");
const planList = document.getElementById("plans-container");
const searchInput = document.getElementById("search-input");
const clearAll = document.getElementById("clear-all");
const backToTopBtn = document.getElementById("back-to-top");
const container = document.getElementById("plans-container");

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

const handleSearch = debounce(() => {
  const keyword = searchInput.value.toLowerCase();
  const filteredPlans = plans.filter((plan) =>
    plan.title.toLowerCase().includes(keyword)
  );
  renderPlans(filteredPlans);
}, 300);

searchInput.addEventListener("input", handleSearch);

function renderPlans(plans) {
  planList.innerHTML = ""; // clear existing items
  const p = document.createElement("div");
  if (plans?.length === 0) {
    p.innerText = "There is no plan";
    p.classList.add("no-plan")
    planList.append(p);
  }
  plans.forEach((plan, index) => {
    const li = document.createElement("div");
    li.classList.add('plans')
    li.innerHTML = `
      <input type="checkbox"  class="complete-checkbox" ${
        plan.status ? "checked" : ""
      } data-index="${index}">
      <span style="text-decoration: ${plan.status ? "line-through" : "none"}">${
      plan.title
    }</span>
      <span class='show-tag' style="margin-left: 10px; font-size: 0.8em; color: gray;">${
        plan.tag ? plan.tag : "Personal"
      }</span>
      <button data-index="${index}" class="delete-btn">❌</button>
    `;
    planList.appendChild(li);
  });
  clearAll.style.display = plans?.length > 0 ? "block" : "none";

  const checkboxes = document.querySelectorAll(".complete-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const index = e.target.getAttribute("data-index");
      plans[index].status = e.target.checked;
      localStorage.setItem("plans", JSON.stringify(plans));
      renderPlans(plans); // re-render to apply strikethrough
    });
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      plans.splice(index, 1); // Remove task from array
      localStorage.setItem("plans", JSON.stringify(plans));
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

clearAll.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    localStorage.removeItem("plans");
    renderPlans([]);
  }
});

function handleScroll() {
  if (container.scrollTop > 50) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
}

container.addEventListener("scroll", throttle(handleScroll, 50));

backToTopBtn.addEventListener("click", () => {
  container.scrollTo({ top: 0, behavior: "smooth" });

});
