import * as SQLite from "expo-sqlite";
import { store } from "./store/store";
const id = store.getState().generalReducer.id

let db = SQLite.openDatabase(`mapilio-test-${id}.db`);

class Database  {
    getConnection() {
        return db;
    }
}

const database = new Database();

export default database