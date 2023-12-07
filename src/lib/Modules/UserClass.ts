import { pb } from "$lib/Pocketbase";

export interface UserData {
    id: string;
    username: string;
    email: string;
    handle: string;
    avatar: File;
    verified: boolean;
}

export class User {
    user: UserData;
    posts: any;

    constructor() {
        this.user = pb.authStore.model as UserData;
        this.posts = new Posts();
    }

    get() {
        return this.user;
    }
}

export class Posts {
    user: UserData;

    constructor() {
        this.user = pb.authStore.model as UserData;
    }
    
    async create(post: any) {
        if(!post) {
            return "No post provided";
        }

        const postData = {
            ...post,
            user: this.user.id
        }

        const record = await pb.collection("posts").create(postData);
        return record;
    }

    async createComment(data: any) {
        if(!data) {
            return "No data provided";
        }
        
        const record = await pb.collection("comments").create(data);
        const post_data = await pb.collection('posts').getOne(data.original_post, {
            expand: 'comments'
        })

        const post_record = await pb.collection('posts').update(data.original_post, {
            'comments+': record.id,
        })

        return record;
    }

    async like(post: any) {
        const like_record = await pb.collection('likes').create({
            'user': this.user.id,
            'post': post
        })  
        
        const post_data = await pb.collection('posts').getOne(post, {
            expand: 'likes'
        });

        const post_record = await pb.collection('posts').update(post, {
            'likes+': like_record.id,
        })

        return like_record;
    }

    async unlike(post: any) {
        const r = await pb.collection('likes').getList(1, 50, {
            filter: `user = '${pb.authStore.model?.id}' && post = '${post}'`
        });

        const post_data = await pb.collection('posts').getOne(post, {
            expand: 'likes'
        });

        const like_record = await pb.collection('likes').delete(r.items[0].id);
        const post_record = await pb.collection('posts').update(post, {
            'likes-': r.items[0].id,
            'likes_amount': post_data.likes_amount - 1,
        })

        return like_record;
    }

    get() {
        if(!this.user) {
            return "No user provided";
        }

        const posts = pb.authStore.model?.posts;
        return posts;
    }
}