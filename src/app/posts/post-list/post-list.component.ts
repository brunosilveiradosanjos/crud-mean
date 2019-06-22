import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
    /* posts = [
        { title: 'First Post', content: 'this is the first post\'s content' }
        , { title: 'Second Post', content: 'this is the second post\'s content' }
        , { title: 'Third Post', content: 'this is the third post\'s content' }
    ]; */

    posts: Post[] = [];
    isLoaging = false;
    private postsSub: Subscription;

    constructor(public postsService: PostsService) { }

    ngOnInit() {
        this.isLoaging = true;
        this.postsService.getPosts();
        this.postsSub = this.postsService.getPostUpdateListener()
            .subscribe((posts: Post[]) => {
                this.isLoaging = false;
                this.posts = posts;
            });
    }

    onDelete(postId: string) {
        this.postsService.deletePost(postId);
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe();
    }
}
