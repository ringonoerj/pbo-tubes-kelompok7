package smartcashier;

public class Main {
    public static void main(String[] args) {
        System.out.println("--- Menguji Modul Auth & Karyawan ---");
        
        // Membuat object Karyawan (karena User itu abstract, kita harus instansiasi Karyawan)
        Karyawan karyawan1 = new Karyawan("KAR001", "Ringo Noer", "08123456789", "rahasia123");
        
        // 1. Uji Print Profil
        karyawan1.displayProfile();
        
        // 2. Uji Login (Gagal)
        System.out.println("\nMencoba login dengan password salah...");
        karyawan1.login("KAR001", "salahpass");
        
        // 3. Uji Login (Berhasil)
        System.out.println("\nMencoba login dengan password benar...");
        boolean isLogged = karyawan1.login("KAR001", "rahasia123");
        
        // 4. Simulasi Penambahan KPI (dipanggil setelah transaksi)
        if (isLogged) {
            System.out.println("\n--- Simulasi Karyawan menangani transaksi ---");
            karyawan1.addKpi(10.5); 
            karyawan1.addKpi(5.0);
            
            System.out.println("KPI Karyawan sekarang: " + karyawan1.getKpi());
        }
    }
}
