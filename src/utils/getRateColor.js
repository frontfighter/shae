export default getRateColor = (value, maxWidth, section) => {
  let color;
  let fillingWidth;

  switch (value) {
    case 5:
      color = ["rgb(0,187,116)", "rgb(55,211,152)"];
      fillingWidth = maxWidth;

      break;
    case 4:
      color = ["rgb(0,187,116)", "rgb(55,211,152)"];
      fillingWidth = maxWidth * 0.8042813455657492;

      break;
    case 3:
      color = ["rgb(0,187,116)", "rgb(55,211,152)"];
      fillingWidth = maxWidth * 0.5535168195718654;

      break;
    case 2:
      color = ["rgb(246,202,51)", "rgb(251,215,91)"];
      fillingWidth =
        section === "Recipes" ? maxWidth * 0.552293577981651 : maxWidth * 0.6; // * 0.2752293577981651;

      break;
    case 1:
      color = ["rgb(247,141,16)", "rgb(255,163,55)"];
      fillingWidth = maxWidth * 0.56;

      break;

    case -1:
      color = ["rgb(235,75,75)", "rgb(249,101,101)"];
      fillingWidth = maxWidth * 0.35;

      break;

    case -2:
      color = ["rgb(235,75,75)", "rgb(249,101,101)"];
      fillingWidth = maxWidth * 0.4;

      break;

    case -3:
      color = ["rgb(235,75,75)", "rgb(249,101,101)"];
      fillingWidth = maxWidth * 0.6;

      break;

    case -4:
      color = ["rgb(235,75,75)", "rgb(249,101,101)"];
      fillingWidth = maxWidth * 0.8;

      break;

    case -5:
      color = ["rgb(235,75,75)", "rgb(249,101,101)"];
      fillingWidth = maxWidth;

      break;
    default:
      color = ["rgb(186,195,208)", "rgb(186,195,208)"];
      fillingWidth = maxWidth * 0.2018348623853211;
  }

  // fillingWidth = maxWidth;

  return { color, width: fillingWidth };
};

export const getTasteColor = (value, maxWidth, name) => {
  let color;
  let fillingWidth;

  switch (value) {
    case 5:
      fillingWidth = maxWidth;

      break;
    case 4:
      fillingWidth = maxWidth * 0.8042813455657492;

      break;
    case 3:
      fillingWidth = maxWidth * 0.5535168195718654;

      break;
    case 2:
      fillingWidth = maxWidth * 0.2752293577981651;

      break;
    case 1:
      fillingWidth = maxWidth * 0.56;

      break;

    case -1:
      fillingWidth = maxWidth * 0.35;

      break;

    case -2:
      fillingWidth = maxWidth * 0.4;

      break;

    case -3:
      fillingWidth = maxWidth * 0.6;

      break;

    case -4:
      fillingWidth = maxWidth * 0.8;

      break;

    case -5:
      fillingWidth = maxWidth;

      break;
    default:
      if (name === "SAVORY") {
        fillingWidth = maxWidth * 0.2518348623853211;
      } else {
        fillingWidth = maxWidth * 0.2018348623853211;
      }
  }

  switch (name) {
    case "SALTY":
      color = ["rgb(232,122,66)", "rgb(232,122,66)"];

      break;
    case "SAVORY":
      color = ["rgb(137,90,215)", "rgb(137,90,215)"];

      break;
    case "BITTER":
      color = ["rgb(57,197,198)", "rgb(57,197,198)"];

      break;
    case "SOUR":
      color = ["rgb(100,201,95)", "rgb(100,201,95)"];

      break;
    case "SPICY":
      color = ["rgb(227,82,82)", "rgb(227,82,82)"];

      break;
    case "SWEET":
      color = ["rgb(238,115,165)", "rgb(238,115,165)"];

      break;
    default:
      color = ["rgb(137,90,215)", "rgb(137,90,215)"];
  }

  return { color, width: fillingWidth };
};
