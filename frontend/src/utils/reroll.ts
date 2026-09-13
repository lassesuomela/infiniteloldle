import axios from "axios";
import Config from "../configs/config";

/**
 *
 * @param {"ability" | "champion" | "splash" | "item" | "oldItem"} type
 */
const Reroll = (type) => {
  axios
    .put(
      Config.url + "/user/" + type,
      {},
      {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      }
    )
    .then((response) => {
      if (response.data.status === "success") {
        window.location.reload();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export { Reroll };
