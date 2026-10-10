


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
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function StatusBadge({ status }) {
  return (
    <Badge
      className={`py-1 px-3 ${
        status === "confirmed"
          ? "bg-green-500"
          : status === "rejected"
          ? "bg-red-600"
          : "bg-black"
      }`}
    >
      {status}
    </Badge>
  );
}

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const hasOrders = orderList && orderList.length > 0;

  return (
    <Card className="w-full">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">All Orders</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {/* Mobile: cards */}
        <div className="grid gap-3 md:hidden">
          {hasOrders ? (
            orderList.map((orderItem) => (
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
                  <StatusBadge status={orderItem?.orderStatus} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {orderItem?.orderDate?.split("T")[0]}
                  </span>
                  <span className="font-semibold">
                    ₹{orderItem?.totalAmount}
                  </span>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleFetchOrderDetails(orderItem?._id)}
                >
                  View Details
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-6">
              No orders found
            </p>
          )}
        </div>

        {/* Tablet / Desktop: table */}
        <div className="hidden md:block w-full overflow-x-auto">
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
              {hasOrders
                ? orderList.map((orderItem) => (
                    <TableRow key={orderItem?._id}>
                      <TableCell className="max-w-[180px] truncate">
                        {orderItem?._id}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {orderItem?.orderDate?.split("T")[0]}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={orderItem?.orderStatus} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        ₹{orderItem?.totalAmount}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Single dialog for both layouts */}
      <Dialog
        open={openDetailsDialog}
        onOpenChange={() => {
          setOpenDetailsDialog(false);
          dispatch(resetOrderDetails());
        }}
      >
        <AdminOrderDetailsView orderDetails={orderDetails} />
      </Dialog>
    </Card>
  );
}

export default AdminOrdersView;