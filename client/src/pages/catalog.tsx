import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import ProductCard from "@/components/product-card";
import { useToast } from "@/hooks/use-toast";

export default function Catalog() {
  const { toast } = useToast();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
    priceRange: "",
    colors: [] as string[],
    sizes: [] as string[],
  });

  const [sortBy, setSortBy] = useState("relevance");

  // Fetch products with filters
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products', filters],
    queryFn: () => {
      const apiFilters: any = {};
      if (filters.search) apiFilters.search = filters.search;
      if (filters.category) apiFilters.category = filters.category;
      if (filters.brand) apiFilters.brand = filters.brand;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (min) apiFilters.priceMin = min;
        if (max) apiFilters.priceMax = max;
      }
      return productsApi.getAll(apiFilters);
    }
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayFilterChange = (key: 'colors' | 'sizes', value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: checked 
        ? [...prev[key], value]
        : prev[key].filter(item => item !== value)
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      brand: "",
      priceRange: "",
      colors: [],
      sizes: [],
    });
  };

  const handleAddToCart = (product: any) => {
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleFavorite = (product: any) => {
    toast({
      title: "Added to Favorites",
      description: `${product.name} has been added to your favorites.`,
    });
  };

  const categories = ["Kurtas", "Dresses", "Bottoms", "Ethnic Wear", "Jewelry"];
  const brands = ["Fabindia", "W for Woman", "Biba", "Global Desi", "Tanishq"];
  const colors = [
    { name: "Red", value: "red", color: "bg-red-500" },
    { name: "Blue", value: "blue", color: "bg-blue-500" },
    { name: "Green", value: "green", color: "bg-green-500" },
    { name: "Yellow", value: "yellow", color: "bg-yellow-500" },
    { name: "Purple", value: "purple", color: "bg-purple-500" },
    { name: "Pink", value: "pink", color: "bg-pink-500" },
    { name: "Black", value: "black", color: "bg-gray-800" },
    { name: "White", value: "white", color: "bg-white border" },
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="h-fit">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4 lg:hidden">
                  <h3 className="font-semibold text-foreground">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-muted-foreground"
                    data-testid="button-close-filters"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Category</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={filters.category === category}
                            onCheckedChange={(checked) => 
                              handleFilterChange('category', checked ? category : '')
                            }
                            data-testid={`checkbox-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                          />
                          <Label htmlFor={category} className="text-sm cursor-pointer">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Filter */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Price Range</h4>
                    <RadioGroup 
                      value={filters.priceRange} 
                      onValueChange={(value) => handleFilterChange('priceRange', value)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="" id="price-all" />
                          <Label htmlFor="price-all" className="text-sm">All Prices</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0-1000" id="price-under-1000" />
                          <Label htmlFor="price-under-1000" className="text-sm">Under ₹1,000</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1000-3000" id="price-1000-3000" />
                          <Label htmlFor="price-1000-3000" className="text-sm">₹1,000 - ₹3,000</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="3000-5000" id="price-3000-5000" />
                          <Label htmlFor="price-3000-5000" className="text-sm">₹3,000 - ₹5,000</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="5000-999999" id="price-above-5000" />
                          <Label htmlFor="price-above-5000" className="text-sm">Above ₹5,000</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Color Filter */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Colors</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {colors.map((color) => (
                        <button
                          key={color.value}
                          className={`w-8 h-8 rounded-full ${color.color} border-2 ${
                            filters.colors.includes(color.value) ? 'border-primary' : 'border-transparent hover:border-primary'
                          }`}
                          onClick={() => handleArrayFilterChange('colors', color.value, !filters.colors.includes(color.value))}
                          data-testid={`button-color-${color.value}`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Size Filter */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Size</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          className={`p-2 text-sm border rounded-lg ${
                            filters.sizes.includes(size)
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-input hover:border-primary'
                          }`}
                          onClick={() => handleArrayFilterChange('sizes', size, !filters.sizes.includes(size))}
                          data-testid={`button-size-${size}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Brand Filter */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Brand</h4>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox
                            id={brand}
                            checked={filters.brand === brand}
                            onCheckedChange={(checked) => 
                              handleFilterChange('brand', checked ? brand : '')
                            }
                            data-testid={`checkbox-brand-${brand.toLowerCase().replace(/\s+/g, '-')}`}
                          />
                          <Label htmlFor={brand} className="text-sm cursor-pointer">
                            {brand}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="destructive" 
                  className="w-full mt-6" 
                  onClick={clearFilters}
                  data-testid="button-clear-filters"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Product Grid */}
          <div className="flex-1">
            {/* Search and Sort */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search for kurtas, dresses, ethnic wear..."
                  className="pl-12"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  data-testid="input-search"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="min-w-48" data-testid="select-sort">
                  <SelectValue placeholder="Sort by: Relevance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Sort by: Relevance</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="best-match">Best Match</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowMobileFilters(true)}
                data-testid="button-show-filters"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
            
            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    <div className="w-full h-64 bg-muted"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Products Grid */}
            {!isLoading && (
              <>
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        matchScore={Math.floor(Math.random() * 20) + 80} // Mock match score
                        onAddToCart={handleAddToCart}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12" data-testid="empty-state">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search or filter criteria
                    </p>
                    <Button onClick={clearFilters} data-testid="button-clear-search">
                      Clear Filters
                    </Button>
                  </div>
                )}
                
                {/* Pagination */}
                {products.length > 0 && (
                  <div className="flex items-center justify-center space-x-2 mt-12" data-testid="pagination">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button size="sm" className="bg-primary text-primary-foreground">
                      1
                    </Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
