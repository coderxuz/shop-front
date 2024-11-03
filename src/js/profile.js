import "../scss/profile.scss";
import axios from "axios";

const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");
const body = document.body;
const photoModal = document.querySelector('.photo-modal')

const refresh = () => {
  axios
    .get("http://192.168.1.15:8080/auth/refresh", {
      headers: { Authorization: `Bearer ${refreshToken}` },
    })
    .then((res) => {
      localStorage.setItem("accessToken", res.data.access_token);
      console.log(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
};
axios
  .get("http://192.168.1.15:8080/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  .then((res) => {
    const data = res.data;
    console.log(data);

    // Create a container for user data
    const userContainer = document.createElement("div");
    userContainer.className = "container";

    if (data.user_img) {
      userContainer.innerHTML = `
        <div class="user">
          <div class="user-photo">
            <img src="http://192.168.1.15:8080/images/${data.user_img}" alt="">
          </div>
          <div class="user-data">
            <div class="user-data-field">
              <h2>First name: <p>${data.first_name}</p></h2>
              <h2>Last name: <p>${data.last_name}</p></h2>
            </div>
            <div class="user-data-field">
              <h2>Gender: <p>${data.gender}</p></h2>
              <h2>Email: <p>${data.email}</p></h2>
            </div>
            <div class="user-data-field">
              <h2>Role: <p>${data.role}</p></h2>
            </div>
          </div>
        </div>
      `;
    } else {
      userContainer.innerHTML = `
        <div class="user">
          <div class="user-photo">
            <svg enable-background="new 0 0 24 24" id="Layer_1" version="1.0" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <circle cx="12" cy="8" r="4" />
              <path d="M12,14c-6.1,0-8,4-8,4v2h16v-2C20,18,18.1,14,12,14z" />
            </svg>
          </div>
          <div class="user-data">
            <div class="user-data-field">
              <h2>First name: <p>${data.first_name}</p></h2>
              <h2>Last name: <p>${data.last_name}</p></h2>
            </div>
            <div class="user-data-field">
              <h2>Gender: <p>${data.gender}</p></h2>
              <h2>Email: <p>${data.email}</p></h2>
            </div>
            <div class="user-data-field">
              <h2>Role: <p>${data.role}</p></h2>
            </div>
          </div>
        </div>
      `;
    }

    // Append user data to body
    body.appendChild(userContainer);
    const btnContainer = document.createElement("div");
    btnContainer.classList = "container";
    body.appendChild(btnContainer);
    const editing = document.createElement("div");
    editing.classList.value = "editing";
    btnContainer.appendChild(editing);
    // Create buttons
    const editBtn = document.createElement("button");
    const editPhoto = document.createElement("button");
    editBtn.textContent = "Edit";
    editPhoto.textContent = "Edit photo";

    // Append buttons after user data
    editing.appendChild(editBtn);
    editing.appendChild(editPhoto);
    editPhoto.addEventListener('click', ()=>{
      if (photoModal.style.display === "none" || !photoModal.style.display) {
        console.log("Opening modal...");
        photoModal.style.display = "flex";
      } else if (photoModal.style.display === "flex") {
        console.log("Closing modal...");
        photoModal.style.display = "none";
      }
    })
    axios
      .get("http://192.168.1.15:8080/order", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        const orderData = res.data;
        const orderContainer = document.createElement("div");
        orderContainer.classList = "container";
        body.appendChild(orderContainer);
        const orders = document.createElement("div");
        orders.classList = "orders";
        orderContainer.appendChild(orders);
        let count = 0;
        console.log(orderData);
        orderData.forEach((element) => {
          count += 1;
          const orderCard = document.createElement("div");
          orders.appendChild(orderCard);
          orderCard.classList = "orders-card";
          orderCard.innerHTML = `<div class="orders-card-part">
          <h2>Order${count}</h2>
          <p>status:${element.status}</p>
        </div>
        <div class="orders-card-part">
          <p>total:${element.total_amount} usd</p>
          <button class="cancel-btn" id=${element.id}>cancel</button>
        </div>`;
          const cancelButton = orderCard.querySelector(".cancel-btn");
          cancelButton.addEventListener("click", (e) => {
            axios.patch(
              `http://192.168.1.15:8080/order/cancel/${e.target.id}`,
              {},
              { headers: { Authorization: `Bearer ${accessToken}` } }
            ).then(res=>{
              console.log(res);
            }).catch(err=>{
              console.log(err);
            })
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.error(err);
  });
const closeBtn = document.querySelector('.photo-modal p')
console.log(closeBtn);
closeBtn.addEventListener('click', ()=>{
  if (photoModal.style.display === "none" || !photoModal.style.display) {
    console.log("Opening modal...");
    photoModal.style.display = "flex";
  } else if (photoModal.style.display === "flex") {
    console.log("Closing modal...");
    photoModal.style.display = "none";
  }
})
const editPhoto = document.getElementById('editPhoto')
editPhoto.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent default form submission behavior

  // Create a new FormData object
  const formData = new FormData();

  // Select the file input from the form
  const fileInput = editPhoto.querySelector('input[type="file"]'); 
  const file = fileInput.files[0]; // Get the first file

  // Check if a file is selected
  if (file) {
    formData.append('upload_file', file); // Append the file to the FormData object
  } else {
    console.error("No file selected.");
    return; // Exit if no file is selected
  }

  // Send the FormData using Axios
  axios.post('http://192.168.1.15:8080/images/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Set the content type
      Authorization: `Bearer ${accessToken}` // Add Authorization header
    }
  })
  .then((response) => {
    console.log("File uploaded successfully:", response.data);
    // Optionally, you can close the modal or update the UI here
    photoModal.style.display = "none"; // Close the modal after upload
  })
  .catch((error) => {
    console.error("Error uploading file:", error);
  });
});
