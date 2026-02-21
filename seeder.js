const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Dish = require('./models/Dish');

dotenv.config();

const categories = [
    { name: 'Thalis', slug: 'thalis', icon: '🍱', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400' },
    { name: 'Main Course', slug: 'main-course', icon: '🍛', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=400' },
    { name: 'Starters', slug: 'starters', icon: '🥙', image: 'https://images.unsplash.com/photo-1601050690597-df056fb1ce24?auto=format&fit=crop&q=80&w=400' },
    { name: 'Rice & Biryani', slug: 'rice-biryani', icon: '🍚', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=400' },
    { name: 'Breads', slug: 'breads', icon: '🫓', image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=400' },
    { name: 'Desserts', slug: 'desserts', icon: '🍰', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=400' }
];

const dishes = [
    {
        name: 'Maharaja Thali',
        type: 'Veg',
        price: 249,
        description: 'Dal Makhani, Paneer, 2 Vegetables, Raita, Rice, 3 Butter Roti, Gulab Jamun',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
        category: 'Thalis'
    },
    {
        name: 'Economy Thali',
        type: 'Veg',
        price: 149,
        description: 'Dal, Seasonal Vegetable, Rice, 4 Roti, Salad',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800',
        category: 'Thalis'
    },
    {
        name: 'Paneer Butter Masala',
        type: 'Veg',
        price: 199,
        description: 'Cubes of paneer cooked in rich creamy tomato based gravy',
        image: 'https://images.unsplash.com/photo-1567184109411-b2033c464670?auto=format&fit=crop&q=80&w=800',
        category: 'Main Course'
    },
    {
        name: 'Chicken Curry',
        type: 'Non-Veg',
        price: 279,
        description: 'Homestyle chicken gravy cooked with traditional Indian spices',
        image: 'https://images.unsplash.com/photo-1603894584104-699741e7379f?auto=format&fit=crop&q=80&w=800',
        category: 'Main Course'
    },
    {
        name: 'Hara Bhara Kabab',
        type: 'Veg',
        price: 129,
        description: 'Crispy spinach and potato patties filled with peas and spices',
        image: 'https://images.unsplash.com/photo-1606491956391-70868b5d0f47?auto=format&fit=crop&q=80&w=800',
        category: 'Starters'
    },
    {
        name: 'Hyderabadi Biryani',
        type: 'Non-Veg',
        price: 219,
        description: 'Authentic spice-rich biryani cooked with marinated chicken pieces',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800',
        category: 'Rice & Biryani'
    },
    {
        name: 'Butter Naan',
        type: 'Veg',
        price: 35,
        description: 'Soft and fluffy leavened bread cooked in clay oven with butter',
        image: 'https://images.unsplash.com/photo-1601050690597-df056fb1ce24?auto=format&fit=crop&q=80&w=800',
        category: 'Breads'
    },
    {
        name: 'Gulab Jamun (2 Pcs)',
        type: 'Veg',
        price: 59,
        description: 'Soft milk solids dumplings dipped in warm sugar syrup',
        image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=800',
        category: 'Desserts'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

        // Clear existing data
        await Category.deleteMany({});
        await Dish.deleteMany({});

        // Insert new data
        await Category.insertMany(categories);
        await Dish.insertMany(dishes);

        console.log('Database Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
