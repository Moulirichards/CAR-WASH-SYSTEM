import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BookingCard } from "@/components/BookingCard";
import { BookingFilters } from "@/components/BookingFilters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-carwash.jpg";
import { NewBookingDialog } from "@/components/NewBookingDialog";
import { EditBookingDialog } from "@/components/EditBookingDialog";
import { api } from "@/lib/utils";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceType, setServiceType] = useState("all");
  const [carType, setCarType] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("-date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);

  const { data: bookingsResp, isLoading, refetch } = useQuery({
    queryKey: ["bookings", searchQuery, serviceType, carType, status, dateFrom, dateTo, sortBy, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("pageSize", String(itemsPerPage));
      if (searchQuery) params.set("q", searchQuery);
      if (serviceType !== "all") params.set("serviceType", serviceType);
      if (carType !== "all") params.set("carType", carType);
      if (status !== "all") params.set("status", status);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      if (sortBy) params.set("sort", sortBy);
      return api<{ items: any[]; total: number }>(`/api/bookings?${params.toString()}`);
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      await api(`/api/bookings/${id}`, { method: "DELETE" });
      toast({ title: "Success", description: "Booking deleted successfully" });
      refetch();
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to delete booking", variant: "destructive" });
    }
  };

  const handleEdit = (id: string) => {
    const booking = paginatedBookings.find(b => (b._id || b.id) === id);
    if (booking) {
      setEditingBooking(booking);
      setIsEditOpen(true);
    }
  };

  const handleClick = (id: string) => {
    navigate(`/booking/${id}`);
  };

  const paginatedBookings = bookingsResp?.items || [];
  const totalPages = Math.ceil((bookingsResp?.total || 0) / itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={heroImage}
          alt="Professional car wash service"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-glow/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4 px-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Sparkle Drive</h1>
            <p className="text-xl md:text-2xl font-light">Premium Car Wash & Detailing Services</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Bookings</h2>
            <p className="text-muted-foreground mt-1">Manage and view all car wash bookings</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90" onClick={() => setIsNewOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            New Booking
          </Button>
        </div>

        <NewBookingDialog
          open={isNewOpen}
          onOpenChange={setIsNewOpen}
          onCreated={() => {
            refetch();
          }}
        />

        <EditBookingDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          booking={editingBooking}
          onUpdated={() => {
            refetch();
            setEditingBooking(null);
          }}
        />

        {/* Filters */}
        <BookingFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          serviceType={serviceType}
          onServiceTypeChange={setServiceType}
          carType={carType}
          onCarTypeChange={setCarType}
          status={status}
          onStatusChange={setStatus}
          dateFrom={dateFrom}
          onDateFromChange={setDateFrom}
          dateTo={dateTo}
          onDateToChange={setDateTo}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        {/* Bookings Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading bookings...</p>
          </div>
        ) : paginatedBookings && paginatedBookings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedBookings.map((booking) => (
                <BookingCard
                  key={booking._id || booking.id}
                  booking={booking}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClick={handleClick}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "bg-gradient-to-r from-primary to-primary-glow" : ""}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg border border-border/50">
            <p className="text-muted-foreground text-lg">No bookings found</p>
            <p className="text-muted-foreground text-sm mt-2">Create your first booking to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
