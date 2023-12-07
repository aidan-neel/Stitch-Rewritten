import { pb } from "$lib/Pocketbase";
import { imageUrlToFormData } from "./Utils";

export interface AuthResponse {
    status: string;
    message: string;
    time: string;
    data: any;
}

export const emailTaken = async(email: string) => {
    try {
        const data = await pb.collection('users').getFirstListItem(`user_email="${email}"`);
        console.log(data)
        return data !== null || undefined;
    } catch (err) {
        console.log(err.status)
        // Check if the error is a 404 error
        if (err.status === 404) {
            // If it's a 404 error, the email is not taken
            return false;
        } else {
            // If it's any other error, rethrow it or handle it appropriately
            throw err;
        }
    }
}       

export const handleTaken = async(handle: string) => {
    try {
        const users = await pb.collection('users').getFirstListItem(`handle="${handle}"`)
        return users !== null || undefined;
    } catch (err) {
        // Check if the error is a 404 error
        if (err.status === 404) {
            // If it's a 404 error, the handle is not taken
            return false;
        } else {
            // If it's any other error, rethrow it or handle it appropriately
            throw err;
        }
    }
}

/* RegisterWithEmailAndPassword (email: string, password: string)
Checks if handle nor email are in use, then creates a new user with the given email and password.
Logs the user in, and returns the user data.
*/
export const RegisterWithEmailAndPassword = async(email: string, password: string): Promise<AuthResponse> => {
    if (!email || !password) {
        return {
            'status': 'error',
            'message': 'Email and password are required.',
            'time': new Date().toISOString(),
            'data': null
        }
    }

    const avatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${email.split('@')[0]}`
    
    let formData;

    imageUrlToFormData(avatarUrl).then((data) => {
        if (data) {
            formData = data;
        }
    })

    const data = {
        username: email.split('@')[0],
        password: password,
        email: email,
        passwordConfirm: password,
        handle: email.split('@')[0].toLowerCase(),
        bio: 'No bio yet',
        user_email: email,
    }

    const emailIsTaken = await emailTaken(email);
    const handleIsTaken = await handleTaken(data.handle);

    if (emailIsTaken) {
        return {
            'status': 'error',
            'message': 'Email is already in use.',
            'time': new Date().toISOString(),
            'data': null
        }
    }

    if (handleIsTaken) {
        return {
            'status': 'error',
            'message': 'Handle is already in use.',
            'time': new Date().toISOString(),
            'data': null
        }
    }

    try {
        const createdUser = await pb.collection('users').create(data);
        await LoginWithEmailAndPassword(email, password);
        return {
            'status': 'success',
            'message': 'User created successfully.',
            'time': new Date().toISOString(),
            'data': createdUser
        }
    } catch (err) {
        return {
            'status': 'error',
            'message': err.data.message,
            'time': new Date().toISOString(),
            'data': null
        }
    } 
}

// Logs in a user with email and password and returns the user data
export const LoginWithEmailAndPassword = async(email: string, password: string): Promise<AuthResponse> => {
    if (!email || !password) {
        return {
            'status': 'error',
            'message': 'Email and password are required.',
            'time': new Date().toISOString(),
            'data': null
        }
    }

    try {
        const data = await pb.collection('users').authWithPassword(email, password)
        return {
            'status': 'success',
            'message': 'User logged in successfully.',
            'time': new Date().toISOString(),
            'data': data
        }
    } catch (err) {
        return {
            'status': 'error',
            'message': err.data.message,
            'time': new Date().toISOString(),
            'data': null
        }
    }
}