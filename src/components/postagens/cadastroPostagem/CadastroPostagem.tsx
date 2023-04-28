import React, { useState, useEffect, ChangeEvent } from 'react'
import { Button, Container, Typography, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Tema from '../../../models/Tema';
import Postagem from '../../../models/Postagem';
import { busca, buscaId, put, post } from '../../../service/Service';
import './CadastroPostagem.css'
import { TokenState } from '../../../store/tokens/TokensReducer';
import { toast } from 'react-toastify';

function CadastroPostagem() {

    const history = useNavigate();

    const token = useSelector<TokenState, TokenState["token"]>(
         (state) => state.token
    )

    const { id } = useParams<{ id: string }>();

    const [temas, setTemas] = useState<Tema[]>([]);

    const [postagem, setPostagem] = useState<Postagem>({
        id: 0,
        titulo: '',
        texto: '',
        data: '',
        imagem: '',
        tema: null
    });

    const [tema, setTema] = useState<Tema>({
        id: 0,
        categoria: '',
        nome: ''
    });

    useEffect(() => {
        if (token === '') {
            toast.error('Você precisa estar logado!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: 'colored',
                progress: undefined
            })
            history('/login');
        }
    }, [token]);

    function updatePost(event: ChangeEvent<HTMLInputElement>) {
        setPostagem({
            ...postagem,
            [event.target.name]: event.target.value,
            tema: tema,
        });
    }

    async function getAllTemas() {
        await busca('/temas', setTemas, {
            headers: {
                Authorization: token,
            },
        });
    }

    async function findByIdPostagem(id: string) {
        await buscaId(`postagens/${id}`, setPostagem, {
            headers: {
                Authorization: token,
            },
        });
    }

    useEffect(() => {
        getAllTemas();
        if (id !== undefined) {
            findByIdPostagem(id);
        }
    }, [id]);

    useEffect(() => {
        setPostagem({
            ...postagem,
            tema: tema,
        });
    }, [tema]);

    async function onSubmit(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        
        if (id !== undefined) {
            try {
                await put('/postagens', postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                });
                toast.success('Postagem atualizada com sucesso!', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    theme: 'colored',
                    progress: undefined
                })
                history('/postagens')
            } catch (error) {
                toast.error('Falha ao atualizar postagem!', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    theme: 'colored',
                    progress: undefined
                })
            }
        } else {
            try {
                await post('/postagens', postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                });
                toast.success('Postagem cadastrada com sucesso!', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    theme: 'colored',
                    progress: undefined
                })
                history('/postagens')
            } catch (error) {
                toast.error('Falha ao cadastrar postagem!', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    theme: 'colored',
                    progress: undefined
                })
            }
        }
    }

    return (
        <>
            <Container maxWidth={'sm'}>
                <form className='cadastroPost' onSubmit={onSubmit}>
                    <Typography marginTop={4} variant="h3" align="center">
                        Cadastrar postagem
                    </Typography>
                    <TextField
                        value={postagem.titulo}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updatePost(event)
                        }
                        label="Titulo"
                        name="titulo"
                        id="titulo"
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        value={postagem.texto}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updatePost(event)
                        }
                        label="texto"
                        name="texto"
                        id="texto"
                        variant="outlined"
                        fullWidth
                        multiline
                        minRows={4}
                    />
                    <TextField
                        value={postagem.imagem}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updatePost(event)
                        }
                        label="URL da Imagem"
                        name="imagem"
                        id="imagem"
                        variant="outlined"
                        fullWidth
                        required
                        minRows={4}
                    />

                    <FormControl>
                        <InputLabel>Tema</InputLabel>
                        <Select
                            variant="standard"
                            onChange={(event) =>
                                buscaId(`/temas/${event.target.value}`, setTema, {
                                    headers: { Authorization: token },
                                })
                            }
                        >
                            {temas.map((tema) => (
                                <MenuItem value={tema.id}>{tema.categoria}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>Escolha um tema para a sua postagem</FormHelperText>
                    </FormControl>
                    <Button variant="contained" color="primary" type='submit' disabled={tema.id === 0}>
                        {tema.id === 0 ? 'selecione um tema' : 'cadastrar'}
                    </Button>
                </form>
            </Container>
        </>
    );
}

export default CadastroPostagem