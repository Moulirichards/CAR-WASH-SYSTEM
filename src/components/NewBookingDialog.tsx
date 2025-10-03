import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/utils";

interface NewBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function NewBookingDialog({ open, onOpenChange, onCreated }: NewBookingDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [carType, setCarType] = useState("sedan");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [serviceType, setServiceType] = useState("Basic Wash");
  const [bookingDate, setBookingDate] = useState(""); // YYYY-MM-DD
  const [timeSlot, setTimeSlot] = useState("");
  const [duration, setDuration] = useState("60");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [addOns, setAddOns] = useState<string[]>([]);

  const resetForm = () => {
    setCustomerName("");
    setCarType("sedan");
    setCarMake("");
    setCarModel("");
    setCarYear("");
    setServiceType("Basic Wash");
    setBookingDate("");
    setTimeSlot("");
    setDuration("60");
    setPrice("");
    setRating("");
    setAddOns([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await api("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          customerName,
          carDetails: carDetailsObj,
          serviceType,
          date: bookingDate ? new Date(bookingDate) : undefined,
          timeSlot,
          duration: Number(duration) || 60,
          price: Number(price),
          status: "Pending",
          rating: rating ? Number(rating) : undefined,
          addOns: addOns.length > 0 ? addOns : undefined,
        }),
      });

      toast({ title: "Success", description: "Booking created" });
      resetForm();
      onOpenChange(false);
      onCreated();
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to create booking", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Customer Name</Label>
              <Input id="customer_name" name="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="car_type">Car Type</Label>
              <Select value={carType} onValueChange={setCarType}>
                <SelectTrigger id="car_type">
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
              <Label htmlFor="car_make">Car Make</Label>
              <Input id="car_make" name="carMake" value={carMake} onChange={(e) => setCarMake(e.target.value)} placeholder="e.g., Toyota" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="car_model">Car Model</Label>
              <Input id="car_model" name="carModel" value={carModel} onChange={(e) => setCarModel(e.target.value)} placeholder="e.g., Camry" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="car_year">Year</Label>
              <Input id="car_year" name="carYear" type="number" value={carYear} onChange={(e) => setCarYear(e.target.value)} placeholder="e.g., 2020" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service_type">Service Type</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger id="service_type">
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
              <Label htmlFor="booking_date">Booking Date</Label>
              <Input id="booking_date" name="date" type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time_slot">Time Slot</Label>
              <Input id="time_slot" name="timeSlot" placeholder="e.g., 10:00 AM" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (min)</Label>
              <Input id="duration" name="duration" type="number" min={0} value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" placeholder="$" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input id="rating" name="rating" type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Optional" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Add-ons</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Waxing", "Polishing", "Tire Shine", "Air Freshener", "Interior Vacuum", "Leather Treatment"].map((addon) => (
                  <div key={addon} className="flex items-center space-x-2">
                    <Checkbox
                      id={`addon-${addon}`}
                      checked={addOns.includes(addon)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAddOns([...addOns, addon]);
                        } else {
                          setAddOns(addOns.filter(a => a !== addon));
                        }
                      }}
                    />
                    <Label htmlFor={`addon-${addon}`} className="text-sm">{addon}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


