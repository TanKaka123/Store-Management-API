import mongoose from "mongoose";
import os from "os";
import process from "process";

const SECOND_CHECK_OVERLOAD = 5000;
const MAX_CONNECTION_PER_CORES = 5;

// COUNT CONNECTION -> MONGOOSE.CONNECTIONS.LENGTH
export const countConnect = () => {
    const numConnection = mongoose.connections.length;
    return numConnection;
}

// check overload
export const checkOverload = () => {
    setInterval(() => {
        const numConnection = countConnect();
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        
        console.log(`Activity connection: ${numCores}`)
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`)

        // Asume: maximum number of connections based on the number of cores
        const maxConnection = numConnection * MAX_CONNECTION_PER_CORES;

        if (numConnection > maxConnection) {
            console.log("Connection overload detected !!");
            // NOTIFICATION OVERLOAD
        }
    }, SECOND_CHECK_OVERLOAD)
}