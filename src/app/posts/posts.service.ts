import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Portal } from '@angular/cdk/portal';

@Injectable({ providedIn: 'root' })
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) {

    }

    getPosts() {
        this.http.get<{ message: string, posts: any }>
            (
                'http://localhost:3000/api/posts'
            )
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id
                    };
                });
            }))
            .subscribe(TransformedPosts => {
                this.posts = TransformedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
        console.log('posts.service getPost id:' + id);
        // spread operator
        return this.http.get<{ _id: string, title: string, content: string }>('http://localhost:3000/api/posts/' + id);
        // return { ...this.posts.find(p => p.id === id) };
    }

    addPost(title: string, content: string) {
        // tslint:disable-next-line: object-literal-shorthand
        const post: Post = { id: null, title: title, content: content };
        this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
            .subscribe((responseData) => {
                const id = responseData.postId;
                post.id = id;
                // console.log(responseData.message);
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            });
    }

    updatePost(id: string, title: string, content: string) {
        // tslint:disable-next-line: object-literal-shorthand
        const post: Post = { id: id, title: title, content: content };
        this.http
            .put('http://localhost:3000/api/posts/' + id, post)
            .subscribe(response => {
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
            });
        console.log('posts.service updatePost id:' + post.id + ' title: ' + post.title + ' content: ' + post.content);
    }

    deletePost(postId: string) {
        this.http.delete('http://localhost:3000/api/posts/' + postId)
            .subscribe(() => {
                const updatedPosts = this.posts.filter(post => post.id !== postId);
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
                console.log('Deleted: http://localhost:3000/api/posts/' + postId);
            });
    }
}
