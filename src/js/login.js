import "../scss/login.scss";
import axios from "axios";

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  e.preventDefault();
  axios
    .post("http://192.168.1.15:8000/auth/login", {
      email: email,
      password: password,
    })
    .then((res) => {
      const accessToken = res.data.access_token;
      const refreshToken = res.data.refresh_token;
      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        console.log("Tokens saved to localStorage");
      } else {
        console.log("Tokens not found in response headers");
      }
      console.log(res.data);
      if (res.status == 200) {
        window.location.href = "index.html";
      }
      console.log(res.data);
    })
    .catch((err) => console.log(err));
});
