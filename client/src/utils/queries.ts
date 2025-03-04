import { gql } from '@apollo/client';

const QUERY_USER = gql `
    query user($username: String!) {
        user(username: $username){
            username
            email
            books [
                {
                    authors[]
                    description
                    image 
                    link
                    title
                }
            ]
        }
    }
`;