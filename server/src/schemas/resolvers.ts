import {
    findUser
} from '../controllers/user-controller.js'

const resolvers = {
    Query: {
        user: async (_parent: unknown, args: { id?: string, username?: string}) => {
            const user = await findUser(args.id, args.username);
            if(!user){
                throw new Error('User not found.'); //apparently this gets caught by GraphQL and returned as part of the GraphQL response.
            }
            return user;
        }
    }
};

export default resolvers;