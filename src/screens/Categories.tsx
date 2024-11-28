import { useEffect } from "react";

import { useCategories } from "../hooks/useCategories";

import { Layout } from "../components/common/Layout";
import { TableComponent } from "../components/common/TableComponent";
import { CategoryForm } from "../components/entities/CategoryForm";

export function Categories() {

    const {
        categories,
        setCategories,
        getCategories,
        columns,
        showForm,
        setShowForm,
        categoryFormData,
        handleSubmit,
        filter,
        setFilter,
        totalRows
    } = useCategories();
    const { formData, setFormData } = categoryFormData;

    useEffect(() => {
        const { page, offset } = filter;
        getCategories(page, offset);
    }, [filter]);

    return (
        <Layout>
            {showForm === 'NEW' || showForm === 'EDIT' ?
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
                        <button className="btn btn-primary" onClick={() => setShowForm('NEW')}>
                            Nueva
                        </button>
                    </div>
                    <TableComponent
                        columns={columns}
                        rows={categories}
                        setRows={setCategories}
                        filter={filter}
                        setFilter={setFilter}
                        totalRows={totalRows}
                        setFormData={setFormData}
                        setShowForm={setShowForm}
                        actions
                        showEditAction
                        showDeleteAction
                    />
                </>
            }
        </Layout>
    )
}