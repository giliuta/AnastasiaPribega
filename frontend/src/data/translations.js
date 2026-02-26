const translations = {
  ru: {
    nav: {
      home: 'Главная',
      about: 'О нас',
      services: 'Услуги',
      academy: 'Академия',
      contact: 'Контакт',
      quiz: 'Подобрать форму',
      book: 'Записаться',
    },
    hero: {
      brand: 'PRIBEGA',
      subtitle: 'Private Brow & Lash Studio',
      tagline: 'Натуральная точность. Архитектурная красота.',
      subtext: 'Премиальное мастерство бровей в Пафосе.',
      appointment: 'Только по записи',
      scroll: 'Листайте вниз',
    },
    manifesto: {
      line1: 'Мы не корректируем брови.',
      line2: 'Мы создаём архитектуру формы.',
      line3: 'Каждая линия — точна.',
      line4: 'Каждый изгиб — продуман.',
      line5: 'Каждая деталь — в балансе.',
      line6: 'PRIBEGA — это эталон естественной красоты.',
    },
    principles: {
      title: 'Принципы',
      precision: {
        title: 'Точность',
        desc: 'Каждое движение выверено. Каждая линия создана с хирургической точностью для достижения идеального результата.',
      },
      balance: {
        title: 'Баланс',
        desc: 'Гармония формы и индивидуальности лица. Мы создаём архитектуру, которая подчёркивает вашу уникальность.',
      },
      elevation: {
        title: 'Совершенство',
        desc: 'Мы поднимаем стандарт красоты на новый уровень. Каждая деталь продумана до совершенства.',
      },
    },
    servicesPreview: {
      title: 'Услуги',
      subtitle: 'Архитектура бровей и дизайн ресниц',
      viewAll: 'Все услуги',
    },
    services: {
      pageTitle: 'Архитектура бровей и дизайн ресниц',
      brows: {
        title: 'Брови',
        items: [
          { name: 'Прореживание бровей', price: '30€' },
          { name: 'Коррекция без окрашивания', price: '30€' },
          { name: 'Коррекция с окрашиванием', price: '35€' },
          { name: 'Ламинирование без окрашивания', price: '40€' },
          { name: 'Ламинирование с окрашиванием', price: '50€' },
        ],
      },
      lashes: {
        title: 'Ресницы',
        items: [
          { name: 'Окрашивание ресниц', price: '15€' },
          { name: 'Ламинирование без окрашивания', price: '20€' },
          { name: 'Ламинирование с окрашиванием', price: '30€' },
        ],
      },
      complex: {
        title: 'Комплекс',
        items: [
          { name: 'Ламинирование бровей с окрашиванием и коррекцией + ламинирование ресниц с окрашиванием', price: '70€' },
        ],
      },
      additional: {
        title: 'Дополнительно',
        items: [
          { name: 'Удаление нежелательных волосков', price: '10€' },
        ],
      },
    },
    gallery: {
      title: 'Портфолио',
      subtitle: 'Результаты нашей работы',
    },
    academy: {
      title: 'PRIBEGA ACADEMY',
      desc: 'Академия для мастеров, которые стремятся работать на уровне премиум и создавать архитектуру формы, а не просто брови.',
      apply: 'Подать заявку',
      preview: 'Для мастеров, которые хотят овладеть красотой на премиальном уровне.',
    },
    about: {
      title: 'О нас',
      intro: 'Анастасия Прибега — эксперт по архитектуре бровей с 7-летним опытом.',
      text1: 'Создаю натуральные, гармоничные формы без эффекта «чёрных маркеров».',
      text2: 'Моя работа — это точность, чистота линий и уважение к индивидуальности лица.',
      signature: 'Anastasia Pribega',
    },
    contact: {
      title: 'Контакт',
      studio: 'PRIBEGA Private Studio',
      location: 'Lady Space Beauty Coworking',
      city: 'Пафос, Кипр',
      hours: 'Часы работы',
      hoursValue: '08:00 — 20:00 (Ежедневно)',
      phone: 'Телефон',
      limited: 'Ограниченное количество записей в день.',
      form: {
        name: 'Имя',
        email: 'Email',
        phone: 'Телефон',
        message: 'Сообщение',
        send: 'Отправить',
        success: 'Спасибо! Мы свяжемся с вами в ближайшее время.',
        placeholder: 'Расскажите о желаемой процедуре...',
      },
    },
    cta: {
      title: 'Запишитесь на приём',
      subtitle: 'Ваша идеальная форма начинается здесь.',
      button: 'Записаться',
    },
    quiz: {
      title: 'Найдите вашу идеальную форму бровей',
      subtitle: 'Ответьте на 4 вопроса и получите персональную рекомендацию.',
      next: 'Далее',
      prev: 'Назад',
      finish: 'Получить рекомендацию',
      result: 'Ваша рекомендация',
      bookNow: 'Записаться сейчас',
      restart: 'Пройти заново',
      q1: {
        title: 'Какая у вас форма лица?',
        options: [
          { value: 'oval', label: 'Овальное' },
          { value: 'round', label: 'Круглое' },
          { value: 'square', label: 'Квадратное' },
          { value: 'heart', label: 'Сердцевидное' },
        ],
      },
      q2: {
        title: 'Какова густота ваших натуральных бровей?',
        options: [
          { value: 'sparse', label: 'Редкие' },
          { value: 'medium', label: 'Средние' },
          { value: 'thick', label: 'Густые' },
        ],
      },
      q3: {
        title: 'Какой эффект вы хотите получить?',
        options: [
          { value: 'natural', label: 'Натуральный' },
          { value: 'defined', label: 'Выразительный' },
          { value: 'dramatic', label: 'Яркий' },
        ],
      },
      q4: {
        title: 'Ваш опыт с процедурами для бровей?',
        options: [
          { value: 'none', label: 'Нет опыта' },
          { value: 'basic', label: 'Базовый' },
          { value: 'advanced', label: 'Продвинутый' },
        ],
      },
    },
    footer: {
      rights: 'Все права защищены.',
      tagline: 'The Standard of Beauty',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      academy: 'Academy',
      contact: 'Contact',
      quiz: 'Find Your Shape',
      book: 'Book Now',
    },
    hero: {
      brand: 'PRIBEGA',
      subtitle: 'Private Brow & Lash Studio',
      tagline: 'Natural Precision. Architectural Beauty.',
      subtext: 'Premium brow artistry in Paphos.',
      appointment: 'By appointment only',
      scroll: 'Scroll down',
    },
    manifesto: {
      line1: "We don't adjust brows.",
      line2: 'We design architectural balance.',
      line3: 'Every line is intentional.',
      line4: 'Every curve refined.',
      line5: 'Every detail elevated.',
      line6: 'PRIBEGA is the standard of natural beauty.',
    },
    principles: {
      title: 'Principles',
      precision: {
        title: 'Precision',
        desc: 'Every movement is measured. Every line created with surgical accuracy for a flawless result.',
      },
      balance: {
        title: 'Balance',
        desc: 'Harmony of form and facial individuality. We create architecture that highlights your uniqueness.',
      },
      elevation: {
        title: 'Elevation',
        desc: 'We raise the standard of beauty to a new level. Every detail is refined to perfection.',
      },
    },
    servicesPreview: {
      title: 'Services',
      subtitle: 'Brow Architecture & Lash Design',
      viewAll: 'View All',
    },
    services: {
      pageTitle: 'Brow Architecture & Lash Design',
      brows: {
        title: 'Brows',
        items: [
          { name: 'Brow Thinning', price: '30€' },
          { name: 'Correction without Tinting', price: '30€' },
          { name: 'Correction with Tinting', price: '35€' },
          { name: 'Lamination without Tinting', price: '40€' },
          { name: 'Lamination with Tinting', price: '50€' },
        ],
      },
      lashes: {
        title: 'Lashes',
        items: [
          { name: 'Lash Tinting', price: '15€' },
          { name: 'Lamination without Tinting', price: '20€' },
          { name: 'Lamination with Tinting', price: '30€' },
        ],
      },
      complex: {
        title: 'Complex',
        items: [
          { name: 'Brow + Lash Lamination', price: '70€' },
        ],
      },
      additional: {
        title: 'Additional',
        items: [
          { name: 'Unwanted Hair Removal', price: '10€' },
        ],
      },
    },
    gallery: {
      title: 'Portfolio',
      subtitle: 'Results of our work',
    },
    academy: {
      title: 'PRIBEGA ACADEMY',
      desc: 'An academy for artists who aspire to work at a premium level and create architectural form, not just brows.',
      apply: 'Apply for Training',
      preview: 'For artists who want to master beauty at a premium level.',
    },
    about: {
      title: 'About',
      intro: 'Anastasia Pribega is a brow architecture expert with 7 years of professional experience.',
      text1: 'I create natural, harmonious shapes without the effect of "drawn-on markers."',
      text2: 'My work is about precision, clean lines, and respect for the individuality of each face.',
      signature: 'Anastasia Pribega',
    },
    contact: {
      title: 'Contact',
      studio: 'PRIBEGA Private Studio',
      location: 'Lady Space Beauty Coworking',
      city: 'Paphos, Cyprus',
      hours: 'Working Hours',
      hoursValue: '08:00 — 20:00 (Daily)',
      phone: 'Phone',
      limited: 'Limited daily bookings.',
      form: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        message: 'Message',
        send: 'Send',
        success: 'Thank you! We will contact you shortly.',
        placeholder: 'Tell us about your desired treatment...',
      },
    },
    cta: {
      title: 'Book Your Private Appointment',
      subtitle: 'Your perfect shape starts here.',
      button: 'Book Now',
    },
    quiz: {
      title: 'Find Your Perfect Brow Shape',
      subtitle: 'Answer 4 questions and get a personalized recommendation.',
      next: 'Next',
      prev: 'Back',
      finish: 'Get Recommendation',
      result: 'Your Recommendation',
      bookNow: 'Book Now',
      restart: 'Start Over',
      q1: {
        title: 'What is your face shape?',
        options: [
          { value: 'oval', label: 'Oval' },
          { value: 'round', label: 'Round' },
          { value: 'square', label: 'Square' },
          { value: 'heart', label: 'Heart' },
        ],
      },
      q2: {
        title: 'What is your natural brow density?',
        options: [
          { value: 'sparse', label: 'Sparse' },
          { value: 'medium', label: 'Medium' },
          { value: 'thick', label: 'Thick' },
        ],
      },
      q3: {
        title: 'What effect do you want?',
        options: [
          { value: 'natural', label: 'Natural' },
          { value: 'defined', label: 'Defined' },
          { value: 'dramatic', label: 'Dramatic' },
        ],
      },
      q4: {
        title: 'Your experience with brow treatments?',
        options: [
          { value: 'none', label: 'No experience' },
          { value: 'basic', label: 'Basic' },
          { value: 'advanced', label: 'Advanced' },
        ],
      },
    },
    footer: {
      rights: 'All rights reserved.',
      tagline: 'The Standard of Beauty',
    },
  },
};

export default translations;
