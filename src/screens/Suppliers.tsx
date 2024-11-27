import { useEffect } from "react";

import { useSuppliers } from "../hooks/useSuppliers";

import { Layout } from "../components/common/Layout";
import { TableComponent } from "../components/common/TableComponent";
import { SupplierForm } from "../components/entities/SupplierForm";

export function Suppliers() {

    const { suppliers, getSuppliers, columns, showForm, setShowForm, supplierFormData, handleSubmit } = useSuppliers();
    const { formData } = supplierFormData;

    useEffect(() => {
        getSuppliers();
    }, []);

    return (
        <Layout>
            {showForm ?
                <>
                    <h2>{showForm === 'NEW' ? 'Nuevo proveedor' : `Editar proveedor #${formData.id}`}</h2>
                    <SupplierForm
                        supplierFormData={supplierFormData}
                        showForm={showForm}
                        setShowForm={setShowForm}
                        handleSubmit={handleSubmit}
                    />
                </> :
                <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2>Proveedores</h2>
                        <button className="btn btn-primary btn-sm" onClick={() => setShowForm('NEW')}>
                            Nuevo
                        </button>
                    </div>
                    <TableComponent
                        columns={columns}
                        rows={suppliers}
                        actions
                    />
                </>
            }
        </Layout>
    )
}