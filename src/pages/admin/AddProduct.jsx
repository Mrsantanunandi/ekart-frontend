import React, { useState } from "react";
import axios from "../../axiosWithJwt";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ImageUpload";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState({
    productName: "",
    productDesc: "",
    productPrice: "",
    brand: "",
    category: "",
    quantity: 1,
    images: [],
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async () => {
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    if (
      !productData.productName ||
      !productData.productDesc ||
      !productData.productPrice ||
      !productData.brand ||
      !productData.category
    ) {
      toast.error("All fields are required");
      return;
    }

    if (productData.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      const { images, ...productWithoutImages } = productData;

      // Convert numeric values
      const productPayload = {
        ...productWithoutImages,
        productPrice: Number(productWithoutImages.productPrice),
        quantity: Number(productWithoutImages.quantity),
      };

      // Append JSON data
      formData.append(
        "data",
        new Blob([JSON.stringify(productPayload)], {
          type: "application/json",
        })
      );

      // Append images
      images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/product/addProduct`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || "Product added successfully");

      // Reset form
      setProductData({
        productName: "",
        productDesc: "",
        productPrice: "",
        brand: "",
        category: "",
        quantity: 1,
        images: [],
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex justify-center items-start  min-h-screen py-6 mt-3 px-3">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader className='px-5 py-0'>
          <CardTitle>Add Product : For ADMIN ONLY</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Product Name</Label>
            <Input
              name="productName"
              placeholder="Enter Product Name"
              value={productData.productName}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4"
          >
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                placeholder="Enter Product Price"
                name="productPrice"
                value={productData.productPrice}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                min={1}
                name="quantity"
                value={productData.quantity}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Brand</Label>
              <Input
                name="brand"
                placeholder="Enter Product Brand"
                value={productData.brand}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Category</Label>
              <Input
                name="category"
                placeholder="Enter Product Category"
                value={productData.category}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              name="productDesc"
              placeholder="Enter Product Description"
              value={productData.productDesc}
              onChange={handleChange}
            />
          </div>
          {/* IMAGE UPLOAD */}
          <ImageUpload
            productData={productData}
            setProductData={setProductData}
          />
        </CardContent>

        <CardFooter>
          <Button
            onClick={submitHandler}
            disabled={loading}
            className="w-full bg-pink-600 flex gap-2"
          >
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Please wait..." : "Add Product"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddProduct;
