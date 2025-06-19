import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ALL_BOOKS } from '../queries';
import { ADD_BOOK } from '../mutations';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box } from '@mui/material';

const NewBook = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [published, setPublished] = useState('');
    const [genre, setGenre] = useState('');
    const [genres, setGenres] = useState([]);
    const navigate = useNavigate();

    const [addBook] = useMutation(ADD_BOOK, {
        refetchQueries: [{ query: ALL_BOOKS }],
        onError: (error) => {
            console.error(error);
        },
    });

    const submit = async (event) => {
        event.preventDefault();

        addBook({
            variables: {
                title,
                author,
                published: parseInt(published),
                genres,
            },
        });

        setTitle('');
        setPublished('');
        setAuthor('');
        setGenres([]);
        setGenre('');
        navigate('/books');
    };

    const addGenre = () => {
        setGenres(genres.concat(genre));
        setGenre('');
    };

    return (
        <Box component="form" onSubmit={submit} sx={{ mt: 3 }}>
            <div>
                <TextField
                    label="title"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                    fullWidth
                    margin="normal"
                />
            </div>
            <div>
                <TextField
                    label="author"
                    value={author}
                    onChange={({ target }) => setAuthor(target.value)}
                    fullWidth
                    margin="normal"
                />
            </div>
            <div>
                <TextField
                    label="published"
                    type="number"
                    value={published}
                    onChange={({ target }) => setPublished(target.value)}
                    fullWidth
                    margin="normal"
                />
            </div>
            <div>
                <TextField
                    label="genre"
                    value={genre}
                    onChange={({ target }) => setGenre(target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button onClick={addGenre} variant="outlined" sx={{ mt: 1 }}>
                    add genre
                </Button>
            </div>
            <div>genres: {genres.join(' ')}</div>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                create book
            </Button>
        </Box>
    );
};

export default NewBook;