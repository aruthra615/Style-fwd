import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload, Search, RefreshCw, Edit, Trash2, Package, Users, Bot, TrendingUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi, adminApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [newProduct, setNewProduct] = useState({
    sku: "",
    name: "",
    brand: "",
    category: "",
    subcategory: "",
    sizes: "",
    fitNotes: "",
    fabric: "",
    colorHex: "",
    priceCents: 0,
    inStock: true,
    images: ""
  });

  // Fetch admin stats
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: adminApi.getStats
  });

  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products', searchTerm],
    queryFn: () => productsApi.getAll(searchTerm ? { search: searchTerm } : {})
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setShowAddProductDialog(false);
      resetForm();
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    }
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setEditingProduct(null);
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setNewProduct({
      sku: "",
      name: "",
      brand: "",
      category: "",
      subcategory: "",
      sizes: "",
      fitNotes: "",
      fabric: "",
      colorHex: "",
      priceCents: 0,
      inStock: true,
      images: ""
    });
  };

  const handleCreateProduct = () => {
    const productData = {
      ...newProduct,
      sizes: newProduct.sizes.split(',').map(s => s.trim()).filter(Boolean),
      images: newProduct.images.split(',').map(s => s.trim()).filter(Boolean),
      priceCents: Math.round(newProduct.priceCents * 100)
    };
    createProductMutation.mutate(productData);
  };

  const handleUpdateProduct = (product: any) => {
    const productData = {
      ...product,
      priceCents: Math.round(product.priceCents)
    };
    updateProductMutation.mutate({ id: product.id, data: productData });
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const formatPrice = (priceCents: number) => {
    return `₹${(priceCents / 100).toLocaleString('en-IN')}`;
  };

  const getStockBadge = (inStock: boolean) => {
    return (
      <Badge variant={inStock ? "default" : "destructive"}>
        {inStock ? "In Stock" : "Out of Stock"}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">Admin Dashboard</h2>
              <div className="flex items-center space-x-4">
                <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-product">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div>
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                          id="sku"
                          value={newProduct.sku}
                          onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                          data-testid="input-sku"
                        />
                      </div>
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          data-testid="input-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          value={newProduct.brand}
                          onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                          data-testid="input-brand"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Kurtas">Kurtas</SelectItem>
                            <SelectItem value="Dresses">Dresses</SelectItem>
                            <SelectItem value="Bottoms">Bottoms</SelectItem>
                            <SelectItem value="Ethnic Wear">Ethnic Wear</SelectItem>
                            <SelectItem value="Jewelry">Jewelry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProduct.priceCents}
                          onChange={(e) => setNewProduct({...newProduct, priceCents: Number(e.target.value)})}
                          data-testid="input-price"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sizes">Sizes (comma separated)</Label>
                        <Input
                          id="sizes"
                          value={newProduct.sizes}
                          onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})}
                          placeholder="XS, S, M, L, XL"
                          data-testid="input-sizes"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="fitNotes">Fit Notes</Label>
                        <Textarea
                          id="fitNotes"
                          value={newProduct.fitNotes}
                          onChange={(e) => setNewProduct({...newProduct, fitNotes: e.target.value})}
                          data-testid="textarea-fit-notes"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fabric">Fabric</Label>
                        <Input
                          id="fabric"
                          value={newProduct.fabric}
                          onChange={(e) => setNewProduct({...newProduct, fabric: e.target.value})}
                          data-testid="input-fabric"
                        />
                      </div>
                      <div>
                        <Label htmlFor="colorHex">Color (Hex)</Label>
                        <Input
                          id="colorHex"
                          value={newProduct.colorHex}
                          onChange={(e) => setNewProduct({...newProduct, colorHex: e.target.value})}
                          placeholder="#000000"
                          data-testid="input-color-hex"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="images">Image URLs (comma separated)</Label>
                        <Textarea
                          id="images"
                          value={newProduct.images}
                          onChange={(e) => setNewProduct({...newProduct, images: e.target.value})}
                          data-testid="textarea-images"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowAddProductDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreateProduct}
                        disabled={createProductMutation.isPending}
                        data-testid="button-save-product"
                      >
                        {createProductMutation.isPending ? "Creating..." : "Create Product"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" data-testid="button-import-csv">
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Button>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Products</p>
                      <p className="text-2xl font-bold" data-testid="stat-total-products">
                        {stats?.totalProducts || 0}
                      </p>
                    </div>
                    <Package className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">In Stock</p>
                      <p className="text-2xl font-bold" data-testid="stat-in-stock">
                        {stats?.inStock || 0}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Out of Stock</p>
                      <p className="text-2xl font-bold" data-testid="stat-out-of-stock">
                        {stats?.outOfStock || 0}
                      </p>
                    </div>
                    <Bot className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Categories</p>
                      <p className="text-2xl font-bold" data-testid="stat-categories">
                        {stats?.categories || 0}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Product Management */}
            <Card className="border border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Product Management
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        data-testid="input-search-products"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    </div>
                    <Button variant="outline" data-testid="button-refresh">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading products...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-left">Product</TableHead>
                          <TableHead className="text-left">Brand</TableHead>
                          <TableHead className="text-left">Category</TableHead>
                          <TableHead className="text-left">Price</TableHead>
                          <TableHead className="text-left">Stock</TableHead>
                          <TableHead className="text-left">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id} className="hover:bg-muted/30">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <img
                                  src={product.images?.[0] || "/placeholder-image.jpg"}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                  data-testid={`product-image-${product.id}`}
                                />
                                <div>
                                  <p className="font-medium text-foreground" data-testid={`product-name-${product.id}`}>
                                    {product.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-foreground">{product.brand}</TableCell>
                            <TableCell className="text-foreground">{product.category}</TableCell>
                            <TableCell className="text-foreground" data-testid={`product-price-${product.id}`}>
                              {formatPrice(product.priceCents)}
                            </TableCell>
                            <TableCell>
                              {getStockBadge(product.inStock)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingProduct(product)}
                                  data-testid={`button-edit-${product.id}`}
                                >
                                  <Edit className="w-4 h-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteProduct(product.id)}
                                  data-testid={`button-delete-${product.id}`}
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {products.length === 0 && (
                      <div className="text-center py-8" data-testid="empty-products">
                        <p className="text-muted-foreground">No products found</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Edit Product Dialog */}
            <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                {editingProduct && (
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                      <Label htmlFor="edit-name">Product Name</Label>
                      <Input
                        id="edit-name"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                        data-testid="input-edit-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-brand">Brand</Label>
                      <Input
                        id="edit-brand"
                        value={editingProduct.brand}
                        onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
                        data-testid="input-edit-brand"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-price">Price (cents)</Label>
                      <Input
                        id="edit-price"
                        type="number"
                        value={editingProduct.priceCents}
                        onChange={(e) => setEditingProduct({...editingProduct, priceCents: Number(e.target.value)})}
                        data-testid="input-edit-price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-stock">In Stock</Label>
                      <Select 
                        value={editingProduct.inStock ? "true" : "false"} 
                        onValueChange={(value) => setEditingProduct({...editingProduct, inStock: value === "true"})}
                      >
                        <SelectTrigger data-testid="select-edit-stock">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">In Stock</SelectItem>
                          <SelectItem value="false">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingProduct(null)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleUpdateProduct(editingProduct)}
                    disabled={updateProductMutation.isPending}
                    data-testid="button-save-edit"
                  >
                    {updateProductMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
