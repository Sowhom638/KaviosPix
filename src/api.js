import axios from 'axios';

const api = axios.create({
    baseURL: "https://kavios-pix-photo-sharing-app.vercel.app/auth/",
    // withCredentials: true,
});

export const googleAuth = (code) => api.get(`/google?code=${code}`);