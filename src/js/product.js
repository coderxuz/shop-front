import "../scss/products.scss";
import axios from "axios";

const product = document.querySelector(".product");
const url = new URL(window.location.href);

const params = new URLSearchParams(url.search);
const form = document.querySelector("form");
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

const id = params.get("id");
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

const img = document.getElementById("img");
const name = document.getElementById("name");
const price = document.getElementById("price");
const description = document.getElementById("description");
const stock_quantity = document.getElementById("stock_quantity");
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    axios
      .get(`http://192.168.1.15:8080/basket/exist/${id}`, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.message == true) {
          const exist = document.createElement("p");
          exist.innerHTML = "this product already  exist in your basket";
          exist.style.marginTop = "70px";
          exist.style.color = "red";
          product.appendChild(exist);
          localStorage.setItem("exist", true);
        }
        if (res.data.message == false) {
          localStorage.setItem("exist", false);
        }
      });
  }, 500);
});
window.addEventListener("DOMContentLoaded", () => {
  axios
    .get(`http://192.168.1.15:8080/prods/${id}`, {
      headers: { Authorization: `Bearer ${accessToken} ` },
    })
    .then((res) => {
      console.log(res.data);
      if (!res.data.seller_id) {
        product.innerHTML = `<img src="${res.data.prod_img}" alt="">
        <h2>${res.data.name}</h2>
        <span>${res.data.price}</span>
        <p class="description">${res.data.description}</p>
        <p class="stock">${res.data.stock_quantity}</p>
        <button class = 'basket'>basket</button>`;
        let quantity = 1;
        const addBtn = document.createElement("button");
        const subtractBtn = document.createElement("button");
        addBtn.innerHTML = "+";
        subtractBtn.innerHTML = "-";
        const result = document.createElement("p");
        const quantityText = document.createElement("p");
        const quantityDiv = document.createElement("div");
        quantityDiv.classList.value = "quantity";
        quantityText.textContent = quantity;
        product.appendChild(quantityDiv);
        quantityDiv.appendChild(subtractBtn);
        quantityDiv.appendChild(quantityText);
        quantityDiv.appendChild(addBtn);
        quantityDiv.appendChild(result);
        addBtn.addEventListener("click", () => {
          quantity += 1;
          quantityText.textContent = quantity;
        });

        subtractBtn.addEventListener("click", () => {
          if (quantity > 1) {
            quantity -= 1;
            quantityText.textContent = quantity;
          }
        });
        const basketBtn = document.querySelector(".basket");
        console.log(basketBtn);
        const existLocal = JSON.parse(localStorage.getItem("exist"));
        if (existLocal == false) {
          basketBtn.addEventListener("click", (e) => {
            const data = { product_id: id, quantity: quantity };
            console.log(quantity);
            console.log(data);
            axios
              .post("http://192.168.1.15:8080/basket", data, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              })
              .then((res) => {
                console.log(res);
                result.innerHTML = "added";
                setTimeout(() => {
                  location.reload();
                }, 3000);
              })
              .catch((err) => {
                console.log(err);
              });
          });
        }
      } else {
        img.src = res.data.prod_img;
        name.value = res.data.name;
        price.value = res.data.price;
        description.value = res.data.description;
        stock_quantity.value = res.data.stock_quantity;
        const labels = document.querySelectorAll("label");

        labels.forEach((label) => {
          label.addEventListener("click", function () {
            const inputId = label.getAttribute("for");
            const inputElement = document.getElementById(inputId);
            if (
              inputElement.hasAttribute("readonly") ||
              inputElement.hasAttribute("disabled")
            ) {
              inputElement.removeAttribute("readonly");
              inputElement.removeAttribute("disabled");
              inputElement.classList.remove("read");
              inputElement.classList.add("change");
            } else {
              inputElement.setAttribute("readonly", true);
              inputElement.setAttribute("disabled", true);
              inputElement.classList.remove("change");
              inputElement.classList.add("read");
            }
          });
        });
      }
    })
    .catch((err) => {
      refresh();
    });
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fileInput = document.getElementById("file");
  if (!file.hasAttribute("disabled")) {
    const file = fileInput.files[0];

    if (!file) {
      console.error("Rasm tanlanmadi!");
      return;
    }

    const formData = new FormData();
    formData.append("upload_file", file);
    axios
      .post("http://192.168.1.15:8080/images/prod", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const data = {
          product_id: id,
          name: name.value,
          price: price.value,
          description: description.value,
          stock_quantity: stock_quantity.value,
          image_id: res.data.image_id,
        };
        return axios
          .put("http://192.168.1.15:8080/prods/change", data, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      });
  } else {
    const data = {
      product_id: id,
      name: name.value,
      price: price.value,
      description: description.value,
      stock_quantity: stock_quantity.value,
    };
    return axios
      .put("http://192.168.1.15:8080/prods/change", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
