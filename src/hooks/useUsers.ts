/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import { MessageContext } from "../contexts/MessageContext";
import { useForm } from "./useForm";

import { db, User } from "../utils/db";

export function useUsers() {

    const { setAuth } = useContext(AuthContext);
    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const navigate = useNavigate();

    const userFormData = useForm({
        defaultData: {
            id: '',
            username: '',
            password: ''
        },
        rules: {
            username: { required: true, maxLength: 55 },
            password: { required: true, minLength: 8, maxLength: 55 }
        }
    });

    const [users, setUsers] = useState<User[]>([]);
    const [showForm, setShowForm] = useState<'NEW' | 'VIEW' | 'EDIT' | 'DELETE' | null>(null);
    const [filter, setFilter] = useState<{ page: number; offset: number; }>({ page: 1, offset: 50 });
    const [totalRows, setTotalRows] = useState<number>(0);

    async function login() {
        const { formData, validate } = userFormData;
        if (validate()) {
            try {
                const user = await db.users.where("username").equals(formData.username).first();
                if (!user || user.password !== formData.password) {
                    setSeverity('ERROR');
                    setHeaderMessage(formData.username);
                    setBodyMessage('Credenciales inválidas.');
                    setOpenMessage(true);
                } else {
                    setAuth({ id: user.id, username: user.username });
                    navigate('/products');
                }
            } catch (error) {
                setSeverity('ERROR');
                setHeaderMessage(formData.username);
                setBodyMessage('Ocurrió un error.');
                setOpenMessage(true);
            }
        }
    }

    function logout() {
        navigate('/');
        setAuth(null);
    }

    async function getUsers(page: number = 1, offset: number = 50) {
        const start = (page - 1) * offset;
        const [data, count] = await Promise.all([
            db.users.orderBy('id').reverse().offset(start).limit(offset).toArray(),
            db.users.count()
        ]);
        setTotalRows(count);
        setUsers(data);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        const { formData, validate, reset } = userFormData;
        if (validate()) {
            try {
                await db.users.add({ ...formData, id: undefined });
                setSeverity('SUCCESS');
                setBodyMessage('Usuario guardado correctamente.');
                setShowForm(null);
                getUsers();
                reset();
            } catch (e) {
                setSeverity('ERROR');
                setBodyMessage('Hubo un error al intentar guardar el usuario.');
            }
            setHeaderMessage(formData.username);
            setOpenMessage(true);
        }
    }

    function handleClose() {
        userFormData.reset();
        setShowForm(null);
    }

    const columns = useMemo(() => [
        {
            id: 'id',
            label: '#',
            sortable: true,
            accessor: 'id'
        },
        {
            id: 'username',
            label: 'Nombre usuario',
            sortable: true,
            accessor: 'username'
        }
    ], [])

    return {
        userFormData,
        login,
        logout,
        users,
        setUsers,
        getUsers,
        columns,
        showForm,
        setShowForm,
        handleSubmit,
        filter,
        setFilter,
        totalRows,
        handleClose
    };
}
