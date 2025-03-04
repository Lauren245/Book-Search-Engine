const typeDefs = `
  type User {
    _id: String!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]!
  }

  type Book {
      authors: [String]!
      description: String!
      bookId: String!
      image: String!
      link: String!
      title: String!
  }

  type Query {
      user(_id: String, username: String): User
        
  }

`;

export default typeDefs;