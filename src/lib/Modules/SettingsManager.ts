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
    banner: Object,
    avatar: Object,
}


class Saving {    
    user: string;

    constructor(user: string) {
        this.user = user;
    }

    async Save(item: string, value: string) {
        try {
            await pb.collection('users').update(this.user.id, {
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
}

export async function UpdateBannerImage(banner: any, user: any) {
    if(!user || !banner) return {
        status: 'error',
        message: 'Invalid data.',
        time: new Date().toISOString(),
        data: null
    }

    const formData = new FormData();
    formData.append('file', banner.file);
    formData.append('title', 'banner');
    
    const createdRecord = await pb.collection('media').create(formData);
    const updatedProfile = await pb.collection('users').update(user.id, {
        banner: createdRecord.id
    })

    if(createdRecord.status === 'error') {
        return {
            status: 'error',
            message: 'Something went wrong.',
            time: new Date().toISOString(),
            data: null
        }
    } else {
        return {
            status: 'success',
            message: 'Banner updated.',
            time: new Date().toISOString(),
            data: null
        }
    }
}

export async function UpdateAvatarImage(avatar: any, user: any) {
    if(!user || !avatar) return {
        status: 'error',
        message: 'Invalid data.',
        time: new Date().toISOString(),
        data: null
    }

    const formData = new FormData();
    formData.append('file', avatar.file);
    formData.append('title', 'avatar');
    
    const createdRecord = await pb.collection('media').create(formData);
    const updatedProfile = await pb.collection('users').update(user.id, {
        avatar: createdRecord.id    
    })

    if(createdRecord.status === 'error') {
        return {
            status: 'error',
            message: 'Something went wrong.',
            time: new Date().toISOString(),
            data: null
        }
    } else {
        return {
            status: 'success',
            message: 'Avatar updated.',
            time    : new Date().toISOString(),
            data: null
        }
    }
}

export async function SaveProfileChanges(data: CustomizableProfileData, user: any): any {
    const MAX_HANDLE_USERNAME_CHARACTERS = 24;
    const MAX_BIO_CHARACTERS = 200; 
    const MAX_TITLE_CHARACTERS = 36;
    const MAX_WEBSITE_CHARACTERS = 100;

    const Save = new Saving(user);

    console.log(data);

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
    const originalBanner = user.banner;
    const originalAvatar = user.avatar;
    
    function isValidUrl(string: string) {
        var urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return urlRegex.test(string);
    }
    
    async function ShouldSaveHandle() {
        if(data.handle !== originalHandle) {
            return true;
        } else { return false }
    }

    function ShouldSaveUsername() {
        if(data.username !== originalUsername) {
            return true;
        } else { return false };
    }

    function ShouldSaveBanner() {
        if(data.banner.url !== originalBanner && data.banner.file !== undefined || null) {
            return true;
        } else {
            return false;
        }
    }

    function ShouldSaveAvatar() {
        if(data.avatar.url !== originalAvatar) {
            return true;
        }
    }

    function ShouldSaveBio() {
        if(data.bio !== originalBio && data.bio.length <= 200) {
            return true;
        } else { return false };
    }

    function ShouldSaveTitle() {
        if(data.title !== originalTitle) {
            return true;
        } else { return false };
    }

    function ShouldSaveWebsite() {
        if(data.website !== originalWebsite) {
            return true;
        } else { return false };
    }

    const saveHandle = await ShouldSaveHandle();
    const saveUsername = ShouldSaveUsername();
    const saveBio = ShouldSaveBio();
    const saveTitle = ShouldSaveTitle();
    const saveWebsite = ShouldSaveWebsite();
    const saveBanner = ShouldSaveBanner();
    const saveAvatar = ShouldSaveAvatar();
    
    if(saveHandle) {
        if(data.handle.length > MAX_HANDLE_USERNAME_CHARACTERS) return {
            status: 'error',
            message: `Your handle cannot be more than ${MAX_HANDLE_USERNAME_CHARACTERS} characters long.`,
            time: new Date().toISOString(),
            data: null
        }

        try {
            const users = await pb.collection('users').getFirstListItem(`handle="${data.handle}"`)
            if(users) return {
                status: 'error',
                message: 'Handle is already in use.',
                time: new Date().toISOString(),
                data: null
            }

            return {
                status: 'error',
                message: 'Successfully updated profile.',
                time: new Date().toISOString(),
                data: null
            }
        } catch (err) {
            if (err.status === 404) {
                const handleSaved = await Save.Save('handle', data.handle);
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
        }
    }

    if(saveUsername) {
        if(data.username.length > MAX_HANDLE_USERNAME_CHARACTERS) return {
            status: 'error',
            message: `Your username cannot be more than ${MAX_HANDLE_USERNAME_CHARACTERS} characters long.`,
            time: new Date().toISOString(),
            data: null
        }

        console.log(data.username);

        const usernameSaved = await Save.Save('username', data.username);
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

        const bioSaved = await Save.Save('bio', data.bio);
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

        const titleSaved = await Save.Save('job_title', data.title);
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

        const websiteSaved = await Save.Save('website', data.website);
        if(websiteSaved.status === 'error') {
            return websiteSaved;
        }
    }

    if(saveBanner) {
        const bannerSaved = await UpdateBannerImage(data.banner, user);
        if(bannerSaved.status === 'error') {
            return bannerSaved;
        }
    }

    if (saveAvatar) {
        console.log(data.avatar)
        const avatarSaved = await UpdateAvatarImage(data.avatar, user);
        if(avatarSaved.status === 'error') {
            return avatarSaved;
        }
    }

    return {
        status: 'success',
        message: 'Profile updated.',
        time: new Date().toISOString(),
        data: null
    }
}

