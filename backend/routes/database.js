const express = require('express');
const { User, Pill, PillIntake, Cycle, CycleDay } = require('../models');
const router = express.Router();

/**
 * Database Statistics Endpoints
 */

// Get count of all users
router.get('/users/count', async (req, res) => {
  try {
    const count = await User.count();
    res.json({ count });
  } catch (error) {
    console.error('Error getting user count:', error);
    res.status(500).json({ error: 'Failed to get user count' });
  }
});

// Get count of all pills
router.get('/pills/count', async (req, res) => {
  try {
    const count = await Pill.count();
    res.json({ count });
  } catch (error) {
    console.error('Error getting pill count:', error);
    res.status(500).json({ error: 'Failed to get pill count' });
  }
});

// Get count of all pill intakes
router.get('/intakes/count', async (req, res) => {
  try {
    const count = await PillIntake.count();
    res.json({ count });
  } catch (error) {
    console.error('Error getting intake count:', error);
    res.status(500).json({ error: 'Failed to get intake count' });
  }
});

// Get count of all cycles
router.get('/cycles/count', async (req, res) => {
  try {
    const count = await Cycle.count();
    res.json({ count });
  } catch (error) {
    console.error('Error getting cycle count:', error);
    res.status(500).json({ error: 'Failed to get cycle count' });
  }
});

// Get count of all cycle days
router.get('/cycle-days/count', async (req, res) => {
  try {
    const count = await CycleDay.count();
    res.json({ count });
  } catch (error) {
    console.error('Error getting cycle day count:', error);
    res.status(500).json({ error: 'Failed to get cycle day count' });
  }
});

/**
 * Data Viewing Endpoints
 */

// Get all users (limited data for privacy)
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'createdAt', 'isEmailVerified', 'isActive'],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      data: users.rows,
      total: users.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(users.count / limit)
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get all pills
router.get('/pills', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const pills = await Pill.findAndCountAll({
      include: [{
        model: User,
        attributes: ['firstName', 'lastName', 'email']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      data: pills.rows,
      total: pills.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(pills.count / limit)
    });
  } catch (error) {
    console.error('Error getting pills:', error);
    res.status(500).json({ error: 'Failed to get pills' });
  }
});

// Get all pill intakes
router.get('/pill_intakes', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const intakes = await PillIntake.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: Pill,
          attributes: ['name', 'brand', 'type']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['scheduledDate', 'DESC'], ['scheduledTime', 'DESC']]
    });

    res.json({
      data: intakes.rows,
      total: intakes.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(intakes.count / limit)
    });
  } catch (error) {
    console.error('Error getting pill intakes:', error);
    res.status(500).json({ error: 'Failed to get pill intakes' });
  }
});

// Get all cycles
router.get('/cycles', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const cycles = await Cycle.findAndCountAll({
      include: [{
        model: User,
        attributes: ['firstName', 'lastName', 'email']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['startDate', 'DESC']]
    });

    res.json({
      data: cycles.rows,
      total: cycles.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(cycles.count / limit)
    });
  } catch (error) {
    console.error('Error getting cycles:', error);
    res.status(500).json({ error: 'Failed to get cycles' });
  }
});

/**
 * Database Management Endpoints
 */

// Get database schema information
router.get('/schema', async (req, res) => {
  try {
    const { sequelize } = require('../config/database');
    
    const tables = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = ?",
      {
        replacements: [process.env.DB_NAME || 'loveyou'],
        type: sequelize.QueryTypes.SELECT
      }
    );

    const schema = {};
    
    for (const table of tables) {
      const columns = await sequelize.query(
        `SELECT column_name, data_type, is_nullable, column_default 
         FROM information_schema.columns 
         WHERE table_schema = ? AND table_name = ?`,
        {
          replacements: [process.env.DB_NAME || 'loveyou', table.table_name],
          type: sequelize.QueryTypes.SELECT
        }
      );
      
      schema[table.table_name] = columns;
    }

    res.json({ schema });
  } catch (error) {
    console.error('Error getting schema:', error);
    res.status(500).json({ error: 'Failed to get database schema' });
  }
});

// Export data as CSV
router.get('/export/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const { sequelize } = require('../config/database');
    
    // Security: only allow specific tables
    const allowedTables = ['users', 'pills', 'pill_intakes', 'cycles', 'cycle_days'];
    if (!allowedTables.includes(table)) {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    const data = await sequelize.query(`SELECT * FROM ${table}`, {
      type: sequelize.QueryTypes.SELECT
    });

    if (data.length === 0) {
      return res.json({ message: 'No data found' });
    }

    // Convert to CSV
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          typeof row[header] === 'string' ? `"${row[header]}"` : row[header]
        ).join(',')
      )
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${table}_export.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Database health check
router.get('/health', async (req, res) => {
  try {
    const { sequelize } = require('../config/database');
    await sequelize.authenticate();
    
    const stats = {
      users: await User.count(),
      pills: await Pill.count(),
      intakes: await PillIntake.count(),
      cycles: await Cycle.count(),
      cycledays: await CycleDay.count()
    };

    res.json({
      status: 'healthy',
      database: 'connected',
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
