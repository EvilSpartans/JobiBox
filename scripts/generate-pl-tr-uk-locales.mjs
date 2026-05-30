import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '../src/locales');

function deepTranslate(obj, map) {
  if (typeof obj === 'string') {
    return map[obj] ?? obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepTranslate(item, map));
  }
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = deepTranslate(v, map);
    }
    return out;
  }
  return obj;
}

const frToPl = {
  'Génération intelligente de CV': 'Inteligentne generowanie CV',
  'CV papier': 'CV papierowe',
  "Crée un CV professionnel, structuré et prêt à l'emploi, généré automatiquement par l'IA en":
    'Stwórz profesjonalne, uporządkowane CV gotowe do użycia, wygenerowane automatycznie przez AI w',
  '5 minutes environ': 'około 5 minut',
  'LES ÉTAPES QUE TU VAS RETROUVER': 'KROKI, KTÓRE PRZED TOBĄ',
  "Commencer l'expérience": 'Rozpocznij',
  'Ton CV sera sauvegardé et accessible à tout moment dans ton espace privé Jobissim.':
    'Twoje CV zostanie zapisane i będzie dostępne w każdej chwili w Twojej przestrzeni Jobissim.',
  Personnalisation: 'Personalizacja',
  'Choix du titre, du design et de la couleur de ton CV':
    'Wybór tytułu, szablonu i koloru CV',
  'Profil candidat': 'Profil kandydata',
  'Informations personnelles et type de contrat recherché':
    'Dane osobowe i poszukiwany typ umowy',
  "Centre d'intérêt & autres": 'Zainteresowania i inne',
  "Centres d'intérêt, réseaux sociaux, permis et informations complémentaires":
    'Zainteresowania, media społecznościowe, prawo jazdy i dodatkowe informacje',
  'Compétences & langues': 'Umiejętności i języki',
  'Sélection de tes skills et langues clés': 'Wybór kluczowych umiejętności i języków',
  'Génération intelligente': 'Inteligentne generowanie',
  "L'IA génère automatiquement ta présentation, tes expériences et formations":
    'AI automatycznie generuje prezentację, doświadczenie i wykształcenie',
  Finalisation: 'Finalizacja',
  'Ajout de la photo, du CV vidéo et validation du CV papier':
    'Dodanie zdjęcia, CV wideo i zatwierdzenie CV',
  'Titre du CV': 'Tytuł CV',
  'Ex : Développeur Full Stack': 'Np.: Full Stack Developer',
  'Choisis un design': 'Wybierz szablon',
  Sélectionné: 'Wybrano',
  'Couleur principale du CV': 'Główny kolor CV',
  'Choisir une couleur': 'Wybierz kolor',
  'Code personnalisé (ex. #f23ff0)': 'Kod własny (np. #f23ff0)',
  'Couleurs prédéfinies': 'Kolory predefiniowane',
  Valider: 'Zatwierdź',
  'Chargement des options de ton organisme…': 'Ładowanie opcji organizacji…',
  'Nom *': 'Nazwisko *',
  'Prénom *': 'Imię *',
  'Email *': 'E-mail *',
  Téléphone: 'Telefon',
  Adresse: 'Adres',
  'Site web (facultatif)': 'Strona www (opcjonalnie)',
  'Âge (facultatif)': 'Wiek (opcjonalnie)',
  'Type de contrat recherché *': 'Poszukiwany typ umowy *',
  "Durée de l'alternance": 'Czas trwania alternacji',
  'Date de début': 'Data rozpoczęcia',
  Permis: 'Prawo jazdy',
  'Langues parlées': 'Języki',
  'Choisis une langue puis son niveau (5 maximum).':
    'Wybierz język i poziom (maks. 5).',
  'Choisir une langue': 'Wybierz język',
  Niveau: 'Poziom',
  'Aucune langue sélectionnée pour le moment': 'Nie wybrano języka',
  'Savoir-faire': 'Umiejętności twarde',
  'Savoir-être': 'Umiejętności miękkie',
  "Domaine + jusqu'à 6 compétences techniques.":
    'Dziedzina + do 6 umiejętności technicznych.',
  "Sélectionne jusqu'à 6 qualités humaines.":
    'Wybierz do 6 cech osobowych.',
  "Choisir un domaine d'activité": 'Wybierz branżę',
  'Compétence personnalisée': 'Własna umiejętność',
  'Sélectionne un domaine pour voir les compétences':
    'Wybierz branżę, aby zobaczyć umiejętności',
  'Rechercher ou ajouter un savoir-être': 'Szukaj lub dodaj umiejętność miękką',
  Propositions: 'Propozycje',
  Sélection: 'Wybór',
  'Aucune proposition trouvée': 'Brak propozycji',
  'Aucun savoir-être sélectionné': 'Nie wybrano umiejętności miękkich',
  'Supprimer la langue': 'Usuń język',
  'Supprimer le savoir-être': 'Usuń umiejętność',
  Supprimer: 'Usuń',
  Étape: 'Krok',
  'Présente-toi': 'Przedstaw się',
  'Formations & parcours scolaire': 'Wykształcenie',
  'Expériences professionnelles': 'Doświadczenie zawodowe',
  'Qui es-tu ?': 'Kim jesteś?',
  'Ton parcours académique': 'Twoja ścieżka edukacyjna',
  'Ton expérience terrain': 'Twoje doświadczenie zawodowe',
  'Exemple de réponse :': 'Przykład odpowiedzi:',
  'Présente-toi librement en quelques phrases. Dis qui tu es, ce que tu recherches et ce qui te motive.':
    'Przedstaw się w kilku zdaniach. Kim jesteś, czego szukasz i co Cię motywuje.',
  "Parle de tes formations, diplômes ou apprentissages. Précise le nom de l'établissement, la période et ce que tu as appris.":
    'Opisz wykształcenie, dyplomy lub kursy. Podaj placówkę, okres i czego się nauczyłeś.',
  'Parle de tes expériences professionnelles : où tu as travaillé, la période et ce que tu faisais concrètement.':
    'Opisz doświadczenie: gdzie pracowałeś, kiedy i co robiłeś.',
  "Je m'appelle Lucie, je recherche un poste dans le commerce sur Paris et ses alentours. Dynamique, souriante et à l'aise avec le contact client, j'aime conseiller, vendre et contribuer à une bonne expérience en magasin.":
    'Nazywam się Lucie, szukam pracy w handlu w Paryżu i okolicach. Jestem dynamiczna, uśmiechnięta i lubię kontakt z klientem.',
  "J'ai suivi une formation en commerce à [nom de l'établissement] entre 2008 et 2010. J'y ai appris à accueillir et conseiller les clients, à mettre les produits en valeur et à maîtriser les bases de la vente.":
    'Ukończyłam szkolenie handlowe w [nazwa placówki] w latach 2008–2010. Nauczyłam się obsługi klienta i podstaw sprzedaży.',
  "J'ai travaillé comme vendeuse chez [nom de l'entreprise] de 2018 à 2022. J'y accueillais les clients, je les conseillais dans leurs achats et je m'occupais de la mise en rayon. Cette expérience m'a permis de renforcer mon sens du contact, de la vente et du service client.":
    'Pracowałam jako sprzedawczyni w [nazwa firmy] od 2018 do 2022. Obsługiwałam klientów i dbałam o ekspozycję produktów.',
  Parler: 'Mów',
  Écrire: 'Pisz',
  Envoyer: 'Wyślij',
  'Décrivez votre parcours, vos formations, vos expériences...':
    'Opisz swoją ścieżkę, wykształcenie i doświadczenie...',
  'Parlez ou écrivez naturellement': 'Mów lub pisz naturalnie',
  "Répondez oralement ou par écrit. L'IA structure automatiquement votre CV.":
    'Odpowiedz ustnie lub na piśmie. AI automatycznie ustrukturyzuje CV.',
  "Recommencer l'enregistrement": 'Nagraj ponownie',
  'Saisir un autre texte': 'Wpisz inny tekst',
  'Cliquez pour enregistrer': 'Kliknij, aby nagrać',
  'Résultat de la transcription (éditable)': 'Wynik transkrypcji (edytowalny)',
  "Démarrer l'enregistrement": 'Rozpocznij nagrywanie',
  Arrêter: 'Zatrzymaj',
  'Étape suivante': 'Następny krok',
  'Générer mon CV': 'Wygeneruj moje CV',
  'Ta présentation :': 'Twoja prezentacja:',
  'Tes formations': 'Twoje wykształcenie',
  'Tes expériences :': 'Twoje doświadczenie:',
  'Clique pour éditer': 'Kliknij, aby edytować',
  'Modifier la formation': 'Edytuj wykształcenie',
  "Modifier l'expérience": 'Edytuj doświadczenie',
  'Formation sans titre': 'Wykształcenie bez tytułu',
  'Expérience sans titre': 'Doświadczenie bez tytułu',
  'Enregistrement...': 'Zapisywanie...',
  Attention: 'Uwaga',
  "Cette action va remplacer l'enregistrement existant pour cette étape. Souhaites-tu continuer ?":
    'Ta akcja zastąpi istniejące nagranie dla tego kroku. Kontynuować?',
  Annuler: 'Anuluj',
  Remplacer: 'Zastąp',
  'Félicitations !': 'Gratulacje!',
  'Ton CV est prêt. Tu peux ajouter une photo et un CV vidéo.':
    'Twoje CV jest gotowe. Możesz dodać zdjęcie i CV wideo.',
  'Photo & CV vidéo': 'Zdjęcie i CV wideo',
  'Ajouter une photo de profil et lier un CV vidéo':
    'Dodaj zdjęcie profilowe i powiąż CV wideo',
  'Scanne le QR code pour récupérer ton CV. Il reste disponible à tout moment dans ton espace privé sur':
    'Zeskanuj kod QR, aby pobrać CV. Pozostaje dostępne w Twojej przestrzeni na',
  'Clique pour voir le CV': 'Kliknij, aby zobaczyć CV',
  "Retour à l'accueil": 'Powrót do strony głównej',
  'Photo de profil': 'Zdjęcie profilowe',
  'CV vidéo': 'CV wideo',
  'Sélectionner un CV vidéo': 'Wybierz CV wideo',
  'Aucun CV vidéo disponible': 'Brak CV wideo',
  'Ce CV vidéo sera accessible via le QR code du CV.':
    'To CV wideo będzie dostępne przez kod QR CV.',
  "Veux-tu vraiment revenir à l'accueil ?":
    'Czy na pewno wrócić do strony głównej?',
  'Tu pourras toujours éditer ton CV depuis le site Jobissim.':
    'Zawsze możesz edytować CV na stronie Jobissim.',
  'Mode ATS (compatible logiciels de recrutement)':
    'Tryb ATS (zgodny z oprogramowaniem rekrutacyjnym)',
  'Mode anonyme': 'Tryb anonimowy',
  'Prévisualisation en mode ATS — rendu simplifié':
    'Podgląd w trybie ATS — uproszczony widok',
  'Traduire et sauvegarder': 'Przetłumacz i zapisz',
  'Traduction du CV': 'Tłumaczenie CV',
  'Sélectionner une langue': 'Wybierz język',
  'CV traduit et sauvegardé': 'CV przetłumaczone i zapisane',
  'La traduction a échoué, veuillez réessayer.':
    'Tłumaczenie nie powiodło się, spróbuj ponownie.',
  'Analyser mon CV': 'Analizuj moje CV',
  'Analyse du CV': 'Analiza CV',
  'Voir les résultats': 'Zobacz wyniki',
  'Analyse en cours…': 'Analiza w toku…',
  'Génération du PDF en cours…': 'Generowanie PDF…',
  "Le PDF n'est pas encore disponible.": 'PDF nie jest jeszcze dostępny.',
  "L'analyse a échoué. Veuillez réessayer.":
    'Analiza nie powiodła się. Spróbuj ponownie.',
  Réessayer: 'Spróbuj ponownie',
  'Nouvelle analyse': 'Nowa analiza',
  Résumé: 'Podsumowanie',
  'Points forts': 'Mocne strony',
  'Améliorations suggérées': 'Sugerowane ulepszenia',
  'Impossible de récupérer le PDF du CV.':
    'Nie można pobrać PDF CV.',
  'Créer ma photo de CV': 'Utwórz zdjęcie do CV',
  'Créer ma photo CV vidéo': 'Utwórz miniaturę CV wideo',
  'Cette photo sera utilisée sur votre CV papier.':
    'To zdjęcie będzie na CV papierowym.',
  'Cette image sera affichée comme miniature de votre vidéo.':
    'Ten obraz będzie miniaturą wideo.',
  "Centre d'intérêts": 'Zainteresowania',
  'Ajoute tes hobbies et passions (5 maximum).':
    'Dodaj hobby i pasje (maks. 5).',
  'Ex : Lecture, randonnée, musique...':
    'Np.: czytanie, wędrówki, muzyka...',
  "Aucun centre d'intérêt ajouté": 'Brak zainteresowań',
  'Aucun réseau social ajouté': 'Brak mediów społecznościowych',
  'Réseaux sociaux': 'Media społecznościowe',
  'Plateforme et URL (5 maximum).': 'Platforma i URL (maks. 5).',
  'Plateforme (ex. LinkedIn)': 'Platforma (np. LinkedIn)',
  'Limite atteinte ({{max}}/{{max}})': 'Limit osiągnięty ({{max}}/{{max}})',
  Autre: 'Inne',
  'Informations complémentaires...': 'Dodatkowe informacje...',
  Déconnexion: 'Wyloguj',
  'Veux-tu vraiment te déconnecter ?': 'Czy na pewno się wylogować?',
  Français: 'Francuski',
  Anglais: 'Angielski',
  Espagnol: 'Hiszpański',
  Allemand: 'Niemiecki',
  Italien: 'Włoski',
  Portugais: 'Portugalski',
  Arabe: 'Arabski',
  Roumain: 'Rumuński',
  Dari: 'Dari',
  Pachto: 'Paszto',
  Polonais: 'Polski',
  Turc: 'Turecki',
  Ukrainien: 'Ukraiński',
};

