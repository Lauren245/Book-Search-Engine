import { gql } from '@apollo/client';

export const LOGIN_USER = gql `
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const ADD_USER = gql `
    mutation addUser($input: UserInput!) {
        addUser(input: $input) {
            user {
                username
                email
                _id
            }
            token
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($book: BookInput!) {
        saveBook(book: $book) {
            savedBooks {
                bookId
                authors
                description
                title 
                image
            }
        }
    }
`;

export const REMOVE_BOOK = gql `
    mutation removeBook($bookId: String!) {
        removeBook(bookId: $bookId) {
            bookId
            authors
            description
            title 
            image
            link
        }
    }
`;