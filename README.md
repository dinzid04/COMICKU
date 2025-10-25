# COMICKU

Baca Komik lengkap hanya di Comic Ku

## Fitur Baru & Integrasi Firebase

Proyek ini telah diperbarui untuk menyertakan fitur-fitur berikut:

*   **Autentikasi Pengguna**: Sistem login dan pendaftaran menggunakan Firebase Authentication.
*   **Favorit**: Pengguna dapat menyimpan manhwa favorit mereka.
*   **Riwayat Baca**: Aplikasi secara otomatis menyimpan chapter terakhir yang dibaca oleh pengguna.
*   **Admin Dashboard**: Panel admin untuk mengelola bagian kutipan (quote section) di halaman utama.

Untuk menjalankan fitur-fitur ini, Anda perlu membuat dan mengkonfigurasi proyek Firebase Anda sendiri.

---

## Panduan Setup Firebase

Ikuti langkah-langkah di bawah ini untuk menghubungkan aplikasi ini ke Firebase.

### Langkah 1: Buat Proyek Firebase

1.  Buka [Firebase Console](https://console.firebase.google.com/).
2.  Klik **"Add project"** atau **"Buat proyek"**.
3.  Masukkan nama proyek (misalnya, `comicku-app`) dan ikuti langkah-langkah yang diberikan.

### Langkah 2: Buat Aplikasi Web

1.  Di *Project Overview*, klik ikon Web (`</>`) untuk menambahkan aplikasi web baru.
2.  Masukkan nama panggilan aplikasi ("COMICKU Web").
3.  Klik **"Register app"**. Salin objek `firebaseConfig` yang diberikan.

### Langkah 3: Aktifkan Authentication

1.  Buka **Build > Authentication**.
2.  Klik **"Get started"**.
3.  Aktifkan provider **"Email/Password"**.

### Langkah 4: Atur Firestore Database

1.  Buka **Build > Firestore Database**.
2.  Klik **"Create database"** dan mulai dalam **Production mode**.

### Langkah 5: Buat Dokumen Pengaturan Awal & Konfigurasi Admin

Anda perlu membuat dokumen pengaturan secara manual untuk pertama kali.

1.  Di Firestore, buat koleksi baru bernama `dashboard`.
2.  Di dalamnya, buat dokumen dengan ID `settings`.
3.  Tambahkan *field* berikut ke dokumen `settings`:
    *   **Field 1: `admins`**
        *   **Type**: `array`
        *   **Value**: Tambahkan Firebase UID dari akun admin Anda.
    *   **Field 2: `quoteSection`**
        *   **Type**: `map`
        *   Di dalam `map` ini, tambahkan tiga *field* berikut:
            *   `quote` (string): `Persahabatan itu adalah tempat saling berbagi rasa sakit.`
            *   `author` (string): `Yoimiya`
            *   `authorImageUrl` (string): `https://cdn.nefyu.my.id/030i.jpeg`
4.  Klik **"Save"**.

### Langkah 6: Atur Aturan Keamanan (Security Rules)

1.  Buka tab **"Rules"** di Firestore.
2.  Ganti aturan yang ada dengan yang ini:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data is private
    match /users/{userId}/{documents=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Anyone can read dashboard settings, only admins can write
    match /dashboard/settings {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid in get(/databases/$(database)/documents/dashboard/settings).data.admins;
    }
  }
}
```

3.  Klik **"Publish"**.

### Langkah 7: Masukkan Konfigurasi Firebase ke Aplikasi

1.  Buat file `.env` di dalam folder `client`.
2.  Salin isi dari `client/.env.example` ke `client/.env`.
3.  Ganti nilai placeholder dengan `firebaseConfig` Anda.

Setelah ini, aplikasi Anda akan terhubung sepenuhnya ke Firebase.
