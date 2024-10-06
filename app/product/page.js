"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DataGrid } from '@mui/x-data-grid';

export default function Home() {

    const APIBASE = process.env.NEXT_PUBLIC_API_URL;

    const [productList, setProductList] = useState([]);
    const { register, handleSubmit, reset } = useForm();
    const [categoryList, setCategoryList] = useState([]);
    const [editMode, setEditMode] = useState(false);

    const columns = [
        {field: 'Acttion', headerName: 'Action', width: 150, 
            renderCell: (params) => {
                return(
                    <div className='space-x-2'>
                        <buttton onClick={() => startEditMode(params.row)} className="bg-blue-500 hover:bg-blue-700 py-1 px-3 rounded-md">✏️</buttton>
                        <button onClick={() => deleteProduct(params.row)} className="bg-gray-300 hover:bg-gray-700 py-1 px-3 rounded-md">🗑️</button>
                    </div>
                )
            }
        },
        {field: 'code', headerName: 'Code', width: 150},
        {field: 'name', headerName: 'Name', width: 300}
    ]

    async function fetchProduct() {
        const data = await fetch(`${APIBASE}/product`);
        const c = await data.json();
        const c2 = c.map((product) => {
            return {
                ...product,
                id: product._id
            }
        })
        setProductList(c2)
    }

    async function fetchCategory() {
        const data = await fetch(`${APIBASE}/category`)
        const c = await data.json();
        setCategoryList(c);
    }

    useEffect(() => {
        fetchProduct();
        fetchCategory();
    }, []);

    function handleProductFormSubmit(data) {

        if (editMode) {
            // updating existing product
            fetch(`${APIBASE}/product`, {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(data)
            }).then(() => {
                fetchProduct()
                stopEditMode()
            })
        }

        //create new product
        fetch(`${APIBASE}/product`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        }).then(() => {
            fetchProduct();
            stopEditMode();
        })
    }

    async function deleteProduct(product) {

        if (!confirm(`Deleting [${product.name}]`)) return

        const id = product._id
        await fetch(`${APIBASE}/product/${id}`, {
            method: "DELETE",
        })
        fetchProduct();
    }

    function startEditMode(product) {
        reset(product)
        setEditMode(true)
    }

    function stopEditMode() {
        reset({
            code: '',
            name: '',
            description: '',
            price: '',
            category: ''
        })
        setEditMode(false)
    }

    return (
        <main>
            <form onSubmit={handleSubmit(handleProductFormSubmit)}>
                <div className='grid grid-cols-2 gap-4 w-1/2 m-4 border border-gray-800 p-2'>
                    <div>Code:</div>
                    <div>
                        <input
                            name='code'
                            type='text'
                            {...register('code', { required: true })}
                            className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                        />
                    </div>

                    <div>Name:</div>
                    <div>
                        <input 
                            name='name'
                            type='text'
                            {...register("name", {required: true})}
                            className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                        />
                    </div>

                    <div>Description:</div>
                    <div>
                        <input 
                            name='description'
                            tyep='text'
                            {...register('description')}
                            className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                        />
                    </div>

                    <div>Price</div>
                    <div>
                        <input 
                            name='price'
                            type='number'
                            {...register('price',{valueAsNumber: true})}
                            className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                        />
                    </div>

                    <div>Category</div>
                    <div>
                        <select 
                            name='category'
                            {...register('category')}
                            className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                        >
                        <option value="">Select a category</option>
                        {categoryList.map((category) => (
                            <option key={category._id} value={category.name}>{category.name}</option>
                        ))}
                        </select>
                    </div>

                    <div className='col-span-2 text-right'>
                        {editMode ? 
                        <>
                        <button onClick={() => stopEditMode()} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">Cancel</button>
                        <input 
                            type='submit'
                            value='Update'
                            className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                        />
                        </>
                        :
                        <input 
                            type='submit'
                            value='Create'
                            className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                        />
                    }
                    </div>
                </div>
            </form>

            <DataGrid 
                rows={productList}
                columns={columns}
            />

            {/* <h1>Product</h1>
            {productList.map((product) => (
                <div key={product._id}>
                    <button onClick={() => deleteProduct(product)}>🗑️</button>
                    <button onClick={() => startEditMode(product)}>✏️</button>
                    {product.code} {product.name}
                </div>
            ))} */}
        </main>
    )
}