import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import EditAuthor from './components/EditAuthor';
import LoginForm from './components/LoginForm';
import Recommended from './components/Recommended';

// Componente para rutas protegidas
const ProtectedRoute = ({ children, token }) => {
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('library-user-token'));
    const navigate = useNavigate();

    const logout = () => {
        setToken(null);
        localStorage.clear();
        navigate('/login');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Biblioteca GraphQL
                    </Typography>

                    <Button color="inherit" onClick={() => navigate('/authors')}>
                        Autores
                    </Button>

                    <Button color="inherit" onClick={() => navigate('/books')}>
                        Libros
                    </Button>

                    {token ? (
                        <>
                            <Button color="inherit" onClick={() => navigate('/add')}>
                                Agregar Libro
                            </Button>

                            <Button color="inherit" onClick={() => navigate('/recommended')}>
                                Recomendados
                            </Button>

                            <Button color="inherit" onClick={logout}>
                                Cerrar Sesión
                            </Button>
                        </>
                    ) : (
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <Container sx={{ marginTop: 4 }}>
                <Routes>
                    <Route path="/" element={<Navigate replace to="/books" />} />
                    <Route path="/authors" element={<Authors />} />
                    <Route path="/books" element={<Books />} />

                    <Route
                        path="/add"
                        element={
                            <ProtectedRoute token={token}>
                                <NewBook />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/edit"
                        element={
                            <ProtectedRoute token={token}>
                                <EditAuthor />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/recommended"
                        element={
                            <ProtectedRoute token={token}>
                                <Recommended />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/login"
                        element={<LoginForm setToken={setToken} />}
                    />
                </Routes>
            </Container>
        </>
    );
};

export default App;