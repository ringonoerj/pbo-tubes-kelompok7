package smartcashier;

public class Karyawan extends User {
    private String employeeId;
    private String password;
    private double kpiScore;

    // Constructor Karyawan
    public Karyawan(String id, String name, String phoneNumber, String password) {
        // Memanggil constructor parent (User) via super()
        super(id, name, phoneNumber);
        
        // Atribut khusus Karyawan
        this.employeeId = id; // Mengatur employeeId sama dengan id bawaan User
        this.password = password;
        this.kpiScore = 0.0;  // Skor awal default: 0
    }

    /**
     * Method Login Karyawan
     * Mengembalikan true jika id dan password cocok
     */
    public boolean login(String inputId, String inputPassword) {
        if (this.employeeId.equals(inputId) && this.password.equals(inputPassword)) {
            System.out.println("Login berhasil! Selamat datang, " + this.name);
            return true;
        } else {
            System.out.println("Login gagal! ID atau Password salah.");
            return false;
        }
    }

    // Method untuk mengambil nilai KPI
    public double getKpi() {
        return this.kpiScore;
    }

    // Method setter tambahan (sesuai checklist poin 4) untuk menambah KPI saat transaksi
    public void addKpi(double score) {
        this.kpiScore += score;
    }

    // Wajib meng-override abstract method displayProfile() dari parent
    @Override
    public void displayProfile() {
        System.out.println("=== Profil Karyawan ===");
        System.out.println("ID Karyawan : " + this.employeeId);
        System.out.println("Nama        : " + super.name);
        System.out.println("No HP       : " + super.phoneNumber);
        System.out.println("KPI Saat Ini: " + this.kpiScore);
        System.out.println("=======================");
    }
}
