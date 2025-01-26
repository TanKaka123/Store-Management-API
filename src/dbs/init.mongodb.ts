import mongoose from "mongoose";
import { countConnect } from "../helpers/check.connect";


class Database {
    private static instance: Database | null = null;

    private constructor() { }

    public async connect(type: 'mongodb', uriConnection: string): Promise<void> {
        try {
            if (1) {
                mongoose.set('debug', true);
                mongoose.set('debug', { color: true });
            }

            await mongoose.connect(uriConnection, {
                maxPoolSize: 10
            });
            console.log("Database connection successful!");
            console.log("Number of connection: ", countConnect())
        } catch (err) {
            console.error("Database connection error:", err);
        }
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

export default instanceMongodb;

