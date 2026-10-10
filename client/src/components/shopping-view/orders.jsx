

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

const statusClass = (status) =>
  status === "confirmed"
    ? "bg-green-500"
    : status === "rejected"
    ? "bg-red-600"
    : "bg-black";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const hasOrders = orderList && orderList.length > 0;

  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl">Order History</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {!hasOrders && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No orders yet.
          </p>
        )}

        {/* Mobile: card list */}
        {hasOrders && (
          <div className="grid gap-3 md:hidden">
            {orderList.map((orderItem) => (
              <div
                key={orderItem?._id}
                className="rounded-lg border p-4 grid gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Order ID</p>
                    <p className="text-sm font-medium break-all">
                      {orderItem?._id}
                    </p>
                  </div>
                  <Badge className={`py-1 px-3 ${statusClass(orderItem?.orderStatus)}`}>
                    {orderItem?.orderStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {orderItem?.orderDate?.split("T")[0]}
                  </span>
                  <span className="font-semibold">₹{orderItem?.totalAmount}</span>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleFetchOrderDetails(orderItem?._id)}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Tablet / Desktop: table */}
        {hasOrders && (
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Order Price</TableHead>
                  <TableHead>
                    <span className="sr-only">Details</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderList.map((orderItem) => (
                  <TableRow key={orderItem?._id}>
                    <TableCell className="max-w-[180px] truncate">
                      {orderItem?._id}
                    </TableCell>
                    <TableCell>{orderItem?.orderDate?.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge className={`py-1 px-3 ${statusClass(orderItem?.orderStatus)}`}>
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{orderItem?.totalAmount}</TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => handleFetchOrderDetails(orderItem?._id)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Single dialog, outside the list */}
        <Dialog
          open={openDetailsDialog}
          onOpenChange={(open) => {
            if (!open) {
              setOpenDetailsDialog(false);
              dispatch(resetOrderDetails());
            }
          }}
        >
          <ShoppingOrderDetailsView orderDetails={orderDetails} />
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
