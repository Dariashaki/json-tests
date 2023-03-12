import {faker} from '@faker-js/faker';
import {createPost, deletePostById, getPostById, randomPost, register, updatePostById} from '../support/helpers';

const user = {
    email: faker.internet.email(),
    password: faker.internet.password(),
};

let accessToken;

describe('Post', () => {
    before(() => {
        register(user.email, user.password).then(response => {
            cy.log(`Registered user ${user.email}`);
            accessToken = response.body.accessToken;
        });
    });

    it('1. Get all posts', () => {
        cy.request('posts').then(response => {
            expect(response.status).to.eq(200);
            expect(response.headers['content-type']).to.include('application/json');
        });
    });

    it('2. Get only first 10 posts', () => {
        cy.request({
            url: 'posts',
            qs: {
                _sort: 'id',
                _order: 'asc',
                _limit: 10
            }
        }).then(response => {
            expect(response.status).to.eq(200);
            expect(response.body.length).to.eq(10);
            for (let i = 0; i < 10; i++) {
                expect(response.body[i].id).to.eq(i + 1);
            }
        });
    });

    it('3. Get posts with id = 55 and id = 60', () => {
        cy.request('posts?id=55&id=60&_sort=id&_order=asc').then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body[0].id).to.eq(55);
            expect(response.body[1].id).to.eq(60);
        });
    });

    it('4. Create a post', () => {
        const post = randomPost();
        cy.log(`Creating a post ${post.title}`);
        cy.request({
            method: 'POST',
            url: '664/posts',
            body: post,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(401);
        });
    });

    it('5. Create a post with access token', () => {
        cy.request({
            method: 'POST',
            url: '664/posts',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: randomPost(),
        })
            .then(response => {
                expect(response.status).to.eq(201);
                getPostById(response.body.id);
            })
            .then(response2 => {
                expect(response2.status).to.eq(200);
                cy.log('Verified post created');
            });
    });

    it('6. Create a post using json in body', () => {
        cy.request({
            method: 'POST',
            url: 'posts',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(randomPost()),
        })
            .then(response => {
                expect(response.status).to.eq(201);
                getPostById(response.body.id);
            })
            .then(response2 => {
                expect(response2.status).to.eq(200);
                cy.log('Verified post created');
            });
    });

    it('7. Update non-existing entity', () => {
        updatePostById(faker.random.numeric(8), randomPost()).then(response => {
            expect(response.status).to.eq(404);
        });
    });

    it('8. Create post entity and update the created entity', () => {
        const post = randomPost();
        const updatedPost = randomPost();
        createPost(post)
            .then(response => {
                expect(response.status).to.eq(201);
                expect(response.body.title).to.eq(post.title);
                updatePostById(response.body.id, updatedPost);
            })
            .then(response2 => {
                expect(response2.status).to.eq(200);
                getPostById(response2.body.id);
            })
            .then(response3 => {
                expect(response3.status).to.eq(200);
                expect(response3.body.title).to.eq(updatedPost.title);
            });
    });

    it('9. Delete non-existing post entity', () => {
        deletePostById(faker.random.numeric(8)).then(response => {
            expect(response.status).to.eq(404);
        });
    });

    it('10. Create, update and delete a post', () => {
        let postId;

        createPost(randomPost())
            .then(response => {
                postId = response.body.id;
                expect(response.status).to.eq(201);
                updatePostById(postId, randomPost());
            })
            .then(response2 => {
                expect(response2.status).to.eq(200);
                deletePostById(postId);
            })
            .then(response3 => {
                expect(response3.status).to.eq(200);
                getPostById(postId);
            })
            .then(response4 => {
                expect(response4.status).to.eq(404);
            });
    });
});
