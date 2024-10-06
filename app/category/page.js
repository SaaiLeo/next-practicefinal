"use client";

import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { DataGrid } from "@mui/x-data-grid";

export default function Home() {
    const APIBASE = process.env.NEXT_PUBLIC_API_URL;

    const [categoryList, setCategoryList] = useState([]);
    const { register, handleSubmit, reset } = useForm();
    const [editMode, setEditMode] = useState(false);

    const columns = [
        {field: 'Action', headerName: "Action", width: 120, renderCell: (params) => {
            return (
                <div className="space-x-2">
                    <button onClick={() => startEditMode(params.row)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md">✏️</button>
                    <button onClick={() => deleteCategory(params.row)}
                        className="bg-gray-300 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-md">🗑️</button>
                </div>
            )
        }},
        {field: 'name', headerName: "Name", width: 150},
        {field: 'order', headerName: "Order", width: 150}
    ]

    async function fetchCategory() {
        const data = await fetch(`${APIBASE}/category`);
        const c = await data.json();
        const c2 = c.map((category) => {
            return {
                ...category,
                id: category._id
            }
        })
        setCategoryList(c2);
    }

    useEffect(() => {
        fetchCategory();
    }, []);

    function handleCategoryFormSubmit(data) {
        //Updating existing category
        if (editMode) {
            fetch(`${APIBASE}/category`, {
                method: "PUT",
                headers: {
                    "Content-Types": "application/json",
                },
                body: JSON.stringify(data),
            }).then(() => {
                fetchCategory()
                stopEditMode()
            })
        }

        //Create new category
        fetch(`${APIBASE}/category`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(() => {
            fetchCategory();
            stopEditMode();
        })
    }

    async function deleteCategory(category) {
        if (!confirm(`Deleteing [${category.name}]`)) return;

        const id = category._id
        await fetch(`${APIBASE}/category/${id}`, {
            method: "DELETE",
        })
        fetchCategory();
    }

    function startEditMode(category) {
        reset(category),
            setEditMode(true);
    }

    function stopEditMode() {
        reset({
            name: '',
            order: ''
        })
        setEditMode(false)
    }

    return (
        <div>
            <form onSubmit={handleSubmit(handleCategoryFormSubmit)}>
                <div className="grid grid-cols-2 gap-4 w-fit m-4 border border-gray-800 p-2">
                    <div className="font-semibold">Category name:</div>
                    <div>
                        <input
                            name="name"
                            type="text"
                            {...register("name", { required: true, valueAsNumber: false })}
                            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>

                    <div className="font-semibold">order:</div>
                    <div>
                        <input
                            name="order"
                            type="number"
                            {...register("order", { valueAsNumber: true })}
                            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>


                    <div className="col-span-2 text-right">
                        {editMode ?
                            <>
                                <button
                                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full"
                                    onClick={() => stopEditMode()}
                                >
                                    Cancle
                                </button>
                                <input
                                    type="submit"
                                    value="Update"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
                                />
                            </>
                            :

                            <input
                                type="submit"
                                value="Create"
                                className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                            />
                        }
                    </div>


                </div>
            </form>

            <div>
                <h1>Category</h1>
                <DataGrid 
                    rows={categoryList}
                    columns={columns}
                />
            </div>
            {/* <h1>Category</h1>
            {categoryList.map((category) => (
                <div key={category._id}>
                    <button onClick={() => deleteCategory(category)}>🗑️</button>
                    <button onClick={() => startEditMode(category)}>✏️</button>
                    {category.name} ➡️ {category.order}
                </div>
            ))} */}
        </div>
    )
}