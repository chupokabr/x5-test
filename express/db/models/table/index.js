const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TableSchema = new Schema({
  user_id: Number,
  id: Number,
  table_name: String,
  create_date: String,
  update_at: String,
  tableData: Object
})

module.exports = mongoose.models.TableData || mongoose.model('TableData', TableSchema);
