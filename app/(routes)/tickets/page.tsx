"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Download, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import useAuthStore from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventImage: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  ticketType: string;
  ticketCode: string;
  price: number;
  purchaseDate: string;
  status: "active" | "used" | "expired";
}

export default function TicketsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  // Client tarafında çalıştığından emin ol
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (isClient && !isAuthenticated) {
      toast.error("Biletlerinizi görüntülemek için giriş yapmalısınız.");
      router.push("/auth/login");
    }
  }, [isClient, isAuthenticated, router]);

  // Kullanıcı rolünü al
  const userRole = user?.rol;

  // Gerçek uygulamada bu veri API'den gelecektir
  const [tickets] = useState<Ticket[]>([
    {
      id: "1",
      eventId: "1",
      eventTitle: "Duman Konseri",
      eventImage: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      eventDate: "15 Aralık 2023",
      eventTime: "20:00",
      eventLocation: "Volkswagen Arena, İstanbul",
      ticketType: "VIP",
      ticketCode: "DUMAN-VIP-12345",
      price: 1500,
      purchaseDate: "1 Kasım 2023",
      status: "active"
    },
    {
      id: "2",
      eventId: "2",
      eventTitle: "Fenerbahçe vs Galatasaray",
      eventImage: "https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      eventDate: "22 Aralık 2023",
      eventTime: "19:00",
      eventLocation: "Ülker Stadyumu, İstanbul",
      ticketType: "Premium",
      ticketCode: "FBGS-PREM-67890",
      price: 1200,
      purchaseDate: "5 Kasım 2023",
      status: "active"
    },
    {
      id: "3",
      eventId: "3",
      eventTitle: "İstanbul Coffee Festival",
      eventImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      eventDate: "10 Ekim 2023",
      eventTime: "12:00",
      eventLocation: "KüçükÇiftlik Park, İstanbul",
      ticketType: "Standart",
      ticketCode: "COFFEE-STD-54321",
      price: 150,
      purchaseDate: "1 Ekim 2023",
      status: "used"
    }
  ]);

  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "used" | "expired">("all");

  const filteredTickets = tickets.filter(ticket => {
    if (activeFilter === "all") return true;
    return ticket.status === activeFilter;
  });

  const handleDownload = (ticketId: string) => {
    // Bilet indirme fonksiyonu
    alert(`Bilet ${ticketId} indirilecek`);
  };

  const handleShare = (ticketId: string) => {
    // Bilet paylaşım fonksiyonu
    alert(`Bilet ${ticketId} paylaşılacak`);
  };

  const getStatusBadgeClass = (status: Ticket["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "used":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400";
    }
  };

  const getStatusText = (status: Ticket["status"]) => {
    switch (status) {
      case "active":
        return "Aktif";
      case "used":
        return "Kullanıldı";
      case "expired":
        return "Süresi Doldu";
      default:
        return status;
    }
  };

  return (
    <div className="bg-background min-h-screen py-12">
      {
        userRole === "admin" ? (
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8 text-foreground">Admin Paneli</h1>
            <p className="mb-4">Admin olarak tüm biletleri yönetebilirsiniz.</p>
            <Button onClick={() => router.push('/admin')}>
              Admin Paneline Git
            </Button>
          </div>
        ) : (
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8 text-foreground">Biletlerim</h1>

            <div className="mb-8 flex flex-wrap gap-2">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                onClick={() => setActiveFilter("all")}
              >
                Tümü ({tickets.length})
              </Button>
              <Button
                variant={activeFilter === "active" ? "default" : "outline"}
                onClick={() => setActiveFilter("active")}
              >
                Aktif ({tickets.filter(t => t.status === "active").length})
              </Button>
              <Button
                variant={activeFilter === "used" ? "default" : "outline"}
                onClick={() => setActiveFilter("used")}
              >
                Kullanıldı ({tickets.filter(t => t.status === "used").length})
              </Button>
              <Button
                variant={activeFilter === "expired" ? "default" : "outline"}
                onClick={() => setActiveFilter("expired")}
              >
                Süresi Doldu ({tickets.filter(t => t.status === "expired").length})
              </Button>
            </div>

            {filteredTickets.length === 0 ? (
              <div className="bg-card p-8 rounded-lg border border-border shadow-sm text-center">
                <h2 className="text-xl font-medium mb-4 text-foreground">Bilet bulunamadı</h2>
                <p className="text-muted-foreground mb-6">Seçilen filtreye uygun bilet bulunmamaktadır.</p>
                <Link href="/events">
                  <Button>Etkinliklere Göz At</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                      <div className="relative h-48 md:h-auto">
                        <Image
                          src={ticket.eventImage}
                          alt={ticket.eventTitle}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(ticket.status)}`}>
                            {getStatusText(ticket.status)}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 md:col-span-2">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <Link href={`/events/${ticket.eventId}`}>
                              <h2 className="text-xl font-bold text-foreground hover:text-primary">{ticket.eventTitle}</h2>
                            </Link>

                            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{ticket.eventDate}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>{ticket.eventTime}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{ticket.eventLocation}</span>
                              </div>
                            </div>

                            <div className="mt-4">
                              <div className="text-sm text-muted-foreground">
                                <span>Bilet Tipi: <span className="font-medium text-foreground">{ticket.ticketType}</span></span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <span>Bilet Kodu: <span className="font-medium text-foreground">{ticket.ticketCode}</span></span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <span>Satın Alma Tarihi: <span className="font-medium text-foreground">{ticket.purchaseDate}</span></span>
                              </div>
                            </div>
                          </div>

                          {ticket.status === "active" ? (
                            <div className="mt-6 md:mt-0 flex flex-col items-center justify-center">
                              <div className=" p-2 rounded-lg mb-4 w-32 h-32 flex items-center justify-center  bg-amber-400">
                                <QRCodeSVG value={ticket.ticketCode} className="h-24 w-24 text-foreground" />
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownload(ticket.id)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  İndir
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleShare(ticket.id)}
                                >
                                  <Share2 className="h-4 w-4 mr-1" />
                                  Paylaş
                                </Button>
                              </div>
                            </div>
                          ) :
                            <div className="mt-6 md:mt-0 flex flex-col items-center justify-center">
                              <p className="text-muted-foreground mb-6">Bilet kullanıldı</p>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      }
    </div>
  );
}