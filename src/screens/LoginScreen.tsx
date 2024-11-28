import { useUsers } from "../hooks/useUsers";

import { UserForm } from "../components/entities/UserForm";

export function LoginScreen() {

    const { setShowForm, userFormData, login } = useUsers();

    return (
        <div className="d-flex flex-column vh-100 justify-content-center container align-items-center">
            <h2>Inicie sesión para usar el sistema</h2>
            <UserForm
                userFormData={userFormData}
                setShowForm={setShowForm}
                handleSubmit={login}
                forAuth
            />
        </div>
    )
}