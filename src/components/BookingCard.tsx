import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, Car, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

interface BookingCardProps {
  booking: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
}

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
  sports_car: "Sports Car",
};

export const BookingCard = ({ booking, onEdit, onDelete, onClick }: BookingCardProps) => {
  const id: string = booking?._id || booking?.id;
  const customerName: string = booking?.customer_name || booking?.customerName || "";
  const carType: string | undefined = booking?.car_type || booking?.carDetails?.type;
  const carDetailsText: string | undefined =
    booking?.car_details || [booking?.carDetails?.make, booking?.carDetails?.model].filter(Boolean).join(" ") || undefined;
  const rawStatus: string = booking?.status || "";
  const statusKey = rawStatus;
  const rawService: string | undefined = booking?.service_type || booking?.serviceType;
  const serviceLabel = rawService && (serviceTypeLabels as any)[rawService] ? (serviceTypeLabels as any)[rawService] : rawService || "";
  const rawDate: any = booking?.booking_date || booking?.date;
  const dateObj = rawDate ? new Date(rawDate) : null;
  const dateLabel = dateObj && !isNaN(dateObj.getTime()) ? format(dateObj, "MMM dd, yyyy") : "-";
  const timeSlot: string = booking?.time_slot || booking?.timeSlot || "";
  const duration: number | string = booking?.duration ?? "";
  const rawPrice: any = booking?.price;
  const priceLabel = typeof rawPrice === "number" ? `$${rawPrice.toFixed(2)}` : String(rawPrice ?? "");
  return (
    <Card 
      className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 bg-gradient-to-br from-card to-card/95"
      style={{ boxShadow: "var(--shadow-card)" }}
      onClick={() => onClick(id)}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">{customerName}</h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Car className="h-4 w-4" />
              <span className="text-sm">{carType ? (carTypeLabels as any)[carType] || carType : ""}</span>
              {carDetailsText && (
                <span className="text-sm">• {carDetailsText}</span>
              )}
            </div>
          </div>
          <Badge className={statusColors[statusKey] || statusColors["pending"]}>
            {rawStatus ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1) : ""}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{dateLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>{timeSlot} {duration ? `(${duration} min)` : ""}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Service</p>
              <p className="font-semibold text-foreground">{serviceLabel}</p>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <DollarSign className="h-5 w-5" />
              <span className="text-2xl font-bold">{priceLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(id)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};
