# KTP Capture

Aplikasi web sederhana untuk mengambil gambar KTP (Kartu Tanda Penduduk) menggunakan kamera perangkat. Aplikasi ini dibangun dengan HTML5, CSS, dan JavaScript murni tanpa framework tambahan.

## Fitur

- Mengakses kamera belakang perangkat (jika tersedia)
- Frame panduan untuk memposisikan KTP
- Kontrol flash (jika perangkat mendukung)
- Pengambilan gambar dengan kualitas tinggi
- Pratinjau gambar yang diambil
- Opsi untuk mengunduh gambar
- Antarmuka yang responsif untuk berbagai ukuran layar
- Desain minimalis dan mudah digunakan

## Tampilan Aplikasi

![Screenshot Aplikasi](https://via.placeholder.com/800x450.png?text=Screenshot+KTP+Capture)

## Persyaratan Sistem

- Browser modern yang mendukung HTML5 dan JavaScript
- Perangkat dengan kamera (smartphone, tablet, atau laptop dengan webcam)
- Koneksi internet untuk memuat aplikasi (jika dihosting)

## Cara Instalasi

1. Clone repositori ini:
   ```
   git clone https://github.com/username/html5-capture-ktp.git
   ```

2. Buka folder proyek:
   ```
   cd html5-capture-ktp
   ```

3. Jalankan dengan server lokal. Contoh menggunakan PHP:
   ```
   php -S localhost:8000
   ```
   Atau gunakan server web lain seperti Apache, Nginx, atau extension Live Server di VS Code.

4. Buka browser dan akses `http://localhost:8000`

## Cara Penggunaan

1. Izinkan akses kamera saat browser meminta izin
2. Posisikan KTP di dalam bingkai panduan yang ditampilkan
3. Gunakan tombol "Toggle Flash" untuk menyalakan/mematikan flash jika diperlukan
4. Tekan tombol "Capture" untuk mengambil gambar
5. Periksa hasil gambar yang diambil
6. Pilih "Download" untuk menyimpan gambar ke perangkat Anda atau "Save" untuk menyimpan (catatan: fitur Save hanya demo)
7. Jika ingin mengambil ulang gambar, tekan tombol "Retake"

## Struktur Proyek

```
├── css/
│   └── styles.css       # Stylesheet utama
├── js/
│   └── app.js           # Kode JavaScript utama
├── index.html           # Halaman utama aplikasi
└── README.md            # Dokumentasi proyek
```

## Keamanan

Aplikasi ini berjalan sepenuhnya di sisi klien dan tidak mengirimkan data gambar ke server manapun. Gambar yang diambil hanya disimpan di perangkat pengguna saat tombol "Download" ditekan.

## Pengembangan Lebih Lanjut

Beberapa ide untuk pengembangan lebih lanjut:

- Implementasi penyimpanan gambar ke server
- Penambahan filter gambar untuk meningkatkan kualitas
- Optimasi untuk perangkat dengan spesifikasi rendah

## Kontribusi

Kontribusi selalu diterima! Jika Anda ingin berkontribusi:

1. Fork repositori ini
2. Buat branch fitur baru (`git checkout -b fitur-baru`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## Kontak

Jika Anda memiliki pertanyaan atau saran, silakan buka issue di repositori GitHub ini.