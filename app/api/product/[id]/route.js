import Product from "@/models/Product";

export async function GET(request, {params}) {
    const id = params.id;
    const product = await Product.findById(id);
    return Response.json(product);
}

export async function DELETE(request, {params}) {
    const id = params.id;
    const product = await Product.findByIdAndDelete(id);
    return Response.json(product);
}