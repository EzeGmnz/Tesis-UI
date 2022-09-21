import axios from 'axios';

export const GET = (url: string) => axios.get(url).then((res) => res.data);
