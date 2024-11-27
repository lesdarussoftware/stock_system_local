import { useEffect } from "react";

import { useCategories } from "../hooks/useCategories";

import { Layout } from "../components/common/Layout";
import { TableComponent } from "../components/common/TableComponent";
import { CategoryForm } from "../components/entities/CategoryForm";

export function Categories() {

    const { categories, getCategories, columns, showForm, setShowForm, categoryFormData, handleSubmit } = useCategories();
    const { formData } = categoryFormData;

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <Layout>
            {showForm ?
                <>
                    <h2>{showForm === 'NEW' ? 'Nueva categoría' : `Editar categoría #${formData.id}`}</h2>
                    <CategoryForm
                        categoryFormData={categoryFormData}
                        showForm={showForm}
                        setShowForm={setShowForm}
                        handleSubmit={handleSubmit}
                    />
                </> :
                <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2>Categorías</h2>
                        <button className="btn btn-primary btn-sm" onClick={() => setShowForm('NEW')}>
                            Nuevo
                        </button>
                    </div>
                    <TableComponent
                        columns={columns}
                        rows={categories}
                        actions
                    />
                </>
            }
        </Layout>
    )
}