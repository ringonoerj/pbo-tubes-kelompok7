package smartcashier;

public abstract class User {
    protected String id;
    protected String name;
    protected String phoneNumber;

    // Constructor untuk menginisialisasi atribut dasar user
    public User(String id, String name, String phoneNumber) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
    }

    // Abstract method (wajib diimplementasikan oleh class turunannya)
    public abstract void displayProfile();

    // Getter untuk id
    public String getId() {
        return this.id;
    }

    // Tambahan getter opsional untuk name dan phoneNumber
    public String getName() {
        return this.name;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }
}
