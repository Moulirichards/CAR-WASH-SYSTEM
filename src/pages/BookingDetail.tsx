import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, DollarSign, Car, User, Wrench, Star, Plus } from "lucide-react";
import { format } from "date-fns";
import { api } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { InvoiceActions } from "@/components/InvoiceActions";

const statusColors: Record<string, string> = {
  "Pending": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Confirmed": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "Completed": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Cancelled": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  // Legacy support
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const serviceTypeLabels: Record<string, string> = {
  "Basic Wash": "Basic Wash",
  "Premium Wash": "Premium Wash",
  "Deluxe Wash": "Deluxe Wash",
  "Interior Cleaning": "Interior Cleaning",
  "Full Detailing": "Full Detailing",
  // Legacy support
  basic_wash: "Basic Wash",
  premium_wash: "Premium Wash",
  deluxe_wash: "Deluxe Wash",
  interior_cleaning: "Interior Cleaning",
  full_detail: "Full Detail",
};

const carTypeLabels: Record<string, string> = {
  sedan: "Sedan",
  suv: "SUV",
  truck: "Truck",
  van: "Van",
  luxury: "Luxury",
};

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      if (!id) throw new Error("No booking ID provided");
      return api<any>(`/api/bookings/${id}`);
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Booking Not Found</h1>
          <p className="text-muted-foreground mb-6">The booking you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  const customerName = booking.customerName || booking.customer_name || "";
  const carType = booking.carDetails?.type || booking.car_type || "";
  const carMake = booking.carDetails?.make || "";
  const carModel = booking.carDetails?.model || "";
  const carYear = booking.carDetails?.year || "";
  const rawDate = booking.date || booking.booking_date;
  const dateObj = rawDate ? new Date(rawDate) : null;
  const dateLabel = dateObj && !isNaN(dateObj.getTime()) ? format(dateObj, "EEEE, MMMM do, yyyy") : "-";
  const timeSlot = booking.timeSlot || booking.time_slot || "";
  const duration = booking.duration || "";
  const price = booking.price || "";
  const serviceType = booking.serviceType || booking.service_type || "";
  const status = booking.status || "";
  const rating = booking.rating || null;
  const addOns = booking.addOns || [];
  const createdAt = booking.createdAt ? new Date(booking.createdAt) : null;
  const updatedAt = booking.updatedAt ? new Date(booking.updatedAt) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bookings
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Booking Details</h1>
              <p className="text-muted-foreground">Complete information for this booking</p>
            </div>
          </div>
          <InvoiceActions booking={booking} invoiceRef={invoiceRef} />
        </div>

        {/* Invoice Content */}
        <div ref={invoiceRef} className="invoice-container bg-white p-8 rounded-lg shadow-lg mb-8">
          {/* Invoice Header */}
          <div className="text-center border-b-2 border-primary pb-6 mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Sparkle Drive</h1>
            <p className="text-lg text-muted-foreground">Premium Car Wash & Detailing Services</p>
            <p className="text-sm text-muted-foreground mt-2">Booking Invoice</p>
          </div>

          {/* Booking Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Customer Info */}
            <div className="bg-slate-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Name:</span>
                  <span className="text-gray-900">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Service:</span>
                  <span className="text-gray-900">{serviceTypeLabels[serviceType] || serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Duration:</span>
                  <span className="text-gray-900">{duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className={`status ${status.toLowerCase()}`}>{status}</span>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="bg-slate-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Type:</span>
                  <span className="text-gray-900">{carTypeLabels[carType] || carType}</span>
                </div>
                {carMake && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Make:</span>
                    <span className="text-gray-900">{carMake}</span>
                  </div>
                )}
                {carModel && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Model:</span>
                    <span className="text-gray-900">{carModel}</span>
                  </div>
                )}
                {carYear && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Year:</span>
                    <span className="text-gray-900">{carYear}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-slate-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Service Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-gray-600">Date</p>
                  <p className="text-gray-900">{dateLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-gray-600">Time Slot</p>
                  <p className="text-gray-900">{timeSlot}</p>
                </div>
              </div>
            </div>
            {addOns && addOns.length > 0 && (
              <div className="mt-6">
                <p className="font-medium text-gray-600 mb-3">Add-ons</p>
                <div className="flex flex-wrap gap-2">
                  {addOns.map((addon: string, index: number) => (
                    <span key={index} className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                      <Plus className="h-3 w-3 inline mr-1" />
                      {addon}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-primary text-white p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Total Amount</h3>
            <p className="text-4xl font-bold">
              ${typeof price === "number" ? price.toFixed(2) : price}
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>Thank you for choosing Sparkle Drive!</p>
            <p>For questions, contact us at support@sparkledrive.com</p>
            {createdAt && (
              <p className="mt-2">Generated on {format(createdAt, "MMM dd, yyyy 'at' h:mm a")}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer & Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                  <Badge className={statusColors[status] || statusColors["Pending"]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{customerName}</h3>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Service Type</p>
                    <p className="font-semibold text-foreground">
                      {serviceTypeLabels[serviceType] || serviceType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold text-foreground">{duration} minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicle Type</p>
                    <p className="font-semibold text-foreground">
                      {carTypeLabels[carType] || carType}
                    </p>
                  </div>
                  {carMake && (
                    <div>
                      <p className="text-sm text-muted-foreground">Make</p>
                      <p className="font-semibold text-foreground">{carMake}</p>
                    </div>
                  )}
                  {carModel && (
                    <div>
                      <p className="text-sm text-muted-foreground">Model</p>
                      <p className="font-semibold text-foreground">{carModel}</p>
                    </div>
                  )}
                  {carYear && (
                    <div>
                      <p className="text-sm text-muted-foreground">Year</p>
                      <p className="font-semibold text-foreground">{carYear}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Service Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-semibold text-foreground">{dateLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time Slot</p>
                      <p className="font-semibold text-foreground">{timeSlot}</p>
                    </div>
                  </div>
                </div>
                {addOns && addOns.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Add-ons</p>
                      <div className="flex flex-wrap gap-2">
                        {addOns.map((addon: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            <Plus className="h-3 w-3 mr-1" />
                            {addon}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">
                    ${typeof price === "number" ? price.toFixed(2) : price}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">Total Amount</p>
                </div>
              </CardContent>
            </Card>

            {/* Rating */}
            {rating && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Customer Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="flex justify-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 ${
                            star <= rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-2xl font-bold text-foreground">{rating}/5</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle>Booking History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {createdAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-semibold text-foreground">
                      {format(createdAt, "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                )}
                {updatedAt && updatedAt.getTime() !== createdAt?.getTime() && (
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-semibold text-foreground">
                      {format(updatedAt, "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
