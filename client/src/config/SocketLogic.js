
// ensure socket is bound only once
import io from "socket.io-client";

const ENDPOINT = 'http://localhost:5005/';

export const socket = io(ENDPOINT)

