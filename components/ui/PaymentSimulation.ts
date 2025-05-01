
interface PaymentData {
  customerName: string;
  eventTitle?: string;
  eventPrice?: number;
  events?: { title: string; price: number }[];
}

type CallbackFunction = (isApproved: boolean) => void;

const PaymentSimulation = (
  paymentData: PaymentData,
  isApproved: boolean,
  callback: CallbackFunction
): void => {
  console.log('Ödeme işlemi başlatıldı...');
  console.log('Ödeme verileri:', paymentData);
  
  // Ödeme simülasyonu için 3 saniye beklet
  setTimeout(() => {
    if (isApproved) {
      // Başarılı ödeme
      console.log('Ödeme başarılı!');
      
      // Mail içeriği oluştur
      const mailContent = formatMailContent(paymentData);
      
      // Mail içeriğini console'a bas
      console.log('---------- MAİL İÇERİĞİ ----------');
      console.log(mailContent);
      console.log('----------------------------------');
      
    } else {
      // Başarısız ödeme
      console.error('HATA: Ödeme işlemi başarısız oldu!');
      console.error('Hata kodu: PAYMENT_REJECTED');
      // Mail içeriği basılmayacak
    }
    
    // İşlem tamamlandı, callback'i çağır
    callback(isApproved);
  }, 3000); // 3 saniye beklet
};
  
  // Mail içeriği formatı
  interface Event {
    title: string;
    price: number;
  }

  interface MailContentData {
    customerName: string;
    eventTitle?: string;
    eventPrice?: number;
    events?: Event[];
  }

  const formatMailContent = (data: MailContentData): string => {
    // QR kod için basit bir simülasyon
    const qrCodeId = `QR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    // Tek bir etkinlik için
    if (!Array.isArray(data.events)) {
      return `
    Sayın ${data.customerName},
    
    Bilet satın alımınız için teşekkür ederiz!
    
    Etkinlik Bilgileri:
    ${data.eventTitle} | ₺${data.eventPrice} | ${qrCodeId}
    
    Biletinizi etkinlik girişinde görevlilere göstermeniz gerekmektedir.
    İyi eğlenceler dileriz!
    
    Saygılarımızla,
    Etkinlik Ekibi
      `;
    }
    
    // Çoklu etkinlik için
    const ticketsList = data.events.map((event: Event) => {
      const eventQrCode = `QR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      return `- ${event.title} | ₺${event.price} | ${eventQrCode}`;
    }).join('\n');
    
    return `
    Sayın ${data.customerName},
    
    Bilet satın alımınız için teşekkür ederiz!
    
    Biletleriniz:
    ${ticketsList}
    
    Biletlerinizi etkinlik girişinde görevlilere göstermeniz gerekmektedir.
    İyi eğlenceler dileriz!
    
    Saygılarımızla,
    Etkinlik Ekibi
    `;
  };
  
  export default PaymentSimulation;
  