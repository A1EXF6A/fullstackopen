import { useQuery } from '@apollo/client';
import { ALL_BOOKS, ME } from '../queries';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Recommended = () => {
    const meResult = useQuery(ME);
    const booksResult = useQuery(ALL_BOOKS);

    if (meResult.loading || booksResult.loading) {
        return <div>loading...</div>;
    }

    const favoriteGenre = meResult.data.me.favoriteGenre;
    const books = booksResult.data.allBooks.filter((book) =>
        book.genres.includes(favoriteGenre)
    );

    return (
        <div>
            <h2>Recommendations</h2>
            <p>
                books in your favorite genre <strong>{favoriteGenre}</strong>
            </p>
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
                        {books.map((a) => (
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

export default Recommended;