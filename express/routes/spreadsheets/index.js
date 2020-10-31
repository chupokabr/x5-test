const {Router} = require('express')
const router = Router()

const TableData = require('../../db/models/table')

//Список талиц
router.get('/api/spreadsheets', (req, res) => {

  if (!req.session.auth) {
    res.json({
      status: 'error',
      message: 'Вы не авторизованы'
    })

    return false;
  }

  const userId = req.session.user.id

  TableData.find({
      user_id: userId
    },
    '_id user_id table_name create_date update_at',
    (error, resultTable) => {
      res.json({
        status: 'ok',
        message: '',
        data: resultTable
      })
    })
})

//Одна таблица
router.get('/api/spreadsheets/:id', (req, res) => {
  if (!req.session.auth) {
    res.json({
      status: 'error',
      message: 'Вы не авторизованы'
    })
    return false;
  }

  const userId = req.session.user.id

  const query = TableData.findOne({
    _id: req.params.id,
    user_id: userId
  })

  query.exec((err, resultTable) => {
    if (err) {
      res.json({
        status: 'error',
        message: 'Таблицы на существует'
      })

      return false;
    }

    res.json({
      status: 'ok',
      data: resultTable
    })
  })
})

// Создание таблицы
router.post('/api/spreadsheets', (req, res) => {

  if (!req.session.auth) {
    res.json({
      status: 'error',
      message: 'Вы не авторизованы'
    })
    return false;
  }

  const userId = req.session.user.id

  if (!req.body.tableName) {
    res.json({
      status: 'error',
      message: 'Пустое имя'
    })

    return false;
  }

  let table = new TableData({
    user_id: userId,
    table_name: req.body.tableName,
    create_date: new Date(),
    update_at: new Date(),
    tableData: {}
  })

  table.save((err, newTable) => {
    if (err) {
      res.json({
        status: 'error',
        message: err
      })
      return false;
    }

    res.json({
      status: 'ok',
      message: 'Таблица добавлена',
      data: {
        _id: newTable._id
      }
    })
  })
})

// Обновление данных таблицы
router.put('/api/spreadsheets/:id', (req, res) => {
  if (!req.session.auth) {
    res.json({
      status: 'error',
      message: 'Вы не авторизованы'
    })
    return false;
  }

  const userId = req.session.user.id

  const query = TableData.findOneAndUpdate({
      user_id: userId,
      _id: req.params.id
    },
    {
      $set: {
        update_at: new Date(),
        tableData: req.body.tableData
      }
    });

  query.exec((err, resultDB) => {
    if (err) {
      res.json({
        status: 'error',
        message: 'Ошибка при редактировании таблицы'
      })

      return false;
    }

    res.json({
      status: 'ok'
    })
  });
})

//Изменение названия таблицы
router.put('/api/spreadsheets/name/:id', (req, res) => {
  if (!req.session.auth) {
    res.json({
      status: 'error',
      message: 'Вы не авторизованы'
    })
    return false;
  }

  const userId = req.session.user.id
  const tableName = req.body.tableName

  if (!tableName) {
    res.json({
      status: 'error',
      message: 'Пустое имя'
    })

    return false;
  }

  const query = TableData.findOneAndUpdate({
      user_id: userId,
      _id: req.params.id
    },
    {
      $set: {
        update_at: new Date(),
        table_name: tableName
      }
    });

  query.exec((err, writeOpResult) => {
    if (err) {
      res.json({
        status: 'error',
        message: 'Ошибка при редактировании имени таблицы'
      })
      return false;
    }

    res.json({
      status: 'ok'
    })
  })

})

//Удаление таблицы
router.delete('/api/spreadsheets/:id', (req, res) => {
  if (!req.session.auth) {
    res.json({
      status: 'error',
      message: 'Вы не авторизованы'
    })
    return false;
  }

  const userId = req.session.user.id

  const queryTable = TableData.findOneAndRemove({
    user_id: userId,
    _id: req.params.id
  });

  queryTable.exec((err, result) => {
    if (err) {
      res.json({
        status: 'error',
        message: 'Ошибка при удалении'
      })

      return false;
    }

    res.json({
      status: 'ok',
      message: 'Таблица удалена'
    })

  });
})

module.exports = router
