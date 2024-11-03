import "../scss/index.scss";
import axios from "axios";

const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");
const basketOrAdd = document.querySelector(".basket");
const productsDiv = document.querySelector(".products");
const refresh = () => {
  axios
    .get("https://shop-backend-xzw2.onrender.com/auth/refresh", {
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
window.addEventListener("DOMContentLoaded", (e) => {
  axios
    .get("https://shop-backend-xzw2.onrender.com/prods", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((res) => {
      const data = res.data;
      const products = data.products;

      if (data.seller_id) {
        basketOrAdd.innerHTML = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" fill="#1C274C"/>
        </svg>`;
        basketOrAdd.classList.value = "add";
        localStorage.setItem("seller_have", "true");
      } else {
        basketOrAdd.classList.value = "add";
        localStorage.setItem("seller_have", "false");
      }
      for (let item of products) {
        productsDiv.innerHTML += `<a href="https://grand-jalebi-a4003c.netlify.app/product?id=${item.id}">
          <div class="products-card">
            <img src="${item.img}" alt="" />
            <h2>${item.name}</h2>
            <p>${item.price}</p>
          </div>
        </a>`;
      }
    })
    .catch((err) => {
      console.log("Mahsulotlarni olishda xato:", err);
      refresh();
    });
});

const prodForm = document.querySelector("#prodForm");
prodForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("image");
  const file = fileInput.files[0];

  if (!file) {
    console.error("Rasm tanlanmadi!");
    return;
  }

  const formData = new FormData();
  formData.append("upload_file", file);

  // Rasmni yuklash
  axios
    .post("https://shop-backend-xzw2.onrender.com/images/prod", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log("Rasm muvaffaqiyatli yuklandi:", response.data);
      const name = document.getElementById("name").value;
      const price = document.getElementById("price").value;
      const description = document.getElementById("description").value;
      const stock = document.getElementById("stock").value;

      // Mahsulot ma'lumotlarini yuborish
      const data = {
        name: name,
        price: price,
        description: description,
        stock_quantity: stock,
        prod_img: response.data.image_id,
      };

      return axios.post(
        "https://shop-backend-xzw2.onrender.com/prods/add",
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    })
    .then((response) => {
      console.log("Mahsulot muvaffaqiyatli qo'shildi:", response.data);
      prodForm.reset();
      if (response.status != 200) {
        const errorRes = document.querySelector(".resError");
        errorRes.innerHTML = response.data;
      }
    })
    .catch((error) => {
      console.error("Xatolik:", error);
    });
});

const sellerHave = JSON.parse(localStorage.getItem("seller_have"));
const modal = document.querySelector(".product-modal");

if (sellerHave == true) {
  basketOrAdd.addEventListener("click", (e) => {
    console.log(modal.style.display);
    if (modal.style.display === "none" || !modal.style.display) {
      console.log("Opening modal...");
      modal.style.display = "flex";
    } else if (modal.style.display === "flex") {
      console.log("Closing modal...");
      modal.style.display = "none";
    }
  });
}
if (sellerHave == false) {
  basketOrAdd.addEventListener("click", (e) => {
    location.href = "basket.html";
  });
}
const search = document.querySelector(".search form");
search.addEventListener("submit", (e) => {
  e.preventDefault();
  const sortSelect = document.querySelector("#filters");
  const name = document.querySelector("#search");
  axios
    .get(
      `https://shop-backend-xzw2.onrender.com/prods/sort?sort=${sortSelect.value}&value=${name.value}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    .then((res) => {
      console.log(res.data.products);
      productsDiv.innerHTML = "";
      for (let item of res.data.products) {
        productsDiv.innerHTML += `<a href="https://grand-jalebi-a4003c.netlify.app/product?id=${item.id}">
          <div class="products-card">
            <img src="${item.img}" alt="" />
            <h2>${item.name}</h2>
            <p>${item.price}</p>
          </div>
        </a>`;
      }
    });
});
