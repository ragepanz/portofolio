/**
 * Code.gs
 * Entry point untuk Web App Portofolio.
 *
 * CARA DEPLOY:
 * 1. Buka https://script.google.com -> New Project
 * 2. Hapus isi default Code.gs, ganti dengan isi file ini
 * 3. Buat file baru bertipe HTML bernama "Index" -> isi dengan Index.html
 * 4. Buat file baru bertipe HTML bernama "Stylesheet" -> isi dengan Stylesheet.html
 * 5. Buat file baru bertipe HTML bernama "JavaScript" -> isi dengan JavaScript.html
 * 6. Klik Deploy > New deployment > pilih tipe "Web app"
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Klik Deploy, salin URL yang diberikan -> itu link portofolio kamu
 *
 * Setiap kali mengubah kode, klik Deploy > Manage deployments > Edit > New version
 */

function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Portofolio - Ivan Edward')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setFaviconUrl('https://www.gstatic.com/script/images/favicon.ico')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper untuk include file HTML/CSS/JS terpisah ke dalam Index.html
 * Dipanggil di Index.html dengan: <?!= include('Stylesheet'); ?>
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * OPSIONAL: Fungsi untuk menerima pesan dari form kontak di halaman.
 * Dipanggil dari JavaScript.html lewat google.script.run.sendContactMessage(...)
 * Pesan akan dikirim ke email kamu.
 */
function sendContactMessage(data) {
  try {
    var namaPengirim = data.name || 'Tanpa nama';
    var emailPengirim = data.email || 'Tanpa email';
    var pesan = data.message || '';

    // Mengirim langsung ke email tujuan
    var emailTujuan = 'ivanedsr@gmail.com';

    MailApp.sendEmail({
      to: emailTujuan,
      subject: 'Pesan baru dari Portofolio: ' + namaPengirim,
      body: 'Dari: ' + namaPengirim + ' (' + emailPengirim + ')\n\nPesan:\n' + pesan
    });

    return { status: 'success', message: 'Pesan berhasil dikirim!' };
  } catch (err) {
    return { status: 'error', message: 'Gagal mengirim: ' + err.message };
  }
}
