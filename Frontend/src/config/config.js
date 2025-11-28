const env = import.meta.env.MODE || "production";

export const local_url = "http://localhost";
export const local_port = "5000";

export const prod_url = "https://expensewise-smart-expense-tracker.onrender.com";
export const prod_port = "";

export const version = 'api';

export const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export const url = env === "development" ? local_url : prod_url;
export const port = env === "development" ? local_port : prod_port;
export const LINK = port ? `${url}:${port}` : `${url}`;
