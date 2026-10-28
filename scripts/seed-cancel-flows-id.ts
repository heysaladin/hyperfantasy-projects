import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const content = `<p>Kebanyakan tim menghabiskan berbulan-bulan menyempurnakan onboarding, tapi hampir tidak pernah menyentuh ujung lain dari perjalanan pengguna: momen ketika pelanggan memutuskan untuk pergi. Padahal ini adalah kesempatan yang terlewatkan begitu saja. Cancel flow adalah salah satu dari sedikit momen di mana pelanggan memberi tahu kamu, secara langsung dan jujur, apa yang tidak berjalan dengan baik. Dan ini juga kesempatan terakhir untuk memenangkan mereka kembali.</p>

<p>Mobbin baru-baru ini mempelajari 393 cancel flow bersama Daniel Hall dari Churnkey, sebuah platform retensi yang bekerja tepat di balik tombol cancel untuk perusahaan berbasis langganan. Data Churnkey berasal dari lebih dari 12 juta sesi pembatalan dan 500 juta billing event, dan telah membantu memulihkan hampir $300 juta pendapatan. Pertanyaan di balik studi ini sederhana: bagaimana merancang cancel flow yang membuat orang tetap bertahan, tanpa dark pattern?</p>

<p>Satu catatan soal cakupan. "Cancel flow" di sini maksudnya membatalkan langganan. Bukan menghapus akun, membatalkan pesanan, atau tombol Cancel di dialog konfirmasi.</p>

<h2>1. Cancel Flow Adalah Percakapan, Bukan Tembok</h2>

<p>Cancel flow terburuk memperlakukan kepergian pengguna sebagai masalah yang harus diblokir. Tombol yang disembunyikan, teks yang mempermalukan, dan layar konfirmasi yang tidak ada habisnya mungkin bisa menahan beberapa orang selama sebulan — tapi cara itu mengubah pelanggan yang pergi diam-diam menjadi pelanggan yang pergi sambil marah. Dan yang pergi dengan marah, meninggalkan ulasan.</p>

<p>Flow terbaik melakukan kebalikannya. Mereka memperlakukan pembatalan sebagai percakapan: <em>Kenapa kamu pergi? Ada yang bisa kami ubah? Kalau tidak, tidak apa-apa.</em> Tujuannya bukan menjebak orang. Tujuannya adalah menawarkan alternatif yang tepat di momen yang tepat, dan melepaskan dengan baik ketika tidak ada yang bisa ditawarkan.</p>

<h2>2. Berapa Diskon yang Sebaiknya Ditawarkan?</h2>

<p>Diskon adalah penawaran retensi yang paling umum, dan paling mudah salah digunakan. Beberapa prinsip yang konsisten berlaku:</p>

<ul>
  <li><strong>Sesuaikan penawaran dengan alasannya.</strong> Diskon berguna saat alasannya soal harga. Tidak ada gunanya untuk seseorang yang bilang "saya tidak pernah menggunakannya."</li>
  <li><strong>Jangan langsung tawarkan diskon terbesar.</strong> Kalau penawaran pertama sudah potongan terdalam, kamu tidak punya ruang lagi untuk bernegosiasi — dan kamu sudah mengajari pelanggan bahwa mengancam cancel adalah cara mendapat harga murah.</li>
  <li><strong>Beri batas waktu.</strong> Diskon beberapa bulan lalu kembali ke harga normal jauh lebih baik untuk margin dibanding potongan harga permanen.</li>
</ul>

<p>Anggap diskon sebagai alat untuk situasi tertentu, bukan reaksi default terhadap setiap pembatalan.</p>

<h2>3. Pause, Bukan Cancel</h2>

<p>Kadang orang tidak benar-benar ingin pergi. Mereka hanya tidak membutuhkan produknya <em>sekarang</em>: pekerjaan yang musiman, kuartal yang sibuk, liburan, bulan yang ketat secara finansial.</p>

<p>Opsi pause cocok untuk kasus-kasus seperti ini. Pelanggan tetap menyimpan data, pengaturan, dan riwayat mereka — dan kamu tetap menjaga hubungannya. Tanpa opsi pause, "cancel" adalah satu-satunya tombol yang sesuai dengan perasaan mereka, dan itulah yang mereka tekan.</p>

<p>Desain pause yang baik itu sederhana: biarkan mereka memilih durasi yang jelas, sampaikan kapan tepatnya tagihan dilanjutkan, dan ingatkan sebelum itu terjadi.</p>

<h2>4. Turun Paket atau Ganti Plan</h2>

<p>Tidak semua pembatalan soal produknya. Sering kali soal <em>paket</em>-nya. Pelanggan mungkin membayar untuk jumlah kursi, batas kuota, atau fitur yang tidak pernah mereka gunakan.</p>

<p>Menawarkan paket yang lebih murah atau lebih ringan di momen cancel mengubah pelanggan yang hilang menjadi pelanggan yang lebih kecil tapi masih aktif. Langganan yang lebih kecil tapi berlanjut biasanya jauh lebih bernilai dibanding langganan besar yang sudah berakhir — apalagi jika pelanggan itu suatu hari nanti tumbuh kembali ke paket yang lebih besar.</p>

<h2>5. Perpanjangan Trial Gratis</h2>

<p>Untuk orang yang membatalkan saat masih dalam masa trial, alasannya sering bukan "ini tidak bagus." Alasannya adalah "saya belum sempat mencobanya dengan benar."</p>

<p>Perpanjangan trial menjawab keberatan itu secara langsung, karena memberi mereka apa yang kurang: waktu. Cara ini paling efektif jika disertai nudge menuju satu fitur atau alur kerja yang bisa membuat produk "klik" bagi mereka — sehingga hari-hari ekstra itu benar-benar berujung pada nilai nyata.</p>

<h2>6. Kalau Semua Penawaran Ditolak?</h2>

<p>Di sinilah respek paling diuji. Jika seseorang sudah melihat semua penawaran kamu dan masih ingin pergi, biarkan mereka pergi. Mendorong penawaran keempat dan kelima adalah titik di mana desain retensi yang baik bergeser menjadi dark pattern.</p>

<p>Yang tepat dilakukan saat itu:</p>

<ol>
  <li>Konfirmasi pembatalan dengan jelas.</li>
  <li>Sampaikan apa yang terjadi selanjutnya: kapan akses berakhir, apa yang terjadi dengan data mereka, dan apakah mereka bisa kembali suatu hari nanti.</li>
  <li>Tinggalkan pintu terbuka — dengan cara yang mudah untuk mengaktifkan kembali layanan.</li>
</ol>

<p>Pelanggan yang pergi dengan baik-baik jauh lebih mungkin kembali dibanding yang harus berjuang keras untuk bisa keluar.</p>

<h2>7. Cara Merancang Exit Survey</h2>

<p>Exit survey adalah data paling berharga yang akan kamu kumpulkan sepanjang tahun — tapi hanya jika dirancang dengan baik.</p>

<ul>
  <li><strong>Buat singkat.</strong> Satu pertanyaan wajib lebih baik dari sepuluh pertanyaan opsional. Setiap kolom tambahan adalah alasan ekstra untuk meninggalkan form.</li>
  <li><strong>Tawarkan alasan yang jelas dan tidak tumpang tindih.</strong> "Terlalu mahal," "Fiturnya kurang," "Beralih ke alat lain," "Tidak cukup sering pakai," dan "Lainnya" akan mencakup sebagian besar kasus dan membuat datanya mudah dianalisis.</li>
  <li><strong>Buat jawabannya menggerakkan layar berikutnya.</strong> Kalau seseorang memilih "terlalu mahal," tampilkan diskon atau opsi downgrade. Kalau mereka memilih "fitur yang kurang," tunjukkan roadmap atau cara menghubungi tim. Survey yang tidak mengubah apa pun yang terjadi setelahnya hanya sebuah form kosong.</li>
  <li><strong>Jangan hukum kejujuran.</strong> Alasan yang mereka pilih tidak seharusnya membuat flow menjadi lebih sulit.</li>
</ul>

<p>Jika dilakukan dengan benar, exit survey adalah sekaligus alat retensi dan alat riset produk.</p>

<h2>8. Buat Pembatalan Mudah</h2>

<p>Ini terdengar kontra-intuitif, tapi inilah prinsip terpenting dalam seluruh studi ini: <strong>kemudahan membatalkan membangun kepercayaan, dan kepercayaan adalah yang membawa orang kembali.</strong></p>

<p>Pelanggan harus bisa menemukan opsi cancel tanpa harus berburu, menyelesaikannya dalam beberapa langkah, dan mendapat konfirmasi yang jelas. Selain karena itu adalah hal yang benar untuk dilakukan, regulator di banyak negara juga semakin mensyaratkannya. Flow yang bergantung pada kebingungan untuk mempertahankan pendapatan adalah kewajiban hukum yang menunggu waktu, bukan strategi.</p>

<p>Satu hal lagi yang patut diingat: di iOS, sebagian besar langganan dibatalkan melalui Pengaturan → Langganan, bukan di dalam aplikasi. Artinya tim aplikasi punya kendali lebih sedikit atas momen cancel di iPhone — dan ini membuat pengalaman di dalam aplikasi, pesan sebelum titik itu, dan komunikasi win-back menjadi jauh lebih penting.</p>

<h2>9. Ketahui Benchmark dan Ukur Metrik yang Tepat</h2>

<p>Kamu tidak bisa meningkatkan apa yang tidak kamu ukur, dan cancel flow memberi banyak hal untuk diukur. Angka-angka yang berguna untuk dilacak:</p>

<ul>
  <li><strong>Save rate:</strong> proporsi upaya pembatalan yang berakhir dengan pelanggan tetap bertahan.</li>
  <li><strong>Penerimaan penawaran per jenis:</strong> penawaran mana (diskon, pause, downgrade, perpanjangan) yang benar-benar berhasil, dan untuk alasan apa.</li>
  <li><strong>Distribusi alasan:</strong> kenapa orang pergi, dan bagaimana itu berubah seiring waktu.</li>
  <li><strong>Retensi setelah save:</strong> apakah pelanggan yang menerima penawaran masih aktif berbulan-bulan kemudian. "Save" yang churn dalam 30 hari bukanlah save yang sesungguhnya.</li>
  <li><strong>Voluntary churn rate:</strong> dibandingkan dengan benchmark industri, karena angka yang sehat untuk satu kategori bisa jadi masalah di kategori lain.</li>
</ul>

<p>Churnkey, bekerja sama dengan Stripe, menerbitkan benchmark voluntary churn — dan itu adalah referensi yang berguna saat kamu memutuskan apakah angkamu perlu perhatian.</p>

<h2>Apa Artinya Ini untuk Desainer dan Tim Produk</h2>

<p>Jika kamu merancang produk berbasis langganan, ini versi singkatnya:</p>

<ol>
  <li><strong>Perlakukan cancel flow sebagai bagian dari produk,</strong> bukan urusan billing yang ditangani belakangan.</li>
  <li><strong>Sesuaikan setiap penawaran dengan alasan kepergian.</strong></li>
  <li><strong>Beri orang cara untuk pause atau turun paket</strong> sebelum memberi mereka cara untuk pergi.</li>
  <li><strong>Lepaskan dengan baik</strong> ketika mereka sudah mendengar semua penawaran dan tetap ingin keluar.</li>
  <li><strong>Gunakan exit survey</strong> sebagai sumber wawasan, bukan penghalang.</li>
  <li><strong>Ukur save seiring waktu,</strong> bukan hanya di momen pembatalan.</li>
</ol>

<p>Cancel flow yang baik tidak akan menyelamatkan setiap pelanggan, dan memang tidak seharusnya mencoba. Yang seharusnya dilakukannya adalah memastikan orang-orang yang bisa bertahan diberi alasan nyata untuk melakukannya — dan orang-orang yang pergi, pergi dengan kepercayaan mereka terhadap produkmu tetap utuh.</p>

<hr />

<p><em>Artikel ini terinspirasi dari video <strong>"We Studied 393 Cancel Flows. This Wins People Back."</strong> oleh Mobbin, menampilkan wawasan dari Daniel Hall dari Churnkey. Tonton di sini: <a href="https://www.youtube.com/watch?v=MQOfPYSYr70" target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v=MQOfPYSYr70</a></em></p>`

async function main() {
  const blog = await prisma.blog.create({
    data: {
      title: 'Merancang Cancel Flow yang Mengembalikan Pelanggan (Tanpa Dark Pattern)',
      slug: 'id---designing-cancel-flows-that-win-people-back',
      excerpt: 'Pelajaran dari 393 cancel flow tentang retensi, respek, dan layar terakhir yang dilihat pelangganmu. Panduan merancang cancel flow yang menawarkan alternatif nyata, melepas dengan baik, dan menjaga kepercayaan pelanggan tetap utuh.',
      content,
      tags: ['ux', 'desain', 'produk', 'langganan', 'retensi'],
      isPublished: false,
      index: 0,
    }
  })

  console.log('✅ Draft artikel berhasil dibuat!')
  console.log('ID   :', blog.id)
  console.log('Slug :', blog.slug)
  console.log('URL  : /articles/' + blog.slug)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
