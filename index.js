const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

// model
const Contact = sequelize.define("Contact", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "First name cannot be empty",
      },
      notNull: {
        msg: "First name is required",
      },
      is: {
        args: /^[a-zA-Z\s]*$/,
        msg: "First name can only contain letters and spaces",
      },
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Last name cannot be empty",
      },
      notNull: {
        msg: "Last name is required",
      },
      is: {
        args: /^[a-zA-Z\s]*$/,
        msg: "Last name can only contain letters and spaces",
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: "This email is already registered",
    },
    validate: {
      notEmpty: {
        msg: "Email cannot be empty",
      },
      isEmail: {
        msg: "Please enter a valid email address",
      },
      notNull: {
        msg: "Email is required",
      },
    },
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: {
      msg: "This phone number is already registered",
    },
    validate: {
      notEmpty: {
        msg: "Phone number cannot be empty",
      },
      notNull: {
        msg: "Phone number is required",
      },
      isNumeric: {
        msg: "Phone number should only contain numbers",
      },
      is: {
        args: /^[0-9\-\+]{9,15}$/i,
        msg: "Phone number format is invalid. It should be between 9 and 15 digits and may include '-' or '+'",
      },
    },
  },
  additionalInfo: {
    type: DataTypes.TEXT,
    validate: {
      len: {
        args: [0, 5000],
        msg: "Additional information must not exceed 5000 characters",
      },
    },
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Sync the model with the database
sequelize.sync();

// Routes
// Create a contact
app.post("/api/contacts", async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// List all contacts
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a contact
app.put("/api/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (contact) {
      await contact.update(req.body);
      res.json(contact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a contact
app.delete("/api/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (contact) {
      await contact.destroy();
      res.json({ message: "Contact deleted" });
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
