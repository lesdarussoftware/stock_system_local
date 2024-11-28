import { useEffect } from "react";

import { useUsers } from "../hooks/useUsers";

import { Layout } from "../components/common/Layout";
import { TableComponent } from "../components/common/TableComponent";
import { UserForm } from "../components/entities/UserForm";

export function Users() {

    const {
        users,
        setUsers,
        getUsers,
        columns,
        showForm,
        setShowForm,
        userFormData,
        handleSubmit,
        filter,
        setFilter,
        totalRows
    } = useUsers();
    const { setFormData } = userFormData;

    useEffect(() => {
        const { page, offset } = filter;
        getUsers(page, offset);
    }, [filter]);

    return (
        <Layout>
            {showForm === 'NEW' ?
                <>
                    <h2>Nuevo usuario</h2>
                    <UserForm
                        userFormData={userFormData}
                        setShowForm={setShowForm}
                        handleSubmit={handleSubmit}
                    />
                </> :
                <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2>Usuarios</h2>
                        <button className="btn btn-primary" onClick={() => setShowForm('NEW')}>
                            Nuevo
                        </button>
                    </div>
                    <TableComponent
                        columns={columns}
                        rows={users}
                        setRows={setUsers}
                        filter={filter}
                        setFilter={setFilter}
                        totalRows={totalRows}
                        setFormData={setFormData}
                        setShowForm={setShowForm}
                    />
                </>
            }
        </Layout>
    )
}