const plToTr = Object.fromEntries(
  Object.entries({
    'Inteligentne generowanie CV': 'Akıllı CV oluşturma',
    'CV papierowe': 'Kağıt CV',
    'Stwórz profesjonalne, uporządkowane CV gotowe do użycia, wygenerowane automatycznie przez AI w':
      'Yapay zeka ile otomatik oluşturulan profesyonel, yapılandırılmış bir CV oluşturun',
    'około 5 minut': 'yaklaşık 5 dakika',
    'KROKI, KTÓRE PRZED TOBĄ': 'İZLEYECEĞİNİZ ADIMLAR',
    Rozpocznij: 'Deneyime başla',
    'Twoje CV zostanie zapisane i będzie dostępne w każdej chwili w Twojej przestrzeni Jobissim.':
      'CV\'niz kaydedilir ve Jobissim alanınızda her zaman erişilebilir olur.',
    Personalizacja: 'Kişiselleştirme',
    'Wybór tytułu, szablonu i koloru CV': 'CV başlığı, tasarımı ve rengini seçin',
    'Profil kandydata': 'Aday profili',
    'Dane osobowe i poszukiwany typ umowy': 'Kişisel bilgiler ve aranan sözleşme türü',
    'Zainteresowania i inne': 'İlgi alanları ve diğer',
    'Zainteresowania, media społecznościowe, prawo jazdy i dodatkowe informacje':
      'İlgi alanları, sosyal ağlar, ehliyet ve ek bilgiler',
    'Umiejętności i języki': 'Beceriler ve diller',
    'Wybór kluczowych umiejętności i języków': 'Temel beceri ve dillerin seçimi',
    'Inteligentne generowanie': 'Akıllı oluşturma',
    'AI automatycznie generuje prezentację, doświadczenie i wykształcenie':
      'Yapay zeka sunumunuzu, deneyimlerinizi ve eğitiminizi otomatik oluşturur',
    Finalizacja: 'Sonlandırma',
    'Dodanie zdjęcia, CV wideo i zatwierdzenie CV':
      'Foto, video CV ekleme ve CV onayı',
    'Tytuł CV': 'CV başlığı',
    'Np.: Full Stack Developer': 'Örn: Full Stack Geliştirici',
    'Wybierz szablon': 'Bir tasarım seçin',
    Wybrano: 'Seçildi',
    'Główny kolor CV': 'Ana CV rengi',
    'Wybierz kolor': 'Renk seç',
    'Kod własny (np. #f23ff0)': 'Özel kod (örn. #f23ff0)',
    'Kolory predefiniowane': 'Önceden tanımlı renkler',
    Zatwierdź: 'Onayla',
    'Ładowanie opcji organizacji…': 'Kurum seçenekleri yükleniyor…',
    'Nazwisko *': 'Soyad *',
    'Imię *': 'Ad *',
    'E-mail *': 'E-posta *',
    Telefon: 'Telefon',
    Adres: 'Adres',
    'Strona www (opcjonalnie)': 'Web sitesi (isteğe bağlı)',
    'Wiek (opcjonalnie)': 'Yaş (isteğe bağlı)',
    'Poszukiwany typ umowy *': 'Aranan sözleşme türü *',
    'Czas trwania alternacji': 'Staj süresi',
    'Data rozpoczęcia': 'Başlangıç tarihi',
    'Prawo jazdy': 'Ehliyet',
    Języki: 'Konuşulan diller',
    'Wybierz język i poziom (maks. 5).': 'Bir dil ve seviye seçin (en fazla 5).',
    'Wybierz język': 'Dil seç',
    Poziom: 'Seviye',
    'Nie wybrano języka': 'Henüz dil seçilmedi',
    'Umiejętności twarde': 'Teknik beceriler',
    'Umiejętności miękkie': 'Kişisel beceriler',
    'Dziedzina + do 6 umiejętności technicznych.': 'Alan + en fazla 6 teknik beceri.',
    'Wybierz do 6 cech osobowych.': 'En fazla 6 kişisel nitelik seçin.',
    'Wybierz branżę': 'Faaliyet alanı seç',
    'Własna umiejętność': 'Özel beceri',
    'Wybierz branżę, aby zobaczyć umiejętności': 'Becerileri görmek için alan seçin',
    'Szukaj lub dodaj umiejętność miękką': 'Kişisel beceri ara veya ekle',
    Propozycje: 'Öneriler',
    Wybór: 'Seçim',
    'Brak propozycji': 'Öneri bulunamadı',
    'Nie wybrano umiejętności miękkich': 'Kişisel beceri seçilmedi',
    'Usuń język': 'Dili sil',
    'Usuń umiejętność': 'Beceriyi sil',
    Usuń: 'Sil',
    Krok: 'Adım',
    'Przedstaw się': 'Kendini tanıt',
    Wykształcenie: 'Eğitim',
    'Doświadczenie zawodowe': 'İş deneyimi',
    'Kim jesteś?': 'Sen kimsin?',
    'Twoja ścieżka edukacyjna': 'Akademik geçmişin',
    'Twoje doświadczenie zawodowe': 'Saha deneyimin',
    'Przykład odpowiedzi:': 'Örnek cevap:',
    'Parler': 'Konuş',
    'Pisz': 'Yaz',
    Wyślij: 'Gönder',
    'Opisz swoją ścieżkę, wykształcenie i doświadczenie...':
      'Geçmişinizi, eğitiminizi ve deneyimlerinizi anlatın...',
    'Mów lub pisz naturalnie': 'Doğal konuşun veya yazın',
    'Odpowiedz ustnie lub na piśmie. AI automatycznie ustrukturyzuje CV.':
      'Sözlü veya yazılı yanıtlayın. Yapay zeka CV\'nizi otomatik yapılandırır.',
    'Nagraj ponownie': 'Kaydı yeniden başlat',
    'Wpisz inny tekst': 'Farklı metin gir',
    'Kliknij, aby nagrać': 'Kaydetmek için tıklayın',
    'Wynik transkrypcji (edytowalny)': 'Transkripsiyon sonucu (düzenlenebilir)',
    'Rozpocznij nagrywanie': 'Kaydı başlat',
    Zatrzymaj: 'Durdur',
    'Następny krok': 'Sonraki adım',
    'Wygeneruj moje CV': 'CV\'mi oluştur',
    'Twoja prezentacja:': 'Sunumunuz:',
    'Twoje wykształcenie': 'Eğitiminiz',
    'Twoje doświadczenie:': 'Deneyimleriniz:',
    'Kliknij, aby edytować': 'Düzenlemek için tıklayın',
    'Edytuj wykształcenie': 'Eğitimi düzenle',
    'Edytuj doświadczenie': 'Deneyimi düzenle',
    'Wykształcenie bez tytułu': 'Başlıksız eğitim',
    'Doświadczenie bez tytułu': 'Başlıksız deneyim',
    Zapisywanie: 'Kaydediliyor...',
    Uwaga: 'Dikkat',
    'Ta akcja zastąpi istniejące nagranie dla tego kroku. Kontynuować?':
      'Bu işlem bu adım için mevcut kaydı değiştirir. Devam?',
    Anuluj: 'İptal',
    Zastąp: 'Değiştir',
    Gratulacje: 'Tebrikler!',
    'Twoje CV jest gotowe. Możesz dodać zdjęcie i CV wideo.':
      'CV\'niz hazır. Foto ve video CV ekleyebilirsiniz.',
    'Zdjęcie i CV wideo': 'Foto ve video CV',
    'Dodaj zdjęcie profilowe i powiąż CV wideo':
      'Profil fotoğrafı ekleyin ve video CV bağlayın',
    'Zeskanuj kod QR, aby pobrać CV. Pozostaje dostępne w Twojej przestrzeni na':
      'CV\'nizi almak için QR kodu tarayın. Jobissim alanınızda her zaman erişilebilir',
    'Kliknij, aby zobaczyć CV': 'CV\'yi görmek için tıklayın',
    'Powrót do strony głównej': 'Ana sayfaya dön',
    'Zdjęcie profilowe': 'Profil fotoğrafı',
    'CV wideo': 'Video CV',
    'Wybierz CV wideo': 'Video CV seç',
    'Brak CV wideo': 'Video CV yok',
    'To CV wideo będzie dostępne przez kod QR CV.':
      'Bu video CV, CV QR kodu ile erişilebilir olacak.',
    'Czy na pewno wrócić do strony głównej?': 'Ana sayfaya dönmek istiyor musunuz?',
    'Zawsze możesz edytować CV na stronie Jobissim.':
      'CV\'nizi her zaman Jobissim sitesinden düzenleyebilirsiniz.',
    'Tryb ATS (zgodny z oprogramowaniem rekrutacyjnym)':
      'ATS modu (işe alım yazılımlarıyla uyumlu)',
    'Tryb anonimowy': 'Anonim mod',
    'Podgląd w trybie ATS — uproszczony widok': 'ATS modu önizlemesi — sadeleştirilmiş görünüm',
    'Przetłumacz i zapisz': 'Çevir ve kaydet',
    'Tłumaczenie CV': 'CV çevirisi',
    'Wybierz język': 'Dil seçin',
    'CV przetłumaczone i zapisane': 'CV çevrildi ve kaydedildi',
    'Tłumaczenie nie powiodło się, spróbuj ponownie.':
      'Çeviri başarısız, lütfen tekrar deneyin.',
    'Analizuj moje CV': 'CV\'mi analiz et',
    'Analiza CV': 'CV analizi',
    'Zobacz wyniki': 'Sonuçları gör',
    'Analiza w toku…': 'Analiz devam ediyor…',
    'Generowanie PDF…': 'PDF oluşturuluyor…',
    'PDF nie jest jeszcze dostępny.': 'PDF henüz hazır değil.',
    'Analiza nie powiodła się. Spróbuj ponownie.':
      'Analiz başarısız. Lütfen tekrar deneyin.',
    'Spróbuj ponownie': 'Tekrar dene',
    'Nowa analiza': 'Yeni analiz',
    Podsumowanie: 'Özet',
    'Mocne strony': 'Güçlü yönler',
    'Sugerowane ulepszenia': 'Önerilen iyileştirmeler',
    'Nie można pobrać PDF CV.': 'CV PDF alınamadı.',
    'Utwórz zdjęcie do CV': 'CV fotoğrafımı oluştur',
    'Utwórz miniaturę CV wideo': 'Video CV fotoğrafımı oluştur',
    'To zdjęcie będzie na CV papierowym.': 'Bu fotoğraf kağıt CV\'nizde kullanılacak.',
    'Ten obraz będzie miniaturą wideo.': 'Bu görsel videonuzun küçük resmi olacak.',
    Zainteresowania: 'İlgi alanları',
    'Dodaj hobby i pasje (maks. 5).': 'Hobilerinizi ekleyin (en fazla 5).',
    'Np.: czytanie, wędrówki, muzyka...': 'Örn: okuma, yürüyüş, müzik...',
    'Brak zainteresowań': 'İlgi alanı eklenmedi',
    'Brak mediów społecznościowych': 'Sosyal ağ eklenmedi',
    'Media społecznościowe': 'Sosyal ağlar',
    'Platforma i URL (maks. 5).': 'Platform ve URL (en fazla 5).',
    'Platforma (np. LinkedIn)': 'Platform (örn. LinkedIn)',
    'Limit osiągnięty ({{max}}/{{max}})': 'Limite ulaşıldı ({{max}}/{{max}})',
    Inne: 'Diğer',
    'Dodatkowe informacje...': 'Ek bilgiler...',
    Wyloguj: 'Çıkış',
    'Czy na pewno się wylogować?': 'Çıkmak istediğinize emin misiniz?',
    Francuski: 'Fransızca',
    Angielski: 'İngilizce',
    Hiszpański: 'İspanyolca',
    Niemiecki: 'Almanca',
    Włoski: 'İtalyanca',
    Portugalski: 'Portekizce',
    Arabski: 'Arapça',
    Rumuński: 'Romence',
    Dari: 'Darice',
    Paszto: 'Peştuca',
    Polski: 'Lehçe',
    Turecki: 'Türkçe',
    Ukraiński: 'Ukraynaca',
  })
);

