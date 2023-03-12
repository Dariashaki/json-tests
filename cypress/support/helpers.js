import {faker} from "@faker-js/faker";

export function register(email, password) {
    cy.log(`Registering user ${email}`);
    return cy.request({
        method: 'POST',
        url: 'register',
        body: {
            email,
            password,
        },
    });
}

export function getPostById(id) {
    cy.log(`Getting post ${id}`);
    return cy.request({
        method: 'GET',
        url: `posts/${id}`,
        failOnStatusCode: false,
    });
}

export function deletePostById(id) {
    cy.log(`Deleting post ${id}`);
    return cy.request({
        method: 'DELETE',
        url: `posts/${id}`,
        failOnStatusCode: false,
    });
}

export function updatePostById(id, body) {
    cy.log(`Updating post ${id}`);
    return cy.request({
        method: 'PATCH',
        url: `posts/${id}`,
        body,
        failOnStatusCode: false,
    });
}

export function createPost(body, headers) {
    cy.log(`Creating post "${body.title}"`);
    return cy.request({
        method: 'POST',
        url: `posts`,
        body,
        headers,
    });
}

export function randomPost() {
    return {
        title: faker.random.words(2),
        body: faker.random.words(5)
    };
}