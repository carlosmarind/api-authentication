import jwt from 'jsonwebtoken';
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

export const validateUserWithToken = (user: string, password: string) => {

    let secret: string = process.env.JWT_SECRET_KEY ?? '';
    console.log('secret:', secret);
    if (user === db.User.username && password === db.User.password) {
        let token = jwt.sign(
            {
                username: db.User.username,
                email: db.User.email,
                role: db.User.role
            },
            secret,
            {
                expiresIn: "1d",
            });
        console.log('token:', token);
        return { isAuthenticated: true, token };
    }
    return { isAuthenticated: false };
}