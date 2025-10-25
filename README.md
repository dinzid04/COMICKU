# COMICKU

Baca Komik lengkap hanya di Comic Ku

## Fitur Baru & Integrasi Firebase

Proyek ini telah diperbarui untuk menyertakan fitur-fitur berikut:

*   **Autentikasi Pengguna**: Sistem login dan pendaftaran menggunakan Firebase Authentication.
*   **Favorit**: Pengguna dapat menyimpan manhwa favorit mereka.
*   **Riwayat Baca**: Aplikasi secara otomatis menyimpan chapter terakhir yang dibaca oleh pengguna.
*   **Admin Dashboard**: Panel admin untuk mengelola konten di halaman utama.

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

### Langkah 5: Atur Aturan Keamanan (Security Rules)

Aturan keamanan sangat penting untuk melindungi data Anda.

1.  Buka tab **"Rules"** di halaman Firestore.
2.  Ganti aturan yang ada dengan aturan berikut:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Pengguna hanya bisa membaca/menulis data mereka sendiri
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Dashboard settings can be read by anyone, but only written by admins
    match /dashboard/settings {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid in get(/databases/$(database)/documents/admins/uids).data.uids;
    }
  }
}
```

3.  Klik **"Publish"** untuk menyimpan aturan baru.

### Langkah 6: Konfigurasi Admin

1. Di Firestore, buat collection baru bernama `admins`.
2. Di dalam collection `admins`, buat document baru bernama `uids`.
3. Di dalam document `uids`, tambahkan field `uids` bertipe `array`.
4. Tambahkan Firebase UID dari akun admin Anda ke dalam array `uids`.

### Langkah 7: Masukkan Konfigurasi Firebase ke Aplikasi

1.  Buat file `.env` di dalam folder `client`.
2.  Salin isi dari `client/.env.example` ke `client/.env`.
3.  Ganti nilai-nilai *placeholder* tersebut dengan objek `firebaseConfig` yang Anda salin dari Firebase pada **Langkah 2**.
4.  Simpan file tersebut.

Setelah menyelesaikan semua langkah ini, aplikasi Anda akan sepenuhnya terhubung dengan Firebase. Anda bisa menjalankan aplikasi secara lokal dan semua fitur autentikasi, favorit, dan riwayat akan berfungsi.
