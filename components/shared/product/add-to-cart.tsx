"use client";
import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";
import { Loader, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { toast } from "sonner";

const AddToCart = ({
  cart,
  item,
}: {
  cart?: Cart;
  item: Omit<CartItem, "cartId">;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  const handleAddToCart = async () => {
    startTransition(async () => {
      // Execute the addItemToCart action
      const res = await addItemToCart(item);

      // Display appropriate toast message based on the result
      if (!res?.success) {
        toast.error(res?.message);
        return;
      }

      toast("", {
        description: `${item.name} added to the cart`,
        action: (
          <Button
            className="bg-primary text-white hover:bg-gray-800"
            onClick={() => router.push("/cart")}
          >
            Go to cart
          </Button>
        ),
      });
      return;
    });
  };

  // Remove item from cart
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      if (!res?.success) {
        toast.error(res?.message);
        return;
      }

      toast("", {
        description: res.message,
      });

      return;
    });
  };
  return existItem ? (
    <div>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={handleRemoveFromCart}
      >
        {isPending ? (
          <Loader className="w-4 h-4  animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={handleAddToCart}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      type="button"
      disabled={isPending}
      onClick={handleAddToCart}
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      Add to cart
    </Button>
  );
};

export default AddToCart;
