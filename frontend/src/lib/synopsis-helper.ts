/**
 * Comprehensive Synopsis Resolution and Fallback Helper
 * Ensures every Anime, Donghua, and Comic has a well-formed, rich, and informative Indonesian synopsis.
 */

// Title / Slug to detailed synopsis map
export const KNOWN_SYNOPSIS_MAP: Record<string, string> = {
  // --- ANIME ---
  'solo-leveling':
    "Di dunia di mana portal 'Gate' menghubungkan bumi dengan dungeon penuh monster buas, para manusia berkekuatan magis yang disebut 'Hunter' bertarung mempertahankan umat manusia. Sung Jin-Woo, seorang Hunter tingkat E terlemah tanpa bakat, terjebak dalam dungeon ganda maut. Setelah pengorbanan mengerikan, ia dianugerahi sebuah 'Sistem' misterius yang hanya dapat dilihat olehnya, memberinya kemampuan untuk naik level tanpa batas dan membangkitkan prajurit bayangan sebagai Shadow Monarch.",
  'solo-leveling-s2':
    "Sung Jin-Woo kini telah bertransformasi dari Hunter terlemah menjadi figur paling disegani di dunia. Dengan pasukan bayangannya yang tak terhitung jumlahnya, ia bersiap menghadapi kemunculan gerbang dungeon raksasa baru dan ancaman keberadaan Monarch kuno yang mengincar kepunahan umat manusia.",
  'jujutsu-kaisen':
    "Yuji Itadori, seorang siswa SMA dengan kemampuan fisik luar biasa, tanpa sengaja menelan jari kutukan Sukuna demi menyelamatkan teman-temannya. Ia terseret ke dalam dunia sihir Jujutsu yang penuh teror kutukan dan harus mengasah teknik kutukannya di SMA Jujutsu Tokyo di bawah bimbingan Satoru Gojo.",
  'jujutsu-kaisen-s3':
    "Pasca-tragedi Insiden Shibuya yang meluluhlantakkan kota Tokyo, Kenjaku memulai rencana terbesarnya dengan menyelenggarakan Culling Game—sebuah ritual pembunuhan massal antar pengguna kutukan kuno dan modern untuk memicu evolusi energi kutukan umat manusia.",
  'frieren':
    "Setelah mengalahkan Raja Iblis dalam petualangan sepuluh tahun, kelompok pahlawan bubar dan kembali ke kehidupan masing-masing. Bagi sang penyihir elf Frieren yang berumur ribuan tahun, sepuluh tahun hanyalah sekejap mata. Setelah kematian Himmel sang pahlawan, Frieren baru menyadari betapa berharganya waktu bersama manusia fana dan memulai perjalanan baru mencari makna kehidupan dan perasaan emosional manusia.",
  'frieren-s2':
    "Penyihir elf Frieren bersama muridnya Fern dan prajurit muda Stark melanjutkan perjalanan panjang menuju bagian utara benua, Ende. Di sepanjang jalan, Frieren terus mengumpulkan sihir-sihir unik dan menghadapi ujian sihir tingkat satu sembari mengenang kebijaksanaan Himmel.",
  'chainsaw-man':
    "Denji, pemuda miskin yang bekerja sebagai pemburu iblis liar demi melunasi hutang ayahnya bersama iblis gergaji kecil Pochita, dikhianati dan dibunuh oleh kelompok yakuza. Pochita mengorbankan diri menjadi jantung Denji, menjadikannya 'Chainsaw Man' manusia gergaji yang bergabung dengan biro keamanan publik Public Safety.",
  'chainsaw-man-reze':
    "Denji bertemu dengan Reze, seorang gadis ceria yang bekerja di kedai kopi dan memperlakukannya dengan hangat. Namun di balik senyum manisnya, Reze adalah agen pembunuh Soviet dengan kekuatan iblis bom (Bomb Devil) yang ditugaskan merebut jantung Chainsaw Man.",
  'demon-slayer':
    "Tanjiro Kamado menemukan seluruh keluarganya dibantai oleh iblis dan adik perempuannya, Nezuko, telah berubah menjadi iblis. Bertekad mengubah Nezuko kembali menjadi manusia dan membalas dendam kepada Muzan Kibutsuji, Tanjiro berlatih teknik Pernapasan Air dan bergabung dengan Korps Pembasmi Iblis.",
  'demon-slayer-infinity-castle':
    "Puncak pertempuran Korps Pembasmi Iblis dimulai saat Muzan Kibutsuji menjebak para Hashira dan Tanjiro ke dalam Kastil Tanpa Batas (Infinity Castle). Pertarungan menentukan tanpa ampun pecah melawan para Iblis Bulan Atas (Upper Moons) demi masa depan umat manusia.",
  'bleach-tybw':
    "Ketenangan Soul Society hancur saat bayangan Wandenreich—kekaisaran Quincy yang dipimpin oleh Yhwach—bangkit kembali dari kegelapan setelah seribu tahun. Ichigo Kurosaki kembali mengangkat Zangetsu untuk menghadapi takdir darahnya.",
  'bleach-tybw-pt3':
    "Yhwach dan pengawal elit Schutzstaffel berhasil menembus Istana Raja Roh. Ichigo Kurosaki bersama para kapten Gotei 13 yang tersisa melancarkan perlawanan pamungkas untuk mencegah keruntuhan tiga dunia.",
  'blue-lock':
    "Setelah kegagalan Jepang di Piala Dunia 2018, Federasi Sepak Bola Jepang mendirikan fasilitas revolusioner bernama 'Blue Lock' yang dipimpin Jinpachi Ego. Tiga ratus penyerang SMA terbaik diisolasi dan diadu dalam seleksi kejam untuk menciptakan satu striker paling egois di dunia.",
  'blue-lock-s2':
    "Proyek Blue Lock mencapai pertaruhan pamungkas: Tim Blue Lock Eleven pilihan Ego harus bertanding melawan Timnas U-20 Jepang. Jika kalah, proyek Blue Lock akan dibubarkan selamanya.",
  'shangri-la-frontier':
    "Rakuro Hizutome adalah maniak penakluk game sampah (trash-tier VR games) yang memutuskan mencoba game VR MMORPG kelas mahakarya terbaik, Shangri-La Frontier, dengan gaya bermain nyeleneh dan refleks bertarung manusia super.",
  'shangri-la-frontier-s2':
    "Sunraku kembali menjelajahi luasnya dunia Shangri-La Frontier bersama teman-teman guildnya, menantang salah satu dari Tujuh Monster Kolosal dan menyingkap tabir rahasia zaman dewa kuno.",
  'tower-of-god':
    "Rachael meninggalkan Baam demi memanjat Menara mistis yang konon mengabulkan segala keinginan. Demi mengejar Rachael, Baam yang tidak memiliki ingatan apa pun menerobos masuk ke Menara sebagai seorang Irregular.",
  'tower-of-god-s2':
    "Tujuh tahun setelah pengkhianatan di lantai ujian, Baam kini hidup dengan identitas baru sebagai Jyu Viole Grace, kandidat pembunuh sekte bayangan FUG yang terjebak dalam intrik Workshop Battle.",
  'kaiju-no-8':
    "Kafka Hibino, pria paruh baya yang bekerja sebagai petugas pembersih bangkai monster, tanpa sengaja menelan parasit kaiju yang memberinya kemampuan berubah menjadi Kaiju No. 8 berkekuatan dahsyat.",
  'kaiju-no-8-s2':
    "Setelah identitasnya sebagai Kaiju No. 8 terungkap di hadapan Pasukan Pertahanan, Kafka harus membuktikan kesetiaannya di medan perang melawan invasi kaiju cerdas berpikiran humanoid.",
  'danmachi':
    "Di kota labirin Orario, Bell Cranel adalah satu-satunya petualang dari Dewi Hestia yang bercita-cita menjadi pahlawan legendaris di Dungeon bawah tanah.",
  'danmachi-s5':
    "Festival Dewi di Orario berubah menjadi kekacauan ketika Dewi Freya melancarkan pesona cinta ilahi yang menguasai seluruh penduduk kota demi mendapatkan Bell Cranel.",
  'oshi-no-ko':
    "Goro, seorang dokter kandungan desa yang menggemari idol jenius Ai Hoshino, bereinkarnasi sebagai anak kembarnya bersama sarari ruby. Ketika tragedi kelam merenggut sang idola, Aqua bersumpah membongkar industri hiburan dan memburu pembunuhnya.",
  'oshi-no-ko-s2':
    "Aqua Hoshino terjun ke panggung teater 2.5D untuk memerankan adaptasi manga 'Tokyo Blade', sembari menggali petunjuk gelap tentang sosok ayah kandungnya yang merencanakan kematian Ai.",
  'wind-breaker':
    "Haruka Sakura datang ke SMA Furin dengan reputasi sebagai petarung tangguh yang ingin berada di puncak rantai makanan sekolah berandalan. Namun ia terkejut mendapati para murid Furin adalah pelindung kota yang dicintai masyarakat.",
  'one-piece':
    "Monkey D. Luffy bersama kru Bajak Laut Topi Jerami terus mengarungi Grand Line demi menemukan harta karun legendaris One Piece dan mewujudkan impiannya menjadi Raja Bajak Laut.",
  'my-hero-academia':
    "Izuku Midoriya, anak tanpa bakat (Quirk) di dunia di mana hampir semua orang memiliki kekuatan super, mewarisi kekuatan One For All dari All Might dan bersekolah di SMA U.A. untuk menjadi pahlawan nomor satu.",
  'my-hero-academia-s7':
    "Pertempuran final antara kubu Pahlawan dan Front Pembebasan Paranormal pecah. Deku bersama rekan-rekan sekelasnya mengerahkan seluruh sisa kekuatan demi menundukkan All For One dan Shigaraki Tomura.",
  're-zero':
    "Subaru Natsuki tiba-tiba terlempar ke dunia fantasi tanpa kekuatan magis apa pun selain 'Return by Death'—kemampuan mengulang waktu setiap kali ia tewas mengenaskan demi menyelamatkan orang-orang yang ia cintai.",
  're-zero-s3':
    "Subaru dan Emilia mengunjungi kota air Priestella atas undangan calon penguasa lain, namun para Uskup Agung Dosa Besar melancarkan teror serentak yang menuntut strategi bertahan hidup terbaik Subaru.",
  'mushoku-tensei':
    "Seorang pria pengangguran 34 tahun tewas tertabrak truk dan bereinkarnasi ke dunia sihir sebagai Rudeus Greyrat. Bertekad menjalani hidup keduanya tanpa penyesalan, ia belajar sihir sejak kecil dan menjadi penyihir berbakat luar biasa.",
  'mushoku-tensei-s2':
    "Rudeus memasuki kehidupan kampus di Akademi Sihir Ranoa, memulihkan trauma masa lalunya sembari membangun masa depan bersama Sylphiette dan menyelidiki fenomena Bencana Teleportasi.",
  'tensei-shitara-slime':
    "Satoru Mikami ditusuk penjahat di jalanan Tokyo dan bereinkarnasi di gua dunia lain sebagai slime bernama Rimuru Tempest yang memiliki skill predator pemangsa segalanya.",
  'tensei-shitara-slime-s3':
    "Rimuru memperluas pengaruh Federasi Jura Tempest dengan menyelenggarakan festival pembukaan megah, seraya menghadapi manuver diplomatik dari Raja Iblis lain dan Kekaisaran Lubelius.",
  'eminence-in-shadow':
    "Cid Kagenou bereinkarnasi ke dunia magis dan mendirikan organisasi bayangan fiktif 'Shadow Garden' demi memuaskan fantasinya menjadi dalang di balik layar—tanpa ia sadari, organisasi musuh yang ia karang ternyata benar-benar ada.",
  'eminence-in-shadow-movie':
    "Shadow dan para gadis Shadow Garden menjelajahi distrik kuno yang menyimpan rahasia kultus Diablos, memicu pertunjukan kekuatan spektakuler penuh kesalahpahaman komedi dan laga memukau.",
  'black-clover':
    "Asta, anak yatim piatu tanpa kekuatan sihir di dunia di mana sihir adalah segalanya, memperoleh Grimoire Semanggi Daun Lima dengan pedang Anti-Sihir dan bersumpah menjadi Kaisar Sihir.",
  'black-clover-spade':
    "Asta bersama Banteng Hitam menyerbu Kerajaan Spade untuk menyelamatkan Kapten Yami dan Vangeance dari cengkeraman Dark Triad sebelum ritual pohon Qliphoth memanggil iblis ke dunia nyata.",
  'dr-stone':
    "Ribuan tahun setelah seluruh umat manusia berubah menjadi batu oleh kilatan cahaya misterius, Senku Ishigami bangkit dan bertekad membangun kembali peradaban modern dari nol menggunakan kekuatan sains.",
  'dr-stone-science-future':
    "Kerajaan Sains Senku membangun roket luar angkasa pertama untuk mendarat di permukaan bulan dan berhadapan langsung dengan dalang pembatuan umat manusia, Why-Man.",
  'vinland-saga':
    "Thorfinn tumbuh di medan perang bangsa Viking demi membalas dendam kepada Askeladd yang membunuh ayahnya, sebelum akhirnya menemukan jalan penebusan dosa dan makna sejati seorang pejuang tanpa pedang.",
  'vinland-saga-s3':
    "Thorfinn dan rekannya berlayar ke Konstantinopel dalam Ekspedisi Timur demi menghimpun modal membangun koloni damai bebas perbudakan di tanah harapan bernama Vinland.",
  'hells-paradise':
    "Gabimaru si Hampa, ninja pembunuh bayaran abadi yang divonis mati, dikirim ke pulau surga Shinsenkyo bersama eksekutor Sagiri untuk mencari Eliksir Keabadian demi pengampunan kaisar.",
  'hells-paradise-s2':
    "Di tengah teror monster Tao dan penguasa dewa abadi Lord Tensen, Gabimaru harus melampaui batas fisiknya dan bekerja sama dengan para tahanan lain demi kembali ke pelukan istrinya.",
  'kingdom':
    "Di era Zaman Negara-Negara Berperang di Tiongkok kuno, Shin adalah anak yatim budak perang yang bermimpi menjadi Jenderal Terbesar di Bawah Langit bersama sahabatnya yang mirip dengan Raja muda Ying Zheng.",
  'kingdom-s6':
    "Unit Hi Shin menjadi ujung tombak pasukan ekspedisi Qin dalam kampanye penaklukan benteng barat Zhao di bawah komando jenius Jenderal Ousen.",

  // --- DONGHUA ---
  'perfect-world':
    "Dilahirkan di dunia unik di mana suku-suku kuno berjuang melawan binatang buas raksasa, Shi Hao adalah anak ajaib yang dianugerahi Tulang Tertinggi oleh surga. Namun takdirnya dirampas oleh kerabat dekatnya sendiri dan ia ditinggalkan sekarat di Desa Batu terpencil. Berkat bimbingan Roh Dedalu Willow kuno, ia bangkit kembali menapaki jalan kultivasi pantang menyerah menantang para penguasa alam semesta.",
  'soul-land-2':
    "Sepuluh ribu tahun setelah berdirinya legenda Tang San, Sekte Tang di Benua Douluo telah mengalami kemunduran drastis. Huo Yuhao, seorang pemuda yang membawa Martial Soul mutasi Mata Roh, bertekad bangkit dari kemiskinan dan memasuki Shrek Academy untuk menghidupkan kembali kejayaan Sekte Tang.",
  'btth':
    "Xiao Yan, pemuda jenius yang pernah mengalami masa kelam kehilangan kekuatan Dou Qi-nya selama tiga tahun dan dihina oleh tunangannya, bangkit kembali berkat bimbingan roh guru Yao Lao. Dengan menguasai Seni Api Surgawi (Heavenly Flames), ia menaklukkan Dataran Dou Qi dan membalas dendam klannya.",
  'swallowed-star':
    "Bumi masa depan dilanda bencana virus mutan RR yang melahirkan jutaan binatang buas mengerikan. Luo Feng berlatih keras mengasah kemampuan fisiknya hingga berhasil menjadi pejuang terkuat, menembus atmosfer bumi, dan menjelajah galaksi semesta yang tanpa batas.",
  'renegade-immortal':
    "Wang Lin, seorang pemuda desa biasa tanpa bakat spiritual alami, secara kebetulan menemukan manik pembangkang surga Tian Ni. Dengan tekad baja, kehati-hatian luar biasa, dan kepribadian tegas berdarah dingin, ia menapaki jalan kultivasi berdarah demi mencapai keabadian sejati.",
  'a-will-eternal':
    "Bai Xiaochun adalah pemuda kocak yang sangat pengecut dan takut mati. Impian terbesarnya hanyalah hidup abadi dalam kedamaian. Namun takdir berkata lain; setiap kali ia berusaha bertindak hati-hati, aksi konyolnya justru selalu memicu malapetaka heboh di sekte kultivasinya.",
  'shrouding-the-heavens':
    "Sembilan naga raksasa menarik peti perunggu purba melintasi tata surya dan mendarat di puncak Gunung Tai. Ye Fan dan rekan-rekannya tersedot ke dalamnya dan terdampar di dunia kultivasi kuno Big Dipper yang penuh misteri para kaisar agung masa lalu.",
  'martial-universe':
    "Lin Dong menemukan jimat batu misterius di sebuah gua terpencil yang mampu menyempurnakan seni bela diri tingkat tinggi. Dari seorang anak keluarga cabang terasing, ia bangkit melindungi keluarganya dan menyingkap rahasia ancaman Iblis Kuno Yimo.",
  'stellar-transformation':
    "Qin Yu terlahir dengan kondisi fisik meridian yang cacat sehingga tidak bisa melatih energi internal. Mengandalkan latihan fisik ekstrem tanpa henti dan Kristal Meteorik Air Mata Luar Angkasa, ia membuka jalur kultivasi transformasional menuju puncak tertinggi alam dewa.",
  'rmji':
    "Han Li, anak desa miskin dan penuh kehati-hatian, menembus dunia persilatan kultivasi berbekal botol kecil penghasil embun penumbuh tanaman herbal langka. Selalu bersikap waspada dan memprioritaskan keselamatan diri, ia bertahan hidup di antara intrik para kultivator licik.",
  'jade-dynasty':
    "Zhang Xiaofan selamat dari tragedi pembantaian massal di Desa Caomiao dan diterima menjadi murid Sekte Dazhufeng. Takdir mempertemukannya dengan Tongkat Pemakan Jiwa dan hubungan emosional rumit yang menjerumuskannya ke dalam konflik abadi antara jalan lurus dan sekte sesat.",
  'against-the-gods':
    "Yun Che yang terpojok di tebing keputusasaan menelan Mutiara Racun Langit dan bereinkarnasi dengan membawa garis keturunan Dewa Jahat, bersumpah membalikkan langit dan membalaskan dendam masa lalunya dengan kekuatan mutlak.",
  'big-brother':
    "Li Changshou bereinkarnasi ke zaman purba menjelang Perang Pengangkatan Dewa. Memegang prinsip kehati-hatian ekstrem dan tidak pernah memamerkan kekuatannya lebih dari 10%, ia merancang strategi tanpa celah di balik layar demi melindungi diri dan sektenya.",
  'apotheosis':
    "Luo Zheng dijadikan samsak manusia setelah kejatuhan keluarga bangsawan Luo. Di ambang kematian, ia menemukan kitab rahasia kuno yang mengubah tubuhnya menjadi wadah senjata ilahi abadi, memulai perjuangan merebut tahta dewa tertinggi.",
  'tales-of-demons-and-gods':
    "Nie Li yang gugur dalam pertempuran terakhir melawan Kaisar Bijak terlahir kembali ke masa mudanya saat Kota Glory masih utuh. Berbekal ingatan masa depan dari Buku Roh Iblis Ruang dan Waktu, ia bertekad melindungi kota dan orang-orang yang dicintainya.",
  'the-kings-avatar':
    "Dewa game profesional Ye Xiu diusir secara paksa dari timnya di game Glory dan bekerja sebagai penjaga shift malam di warung internet. Dengan senjata buatannya sendiri Payung Seribu Peluang, ia memulai kembali perjalanannya dari server baru menuju puncak kejayaan esports.",

  // --- COMICS ---
  'revenge-iron-blooded-sword-hound':
    "Anjing pemburu keluarga Baskerville, Vikir, setia menjalankan misi kotor namun berakhir dieksekusi di atas guillotine karena pengkhianatan tuannya. Secara ajaib kembali ke masa 40 tahun lalu sebagai bayi, kini saatnya sang anjing pemburu menancapkan taring pembalasan dendamnya.",
  'omniscient-reader-viewpoint':
    "Kim Dokja adalah satu-satunya pembaca setia yang menyelesaikan novel web apokaliptik 'Tiga Cara Bertahan Hidup di Dunia Hancur'. Tepat saat bab terakhir selesai dibaca, dunia novel tersebut seketika menjadi kenyataan. Hanya Dokja yang mengetahui akhir dari takdir dunia ini.",
  'the-beginning-after-the-end':
    "Raja Grey yang memiliki kekuatan, kekayaan, dan prestise tak tertandingi di dunia militer meninggal dalam kesepian. Ia bereinkarnasi ke dunia magis baru yang penuh monster sebagai Arthur Leywin, bertekad memperbaiki kesalahan masa lalunya dan melindungi orang-orang yang ia sayangi.",
  'magic-emperor':
    "Zhuo Yifan, sang Kaisar Iblis tertinggi yang menguasai Kitab Rahasia Sembilan Nether, dikhianati oleh murid kesayangannya. Jiwanya merasuki tubuh pelayan lumpuh keluarga bangsawan Luo yang berada di ambang kehancuran, memulai kebangkitan kaisar iblis yang tak terbendung.",
};

