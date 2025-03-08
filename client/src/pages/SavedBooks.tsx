import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useEffect } from 'react';

import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

import { User } from '../models/User.js';
import { Book } from '../models/Book.js';

import { removeBookId } from '../utils/localStorage';


const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);

  const userData: User = data?.me || { username: '', savedBooks: [] };

  const [removeBook] = useMutation(REMOVE_BOOK, {
    fetchPolicy: 'network-only',
    update(cache, { data }){
      //check if removeBook data exists
      if(!data?.removeBook) {
        console.warn('No data returned from the removeBook mutation.');
        return;
      }

      console.log('Data returned from the removeBook mutation: ', data.removeBook);

      const existingUser = cache.readQuery<{ me?: User }>({ query: GET_ME });

      if(!existingUser?.me) {
        console.warn('GET_ME query not found in cache.');
        return;
      }

      // Update the cache with the new user data after removing the book
      cache.writeQuery({
        query: GET_ME,
        data: {
          me: {
            ...existingUser.me,
            savedBooks: data.removeBook.savedBooks,
          },
        },
      });
    },
  });

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId: string) => {
    try {
      await removeBook({
        variables: { bookId }
      });
      // upon success, remove book's id from localStorage
      removeBookId(bookId);

    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book: Book) => {
            console.log("book.bookId = ", book.bookId);
            return (
              <Col key={book.bookId} md='4'>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
