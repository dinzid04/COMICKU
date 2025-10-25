# COMICKU

Baca Komik lengkap hanya di Comic Ku

## Fitur Baru & Integrasi Firebase

Proyek ini telah diperbarui untuk menyertakan fitur-fitur berikut:

*   **Autentikasi Pengguna**: Sistem login dan pendaftaran menggunakan Firebase Authentication.
*   **Favorit**: Pengguna dapat menyimpan manhwa favorit mereka.
*   **Riwayat Baca**: Aplikasi secara otomatis menyimpan chapter terakhir yang dibaca oleh pengguna.
*   **Admin Dashboard**: Panel admin untuk mengelola pesan sambutan (welcome message) di halaman utama.

Untuk menjalankan fitur-fitur ini, Anda perlu membuat dan mengkonfigurasi proyek Firebase Anda sendiri.

---

## Panduan Setup Firebase

Ikuti langkah-langkah di bawah ini untuk menghubungkan aplikasi ini ke Firebase.

### Langkah 1: Buat Proyek Firebase

1.  Buka [Firebase Console](https://console.firebase.google.com/).
2.  Klik **"Add project"** atau **"Buat proyek"**.
3.  Masukkan nama proyek (misalnya, `comicku-app`) dan ikuti langkah-langkah yang diberikan.
4.  Setelah proyek dibuat, Anda akan diarahkan ke halaman *Project Overview*.

### Langkah 2: Buat Aplikasi Web

1.  Di *Project Overview*, klik ikon Web (`</>`) untuk menambahkan aplikasi web baru.
2.  Masukkan nama panggilan aplikasi (misalnya, "COMICKU Web").
3.  Klik **"Register app"**. Firebase akan memberikan Anda objek `firebaseConfig`. **Salin objek ini**, kita akan membutuhkannya nanti.
4.  Anda bisa melewati langkah penambahan Firebase SDK, karena itu sudah diinstal di proyek ini.

### Langkah 3: Aktifkan Authentication

1.  Dari menu di sebelah kiri, buka **Build > Authentication**.
2.  Klik **"Get started"**.
3.  Di bawah tab **"Sign-in method"**, pilih dan aktifkan *provider* **"Email/Password"**.

### Langkah 4: Atur Firestore Database

1.  Dari menu di sebelah kiri, buka **Build > Firestore Database**.
2.  Klik **"Create database"**.
3.  Pilih untuk memulai dalam **Production mode**.
4.  Pilih lokasi Cloud Firestore yang paling dekat dengan pengguna Anda.
5.  Klik **"Enable"**.

### Langkah 5: Buat Dokumen Pengaturan Awal & Konfigurasi Admin

Anda perlu membuat dokumen pengaturan secara manual untuk pertama kali. Dokumen ini akan menyimpan data untuk *welcome message* dan daftar admin.

1.  Di halaman utama Firestore, klik **"+ Start collection"**.
2.  Masukkan `dashboard` sebagai **Collection ID**. Klik **Next**.
3.  Masukkan `settings` sebagai **Document ID**.
4.  Sekarang, tambahkan *field* untuk dokumen ini:
    *   **Field 1: `admins`**
        *   **Type**: `array`
        *   **Value**: Tambahkan item pertama ke array ini. Isikan dengan **Firebase UID** dari akun yang ingin Anda jadikan admin. Untuk mendapatkan UID Anda, daftarkan akun di aplikasi, lalu cari UID-nya di Firebase Console > Authentication.
    *   **Field 2: `welcomeMessage`**
        *   **Type**: `map`
        *   Di dalam `map` ini, tambahkan tiga *field* berikut:
            *   `imageUrl` (string): `https://cdn.nefyu.my.id/030i.jpeg`
            *   `title` (string): `Baca Komik Gak Ribet`
            *   `subtitle` (string): `Dimana aja, Kapan aja`
5.  Klik **"Save"** untuk membuat dokumen.

### Langkah 6: Atur Aturan Keamanan (Security Rules)

Aturan keamanan sangat penting untuk melindungi data Anda.

1.  Buka tab **"Rules"** di halaman Firestore.
2.  Ganti aturan yang ada dengan aturan berikut. Aturan ini mengizinkan semua orang membaca pengaturan, tetapi hanya admin yang bisa mengubahnya.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data is private
    match /users/{userId}/{documents=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Anyone can read dashboard settings
    match /dashboard/settings {
      allow read: if true;
      // Only admins (defined in the document itself) can write
      allow write: if request.auth != null && request.auth.uid in get(/databases/$(database)/documents/dashboard/settings).data.admins;
    }
  }
}
```

3.  Klik **"Publish"** untuk menyimpan aturan baru.

### Langkah 7: Masukkan Konfigurasi Firebase ke Aplikasi

1.  Buat file `.env` di dalam folder `client`.
2.  Salin isi dari `client/.env.example` ke `client/.env`.
3.  Ganti nilai-nilai *placeholder* tersebut dengan objek `firebaseConfig` yang Anda salin dari Firebase pada **Langkah 2**.
4.  Simpan file tersebut.

Setelah menyelesaikan semua langkah ini, aplikasi Anda akan sepenuhnya terhubung dengan Firebase. Anda bisa menjalankan aplikasi secara lokal dan semua fitur akan berfungsi.
