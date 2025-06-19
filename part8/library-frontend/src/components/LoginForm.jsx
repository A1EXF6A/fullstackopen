import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../mutations';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box } from '@mui/material';

const LoginForm = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [login] = useMutation(LOGIN, {
        onError: (error) => {
            console.error(error);
        },
        onCompleted: (data) => {
            const token = data.login.value;
            setToken(token);
            localStorage.setItem('library-user-token', token);
            navigate('/');
        },
    });

    const submit = (event) => {
        event.preventDefault();
        login({ variables: { username, password } });
    };

    return (
        <Box component="form" onSubmit={submit} sx={{ mt: 3 }}>
            <div>
                <TextField
                    label="username"
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                    fullWidth
                    margin="normal"
                />
            </div>
            <div>
                <TextField
                    label="password"
                    type="password"
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    fullWidth
                    margin="normal"
                />
            </div>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                login
            </Button>
        </Box>
    );
};

export default LoginForm;