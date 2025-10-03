import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Calendar } from "lucide-react";

interface BookingFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  serviceType: string;
  onServiceTypeChange: (value: string) => void;
  carType: string;
  onCarTypeChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
}

export const BookingFilters = ({
  searchQuery,
  onSearchChange,
  serviceType,
  onServiceTypeChange,
  carType,
  onCarTypeChange,
  status,
  onStatusChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  sortBy,
  onSortByChange,
}: BookingFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 p-6 bg-card rounded-lg border border-border/50 shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Customer or car details..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service-type">Service Type</Label>
        <Select value={serviceType} onValueChange={onServiceTypeChange}>
          <SelectTrigger id="service-type">
            <SelectValue placeholder="All Services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="Basic Wash">Basic Wash</SelectItem>
            <SelectItem value="Premium Wash">Premium Wash</SelectItem>
            <SelectItem value="Deluxe Wash">Deluxe Wash</SelectItem>
            <SelectItem value="Interior Cleaning">Interior Cleaning</SelectItem>
            <SelectItem value="Full Detailing">Full Detailing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="car-type">Car Type</Label>
        <Select value={carType} onValueChange={onCarTypeChange}>
          <SelectTrigger id="car-type">
            <SelectValue placeholder="All Cars" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cars</SelectItem>
            <SelectItem value="sedan">Sedan</SelectItem>
            <SelectItem value="suv">SUV</SelectItem>
            <SelectItem value="truck">Truck</SelectItem>
            <SelectItem value="van">Van</SelectItem>
            <SelectItem value="sports_car">Sports Car</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger id="status">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date-from">Date From</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date-to">Date To</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="date-to"
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sort">Sort By</Label>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger id="sort">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-date">Newest First</SelectItem>
            <SelectItem value="date">Oldest First</SelectItem>
            <SelectItem value="-price">Price: High to Low</SelectItem>
            <SelectItem value="price">Price: Low to High</SelectItem>
            <SelectItem value="-duration">Duration: Long to Short</SelectItem>
            <SelectItem value="duration">Duration: Short to Long</SelectItem>
            <SelectItem value="customerName">Customer Name: A-Z</SelectItem>
            <SelectItem value="-customerName">Customer Name: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
