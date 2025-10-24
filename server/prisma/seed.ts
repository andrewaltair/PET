import { PrismaClient, UserRole, ServiceType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const db = new PrismaClient();
const SALT_ROUNDS = 12;

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a shared hashed password for all users
  const hashedPassword = await bcrypt.hash('password123', SALT_ROUNDS);
  console.log('✅ Password hashed');

  // List of available avatars
  const avatarFiles = [
    '0450249b131eec36dc8333b7cf847bc4.webp',
    '06d29f74c2f85239efe3f9ade1b96da7.webp',
    '098d5b19a0870d95bee0cdbcef632be1.webp',
    '112413f070536d15170606f2d00aa15d.webp',
    '119d9abaee7a1e987571f0fe776bd1a5.webp',
    '1a270860bac2c66b434968a3047822e3.webp',
    '1a3318330cf1734feb84887e9453fb1b.webp',
    '1bab427466457e745328f6eb8fa227e1.webp',
    '1c9a4dd0bbd964e3eecbd40caf3b7e37.webp',
    '1dd1b479633b29ff2fd9d6644581f394.webp',
    '2244af71ad0c25f2cb0a8efa167491fb.webp',
    '237d3876ef98d5364ed1326813f4ed5b.webp',
    '261cb9a6ae028b862eaf692b10033fb7.webp',
    '27d73d5efa51661b5feb1e29cc389257.webp',
    '2866b308b3c70e895e34b3130f10abf3.webp',
    '2b04cc0b930f82afe6c38d3209dcbdfd.webp',
    '2d81c3469090a90daff20560a129b182.webp',
    '2fafd2ca0fa23ca91ec778674c26081a.webp',
    '2fb0e578a8ab6f8073092ae637c87835.webp',
    '321f5bcb6efc56013d67ae101f196eaf.webp',
    '33642b1fa839338a7d53d78336a45ff0.webp',
    '386f22acf2f226c3a9ad7ad66fdce7a6.webp',
    '40687889cb61a06b242aafb9e02f5204.webp',
    '4184423b57c070204a1942282818dc0c.webp',
    '439620a6c05132c82d67fc1593a7e19a.webp',
    '44198079c5211172a61405b5049f3bfb.webp',
    '44b312165ea1bb924bdccf01bf1bb443.webp',
    '44f647f9e3c4767d3b83e89e67917f41.webp',
    '466989c631bca15c46ae9c1e62269a5a.webp',
    '4a8eb80a6f610949b28dd91f45e7d6e2.webp',
    '4b59f1b8af326b6381c39ab29c3612d6.webp',
    '4dfaa7ded74ac66557b5940f7290c840.webp',
    '50382765fd5648c7876d91cc37b27394.webp',
    '5c9a412b4e80d08303731bca471d3b63.webp',
    '5cd1cd3d1851e162616256ebe2a4c30a.webp',
    '60467e1ae6f97acb8964f5aa617c7ecb.webp',
    '622e4c7767d4eb0307179d6dfda9248b.webp',
    '644dfc35027924a6e5dfbcad653be697.webp',
    '67b732b96785fd368415dd82951466c1.webp',
    '6914da7a3557e685836a71e635c237b9.webp',
    '69c04d9c4dc60b59bac65938e070e7cf.webp',
    '6ade325cd4c136112f25e63f888eb7de.webp',
    '6bde7f630b3933ee1b92b0ec2df665c2.webp',
    '6ffe2b7df2b99ba5cc2c65692dd0d568.webp',
    '706e8643277a95c3f80005f70cf53cb9.webp',
    '70a23294beb91b4ad5a439e2c6ea5a6d.webp',
    '76891f0bd337c6ee10f84067d7808044.webp',
    '78529e2ec8eb4a2eb2fb961e04915b0a.webp',
    '78c7bf3d348d505f15d332f9a58092f7.webp',
    '7ae3a0ffcf9eb41156244fbaa3588de7.webp',
    '7c9062905b4ce3d276dfffd2b34bbb49.webp',
    '7d24c27f40be0d43618f6d49e26a3288.webp',
    '8654c911c90383bb42a6cdddd66014c5.webp',
    '869f67a992bb6ca4cb657fb9fc634893.webp',
    '8940e8ea369def14e82f05a5fee994b9.webp',
    '897cda132d24997b106d57ccd0530927.webp',
    '899e2a12b136acdc5366e76d15d83244.webp',
    '8c0e0a2a3a1c7068ea221aa8a0f429e0.webp',
    '8fcd9a7c3003dd0ad23e371475d130b3.webp',
    '92770c61168481c94e1ba43df7615fd8.webp',
    '944c5ba154e0489274504f38d01bcfaf.webp',
    '94f5ac7e7b78495be7df7e5ca427fd5c.webp',
    '9854663aec5741bbbe84290b6edc0aed.webp',
    '9d119d757ff7d7b36b9d71b86d973fbe.webp',
    'a2d4e522bd8e359b60d4e40a6c50fa6e.webp',
    'a47cfeaf97371ec735a870781978fcf5.webp',
    'a599c01dec11cb6099c6aacafe3bc5a9.webp',
    'b00e1ebc65fc7f2c53c9a9a955a49be5.webp',
    'b0a4b1922813b989103a3616d7111562.webp',
    'b89db8099e05245d0f3e19be6beeafca.webp',
    'b8c1cb5042e9b54e27d18d6ecfb46087.webp',
    'baa928fef9b0f2e838263dd88eefc707.webp',
    'bb3d2a58ea153b635a4951d82affb4db.webp',
    'bb8c76bcb73cf00e7d4ab920447a365c.webp',
    'bc61d859626dbb47d69f86e10421c50e.webp',
    'bc8e6056aa877de4ae5ab1321f776ade.webp',
    'c0e1c0e6224c14a140748d8cef481883.webp',
    'c29e12118b27e54e8883db0b98c610df.webp',
    'c33237da3438494d1abc67166196484e.webp',
    'c6b7069df1a634e3db7ba5e9b923d3a8.webp',
    'cacf6ab4ea79648699479021e7892224.webp',
    'cae99bb14b21ec41ecf03b58f59ff292.webp',
    'd1499909450ba526d5297e3ebc7f6d07.webp',
    'd36865e08723cc1b764e084873e53662.webp',
    'd447a9fd5010652f6c0911fbe9c662c6.webp',
    'd7d9e6977ad4053c3dfab772ba1d2c1f.webp',
    'dae17037af459cca4ed1b8a474e7428e.webp',
    'e2cb7b8c41eba64187df1fc6128a3f8e.webp',
    'e6f79cdf2a45c0eb58b3f93407361989.webp',
    'ecf088e6a05f2c8d5c041384e3568b46.webp',
    'ed7055b68adec22bfa8a88d441e83e9a.webp',
    'ee7173cf2acfcb909ead7a23f3e01493.webp',
    'eecd70bbeb08e2fc531ca498b9fc4f0d.webp',
    'ef4a7e86005e0e9e49dbbae2280c1f10.webp',
    'f0474688ec350e08543f55b3771dcada.webp',
    'f0fb14746f3fc6020a0e1afdd089a4fb.webp',
    'f118c882025868bca7499ea0f41bc43b.webp',
    'f135ea474f1320d13883e194685b4d8a.webp',
    'f3382b5fa7e14fcab30d4279f203c83a.webp',
    'f725eb23b6db39a55736f1428f6a76c5.webp',
  ];

  // Helper function to get a random avatar
  const getRandomAvatar = () => {
    const avatar = faker.helpers.arrayElement(avatarFiles);
    return `/avatars/${avatar}`;
  };

  // Helper function to get service-specific images from Unsplash
  const getServiceImage = (serviceType: ServiceType): string => {
    const serviceImages: Record<ServiceType, string[]> = {
      [ServiceType.WALKING]: [
        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&h=600&fit=crop',
      ],
      [ServiceType.SITTING]: [
        'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop',
      ],
      [ServiceType.GROOMING]: [
        'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=800&h=600&fit=crop',
      ],
      [ServiceType.VETERINARIAN_VISIT]: [
        'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578164252419-74dcee31bfe3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop',
      ],
      [ServiceType.TAXI]: [
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519099064598-86a67c52577e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop',
      ],
      [ServiceType.TRAINING]: [
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1593134257782-e89567b7718a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop',
      ],
    };
    return faker.helpers.arrayElement(serviceImages[serviceType]);
  };

  // Helper function to generate realistic service data
  const generateServiceData = (serviceType: ServiceType) => {
    const serviceData: Record<ServiceType, { titles: string[]; descriptions: string[] }> = {
      [ServiceType.WALKING]: {
        titles: [
          'Профессиональный выгул собак',
          'Прогулка с вашим питомцем',
          'Активные прогулки для собак',
          'Выгул собак в парке',
          'Индивидуальная прогулка',
        ],
        descriptions: [
          'Профессиональный выгул собак с учетом их потребностей в физической активности. Подходит для всех пород.',
          'Регулярные прогулки для вашего питомца с опытным собаководом. Большой опыт работы с различными породами.',
          'Активные прогулки с играми и физическими упражнениями. Отлично подходит для энергичных собак.',
          'Прогулки в парке с возможностью свободного выгула. Безопасность и комфорт вашего питомца - приоритет.',
          'Индивидуальный подход к каждому питомцу. Прогулки по удобному для вас графику.',
        ],
      },
      [ServiceType.SITTING]: {
        titles: [
          'Домашний присмотр за питомцем',
          'Профессиональный ситтер',
          'Присмотр с заботой',
          'Ситтинг для собак и кошек',
          'Дневной присмотр',
        ],
        descriptions: [
          'Профессиональный присмотр за вашим питомцем дома. Включает кормление, прогулки и игры.',
          'Опытный ситтер с большим стажем работы. Ваш питомец будет в надежных руках.',
          'Заботливый присмотр с вниманием к деталям. Регулярные фото-отчеты и обновления.',
          'Присмотр как для собак, так и для кошек. Гибкий график и индивидуальный подход.',
          'Дневной присмотр с возможностью выгула. Отлично подходит для работающих владельцев.',
        ],
      },
      [ServiceType.GROOMING]: {
        titles: [
          'Полный груминг собак',
          'Стрижка и уход за шерстью',
          'Профессиональный груминг',
          'Уход за питомцем',
          'Мобильный груминг',
        ],
        descriptions: [
          'Полный спектр услуг груминга: стрижка, мытье, сушка, стрижка когтей. Все инструменты профессиональные.',
          'Стрижка и уход за шерстью всех пород. Используем только качественную косметику для животных.',
          'Профессиональный груминг с использованием современных техник. Большой опыт работы.',
          'Комплексный уход за вашим питомцем. Включает все необходимые процедуры.',
          'Мобильный груминг с выездом на дом. Удобно для вас и комфортно для питомца.',
        ],
      },
      [ServiceType.VETERINARIAN_VISIT]: {
        titles: [
          'Ветеринарный осмотр на дому',
          'Консультация ветеринара',
          'Профилактический осмотр',
          'Ветеринарные услуги',
          'Домашний визит ветеринара',
        ],
        descriptions: [
          'Ветеринарный осмотр на дому. Профессиональный врач проведет полное обследование вашего питомца.',
          'Консультация опытного ветеринара по вопросам здоровья и ухода за питомцем.',
          'Профилактический осмотр с рекомендациями по уходу и питанию.',
          'Полный спектр ветеринарных услуг на дому. При необходимости - лабораторные анализы.',
          'Удобный визит ветеринара на дом. Без стресса для питомца, с полным вниманием врача.',
        ],
      },
      [ServiceType.TAXI]: {
        titles: [
          'Транспортировка питомцев',
          'Такси для животных',
          'Безопасная перевозка',
          'Ветеринарное такси',
          'Комфортная перевозка',
        ],
        descriptions: [
          'Безопасная транспортировка вашего питомца. Опытный водитель и специальное оборудование.',
          'Удобное такси для перевозки животных. Комфорт и безопасность - главные приоритеты.',
          'Безопасная перевозка питомцев в клинику, на выставку или домой. Профессиональное оборудование.',
          'Ветеринарное такси с контролем условий транспортировки. Подходит для больных животных.',
          'Комфортная перевозка с заботой о питомце. Опытный персонал и современный транспорт.',
        ],
      },
      [ServiceType.TRAINING]: {
        titles: [
          'Дрессировка собак',
          'Профессиональная тренировка',
          'Курс послушания',
          'Дрессировка щенков',
          'Коррекция поведения',
        ],
        descriptions: [
          'Профессиональная дрессировка собак всех пород. Используем современные методы обучения.',
          'Тренировка с индивидуальным подходом. Опытный кинолог поможет воспитать послушного питомца.',
          'Курс базового послушания и команды. Подходит для собак всех возрастов.',
          'Специализированная дрессировка для щенков. Заложим правильные привычки с раннего возраста.',
          'Коррекция нежелательного поведения. Работаем с агрессией, лаем, страхами и другими проблемами.',
        ],
      },
    };
    return serviceData[serviceType];
  };

  // Helper function to get pet images
  const getPetImage = (petType: string): string => {
    const petImages: Record<string, string[]> = {
      dog: [
        'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1587402092301-725e37c70fd8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
      ],
      cat: [
        'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1520087619250-584c0cbd35f8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1529778873920-7da60d5e8fd2?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=400&fit=crop',
      ],
      bird: [
        'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=400&fit=crop',
      ],
      rabbit: [
        'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=400&h=400&fit=crop',
      ],
    };
    return faker.helpers.arrayElement(petImages[petType] || petImages.dog);
  };

  // Pet types and breeds
  const petTypes = ['dog', 'cat', 'bird', 'rabbit'];
  const dogBreeds = ['Лабрадор', 'Овчарка', 'Хаски', 'Ретривер', 'Бигль', 'Йоркширский терьер', 'Такса', 'Бульдог'];
  const catBreeds = ['Британская', 'Персидская', 'Мейн-кун', 'Сфинкс', 'Сиамская', 'Русская голубая', 'Шотландская вислоухая'];
  const birdBreeds = ['Канарейка', 'Попугай', 'Волнистый попугайчик'];
  const rabbitBreeds = ['Карликовый', 'Ангорский', 'Вислоухий'];

  // Create Seekers (OWNER role) - 50 users
  console.log('📝 Creating 50 OWNER users...');
  for (let i = 0; i < 50; i++) {
    const user = await db.user.create({
      data: {
        email: faker.internet.email(),
        password: hashedPassword,
        role: UserRole.OWNER,
      },
    });

    // Create profile for each owner with complete data
    await db.profile.create({
      data: {
        userId: user.id,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        avatarUrl: getRandomAvatar(),
        bio: faker.lorem.paragraphs(2),
        location: `${faker.location.city()}, ${faker.location.state()}`,
      },
    });

    // Create 1-2 pets for each owner
    const numPets = faker.number.int({ min: 1, max: 2 });
    for (let j = 0; j < numPets; j++) {
      const petType = faker.helpers.arrayElement(petTypes);
      let breed = '';
      
      switch (petType) {
        case 'dog':
          breed = faker.helpers.arrayElement(dogBreeds);
          break;
        case 'cat':
          breed = faker.helpers.arrayElement(catBreeds);
          break;
        case 'bird':
          breed = faker.helpers.arrayElement(birdBreeds);
          break;
        case 'rabbit':
          breed = faker.helpers.arrayElement(rabbitBreeds);
          break;
      }

      await db.pet.create({
        data: {
          ownerId: user.id,
          name: faker.person.firstName(),
          petType: petType === 'dog' ? 'Собака' : petType === 'cat' ? 'Кошка' : petType === 'bird' ? 'Птица' : 'Кролик',
          breed,
          age: faker.number.int({ min: 1, max: 15 }),
          weight: faker.number.float({ min: 1, max: 50, fractionDigits: 1 }),
          photoUrl: getPetImage(petType),
        },
      });
    }

    if ((i + 1) % 10 === 0) {
      console.log(`   ✓ Created ${i + 1} owners with pets`);
    }
  }
  console.log('✅ Created 50 OWNER users with profiles and pets');

  // Create Providers - 50 users
  console.log('📝 Creating 50 PROVIDER users...');
  const serviceTypes: ServiceType[] = [
    ServiceType.WALKING,
    ServiceType.SITTING,
    ServiceType.GROOMING,
    ServiceType.VETERINARIAN_VISIT,
    ServiceType.TAXI,
    ServiceType.TRAINING,
  ];

  for (let i = 0; i < 50; i++) {
    const provider = await db.user.create({
      data: {
        email: faker.internet.email(),
        password: hashedPassword,
        role: UserRole.PROVIDER,
      },
    });

    // Create profile for each provider with complete data
    await db.profile.create({
      data: {
        userId: provider.id,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        avatarUrl: getRandomAvatar(),
        bio: faker.lorem.paragraphs(3),
        location: `${faker.location.city()}, ${faker.location.state()}`,
        servicesProvided: serviceTypes.map(st => st.toLowerCase()).join(', '),
      },
    });

    // Create 1-2 services for each provider
    const numServices = faker.number.int({ min: 1, max: 2 });
    for (let j = 0; j < numServices; j++) {
      const serviceType = faker.helpers.arrayElement(serviceTypes);
      const serviceData = generateServiceData(serviceType);
      
      await db.service.create({
        data: {
          providerId: provider.id,
          serviceType,
          title: faker.helpers.arrayElement(serviceData.titles),
          description: faker.helpers.arrayElement(serviceData.descriptions),
          price: faker.number.float({ min: 15, max: 300, fractionDigits: 2 }),
          imageUrl: getServiceImage(serviceType),
          availability: JSON.stringify({
            monday: { start: '09:00', end: '18:00' },
            tuesday: { start: '09:00', end: '18:00' },
            wednesday: { start: '09:00', end: '18:00' },
            thursday: { start: '09:00', end: '18:00' },
            friday: { start: '09:00', end: '18:00' },
            saturday: { start: '10:00', end: '16:00' },
            sunday: { start: '10:00', end: '16:00' },
          }),
        },
      });
    }

    if ((i + 1) % 10 === 0) {
      console.log(`   ✓ Created ${i + 1} providers with services`);
    }
  }
  console.log('✅ Created 50 PROVIDER users with profiles and services');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
