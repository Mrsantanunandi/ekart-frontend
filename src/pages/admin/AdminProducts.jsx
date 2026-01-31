import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../axiosWithJwt";
import { setProduct } from "@/redux/productSlice";
import { Input } from "@/components/ui/input";
import { Edit, Search, Trash2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ImageUpload";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);
  const token = localStorage.getItem("token");

  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (products.length > 0) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/product/allProducts`
        );
        dispatch(setProduct(res.data.data || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [dispatch, products.length]);

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSave = async (e) => {
    e.preventDefault();
    if (!editProduct) return;

    try {
      const formData = new FormData();

      const {
        images,
        productImg,
        createdAt,
        updatedAt,
        ...productPayload
      } = editProduct;

      formData.append("data", JSON.stringify(productPayload));

      images?.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img);
        }
      });

      const res = await axios.put(
        `${import.meta.env.VITE_URL}/product/updateProduct/${editProduct.id}`,
        formData
      );

      if (res.data.success) {
        toast.success(res.data.message);

        dispatch(
          setProduct(
            products.map((p) =>
              p.id === editProduct.id ? res.data.data : p
            )
          )
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    }
  };















  //Delete Product
  const deleteProductHandler = async (productId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_URL}/product/removeProduct/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        dispatch(
          setProduct(products.filter((product) => product.id !== productId))
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };


  /* ================= FILTER + SORT ================= */
  const filteredProducts = products
    .filter((p) =>
      p.productName?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "lowToHigh") return a.productPrice - b.productPrice;
      if (sort === "highToLow") return b.productPrice - a.productPrice;
      return 0;
    });

  /* ================= UI ================= */
  return (
    <div className="pl-14.5 py-20 pr-20 min-h-screen bg-gray-100 w-full">
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative bg-white rounded-lg">
          <Input
            placeholder="Search Product..."
            className="w-[400px] pr-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute right-3 top-2.5 text-gray-500" />
        </div>

        <Select onValueChange={setSort}>
          <SelectTrigger className="w-[200px] bg-white cursor-pointer">
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
            <SelectItem value="highToLow">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && <p>Loading products...</p>}

      {!loading && filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No products found 😢
        </p>
      )}

      <div className="flex flex-col gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={product.productImg?.[0]?.url}
                  alt={product.productName}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <h1 className="font-semibold w-96 text-gray-700">
                  {product.productName}
                </h1>
              </div>

              <h1 className="font-semibold text-gray-800">
                {product.productPrice}
              </h1>

              <div className="flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Edit
                      onClick={() =>
                        setEditProduct({
                          ...product,
                          images: product.productImg || [], // ✅ FIX
                        })
                      }
                      className="text-green-500 cursor-pointer"
                    />
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[625px] max-h-[740px] overflow-y-scroll">
                    <DialogHeader>
                      <DialogTitle>Edit Product</DialogTitle>
                      <DialogDescription>
                        Make changes for product here. Click save when you're
                        done.
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="flex flex-col gap-2">
                      <div className="grid gap-2">
                        <Label>Product Name</Label>
                        <Input
                          name="productName"
                          value={editProduct?.productName || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Price</Label>
                        <Input
                          name="productPrice"
                          type="number"
                          value={editProduct?.productPrice || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Brand</Label>
                          <Input
                            name="brand"
                            value={editProduct?.brand || ""}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Category</Label>
                          <Input
                            name="category"
                            value={editProduct?.category || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label>Description</Label>
                        <Textarea
                          name="productDesc"
                          value={editProduct?.productDesc || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <ImageUpload
                        productData={editProduct}
                        setProductData={setEditProduct}
                      />

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>


                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Trash2 className="text-red-600 cursor-pointer" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the product and all it's data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => { deleteProductHandler(product.id) }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
