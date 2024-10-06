import Product from "@/models/Product";

export async function GET() {
    const product = await Product.find().sort({name: 1})
    return Response.json(product)
}

export async function POST(request) {
    const body = await request.json()
    const product = new Product(body)
    await product.save()
    return Response.json(product)
}

export async function PUT(request) {
    const body = await request.json()
    const product = await Product.findByIdAndUpdate(body._id,body)
    return Response.json(product)
}