import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addToCart,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../features/cart/cartSlice";
import CheckoutButton from "../components/cart/ChackoutButton";

const Cart = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">
          Add some products to get started
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Cart ({totalItems} items)
      </h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border p-4 rounded-lg shadow-sm"
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />

              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-500">Ksh {item.price}</p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              {/* ➖ decrease */}
              <button
                onClick={() => dispatch(decreaseQuantity(item.id))}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                -
              </button>

              <span>{item.quantity}</span>

              {/* ➕ increase */}
              <button
                onClick={() =>
                  dispatch(
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                    })
                  )
                }
                className="px-3 py-1 bg-gray-200 rounded"
              >
                +
              </button>

              {/* ❌ remove completely */}
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>

            {/* Right */}
            <div className="font-semibold">
              Ksh {item.price * item.quantity}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 border-t pt-4 flex justify-between items-center">
        <h3 className="text-xl font-bold">Total: Ksh {total}</h3>

        <div className="flex gap-3">
          <button
            onClick={() => dispatch(clearCart())}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Clear Cart
          </button>

          
          <CheckoutButton
            disabled={items.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;