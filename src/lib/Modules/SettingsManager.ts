import { pb } from "$lib/Pocketbase";

export interface DefaultResponse {
    status: string;
    message: string;
    time: string;
    data: any;
}

export interface CustomizableProfileData {
    handle: string,
    username: string,
    bio: string,
    title: string,
    website: string,
}

export async function SaveProfileChanges(data: CustomizableProfileData, user: any): any {
    const MAX_HANDLE_USERNAME_CHARACTERS = 24;
    const MAX_BIO_CHARACTERS = 200;
    const MAX_TITLE_CHARACTERS = 36;
    const MAX_WEBSITE_CHARACTERS = 100;

    if(!user || !data) return {
        status: 'error',
        message: 'Invalid data.',
        time: new Date().toISOString(),
        data: null
    }
    
    const originalHandle = user.handle;
    const originalUsername = user.username;
    const originalBio = user.bio;
    const originalTitle = user.title;
    const originalWebsite = user.website;

    function isValidUrl(string: string) {
        var urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return urlRegex.test(string);
    }
    

    // If this returns true, it will save the handle when it gets to the update profile part.
    // If it returns false, it will not save the handle.
    async function ShouldSaveHandle() {
        if(data.handle !== originalHandle) {
            return true;
        } else { return false }
    }

    // If this returns true, it will save the username when it gets to the update profile part.
    // If it returns false, it will not save the username.
    function ShouldSaveUsername() {
        if(data.username !== originalUsername) {
            return true;
        } else { return false };
    }

    // If this returns true, it will save the bio when it gets to the update profile part.
    // If it returns false, it will not save the bio.
    function ShouldSaveBio() {
        if(data.bio !== originalBio && data.bio.length <= 200) {
            return true;
        } else { return false };
    }

    // If this returns true, it will save the title when it gets to the update profile part.
    // If it returns false, it will not save the title.
    function ShouldSaveTitle() {
        if(data.title !== originalTitle) {
            return true;
        } else { return false };
    }

    // If this returns true, it will save the website when it gets to the update profile part.
    // If it returns false, it will not save the website.
    function ShouldSaveWebsite() {
        if(data.website !== originalWebsite) {
            return true;
        } else { return false };
    }

    async function Save(item: string, value: string) {
        try {
            await pb.collection('users').update(user.id, {
                [item]: value
            })
        } catch(err) {
            return {
                status: 'error',
                message: 'Something went wrong.',
                time: new Date().toISOString(),
                data: null
            }
        } finally {
            return {
                status: 'success',
                message: 'Profile updated.',
                time: new Date().toISOString(),
                data: null
            }
        }
    }

    const saveHandle = await ShouldSaveHandle();
    const saveUsername = ShouldSaveUsername();
    const saveBio = ShouldSaveBio();
    const saveTitle = ShouldSaveTitle();
    const saveWebsite = ShouldSaveWebsite();
    
    
    if(saveHandle) {
        if(data.handle.length > MAX_HANDLE_USERNAME_CHARACTERS) return {
            status: 'error',
            message: `Your handle cannot be more than ${MAX_HANDLE_USERNAME_CHARACTERS} characters long.`,
            time: new Date().toISOString(),
            data: null
        }

        try {
            const users = await pb.collection('users').getFirstListItem(`handle="${data.handle}"`)
        } catch (err) {
            if (err.status === 404) {
                const handleSaved = await Save('handle', data.handle);
                if(handleSaved.status === 'error') {
                    return handleSaved;
                }
            } else {
                // If it's any other error, return false
                return {
                    status: 'error',
                    message: 'Something went wrong.',
                    time: new Date().toISOString(),
                    data: null
                }
            }
        } finally {
            return {
                status: 'error',
                message: 'Handle is already in use.',
                time: new Date().toISOString(),
                data: null
            }
        }
    }

    if(saveUsername) {
        if(data.username.length > MAX_HANDLE_USERNAME_CHARACTERS) return {
            status: 'error',
            message: `Your username cannot be more than ${MAX_HANDLE_USERNAME_CHARACTERS} characters long.`,
            time: new Date().toISOString(),
            data: null
        }

        const usernameSaved = await Save('username', data.username);
        if(usernameSaved.status === 'error') {
            return usernameSaved;
        }
    }

    if(saveBio) {
        if(data.bio.length > MAX_BIO_CHARACTERS) return {
            status: 'error',
            message: `Your bio cannot be more than ${MAX_BIO_CHARACTERS} characters long.`,
            time: new Date().toISOString(),
            data: null
        }

        const bioSaved = await Save('bio', data.bio);
        if(bioSaved.status === 'error') {
            return bioSaved;
        }
    }

    if(saveTitle) {
        if(data.title.length > MAX_TITLE_CHARACTERS) return {
            status: 'error',
            message: `Your title cannot be more than ${MAX_TITLE_CHARACTERS} characters long.`,
            time: new Date().toISOString(),
            data: null
        }

        const titleSaved = await Save('job_title', data.title);
        if(titleSaved.status === 'error') {
            return titleSaved;
        }
    }

    if(saveWebsite) {
        if(data.website.length > MAX_WEBSITE_CHARACTERS) return {
            status: 'error',
            message: `Your website cannot be more than ${MAX_WEBSITE_CHARACTERS} characters long.`,
            time: new Date().toISOString(),
            data: null
        }

        console.log(isValidUrl(data.website))

        if(!isValidUrl(data.website)) return {
            status: 'error',
            message: 'URL is not valid.',
            time: new Date().toISOString(),
            data: null
        }

        const websiteSaved = await Save('website', data.website);
        if(websiteSaved.status === 'error') {
            return websiteSaved;
        }
    }

    return {
        status: 'success',
        message: 'Profile updated.',
        time: new Date().toISOString(),
        data: null
    }
}