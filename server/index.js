import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key';

app.use(cors());
app.use(express.json());

const loadData = (filename) => {
  const filePath = join(__dirname, 'data', filename);
  if (existsSync(filePath)) {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  }
  return [];
};

const saveData = (filename, data) => {
  const filePath = join(__dirname, 'data', filename);
  writeFileSync(filePath, JSON.stringify(data, null, 2));
};

let products = loadData('products.json');
let users = loadData('users.json');
let chatSessions = loadData('chatSessions.json');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};


app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: uuidv4(),
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveData('users.json', users);

    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET);

    res.json({
      token,
      user: { id: newUser.id, email: newUser.email, name: newUser.name }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/products', (req, res) => {
  const { search, category, minPrice, maxPrice, limit = 20 } = req.query;
  
  let filteredProducts = [...products];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  }

  if (category) {
    filteredProducts = filteredProducts.filter(product =>
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => product.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(maxPrice));
  }

  filteredProducts = filteredProducts.slice(0, parseInt(limit));

  res.json(filteredProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

app.post('/api/chat', authenticateToken, (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user.userId;

    let session = chatSessions.find(s => s.id === sessionId && s.userId === userId);
    if (!session) {
      session = {
        id: sessionId || uuidv4(),
        userId,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      chatSessions.push(session);
    }

    const userMessage = {
      id: uuidv4(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    session.messages.push(userMessage);

    const botResponse = generateBotResponse(message);
    const botMessage = {
      id: uuidv4(),
      type: 'bot',
      content: botResponse.content,
      products: botResponse.products,
      timestamp: new Date().toISOString()
    };
    session.messages.push(botMessage);

    session.updatedAt = new Date().toISOString();
    saveData('chatSessions.json', chatSessions);

    res.json({ message: botMessage, sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/chat/sessions', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const userSessions = chatSessions
    .filter(s => s.userId === userId)
    .map(s => ({
      id: s.id,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      lastMessage: s.messages[s.messages.length - 1]?.content?.substring(0, 100) + '...'
    }))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  res.json(userSessions);
});

app.get('/api/chat/sessions/:sessionId', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const session = chatSessions.find(s => s.id === req.params.sessionId && s.userId === userId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json(session);
});

function generateBotResponse(message) {
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
    return {
      content: "Hello! Welcome to TechMart! I'm here to help you find the perfect products. You can ask me about our electronics, search for specific items, or get recommendations. What are you looking for today?"
    };
  }

  if (messageLower.includes('iphone') && (messageLower.includes('good') || messageLower.includes('recommend') || messageLower.includes('best'))) {
    const iphones = products.filter(p => p.name.toLowerCase().includes('iphone'));
    return {
      content: "Yes, iPhones are excellent smartphones! They're known for their premium build quality, excellent cameras, long software support, and seamless ecosystem integration. Here are the iPhones we have available:",
      products: iphones
    };
  }

  if (messageLower.includes('iphone')) {
    const iphones = products.filter(p => p.name.toLowerCase().includes('iphone'));
    if (iphones.length > 0) {
      return {
        content: "Here are the iPhones we have in stock:",
        products: iphones
      };
    }
  }

  if (messageLower.includes('photography') || messageLower.includes('camera') || messageLower.includes('photo')) {
    const cameraPhones = products.filter(p => 
      p.category.toLowerCase() === 'smartphones' && 
      (p.description.toLowerCase().includes('camera') || 
       p.features.some(f => f.toLowerCase().includes('camera')))
    ).slice(0, 3);
    
    return {
      content: "For photography, I'd recommend these smartphones with excellent camera systems:",
      products: cameraPhones
    };
  }

  if (messageLower.includes('search') || messageLower.includes('find') || messageLower.includes('looking for') || messageLower.includes('show me')) {
    const searchResults = searchProducts(message);
    if (searchResults.length > 0) {
      return {
        content: `I found ${searchResults.length} products that might interest you:`,
        products: searchResults.slice(0, 5)
      };
    } else {
      return {
        content: "I couldn't find any products matching your search. Could you try different keywords? I have electronics like laptops, smartphones, headphones, and more!"
      };
    }
  }

  if (messageLower.includes('laptop') || messageLower.includes('computer')) {
    const laptops = products.filter(p => p.category.toLowerCase() === 'laptops').slice(0, 3);
    return {
      content: "Here are some great laptop options:",
      products: laptops
    };
  }

  if (messageLower.includes('phone') || messageLower.includes('smartphone')) {
    const phones = products.filter(p => p.category.toLowerCase() === 'smartphones').slice(0, 3);
    return {
      content: "Check out these popular smartphones:",
      products: phones
    };
  }

  if (messageLower.includes('headphone') || messageLower.includes('audio')) {
    const headphones = products.filter(p => p.category.toLowerCase() === 'headphones').slice(0, 3);
    return {
      content: "Here are some excellent headphone options:",
      products: headphones
    };
  }

  if (messageLower.includes('price') || messageLower.includes('cost') || messageLower.includes('cheap') || messageLower.includes('budget')) {
    const budgetProducts = products
      .filter(p => p.price < 500)
      .sort((a, b) => a.price - b.price)
      .slice(0, 3);
    return {
      content: "Here are some budget-friendly options:",
      products: budgetProducts
    };
  }

  if (messageLower.includes('gaming') || messageLower.includes('game')) {
    const gamingProducts = products.filter(p => 
      p.name.toLowerCase().includes('gaming') || 
      p.description.toLowerCase().includes('gaming') ||
      p.name.toLowerCase().includes('rog') ||
      p.name.toLowerCase().includes('predator')
    ).slice(0, 3);
    
    if (gamingProducts.length > 0) {
      return {
        content: "Here are some great gaming products:",
        products: gamingProducts
      };
    }
  }

  if (messageLower.includes('compare') || messageLower.includes('vs') || messageLower.includes('versus')) {
    const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 3);
    return {
      content: "Here are some products you can compare:",
      products: randomProducts
    };
  }

  if (messageLower.includes('help') || messageLower.includes('what can you do')) {
    return {
      content: "I can help you with:\n• Finding products by name or category\n• Getting price comparisons\n• Product recommendations\n• Technical specifications\n• Adding items to your cart\n\nJust tell me what you're looking for!"
    };
  }

  if (messageLower.includes('more')) {
    const moreProducts = products.sort(() => 0.5 - Math.random()).slice(0, 4);
    return {
      content: "Here are some more products you might like:",
      products: moreProducts
    };
  }


  const searchResults = searchProducts(message);
  if (searchResults.length > 0) {
    return {
      content: "Based on your message, here are some products that might interest you:",
      products: searchResults.slice(0, 3)
    };
  }


  const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 3);
  return {
    content: "I'm not sure I understand exactly what you're looking for, but here are some popular products you might like:",
    products: randomProducts
  };
}

function searchProducts(message) {
  const keywords = message.toLowerCase().split(' ');
  const searchTerms = keywords.filter(word => 
    !['search', 'find', 'looking', 'for', 'want', 'need', 'show', 'me', 'a', 'an', 'the', 'is', 'are', 'more'].includes(word)
  );

  return products.filter(product => {
    const productText = `${product.name} ${product.description} ${product.category} ${product.features.join(' ')}`.toLowerCase();
    return searchTerms.some(term => productText.includes(term));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});