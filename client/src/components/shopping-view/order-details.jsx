

import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

const statusClass = (status) =>
  status === "confirmed"
    ? "bg-green-500"
    : status === "rejected"
    ? "bg-red-600"
    : "bg-black";

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="font-medium text-sm sm:text-base shrink-0">{label}</p>
      <div className="text-sm sm:text-base text-right break-all">{children}</div>
    </div>
  );
}

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
      <DialogHeader>
        <DialogTitle>Order Details</DialogTitle>
      </DialogHeader>

      <div className="grid gap-5 sm:gap-6">
        <div className="grid gap-3">
          <Row label="Order ID">
            <Label>{orderDetails?._id}</Label>
          </Row>
          <Row label="Order Date">
            <Label>{orderDetails?.orderDate?.split("T")[0]}</Label>
          </Row>
          <Row label="Order Price">
            <Label>₹{orderDetails?.totalAmount}</Label>
          </Row>
          <Row label="Payment method">
            <Label>{orderDetails?.paymentMethod}</Label>
          </Row>
          <Row label="Payment Status">
            <Label>{orderDetails?.paymentStatus}</Label>
          </Row>
          <Row label="Order Status">
            <Badge className={`py-1 px-3 ${statusClass(orderDetails?.orderStatus)}`}>
              {orderDetails?.orderStatus}
            </Badge>
          </Row>
        </div>

        <Separator />

        <div className="grid gap-2">
          <div className="font-medium">Items</div>
          <ul className="grid gap-3">
            {orderDetails?.cartItems?.length > 0
              ? orderDetails.cartItems.map((item, index) => (
                  <li
                    key={item?._id || item?.productId || index}
                    className="rounded-md border p-3 grid gap-1 text-sm sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-4 sm:border-0 sm:p-0"
                  >
                    <span className="font-medium sm:font-normal">
                      {item.title}
                    </span>
                    <span className="text-muted-foreground sm:text-foreground">
                      Qty: {item.quantity}
                    </span>
                    <span className="sm:text-right">₹{item.price}</span>
                  </li>
                ))
              : null}
          </ul>
        </div>

        <Separator />

        <div className="grid gap-2">
          <div className="font-medium">Shipping Info</div>
          <div className="grid gap-0.5 text-sm sm:text-base text-muted-foreground break-words">
            <span>{user?.userName}</span>
            <span>{orderDetails?.addressInfo?.address}</span>
            <span>{orderDetails?.addressInfo?.city}</span>
            <span>{orderDetails?.addressInfo?.pincode}</span>
            <span>{orderDetails?.addressInfo?.phone}</span>
            <span>{orderDetails?.addressInfo?.notes}</span>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
