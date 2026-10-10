

import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  async function handleRazorpayPayment() {
    if (!cartItems?.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }

    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsPaymentStart(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast({
        title: "Unable to load payment gateway. Check your internet.",
        variant: "destructive",
      });
      setIsPaymentStart(false);
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    const result = await dispatch(createNewOrder(orderData));
    const order = result?.payload;

    if (!order?.success) {
      toast({
        title: order?.message || "Unable to start payment. Please try again.",
        variant: "destructive",
      });
      setIsPaymentStart(false);
      return;
    }

    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency, // INR
      name: "Shopzy",
      description: "Order payment",
      order_id: order.razorpayOrderId,
      prefill: {
        name: user?.userName,
        email: user?.email,
        contact: currentSelectedAddress?.phone,
      },
      theme: { color: "#1F77FF" },
      handler: async function (response) {
        try {
          const verify = await axios.post(
            "/api/shop/order/capture",
            {
              orderId: order.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { withCredentials: true }
          );

          if (verify.data?.success) {
            sessionStorage.removeItem("currentOrderId");
            dispatch(fetchCartItems(user?.id));
            navigate("/shop/payment-success");
          } else {
            toast({
              title: verify.data?.message || "Payment verification failed",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title:
              error.response?.data?.message || "Payment verification failed",
            variant: "destructive",
          });
        } finally {
          setIsPaymentStart(false);
        }
      },
      modal: {
        // User payment popup ah close pannina button thirumba enable aagum
        ondismiss: () => setIsPaymentStart(false),
      },
    };

    const razorpayInstance = new window.Razorpay(options);

    razorpayInstance.on("payment.failed", (response) => {
      toast({
        title: response?.error?.description || "Payment failed",
        variant: "destructive",
      });
      setIsPaymentStart(false);
    });

    razorpayInstance.open();
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[180px] w-full overflow-hidden sm:h-[250px] lg:h-[300px]">
        <img
          src={img}
          alt="Checkout"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 p-4 sm:p-5 lg:grid-cols-2">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button
              onClick={handleRazorpayPayment}
              disabled={isPaymentStart}
              className="w-full"
            >
              {isPaymentStart ? "Processing Payment..." : "Pay with Razorpay"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
