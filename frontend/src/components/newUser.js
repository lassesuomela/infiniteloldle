import axios from "axios";
import Cookies from "universal-cookie";
import Config from "../configs/config";

export default function NewUser() {
  const cookies = new Cookies();
  if (cookies.get("isValidToken")) {
    return;
  }
  if (!localStorage.getItem("token")) {
    const nickname = "Teemo#" + Math.floor(Math.random() * 9999);
    axios
      .post(Config.url + "/user", { nickname })
      .then((response) => {
        if (response.data.status === "success") {
          localStorage.setItem("token", response.data.token);
          cookies.set("isValidToken", true, {
            path: "/",
            maxAge: 86400,
            sameSite: "strict",
            secure: true,
          });
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  axios
    .get(Config.url + "/user", {
      headers: { authorization: "Bearer " + localStorage.getItem("token") },
    })
    .then((response) => {
      if (response.data.status === "success") {
        cookies.remove("isValidToken");
        cookies.set("isValidToken", true, {
          path: "/",
          maxAge: 86400,
          sameSite: "strict",
          secure: true,
        });
      }
    })
    .catch((error) => {
      cookies.remove("isValidToken");
      console.log(error);
    });
}
