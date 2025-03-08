export const getSavedBookIds = () => {
  //console.log('GETTING SAVED BOOK IDS FROM LOCALSTORAGE');
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books')!)
    : [];

  return savedBookIds;
};

export const saveBookIds = (bookIdArr: string[]) => {
  //console.log('SAVING BOOK ID IN LOCALSTORAGE');
  if (bookIdArr.length) {
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem('saved_books');
  }
};

export const removeBookId = (bookId: string) => {
  //console.log('REMOVING BOOK ID FROM LOCALSTORAGE');
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books')!)
    : null;

  if (!savedBookIds) {
    return false;
  }

  const updatedSavedBookIds = savedBookIds?.filter((savedBookId: string) => savedBookId !== bookId);
  //console.log('UPDATING SAVED BOOK IDS IN LOCALSTORAGE');
  localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));

  return true;
};
