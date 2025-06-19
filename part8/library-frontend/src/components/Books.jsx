import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';

const Books = () => {
    const [genre, setGenre] = useState('');
    const result = useQuery(ALL_BOOKS);

    if (result.loading) {
        return <div>loading...</div>;
    }

    const books = result.data.allBooks;
    const genres = [...new Set(books.flatMap((book) => book.genres))];

    const filteredBooks = genre
        ? books.filter((book) => book.genres.includes(genre))
        : books;

    return (
        <div>
            <h2>Books</h2>
            <div>
                <TextField
                    select
                    label="filter by genre"
                    value={genre}
                    onChange={({ target }) => setGenre(target.value)}
                    SelectProps={{
                        native: true,
                    }}
                >
                    <option value="">all genres</option>
                    {genres.map((g) => (
                        <option key={g} value={g}>
                            {g}
                        </option>
                    ))}
                </TextField>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Published</TableCell>
                            <TableCell>Genres</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredBooks.map((a) => (
                            <TableRow key={a.title}>
                                <TableCell>{a.title}</TableCell>
                                <TableCell>{a.author.name}</TableCell>
                                <TableCell>{a.published}</TableCell>
                                <TableCell>{a.genres.join(', ')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Books;