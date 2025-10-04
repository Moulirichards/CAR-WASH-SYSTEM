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
      className="group p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer border-border/30 bg-gradient-to-br from-card via-card/98 to-card/95 hover:-translate-y-2 hover:border-primary/30 relative overflow-hidden backdrop-blur-sm"
      style={{ 
        boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
        background: "linear-gradient(145deg, hsl(var(--card)), hsl(var(--card) / 0.95))"
      }}
      onClick={() => onClick(id)}
    >
      {/* Realistic material overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary-glow/2 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      
      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="space-y-4 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-all duration-300 drop-shadow-sm">
              {customerName}
            </h3>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex items-center gap-2 bg-primary/10 px-2 py-1 rounded-lg">
                <Car className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{carType ? (carTypeLabels as any)[carType] || carType : ""}</span>
              </div>
              {carDetailsText && (
                <span className="text-sm bg-muted/50 px-2 py-1 rounded-md">• {carDetailsText}</span>
              )}
            </div>
          </div>
          <Badge className={`${statusColors[statusKey] || statusColors["pending"]} group-hover:scale-110 transition-all duration-300 shadow-lg font-semibold px-3 py-1`}>
            {rawStatus ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1) : ""}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-3 py-2 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-foreground">{dateLabel}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg">
              <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="font-medium text-foreground">{timeSlot} {duration ? `(${duration} min)` : ""}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border/30 relative">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Service</p>
              <p className="font-bold text-foreground group-hover:text-primary transition-all duration-300 text-lg">
                {serviceLabel}
              </p>
            </div>
            <div className="flex items-center gap-2 text-primary group-hover:scale-110 transition-all duration-300">
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent drop-shadow-sm">
                {priceLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 hover:bg-primary/8 hover:border-primary/40 hover:text-foreground hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
            onClick={() => onEdit(id)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 hover:scale-105 hover:shadow-lg transition-all duration-300 font-semibold"
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