const plToUk = Object.fromEntries(
  Object.entries({
    'Inteligentne generowanie CV': 'Розумне створення CV',
    'CV papierowe': 'Паперове CV',
    'Stwórz profesjonalne, uporządkowane CV gotowe do użycia, wygenerowane automatycznie przez AI w':
      'Створіть професійне структуроване CV, автоматично згенероване ШІ за',
    'około 5 minut': 'близько 5 хвилин',
    'KROKI, KTÓRE PRZED TOBĄ': 'КРОКИ, ЯКІ ВАС ЧЕКАЮТЬ',
    Rozpocznij: 'Почати',
    'Twoje CV zostanie zapisane i będzie dostępne w każdej chwili w Twojej przestrzeni Jobissim.':
      'Ваше CV буде збережено та доступне в будь-який час у вашому просторі Jobissim.',
    Personalizacja: 'Персоналізація',
    'Wybór tytułu, szablonu i koloru CV': 'Вибір назви, дизайну та кольору CV',
    'Profil kandydata': 'Профіль кандидата',
    'Dane osobowe i poszukiwany typ umowy': 'Особисті дані та бажаний тип контракту',
    'Zainteresowania i inne': 'Інтереси та інше',
    'Zainteresowania, media społecznościowe, prawo jazdy i dodatkowe informacje':
      'Інтереси, соцмережі, посвідчення та додаткова інформація',
    'Umiejętności i języki': 'Навички та мови',
    'Wybór kluczowych umiejętności i języków': 'Вибір ключових навичок і мов',
    'Inteligentne generowanie': 'Розумна генерація',
    'AI automatycznie generuje prezentację, doświadczenie i wykształcenie':
      'ШІ автоматично генерує презентацію, досвід і освіту',
    Finalizacja: 'Фіналізація',
    'Dodanie zdjęcia, CV wideo i zatwierdzenie CV':
      'Додавання фото, відео CV та підтвердження',
    'Tytuł CV': 'Назва CV',
    'Np.: Full Stack Developer': 'Напр.: Full Stack Developer',
    'Wybierz szablon': 'Оберіть дизайн',
    Wybrano: 'Обрано',
    'Główny kolor CV': 'Основний колір CV',
    'Wybierz kolor': 'Обрати колір',
    'Kod własny (np. #f23ff0)': 'Власний код (напр. #f23ff0)',
    'Kolory predefiniowane': 'Попередньо визначені кольори',
    Zatwierdź: 'Підтвердити',
    'Ładowanie opcji organizacji…': 'Завантаження опцій організації…',
    'Nazwisko *': 'Прізвище *',
    'Imię *': "Ім'я *",
    'E-mail *': 'Email *',
    Telefon: 'Телефон',
    Adres: 'Адреса',
    'Strona www (opcjonalnie)': 'Веб-сайт (необов\'язково)',
    'Wiek (opcjonalnie)': 'Вік (необов\'язково)',
    'Poszukiwany typ umowy *': 'Бажаний тип контракту *',
    'Czas trwania alternacji': 'Тривалість навчання',
    'Data rozpoczęcia': 'Дата початку',
    'Prawo jazdy': 'Посвідчення',
    Języki: 'Мови',
    'Wybierz język i poziom (maks. 5).': 'Оберіть мову та рівень (макс. 5).',
    'Wybierz język': 'Обрати мову',
    Poziom: 'Рівень',
    'Nie wybrano języka': 'Мову не обрано',
    'Umiejętności twarde': 'Тверді навички',
    'Umiejętności miękkie': "М'які навички",
    'Dziedzina + do 6 umiejętności technicznych.': 'Сфера + до 6 технічних навичок.',
    'Wybierz do 6 cech osobowych.': 'Оберіть до 6 особистих якостей.',
    'Wybierz branżę': 'Обрати сферу діяльності',
    'Własna umiejętność': 'Власна навичка',
    'Wybierz branżę, aby zobaczyć umiejętności': 'Оберіть сферу, щоб побачити навички',
    'Szukaj lub dodaj umiejętność miękką': "Шукати або додати м'яку навичку",
    Propozycje: 'Пропозиції',
    Wybór: 'Вибір',
    'Brak propozycji': 'Пропозицій не знайдено',
    'Nie wybrano umiejętności miękkich': "М'які навички не обрані",
    'Usuń język': 'Видалити мову',
    'Usuń umiejętność': 'Видалити навичку',
    Usuń: 'Видалити',
    Krok: 'Крок',
    'Przedstaw się': 'Представтеся',
    Wykształcenie: 'Освіта',
    'Doświadczenie zawodowe': 'Досвід роботи',
    'Kim jesteś?': 'Хто ви?',
    'Twoja ścieżka edukacyjna': 'Ваш академічний шлях',
    'Twoje doświadczenie zawodowe': 'Ваш польовий досвід',
    'Przykład odpowiedzi:': 'Приклад відповіді:',
    Mów: 'Говорити',
    Pisz: 'Писати',
    Wyślij: 'Надіслати',
    'Opisz swoją ścieżkę, wykształcenie i doświadczenie...':
      'Опишіть шлях, освіту та досвід...',
    'Mów lub pisz naturalnie': 'Говоріть або пишіть природно',
    'Odpowiedz ustnie lub na piśmie. AI automatycznie ustrukturyzuje CV.':
      'Відповідайте усно або письмово. ШІ автоматично структурує CV.',
    'Nagraj ponownie': 'Перезаписати',
    'Wpisz inny tekst': 'Ввести інший текст',
    'Kliknij, aby nagrać': 'Натисніть для запису',
    'Wynik transkrypcji (edytowalny)': 'Результат транскрипції (редагований)',
    'Rozpocznij nagrywanie': 'Почати запис',
    Zatrzymaj: 'Зупинити',
    'Następny krok': 'Наступний крок',
    'Wygeneruj moje CV': 'Згенерувати моє CV',
    'Twoja prezentacja:': 'Ваша презентація:',
    'Twoje wykształcenie': 'Ваша освіта',
    'Twoje doświadczenie:': 'Ваш досвід:',
    'Kliknij, aby edytować': 'Натисніть для редагування',
    'Edytuj wykształcenie': 'Редагувати освіту',
    'Edytuj doświadczenie': 'Редагувати досвід',
    'Wykształcenie bez tytułu': 'Освіта без назви',
    'Doświadczenie bez tytułu': 'Досвід без назви',
    Zapisywanie: 'Збереження...',
    Uwaga: 'Увага',
    'Ta akcja zastąpi istniejące nagranie dla tego kroku. Kontynuować?':
      'Ця дія замінить існуючий запис для цього кроку. Продовжити?',
    Anuluj: 'Скасувати',
    Zastąp: 'Замінити',
    Gratulacje: 'Вітаємо!',
    'Twoje CV jest gotowe. Możesz dodać zdjęcie i CV wideo.':
      'Ваше CV готове. Можна додати фото та відео CV.',
    'Zdjęcie i CV wideo': 'Фото та відео CV',
    'Dodaj zdjęcie profilowe i powiąż CV wideo':
      'Додайте фото профілю та прив\'яжіть відео CV',
    'Zeskanuj kod QR, aby pobrać CV. Pozostaje dostępne w Twojej przestrzeni na':
      'Відскануйте QR-код для отримання CV. Доступне у вашому просторі на',
    'Kliknij, aby zobaczyć CV': 'Натисніть, щоб переглянути CV',
    'Powrót do strony głównej': 'На головну',
    'Zdjęcie profilowe': 'Фото профілю',
    'CV wideo': 'Відео CV',
    'Wybierz CV wideo': 'Обрати відео CV',
    'Brak CV wideo': 'Відео CV недоступне',
    'To CV wideo będzie dostępne przez kod QR CV.':
      'Це відео CV буде доступне через QR-код CV.',
    'Czy na pewno wrócić do strony głównej?': 'Справді повернутися на головну?',
    'Zawsze możesz edytować CV na stronie Jobissim.':
      'Ви завжди можете редагувати CV на сайті Jobissim.',
    'Tryb ATS (zgodny z oprogramowaniem rekrutacyjnym)':
      'Режим ATS (сумісний з рекрутинговим ПЗ)',
    'Tryb anonimowy': 'Анонімний режим',
    'Podgląd w trybie ATS — uproszczony widok': 'Попередній перегляд ATS — спрощений',
    'Przetłumacz i zapisz': 'Перекласти та зберегти',
    'Tłumaczenie CV': 'Переклад CV',
    'CV przetłumaczone i zapisane': 'CV перекладено та збережено',
    'Tłumaczenie nie powiodło się, spróbuj ponownie.':
      'Переклад не вдався, спробуйте знову.',
    'Analizuj moje CV': 'Проаналізувати моє CV',
    'Analiza CV': 'Аналіз CV',
    'Zobacz wyniki': 'Переглянути результати',
    'Analiza w toku…': 'Аналіз триває…',
    'Generowanie PDF…': 'Генерація PDF…',
    'PDF nie jest jeszcze dostępny.': 'PDF ще недоступний.',
    'Analiza nie powiodła się. Spróbuj ponownie.':
      'Аналіз не вдався. Спробуйте знову.',
    'Spróbuj ponownie': 'Спробувати знову',
    'Nowa analiza': 'Новий аналіз',
    Podsumowanie: 'Резюме',
    'Mocne strony': 'Сильні сторони',
    'Sugerowane ulepszenia': 'Запропоновані покращення',
    'Nie można pobrać PDF CV.': 'Неможливо отримати PDF CV.',
    'Utwórz zdjęcie do CV': 'Створити фото для CV',
    'Utwórz miniaturę CV wideo': 'Створити фото для відео CV',
    'To zdjęcie będzie na CV papierowym.': 'Це фото буде на паперовому CV.',
    'Ten obraz będzie miniaturą wideo.': 'Це зображення буде мініатюрою відео.',
    Zainteresowania: 'Інтереси',
    'Dodaj hobby i pasje (maks. 5).': 'Додайте хобі (макс. 5).',
    'Np.: czytanie, wędrówki, muzyka...': 'Напр.: читання, походи, музика...',
    'Brak zainteresowań': 'Інтереси не додані',
    'Brak mediów społecznościowych': 'Соцмережі не додані',
    'Media społecznościowe': 'Соціальні мережі',
    'Platforma i URL (maks. 5).': 'Платформа та URL (макс. 5).',
    'Platforma (np. LinkedIn)': 'Платформа (напр. LinkedIn)',
    'Limit osiągnięty ({{max}}/{{max}})': 'Ліміт досягнуто ({{max}}/{{max}})',
    Inne: 'Інше',
    'Dodatkowe informacje...': 'Додаткова інформація...',
    Wyloguj: 'Вийти',
    'Czy na pewno się wylogować?': 'Справді вийти?',
    Francuski: 'Французька',
    Angielski: 'Англійська',
    Hiszpański: 'Іспанська',
    Niemiecki: 'Німецька',
    Włoski: 'Італійська',
    Portugalski: 'Португальська',
    Arabski: 'Арабська',
    Rumuński: 'Румунська',
    Dari: 'Дарі',
    Paszto: 'Пушту',
    Polski: 'Польська',
    Turecki: 'Турецька',
    Ukraiński: 'Українська',
  })
);

