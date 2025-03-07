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
    email: string;
    password: string;
}

interface SaveBookArgs {
    book: {
        bookId: string;
        title: string;
        authors: string[];
        description: string;
        image: string;
        link: string;
    }
}

interface RemoveBookArgs {
    bookId: string
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
        // Query to get the authenticated user's information
        // The 'me' query relies on the context to check if the user is authenticated
        me: async (_parent: any, _args: any, context: any) => {
            // If the user is authenticated, find and return the user's information along with their thoughts
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            // If the user is not authenticated, throw an AuthenticationError
            throw new AuthenticationError('Could not authenticate user.');
        }

    },
    Mutation: {
        addUser: async (_parent: any, { input }: AddUserArgs) => {
            // Create a new user with the provided username, email, and password
            const user = await User.create({ ...input, savedBooks: [] });
    
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);
    
            // Return the token and the user
            return { token, user };
        },

        login: async (_parent: any, { email, password }: LoginUserArgs) => {
            // Find a user with the provided email
            const user = await User.findOne({ email });
          
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
            console.log('token = ', token);
            console.log('user = ', user);
            // Return the token and the user
            return { token, user };
          },

        // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        saveBook: async (_parent: any, { book }: SaveBookArgs, context: any) => {
            if(context.user){
                return await User.findOneAndUpdate(
                    { _id: context.user._id},
                    { $addToSet: { savedBooks: book } },
                    { new: true }
                );
            }
            throw new AuthenticationError('You must be logged in to save a book.');
        },

        // remove a book from `savedBooks`
        removeBook: async (_parent: any, { bookId }: RemoveBookArgs, context: any) => {
                if(!context.user){
                    /*this is just here as an added security measure. It should not be possible for a user to have books to remove if
                      they are not logged in.*/
                    throw new AuthenticationError('You must be logged in to remove a book.');                 
                }

                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );

                if(!updatedUser){
                    throw new Error('User not found');
                }

                return updatedUser;
        }

    }
};

export default resolvers;