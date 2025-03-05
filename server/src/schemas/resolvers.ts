import User from '../models/User.js';
// import sign token function from auth
import { signToken, AuthenticationError } from '../services/auth.js';

interface UserArgs {
    id?: string;
    username?: string;
};

interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
};

interface LoginUserArgs {
    username: string;
    email: string;
    password: string;
}

interface BookArgs {
    bookId: string;
    title: string;
    authors: string[];
    description: string;
    image: string;
    link: string;
}

const resolvers = {
    Query: {
        // get a single user by either their id or their username
        user: async (_parent: any, { id, username }: UserArgs) => {
            const foundUser = await User.findOne({
                $or: [{ _id: id }, { username }]
            });

            if (!foundUser) {
                throw new Error('Cannot find a user with this id!')
            }

            return foundUser;
        },

        

    },
    Mutation: {
        addUser: async (_parent: any, { input }: AddUserArgs) => {
            // Create a new user with the provided username, email, and password
            const user = await User.create({ ...input });
    
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);
    
            // Return the token and the user
            return { token, user };
        },

        login: async (_parent: any, { username, email, password }: LoginUserArgs) => {
            // Find a user with the provided email
            const user = await User.findOne({ 
                $or: [{ username }, { email }]
            });
          
            // If no user is found, throw an AuthenticationError
            if (!user) {
              throw new AuthenticationError('Could not authenticate user.');
            }
          
            // Check if the provided password is correct
            const correctPw = await user.isCorrectPassword(password);
          
            // If the password is incorrect, throw an AuthenticationError
            if (!correctPw) {
              throw new AuthenticationError('Could not authenticate user.');
            }
          
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);
          
            // Return the token and the user
            return { token, user };
          },

        // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        saveBook: async (_parent: any, { ...book }: BookArgs, context: any) => {
            if(context.user){
                return await User.findOneAndUpdate(
                    { _id: context.user._id},
                    { $addToSet: { ...book } }
                );
            }
            throw AuthenticationError;
        },

        // remove a book from `savedBooks`
        removeBook: async (_parent: any, { bookId }: BookArgs, context: any) => {
            if(context.user){
                return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: {savedBooks: bookId}}
                );
            }
            throw AuthenticationError;
        }

    }
};

export default resolvers;