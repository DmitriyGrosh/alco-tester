import { http } from "../http";

export const api = http;

api.setBaseURL('https://api.example.com');
api.setDefaultHeaders({
    'Content-Type': 'application/json',
});

api.setRefreshHandler(() => {
    return Promise.resolve();
});

api.setBearerToken(() => {
    return Promise.resolve('token');
});
