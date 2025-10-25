# COMICKU

Baca Komik lengkap hanya di Comic Ku

## Firebase Setup Guide

Untuk mengaktifkan fitur-fitur seperti otentikasi (Login/Sign Up), riwayat baca, dan favorit, Anda perlu mengonfigurasi proyek Firebase. Ikuti langkah-langkah di bawah ini.

### Langkah 1: Buat Proyek Firebase

1.  Buka [Firebase Console](https://console.firebase.google.com/).
2.  Klik **"Add project"** atau **"Buat proyek"**.
3.  Masukkan nama proyek (misalnya, `ComicKu-App`) dan ikuti langkah-langkah di layar. Anda bisa menonaktifkan Google Analytics jika tidak diperlukan.
4.  Setelah proyek dibuat, Anda akan diarahkan ke dasbor proyek.

### Langkah 2: Tambahkan Firebase ke Aplikasi Web Anda

1.  Dari dasbor proyek, klik ikon **Web** (`</>`) untuk memulai proses penyiapan untuk aplikasi web.
2.  Daftarkan aplikasi Anda dengan memberikan nama panggilan (misalnya, `ComicKu Web`).
3.  Firebase akan memberikan Anda objek konfigurasi (`firebaseConfig`). Salin objek ini, kita akan membutuhkannya nanti.

### Langkah 3: Aktifkan Otentikasi (Authentication)

1.  Di menu sebelah kiri, buka **Build > Authentication**.
2.  Klik **"Get started"**.
3.  Di tab **"Sign-in method"**, aktifkan *provider* **"Email/Password"**.

### Langkah 4: Siapkan Firestore Database

1.  Di menu sebelah kiri, buka **Build > Firestore Database**.
2.  Klik **"Create database"**.
3.  Pilih untuk memulai dalam **Production mode**.
4.  Pilih lokasi Cloud Firestore yang terdekat dengan pengguna Anda. Klik **Enable**.

### Langkah 5: Atur Aturan Keamanan Firestore (Firestore Rules)

Setelah database dibuat, Anda perlu memperbarui aturan keamanannya untuk mengizinkan pengguna yang sudah login untuk membaca dan menulis data mereka sendiri.

1.  Buka tab **"Rules"** di Firestore Database.
2.  Ganti aturan yang ada dengan yang berikut ini:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read and write to their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3.  Klik **"Publish"** untuk menyimpan aturan baru.

### Langkah 6: Tambahkan Konfigurasi Firebase ke Aplikasi Anda

Sekarang, Anda perlu menambahkan kredensial Firebase yang Anda salin di Langkah 2 ke dalam aplikasi.

1.  Buat file baru di `client/src/` bernama `firebaseConfig.ts`.
2.  Isi file tersebut dengan konten berikut, ganti placeholder dengan konfigurasi proyek Anda:

```typescript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "1:your-app-id:web:xxxxxxxxxxxxxxxxxxxxxx"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

**Penting:** Pastikan untuk mengganti semua nilai di dalam objek `firebaseConfig` dengan nilai yang sebenarnya dari proyek Firebase Anda.

Setelah Anda menyelesaikan semua langkah ini, aplikasi akan siap untuk menggunakan fitur-fitur yang memerlukan Firebase.

## Admin Dashboard Setup

Fitur dasbor admin memungkinkan Anda untuk mengubah gambar profil dan pesan selamat datang yang ditampilkan di header halaman utama.

### Langkah 1: Dapatkan UID Admin Anda

1.  Buka **Firebase Console** dan navigasikan ke proyek Anda.
2.  Di menu **Build**, klik **Authentication**.
3.  Di tab **Users**, Anda akan melihat daftar semua pengguna terdaftar. Salin **UID** dari akun yang ingin Anda jadikan admin.

### Langkah 2: Konfigurasikan UID Admin di Aplikasi

1.  Buka file `client/src/hooks/authProvider.tsx`.
2.  Temukan konstanta `ADMIN_UIDS` dan ganti placeholder dengan UID yang Anda salin dari Firebase Console. Anda dapat menambahkan beberapa UID jika diperlukan.

```typescript
// Ganti dengan UID admin Anda yang sebenarnya
const ADMIN_UIDS = ['YOUR_ADMIN_UID_HERE', 'ANOTHER_ADMIN_UID_IF_NEEDED'];
```

### Langkah 3: Perbarui Aturan Keamanan Firestore

Aturan keamanan Firestore perlu diperbarui untuk mengizinkan siapa saja membaca pengaturan dasbor, tetapi hanya admin yang dapat menulisnya.

1.  Buka **Firebase Console > Build > Firestore Database**.
2.  Klik tab **Rules**.
3.  Ganti aturan yang ada dengan yang berikut ini. **Jangan lupa untuk memasukkan UID admin Anda di bagian `allow write`**.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Pengguna hanya dapat membaca dan menulis data mereka sendiri
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Siapa saja dapat membaca pengaturan dasbor, tetapi hanya admin yang dapat menulis
    match /dashboard/settings {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid in ['YOUR_ADMIN_UID_HERE'];
    }
  }
}
```

4.  Klik **Publish** untuk menyimpan aturan baru Anda.

Setelah langkah-langkah ini selesai, pengguna admin yang masuk akan dapat mengakses `/admin` untuk mengelola pengaturan header.
