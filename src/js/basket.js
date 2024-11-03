import "../scss/index.scss";
import axios from "axios";
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");
const products = document.querySelector(".products");

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

window.addEventListener("DOMContentLoaded", () => {
  axios
    .get("http://192.168.1.15:8080/basket", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => {
      if (res.data.length == 0) {
        products.innerHTML = "you haven't choosen products";
      }
      res.data.forEach((item) => {
        console.log(item);
        const product = document.createElement("a");
        const card = document.createElement("div");
        card.classList.value = "products-card";
        product.appendChild(card);
        product.href = `http://192.168.1.15:5173/product?id=${item.product_id}`;
        products.appendChild(product);
        card.innerHTML = `
            <img src="${item.prod_img}" alt="" />
            <h2>${item.name}</h2>
            <p>${item.price}</p>
            <p>${item.quantity}</p>`;
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.value = "delete-btn";
        deleteBtn.innerHTML = "delete";
        deleteBtn.id = item.id;
        card.appendChild(deleteBtn);
        deleteBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const basketId = e.target.id; // Ensure this is the correct basket_id
          console.log(basketId);
          axios
            .delete(`http://192.168.1.15:8080/basket/${e.target.id}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((res) => {
              console.log(res);
              location.reload();
            })
            .catch((err) => {
              console.log(err);
            });
        });
        const orderbtn = document.createElement("button");
        document.body.appendChild(orderbtn);
        orderbtn.innerHTML = "Order all";
        orderbtn.style.position = "absolute";
        orderbtn.style.bottom = "20px";
        orderbtn.style.right = "20px";

        // Add the click event listener
        orderbtn.addEventListener("click", () => {
          axios
            .post(
              "http://192.168.1.15:8080/order/add",
              {},
              { headers: { Authorization: `Bearer ${accessToken}` } }
            )
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      refresh();
    });
});