const fr = JSON.parse(fs.readFileSync(path.join(localesDir, 'fr.json'), 'utf8'));
const pl = deepTranslate(JSON.parse(JSON.stringify(fr)), frToPl);
const tr = deepTranslate(JSON.parse(JSON.stringify(pl)), plToTr);
const uk = deepTranslate(JSON.parse(JSON.stringify(pl)), plToUk);

const langLabels = {
  fr: { pl: 'Polonais', tr: 'Turc', uk: 'Ukrainien' },
  en: { pl: 'Polish', tr: 'Turkish', uk: 'Ukrainian' },
  es: { pl: 'Polaco', tr: 'Turco', uk: 'Ucraniano' },
  de: { pl: 'Polnisch', tr: 'Türkisch', uk: 'Ukrainisch' },
  it: { pl: 'Polacco', tr: 'Turco', uk: 'Ucraino' },
  pt: { pl: 'Polaco', tr: 'Turco', uk: 'Ucraniano' },
  ar: { pl: 'البولندية', tr: 'التركية', uk: 'الأوكرانية' },
  ro: { pl: 'Poloneză', tr: 'Turcă', uk: 'Ucraineană' },
  fa: { pl: 'لهستانی', tr: 'ترکی', uk: 'اوکراینی' },
  ps: { pl: 'پولنډي', tr: 'ترکي', uk: 'اوکرايني' },
  pl: { pl: 'Polski', tr: 'Turecki', uk: 'Ukraiński' },
  tr: { pl: 'Lehçe', tr: 'Türkçe', uk: 'Ukraynaca' },
  uk: { pl: 'Польська', tr: 'Турецька', uk: 'Українська' },
};

pl.languages = { ...pl.languages, pl: 'Polski', tr: 'Turecki', uk: 'Ukraiński' };
tr.languages = { ...tr.languages, pl: 'Lehçe', tr: 'Türkçe', uk: 'Ukraynaca' };
uk.languages = { ...uk.languages, pl: 'Польська', tr: 'Турецька', uk: 'Українська' };

fs.writeFileSync(path.join(localesDir, 'pl.json'), JSON.stringify(pl, null, 1) + '\n');
fs.writeFileSync(path.join(localesDir, 'tr.json'), JSON.stringify(tr, null, 1) + '\n');
fs.writeFileSync(path.join(localesDir, 'uk.json'), JSON.stringify(uk, null, 1) + '\n');

for (const code of ['fr', 'en', 'es', 'de', 'it', 'pt', 'ar', 'ro', 'fa', 'ps']) {
  const file = path.join(localesDir, `${code}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.languages = { ...data.languages, ...langLabels[code] };
  fs.writeFileSync(file, JSON.stringify(data, null, 1) + '\n');
}

console.log('Generated pl.json, tr.json, uk.json and updated languages in existing locales');
