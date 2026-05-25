const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isFallbackMode = false;
const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure local data directory exists for fallback mode
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Custom mock Mongoose Model implementation for local persistent JSON files
class LocalModel {
  constructor(modelName) {
    this.modelName = modelName.toLowerCase();
    this.filePath = path.join(DATA_DIR, `${this.modelName}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  _read() {
    try {
      const content = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(content);
    } catch (e) {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  async find(query = {}) {
    let items = this._read();
    return items.filter(item => {
      for (let key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          // simple check for nested or exact match
          return false;
        }
      }
      return true;
    });
  }

  async findOne(query = {}) {
    const items = await this.find(query);
    return items[0] || null;
  }

  async findById(id) {
    const items = this._read();
    return items.find(item => item._id === id || item.id === id) || null;
  }

  async create(data) {
    const items = this._read();
    const newItem = {
      _id: Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    items.push(newItem);
    this._write(items);
    return newItem;
  }

  async findByIdAndUpdate(id, updateData, options = { new: true }) {
    const items = this._read();
    const index = items.findIndex(item => item._id === id);
    if (index === -1) return null;

    // strip mongoose operators like $set or $push if simple fallback is used
    const cleanUpdate = updateData.$set ? { ...updateData.$set } : { ...updateData };
    
    items[index] = {
      ...items[index],
      ...cleanUpdate,
      updatedAt: new Date().toISOString()
    };
    this._write(items);
    return items[index];
  }

  async findByIdAndDelete(id) {
    const items = this._read();
    const index = items.findIndex(item => item._id === id);
    if (index === -1) return null;
    const deleted = items[index];
    items.splice(index, 1);
    this._write(items);
    return deleted;
  }

  async countDocuments(query = {}) {
    const items = await this.find(query);
    return items.length;
  }
}

// Function to establish connection or select fallback
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.log('⚠️  No MONGO_URI environment variable found.');
    console.log('📁 Activating persistent file-backed local fallback database mode in backend/data/...');
    isFallbackMode = true;
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('🚀 Connected to live MongoDB Database successfully.');
    isFallbackMode = false;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.log('📁 Falling back to persistent file-backed database mode...');
    isFallbackMode = true;
  }
};

// Unified model exporter helper
const getModel = (modelName, mongooseSchema) => {
  return new Proxy({}, {
    get(target, prop) {
      if (isFallbackMode) {
        const localInstance = new LocalModel(modelName);
        return localInstance[prop]?.bind(localInstance);
      } else {
        // Live MongoDB mongoose mode
        const LiveModel = mongoose.models[modelName] || mongoose.model(modelName, mongooseSchema);
        return LiveModel[prop]?.bind(LiveModel);
      }
    }
  });
};

module.exports = {
  connectDB,
  getModel,
  isFallback: () => isFallbackMode
};
