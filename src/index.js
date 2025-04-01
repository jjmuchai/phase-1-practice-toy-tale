// let addToy = false;

// document.addEventListener("DOMContentLoaded", () => {
//   const addBtn = document.querySelector("#new-toy-btn");
//   const toyFormContainer = document.querySelector(".container");
//   addBtn.addEventListener("click", () => {
//     // hide & seek with the form
//     addToy = !addToy;
//     if (addToy) {
//       toyFormContainer.style.display = "block";
//     } else {
//       toyFormContainer.style.display = "none";
//     }
//   });
// });

let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form"); // FIXED
  const toyCollection = document.getElementById("toy-collection");

  const API_URL = "http://localhost:3000/toys";

  // Debugging logs to check if elements exist
  console.log("addBtn:", addBtn);
  console.log("toyFormContainer:", toyFormContainer);
  console.log("toyForm:", toyForm);
  console.log("toyCollection:", toyCollection);

  // 🌟 Show/Hide Form
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // ✅ Fetch and Display Toys
  function fetchToys() {
    fetch(API_URL)
      .then(res => res.json())
      .then(toys => {
        toyCollection.innerHTML = ""; // Clear before adding new toys
        toys.forEach(renderToy);
      })
      .catch(error => console.error("Error fetching toys:", error));
  }

  // ✅ Render a Toy Card
  function renderToy(toy) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar">
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;

    // Add like button functionality
    card.querySelector(".like-btn").addEventListener("click", () => likeToy(toy));

    toyCollection.appendChild(card);
  }

  // ✅ Add New Toy (POST Request)
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // FIXED: Correctly select input fields
    const toyName = document.querySelector(".add-toy-form input[name='name']").value;
    const toyImage = document.querySelector(".add-toy-form input[name='image']").value;

    const newToy = { name: toyName, image: toyImage, likes: 0 };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(newToy)
    })
    .then(res => res.json())
    .then(renderToy) // Add to DOM
    .catch(error => console.error("Error adding toy:", error));

    // Reset form and hide it
    toyForm.reset();
    addToy = false;
    toyFormContainer.style.display = "none";
  });

  // ✅ Like a Toy (PATCH Request)
  function likeToy(toy) {
    const updatedLikes = toy.likes + 1;

    fetch(`${API_URL}/${toy.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ likes: updatedLikes })
    })
    .then(res => res.json())
    .then(updatedToy => {
      toy.likes = updatedToy.likes;
      fetchToys(); // Refresh UI
    })
    .catch(error => console.error("Error updating likes:", error));
  }

  // 🔥 Load all toys on page load
  fetchToys();
});
