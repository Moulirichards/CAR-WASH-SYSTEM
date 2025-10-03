import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/utils";

interface EditBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: any | null;
  onUpdated: () => void;
}

export function EditBookingDialog({ open, onOpenChange, booking, onUpdated }: EditBookingDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [carType, setCarType] = useState("sedan");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [serviceType, setServiceType] = useState("Basic Wash");
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [duration, setDuration] = useState("60");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Pending");
  const [rating, setRating] = useState("");
  const [addOns, setAddOns] = useState<string[]>([]);

  // Prefill form when booking changes
  useEffect(() => {
    if (booking) {
      setCustomerName(booking.customerName || booking.customer_name || "");
      setCarType(booking.carDetails?.type || booking.car_type || "sedan");
      setCarMake(booking.carDetails?.make || "");
      setCarModel(booking.carDetails?.model || "");
      setCarYear(booking.carDetails?.year ? String(booking.carDetails.year) : "");
      setServiceType(booking.serviceType || booking.service_type || "Basic Wash");
      setBookingDate(booking.date ? new Date(booking.date).toISOString().split('T')[0] : booking.booking_date ? new Date(booking.booking_date).toISOString().split('T')[0] : "");
      setTimeSlot(booking.timeSlot || booking.time_slot || "");
      setDuration(booking.duration ? String(booking.duration) : "60");
      setPrice(booking.price ? String(booking.price) : "");
      setStatus(booking.status || "Pending");
      setRating(booking.rating ? String(booking.rating) : "");
      setAddOns(booking.addOns || []);
    }
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking?._id && !booking?.id) return;
    
    if (!customerName || !bookingDate || !timeSlot || !price) {
      toast({ title: "Missing fields", description: "Please fill required fields.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const carDetailsObj: any = { type: carType };
      if (carMake) carDetailsObj.make = carMake;
      if (carModel) carDetailsObj.model = carModel;
      if (carYear) carDetailsObj.year = Number(carYear);

      await api(`/api/bookings/${booking._id || booking.id}`, {
        method: "PUT",
        body: JSON.stringify({
          customerName,
          carDetails: carDetailsObj,
          serviceType,
          date: bookingDate ? new Date(bookingDate) : undefined,
          timeSlot,
          duration: Number(duration) || 60,
          price: Number(price),
          status,
          rating: rating ? Number(rating) : undefined,
          addOns: addOns.length > 0 ? addOns : undefined,
        }),
      });

      toast({ title: "Success", description: "Booking updated" });
      onOpenChange(false);
      onUpdated();
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to update booking", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_customer_name">Customer Name</Label>
              <Input id="edit_customer_name" name="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_car_type">Car Type</Label>
              <Select value={carType} onValueChange={setCarType}>
                <SelectTrigger id="edit_car_type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="carType" value={carType} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_car_make">Car Make</Label>
              <Input id="edit_car_make" name="carMake" value={carMake} onChange={(e) => setCarMake(e.target.value)} placeholder="e.g., Toyota" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_car_model">Car Model</Label>
              <Input id="edit_car_model" name="carModel" value={carModel} onChange={(e) => setCarModel(e.target.value)} placeholder="e.g., Camry" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_car_year">Year</Label>
              <Input id="edit_car_year" name="carYear" type="number" value={carYear} onChange={(e) => setCarYear(e.target.value)} placeholder="e.g., 2020" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_service_type">Service Type</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger id="edit_service_type">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
          <SelectContent>
            <SelectItem value="Basic Wash">Basic Wash</SelectItem>
            <SelectItem value="Premium Wash">Premium Wash</SelectItem>
            <SelectItem value="Deluxe Wash">Deluxe Wash</SelectItem>
            <SelectItem value="Interior Cleaning">Interior Cleaning</SelectItem>
            <SelectItem value="Full Detailing">Full Detailing</SelectItem>
          </SelectContent>
              </Select>
              <input type="hidden" name="serviceType" value={serviceType} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_booking_date">Booking Date</Label>
              <Input id="edit_booking_date" name="date" type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_time_slot">Time Slot</Label>
              <Input id="edit_time_slot" name="timeSlot" placeholder="e.g., 10:00 AM" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_duration">Duration (min)</Label>
              <Input id="edit_duration" name="duration" type="number" min={0} value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_price">Price</Label>
              <Input id="edit_price" name="price" placeholder="$" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="edit_status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="status" value={status} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_rating">Rating (1-5)</Label>
              <Input id="edit_rating" name="rating" type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Optional" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Add-ons</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Waxing", "Polishing", "Tire Shine", "Air Freshener", "Interior Vacuum", "Leather Treatment"].map((addon) => (
                  <div key={addon} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-addon-${addon}`}
                      checked={addOns.includes(addon)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAddOns([...addOns, addon]);
                        } else {
                          setAddOns(addOns.filter(a => a !== addon));
                        }
                      }}
                    />
                    <Label htmlFor={`edit-addon-${addon}`} className="text-sm">{addon}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Updating..." : "Update"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
