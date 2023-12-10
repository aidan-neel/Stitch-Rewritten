import { pb } from '$lib/Pocketbase';

export class Media {
    user: any

    constructor(user: any) {
        this.user = user;
    }

    async fetch_banner(): Promise<string> {
        let user_data = this.user;
        
        if(!user_data) {
            return '';
        }
        
        if(!user_data.expand?.banner) {
            return 'https://api.dicebear.com/7.x/shapes/svg?seed=' + user_data.handle;
        }

        const collection_name = "media";
        const record_id = user_data.banner
        const file_name = user_data.expand?.banner.file;

        const url = pb.files.getUrl(user_data.expand?.banner, file_name)
        
        return url;
    }

    async fetch_avatar(): Promise<string> {
        let user_data = this.user;
        
        if(!user_data) {
            return '';
        }
        if(user_data.expand?.avatar) {
            const collection_name = "media";
            const record_id = user_data.avatar
            const file_name = user_data.expand?.avatar.file;
    
            const url = pb.files.getUrl(user_data.expand?.avatar, file_name)
    
            return url;        
        } else if(user_data.avatar && user_data.avatar.file) {
            const collection_name = "media";
            const record_id = user_data.avatar
            const file_name = user_data.avatar.file;
            console.log(user_data.avatar)
            const url = pb.files.getUrl(user_data.avatar, file_name)
            console.log(url)
            return url;
        } else {
            return 'https://api.dicebear.com/7.x/shapes/svg?seed=' + user_data.handle;
        }
    }
}