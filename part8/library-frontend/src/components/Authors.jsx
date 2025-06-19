import { useQuery, useMutation } from '@apollo/client';
import { ALL_AUTHORS } from '../queries';
import { EDIT_AUTHOR } from '../mutations';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Typography, Alert } from '@mui/material';

const Authors = ({ token }) => {  // Acepta token como prop
    const { loading, error, data } = useQuery(ALL_AUTHORS);
    const [name, setName] = useState('');
    const [born, setBorn] = useState('');

    const [editAuthor] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [{ query: ALL_AUTHORS }],
        onError: (error) => {
            console.error(error);
        },
    });

    if (loading) return <Typography>Cargando...</Typography>;
    if (error) return (
        <Alert severity="error">
            Error al cargar autores: {error.message.includes('not authenticated')
                ? 'Debes iniciar sesión para ver esta información'
                : error.message}
        </Alert>
    );

    const authors = data.allAuthors;

    const submit = (event) => {
        event.preventDefault();
        editAuthor({ variables: { name, setBornTo: parseInt(born) } });
        setName('');
        setBorn('');
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>Autores</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Año de nacimiento</TableCell>
                            <TableCell>Libros</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {authors.map((a) => (
                            <TableRow key={a.name}>
                                <TableCell>{a.name}</TableCell>
                                <TableCell>{a.born || 'Desconocido'}</TableCell>
                                <TableCell>{a.bookCount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {token && (  // Solo muestra el formulario si hay token
                <>
                    <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
                        Establecer año de nacimiento
                    </Typography>
                    <form onSubmit={submit}>
                        <TextField
                            select
                            label="Autor"
                            value={name}
                            onChange={({ target }) => setName(target.value)}
                            fullWidth
                            margin="normal"
                            SelectProps={{ native: true }}
                        >
                            <option value="">Seleccione un autor</option>
                            {authors.map((a) => (
                                <option key={a.name} value={a.name}>
                                    {a.name}
                                </option>
                            ))}
                        </TextField>
                        <TextField
                            label="Año de nacimiento"
                            type="number"
                            value={born}
                            onChange={({ target }) => setBorn(target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{ mt: 2 }}
                            disabled={!name || !born}
                        >
                            Actualizar autor
                        </Button>
                    </form>
                </>
            )}
        </div>
    );
};

export default Authors;