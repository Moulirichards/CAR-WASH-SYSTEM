import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Printer, Share2, QrCode, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "qrcode";

interface InvoiceActionsProps {
  booking: any;
  invoiceRef: React.RefObject<HTMLDivElement>;
}

export function InvoiceActions({ booking, invoiceRef }: InvoiceActionsProps) {
  const { toast } = useToast();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    const bookingId = booking._id || booking.id;
    const url = `${baseUrl}/booking/${bookingId}`;
    setShareUrl(url);
    
    // Generate QR code
    QRCode.toDataURL(url, { width: 200, margin: 2 })
      .then((qrUrl) => setQrCodeUrl(qrUrl))
      .catch((err) => console.error("QR Code generation failed:", err));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({ title: "Copied!", description: "Share URL copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Error", description: "Failed to copy URL", variant: "destructive" });
    }
  };

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;
    
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const customerName = (booking.customerName || booking.customer_name || "Customer").replace(/\s+/g, "_");
      const date = booking.date ? new Date(booking.date).toISOString().split('T')[0] : "unknown_date";
      pdf.save(`SparkleDrive_Invoice_${customerName}_${date}.pdf`);
      
      toast({ title: "Success", description: "Invoice downloaded as PDF" });
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast({ title: "Error", description: "Failed to generate PDF", variant: "destructive" });
    }
  };

  const printInvoice = () => {
    if (!invoiceRef.current) return;
    
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sparkle Drive - Booking Invoice</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: white;
              color: black;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #3b82f6;
              margin: 0;
              font-size: 2.5rem;
            }
            .header p {
              margin: 5px 0 0 0;
              color: #666;
            }
            .booking-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
            }
            .section {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
            }
            .section h3 {
              color: #1e40af;
              margin: 0 0 15px 0;
              font-size: 1.2rem;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              padding-bottom: 5px;
              border-bottom: 1px solid #e2e8f0;
            }
            .info-row:last-child {
              border-bottom: none;
              margin-bottom: 0;
            }
            .label {
              font-weight: 600;
              color: #374151;
            }
            .value {
              color: #1f2937;
            }
            .status {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 0.9rem;
              font-weight: 600;
            }
            .status.pending { background: #fef3c7; color: #92400e; }
            .status.confirmed { background: #dbeafe; color: #1e40af; }
            .status.completed { background: #d1fae5; color: #065f46; }
            .status.cancelled { background: #fee2e2; color: #991b1b; }
            .pricing {
              background: #3b82f6;
              color: white;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
            }
            .pricing h3 {
              margin: 0 0 10px 0;
              color: white;
            }
            .price {
              font-size: 2.5rem;
              font-weight: bold;
              margin: 0;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 0.9rem;
            }
            @media print {
              body { margin: 0; }
              .invoice-container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          ${invoiceRef.current.innerHTML}
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    
    toast({ title: "Success", description: "Print dialog opened" });
  };

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <Button onClick={downloadPDF} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button onClick={printInvoice} variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button 
          onClick={() => {
            generateShareUrl();
            setIsShareOpen(true);
          }} 
          variant="outline" 
          size="sm"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share Booking
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="share-url">Share URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="share-url"
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="px-3"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            {qrCodeUrl && (
              <div className="text-center">
                <Label>QR Code</Label>
                <div className="mt-2 p-4 bg-white rounded-lg border">
                  <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Scan to view booking details
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