/**
 * Normalizes title or slug to match key in KNOWN_SYNOPSIS_MAP
 */
function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Resolves a high quality synopsis for any title.
 * Guarantee: never returns empty string or "Belum ada sinopsis".
 */
export function getResolvedSynopsis(
  title: string,
  type: 'anime' | 'donghua' | 'comic' | 'komik' = 'anime',
  existingSynopsis?: string | null,
  genres?: string[] | Array<{ name: string; slug: string }>,
  status?: string
): string {
  // 1. If valid existing synopsis is provided and meaningful (> 25 characters and not standard placeholder)
  if (existingSynopsis && typeof existingSynopsis === 'string') {
    const cleaned = existingSynopsis.replace(/<[^>]*>/g, '').trim();
    const isPlaceholder =
      cleaned.toLowerCase().includes('belum ada sinopsis') ||
      cleaned.toLowerCase().includes('tidak ada deskripsi') ||
      cleaned.toLowerCase().includes('no synopsis') ||
      cleaned.length < 25;

    if (!isPlaceholder) {
      return cleaned;
    }
  }

  // 2. Try matching against KNOWN_SYNOPSIS_MAP by title / slug key
  const cleanTitle = title || '';
  const titleKey = normalizeKey(cleanTitle);

  for (const [key, text] of Object.entries(KNOWN_SYNOPSIS_MAP)) {
    if (
      titleKey === key ||
      titleKey.startsWith(key) ||
      key.startsWith(titleKey) ||
      cleanTitle.toLowerCase().includes(key.replace(/-/g, ' '))
    ) {
      return text;
    }
  }

  // 3. Extract formatted genre string if available
  const genreList: string[] = Array.isArray(genres)
    ? genres
        .map((g: any) => (typeof g === 'string' ? g : g.name || g.title || ''))
        .filter(Boolean)
    : [];
  const genreStr = genreList.slice(0, 3).join(', ');

  // 4. Generate high-quality contextual Indonesian synopsis
  if (type === 'donghua') {
    return `${cleanTitle} merupakan serial animasi donghua 3D ${
      genreStr ? `bergenre ${genreStr}` : 'bertema kultivasi spiritual dan aksi petualangan'
    } yang menyuguhkan visual memukau dan koreografi pertarungan magis intens. Serial ini mengikuti perjalanan sang tokoh utama melampaui batas meridian kekuatannya, menaklukkan sekte-sekte kuat, dan menapaki puncak semesta kultivasi demi menegakkan kehormatannya.`;
  }

  if (type === 'comic' || type === 'komik') {
    return `${cleanTitle} menceritakan kisah epik ${
      genreStr ? `bergenre ${genreStr}` : 'penuh aksi, strategi, dan petualangan memikat'
    } yang mengikuti perjuangan sang karakter utama dalam menghadapi rintangan mematikan dan musuh-musuh berbahaya. Saksikan bagaimana tekad kuat dan kecerdikannya membalikkan keadaan di setiap pertempuran demi meraih tujuan terbesarnya.`;
  }

  // Default: Anime
  return `${cleanTitle} adalah serial anime ${
    genreStr ? `bergenre ${genreStr}` : 'populer'
  } ${status ? `yang saat ini berstatus ${status}` : ''} dengan alur cerita mendalam dan penuh intrik menegangkan. Ikuti kisah perjalanan para karakter utama dalam menghadapi tantangan berat, mengasah kemampuan istimewa mereka, dan mengungkap misteri dunia di setiap episodenya.`;
}
