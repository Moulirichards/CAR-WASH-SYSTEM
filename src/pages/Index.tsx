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
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={heroImage}
          alt="Professional car wash service"
          className="w-full h-full object-cover"
        />
        {/* Enhanced gradient overlay with realistic depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/75 to-primary-glow/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-6 px-4 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-black tracking-tight drop-shadow-2xl">
                Sparkle Drive
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-white to-white/60 mx-auto rounded-full"></div>
            </div>
            <p className="text-xl md:text-3xl font-light drop-shadow-lg max-w-2xl mx-auto leading-relaxed">
              Premium Car Wash & Detailing Services
            </p>
            <div className="flex justify-center space-x-4 mt-8">
              <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
        
        {/* Subtle bottom gradient for seamless transition */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-foreground drop-shadow-sm">
                Bookings
              </h2>
              <p className="text-lg text-muted-foreground font-medium">
                Manage and view all car wash bookings
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 h-1 bg-gradient-to-r from-primary via-primary-glow to-accent rounded-full"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
          <Button 
            className="bg-gradient-to-r from-primary via-primary-glow to-accent hover:shadow-2xl hover:scale-105 transition-all duration-300 text-white font-bold px-8 py-3 rounded-xl relative overflow-hidden group" 
            onClick={() => setIsNewOpen(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Plus className="h-5 w-5 mr-2 relative z-10" />
            <span className="relative z-10">New Booking</span>
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
              {paginatedBookings.map((booking, index) => (
                <div
                  key={booking._id || booking.id}
                  className="animate-in slide-in-from-bottom-4 fade-in duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <BookingCard
                    booking={booking}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onClick={handleClick}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={`transition-all duration-300 ${
                        currentPage === page 
                          ? "bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg" 
                          : "hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-gradient-to-br from-card via-card/98 to-card/95 rounded-2xl border border-border/30 shadow-xl">
            <div className="space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary via-primary-glow to-accent rounded-full mx-auto flex items-center justify-center shadow-2xl">
                  <Plus className="h-10 w-10 text-white" />
                </div>
                <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full mx-auto animate-ping"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-foreground">No bookings found</h3>
                <p className="text-lg text-muted-foreground font-medium">Create your first booking to get started</p>
              </div>
              <div className="flex justify-center">
                <Button 
                  className="bg-gradient-to-r from-primary via-primary-glow to-accent hover:shadow-2xl hover:scale-110 transition-all duration-300 text-white font-bold px-8 py-4 rounded-xl relative overflow-hidden group"
                  onClick={() => setIsNewOpen(true)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Plus className="h-5 w-5 mr-2 relative z-10" />
                  <span className="relative z-10">Create First Booking</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
