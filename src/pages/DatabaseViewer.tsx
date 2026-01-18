import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Users, 
  Pill, 
  Calendar, 
  Activity,
  RefreshCw,
  Search,
  Filter,
  Download
} from 'lucide-react';
import Button from '../components/Button';

interface DatabaseStats {
  users: number;
  pills: number;
  intakes: number;
  cycles: number;
  cycledays: number;
}

interface TableData {
  name: string;
  count: number;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
}

const DatabaseViewer = () => {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>('users');
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const tables: TableData[] = [
    {
      name: 'users',
      count: stats?.users || 0,
      icon: Users,
      color: 'text-pink-600',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      name: 'pills',
      count: stats?.pills || 0,
      icon: Pill,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'pill_intakes',
      count: stats?.intakes || 0,
      icon: Activity,
      color: 'text-rose-600',
      gradient: 'from-rose-500 to-purple-500'
    },
    {
      name: 'cycles',
      count: stats?.cycles || 0,
      icon: Calendar,
      color: 'text-violet-600',
      gradient: 'from-violet-500 to-rose-500'
    }
  ];

  // Fetch database statistics
  const fetchStats = async () => {
    try {
      setLoading(true);
      // Use correct API endpoints with database prefix
      const responses = await Promise.all([
        fetch('http://localhost:3001/api/database/users/count'),
        fetch('http://localhost:3001/api/database/pills/count'),
        fetch('http://localhost:3001/api/database/intakes/count'),
        fetch('http://localhost:3001/api/database/cycles/count'),
        fetch('http://localhost:3001/api/database/cycle-days/count')
      ]);

      const [users, pills, intakes, cycles, cycledays] = await Promise.all(
        responses.map(r => r.json())
      );

      setStats({
        users: users.count || 0,
        pills: pills.count || 0,
        intakes: intakes.count || 0,
        cycles: cycles.count || 0,
        cycledays: cycledays.count || 0
      });
    } catch (error) {
      console.error('Error fetching database stats:', error);
      // Mock data for demo
      setStats({
        users: 24,
        pills: 12,
        intakes: 156,
        cycles: 8,
        cycledays: 240
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch table data
  const fetchTableData = async (tableName: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/database/${tableName}`);
      const data = await response.json();
      setTableData(data.data || []);
    } catch (error) {
      console.error(`Error fetching ${tableName} data:`, error);
      // Mock data for demo
      setTableData(generateMockData(tableName));
    } finally {
      setLoading(false);
    }
  };

  // Generate mock data for demonstration
  const generateMockData = (tableName: string) => {
    switch (tableName) {
      case 'users':
        return [
          {
            id: '1',
            email: 'user1@example.com',
            firstName: 'Alice',
            lastName: 'Johnson',
            createdAt: '2024-01-15'
          },
          {
            id: '2',
            email: 'user2@example.com',
            firstName: 'Emma',
            lastName: 'Davis',
            createdAt: '2024-02-20'
          }
        ];
      case 'pills':
        return [
          {
            id: '1',
            name: 'Yasmin',
            brand: 'Bayer',
            type: 'combination',
            isActive: true
          }
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchTableData(selectedTable);
  }, [selectedTable]);

  const filteredData = tableData.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Database Viewer</h1>
              <p className="text-gray-600">View and manage your LoveYou database</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={fetchStats}
              variant="secondary"
              className="glass-card"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" className="glass-card">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {tables.map((table, index) => (
            <motion.div
              key={table.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-6 rounded-3xl cursor-pointer transition-all duration-300 ${
                selectedTable === table.name
                  ? 'ring-2 ring-pink-400 shadow-lg'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedTable(table.name)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${table.gradient} rounded-2xl flex items-center justify-center`}>
                  <table.icon className="w-6 h-6 text-white" />
                </div>
                {loading && <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {table.count.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {table.name.replace('_', ' ')}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-3xl mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 capitalize">
              {selectedTable.replace('_', ' ')} Data
            </h2>
            
            <div className="flex gap-3">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-3xl overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-pink-500" />
              <p className="text-gray-600">Loading data...</p>
            </div>
          ) : filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                  <tr>
                    {Object.keys(filteredData[0]).map((key) => (
                      <th key={key} className="px-6 py-4 text-left font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white/50 backdrop-blur-sm">
                  {filteredData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-pink-50/50">
                      {Object.values(row).map((value: any, cellIndex) => (
                        <td key={cellIndex} className="px-6 py-4 text-gray-700">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No data found for {selectedTable}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DatabaseViewer;
