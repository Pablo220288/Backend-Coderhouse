import moment from "moment";

//time
export const dateShort = () => {
  let date = moment().format("HH:mm");
  return date;
};
