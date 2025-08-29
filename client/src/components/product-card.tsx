import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  matchScore?: number;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
}

export default function ProductCard({
  product,
  matchScore,
  onAddToCart,
  onToggleFavorite
}: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    onToggleFavorite?.(product);
  };

  const formatPrice = (priceCents: number) => {
    return `₹${(priceCents / 100).toLocaleString('en-IN')}`;
  };

  const getMatchScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-500';
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-blue-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-purple-500';
  };

  return (
    <div 
      className="bg-card rounded-2xl shadow-lg overflow-hidden product-card cursor-pointer group"
      data-testid={`product-card-${product.id}`}
    >
      <div className="relative">
        <img
          src={product.images?.[0] || "/placeholder-image.jpg"}
          alt={product.name}
          className="w-full h-64 object-cover"
          data-testid={`product-image-${product.id}`}
        />
        
        {/* Match Score Badge */}
        {matchScore && (
          <div className="absolute top-3 left-3">
            <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
              <div className={`w-2 h-2 rounded-full ${getMatchScoreColor(matchScore)}`}></div>
              <span className="font-medium text-foreground">{matchScore}% match</span>
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white transition-colors"
          data-testid={`button-favorite-${product.id}`}
        >
          <Heart 
            className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
          />
        </button>

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 
            className="font-medium text-foreground line-clamp-2 flex-1 mr-2"
            data-testid={`product-name-${product.id}`}
          >
            {product.name}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground mb-2" data-testid={`product-brand-${product.id}`}>
          {product.brand}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span 
              className="text-lg font-semibold text-primary"
              data-testid={`product-price-${product.id}`}
            >
              {formatPrice(product.priceCents)}
            </span>
          </div>
        </div>

        {/* Rating Stars (mock data) */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-3 h-3 fill-current" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-2">(124 reviews)</span>
        </div>

        {/* Available Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {product.sizes.slice(0, 4).map((size) => (
                <Badge
                  key={size}
                  variant="outline"
                  className="text-xs"
                  data-testid={`size-badge-${size}`}
                >
                  {size}
                </Badge>
              ))}
              {product.sizes.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{product.sizes.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          className="w-full"
          disabled={!product.inStock}
          onClick={() => onAddToCart?.(product)}
          data-testid={`button-add-to-cart-${product.id}`}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
}
