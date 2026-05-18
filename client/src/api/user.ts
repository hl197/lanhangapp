import client from "./client";

export const getProfile = () => client.get("/user/profile");
export const getCardStatus = () => client.get("/user/card-status");
