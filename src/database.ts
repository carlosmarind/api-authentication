import db from './db.json' assert { type: "json" }


export const validatePlainUser = (user: string, password: string) => {
    if (user === db.plainUser.username && password === db.plainUser.password) {
        return true;
    }
    return false;
}


export const validateUser = (user: string, password: string) => {
    if (user === db.User.username && password === db.User.password) {
        return { isAuthenticated: true, username: db.User.username, email: db.User.email, role: db.User.role };
    }
    return { isAuthenticated: false };
}