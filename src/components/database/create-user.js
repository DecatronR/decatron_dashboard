import Dexie from "dexie";

export const CreateUserDB = new Dexie("CreateUserDatabase");
CreateUserDB.version(1).stores({
    userDetails: "++id, name, email, role, date"
});