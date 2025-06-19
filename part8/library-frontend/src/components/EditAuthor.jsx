import { useQuery, useMutation } from '@apollo/client';

import { ALL_AUTHORS } from '../queries';
import { EDIT_AUTHOR } from '../mutations';
import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const EditAuthor = () => {
    const result = useQuery(ALL_AUTHORS);
    const [name, setName] = useState('');
    const [born, setBorn] = useState('');

    const [editAuthor] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [{ query: ALL_AUTHORS }],
        onError: (error) => {
            console.error(error);
        },
    });

    if (result.loading) {
        return <div>loading...</div>;
    }

    const authors = result.data.allAuthors;

    const submit = (event) => {
        event.preventDefault();
        editAuthor({ variables: { name, setBornTo: parseInt(born) } });
        setName('');
        setBorn('');
    };

    return (
        <Box component="form" onSubmit={submit} sx={{ mt: 3 }}>
            <h2>Edit Author</h2>
            <div>
                <TextField
                    select
                    label="name"
                    value={name}
                    onChange={({ target }) => setName(target.value)}
                    fullWidth
                    margin="normal"
                    SelectProps={{
                        native: true,
                    }}
                >
                    <option value="">Select author</option>
                    {authors.map((a) => (
                        <option key={a.name} value={a.name}>
                            {a.name}
                        </option>
                    ))}
                </TextField>
            </div>
            <div>
                <TextField
                    label="born"
                    type="number"
                    value={born}
                    onChange={({ target }) => setBorn(target.value)}
                    fullWidth
                    margin="normal"
                />
            </div>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                update author
            </Button>
        </Box>
    );
};

export default EditAuthor;