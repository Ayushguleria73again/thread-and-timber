"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiCheckCircle, FiPackage, FiTruck, FiHome } from "react-icons/fi";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAuth } from "@/components/auth/AuthProvider";
import { getOrderById, type Order } from "@/lib/orders";

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: FiCheckCircle },
  { key: "processing", label: "Processing", icon: FiPackage },
  { key: "shipped", label: "Shipped", icon: FiTruck },
  { key: "delivered", label: "Delivered", icon: FiHome }
];

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const fetchOrder = async () => {
      const token = localStorage.getItem("thread-timber-token");
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/orders/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          router.push("/dashboard/orders");
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id, user, router]);

  if (loading) return (
      <div className="flex h-screen items-center justify-center bg-sand text-ink/40">
          <p className="text-xs uppercase tracking-widest animate-pulse">Loading order details...</p>
      </div>
  );

  if (!order) return null;

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.key === order.status
  );

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-black/5 bg-white/70 p-8 text-center">
            <FiCheckCircle className="mx-auto mb-4 text-5xl text-moss" />
            <h1 className="text-3xl font-semibold text-black">Order Confirmed!</h1>
            <p className="mt-2 text-sm text-black/70">
              Thank you for your purchase. Your order #{order._id.slice(-8)} has been received.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-black/5 bg-white/70 p-6">
            <SectionHeading
              label="Order Status"
              title="Track your order"
              subtitle="We'll update you as your order progresses."
            />
            <div className="mt-6 flex items-center justify-between">
              {statusSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step.key} className="flex flex-1 flex items-center">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                        isActive
                          ? "border-moss bg-moss text-sand"
                          : "border-black/20 bg-white text-black/30"
                      }`}
                    >
                      <StepIcon className={isCurrent ? "text-lg" : "text-sm"} />
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`h-1 flex-1 ${
                          isActive ? "bg-moss" : "bg-black/10"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-center text-sm font-medium text-black">
              Current Status: {statusSteps[currentStepIndex]?.label}
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
              <h3 className="text-lg font-semibold text-black">Order Details</h3>
              <div className="mt-4 space-y-2 text-sm text-black/70">
                <p>Order #: {order._id.slice(-8)}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Items: {order.items.length}</p>
                <p className="mt-4 font-semibold text-black">
                  Total: ${order.total.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
              <h3 className="text-lg font-semibold text-black">Shipping Address</h3>
              <div className="mt-4 text-sm text-black/70">
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zip}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-black/5 bg-white/70 p-6">
            <h3 className="text-lg font-semibold text-black">Order Items</h3>
            <div className="mt-4 space-y-4">
              {order.items.map((item: any) => (
                <div
                  key={item.product}
                  className="flex items-center gap-4 rounded-2xl border border-black/5 bg-sand/50 p-4"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-black">{item.name}</p>
                    <p className="text-sm text-black/70">
                      Qty: {item.quantity} × ${item.price}
                    </p>
                  </div>
                  <p className="font-semibold text-black">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Link
              href="/dashboard/orders"
              className="flex-1 rounded-full border border-black/10 bg-white px-6 py-3 text-center text-xs uppercase tracking-[0.3em] text-black"
            >
              View All Orders
            </Link>
            <Link
              href="/shop"
              className="flex-1 rounded-full bg-black px-6 py-3 text-center text-xs uppercase tracking-[0.3em] text-sand"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
