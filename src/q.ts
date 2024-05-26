import Bull from "bull";

export const q = new Bull('download image', { redis: { port: 6379, host: '127.0.0.1', password: 'pass' } })


import './process' // this should be last import
