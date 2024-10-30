import "../scss/sign-in.scss";
import axios from "axios";

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const first_name = document.querySelector("#first_name").value;
  const last_name = document.querySelector("#last_name").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const gender = document.querySelector("#gender").value;
  const role = document.querySelector("#role").value;
  axios
    .post("http://192.168.1.15:8000/auth/sign-up", {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      gender: gender,
      role: role,
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
      if (res.status == 201) {
        window.location.href = "index.html";
      }
    })
    .catch((err) => console.log(err));
});
